import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { Button } from '../common/Button';

interface SafetyModalProps {
  visible: boolean;
  onClose: () => void;
  driverName?: string;
  vehicleNumber?: string;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  visible,
  onClose,
  driverName = 'Rahul Sharma',
  vehicleNumber = 'MH 02 CD 4821',
}) => {
  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS Triggered',
      'Your live GPS coordinates and driver details have been shared with our 24x7 Safety Response Team and your emergency contacts.',
      [{ text: 'Dismiss', onPress: onClose }],
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Live Trip Link Generated',
      `Link copied to clipboard: https://quickride.com/track/live-demo\n\nShared with your emergency contact (Mom).`,
      [{ text: 'Done', onPress: onClose }],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.shieldIcon}>
              <Ionicons name="shield-checkmark" size={28} color="#10B981" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>QuickRide Safety Toolkit</Text>
          <Text style={styles.subtitle}>
            Your ride with {driverName} ({vehicleNumber}) is monitored by 24x7 QuickRide GPS Shield.
          </Text>

          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.8} onPress={handleShare}>
              <View style={[styles.optIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="share-social" size={20} color="#0284C7" />
              </View>
              <View style={styles.optText}>
                <Text style={styles.optTitle}>Share Live Trip</Text>
                <Text style={styles.optDesc}>Send real-time map link to friends & family</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert('Helpline', 'Connecting to 24/7 Helpline: 1800-QUICK-RIDE')
              }
            >
              <View style={[styles.optIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="headset" size={20} color="#D97706" />
              </View>
              <View style={styles.optText}>
                <Text style={styles.optTitle}>24x7 Safety Helpline</Text>
                <Text style={styles.optDesc}>Speak with a ride safety specialist</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionRow, styles.sosRow]}
              activeOpacity={0.8}
              onPress={handleSOS}
            >
              <View style={[styles.optIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="warning" size={20} color="#DC2626" />
              </View>
              <View style={styles.optText}>
                <Text style={[styles.optTitle, { color: Colors.danger }]}>Emergency SOS Alert</Text>
                <Text style={styles.optDesc}>Immediate police & rapid response dispatch</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Button
            title="Close Safety Toolkit"
            variant="secondary"
            onPress={onClose}
            style={{ marginTop: Layout.spacing.lg }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  content: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    ...Layout.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  shieldIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Layout.spacing.lg,
    lineHeight: 18,
  },
  optionsList: {
    gap: Layout.spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  sosRow: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  optIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  optText: {
    flex: 1,
  },
  optTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optDesc: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});

export default SafetyModal;
