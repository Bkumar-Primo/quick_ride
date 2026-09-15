import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface OnboardingVisualProps {
  height?: number;
}

export const OnboardingVisual2: React.FC<OnboardingVisualProps> = ({ height = 280 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="bgGrad2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F0FDF4" />
            <Stop offset="50%" stopColor="#DCFCE7" />
            <Stop offset="100%" stopColor="#FFF7ED" />
          </LinearGradient>
          <LinearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#16A34A" />
          </LinearGradient>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#FF6B00" />
          </LinearGradient>
          <LinearGradient id="carGrad2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#E2E8F0" />
          </LinearGradient>
        </Defs>

        {/* Soft Background Card */}
        <Rect width="360" height="280" rx="24" fill="url(#bgGrad2)" />

        {/* Navigation Grid Coordinates */}
        <G stroke="#E2E8F0" strokeWidth="1.5" opacity="0.6">
          <Line x1="40" y1="0" x2="40" y2="280" />
          <Line x1="120" y1="0" x2="120" y2="280" />
          <Line x1="200" y1="0" x2="200" y2="280" />
          <Line x1="280" y1="0" x2="280" y2="280" />
          <Line x1="0" y1="60" x2="360" y2="60" />
          <Line x1="0" y1="130" x2="360" y2="130" />
          <Line x1="0" y1="200" x2="360" y2="200" />
        </G>

        {/* Dynamic Route Polyline */}
        <Path
          d="M 60,210 C 100,210 120,160 160,160 C 200,160 220,90 300,90"
          stroke="url(#routeGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Route Pulsing Glow */}
        <Path
          d="M 60,210 C 100,210 120,160 160,160 C 200,160 220,90 300,90"
          stroke={Colors.primary}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />

        {/* Radar Waves around Pickup point */}
        <G transform="translate(60, 210)">
          <Circle
            cx="0"
            cy="0"
            r="32"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            opacity="0.25"
          />
          <Circle cx="0" cy="0" r="20" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.4" />
          <Circle cx="0" cy="0" r="10" fill="#10B981" />
          <Circle cx="0" cy="0" r="4" fill="#FFFFFF" />
        </G>

        {/* Moving QuickRide Car on Route */}
        <G transform="translate(142, 142)">
          {/* Car Shadow */}
          <Rect x="4" y="6" width="46" height="24" rx="8" fill="#000000" opacity="0.15" />
          {/* Car Body */}
          <Rect
            x="0"
            y="0"
            width="46"
            height="24"
            rx="7"
            fill="url(#carGrad2)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          {/* Roof & Windshield */}
          <Rect x="12" y="3" width="22" height="18" rx="4" fill="#1E293B" />
          <Line x1="16" y1="4" x2="30" y2="4" stroke="#475569" strokeWidth="1" />
          {/* Headlights */}
          <Circle cx="44" cy="6" r="2.5" fill="#FBBF24" />
          <Circle cx="44" cy="18" r="2.5" fill="#FBBF24" />
          {/* Tail lights */}
          <Circle cx="2" cy="6" r="2" fill="#EF4444" />
          <Circle cx="2" cy="18" r="2" fill="#EF4444" />
          {/* QuickRide Orange Roof Tag */}
          <Rect x="20" y="8" width="8" height="8" rx="2" fill={Colors.primary} />
        </G>

        {/* Destination Beacon */}
        <G transform="translate(300, 90)">
          <Circle
            cx="0"
            cy="0"
            r="36"
            fill="none"
            stroke="#FF6B00"
            strokeWidth="1.5"
            opacity="0.2"
          />
          <Circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke="#FF6B00"
            strokeWidth="2"
            opacity="0.35"
          />
          <Circle cx="0" cy="0" r="12" fill={Colors.primary} />
          <Circle cx="0" cy="0" r="5" fill="#FFFFFF" />
        </G>

        {/* Turn Left Direction Pill Graphic */}
        <G transform="translate(200, 30)">
          <Rect x="0" y="0" width="130" height="36" rx="18" fill="#0F172A" />
          <Circle cx="18" cy="18" r="12" fill={Colors.primary} />
          <Path
            d="M 22,18 L 14,18 M 17,14 L 13,18 L 17,22"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>

      {/* Floating Driver ETA Badge */}
      <View style={styles.floatingDriverBadge}>
        <View style={styles.driverAvatarCircle}>
          <Ionicons name="person" size={16} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.driverBadgeName}>Rahul S. • Honda City</Text>
          <Text style={styles.driverBadgeEta}>Arriving in 3 mins (0.8 km)</Text>
        </View>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Floating Navigation Pill Top Right */}
      <View style={styles.navTopBadge}>
        <Ionicons name="arrow-up" size={16} color={Colors.white} />
        <Text style={styles.navBadgeText}>In 200m turn left on MG Road</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingDriverBadge: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    ...Layout.shadows.md,
  },
  driverAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFE8D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  driverBadgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  driverBadgeEta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  liveTag: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  navTopBadge: {
    position: 'absolute',
    top: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...Layout.shadows.sm,
  },
  navBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default OnboardingVisual2;
