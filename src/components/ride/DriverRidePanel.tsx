import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { images } from '../../../assets';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { DriverInfo, VehicleOption } from '../../types';
import { Avatar } from '../common/Avatar';

export const DriverRidePanel: React.FC<{
  driver: DriverInfo;
  vehicle?: VehicleOption;
  subtitle?: string;
  showDirections?: boolean;
  onDirections?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
}> = ({ driver, vehicle, subtitle, showDirections, onDirections, onCall, onMessage }) => {
  const capacityText = vehicle?.group === 'bike' ? '1 rider' : `${vehicle?.capacity ?? 4} seats`;
  const fallbackIcon: keyof typeof Ionicons.glyphMap =
    vehicle?.group === 'bike' || driver.carCategory === 'Bike'
      ? 'bicycle'
      : vehicle?.group === 'auto' || driver.carCategory === 'Auto'
        ? 'bus-outline'
        : 'car';

  const carImageSource =
    vehicle?.imageUrl ||
    (typeof driver.carImageUrl === 'string' ? { uri: driver.carImageUrl } : driver.carImageUrl);

  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <View>
            {/* <Avatar name={driver.name} source={driver.avatar} size={56} /> */}
            <Image source={images.driver} style={{ height: 56, width: 56, borderRadius: 28 }} />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#F59E0B" />
              <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.meta}>
              {driver.totalTrips.toLocaleString()}+ rides
              {subtitle ? `  ·  ${subtitle}` : ''}
            </Text>
            {subtitle ? null : <Text style={styles.friendly}>Friendly driver · On time</Text>}
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={onCall} activeOpacity={0.85}>
            <Ionicons name="call-outline" size={18} color={Colors.gray700} />
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={onMessage} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.gray700} />
            <Text style={styles.actionLabel}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carRow}>
        {carImageSource ? (
          <Image source={carImageSource} style={styles.carImage} resizeMode="contain" />
        ) : (
          <View style={styles.carFallback}>
            <Ionicons name={fallbackIcon} size={28} color={Colors.gray400} />
          </View>
        )}
        <View style={styles.carCopy}>
          <Text style={styles.carModel}>{driver.carModel}</Text>
          <Text style={styles.carMeta}>
            {driver.carColor} · {capacityText} · {driver.carCategory || vehicle?.name || 'premium'}
          </Text>
          <View style={styles.plate}>
            <Text style={styles.plateText}>{driver.carNumber}</Text>
          </View>
        </View>
        {showDirections ? (
          <TouchableOpacity style={styles.directions} onPress={onDirections} activeOpacity={0.85}>
            <Ionicons name="navigate" size={16} color={Colors.gray700} />
            <Text style={styles.directionsText}>Directions</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  identity: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  identityCopy: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  friendly: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
    ...Layout.shadows.sm,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  action: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.gray600,
  },
  carRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 10,
    gap: 10,
  },
  carImage: {
    width: 88,
    height: 52,
  },
  carFallback: {
    width: 88,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carCopy: {
    flex: 1,
  },
  carModel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  carMeta: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  plate: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.white,
  },
  plateText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: Colors.textPrimary,
  },
  directions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  directionsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray700,
  },
});

export default DriverRidePanel;
