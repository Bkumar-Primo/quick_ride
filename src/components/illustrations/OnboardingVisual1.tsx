import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface OnboardingVisualProps {
  height?: number;
}

export const OnboardingVisual1: React.FC<OnboardingVisualProps> = ({ height = 280 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="bgGrad1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF8F3" />
            <Stop offset="100%" stopColor="#FEEDDC" />
          </LinearGradient>
          <LinearGradient id="phoneBody" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </LinearGradient>
          <LinearGradient id="screenMap" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F8FAFC" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </LinearGradient>
          <LinearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#E2E8F0" />
          </LinearGradient>
        </Defs>

        {/* Soft Background Card */}
        <Rect width="360" height="280" rx="24" fill="url(#bgGrad1)" />

        {/* Decorative Background Circles */}
        <Circle cx="180" cy="140" r="110" fill="#FF851B" opacity="0.08" />
        <Circle cx="180" cy="140" r="85" fill="#FF851B" opacity="0.09" />

        {/* Smartphone Mockup */}
        <G transform="translate(95, 20)">
          {/* Phone Outer Shadow */}
          <Rect x="4" y="8" width="170" height="240" rx="30" fill="#000000" opacity="0.12" />
          {/* Phone Frame */}
          <Rect x="0" y="0" width="170" height="240" rx="28" fill="url(#phoneBody)" />
          {/* Phone Screen */}
          <Rect x="6" y="6" width="158" height="228" rx="22" fill="url(#screenMap)" />

          {/* Dynamic Island / Speaker Pill */}
          <Rect x="60" y="10" width="50" height="12" rx="6" fill="#0F172A" />

          {/* Map Roads on Screen */}
          <Path
            d="M 10,70 L 150,70 M 10,130 L 150,130 M 50,20 L 50,210 M 115,20 L 115,210"
            stroke="#E2E8F0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Green Park Patch */}
          <Rect x="15" y="80" width="30" height="40" rx="6" fill="#DCFCE7" />
          {/* River Stream */}
          <Path
            d="M 10,175 C 60,165 90,195 150,180"
            stroke="#BAE6FD"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Active Route Polyline */}
          <Path
            d="M 50,130 L 115,130 L 115,65"
            stroke={Colors.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Pickup Green Dot */}
          <Circle cx="50" cy="130" r="6" fill="#10B981" />
          <Circle cx="50" cy="130" r="2.5" fill="#FFFFFF" />

          {/* Destination Orange Pin */}
          <Circle cx="115" cy="65" r="8" fill={Colors.primary} />
          <Circle cx="115" cy="65" r="3.5" fill="#FFFFFF" />

          {/* Modern White Sedan on the Screen */}
          <G transform="translate(70, 115)">
            <Rect
              x="0"
              y="0"
              width="34"
              height="18"
              rx="5"
              fill="url(#carGrad)"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <Rect x="8" y="2" width="16" height="12" rx="3" fill="#334155" />
            <Circle cx="7" cy="18" r="4" fill="#0F172A" />
            <Circle cx="27" cy="18" r="4" fill="#0F172A" />
            <Circle cx="33" cy="5" r="2" fill="#FBBF24" />
          </G>

          {/* Mini Bottom Sheet on Screen */}
          <Rect x="12" y="195" width="146" height="32" rx="10" fill="#FFFFFF" />
          <Rect x="60" y="200" width="50" height="3" rx="1.5" fill="#E2E8F0" />
          <Rect x="20" y="208" width="60" height="8" rx="4" fill={Colors.primary} />
          <Rect x="100" y="208" width="45" height="8" rx="4" fill="#10B981" />
        </G>

        {/* Floating Tap Cursor */}
        <G transform="translate(195, 175)">
          <Circle cx="16" cy="16" r="16" fill={Colors.primary} opacity="0.25" />
          <Circle cx="16" cy="16" r="10" fill={Colors.primary} opacity="0.5" />
          <Circle cx="16" cy="16" r="5" fill={Colors.primary} />
        </G>
      </Svg>

      {/* Floating Badge: Instant Booking */}
      <View style={styles.floatingBadgeLeft}>
        <View style={styles.badgeIconCircle}>
          <Ionicons name="flash" size={14} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.badgeBold}>1-Tap Ride</Text>
          <Text style={styles.badgeSub}>Pickup in 2 mins</Text>
        </View>
      </View>

      {/* Floating Badge: Best Rates */}
      <View style={styles.floatingBadgeRight}>
        <View style={[styles.badgeIconCircle, { backgroundColor: '#10B981' }]}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.badgeBold}>Zero Hidden Fees</Text>
          <Text style={styles.badgeSub}>Upfront pricing</Text>
        </View>
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
  floatingBadgeLeft: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    ...Layout.shadows.md,
  },
  floatingBadgeRight: {
    position: 'absolute',
    right: 16,
    top: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    ...Layout.shadows.md,
  },
  badgeIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBold: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badgeSub: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});

export default OnboardingVisual1;
