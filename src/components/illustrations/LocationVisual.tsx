import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface LocationVisualProps {
  height?: number;
}

export const LocationVisual: React.FC<LocationVisualProps> = ({ height = 280 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="locBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF9F5" />
            <Stop offset="60%" stopColor="#FFEBDD" />
            <Stop offset="100%" stopColor="#FED7AA" />
          </LinearGradient>
          <LinearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF851B" />
            <Stop offset="100%" stopColor="#E05000" />
          </LinearGradient>
          <LinearGradient id="mapTileGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </LinearGradient>
        </Defs>

        {/* Warm Sky Backdrop */}
        <Rect width="400" height="280" fill="url(#locBgGrad)" />

        {/* Ambient Sun Glow */}
        <Circle cx="200" cy="110" r="90" fill="#FED7AA" opacity="0.4" />

        {/* City Skyline Silhouettes */}
        <G opacity="0.3">
          <Rect x="25" y="110" width="25" height="100" fill="#C2410C" rx="2" />
          <Rect x="55" y="80" width="30" height="130" fill="#9A3412" rx="2" />
          <Rect x="92" y="120" width="22" height="90" fill="#C2410C" rx="2" />
          <Rect x="290" y="100" width="28" height="110" fill="#C2410C" rx="2" />
          <Rect x="325" y="70" width="32" height="140" fill="#9A3412" rx="2" />
          <Rect x="362" y="115" width="24" height="95" fill="#C2410C" rx="2" />
        </G>

        {/* Isometric 3D Map Ground Plate */}
        <G transform="translate(60, 40)">
          {/* Map Base Surface */}
          <Path
            d="M 140,25 L 260,85 L 140,155 L 20,95 Z"
            fill="url(#mapTileGrad)"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Map Grid Roads */}
          <Path
            d="M 70,60 L 190,120 M 100,45 L 220,105 M 80,125 L 200,65 M 50,110 L 170,50"
            stroke="#E2E8F0"
            strokeWidth="3.5"
          />
          {/* River Stream on Map */}
          <Path
            d="M 30,85 C 90,80 150,130 220,115"
            stroke="#93C5FD"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Concentric Radar Wave Rings around the pin base */}
          <Ellipse
            cx="140"
            cy="110"
            rx="60"
            ry="24"
            fill="none"
            stroke="rgba(255, 107, 0, 0.25)"
            strokeWidth="3"
          />
          <Ellipse
            cx="140"
            cy="110"
            rx="40"
            ry="16"
            fill="none"
            stroke="rgba(255, 107, 0, 0.35)"
            strokeWidth="2.5"
          />
          <Ellipse
            cx="140"
            cy="110"
            rx="20"
            ry="8"
            fill="none"
            stroke="rgba(255, 107, 0, 0.5)"
            strokeWidth="2"
          />

          {/* 3D Elevated Orange Location Pin */}
          <G transform="translate(100, 15)">
            {/* Pin Shadow */}
            <Ellipse cx="40" cy="95" rx="16" ry="6" fill="#1E2430" opacity="0.35" />
            {/* Pin Head */}
            <Path
              d="M 40,92 C 34,70 12,50 12,32 C 12,14 24,2 40,2 C 56,2 68,14 68,32 C 68,50 46,70 40,92 Z"
              fill="url(#pinGrad)"
              stroke="#EA580C"
              strokeWidth="2"
            />
            {/* Inner White Cutout Circle */}
            <Circle cx="40" cy="32" r="14" fill="#FFFFFF" />
          </G>
        </G>

        {/* Road Surface in Foreground */}
        <Path d="M -10,210 L 410,210 L 410,285 L -10,285 Z" fill="#E2DDD7" />
        <Path
          d="M 20,245 L 80,245 M 130,245 L 200,245 M 250,245 L 330,245 M 380,245 L 430,245"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* White Sedan Car in Foreground */}
        <G transform="translate(100, 175)">
          <Ellipse cx="100" cy="62" rx="90" ry="8" fill="#1E2430" opacity="0.3" />
          <Path
            d="M 5,50 C 15,54 175,54 190,50 C 196,44 195,35 190,30 C 185,25 170,22 150,20 L 120,10 C 100,4 60,4 45,10 L 20,20 C 10,24 6,32 5,42 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          {/* Glass */}
          <Path
            d="M 45,12 L 65,5 C 75,2 105,2 118,5 L 145,14 C 120,12 70,12 45,12 Z"
            fill="#38BDF8"
            opacity="0.6"
          />
          {/* Door Orange Logo */}
          <G transform="translate(90, 26)">
            <Circle cx="8" cy="8" r="9" fill={Colors.primary} />
            <Circle cx="8" cy="8" r="5" fill="#FFFFFF" />
            <Path d="M 7,8 L 13,16 L 10,16 Z" fill={Colors.primary} />
          </G>
          {/* Wheels */}
          <Circle cx="35" cy="52" r="14" fill="#0F172A" />
          <Circle cx="35" cy="52" r="8" fill="#94A3B8" />
          <Circle cx="160" cy="52" r="14" fill="#0F172A" />
          <Circle cx="160" cy="52" r="8" fill="#94A3B8" />
        </G>
      </Svg>

      {/* Native Floating Feature Pills (Clean vector UI) */}
      <View style={styles.badgeFindRides}>
        <Ionicons name="car-sport" size={14} color={Colors.primary} />
        <Text style={styles.badgeText}>Find rides near you</Text>
      </View>

      <View style={styles.badgeFasterPickups}>
        <Ionicons name="search" size={13} color={Colors.primary} />
        <Text style={styles.badgeText}>Faster pickups</Text>
      </View>

      <View style={styles.badgeAccurateDropoffs}>
        <Ionicons name="navigate" size={13} color="#EA580C" />
        <Text style={styles.badgeText}>Accurate drop-offs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  badgeFindRides: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
    ...Layout.shadows.md,
  },
  badgeFasterPickups: {
    position: 'absolute',
    top: 75,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
    ...Layout.shadows.md,
  },
  badgeAccurateDropoffs: {
    position: 'absolute',
    top: 75,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
    ...Layout.shadows.md,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default LocationVisual;
