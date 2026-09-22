import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import {
  MapControlsColumn,
  MapSheetScreen,
  RideSheet,
  RoundIconButton,
} from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import {
  AMBIENCE_MALL,
  CURRENT_LOCATION,
  DLF_CYBER_CITY,
  GURUGRAM_HOME,
  IGI_AIRPORT,
  MG_ROAD_METRO,
  POPULAR_DESTINATIONS,
} from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';
import type { LocationPoint } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationSearch'>;

const RECENT = [AMBIENCE_MALL, DLF_CYBER_CITY, MG_ROAD_METRO];
const SUGGESTED = [
  {
    loc: DLF_CYBER_CITY,
    meta: '12 km · 25 min',
    icon: 'business' as const,
    bg: '#EEF3FF',
    color: '#5B8DEF',
  },
  {
    loc: AMBIENCE_MALL,
    meta: '8 km · 18 min',
    icon: 'bag' as const,
    bg: '#FFF3E8',
    color: Colors.primary,
  },
  {
    loc: IGI_AIRPORT,
    meta: '14 km · 28 min',
    icon: 'airplane' as const,
    bg: '#EEF6FF',
    color: '#3B82F6',
  },
];
const SEARCHABLE = [GURUGRAM_HOME, ...POPULAR_DESTINATIONS];

export const LocationSearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDestination = useRideStore((state) => state.setDestination);
  const [query, setQuery] = useState('');
  const isPickupSelection = route.params?.mode === 'pickup';
  const returnsToDestination = route.params?.returnTo === 'destination';

  const select = (loc: LocationPoint) => {
    if (isPickupSelection) {
      setPickup(loc);

      if (returnsToDestination) {
        navigation.navigate({
          name: 'LocationSearch',
          params: { mode: 'destination' },
          merge: true,
        });
      } else {
        navigation.goBack();
      }
      return;
    }

    setDestination(loc);
    navigation.navigate('RoutePreview');
  };

  const isSearching = query.trim().length > 0;
  const needle = query.trim().toLowerCase();
  const filteredResults = isSearching
    ? SEARCHABLE.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.subtitle.toLowerCase().includes(needle) ||
          item.address.toLowerCase().includes(needle),
      )
    : [];

  return (
    <MapSheetScreen
      mapFlex={0.32}
      map={<BookingMap mode="search" />}
      overlay={
        <>
          <View style={[styles.topBar, { top: insets.top + 8 }]} pointerEvents="box-none">
            <RoundIconButton icon="chevron-back" onPress={() => navigation.goBack()} />
            <TouchableOpacity
              style={styles.pickupPill}
              onPress={() =>
                navigation.navigate({
                  name: 'LocationSearch',
                  params: {
                    mode: isPickupSelection ? 'destination' : 'pickup',
                    returnTo: isPickupSelection ? undefined : 'destination',
                  },
                  merge: true,
                })
              }
            >
              <Text style={styles.pickupLabel}>{isPickupSelection ? 'Destination' : 'Pickup'}</Text>
              <Text style={styles.pickupValue} numberOfLines={1}>
                {isPickupSelection ? destination?.title || 'Where to?' : pickup.title} ›
              </Text>
            </TouchableOpacity>
          </View>
          <MapControlsColumn bottom={16} />
        </>
      }
    >
      <RideSheet style={styles.sheet}>
        <Text style={styles.hero}>{isPickupSelection ? 'Where from?' : 'Where to?'}</Text>
        <Text style={styles.heroSub}>
          {isPickupSelection
            ? 'Search for the address where your ride should start'
            : 'Enter a destination to see ride options'}
        </Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.primary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={isPickupSelection ? 'Search pickup location' : 'Search destination'}
            placeholderTextColor="#F3B48A"
            style={styles.searchInput}
          />
        </View>

        {!isSearching ? (
          <View style={styles.shortcuts}>
            {isPickupSelection ? (
              <TouchableOpacity style={styles.shortItem} onPress={() => select(CURRENT_LOCATION)}>
                <Ionicons name="locate" size={18} color={Colors.primary} />
                <View style={styles.shortCopy}>
                  <Text style={styles.shortTitle}>Current location</Text>
                  <Text style={styles.shortSub} numberOfLines={1}>
                    Use your device location
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.shortItem} onPress={() => select(GURUGRAM_HOME)}>
              <Ionicons name="home-outline" size={18} color={Colors.primary} />
              <View style={styles.shortCopy}>
                <Text style={styles.shortTitle}>Home</Text>
                <Text style={styles.shortSub} numberOfLines={1}>
                  Sector 56
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortItem} onPress={() => select(DLF_CYBER_CITY)}>
              <Ionicons name="briefcase-outline" size={18} color={Colors.primary} />
              <View style={styles.shortCopy}>
                <Text style={styles.shortTitle}>Work</Text>
                <Text style={styles.shortSub} numberOfLines={1}>
                  DLF Cyber City
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortItem} onPress={() => select(AMBIENCE_MALL)}>
              <Ionicons name="star" size={18} color={Colors.primary} />
              <View style={styles.shortCopy}>
                <Text style={styles.shortTitle}>Recent</Text>
                <Text style={styles.shortSub} numberOfLines={1}>
                  Ambience Mall
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {isSearching ? (
            <>
              <Text style={[styles.sectionTitle, styles.resultsTitle]}>Search results</Text>
              {filteredResults.length === 0 ? (
                <Text style={styles.empty}>No matching places. Try a mall, metro, or area.</Text>
              ) : (
                filteredResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listRow}
                    onPress={() => select(item)}
                  >
                    <Ionicons name="location-outline" size={18} color={Colors.gray400} />
                    <View style={styles.listCopy}>
                      <Text style={styles.listTitle}>{item.title}</Text>
                      <Text style={styles.listSub}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
                  </TouchableOpacity>
                ))
              )}
            </>
          ) : null}

          <View style={[styles.sectionHead, isSearching && styles.sectionSpaced]}>
            <Text style={styles.sectionTitle}>Recent locations</Text>
          </View>
          {RECENT.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listRow} onPress={() => select(item)}>
              <Ionicons name="time-outline" size={18} color={Colors.gray400} />
              <View style={styles.listCopy}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listSub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, styles.sectionSpaced]}>
            {isPickupSelection ? 'Suggested pickup locations' : 'Suggested destinations'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestRow}
          >
            {SUGGESTED.map((item) => (
              <TouchableOpacity
                key={item.loc.id}
                style={styles.suggestCard}
                onPress={() => select(item.loc)}
              >
                <View style={[styles.suggestIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={16} color={item.color} />
                </View>
                <View>
                  <Text style={styles.listTitle}>{item.loc.title}</Text>
                  <Text style={styles.listSub}>{item.meta}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </RideSheet>
    </MapSheetScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 16,
    right: 70,
    zIndex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickupPill: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Layout.shadows.md,
  },
  pickupLabel: { fontSize: 11, color: Colors.gray500 },
  pickupValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  sheet: { flex: 1 },
  hero: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  heroSub: { fontSize: 13, color: Colors.gray500, marginTop: 4, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  shortcuts: { flexDirection: 'row', marginTop: 16, marginBottom: 4, gap: 8 },
  shortItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  shortCopy: { flex: 1, minWidth: 0 },
  shortTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  shortSub: { fontSize: 11, color: Colors.gray500 },
  list: { flex: 1, minHeight: 0, marginTop: 4 },
  scroll: { paddingBottom: 12 },
  resultsTitle: { marginTop: 10, marginBottom: 6 },
  empty: { fontSize: 13, color: Colors.gray500, marginBottom: 8, lineHeight: 18 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sectionSpaced: { marginTop: 16, marginBottom: 8 },
  seeAll: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  listCopy: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  listSub: { fontSize: 12, color: Colors.gray500, marginTop: 1 },
  suggestRow: { gap: 10, paddingRight: 8 },
  suggestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gray100,
    borderRadius: 16,
    padding: 10,
    minWidth: 168,
  },
  suggestIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationSearchScreen;
