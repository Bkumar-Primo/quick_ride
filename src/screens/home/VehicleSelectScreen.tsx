import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { SimulatedMap } from '../../components/map/SimulatedMap';
import { VehicleCard } from '../../components/ride/VehicleCard';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { MOCK_OFFERS, MOCK_VEHICLES } from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleSelect'>;

export const VehicleSelectScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useRideStore((state) => state.setSelectedVehicle);
  const startSearching = useRideStore((state) => state.startSearchingForDriver);
  const appliedPromo = useRideStore((state) => state.appliedPromo);
  const user = useUserStore((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState<'Wallet' | 'Cash'>('Wallet');

  const handleBookRide = () => {
    startSearching();
    navigation.navigate('SearchingDriver');
  };

  const finalFare = selectedVehicle
    ? Math.max(selectedVehicle.price - (appliedPromo?.maxDiscount || 0), 50)
    : 189;

  return (
    <View style={styles.container}>
      {/* Top Header with Route Overview protected from notch */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.routeHeaderInfo}>
          <Text style={styles.destinationTitle} numberOfLines={1}>
            {destination?.title || 'Bandra Kurla Complex'}
          </Text>
          <Text style={styles.routeMetrics}>14.8 km • ~28 min travel time</Text>
        </View>
        <View style={styles.trafficTag}>
          <Text style={styles.trafficTagText}>Fast</Text>
        </View>
      </View>

      {/* Interactive Simulated Map with Route Polyline */}
      <View style={styles.mapSection}>
        <SimulatedMap
          height={180}
          showRoute={true}
          pickupLocation={pickup}
          destinationLocation={destination || undefined}
        />
      </View>

      {/* Vehicle Options Sheet */}
      <View style={styles.sheetContainer}>
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesList}
        >
          <Text style={styles.sheetTitle}>Choose a Ride Option</Text>

          {MOCK_VEHICLES.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              isSelected={selectedVehicle.id === v.id}
              onSelect={() => setSelectedVehicle(v)}
            />
          ))}

          {/* Promo Code Banner */}
          {appliedPromo && (
            <View style={styles.promoCard}>
              <View style={styles.promoLeft}>
                <Ionicons name="pricetag" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.promoCode}>{appliedPromo.code} applied</Text>
                  <Text style={styles.promoDesc}>
                    Saved ₹{appliedPromo.maxDiscount} on this ride
                  </Text>
                </View>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
          )}

          {/* Payment Method Selector */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <Ionicons
                name={paymentMethod === 'Wallet' ? 'wallet' : 'cash-outline'}
                size={20}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.paymentLabel}>
                  {paymentMethod === 'Wallet' ? 'QuickRide Wallet' : 'Cash on Drop'}
                </Text>
                <Text style={styles.paymentSub}>
                  {paymentMethod === 'Wallet'
                    ? `Balance: ₹${user.walletBalance}`
                    : 'Pay driver directly'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setPaymentMethod(paymentMethod === 'Wallet' ? 'Cash' : 'Wallet')}
              style={styles.changePaymentBtn}
            >
              <Text style={styles.changePaymentText}>Switch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Booking Button */}
        <View style={styles.footer}>
          <Button
            title={`Book ${selectedVehicle.name} • ₹${finalFare}`}
            onPress={handleBookRide}
            showArrow
            style={styles.confirmBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    marginRight: Layout.spacing.md,
  },
  routeHeaderInfo: {
    flex: 1,
  },
  destinationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  routeMetrics: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  trafficTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  trafficTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  mapSection: {
    width: '100%',
    overflow: 'hidden',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    marginTop: -16,
    ...Layout.shadows.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  vehiclesList: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.lg,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.md,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  promoCode: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  promoDesc: {
    fontSize: 11,
    color: Colors.gray600,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.gray500,
  },
  changePaymentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  changePaymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    backgroundColor: Colors.white,
  },
  confirmBtn: {
    width: '100%',
  },
});

export default VehicleSelectScreen;
