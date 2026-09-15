import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { DriverInfo } from '../../types';
import { Avatar } from '../common/Avatar';

interface DriverCardProps {
  driver: DriverInfo;
  otpPin?: string;
  onCall?: () => void;
  onChat?: () => void;
  onSafety?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  otpPin = '4821',
  onCall,
  onChat,
  onSafety,
}) => {
  return (
    <View style={styles.container}>
      {/* OTP PIN Alert Header */}
      <View style={styles.pinBanner}>
        <View style={styles.pinLeft}>
          <Ionicons name="key-outline" size={18} color={Colors.primary} />
          <Text style={styles.pinLabel}>Share PIN to start ride</Text>
        </View>
        <View style={styles.pinBadge}>
          <Text style={styles.pinNumber}>{otpPin}</Text>
        </View>
      </View>

      {/* Driver Info Body */}
      <View style={styles.body}>
        <View style={styles.driverLeft}>
          <Avatar name={driver.name} size={48} />
          <View style={styles.driverText}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
              <Text style={styles.tripsText}>• {driver.totalTrips}+ trips</Text>
            </View>
            <Text style={styles.carDetail}>
              {driver.carModel} • <Text style={styles.plate}>{driver.carNumber}</Text>
            </Text>
          </View>
        </View>

        {/* Action Buttons: Call & Chat */}
        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.8} onPress={onCall} style={styles.actionBtn}>
            <Ionicons name="call" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={onChat} style={styles.actionBtn}>
            <Ionicons name="chatbubble" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          {onSafety && (
            <TouchableOpacity activeOpacity={0.8} onPress={onSafety} style={styles.safetyBtn}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    ...Layout.shadows.lg,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  pinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  pinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray700,
  },
  pinBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  pinNumber: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: Layout.spacing.md,
    backgroundColor: Colors.gray200,
  },
  driverText: {
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tripsText: {
    fontSize: 12,
    color: Colors.gray500,
  },
  carDetail: {
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 2,
  },
  plate: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginLeft: Layout.spacing.sm,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DriverCard;
