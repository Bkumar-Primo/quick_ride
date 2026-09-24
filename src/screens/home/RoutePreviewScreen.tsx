import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import { PrimaryPillButton, RideSheet, RoundIconButton } from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { DEMO_ROUTE } from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RoutePreview'>;

export const RoutePreviewScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);

  return (
    <View style={styles.container}>
      <BookingMap mode="preview" />
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <RoundIconButton icon="chevron-back" onPress={() => navigation.goBack()} />
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('LocationSearch')}
        >
          <Ionicons name="pencil" size={14} color={Colors.gray700} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <RideSheet>
        <Text style={styles.title}>Route preview</Text>
        <Text style={styles.sub}>Check your trip details before choosing a ride.</Text>

        <View style={styles.routeRow}>
          <View style={styles.routeCol}>
            <View style={styles.pinLine}>
              <Ionicons name="location-sharp" size={18} color="#10B981" />
              <View>
                <Text style={styles.place}>{pickup.title}</Text>
                <Text style={styles.city}>Mohali, Punjab</Text>
              </View>
            </View>
          </View>
          <View style={styles.routeCol}>
            <View style={styles.pinLine}>
              <Ionicons name="location-sharp" size={18} color="#EF4444" />
              <View>
                <Text style={styles.place}>{destination?.title}</Text>
                <Text style={styles.city}>Mohali, Punjab</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Ionicons name="trail-sign-outline" size={18} color={Colors.gray500} />
            <View>
              <Text style={styles.metricVal}>{DEMO_ROUTE.distanceKm} km</Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
          </View>
          <View style={styles.metric}>
            <Ionicons name="time-outline" size={18} color={Colors.gray500} />
            <View>
              <Text style={styles.metricVal}>{DEMO_ROUTE.durationMin} min</Text>
              <Text style={styles.metricLabel}>Est. travel time</Text>
            </View>
          </View>
          <View style={styles.metric}>
            <Text style={styles.rupee}>₹</Text>
            <View>
              <Text style={styles.metricVal}>~ ₹{DEMO_ROUTE.estimatedFare}</Text>
              <Text style={styles.metricLabel}>Estimated fare</Text>
            </View>
          </View>
        </View>

        <PrimaryPillButton
          title="Choose Ride"
          onPress={() => navigation.navigate('VehicleSelect')}
        />
      </RideSheet>
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Layout.shadows.md,
  },
  editText: { fontWeight: '700', color: Colors.textPrimary },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 4, marginBottom: 18 },
  routeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  routeCol: { flex: 1 },
  pinLabel: { fontSize: 11, color: Colors.gray500, marginBottom: 6 },
  pinLine: { flexDirection: 'row', gap: 8 },
  place: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  city: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  metrics: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },
  metric: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricVal: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.gray500 },
  rupee: { fontSize: 16, fontWeight: '800', color: Colors.gray500 },
});

export default RoutePreviewScreen;
