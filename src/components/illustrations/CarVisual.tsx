import type React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface CarVisualProps {
  height?: number;
}

export const CarVisual: React.FC<CarVisualProps> = ({ height = 230 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice">
        <Defs>
          {/* Sky Sunrise Gradient */}
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF9F5" />
            <Stop offset="50%" stopColor="#FFE8D6" />
            <Stop offset="100%" stopColor="#FED7AA" />
          </LinearGradient>

          {/* Road Gradient */}
          <LinearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#C4BDB5" />
            <Stop offset="30%" stopColor="#E2DDD7" />
            <Stop offset="100%" stopColor="#F5F0EB" />
          </LinearGradient>

          {/* Car Body Gradient */}
          <LinearGradient id="carBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="60%" stopColor="#F8FAFC" />
            <Stop offset="100%" stopColor="#E2E8F0" />
          </LinearGradient>

          {/* Glass Gradient */}
          <LinearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#334155" />
          </LinearGradient>

          {/* Wheel Gradient */}
          <LinearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#1F2937" />
            <Stop offset="100%" stopColor="#0F172A" />
          </LinearGradient>
        </Defs>

        {/* Sky Background */}
        <Rect width="400" height="230" fill="url(#skyGrad)" />

        {/* Soft Sun Glow */}
        <Circle cx="160" cy="110" r="70" fill="#FFE3C9" opacity="0.6" />

        {/* City Skyline Buildings in Background */}
        <G opacity="0.35">
          <Rect x="20" y="70" width="22" height="90" fill="#D97706" rx="2" />
          <Rect x="38" y="55" width="26" height="105" fill="#B45309" rx="2" />
          <Rect x="72" y="85" width="18" height="75" fill="#D97706" rx="2" />
          <Rect x="98" y="40" width="30" height="120" fill="#92400E" rx="3" />
          <Rect x="136" y="65" width="24" height="95" fill="#D97706" rx="2" />
          <Rect x="230" y="50" width="32" height="110" fill="#B45309" rx="2" />
          <Rect x="270" y="75" width="26" height="85" fill="#D97706" rx="2" />
          <Rect x="304" y="35" width="28" height="125" fill="#92400E" rx="3" />
          <Rect x="340" y="60" width="35" height="100" fill="#B45309" rx="2" />
          <Rect x="382" y="80" width="25" height="80" fill="#D97706" rx="2" />
        </G>

        {/* Trees & Foliage along highway */}
        <G opacity="0.5">
          <Circle cx="35" cy="145" r="18" fill="#15803D" />
          <Circle cx="60" cy="148" r="15" fill="#166534" />
          <Circle cx="320" cy="145" r="18" fill="#15803D" />
          <Circle cx="350" cy="142" r="22" fill="#166534" />
          <Circle cx="380" cy="146" r="16" fill="#15803D" />
        </G>

        {/* Highway Barrier Guardrail */}
        <Path d="M -10,154 L 410,154 L 410,162 L -10,162 Z" fill="#CBD5E1" />
        <Path d="M -10,158 L 410,158" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Rail Posts */}
        {[15, 55, 95, 135, 175, 215, 255, 295, 335, 375].map((x) => (
          <Rect key={x} x={x} y="154" width="4" height="14" fill="#94A3B8" />
        ))}

        {/* Road Surface */}
        <Path d="M -10,165 L 410,165 L 410,235 L -10,235 Z" fill="url(#roadGrad)" />

        {/* Road White Lane Markings with Perspective */}
        <Path
          d="M 30,195 L 90,195 M 140,195 L 210,195 M 260,195 L 340,195 M 390,195 L 440,195"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeDasharray="28, 18"
          strokeLinecap="round"
        />

        {/* --- SLEEK QUICKRIDE premium CAR (Angled 3/4 Side View) --- */}
        <G transform="translate(145, 125)">
          {/* Ground Shadow */}
          <Ellipse cx="75" cy="74" rx="86" ry="9" fill="#1E2430" opacity="0.35" />

          {/* Car Lower Body / Skirt */}
          <Path
            d="M 5,62 C 10,65 135,66 148,62 C 153,58 152,50 148,46 C 144,42 135,38 118,36 L 90,26 C 75,20 40,20 28,26 L 10,36 C 4,39 2,46 3,54 Z"
            fill="url(#carBodyGrad)"
          />

          {/* Roof & Cabin */}
          <Path
            d="M 28,26 L 46,14 C 54,8 82,8 92,14 L 114,28 C 114,28 72,24 28,26 Z"
            fill="url(#glassGrad)"
          />

          {/* Windshield & Windows */}
          <Path
            d="M 32,25 L 48,16 C 54,12 80,12 88,16 L 108,26 C 90,24 50,24 32,25 Z"
            fill="#38BDF8"
            opacity="0.6"
          />
          {/* Window Divider Pillar */}
          <Path d="M 68,14 L 68,26" stroke="#1E293B" strokeWidth="2.5" />

          {/* Main Car Profile Shell */}
          <Path
            d="M 2,46 C 4,38 12,34 26,30 L 46,14 C 55,7 85,7 95,14 L 120,30 C 138,34 150,40 152,48 C 154,56 148,64 140,65 C 130,65 125,56 112,56 C 98,56 94,65 48,65 C 38,65 34,56 22,56 C 10,56 5,64 2,58 C 0,54 0,50 2,46 Z"
            fill="url(#carBodyGrad)"
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          {/* Side Contour Character Lines */}
          <Path d="M 22,42 C 45,40 110,40 144,44" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
          <Path d="M 25,52 C 50,50 105,50 135,53" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />

          {/* Door Orange QuickRide Emblem */}
          <G transform="translate(68, 38)">
            <Circle cx="8" cy="8" r="8" fill={Colors.primary} />
            <Circle cx="8" cy="8" r="4.5" fill="#FFFFFF" />
            <Circle cx="8" cy="8" r="1.5" fill={Colors.primary} />
            <Path d="M 7,8 L 13,16 L 10,16 Z" fill={Colors.primary} />
            <Path d="M 8,8 L 12,15 L 11,15 Z" fill="#FFFFFF" />
          </G>

          {/* Headlights (Crisp LED) */}
          <Path d="M 3,46 C 6,43 14,44 18,46 C 12,48 5,50 3,46 Z" fill="#FEF08A" />
          {/* Taillights (Modern Red LED Bar) */}
          <Path d="M 148,46 C 145,43 138,44 134,46 C 140,48 147,50 148,46 Z" fill="#EF4444" />

          {/* Front Wheel */}
          <G transform="translate(22, 54)">
            <Circle cx="10" cy="10" r="13" fill="url(#wheelGrad)" />
            <Circle cx="10" cy="10" r="7.5" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <Circle cx="10" cy="10" r="3" fill="#1E293B" />
          </G>

          {/* Rear Wheel */}
          <G transform="translate(112, 54)">
            <Circle cx="10" cy="10" r="13" fill="url(#wheelGrad)" />
            <Circle cx="10" cy="10" r="7.5" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <Circle cx="10" cy="10" r="3" fill="#1E293B" />
          </G>

          {/* Side Mirror */}
          <Path
            d="M 44,28 C 42,26 40,26 38,28 C 38,30 42,32 45,30 Z"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default CarVisual;
