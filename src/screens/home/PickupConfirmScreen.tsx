import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingMap } from '../../components/map/BookingMap';
import {
  MapControlsColumn,
  PrimaryPillButton,
  RideSheet,
  RoundIconButton,
} from '../../components/ride/RideChrome';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { CP67_MALL_DESTINATION, CURRENT_LOCATION, MOHALI_HOME } from '../../data';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupConfirm'>;

export const PickupConfirmScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const pickup = useRideStore((state) => state.pickup);
  const setPickup = useRideStore((state) => state.setPickup);

  return (
    <View style={styles.container}>
      <BookingMap mode="pickup" />

      <View style={[styles.topBar, { top: insets.top + 8 }]} pointerEvents="box-none">
        <RoundIconButton icon="chevron-back" onPress={() => navigation.goBack()} />
        <View style={styles.titleCard}>
          <Text style={styles.title}>Set pickup location</Text>
          <Text style={styles.subtitle}>Drag the pin to adjust</Text>
        </View>
      </View>

      <MapControlsColumn top={insets.top + 86} />

      <RideSheet>
        <TouchableOpacity
          style={styles.pickupRow}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('LocationSearch', { mode: 'pickup' })}
        >
          <Ionicons name="location-sharp" size={20} color="#10B981" />
          <View style={styles.pickupCopy}>
            <Text style={styles.pickupTitle}>{pickup.title}</Text>
            <Text style={styles.pickupSub}>{pickup.subtitle}</Text>
          </View>
          <Text style={styles.change}>Change</Text>
        </TouchableOpacity>

        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={styles.shortcut}
            activeOpacity={0.85}
            onPress={() => setPickup(CURRENT_LOCATION)}
          >
            <Ionicons name="locate" size={18} color={Colors.primary} />
            <Text style={styles.shortcutTitle}>Use current{'\n'}location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            activeOpacity={0.85}
            onPress={() => setPickup(MOHALI_HOME)}
          >
            <Ionicons name="home-outline" size={18} color={Colors.gray700} />
            <View>
              <Text style={styles.shortcutName}>Home</Text>
              <Text style={styles.shortcutSub}>Sector 70, Mohali</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            activeOpacity={0.85}
            onPress={() => setPickup({ ...CP67_MALL_DESTINATION, type: 'work' })}
          >
            <Ionicons name="briefcase-outline" size={18} color={Colors.gray700} />
            <View>
              <Text style={styles.shortcutName}>Work</Text>
              <Text style={styles.shortcutSub}>CP 67 Mall</Text>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryPillButton
          title="Confirm Pickup"
          onPress={() => navigation.navigate('LocationSearch')}
        />
      </RideSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Layout.shadows.md,
  },
  title: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  pickupRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  pickupCopy: { flex: 1 },
  pickupLabel: { fontSize: 11, color: Colors.gray500 },
  pickupTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  pickupSub: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
  change: { color: Colors.primary, fontWeight: '700', marginTop: 18 },
  shortcutRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray100,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  shortcut: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.gray100,
  },
  shortcutTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, lineHeight: 16 },
  shortcutName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  shortcutSub: { fontSize: 11, color: Colors.gray500 },
});

export default PickupConfirmScreen;
