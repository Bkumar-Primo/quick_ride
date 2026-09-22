import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';

type Props = Partial<NativeStackScreenProps<AuthStackParamList, 'Splash'>> & {
  onFinish?: () => void;
};

const splashMasterBg = require('../../assets/images/splash_master_bg.png');

export const SplashScreen: React.FC<Props> = ({ navigation, onFinish }) => {
  const insets = useSafeAreaInsets();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start(() => {
      if (onFinish) {
        onFinish();
        return;
      }
      const { isAuthenticated, hasGrantedLocation, hasCompletedOnboarding } =
        useAuthStore.getState();
      if (isAuthenticated && hasGrantedLocation) {
        return;
      }
      if (hasCompletedOnboarding) {
        navigation?.replace('Login');
      } else {
        navigation?.replace('Onboarding');
      }
    });
  }, [navigation, onFinish, progressAnim, fadeAnim]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Master Background Artwork - exactly matching the mock image */}
      <Image source={splashMasterBg} style={styles.masterBackground} resizeMode="cover" />

      {/* Interactive Animated Progress Bar Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            bottom: Math.max(insets.bottom + 36, 60),
          },
        ]}
      >
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: barWidth }]} />
        </View>
        <Text style={styles.loadingText}>Getting things ready...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8',
    position: 'relative',
  },
  masterBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    width: 175,
    height: 6,
    backgroundColor: '#F3E8DE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF5B00',
    borderRadius: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
});

export default SplashScreen;
