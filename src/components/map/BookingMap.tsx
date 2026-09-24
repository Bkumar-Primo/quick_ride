import { Ionicons } from '@expo/vector-icons';
import { getRhumbLineBearing } from 'geolib';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';
import { Colors } from '../../constants/colors';
import {
  CP67_MALL_DESTINATION,
  DEMO_DRIVER_ROUTE,
  FINVASIA_DRIVER_START,
  SM_HEIGHTS_PICKUP,
} from '../../data/mockLocations';
import { useRideStore } from '../../store/rideStore';
import { interpolatePath, trimPolyline } from '../../utils/mapUtils';
import { MapVehicleMarker, mapIconForVehicle } from './MapVehicleMarker';

export type BookingMapMode =
  | 'pickup'
  | 'search'
  | 'preview'
  | 'choose'
  | 'confirm'
  | 'searching'
  | 'assigned'
  | 'arriving'
  | 'arrived'
  | 'inprogress'
  | 'completed';

interface BookingMapProps {
  mode: BookingMapMode;
}

export const BookingMap: React.FC<BookingMapProps> = ({ mode }) => {
  const mapRef = useRef<MapView | null>(null);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const selectedIcon = mapIconForVehicle(selectedVehicle);

  // Pre-interpolated turn-by-turn road paths for simulation
  const driverToPickupPath = useMemo(
    () => interpolatePath(DEMO_DRIVER_ROUTE.driverToPickupWaypoints, 5),
    [],
  );
  const pickupToDestPath = useMemo(
    () => interpolatePath(DEMO_DRIVER_ROUTE.pickupToDestWaypoints, 3),
    [],
  );

  // State for driver position, bearing, step index, and map region
  const [driverStepIndex, setDriverStepIndex] = useState<number>(0);
  const [isFollowingDriver, setIsFollowingDriver] = useState<boolean>(true);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: SM_HEIGHTS_PICKUP.latitude,
    longitude: SM_HEIGHTS_PICKUP.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

  // Stage definitions
  const isSearchingDriver = mode === 'searching';
  const isEnRouteToPickup = ['assigned', 'arriving'].includes(mode);
  const isArrivedAtPickup = mode === 'arrived';
  const isInProgress = mode === 'inprogress';

  // Driver is actively moving only when en route to pickup or en route to destination
  const isDriverMoving = isEnRouteToPickup || isInProgress;

  const isRideConfirmed = ['assigned', 'arriving', 'arrived', 'inprogress', 'completed'].includes(
    mode,
  );
  // Show polyline ONLY after ride confirmation (when driver is assigned)
  const showRoute = isRideConfirmed;

  const fullActivePath = useMemo(() => {
    if (isEnRouteToPickup || isSearchingDriver) return driverToPickupPath;
    if (isInProgress || isArrivedAtPickup) return pickupToDestPath;
    return pickupToDestPath; // default route preview
  }, [
    isEnRouteToPickup,
    isSearchingDriver,
    isInProgress,
    isArrivedAtPickup,
    driverToPickupPath,
    pickupToDestPath,
  ]);

  // Dynamic interval per step to ensure exact timing (15s to pickup, 30s to dest)
  const stepIntervalMs = useMemo(() => {
    const totalSteps = fullActivePath.length;
    if (totalSteps <= 1) return 200;
    const targetDurationMs = isInProgress ? 30000 : 15000;
    return Math.max(30, Math.floor(targetDurationMs / totalSteps));
  }, [isInProgress, fullActivePath.length]);

  // Reset driver index on stage change (preserve progress when moving from assigned -> arriving)
  const prevModeRef = useRef<BookingMapMode>(mode);

  useEffect(() => {
    const prevMode = prevModeRef.current;
    prevModeRef.current = mode;

    const wasEnRoute = ['assigned', 'arriving'].includes(prevMode);
    const isNowEnRoute = ['assigned', 'arriving'].includes(mode);
    if (wasEnRoute && isNowEnRoute) return;

    setDriverStepIndex(0);
  }, [mode]);

  // Driver location simulation interval tick (ONLY tick when driver is actively moving)
  useEffect(() => {
    if (!isDriverMoving) return;

    const totalSteps = fullActivePath.length;
    if (totalSteps === 0) return;

    const interval = setInterval(() => {
      setDriverStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          clearInterval(interval);
          return totalSteps - 1;
        }
        return prev + 1;
      });
    }, stepIntervalMs);

    return () => clearInterval(interval);
  }, [isDriverMoving, fullActivePath, stepIntervalMs]);

  // Current driver GPS & rhumb line bearing calculation using geolib
  const driverPos = useMemo(() => {
    if (isSearchingDriver) return FINVASIA_DRIVER_START;
    if (isArrivedAtPickup) {
      // Park bike slightly before pickup point on approach road so it doesn't overlap pickup marker pin
      const len = driverToPickupPath.length;
      return len > 4 ? driverToPickupPath[len - 4] : FINVASIA_DRIVER_START;
    }
    if (!fullActivePath || fullActivePath.length === 0) {
      return isEnRouteToPickup ? FINVASIA_DRIVER_START : SM_HEIGHTS_PICKUP;
    }
    const idx = Math.min(driverStepIndex, fullActivePath.length - 1);
    return fullActivePath[idx];
  }, [
    fullActivePath,
    driverStepIndex,
    isEnRouteToPickup,
    isSearchingDriver,
    isArrivedAtPickup,
    driverToPickupPath,
  ]);

  const driverBearing = useMemo(() => {
    if (isArrivedAtPickup) {
      const len = driverToPickupPath.length;
      if (len > 4) {
        const from = driverToPickupPath[len - 5];
        const to = driverToPickupPath[len - 4];
        return (
          getRhumbLineBearing(
            { latitude: from.latitude, longitude: from.longitude },
            { latitude: to.latitude, longitude: to.longitude },
          ) + 270
        );
      }
    }
    if (!fullActivePath || fullActivePath.length < 2) return 45;
    const idx = Math.min(driverStepIndex, fullActivePath.length - 1);
    const prevIdx = Math.max(0, idx - 1);
    const nextIdx = Math.min(fullActivePath.length - 1, idx + 1);

    const from = fullActivePath[prevIdx];
    const to = fullActivePath[nextIdx];

    return (
      getRhumbLineBearing(
        { latitude: from.latitude, longitude: from.longitude },
        { latitude: to.latitude, longitude: to.longitude },
      ) + 270
    );
  }, [fullActivePath, driverStepIndex, isArrivedAtPickup, driverToPickupPath]);

  // Rapido-style polyline trimming: remove travelled portion
  const trimmedRouteCoords = useMemo(() => {
    if (!showRoute) return [];
    if (isArrivedAtPickup || mode === 'completed') {
      // After reaching pickup or destination, remove polyline
      return [];
    }
    if (isDriverMoving) {
      return trimPolyline(fullActivePath, driverStepIndex, driverPos);
    }
    return fullActivePath;
  }, [
    showRoute,
    isArrivedAtPickup,
    mode,
    isDriverMoving,
    fullActivePath,
    driverStepIndex,
    driverPos,
  ]);

  // Adjust mapRegion dynamically as driver location changes with calculated deltas
  useEffect(() => {
    if (!isFollowingDriver) return;

    if (isEnRouteToPickup || isSearchingDriver) {
      // Dynamic region centered between driver and pickup location
      const target = SM_HEIGHTS_PICKUP;
      const midLat = (driverPos.latitude + target.latitude) / 2;
      const midLng = (driverPos.longitude + target.longitude) / 2;
      const latDelta = Math.max(Math.abs(driverPos.latitude - target.latitude) * 1.6, 0.006);
      const lngDelta = Math.max(Math.abs(driverPos.longitude - target.longitude) * 1.6, 0.006);

      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
    } else if (isInProgress || isArrivedAtPickup) {
      // Dynamic region centered between driver and destination location
      const target = CP67_MALL_DESTINATION;
      const midLat = (driverPos.latitude + target.latitude) / 2;
      const midLng = (driverPos.longitude + target.longitude) / 2;
      const latDelta = Math.max(Math.abs(driverPos.latitude - target.latitude) * 1.6, 0.006);
      const lngDelta = Math.max(Math.abs(driverPos.longitude - target.longitude) * 1.6, 0.006);

      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
    }
  }, [
    driverPos.latitude,
    driverPos.longitude,
    isFollowingDriver,
    isEnRouteToPickup,
    isSearchingDriver,
    isInProgress,
    isArrivedAtPickup,
  ]);

  // Recenter map region on bounds or initial location
  const handleRecenter = useCallback(() => {
    setIsFollowingDriver(true);

    if (showRoute) {
      const targetDest = isEnRouteToPickup ? SM_HEIGHTS_PICKUP : CP67_MALL_DESTINATION;
      const allLocations = [
        [SM_HEIGHTS_PICKUP.latitude, SM_HEIGHTS_PICKUP.longitude],
        [targetDest.latitude, targetDest.longitude],
        [driverPos.latitude, driverPos.longitude],
      ];

      const lats = allLocations.map((loc) => loc[0]);
      const lngs = allLocations.map((loc) => loc[1]);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const latitudeDelta = Math.max((maxLat - minLat) * 1.6, 0.008);
      const longitudeDelta = Math.max((maxLng - minLng) * 1.6, 0.008);

      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta,
        longitudeDelta,
      });
    } else {
      setMapRegion({
        latitude: SM_HEIGHTS_PICKUP.latitude,
        longitude: SM_HEIGHTS_PICKUP.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });
    }
  }, [showRoute, isEnRouteToPickup, driverPos]);

  useEffect(() => {
    handleRecenter();
  }, [mode, handleRecenter]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(r) => {
          // preserve user interaction
        }}
        showsUserLocation={true}
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
        onPanDrag={() => setIsFollowingDriver(false)}
      >
        {showRoute && trimmedRouteCoords.length > 1 && (
          <>
            <Polyline
              coordinates={trimmedRouteCoords}
              strokeColor="rgba(255, 85, 0, 0.25)"
              strokeWidth={10}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              coordinates={trimmedRouteCoords}
              strokeColor="#FF5500"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}
        <Marker
          coordinate={{
            latitude: SM_HEIGHTS_PICKUP.latitude,
            longitude: SM_HEIGHTS_PICKUP.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerContainer}>
            <View style={styles.pickupPill}>
              <Text style={styles.pickupPillText}>Pickup • SM Heights</Text>
            </View>
            <View style={styles.pickupPinDot}>
              <View style={styles.innerPinDot} />
            </View>
          </View>
        </Marker>
        {(showRoute || mode === 'inprogress') && (
          <Marker
            coordinate={{
              latitude: CP67_MALL_DESTINATION.latitude,
              longitude: CP67_MALL_DESTINATION.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.destPill}>
                <Text style={styles.destPillText}>Drop • CP 67 Mall</Text>
              </View>
              <View style={styles.destPinDot} />
            </View>
          </Marker>
        )}
        {(isRideConfirmed ||
          mode === 'assigned' ||
          mode === 'arriving' ||
          mode === 'arrived' ||
          mode === 'inprogress') && (
          <Marker
            coordinate={driverPos}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={driverBearing}
          >
            <MapVehicleMarker icon={selectedIcon} bearing={driverBearing} scale={1.5} />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E8EEF2',
  },
  map: {
    ...StyleSheet.absoluteFill,
    height: '65%',
    width: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    right: 16,
    top: 140,
    zIndex: 20,
  },
  recenterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },
  recenterBtnActive: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  markerContainer: {
    alignItems: 'center',
  },
  pickupPill: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pickupPillText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  pickupPinDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  innerPinDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.white,
  },
  destPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  destPillText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  destPinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
});

export default BookingMap;
