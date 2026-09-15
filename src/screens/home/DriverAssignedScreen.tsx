import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { SimulatedMap } from '../../components/map/SimulatedMap';
import { DriverCard } from '../../components/ride/DriverCard';
import { SafetyModal } from '../../components/ride/SafetyModal';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverAssigned'>;

export const DriverAssignedScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRide = useRideStore((state) => state.activeRide);
  const currentStatus = useRideStore((state) => state.currentStatus);
  const simulateDriverArrived = useRideStore((state) => state.simulateDriverArrived);
  const startTrip = useRideStore((state) => state.startTrip);
  const cancelRide = useRideStore((state) => state.cancelRide);

  const [safetyModalVisible, setSafetyModalVisible] = useState(false);

  const driver = activeRide?.driver;

  const handleStartTrip = () => {
    startTrip();
    navigation.replace('ActiveRide');
  };

  const handleCancel = () => {
    Alert.alert('Cancel Ride?', 'Are you sure you want to cancel this ride request?', [
      { text: 'No, keep ride', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          cancelRide();
          navigation.navigate('MainTabs', { screen: 'RideTab' });
        },
      },
    ]);
  };

  if (!driver) {
    return null;
  }

  const isArrived = currentStatus === 'DRIVER_ARRIVED';

  return (
    <View style={styles.container}>
      {/* Top Floating ETA Banner with Safe Inset Protection */}
      <View style={[styles.topBanner, { top: insets.top + 10 }]}>
        <View style={styles.etaPill}>
          <View style={[styles.statusDot, isArrived && styles.statusDotGreen]} />
          <Text style={styles.etaText}>
            {isArrived ? 'Driver Has Arrived!' : 'Captain Arriving in 3 min'}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSafetyModalVisible(true)}
          style={styles.safetyIconBtn}
        >
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Simulated Map with live route & moving car */}
      <View style={styles.mapArea}>
        <SimulatedMap
          height="100%"
          showRoute={true}
          driverEnRoute={true}
          progressPercent={isArrived ? 95 : 45}
        />
      </View>

      {/* Driver Card & Controls Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <DriverCard
          driver={driver}
          otpPin={activeRide.otpPin}
          onCall={() =>
            Alert.alert('Calling Driver', `Calling ${driver.name} at ${driver.phone}...`)
          }
          onChat={() => Alert.alert('Chat', `Opening chat with ${driver.name}`)}
          onSafety={() => setSafetyModalVisible(true)}
        />

        {/* Demo Driver Actions */}
        <View style={styles.actionRow}>
          {!isArrived ? (
            <Button
              title="Simulate: Driver Arrived"
              variant="outline"
              size="md"
              onPress={simulateDriverArrived}
              style={{ flex: 1 }}
            />
          ) : (
            <Button
              title="Start Ride (Driver Verified PIN)"
              variant="primary"
              size="md"
              showArrow
              onPress={handleStartTrip}
              style={{ flex: 1 }}
            />
          )}
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={handleCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Safety Toolkit Modal */}
      <SafetyModal
        visible={safetyModalVisible}
        onClose={() => setSafetyModalVisible(false)}
        driverName={driver.name}
        vehicleNumber={driver.carNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBanner: {
    position: 'absolute',
    top: 54,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadows.md,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  statusDotGreen: {
    backgroundColor: '#10B981',
  },
  etaText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  safetyIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  actionRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.md,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },
});

export default DriverAssignedScreen;
