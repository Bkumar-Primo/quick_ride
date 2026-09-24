import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import { PrimaryPillButton, RideSheet, RoundIconButton } from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import { DEMO_ROUTE, vehicleCapacityLabel } from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirm'>;

export const BookingConfirmScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const startSearching = useRideStore((state) => state.startSearchingForDriver);

  const confirm = () => {
    startSearching();
    navigation.navigate('SearchingDriver');
  };

  return (
    <View style={styles.container}>
      <BookingMap mode="confirm" />
      <RoundIconButton
        icon="chevron-back"
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + 8 }]}
      />

      <RideSheet>
        <View style={styles.head}>
          <View>
            <Text style={styles.title}>Confirm your ride</Text>
            <Text style={styles.sub}>Review your trip details before booking.</Text>
          </View>
          <TouchableOpacity
            style={styles.edit}
            onPress={() => navigation.navigate('VehicleSelect')}
          >
            <Ionicons name="pencil" size={13} color={Colors.primary} />
            <Text style={styles.editText}>Edit ride details</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.block}
          onPress={() => navigation.navigate('LocationSearch', { mode: 'pickup' })}
        >
          <Ionicons name="location-sharp" size={18} color="#10B981" />
          <View style={styles.blockCopy}>
            <Text style={styles.blockTitle}>{pickup.title}</Text>
            <Text style={styles.blockSub}>Mohali, Punjab</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.block}
          onPress={() => navigation.navigate('LocationSearch')}
        >
          <Ionicons name="location-sharp" size={18} color="#EF4444" />
          <View style={styles.blockCopy}>
            <Text style={styles.blockTitle}>{destination?.title}</Text>
            <Text style={styles.blockSub}>Mohali, Punjab</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.vehicle}
          onPress={() => navigation.navigate('VehicleSelect')}
        >
          {selectedVehicle.imageUrl ? (
            <Image source={selectedVehicle.imageUrl} style={styles.car} resizeMode="contain" />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
            <Text style={styles.vehicleMeta}>
              {vehicleCapacityLabel(selectedVehicle)} · {selectedVehicle.etaMinutes} min away
            </Text>
            <Text style={styles.tagline}>{selectedVehicle.tagline}</Text>
          </View>
          <Text style={styles.price}>₹{selectedVehicle.price}</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
        </TouchableOpacity>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricVal}>{DEMO_ROUTE.distanceKm} km</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricVal}>{DEMO_ROUTE.durationMin} min</Text>
            <Text style={styles.metricLabel}>Est. duration</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricVal}>₹{selectedVehicle.price}</Text>
            <Text style={styles.metricLabel}>Estimated fare</Text>
          </View>
        </View>

        {/* <View style={styles.payHead}>
          <Text style={styles.payTitle}>Payment method</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.change}>Change ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.payRow}>
          <View style={styles.cardIcon}>
            <Ionicons name="card" size={16} color="#3B82F6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.payMask}>•••• 4242</Text>
            <Text style={styles.payBank}>HDFC Bank</Text>
          </View>
          <View style={styles.defaultPill}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
        </View> */}

        <PrimaryPillButton title="Confirm Ride" onPress={confirm} style={{ marginTop: 16 }} />
        <Text style={styles.legal}>
          By confirming, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </RideSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  back: { position: 'absolute', left: 16, zIndex: 6 },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 4, maxWidth: 200 },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1E6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  block: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  blockCopy: { flex: 1 },
  blockLabel: { fontSize: 11, color: Colors.gray500 },
  blockTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  blockSub: { fontSize: 12, color: Colors.gray500 },
  vehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
    marginTop: 6,
  },
  car: { width: 72, height: 44 },
  vehicleName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  vehicleMeta: { fontSize: 12, color: Colors.gray600 },
  tagline: { fontSize: 11, color: Colors.gray500 },
  price: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  metrics: { flexDirection: 'row', marginVertical: 12 },
  metric: { flex: 1 },
  metricVal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  payHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  payTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  change: { color: Colors.gray500, fontWeight: '600' },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payMask: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  payBank: { fontSize: 12, color: Colors.gray500 },
  defaultPill: {
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  defaultText: { color: '#15803D', fontSize: 11, fontWeight: '700' },
  legal: { fontSize: 11, color: Colors.gray400, textAlign: 'center', marginTop: 10 },
});

export default BookingConfirmScreen;
