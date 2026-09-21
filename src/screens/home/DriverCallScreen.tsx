import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverCall'>;

export const DriverCallScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const driver = useRideStore((state) => state.activeRide?.driver);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!driver) navigation.goBack();
  }, [driver, navigation]);

  if (!driver) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calling driver</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Avatar name={driver.name} source={driver.avatar} size={108} />
          </View>
        </View>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.status}>Connecting to {driver.phone}</Text>
        <View style={styles.vehiclePill}>
          <Ionicons name="car-outline" size={16} color={Colors.primary} />
          <Text style={styles.vehicleText}>
            {driver.carModel} · {driver.carNumber}
          </Text>
        </View>
      </View>

      <View
        style={[styles.controls, { paddingBottom: Math.max(insets.bottom, Layout.spacing.xl) }]}
      >
        <TouchableOpacity
          style={[styles.utilityControl, speakerOn && styles.utilityControlActive]}
          activeOpacity={0.85}
          onPress={() => setSpeakerOn((current) => !current)}
        >
          <Ionicons
            name={speakerOn ? 'volume-high' : 'volume-high-outline'}
            size={22}
            color={speakerOn ? Colors.primary : Colors.textPrimary}
          />
          <Text style={[styles.utilityText, speakerOn && styles.utilityTextActive]}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.utilityControl, muted && styles.utilityControlActive]}
          activeOpacity={0.85}
          onPress={() => setMuted((current) => !current)}
        >
          <Ionicons
            name={muted ? 'mic-off' : 'mic-off-outline'}
            size={22}
            color={muted ? Colors.primary : Colors.textPrimary}
          />
          <Text style={[styles.utilityText, muted && styles.utilityTextActive]}>Mute</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endControl}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={26} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.heroCream },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.full,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },
  headerSpacer: { width: 42 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: Layout.spacing.xl },
  ringOuter: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.14)',
    borderRadius: 94,
    height: 188,
    justifyContent: 'center',
    width: 188,
  },
  ringInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.22)',
    borderRadius: 74,
    height: 148,
    justifyContent: 'center',
    width: 148,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: Layout.spacing.xl,
  },
  status: { color: Colors.gray500, fontSize: 14, marginTop: Layout.spacing.sm },
  vehiclePill: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.full,
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  vehicleText: { color: Colors.gray700, fontSize: 12, fontWeight: '700' },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.xl,
  },
  utilityControl: {
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    gap: Layout.spacing.xs,
    padding: Layout.spacing.sm,
  },
  utilityControlActive: { backgroundColor: Colors.primarySubtle },
  utilityText: { color: Colors.gray700, fontSize: 12, fontWeight: '600' },
  utilityTextActive: { color: Colors.primaryDark },
  endControl: {
    alignItems: 'center',
    backgroundColor: Colors.danger,
    borderRadius: Layout.borderRadius.full,
    height: 64,
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
    width: 64,
  },
});

export default DriverCallScreen;
