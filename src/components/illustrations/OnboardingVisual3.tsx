import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface OnboardingVisualProps {
  height?: number;
}

export const OnboardingVisual3: React.FC<OnboardingVisualProps> = ({ height = 280 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 360 280" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="bgGrad3" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFBEB" />
            <Stop offset="60%" stopColor="#FEF3C7" />
            <Stop offset="100%" stopColor="#FFF7ED" />
          </LinearGradient>
          <LinearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF851B" />
            <Stop offset="100%" stopColor="#EA580C" />
          </LinearGradient>
          <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
        </Defs>

        {/* Soft Warm Background Card */}
        <Rect width="360" height="280" rx="24" fill="url(#bgGrad3)" />

        {/* Radiant Concentric Shield Rings */}
        <Circle cx="180" cy="130" r="105" fill="#F59E0B" opacity="0.08" />
        <Circle cx="180" cy="130" r="80" fill="#F59E0B" opacity="0.12" />
        <Circle cx="180" cy="130" r="55" fill="#F59E0B" opacity="0.15" />

        {/* Central Safety Shield Graphic */}
        <G transform="translate(130, 75)">
          {/* Outer Shield Shadow */}
          <Path
            d="M 50,110 C 18,88 4,58 4,14 C 28,14 42,4 50,0 C 58,4 72,14 96,14 C 96,58 82,88 50,110 Z"
            fill="#000000"
            opacity="0.1"
            transform="translate(4, 6)"
          />
          {/* Main Shield */}
          <Path
            d="M 50,110 C 18,88 4,58 4,14 C 28,14 42,4 50,0 C 58,4 72,14 96,14 C 96,58 82,88 50,110 Z"
            fill="url(#shieldGrad)"
          />
          {/* Inner Golden Border */}
          <Path
            d="M 50,100 C 24,80 12,52 12,18 C 30,18 42,10 50,6 C 58,10 70,18 88,18 C 88,52 76,80 50,100 Z"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="3"
          />
          {/* White Checkmark */}
          <Path
            d="M 32,52 L 44,64 L 68,36"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      </Svg>

      {/* Floating Badge Left: 24/7 SOS Protection */}
      <View style={styles.floatingBadgeLeft}>
        <View style={styles.shieldIconCircle}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.badgeTitle}>24/7 SOS Shield</Text>
          <Text style={styles.badgeSubtitle}>Real-time ride tracking</Text>
        </View>
      </View>

      {/* Floating Badge Right: Transparent Pricing */}
      <View style={styles.floatingBadgeRight}>
        <View style={[styles.shieldIconCircle, { backgroundColor: '#10B981' }]}>
          <Ionicons name="pricetag" size={15} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.badgeTitle}>No Surge Surprise</Text>
          <Text style={styles.badgeSubtitle}>Locked upfront fare</Text>
        </View>
      </View>

      {/* Floating Bottom Badge: 100% Background-Checked Drivers */}
      <View style={styles.floatingBadgeBottom}>
        <Ionicons name="ribbon" size={16} color="#D97706" />
        <Text style={styles.badgeVerifiedText}>100% Verified Drivers & Sanitized Cars</Text>
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
    left: 14,
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
  floatingBadgeRight: {
    position: 'absolute',
    right: 14,
    top: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    ...Layout.shadows.md,
  },
  floatingBadgeBottom: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    ...Layout.shadows.md,
  },
  shieldIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badgeSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  badgeVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
});

export default OnboardingVisual3;
