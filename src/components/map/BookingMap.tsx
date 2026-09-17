import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
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

export const BookingMap: React.FC<{ mode: BookingMapMode }> = ({ mode }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const selectedIcon = mapIconForVehicle(selectedVehicle);

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

  const showRoute = [
    'search',
    'preview',
    'choose',
    'confirm',
    'assigned',
    'arriving',
    'inprogress',
  ].includes(mode);
  const dashed = mode === 'assigned';
  const carPos =
    mode === 'search'
      ? { x: 210, y: 168 }
      : mode === 'preview' || mode === 'choose' || mode === 'confirm'
        ? { x: 210, y: 175 }
        : mode === 'assigned'
          ? { x: 250, y: 130 }
          : mode === 'arriving'
            ? { x: 208, y: 168 }
            : mode === 'arrived'
              ? { x: 200, y: 198 }
              : mode === 'inprogress'
                ? { x: 230, y: 195 }
                : null;

  const nearby =
    mode === 'pickup'
      ? MIXED_NEARBY
      : mode === 'searching'
        ? GROUP_NEARBY[selectedVehicle.group]
        : mode === 'choose'
          ? GROUP_NEARBY[selectedVehicle.group]
          : [];

  const activeMarker = carPos ? [{ icon: selectedIcon, ...toPercent(carPos.x, carPos.y) }] : [];

  return (
    <View style={styles.container}>
      <StaticMapBackground />
      <Svg
        pointerEvents="none"
        preserveAspectRatio="xMidYMid slice"
        style={styles.overlaySvg}
        viewBox="0 0 400 520"
      >
        <Defs>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FF8A00" />
            <Stop offset="100%" stopColor="#FF5500" />
          </LinearGradient>
        </Defs>

        {showRoute && (
          <Path
            d="M 92,150 C 150,148 190,190 250,186 C 300,182 330,150 348,142"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={dashed ? '8,8' : undefined}
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

      {(mode === 'pickup' ||
        mode === 'searching' ||
        mode === 'assigned' ||
        mode === 'arriving') && (
        <View style={[styles.pinWrap, mode === 'assigned' ? styles.pinLeft : styles.pinCenter]}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {mode === 'searching'
                ? 'Your pickup'
                : mode === 'pickup'
                  ? 'Pickup here'
                  : 'Your pickup'}
            </Text>
          </View>
          <View style={styles.orangeHalo} />
          <View style={styles.orangePin} />
        </View>
      )}

      {(mode === 'pickup' ||
        mode === 'preview' ||
        mode === 'assigned' ||
        mode === 'arriving' ||
        mode === 'arrived') && (
        <View style={[styles.youWrap, mode === 'pickup' ? styles.youLower : styles.youNearPin]}>
          {mode === 'pickup' && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>Your location</Text>
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

      {(mode === 'preview' || mode === 'choose' || mode === 'confirm' || mode === 'inprogress') && (
        <>
          <View style={styles.pickupFlag}>
            <Text style={styles.flagText}>{mode === 'inprogress' ? '' : 'Pickup'}</Text>
          </View>
          <View style={styles.destFlag}>
            <Text style={styles.destFlagText}>Destination</Text>
          </View>
        </>
      )}

      {(mode === 'preview' || mode === 'inprogress') && (
        <View style={styles.etaBubble}>
          <Text style={styles.etaMain}>{mode === 'inprogress' ? '2.5 km left' : '12 min'}</Text>
          {mode === 'preview' && <Text style={styles.etaSub}>6.8 km</Text>}
        </View>
      )}

      {mode === 'assigned' && (
        <View style={styles.carEta}>
          <Text style={styles.carEtaLabel}>Arriving in</Text>
          <Text style={styles.carEtaVal}>3 min</Text>
        </View>
      )}

      {mode === 'arriving' && (
        <View style={styles.carEta}>
          <Text style={styles.carEtaLabel}>Arriving in</Text>
          <Text style={styles.carEtaVal}>2 min</Text>
          <Text style={styles.etaSub}>700 m away</Text>
        </View>
      )}

      {mode === 'arrived' && (
        <View style={styles.arrivedBanner}>
          <Text style={styles.arrivedBannerText}>Your driver{'\n'}has arrived!</Text>
        </View>
      )}

      {mode === 'inprogress' && (
        <View style={styles.onWayPill}>
          <Text style={styles.onWayText}>On the way{'\n'}to destination</Text>
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
});

export default BookingMap;
