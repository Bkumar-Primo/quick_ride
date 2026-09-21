import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { BookingMap } from '../../components/map/BookingMap';
import { DriverRidePanel } from '../../components/ride/DriverRidePanel';
import {
  MapControlsColumn,
  RideSheet,
  RoundIconButton,
  SoftPillButton,
} from '../../components/ride/RideChrome';
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
  const cancelRide = useRideStore((state) => state.cancelRide);
  const { showDialog } = useAppDialog();
  const [safetyOpen, setSafetyOpen] = useState(false);

  const hasArrived = currentStatus === 'DRIVER_ARRIVED';

  useEffect(() => {
    if (currentStatus === 'RIDE_IN_PROGRESS') {
      navigation.replace('ActiveRide');
    }
  }, [currentStatus, navigation]);

  const driver = activeRide?.driver;
  if (!driver || !activeRide) return null;

  const cancel = () => {
    showDialog({
      title: 'Cancel Ride?',
      message: 'Are you sure you want to cancel this ride?',
      tone: 'warning',
      actions: [
        { label: 'Keep ride', variant: 'secondary' },
        {
          label: 'Cancel ride',
          variant: 'danger',
          onPress: () => {
            cancelRide();
            navigation.navigate('MainTabs', { screen: 'HomeTab' });
          },
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <BookingMap mode={hasArrived ? 'arrived' : 'assigned'} />
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <RoundIconButton icon="chevron-back" onPress={() => navigation.goBack()} />
        {!hasArrived ? (
          <View style={styles.share}>
            <Ionicons name="share-outline" size={16} color={Colors.gray700} />
            <Text style={styles.shareText}>Share trip</Text>
          </View>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
      <MapControlsColumn top={insets.top + 86} />

      <RideSheet>
        <View style={styles.head}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {hasArrived ? 'Your driver has arrived!' : 'Driver is on the way'}
            </Text>
            <Text style={styles.sub}>
              {hasArrived
                ? 'Your driver has reached the pickup point. Starting your ride now.'
                : 'Your driver is heading to the pickup point.'}
            </Text>
          </View>
          {hasArrived ? (
            <View style={styles.arrivedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
              <Text style={styles.arrivedText}>Arrived</Text>
            </View>
          ) : (
            <View style={styles.etaBox}>
              <Text style={styles.etaVal}>3 min</Text>
              <Text style={styles.etaSub}>1.2 km away</Text>
            </View>
          )}
        </View>

        <DriverRidePanel
          driver={driver}
          vehicle={activeRide.vehicle}
          onCall={() => navigation.navigate('DriverCall')}
          onMessage={() => navigation.navigate('DriverChat')}
          showDirections={hasArrived}
          onDirections={() =>
            showDialog({ title: 'Directions', message: 'Opening walk directions to pickup.' })
          }
        />

        <View style={styles.route}>
          <View style={styles.routeCol}>
            <Text style={styles.pinLabel}>{hasArrived ? 'Pickup point' : 'Pickup location'}</Text>
            <Text style={styles.place}>{activeRide.pickup.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
          {!hasArrived ? (
            <View style={styles.routeCol}>
              <Text style={styles.pinLabel}>Destination</Text>
              <Text style={styles.place}>{activeRide.destination.title}</Text>
              <Text style={styles.city}>Gurugram, Haryana</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          {!hasArrived ? (
            <SoftPillButton title="Cancel Ride" onPress={cancel} style={{ flex: 1 }} />
          ) : null}
        </View>
        {hasArrived ? (
          <Text style={styles.hint}>Your ride will begin automatically in a few seconds.</Text>
        ) : null}
      </RideSheet>

      <SafetyModal
        visible={safetyOpen}
        onClose={() => setSafetyOpen(false)}
        driverName={driver.name}
        vehicleNumber={driver.carNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...Layout.shadows.md,
  },
  shareText: { fontWeight: '700', color: Colors.textPrimary },
  head: { flexDirection: 'row', marginBottom: 14, gap: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 4 },
  etaBox: { alignItems: 'flex-end' },
  etaVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  etaSub: { fontSize: 11, color: Colors.gray500 },
  arrivedBadge: {
    backgroundColor: '#FFF1E6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 2,
  },
  arrivedText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  route: { flexDirection: 'row', gap: 12, marginTop: 14, marginBottom: 16 },
  routeCol: { flex: 1 },
  pinLabel: { fontSize: 11, color: Colors.gray500 },
  place: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  city: { fontSize: 12, color: Colors.gray500 },
  actions: { flexDirection: 'row', gap: 10 },
  hint: { textAlign: 'center', color: Colors.gray400, fontSize: 12, marginTop: 10 },
});

export default DriverAssignedScreen;
