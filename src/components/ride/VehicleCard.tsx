import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { VehicleOption } from '../../types';

interface VehicleCardProps {
  vehicle: VehicleOption;
  isSelected: boolean;
  onSelect: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onSelect}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
          <Ionicons
            name={vehicle.iconName as any}
            size={28}
            color={isSelected ? Colors.primary : Colors.gray700}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{vehicle.name}</Text>
            <View style={styles.capacityRow}>
              <Ionicons name="person" size={12} color={Colors.gray500} />
              <Text style={styles.capacity}>{vehicle.capacity}</Text>
            </View>
          </View>
          <Text style={styles.eta}>
            {vehicle.etaMinutes} min away • <Text style={styles.tagline}>{vehicle.tagline}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.price}>₹{vehicle.price}</Text>
        {vehicle.badge && (
          <View
            style={[styles.badge, { backgroundColor: vehicle.badgeColor || Colors.primarySubtle }]}
          >
            <Text style={styles.badgeText}>{vehicle.badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    marginBottom: Layout.spacing.sm,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF9F5',
    ...Layout.shadows.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  selectedIconContainer: {
    backgroundColor: '#FFE9D6',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    gap: 2,
  },
  capacity: {
    fontSize: 12,
    color: Colors.gray600,
    fontWeight: '600',
  },
  eta: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  tagline: {
    color: Colors.gray400,
  },
  priceSection: {
    alignItems: 'flex-end',
    marginLeft: Layout.spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default VehicleCard;
