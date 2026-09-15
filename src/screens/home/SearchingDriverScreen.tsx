import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { SimulatedMap } from '../../components/map/SimulatedMap';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchingDriver'>;

const SEARCH_STATUSES = [
  'Broadcasting request to nearby drivers...',
  'Matching top-rated captain for your ride...',
  'Confirming driver arrival time...',
];

export const SearchingDriverScreen: React.FC<Props> = ({ navigation }) => {
  const currentStatus = useRideStore((state) => state.currentStatus);
  const cancelRide = useRideStore((state) => state.cancelRide);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const _destination = useRideStore((state) => state.destination);

  const [statusIndex, setStatusIndex] = useState(0);

  // Concentric Radar Rings Animation
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createRingAnim = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const anim1 = createRingAnim(ring1, 0);
    const anim2 = createRingAnim(ring2, 600);
    const anim3 = createRingAnim(ring3, 1200);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [ring1, ring2, ring3]);

  // Rotate status message
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % SEARCH_STATUSES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Listen for driver assignment from rideStore
  useEffect(() => {
    if (currentStatus === 'DRIVER_ASSIGNED' || currentStatus === 'DRIVER_ARRIVED') {
      navigation.replace('DriverAssigned');
    }
  }, [currentStatus, navigation]);

  const handleCancel = () => {
    cancelRide();
    navigation.navigate('MainTabs', { screen: 'RideTab' });
  };

  const getRingStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0.8, 0.4, 0],
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 2.5],
        }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Simulated Map */}
      <View style={styles.mapBackground}>
        <SimulatedMap height="100%" showNearbyDrivers={true} />
        <View style={styles.mapOverlay} />
      </View>

      {/* Main Radar & Status Content */}
      <View style={styles.content}>
        {/* Radar Center Visual */}
        <View style={styles.radarContainer}>
          <Animated.View style={[styles.radarRing, getRingStyle(ring1)]} />
          <Animated.View style={[styles.radarRing, getRingStyle(ring2)]} />
          <Animated.View style={[styles.radarRing, getRingStyle(ring3)]} />

          <View style={styles.radarCenter}>
            <QuickRideLogo showIconOnly size="md" />
          </View>
        </View>

        {/* Searching Status Sheet */}
        <View style={styles.bottomCard}>
          <View style={styles.handle} />

          <View style={styles.rideBadge}>
            <Ionicons name="car-sport" size={16} color={Colors.primary} />
            <Text style={styles.rideBadgeText}>Searching for {selectedVehicle.name}</Text>
          </View>

          <Text style={styles.mainTitle}>Connecting with Captain</Text>
          <Text style={styles.statusMessage}>{SEARCH_STATUSES[statusIndex]}</Text>

          {/* Quick Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.infoText}>
              All QuickRide captains are background-verified and follow safety protocols.
            </Text>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity activeOpacity={0.8} onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mapBackground: {
    ...(StyleSheet.absoluteFill as any),
  },
  mapOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radarContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  radarRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
  },
  radarCenter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.orangeGlow,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  radarLogo: {
    width: 44,
    height: 44,
  },
  bottomCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
    alignItems: 'center',
    ...Layout.shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    marginBottom: Layout.spacing.md,
  },
  rideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 6,
    marginBottom: Layout.spacing.sm,
  },
  rideBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: Layout.spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    gap: Layout.spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: Layout.spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.gray700,
    lineHeight: 16,
  },
  cancelBtn: {
    width: '100%',
    height: 50,
    borderRadius: Layout.borderRadius.xl,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.danger,
  },
});

export default SearchingDriverScreen;
