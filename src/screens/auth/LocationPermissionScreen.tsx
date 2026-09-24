import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import type React from 'react';
import { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { Button } from '../../components/common/Button';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { SM_HEIGHTS_PICKUP } from '../../data/mockLocations';
import type { AuthStackParamList } from '../../navigation/types';
import { openLocationSettings, requestCurrentLocation } from '../../services/location';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPermission'>;

const locationHero = require('../../assets/images/allowLocation.png');

export const LocationPermissionScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const requestingRef = useRef(false);
  const { showDialog } = useAppDialog();

  const goToAllSet = () => {
    navigation.navigate('AllSet');
  };

  const handleAllow = async () => {
    if (requestingRef.current) return;
    requestingRef.current = true;
    setLoading(true);
    const result = await requestCurrentLocation();
    setLoading(false);
    requestingRef.current = false;

    if (result.granted) {
      useRideStore.getState().setPickup(result.location || SM_HEIGHTS_PICKUP);
      goToAllSet();
      return;
    }

    showDialog({
      title: 'Location permission needed',
      message: result.message ?? 'Please allow location access.',
      tone: 'warning',
      actions: [
        { label: 'Not Now', variant: 'secondary', onPress: goToAllSet },
        result.canOpenSettings
          ? { label: 'Open Settings', onPress: openLocationSettings }
          : { label: 'Try Again', onPress: () => void handleAllow() },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
          <View style={styles.topRow}>
            <QuickRideLogo size="md" />
          </View>

          <View style={styles.artWrap}>
            <Image source={locationHero} style={styles.heroImage} resizeMode="contain" />
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.35)', Colors.white]}
              locations={[0, 0.4, 1]}
              style={styles.heroFade}
            />
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>Allow location access</Text>
          <Text style={styles.description}>
            We need your location to find nearby drivers, show accurate pickup points, provide
            better routes, and give you a smooth ride experience.
          </Text>

          <Button
            title="Allow Location"
            icon="paper-plane"
            onPress={() => void handleAllow()}
            loading={loading}
            style={styles.allowBtn}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={goToAllSet} style={styles.notNowBtn}>
            <Text style={styles.notNowText}>Not Now</Text>
          </TouchableOpacity>

          <View style={styles.securityBox}>
            <Ionicons name="lock-closed" size={16} color={Colors.gray600} style={styles.lockIcon} />
            <Text style={styles.securityText}>
              Your location is only used to provide ride services and is kept private and secure.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.heroCream,
  },
  hero: {
    backgroundColor: Colors.heroCream,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  artWrap: {
    height: 340,
    marginTop: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  copy: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 8,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  allowBtn: {
    borderRadius: 999,
    backgroundColor: '#FF5B00',
  },
  notNowBtn: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  notNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5B00',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
  },
  lockIcon: {
    marginRight: Layout.spacing.sm,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: Colors.gray600,
    lineHeight: 16,
  },
});

export default LocationPermissionScreen;
