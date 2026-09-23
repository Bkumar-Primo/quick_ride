import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import {
  CP67_MALL_DESTINATION,
  DEMO_DRIVER_ROUTE,
  FINVASIA_DRIVER_START,
  SM_HEIGHTS_PICKUP,
} from '../../data/mockLocations';
import type { LocationPoint } from '../../types';
import { calculateBearing, interpolatePath, trimPolyline } from '../../utils/mapUtils';
import { MapVehicleMarker } from './MapVehicleMarker';

interface SimulatedMapProps {
  height?: number | string;
  showNearbyDrivers?: boolean;
  showRoute?: boolean;
  driverEnRoute?: boolean;
  progressPercent?: number; // 0 to 100
  pickupLocation?: LocationPoint;
  destinationLocation?: LocationPoint;
  onPressMap?: () => void;
  interactive?: boolean;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  height = 360,
  showNearbyDrivers = true,
  showRoute = false,
  driverEnRoute = false,
  progressPercent = 35,
  pickupLocation = SM_HEIGHTS_PICKUP,
  destinationLocation = CP67_MALL_DESTINATION,
  onPressMap,
}) => {
  const mapRef = useRef<MapView | null>(null);

  const fullPath = useMemo(() => interpolatePath(DEMO_DRIVER_ROUTE.pickupToDestWaypoints, 50), []);

  const stepIndex = Math.floor(
    Math.min(Math.max(progressPercent / 100, 0), 1) * (fullPath.length - 1),
  );

  const carPos = fullPath[stepIndex] || fullPath[0];
  const prevPos = fullPath[Math.max(0, stepIndex - 1)];
  const nextPos = fullPath[Math.min(fullPath.length - 1, stepIndex + 1)];
  const bearing = calculateBearing(prevPos, nextPos);

  const trimmedCoords = useMemo(
    () => trimPolyline(fullPath, stepIndex, carPos),
    [fullPath, stepIndex, carPos],
  );

  return (
    <View style={[styles.container, { height: typeof height === 'number' ? height : 360 }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: (pickupLocation.latitude + destinationLocation.latitude) / 2,
          longitude: (pickupLocation.longitude + destinationLocation.longitude) / 2,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        }}
        showsCompass={false}
        showsUserLocation={true}
      >
        {/* Polyline trimmed dynamically */}
        {showRoute && trimmedCoords.length > 1 && (
          <Polyline
            coordinates={trimmedCoords}
            strokeColor="#FF5500"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Pickup Marker */}
        <Marker
          coordinate={{
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerBadge}>
            <Text style={styles.badgeText}>Pickup</Text>
          </View>
        </Marker>

        {/* Destination Marker */}
        {showRoute && (
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.markerBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>Dropoff</Text>
            </View>
          </Marker>
        )}

        {/* Driver Marker */}
        {driverEnRoute && (
          <Marker coordinate={carPos} anchor={{ x: 0.5, y: 0.5 }} flat={true} rotation={bearing}>
            <MapVehicleMarker icon="cabEconomy" bearing={bearing} scale={1.1} />
          </Marker>
        )}
      </MapView>

      {/* Floating Controls Overlay */}
      <View style={styles.floatingControls}>
        <View style={styles.liveTrafficBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Fast traffic</Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={onPressMap} style={styles.recenterButton}>
          <Ionicons name="locate" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  floatingControls: {
    position: 'absolute',
    top: Layout.spacing.lg,
    right: Layout.spacing.lg,
    left: Layout.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  liveTrafficBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadows.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray700,
  },
  recenterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  markerBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default SimulatedMap;
