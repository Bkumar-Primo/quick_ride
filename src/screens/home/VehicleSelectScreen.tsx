import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import { PrimaryPillButton, RideSheet, RoundIconButton } from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import {
  DEMO_ROUTE,
  RIDE_GROUPS,
  startingFareForGroup,
  vehicleCapacityLabel,
  vehiclesInGroup,
} from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';
import type { RideGroup, VehicleOption } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleSelect'>;

export const VehicleSelectScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useRideStore((state) => state.setSelectedVehicle);

  const activeGroup = selectedVehicle.group;
  const options = vehiclesInGroup(activeGroup);

  const selectGroup = (group: RideGroup) => {
    if (group === activeGroup) return;
    const next = vehiclesInGroup(group)[0];
    if (next) setSelectedVehicle(next);
  };

  return (
    <View style={styles.container}>
      <BookingMap mode="choose" />
      <RoundIconButton
        icon="chevron-back"
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + 8 }]}
      />

      <RideSheet style={styles.sheet}>
        <Text style={styles.title}>Choose your ride</Text>
        <Text style={styles.sub}>Bike, auto, or cab — pick what fits this trip.</Text>

        <View style={styles.routeCard}>
          <View style={styles.routeTop}>
            <View style={styles.routeCol}>
              <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
              <View>
                <Text style={styles.place}>{pickup.title}</Text>
                <Text style={styles.city}>Gurugram, Haryana</Text>
              </View>
            </View>
            <View style={styles.routeCol}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#EF4444" />
              <View>
                <Text style={styles.place}>{destination?.title}</Text>
                <Text style={styles.city}>Gurugram, Haryana</Text>
              </View>
            </View>
          </View>
          <View style={styles.routeMeta}>
            <Text style={styles.metaText}>{DEMO_ROUTE.distanceKm} km</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{DEMO_ROUTE.durationMin} min</Text>
          </View>
        </View>

        <View style={styles.groups}>
          {RIDE_GROUPS.map((group) => {
            const on = group.id === activeGroup;
            return (
              <TouchableOpacity
                key={group.id}
                activeOpacity={0.9}
                onPress={() => selectGroup(group.id)}
                style={[styles.groupCard, on && styles.groupCardOn]}
              >
                <MaterialCommunityIcons
                  name={group.icon}
                  size={26}
                  color={on ? Colors.primary : Colors.gray700}
                />
                <Text style={[styles.groupLabel, on && styles.groupLabelOn]}>{group.label}</Text>
                <Text style={styles.groupFare}>from ₹{startingFareForGroup(group.id)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {options.map((vehicle) => (
            <VehicleRow
              key={vehicle.id}
              vehicle={vehicle}
              selected={selectedVehicle.id === vehicle.id}
              onSelect={() => setSelectedVehicle(vehicle)}
            />
          ))}
        </ScrollView>

        <Text style={styles.disclaimer}>
          All prices include estimated fare. Final fare may vary based on traffic and route.
        </Text>
        <PrimaryPillButton
          title={`Book ${selectedVehicle.name}  ·  ₹${selectedVehicle.price}`}
          onPress={() => navigation.navigate('BookingConfirm')}
        />
      </RideSheet>
    </View>
  );
};

const VehicleRow: React.FC<{
  vehicle: VehicleOption;
  selected: boolean;
  onSelect: () => void;
}> = ({ vehicle, selected, onSelect }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onSelect}
    style={[styles.vehicleCard, selected && styles.vehicleCardOn]}
  >
    {vehicle.imageUrl ? (
      <Image source={vehicle.imageUrl} style={styles.carImg} resizeMode="contain" />
    ) : (
      <View style={styles.carImg} />
    )}
    <View style={styles.vehicleCopy}>
      <View style={styles.nameRow}>
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        {vehicle.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{vehicle.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.vehicleMeta}>
        {vehicleCapacityLabel(vehicle)} · {vehicle.etaMinutes} min away
      </Text>
      <Text style={styles.tagline}>{vehicle.tagline}</Text>
    </View>
    <View style={styles.priceCol}>
      <View style={[styles.radio, selected && styles.radioOn]} />
      <Text style={styles.price}>₹{vehicle.price}</Text>
      <Text style={styles.est}>Estimated fare</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  back: { position: 'absolute', left: 16, zIndex: 6 },
  sheet: { maxHeight: '82%' },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 4, marginBottom: 14 },
  routeCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  routeTop: { flexDirection: 'row', gap: 12 },
  routeCol: { flex: 1, flexDirection: 'row', gap: 6 },
  place: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  city: { fontSize: 11, color: Colors.gray500 },
  routeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  metaText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  metaDot: { color: Colors.gray400, fontWeight: '700' },
  groups: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  groupCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 4,
  },
  groupCardOn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8F2',
  },
  groupLabel: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  groupLabelOn: { color: Colors.primary },
  groupFare: { fontSize: 11, color: Colors.gray500, fontWeight: '600' },
  list: { gap: 10, paddingBottom: 8 },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 18,
    padding: 10,
    gap: 8,
  },
  vehicleCardOn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8F2',
  },
  carImg: { width: 78, height: 48 },
  vehicleCopy: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  vehicleMeta: { fontSize: 12, color: Colors.gray600, marginTop: 2 },
  tagline: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  priceCol: { alignItems: 'flex-end', width: 86 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray300,
    marginBottom: 6,
  },
  radioOn: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  price: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  est: { fontSize: 10, color: Colors.gray500 },
  disclaimer: { fontSize: 11, color: Colors.gray500, marginVertical: 10, lineHeight: 16 },
});

export default VehicleSelectScreen;
