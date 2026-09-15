import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { POPULAR_DESTINATIONS } from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { requestCurrentLocation } from '../../services/location';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';
import type { LocationPoint } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationSearch'>;

export const LocationSearchScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDestination = useRideStore((state) => state.setDestination);
  const user = useUserStore((state) => state.user);

  const [pickupText, setPickupText] = useState(pickup.title);
  const [destText, setDestText] = useState('');

  const handleUseCurrentLocation = async () => {
    const result = await requestCurrentLocation();
    if (result.granted && result.location) {
      setPickup(result.location);
      setPickupText(result.location.title);
      return;
    }
    Alert.alert('Location unavailable', result.message ?? 'Could not read your current location.');
  };

  const handleSelectLocation = (loc: LocationPoint) => {
    setDestination(loc);
    navigation.navigate('VehicleSelect');
  };

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(destText.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(destText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Top Search Inputs Card with Notch Inset Protection */}
      <View style={[styles.headerCard, { paddingTop: insets.top + 6 }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Route</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Pickup & Destination Boxes */}
        <View style={styles.inputContainer}>
          <View style={styles.pinsColumn}>
            <View style={styles.greenDot} />
            <View style={styles.dotLine} />
            <View style={styles.orangeSquare} />
          </View>

          <View style={styles.fieldsColumn}>
            {/* Pickup Input */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={pickupText}
                onChangeText={setPickupText}
                placeholder="Pickup location"
                placeholderTextColor={Colors.gray400}
              />
              <TouchableOpacity onPress={() => void handleUseCurrentLocation()}>
                <Ionicons name="locate" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputDivider} />

            {/* Destination Input */}
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.input, styles.destInput]}
                value={destText}
                onChangeText={setDestText}
                placeholder="Where to? (e.g. BKC, Airport)"
                placeholderTextColor={Colors.gray400}
                autoFocus
              />
              {destText.length > 0 && (
                <TouchableOpacity onPress={() => setDestText('')}>
                  <Ionicons name="close-circle" size={18} color={Colors.gray400} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {/* Saved Places */}
        <Text style={styles.sectionTitle}>Saved Places</Text>
        <View style={styles.savedGrid}>
          {user.savedPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              activeOpacity={0.8}
              onPress={() => handleSelectLocation(place)}
              style={styles.savedPlaceCard}
            >
              <View style={styles.savedIconBg}>
                <Ionicons
                  name={
                    place.type === 'home'
                      ? 'home'
                      : place.type === 'work'
                        ? 'briefcase'
                        : 'location'
                  }
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.savedInfo}>
                <Text style={styles.savedTitle}>{place.title}</Text>
                <Text style={styles.savedSubtitle} numberOfLines={1}>
                  {place.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Destinations */}
        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        <View style={styles.placesList}>
          {filteredDestinations.map((place) => (
            <TouchableOpacity
              key={place.id}
              activeOpacity={0.7}
              onPress={() => handleSelectLocation(place)}
              style={styles.placeRow}
            >
              <View style={styles.placeIconContainer}>
                <Ionicons
                  name={
                    place.type === 'airport'
                      ? 'airplane'
                      : place.type === 'work'
                        ? 'business'
                        : 'location-outline'
                  }
                  size={20}
                  color={Colors.gray600}
                />
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {place.subtitle}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Colors.gray400} />
            </TouchableOpacity>
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
  headerCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  pinsColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    marginRight: Layout.spacing.md,
    paddingVertical: 4,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  dotLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray300,
    marginVertical: 2,
  },
  orangeSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  fieldsColumn: {
    flex: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  destInput: {
    fontWeight: '600',
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 2,
  },
  listContent: {
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.xs,
  },
  savedGrid: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  savedPlaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  savedIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  savedInfo: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  savedSubtitle: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  placesList: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    ...Layout.shadows.sm,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  placeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  placeAddress: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});

export default LocationSearchScreen;
