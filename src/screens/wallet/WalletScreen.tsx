import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { MOCK_OFFERS } from '../../data';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';

export const WalletScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const addFunds = useUserStore((state) => state.addFundsToWallet);
  const selectedPaymentMethod = useUserStore((state) => state.selectedPaymentMethod);
  const setPaymentMethod = useUserStore((state) => state.setPaymentMethod);
  const applyPromo = useRideStore((state) => state.applyPromo);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleTopUp = (amount: number) => {
    addFunds(amount);
    Alert.alert('Funds Added', `₹${amount} added successfully to your QuickRide Wallet!`);
  };

  const handleApplyPromo = (promo: any) => {
    applyPromo(promo);
    setCopiedCode(promo.code);
    Alert.alert('Promo Applied', `Promo code ${promo.code} has been applied to your next ride!`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Notch Protection */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        {navigation.canGoBack?.() ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.headerTitle}>Wallet & Offers</Text>
        <Text style={styles.headerSubtitle}>Manage funds, payment methods & discounts</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card with Orange Branding */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>QuickRide Cash Balance</Text>
              <Text style={styles.balanceAmount}>₹{user.walletBalance.toFixed(2)}</Text>
            </View>
            <View style={styles.walletIconCircle}>
              <Ionicons name="wallet" size={28} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.balanceSub}>100% safe & instant refunds</Text>

          {/* Quick Top-Up Pills */}
          <View style={styles.topUpRow}>
            {[100, 250, 500, 1000].map((amt) => (
              <TouchableOpacity
                key={amt}
                activeOpacity={0.8}
                onPress={() => handleTopUp(amt)}
                style={styles.topUpBtn}
              >
                <Text style={styles.topUpText}>+₹{amt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={styles.methodsList}>
          {[
            {
              id: 'QuickRide Wallet',
              label: `QuickRide Wallet (₹${user.walletBalance})`,
              icon: 'wallet',
            },
            { id: 'Google Pay', label: 'UPI / Google Pay', icon: 'logo-google' },
            { id: 'Credit Card', label: 'Credit / Debit Card (••4821)', icon: 'card-outline' },
            { id: 'Cash', label: 'Cash on Drop', icon: 'cash-outline' },
          ].map((method) => {
            const isSelected = selectedPaymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.8}
                onPress={() => setPaymentMethod(method.id as any)}
                style={[styles.methodRow, isSelected && styles.methodRowActive]}
              >
                <View style={styles.methodLeft}>
                  <Ionicons
                    name={method.icon as any}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.gray600}
                  />
                  <Text style={[styles.methodLabel, isSelected && styles.methodLabelActive]}>
                    {method.label}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Available Promos & Coupons */}
        <Text style={styles.sectionTitle}>Available Promo Codes</Text>
        <View style={styles.offersList}>
          {MOCK_OFFERS.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerLeft}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{offer.code}</Text>
                </View>
                <Text style={styles.offerDesc}>{offer.description}</Text>
                <Text style={styles.offerExpiry}>Expires in {offer.expiresInDays} days</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleApplyPromo(offer)}
                style={[styles.applyBtn, copiedCode === offer.code && styles.applyBtnApplied]}
              >
                <Text
                  style={[
                    styles.applyBtnText,
                    copiedCode === offer.code && styles.applyBtnTextApplied,
                  ]}
                >
                  {copiedCode === offer.code ? 'Applied' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxxl,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    ...Layout.shadows.orangeGlow,
    marginBottom: Layout.spacing.xl,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 4,
  },
  walletIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    marginBottom: Layout.spacing.lg,
  },
  topUpRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  topUpBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  topUpText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.xs,
  },
  methodsList: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xl,
    ...Layout.shadows.sm,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  methodRowActive: {
    backgroundColor: '#FFFBF7',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  methodLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  offersList: {
    gap: Layout.spacing.sm,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  offerLeft: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.xs,
    borderWidth: 1,
    borderColor: '#FFD8B2',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  offerDesc: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  offerExpiry: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.borderRadius.md,
  },
  applyBtnApplied: {
    backgroundColor: '#DCFCE7',
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  applyBtnTextApplied: {
    color: '#15803D',
  },
});

export default WalletScreen;
