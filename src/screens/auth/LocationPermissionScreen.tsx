import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { openLocationSettings, requestCurrentLocation } from '../../services/location';
import { useAuthStore } from '../../store/authStore';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPermission'>;

const locationHero = require('../../assets/images/location_hero.png');

export const LocationPermissionScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const grantLocation = useAuthStore((state) => state.grantLocation);
  const skipLocation = useAuthStore((state) => state.skipLocation);

  const handleAllow = async () => {
    setLoading(true);
    const result = await requestCurrentLocation();
    setLoading(false);

    if (result.granted) {
      if (result.location) {
        useRideStore.getState().setPickup(result.location);
      }
      grantLocation();
      return;
    }

    Alert.alert('Location permission needed', result.message ?? 'Please allow location access.', [
      { text: 'Not Now', style: 'cancel' },
      result.canOpenSettings
        ? { text: 'Open Settings', onPress: openLocationSettings }
        : { text: 'Try Again', onPress: () => void handleAllow() },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroWrap, { paddingTop: insets.top }]}>
        <Image source={locationHero} style={styles.heroImage} resizeMode="cover" />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Allow location access</Text>
        <Text style={styles.description}>
          We need your location to find nearby drivers, show accurate pickup points, provide better
          routes, and give you a smooth ride experience.
        </Text>

        <Button
          title="Allow Location"
          icon="paper-plane"
          onPress={() => void handleAllow()}
          loading={loading}
          style={styles.allowBtn}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={skipLocation} style={styles.notNowBtn}>
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
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.heroCream,
  },
  heroWrap: {
    width: '100%',
    backgroundColor: Colors.heroCream,
  },
  heroImage: {
    width: '100%',
    height: 420,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.xl,
    marginTop: -36,
    ...Layout.shadows.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
    lineHeight: 21,
    paddingHorizontal: 4,
  },
  allowBtn: {
    marginBottom: Layout.spacing.sm,
    borderRadius: 999,
  },
  notNowBtn: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  notNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
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
    fontSize: 11,
    color: Colors.gray600,
    lineHeight: 16,
  },
});

export default LocationPermissionScreen;
