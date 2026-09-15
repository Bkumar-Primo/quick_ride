import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { SimulatedMap } from '../../components/map/SimulatedMap';
import { SafetyModal } from '../../components/ride/SafetyModal';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveRide'>;

export const ActiveRideScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRide = useRideStore((state) => state.activeRide);
  const completeTrip = useRideStore((state) => state.completeTrip);

  const [progress, setProgress] = useState(30);
  const [speed, setSpeed] = useState(44);
  const [safetyModalVisible, setSafetyModalVisible] = useState(false);

  // Animate progress incrementally
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 3;
      });
      setSpeed((prev) => 40 + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteRide = () => {
    completeTrip();
    navigation.replace('RideCompleted');
  };

  const driver = activeRide?.driver;
  const destination = activeRide?.destination;

  return (
    <View style={styles.container}>
      {/* Top Floating Navigation HUD with Notch Inset Protection */}
      <View style={[styles.topHud, { top: insets.top + 10 }]}>
        <View style={styles.directionCard}>
          <View style={styles.turnIconBg}>
            <Ionicons name="arrow-up" size={24} color={Colors.white} />
          </View>
          <View style={styles.directionTextContainer}>
            <Text style={styles.nextManeuver}>Continue straight for 2.1 km</Text>
            <Text style={styles.roadName}>Western Express Highway</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSafetyModalVisible(true)}
          style={styles.safetyIconBtn}
        >
          <Ionicons name="shield-checkmark" size={22} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Map View with live moving vehicle */}
      <View style={styles.mapArea}>
        <SimulatedMap
          height="100%"
          showRoute={true}
          driverEnRoute={true}
          progressPercent={progress}
        />
      </View>

      {/* Live Trip Status Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        {/* Status Line */}
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <View style={styles.livePulseDot} />
            <Text style={styles.tripStatusText}>Trip In Progress</Text>
          </View>
          <Text style={styles.etaText}>
            {Math.max(Math.round(28 * (1 - progress / 100)), 1)} min remaining
          </Text>
        </View>

        {/* Route Details */}
        <View style={styles.routeBox}>
          <View style={styles.routeItem}>
            <Ionicons name="navigate-circle" size={16} color={Colors.primary} />
            <Text style={styles.routeText} numberOfLines={1}>
              To: {destination?.title || 'Bandra Kurla Complex (BKC)'}
            </Text>
          </View>
        </View>

        {/* Telemetry Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{speed} km/h</Text>
            <Text style={styles.metricLabel}>Current Speed</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{(14.8 * (1 - progress / 100)).toFixed(1)} km</Text>
            <Text style={styles.metricLabel}>Distance Left</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{driver?.name.split(' ')[0] || 'Rahul'}</Text>
            <Text style={styles.metricLabel}>Captain</Text>
          </View>
        </View>

        {/* Demo Fast Forward Button */}
        <Button
          title="Simulate: Complete Ride / Drop-Off"
          onPress={handleCompleteRide}
          showArrow
          style={styles.completeBtn}
        />
      </View>

      <SafetyModal
        visible={safetyModalVisible}
        onClose={() => setSafetyModalVisible(false)}
        driverName={driver?.name}
        vehicleNumber={driver?.carNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topHud: {
    position: 'absolute',
    top: 54,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  directionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.md,
    ...Layout.shadows.md,
    gap: Layout.spacing.md,
  },
  turnIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionTextContainer: {
    flex: 1,
  },
  nextManeuver: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  roadName: {
    fontSize: 11,
    color: Colors.gray300,
    marginTop: 2,
  },
  safetyIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  mapArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xl,
    ...Layout.shadows.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  tripStatusText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  routeBox: {
    backgroundColor: Colors.gray50,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: Layout.borderRadius.lg,
    paddingVertical: Layout.spacing.md,
    marginVertical: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.gray300,
  },
  completeBtn: {
    marginTop: Layout.spacing.sm,
    width: '100%',
  },
});

export default ActiveRideScreen;
