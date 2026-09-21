import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { BookingMap } from '../../components/map/BookingMap';
import { DriverRidePanel } from '../../components/ride/DriverRidePanel';
import {
  MapControlsColumn,
  RideSheet,
  RoundIconButton,
  SoftPillButton,
} from '../../components/ride/RideChrome';
import { SafetyModal } from '../../components/ride/SafetyModal';
import { Colors } from '../../constants/colors';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveRide'>;

export const ActiveRideScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRide = useRideStore((state) => state.activeRide);
  const currentStatus = useRideStore((state) => state.currentStatus);
  const { showDialog } = useAppDialog();
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (currentStatus === 'RIDE_COMPLETED') {
      navigation.replace('RideCompleted');
    }
  }, [currentStatus, navigation]);

  const driver = activeRide?.driver;
  if (!activeRide || !driver) return null;

  return (
    <View style={styles.container}>
      <BookingMap mode="inprogress" />
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <RoundIconButton icon="chevron-back" onPress={() => navigation.goBack()} />
      </View>
      <MapControlsColumn
        top={insets.top + 86}
        extra={
          <>
            <RoundIconButton icon="cube-outline" />
            <RoundIconButton
              icon="shield"
              color="#E11D48"
              onPress={() => setSafetyOpen(true)}
              style={styles.safetyBtn}
            />
          </>
        }
      />

      <RideSheet>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setDetailsOpen(true)}>
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Ride in progress</Text>
              <Text style={styles.sub}>Sit back and relax. You’ll reach soon.</Text>
            </View>
            <View style={styles.etaBox}>
              <Text style={styles.etaVal}>8 min</Text>
              <Text style={styles.etaSub}>2.5 km left</Text>
            </View>
          </View>
        </TouchableOpacity>

        <DriverRidePanel
          driver={driver}
          vehicle={activeRide.vehicle}
          onCall={() => navigation.navigate('DriverCall')}
          onMessage={() => navigation.navigate('DriverChat')}
        />

        <View style={styles.bottomGrid}>
          <View style={styles.routeCol}>
            <Text style={styles.place}>{activeRide.pickup.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
            <Text style={styles.time}>9:12 AM · Picked up</Text>
            <Text style={[styles.place, { marginTop: 10 }]}>{activeRide.destination.title}</Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
            <Text style={styles.time}>9:49 AM · Estimated arrival</Text>
          </View>
          <View style={styles.sideActions}>
            <TouchableOpacity
              style={styles.sideItem}
              onPress={() =>
                showDialog({
                  title: 'Share trip',
                  message: 'Live trip link copied.',
                  tone: 'success',
                })
              }
            >
              <Ionicons name="share-outline" size={16} color={Colors.gray700} />
              <Text style={styles.sideText}>Share trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideItem} onPress={() => setSafetyOpen(true)}>
              <Ionicons name="shield-outline" size={16} color={Colors.gray700} />
              <Text style={styles.sideText}>Safety center</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sideItem}
              onPress={() =>
                showDialog({ title: 'Help', message: 'Support will contact you shortly.' })
              }
            >
              <Ionicons name="headset-outline" size={16} color={Colors.gray700} />
              <Text style={styles.sideText}>Need help?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RideSheet>

      <Modal visible={detailsOpen} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <BookingMap mode="inprogress" />
          <RideSheet>
            <View style={styles.detailsHead}>
              <View>
                <Text style={styles.title}>Trip details</Text>
                <Text style={styles.sub}>Everything about your current ride</Text>
              </View>
              <RoundIconButton icon="close" onPress={() => setDetailsOpen(false)} />
            </View>
            <View style={styles.statusRow}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Ride in progress</Text>
              </View>
              <Text style={styles.started}>Started at 9:12 AM</Text>
            </View>
            <View style={styles.detailRoute}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pinLabel}>Pickup</Text>
                <Text style={styles.place}>{activeRide.pickup.title}</Text>
                <Text style={styles.city}>Gurugram, Haryana</Text>
              </View>
              <Text style={styles.timeRight}>9:12 AM{'\n'}Picked up</Text>
            </View>
            <View style={styles.detailRoute}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pinLabel}>Destination</Text>
                <Text style={styles.place}>{activeRide.destination.title}</Text>
                <Text style={styles.city}>Gurugram, Haryana</Text>
              </View>
              <Text style={styles.timeRight}>9:49 AM{'\n'}Est. arrival</Text>
            </View>
            <DriverRidePanel
              driver={driver}
              vehicle={activeRide.vehicle}
              onCall={() => navigation.navigate('DriverCall')}
              onMessage={() => navigation.navigate('DriverChat')}
            />
            <View style={styles.metrics}>
              <View>
                <Text style={styles.metricVal}>{activeRide.distanceKm} km</Text>
                <Text style={styles.metricLabel}>Distance</Text>
              </View>
              <View>
                <Text style={styles.metricVal}>
                  ₹{activeRide.vehicle.price} - ₹{activeRide.vehicle.price + 40}
                </Text>
                <Text style={styles.metricLabel}>Estimated fare</Text>
              </View>
              <View>
                <Text style={styles.metricVal}>QRD928374</Text>
                <Text style={styles.metricLabel}>Ride ID</Text>
              </View>
            </View>
            <SoftPillButton
              title="Share trip details"
              onPress={() =>
                showDialog({ title: 'Shared', message: 'Trip details copied.', tone: 'success' })
              }
            />
          </RideSheet>
        </View>
      </Modal>

      <SafetyModal
        visible={safetyOpen}
        onClose={() => setSafetyOpen(false)}
        driverName={driver.name}
        vehicleNumber={driver.carNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  topBar: { position: 'absolute', left: 16, zIndex: 6 },
  safetyBtn: { backgroundColor: '#FDF2F8' },
  head: { flexDirection: 'row', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 4 },
  etaBox: { alignItems: 'flex-end' },
  etaVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  etaSub: { fontSize: 11, color: Colors.gray500 },
  bottomGrid: { flexDirection: 'row', marginTop: 14, marginBottom: 14 },
  routeCol: { flex: 1 },
  place: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  city: { fontSize: 12, color: Colors.gray500 },
  time: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  sideActions: { width: 120, gap: 10 },
  sideItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sideText: { fontSize: 12, fontWeight: '600', color: Colors.gray700 },
  modalWrap: { flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end' },
  detailsHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { color: '#15803D', fontWeight: '700', fontSize: 12 },
  started: { color: Colors.gray500, fontSize: 12 },
  detailRoute: { flexDirection: 'row', marginBottom: 10 },
  pinLabel: { fontSize: 11, color: Colors.gray500 },
  timeRight: { fontSize: 12, color: Colors.gray500, textAlign: 'right' },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  metricVal: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
});

export default ActiveRideScreen;
