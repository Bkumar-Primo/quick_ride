import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BookingMap } from '../../components/map/BookingMap';
import { MapControlsColumn, RideSheet, SoftPillButton } from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchingDriver'>;

const STEPS = [
  'Searching\nfor drivers',
  'Driver\non the way',
  'Arriving\nsoon',
  'Trip\nin progress',
];

export const SearchingDriverScreen: React.FC<Props> = ({ navigation }) => {
  const currentStatus = useRideStore((state) => state.currentStatus);
  const cancelRide = useRideStore((state) => state.cancelRide);
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const vehicleIcon: keyof typeof Ionicons.glyphMap =
    selectedVehicle.group === 'bike' ? 'bicycle' : selectedVehicle.group === 'auto' ? 'bus' : 'car';

  useEffect(() => {
    if (
      currentStatus === 'DRIVER_ASSIGNED' ||
      currentStatus === 'DRIVER_ARRIVING' ||
      currentStatus === 'DRIVER_ARRIVED'
    ) {
      navigation.replace('DriverAssigned');
    }
  }, [currentStatus, navigation]);

  return (
    <View style={styles.container}>
      <BookingMap mode="searching" />
      <View style={styles.driversCard}>
        <View style={styles.driversIcon}>
          <Ionicons name={vehicleIcon} size={14} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.driversTitle}>Nearby drivers</Text>
          <Text style={styles.driversSub}>4 drivers in your area</Text>
        </View>
      </View>
      <MapControlsColumn top={120} />

      <RideSheet>
        <View style={styles.head}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Finding you a driver</Text>
            <Text style={styles.sub}>
              We’re checking nearby drivers. This usually takes less than a minute.
            </Text>
          </View>
          <View style={styles.waitBox}>
            <Text style={styles.waitVal}>~ 1 min</Text>
            <Text style={styles.waitLabel}>Estimated wait</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {STEPS.map((label, index) => (
            <View key={label} style={styles.step}>
              <View style={[styles.stepIcon, index === 0 && styles.stepIconOn]}>
                <Ionicons
                  name={
                    index === 0
                      ? vehicleIcon
                      : index === 1
                        ? 'person-outline'
                        : index === 2
                          ? vehicleIcon
                          : 'checkmark'
                  }
                  size={14}
                  color={index === 0 ? Colors.white : Colors.gray400}
                />
              </View>
              <Text style={[styles.stepLabel, index === 0 && styles.stepLabelOn]}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.route}>
          <View style={styles.routeCol}>
            <Text style={styles.pinLabel}>Pickup location</Text>
            <Text style={styles.place}>{pickup.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
          <View style={styles.routeCol}>
            <Text style={styles.pinLabel}>Destination</Text>
            <Text style={styles.place}>{destination?.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
        </View>

        <SoftPillButton
          title="Cancel ride"
          onPress={() => {
            cancelRide();
            navigation.navigate('MainTabs', { screen: 'HomeTab' });
          }}
        />
      </RideSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  driversCard: {
    position: 'absolute',
    top: 58,
    right: 70,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 6,
    ...Layout.shadows.md,
  },
  driversIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driversTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  driversSub: { fontSize: 11, color: Colors.gray500 },
  head: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 6, lineHeight: 18 },
  waitBox: { alignItems: 'flex-end' },
  waitVal: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  waitLabel: { fontSize: 11, color: Colors.gray500 },
  timeline: { flexDirection: 'row', marginBottom: 16 },
  step: { flex: 1, alignItems: 'flex-start' },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepIconOn: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: 11, color: Colors.gray400, lineHeight: 14 },
  stepLabelOn: { color: Colors.textPrimary, fontWeight: '700' },
  route: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  routeCol: { flex: 1 },
  pinLabel: { fontSize: 11, color: Colors.gray500 },
  place: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  city: { fontSize: 12, color: Colors.gray500 },
});

export default SearchingDriverScreen;
