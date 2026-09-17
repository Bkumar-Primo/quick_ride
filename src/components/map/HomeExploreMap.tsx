import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { MapVehicleLayer } from './MapVehicleMarker';
import { StaticMapBackground } from './StaticMapBackground';

const HOME_NEARBY = [
  { icon: 'bikeLite' as const, x: 42, y: 23 },
  { icon: 'auto' as const, x: 20, y: 34, flip: true },
  { icon: 'cabEconomy' as const, x: 80, y: 27 },
  { icon: 'cabSuv' as const, x: 71, y: 47, flip: true },
  { icon: 'bikePlus' as const, x: 54, y: 39, flip: true },
  { icon: 'cabPremium' as const, x: 32, y: 52 },
];

export const HomeExploreMap: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <StaticMapBackground />
      <MapVehicleLayer markers={HOME_NEARBY} />

      <View style={styles.youAreHere} pointerEvents="none">
        <View style={styles.hereBubble}>
          <Text style={styles.hereText}>You are here</Text>
        </View>
        <View style={styles.herePin}>
          <Animated.View
            style={[
              styles.hereHalo,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.35],
                  outputRange: [0.35, 0.08],
                }),
              },
            ]}
          />
          <View style={styles.hereDot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 18,
    left: 0,
    backgroundColor: '#E8EEF2',
  },
  youAreHere: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hereBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  hereText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  herePin: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hereHalo: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#60A5FA',
  },
  hereDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 3,
    borderColor: Colors.white,
  },
});

export default HomeExploreMap;
