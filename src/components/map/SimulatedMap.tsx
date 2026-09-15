import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { DriverInfo, type LocationPoint } from '../../types';

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
  pickupLocation,
  destinationLocation,
  onPressMap,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [_carOffset, _setCarOffset] = useState({ x: 0, y: 0 });

  // Continuous subtle pulsing for user location pin
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Route path coordinates in SVG space (0..400, 0..360)
  // Pickup: (85, 230) -> Destination: (315, 80)
  const pickupCoords = { x: 85, y: 240 };
  const destCoords = { x: 315, y: 80 };

  // Calculate driver position along the curve based on progress
  const t = Math.min(Math.max(progressPercent / 100, 0), 1);
  // Bezier curve points: P0=(85,240), P1=(140, 160), P2=(220, 200), P3=(315, 80)
  const carX = Math.round(
    (1 - t) ** 3 * 85 + 3 * (1 - t) ** 2 * t * 140 + 3 * (1 - t) * t ** 2 * 220 + t ** 3 * 315,
  );
  const carY = Math.round(
    (1 - t) ** 3 * 240 + 3 * (1 - t) ** 2 * t * 160 + 3 * (1 - t) * t ** 2 * 200 + t ** 3 * 80,
  );

  return (
    <View style={[styles.container, { height: typeof height === 'number' ? height : 360 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#C7E8FA" />
            <Stop offset="100%" stopColor="#A5DBF8" />
          </LinearGradient>
          <LinearGradient id="parkGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2F7E8" />
            <Stop offset="100%" stopColor="#C8F0D3" />
          </LinearGradient>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FF8A00" />
            <Stop offset="100%" stopColor="#FF5500" />
          </LinearGradient>
        </Defs>

        {/* Map Background Land */}
        <Rect width="400" height="360" fill="#F1F5F9" />

        {/* Green Parks */}
        <Path
          d="M -10,40 Q 60,30 80,100 Q 100,160 30,190 Q -20,180 -10,40 Z"
          fill="url(#parkGrad)"
        />
        <Path
          d="M 280,220 Q 340,210 390,260 Q 410,330 320,350 Q 250,330 280,220 Z"
          fill="url(#parkGrad)"
        />

        {/* River / Water body */}
        <Path
          d="M 0,110 C 120,120 180,60 270,95 C 330,120 370,105 400,100 L 400,135 C 360,145 320,155 260,130 C 180,95 120,150 0,140 Z"
          fill="url(#waterGrad)"
        />

        {/* Secondary Grid Streets */}
        <Path
          d="
            M -10,70 L 410,70
            M -10,180 L 410,180
            M -10,290 L 410,290
            M 60,-10 L 60,370
            M 170,-10 L 170,370
            M 270,-10 L 270,370
            M 360,-10 L 360,370
          "
          stroke="#E2E8F0"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Primary Arterial Expressways */}
        <Path
          d="M -10,240 C 110,240 160,180 230,180 C 300,180 340,110 410,110"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <Path
          d="M 120,-10 C 120,110 200,200 200,370"
          stroke="#FFFFFF"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Route Line (Shown during booking & ride) */}
        {showRoute && (
          <>
            {/* Route Glow Halo */}
            <Path
              d="M 85,240 C 140,160 220,200 315,80"
              fill="none"
              stroke={Colors.routeHalo}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Main Polyline */}
            <Path
              d="M 85,240 C 140,160 220,200 315,80"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Static Nearby Mock Driver Cars */}
        {showNearbyDrivers && !showRoute && (
          <>
            {/* Driver 1 */}
            <G transform="translate(130, 175)">
              <Circle r="12" fill="rgba(255, 107, 0, 0.15)" />
              <Circle r="7" fill={Colors.secondary} />
              <Circle r="3.5" fill="#FFFFFF" />
            </G>
            {/* Driver 2 */}
            <G transform="translate(230, 245)">
              <Circle r="12" fill="rgba(255, 107, 0, 0.15)" />
              <Circle r="7" fill={Colors.secondary} />
              <Circle r="3.5" fill="#FFFFFF" />
            </G>
            {/* Driver 3 */}
            <G transform="translate(290, 140)">
              <Circle r="12" fill="rgba(255, 107, 0, 0.15)" />
              <Circle r="7" fill={Colors.secondary} />
              <Circle r="3.5" fill="#FFFFFF" />
            </G>
            {/* Driver 4 */}
            <G transform="translate(70, 90)">
              <Circle r="12" fill="rgba(255, 107, 0, 0.15)" />
              <Circle r="7" fill={Colors.secondary} />
              <Circle r="3.5" fill="#FFFFFF" />
            </G>
          </>
        )}

        {/* Pickup Pin */}
        <G transform={`translate(${pickupCoords.x}, ${pickupCoords.y})`}>
          <Circle r="16" fill="rgba(255, 107, 0, 0.25)" />
          <Circle r="8" fill={Colors.primary} stroke="#FFFFFF" strokeWidth="2.5" />
          <Circle r="3" fill="#FFFFFF" />
          {/* Label Pill */}
          <Rect x="-45" y="14" width="90" height="20" rx="10" fill={Colors.secondary} />
          <SvgText x="0" y="28" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
            PICKUP
          </SvgText>
        </G>

        {/* Destination Pin (if route shown) */}
        {showRoute && (
          <G transform={`translate(${destCoords.x}, ${destCoords.y})`}>
            <Circle r="16" fill="rgba(16, 185, 129, 0.25)" />
            <Circle r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
            <Circle r="3" fill="#FFFFFF" />
            <Rect x="-45" y="-32" width="90" height="20" rx="10" fill="#10B981" />
            <SvgText
              x="0"
              y="-18"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              DROP OFF
            </SvgText>
          </G>
        )}

        {/* Animated Moving Driver Car */}
        {driverEnRoute && (
          <G transform={`translate(${carX}, ${carY})`}>
            <Circle r="20" fill="rgba(255, 107, 0, 0.3)" />
            <Circle r="14" fill={Colors.primary} stroke="#FFFFFF" strokeWidth="2.5" />
            <Path d="M -4,-2 L 4,-2 L 5,3 L -5,3 Z" fill="#FFFFFF" />
            {/* Speed / ETA Bubble */}
            <Rect x="-36" y="-34" width="72" height="22" rx="11" fill={Colors.secondary} />
            <SvgText
              x="0"
              y="-20"
              fill="#FFFFFF"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              3 min away
            </SvgText>
          </G>
        )}
      </Svg>

      {/* Floating Map Controls */}
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
});

export default SimulatedMap;
