import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { SimulatedMap } from '../../components/map/SimulatedMap';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { POPULAR_DESTINATIONS } from '../../data';
import { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';

type Props = any; // Stack or Tab navigation

const RIDE_CATEGORIES = [
  { id: 'cat-1', title: 'Daily Ride', icon: 'car-sport', color: '#FF6B00' },
  { id: 'cat-2', title: 'Rental', icon: 'time', color: '#3B82F6' },
  { id: 'cat-3', title: 'Outstation', icon: 'trail-sign', color: '#10B981' },
  { id: 'cat-4', title: 'Reserve', icon: 'calendar', color: '#8B5CF6' },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const pickup = useRideStore((state) => state.pickup);
  const setDestination = useRideStore((state) => state.setDestination);

  const handleDestinationPress = (dest: any) => {
    setDestination(dest);
    navigation.navigate('VehicleSelect');
  };

  const handleSearchPress = () => {
    navigation.navigate('LocationSearch');
  };

  return (
    <View style={styles.container}>
      {/* Top Header with User Greeting and Notification protected from notch */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 6 }]}>
        <View style={styles.userGreeting}>
          <Avatar name={user.name} size={40} />
          <View>
            <Text style={styles.greetingText}>Good day,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.walletPill}>
            <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
            <Text style={styles.walletText}>₹{user.walletBalance}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.bellBtn}
            onPress={() => navigation.navigate('ActivityTab')}
          >
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Floating Search Bar */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleSearchPress} style={styles.searchBar}>
          <View style={styles.searchIconBg}>
            <Ionicons name="search" size={20} color={Colors.primary} />
          </View>
          <View style={styles.searchPlaceholder}>
            <Text style={styles.searchMainText}>Where to?</Text>
            <Text style={styles.searchSubText}>Search destination or pickup spot</Text>
          </View>
          <View style={styles.nowBadge}>
            <Ionicons name="time" size={14} color={Colors.gray700} />
            <Text style={styles.nowText}>Now ⌵</Text>
          </View>
        </TouchableOpacity>

        {/* Live Vector Map Simulation */}
        <View style={styles.mapContainer}>
          <SimulatedMap
            height={220}
            showNearbyDrivers={true}
            pickupLocation={pickup}
            onPressMap={handleSearchPress}
          />
        </View>

        {/* Quick Destination Pills */}
        <View style={styles.quickDestinations}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destScroll}
          >
            {user.savedPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.8}
                onPress={() => handleDestinationPress(place)}
                style={styles.destPill}
              >
                <View style={styles.destIconBg}>
                  <Ionicons
                    name={
                      place.type === 'home'
                        ? 'home'
                        : place.type === 'work'
                          ? 'briefcase'
                          : place.type === 'airport'
                            ? 'airplane'
                            : 'location'
                    }
                    size={16}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.destTitle} numberOfLines={1}>
                  {place.title.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ride Category Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ride Options</Text>
        </View>
        <View style={styles.categoriesGrid}>
          {RIDE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={handleSearchPress}
              style={styles.categoryCard}
            >
              <View style={[styles.catIconBg, { backgroundColor: `${cat.color}15` }]}>
                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <Text style={styles.catTitle}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Promo Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSearchPress}
          style={styles.promoBanner}
        >
          <View style={styles.promoLeft}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>LIMITED OFFER</Text>
            </View>
            <Text style={styles.promoHeading}>20% OFF on all Prime Rides</Text>
            <Text style={styles.promoSub}>Use promo code QUICK50 at checkout</Text>
          </View>
          <View style={styles.promoIconContainer}>
            <Ionicons name="gift" size={32} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Recent Ride Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Destination</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleDestinationPress(POPULAR_DESTINATIONS[0])}
          style={styles.recentCard}
        >
          <View style={styles.recentIconContainer}>
            <Ionicons name="time-outline" size={20} color={Colors.gray600} />
          </View>
          <View style={styles.recentInfo}>
            <Text style={styles.recentTitle}>{POPULAR_DESTINATIONS[0].title}</Text>
            <Text style={styles.recentSubtitle} numberOfLines={1}>
              {POPULAR_DESTINATIONS[0].subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  greetingText: {
    fontSize: 12,
    color: Colors.gray500,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  walletText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xxl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.xl,
    ...Layout.shadows.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  searchIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  searchPlaceholder: {
    flex: 1,
  },
  searchMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchSubText: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  nowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  nowText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray700,
  },
  mapContainer: {
    marginHorizontal: Layout.spacing.lg,
    marginVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  quickDestinations: {
    marginVertical: Layout.spacing.sm,
  },
  destScroll: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  destPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 8,
    ...Layout.shadows.sm,
  },
  destIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionHeader: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  catIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xs,
  },
  catTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2430',
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.xl,
    ...Layout.shadows.md,
  },
  promoLeft: {
    flex: 1,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  promoHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  promoSub: {
    fontSize: 12,
    color: Colors.gray300,
    marginTop: 2,
  },
  promoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D3546',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Layout.spacing.md,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recentSubtitle: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});

export default HomeScreen;
