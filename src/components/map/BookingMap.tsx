import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import {
  GEOAPIFY_APPROACH_ROADS,
  GEOAPIFY_TRIP_ROADS,
  getInterpolatedGpsPoint,
} from '../../services/routingService';
import { useRideStore } from '../../store/rideStore';
import type { RideGroup } from '../../types';
import { type MapVehicleIcon, MapVehicleLayer, mapIconForVehicle } from './MapVehicleMarker';
import { StaticMapBackground } from './StaticMapBackground';

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

const MIXED_NEARBY: { icon: MapVehicleIcon; x: number; y: number; flip?: boolean }[] = [
  { icon: 'bikeLite', x: 30, y: 29 },
  { icon: 'cabEconomy', x: 70, y: 24, flip: true },
  { icon: 'auto', x: 75, y: 46 },
  { icon: 'bikePlus', x: 37, y: 58, flip: true },
  { icon: 'cabSuv', x: 20, y: 44 },
  { icon: 'cabPremium', x: 52, y: 18 },
];

const GROUP_NEARBY: Record<
  RideGroup,
  { icon: MapVehicleIcon; x: number; y: number; flip?: boolean }[]
> = {
  bike: [
    { icon: 'bikeLite', x: 30, y: 29 },
    { icon: 'bikePlus', x: 70, y: 24, flip: true },
    { icon: 'bikeLite', x: 75, y: 46, flip: true },
    { icon: 'bikePlus', x: 37, y: 58 },
    { icon: 'bikeLite', x: 20, y: 44, flip: true },
  ],
  auto: [
    { icon: 'auto', x: 30, y: 29 },
    { icon: 'auto', x: 70, y: 24, flip: true },
    { icon: 'auto', x: 75, y: 46 },
    { icon: 'auto', x: 37, y: 58, flip: true },
  ],
  cab: [
    { icon: 'cabEconomy', x: 30, y: 29 },
    { icon: 'cabPremium', x: 70, y: 24, flip: true },
    { icon: 'cabSuv', x: 75, y: 46 },
    { icon: 'cabEconomy', x: 37, y: 58, flip: true },
    { icon: 'cabPremium', x: 20, y: 44 },
  ],
};

const toPercent = (x: number, y: number) => ({
  x: (x / 400) * 100,
  y: (y / 520) * 100,
});

/**
 * Projects Geoapify GPS coordinates [longitude, latitude] into 400x520 SVG Canvas screen space.
 * Maps exact road points from Geoapify so vehicle moves strictly on OpenStreetMap roads.
 */
function gpsToViewBox(lon: number, lat: number): { x: number; y: number } {
  let x: number;
  let y: number;

  if (lon <= 76.6856152) {
    const tLon = (lon - 76.682954) / (76.6856152 - 76.682954);
    x = 120 + tLon * (185 - 120);
  } else {
    const tLon = (lon - 76.6856152) / (76.7206665 - 76.6856152);
    x = 185 + tLon * (340 - 185);
  }

  if (lat >= 30.7060817) {
    const tLat = (30.7093383 - lat) / (30.7093383 - 30.7060817);
    y = 90 + tLat * (170 - 90);
  } else {
    const tLat = (30.7060817 - lat) / (30.7060817 - 30.677714);
    y = 170 + tLat * (390 - 170);
  }

  return { x, y };
}

export const BookingMap: React.FC<{ mode: BookingMapMode }> = ({ mode }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const selectedIcon = mapIconForVehicle(selectedVehicle);
  const [trackProgress, setTrackProgress] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Smooth 60fps path progress animation without fluctuation
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration =
      mode === 'assigned' || mode === 'arriving' ? 14000 : mode === 'inprogress' ? 30000 : 0;

    if (duration > 0) {
      setTrackProgress(0);
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        setTrackProgress(progress);
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };
      animationFrameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setTrackProgress(0);
    }
  }, [mode]);

  const showTripRoute = mode === 'inprogress';
  const showDriverApproachRoute = ['assigned', 'arriving'].includes(mode);

  let carPos: { x: number; y: number } | null = null;
  let vehicleRotation = 0;
  let remainingPathPoints: { x: number; y: number }[] = [];
  let currentDriverLat: number | undefined;
  let currentDriverLon: number | undefined;

  if (['search', 'preview', 'choose', 'confirm'].includes(mode)) {
    carPos = gpsToViewBox(76.6856152, 30.7060817);
    vehicleRotation = 0;
  } else if (mode === 'assigned' || mode === 'arriving') {
    const res = getInterpolatedGpsPoint(GEOAPIFY_APPROACH_ROADS, trackProgress);
    currentDriverLat = res.lat;
    currentDriverLon = res.lon;
    vehicleRotation = res.angle;
    carPos = gpsToViewBox(res.lon, res.lat);
    remainingPathPoints = res.remainingGpsPoints.map(([lon, lat]) => gpsToViewBox(lon, lat));
  } else if (mode === 'arrived') {
    currentDriverLat = 30.7060817;
    currentDriverLon = 76.6856152;
    carPos = gpsToViewBox(currentDriverLon, currentDriverLat);
    vehicleRotation = 0;
  } else if (mode === 'inprogress') {
    const res = getInterpolatedGpsPoint(GEOAPIFY_TRIP_ROADS, trackProgress);
    currentDriverLat = res.lat;
    currentDriverLon = res.lon;
    vehicleRotation = res.angle;
    carPos = gpsToViewBox(res.lon, res.lat);
    remainingPathPoints = res.remainingGpsPoints.map(([lon, lat]) => gpsToViewBox(lon, lat));
  }

  // Smoothly center static map view as driver navigates long distances (~300m threshold)
  const displayLat =
    currentDriverLat !== undefined ? Math.round(currentDriverLat * 350) / 350 : undefined;
  const displayLon =
    currentDriverLon !== undefined ? Math.round(currentDriverLon * 350) / 350 : undefined;

  const nearby =
    mode === 'pickup'
      ? MIXED_NEARBY
      : mode === 'searching'
        ? GROUP_NEARBY[selectedVehicle.group]
        : mode === 'choose'
          ? GROUP_NEARBY[selectedVehicle.group]
          : [];

  const activeMarker = carPos
    ? [{ icon: selectedIcon, rotation: vehicleRotation, ...toPercent(carPos.x, carPos.y) }]
    : [];

  const remainingKm = (6.8 * Math.max(0, 1 - trackProgress)).toFixed(1);

  // Generate SVG path string along actual road waypoints ahead of vehicle
  const headingSvgPath =
    remainingPathPoints.length > 1
      ? remainingPathPoints
          .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ')
      : '';

  return (
    <View style={styles.container}>
      <StaticMapBackground latitude={displayLat} longitude={displayLon} />

      <Svg
        pointerEvents="none"
        preserveAspectRatio="xMidYMid slice"
        style={styles.overlaySvg}
        viewBox="0 0 400 520"
      >
        <Defs>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF8A00" />
            <Stop offset="100%" stopColor="#FF5500" />
          </LinearGradient>
          <LinearGradient id="approachGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
        </Defs>

        {/* Heading Trip Road Path: Car Position -> CP 67 Mall along Sector Roads */}
        {showTripRoute && headingSvgPath.length > 0 && (
          <Path
            d={headingSvgPath}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Heading Approach Road Path: Driver Position -> SM Heights */}
        {showDriverApproachRoute && headingSvgPath.length > 0 && (
          <Path
            d={headingSvgPath}
            fill="none"
            stroke="url(#approachGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6,6"
          />
        )}

        {mode === 'searching' && (
          <>
            <Circle cx="200" cy="210" r="70" fill="rgba(255,107,0,0.08)" />
            <Circle cx="200" cy="210" r="48" fill="rgba(255,107,0,0.12)" />
            <Path
              d="M 200,210 L 200,120 M 200,210 L 118,168 M 200,210 L 290,176 M 200,210 L 210,300"
              stroke={Colors.primary}
              strokeWidth="1.5"
              strokeDasharray="4,6"
            />
          </>
        )}
      </Svg>

      <MapVehicleLayer markers={[...nearby, ...activeMarker]} />

      {/* Driver Origin Marker (Finvasia) */}
      {(mode === 'assigned' || mode === 'arriving') && (
        <View style={[styles.locationBadge, { top: '15%', left: '16%' }]}>
          <Text style={styles.badgeTitle}>Finvasia</Text>
          <Text style={styles.badgeSub}>Driver origin</Text>
        </View>
      )}

      {/* Pickup Marker (SM Heights) */}
      {(mode === 'pickup' ||
        mode === 'searching' ||
        mode === 'assigned' ||
        mode === 'arriving' ||
        mode === 'arrived' ||
        mode === 'preview' ||
        mode === 'choose' ||
        mode === 'confirm' ||
        mode === 'inprogress') && (
        <View
          style={[
            styles.pinWrap,
            mode === 'assigned' || mode === 'arriving'
              ? { top: '30%', left: '38%' }
              : styles.pinCenter,
          ]}
        >
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {mode === 'searching' ? 'Your pickup' : 'SM Heights'}
            </Text>
          </View>
          <View style={styles.orangeHalo} />
          <View style={styles.orangePin} />
        </View>
      )}

      {/* User blue dot animation */}
      {(mode === 'pickup' ||
        mode === 'preview' ||
        mode === 'assigned' ||
        mode === 'arriving' ||
        mode === 'arrived') && (
        <View style={[styles.youWrap, mode === 'pickup' ? styles.youLower : styles.youNearPin]}>
          {mode === 'pickup' && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>SM Heights</Text>
            </View>
          )}
          <Animated.View
            style={[
              styles.blueHalo,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.4],
                  outputRange: [0.35, 0.08],
                }),
              },
            ]}
          />
          <View style={styles.blueDot} />
        </View>
      )}

      {/* Destination Flag (CP 67 Mall) */}
      {(mode === 'preview' || mode === 'choose' || mode === 'confirm' || mode === 'inprogress') && (
        <View style={styles.destFlag}>
          <Text style={styles.destFlagText}>CP 67 Mall</Text>
        </View>
      )}

      {/* ETA & Status Pills */}
      {(mode === 'preview' || mode === 'choose') && (
        <View style={styles.etaBubble}>
          <Text style={styles.etaMain}>12 min</Text>
          <Text style={styles.etaSub}>6.8 km to CP 67 Mall</Text>
        </View>
      )}

      {mode === 'assigned' && (
        <View style={styles.carEta}>
          <Text style={styles.carEtaLabel}>Heading to SM Heights</Text>
          <Text style={styles.carEtaVal}>3 min away</Text>
        </View>
      )}

      {mode === 'arriving' && (
        <View style={styles.carEta}>
          <Text style={styles.carEtaLabel}>Finvasia ➔ SM Heights</Text>
          <Text style={styles.carEtaVal}>{trackProgress > 0.6 ? '1 min away' : '2 min away'}</Text>
          <Text style={styles.etaSub}>Driver approaching pickup</Text>
        </View>
      )}

      {mode === 'arrived' && (
        <View style={styles.arrivedBanner}>
          <Text style={styles.arrivedBannerText}>Driver arrived at SM Heights!</Text>
        </View>
      )}

      {mode === 'inprogress' && (
        <View style={styles.onWayPill}>
          <Text style={styles.onWayText}>Trip in progress to CP 67 Mall</Text>
          <Text style={styles.etaSub}>{remainingKm} km left</Text>
        </View>
      )}
    </View>
  );
};

const overlayShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 5,
  elevation: 3,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#E8EEF2',
  },
  overlaySvg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCenter: {
    top: '34%',
    left: 0,
    right: 0,
  },
  pinLeft: {
    top: '38%',
    left: '18%',
  },
  youWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  youLower: {
    top: '48%',
    left: 0,
    right: 0,
  },
  youNearPin: {
    top: '44%',
    left: '28%',
  },
  bubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
    ...overlayShadow,
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  orangeHalo: {
    position: 'absolute',
    bottom: -10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,107,0,0.18)',
  },
  orangePin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  blueHalo: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#60A5FA',
    bottom: -14,
  },
  blueDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  pickupFlag: {
    position: 'absolute',
    top: '22%',
    left: '16%',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  destFlag: {
    position: 'absolute',
    top: '24%',
    right: '10%',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flagText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  destFlagText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  etaBubble: {
    position: 'absolute',
    top: '32%',
    alignSelf: 'center',
    left: '42%',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    ...overlayShadow,
  },
  etaMain: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  etaSub: {
    fontSize: 11,
    color: Colors.gray500,
    textAlign: 'center',
  },
  carEta: {
    position: 'absolute',
    top: '18%',
    right: '18%',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    ...overlayShadow,
  },
  carEtaLabel: {
    fontSize: 11,
    color: Colors.gray600,
  },
  carEtaVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  arrivedBanner: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    left: '32%',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  arrivedBannerText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  onWayPill: {
    position: 'absolute',
    top: '42%',
    left: '18%',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  onWayText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  locationBadge: {
    position: 'absolute',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    ...overlayShadow,
  },
  badgeTitle: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '500',
  },
});

export default BookingMap;
