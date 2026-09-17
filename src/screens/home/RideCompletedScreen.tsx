import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import { DriverRidePanel } from '../../components/ride/DriverRidePanel';
import {
  PrimaryPillButton,
  RideSheet,
  RoundIconButton,
  SoftPillButton,
} from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RideCompleted'>;

export const RideCompletedScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRide = useRideStore((state) => state.activeRide);
  const resetRide = useRideStore((state) => state.resetRide);
  const driver = activeRide?.driver;
  const fare = activeRide?.fareBreakdown;

  const done = () => {
    resetRide();
    navigation.navigate('MainTabs', { screen: 'HomeTab' });
  };

  return (
    <View style={styles.container}>
      <BookingMap mode="completed" />
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <RoundIconButton icon="close" onPress={done} />
        <View style={styles.heroCopy}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={28} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>You’ve arrived!</Text>
          <Text style={styles.heroSub}>Thanks for riding with us 🙏</Text>
          <View style={styles.safer}>
            <Text style={styles.saferText}>A safer, smarter tomorrow</Text>
          </View>
        </View>
      </View>

      <RideSheet>
        <View style={styles.summaryHead}>
          <View>
            <Text style={styles.title}>Trip summary</Text>
            <Text style={styles.sub}>Tue, 16 Sep 2025 · 9:12 AM – 9:49 AM</Text>
          </View>
          <View style={styles.fareBox}>
            <Text style={styles.fareVal}>₹{fare?.totalFare ?? 328}</Text>
            <Text style={styles.fareLabel}>Final fare</Text>
          </View>
        </View>

        <View style={styles.route}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pinLabel}>Pickup</Text>
            <Text style={styles.place}>{activeRide?.pickup.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
          <Text style={styles.time}>9:12 AM</Text>
        </View>
        <View style={styles.route}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pinLabel}>Destination</Text>
            <Text style={styles.place}>{activeRide?.destination.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
          <Text style={styles.time}>9:49 AM</Text>
        </View>

        <View style={styles.metrics}>
          <View>
            <Text style={styles.metricVal}>{activeRide?.distanceKm ?? 12.6} km</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View>
            <Text style={styles.metricVal}>37 min</Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>
          <View>
            <Text style={styles.metricVal}>20 km/h</Text>
            <Text style={styles.metricLabel}>Avg. speed</Text>
          </View>
        </View>

        {driver ? <DriverRidePanel driver={driver} vehicle={activeRide?.vehicle} /> : null}

        <Text style={styles.fareTitle}>Fare details</Text>
        <View style={styles.fareRow}>
          <Text style={styles.fareItem}>Base fare</Text>
          <Text style={styles.fareItemVal}>₹{fare?.baseFare ?? 280}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.fareItem}>Time & distance</Text>
          <Text style={styles.fareItemVal}>₹{fare?.distanceFare ?? 48}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.total}>Total paid</Text>
          <Text style={styles.totalVal}>₹{fare?.totalFare ?? 328}</Text>
        </View>

        <View style={styles.actions}>
          <SoftPillButton
            title="View receipt"
            onPress={() => Alert.alert('Receipt', 'Receipt will be emailed to you.')}
            style={{ flex: 1 }}
          />
          <PrimaryPillButton title="Done" onPress={done} style={{ flex: 1 }} />
        </View>
      </RideSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  hero: { paddingHorizontal: 16, paddingBottom: 20 },
  heroCopy: { alignItems: 'center', marginTop: 8 },
  check: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  heroSub: { fontSize: 14, color: Colors.gray600, marginTop: 4 },
  safer: {
    marginTop: 8,
    backgroundColor: '#ECFDF3',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  saferText: { color: '#15803D', fontWeight: '700', fontSize: 12 },
  summaryHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 12, color: Colors.gray500, marginTop: 4 },
  fareBox: { alignItems: 'flex-end' },
  fareVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  fareLabel: { fontSize: 11, color: Colors.gray500 },
  route: { flexDirection: 'row', marginBottom: 8 },
  pinLabel: { fontSize: 11, color: Colors.gray500 },
  place: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  city: { fontSize: 12, color: Colors.gray500 },
  time: { fontSize: 12, color: Colors.gray500 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  metricVal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.gray500 },
  fareTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  fareItem: { color: Colors.gray600 },
  fareItemVal: { fontWeight: '600', color: Colors.textPrimary },
  total: { fontWeight: '800', color: Colors.textPrimary },
  totalVal: { fontWeight: '800', color: Colors.textPrimary },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
});

export default RideCompletedScreen;
