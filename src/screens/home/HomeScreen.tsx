import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { HomeExploreMap } from '../../components/map/HomeExploreMap';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { AMBIENCE_MALL, DLF_CYBER_CITY, GURUGRAM_HOME, IGI_AIRPORT } from '../../data';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';
import type { LocationPoint } from '../../types';

type Props = any;

const SHORTCUTS: {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  location: LocationPoint;
}[] = [
  {
    id: 'home',
    label: 'Home',
    subtitle: 'Sector 56',
    icon: 'home-outline',
    location: GURUGRAM_HOME,
  },
  {
    id: 'work',
    label: 'Work',
    subtitle: 'DLF Cyber City',
    icon: 'briefcase-outline',
    location: DLF_CYBER_CITY,
  },
  {
    id: 'recent',
    label: 'Recent',
    subtitle: 'Ambience Mall',
    icon: 'star',
    location: AMBIENCE_MALL,
  },
];

const POPULAR_NEARBY: {
  id: string;
  title: string;
  meta: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  location: LocationPoint;
}[] = [
  {
    id: 'cyber',
    title: 'DLF Cyber City',
    meta: '12 km · 25 min',
    icon: 'business',
    iconBg: '#EEF3FF',
    iconColor: '#5B8DEF',
    location: DLF_CYBER_CITY,
  },
  {
    id: 'ambience',
    title: 'Ambience Mall',
    meta: '8 km · 18 min',
    icon: 'bag',
    iconBg: '#FFF3E8',
    iconColor: Colors.primary,
    location: AMBIENCE_MALL,
  },
  {
    id: 'airport',
    title: 'IGI Airport',
    meta: '14 km · 28 min',
    icon: 'airplane',
    iconBg: '#EEF6FF',
    iconColor: '#3B82F6',
    location: IGI_AIRPORT,
  },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const pickup = useRideStore((state) => state.pickup);
  const setDestination = useRideStore((state) => state.setDestination);
  const firstName = user.name.split(' ')[0];

  const handleDestinationPress = (dest: LocationPoint) => {
    setDestination(dest);
    navigation.navigate('RoutePreview');
  };

  const handleSearchPress = () => {
    navigation.navigate('LocationSearch');
  };

  const handleChangePickup = () => {
    navigation.navigate('LocationSearch', { mode: 'pickup' });
  };

  return (
    <View style={styles.container}>
      <HomeExploreMap />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.topRow, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          <View style={styles.greetingRow}>
            {/* <Avatar name={user.name} source={user.avatarUrl} size={48} /> */}
            <View style={styles.greetingTextWrap}>
              <Text style={styles.helloLine}>
                <Text style={styles.helloMuted}>Hello, </Text>
                <Text style={styles.helloName}>{firstName} </Text>
                <Text>👋</Text>
              </Text>
              <Text style={styles.needRide}>Need a ride?</Text>
            </View>
          </View>

          <View style={styles.logoCard}>
            <QuickRideLogo size="xs" />
          </View>
        </View>

        <View style={[styles.mapControls, { top: insets.top + 86 }]}>
          <TouchableOpacity activeOpacity={0.85} style={styles.mapControlBtn}>
            <Ionicons name="navigate" size={18} color={Colors.gray700} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.mapControlBtn}>
            <Ionicons name="locate-outline" size={20} color={Colors.gray700} />
          </TouchableOpacity>
        </View>

        <View style={styles.sheet}>
          <View style={styles.pickupRow}>
            <View style={styles.pickupPinCol}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.pickupDots}>
                <View style={styles.pickupDot} />
                <View style={styles.pickupDot} />
                <View style={styles.pickupDot} />
              </View>
            </View>
            <View style={styles.pickupInfo}>
              <Text style={styles.pickupLabel}>Pickup location</Text>
              <Text style={styles.pickupTitle}>Current location</Text>
              <Text style={styles.pickupSubtitle} numberOfLines={1}>
                {pickup.subtitle}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={handleChangePickup}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSearchPress}
            style={styles.searchBar}
          >
            <Ionicons name="search" size={18} color={Colors.primary} />
            <Text style={styles.searchPlaceholder}>Where are you going?</Text>
          </TouchableOpacity>

          <View style={styles.shortcutsRow}>
            {SHORTCUTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleDestinationPress(item.location)}
                style={styles.shortcutItem}
              >
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.shortcutLabel}>{item.label}</Text>
                  <Text style={styles.shortcutSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.popularHeader}>
            <Text style={styles.popularTitle}>Popular destinations</Text>
            {/* <TouchableOpacity activeOpacity={0.8} onPress={handleSearchPress}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity> */}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScroll}
          >
            {POPULAR_NEARBY.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => handleDestinationPress(item.location)}
                style={styles.popularCard}
              >
                <View style={[styles.popularIcon, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={16} color={item.iconColor} />
                </View>
                <View style={styles.popularCopy}>
                  <Text style={styles.popularName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.popularMeta}>{item.meta}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
    flexShrink: 1,
    marginTop: -8,
  },
  greetingTextWrap: {
    flexShrink: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
  },
  helloLine: {
    fontSize: 18,
    lineHeight: 24,
  },
  helloMuted: {
    color: Colors.gray600,
    fontWeight: '500',
  },
  helloName: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  needRide: {
    marginTop: 1,
    fontSize: 13,
    color: Colors.gray500,
  },
  logoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Layout.shadows.md,
  },
  mapControls: {
    position: 'absolute',
    right: Layout.spacing.lg,
    gap: 10,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  sheet: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    ...Layout.shadows.lg,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupPinCol: {
    width: 22,
    alignItems: 'center',
    marginTop: 14,
    marginRight: 10,
  },
  pickupDots: {
    marginTop: 4,
    alignItems: 'center',
    gap: 3,
  },
  pickupDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray300,
  },
  pickupInfo: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: 11,
    color: Colors.gray500,
    marginBottom: 2,
  },
  pickupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  pickupSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 1,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3B48A',
  },
  shortcutsRow: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 6,
  },
  shortcutItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shortcutLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  shortcutSubtitle: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 1,
    maxWidth: 88,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  popularScroll: {
    gap: 10,
    paddingRight: 4,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 8,
    minWidth: 168,
  },
  popularIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularCopy: {
    flexShrink: 1,
  },
  popularName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  popularMeta: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
});

export default HomeScreen;
