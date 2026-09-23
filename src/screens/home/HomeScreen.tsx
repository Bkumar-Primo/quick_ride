import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { BookingMap, type BookingMapMode } from '../../components/map/BookingMap';
import { RatingModal } from '../../components/ride/RatingModal';
import { SafetyModal } from '../../components/ride/SafetyModal';
import { SingleRideFlowSheet } from '../../components/ride/SingleRideFlowSheet';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { type FlowStep, useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';

type Props = any;

function mapFlowStepToBookingMapMode(flowStep: FlowStep): BookingMapMode {
  switch (flowStep) {
    case 'IDLE':
      return 'search';
    case 'LOCATION_SEARCH':
      return 'search';
    case 'PICKUP_CONFIRM':
      return 'pickup';
    case 'ROUTE_PREVIEW':
      return 'choose';
    case 'BOOKING_CONFIRM':
      return 'confirm';
    case 'SEARCHING_DRIVER':
      return 'searching';
    case 'DRIVER_ASSIGNED':
      return 'assigned';
    case 'DRIVER_ARRIVING':
      return 'arriving';
    case 'DRIVER_ARRIVED':
      return 'arrived';
    case 'RIDE_IN_PROGRESS':
      return 'inprogress';
    case 'RIDE_COMPLETED':
      return 'completed';
    default:
      return 'search';
  }
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const flowStep = useRideStore((state) => state.flowStep);
  const activeRide = useRideStore((state) => state.activeRide);
  const completeTrip = useRideStore((state) => state.completeTrip);
  const resetRide = useRideStore((state) => state.resetRide);

  const firstName = user.name.split(' ')[0];

  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const handleRatingSubmit = (rating: number, tip: number, tags: string[]) => {
    completeTrip(rating, tip, tags);
    setShowRatingModal(false);
    resetRide();
  };

  return (
    <View style={styles.container}>
      {/* Persistent Map instance - continuous rendering without re-mounting */}
      <BookingMap mode={mapFlowStepToBookingMapMode(flowStep)} />

      {/* Top Floating Controls Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.topRow, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          <View style={styles.greetingRow}>
            <View style={styles.greetingTextWrap}>
              <Text style={styles.helloLine}>
                <Text style={styles.helloMuted}>Hi, </Text>
                <Text style={styles.helloName}>{firstName} </Text>
                <Text>👋</Text>
              </Text>
              <Text style={styles.needRide}>Need a ride?</Text>
            </View>
          </View>

          <View style={styles.logoCard}>
            <QuickRideLogo size="xs" />
          </View>
        </View>

        <View style={[styles.mapControls, { top: insets.top + 86 }]}>
          <TouchableOpacity activeOpacity={0.85} style={styles.mapControlBtn}>
            <Ionicons name="navigate" size={18} color={Colors.gray700} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.mapControlBtn}>
            <Ionicons name="locate-outline" size={20} color={Colors.gray700} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Single Bottom Sheet driven by @gorhom/bottom-sheet */}
      <SingleRideFlowSheet
        onOpenChat={() => navigation.navigate('DriverChat')}
        onOpenCall={() => setShowCallModal(true)}
        onOpenSafety={() => setShowSafetyModal(true)}
        onOpenRating={() => setShowRatingModal(true)}
      />

      {/* Safety SOS Modal */}
      <SafetyModal
        visible={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        driverName={activeRide?.driver?.name}
        vehicleNumber={activeRide?.driver?.carNumber}
      />

      {/* Rating & Review Modal */}
      <RatingModal
        visible={showRatingModal}
        driverName={activeRide?.driver?.name}
        driverAvatar={activeRide?.driver?.avatar}
        carModel={activeRide?.driver?.carModel}
        onSubmit={handleRatingSubmit}
        onSkip={() => {
          setShowRatingModal(false);
          resetRide();
        }}
      />

      {/* Calling Driver Modal Overlay */}
      <Modal visible={showCallModal} animationType="slide" transparent={false}>
        <View style={[styles.callContainer, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity style={styles.callBackBtn} onPress={() => setShowCallModal(false)}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.callContent}>
            <Avatar name={activeRide?.driver?.name || 'Driver'} size={100} />
            <Text style={styles.callDriverName}>{activeRide?.driver?.name || 'Driver'}</Text>
            <Text style={styles.callStatusText}>Calling driver-partner...</Text>

            <TouchableOpacity style={styles.endCallBtn} onPress={() => setShowCallModal(false)}>
              <Ionicons name="call" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
    flexShrink: 1,
    marginTop: -8,
  },
  greetingTextWrap: {
    flexShrink: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    ...Layout.shadows.sm,
  },
  helloLine: {
    fontSize: 18,
    lineHeight: 24,
  },
  helloMuted: {
    color: Colors.gray600,
    fontWeight: '500',
  },
  helloName: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  needRide: {
    marginTop: 1,
    fontSize: 13,
    color: Colors.gray500,
  },
  logoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Layout.shadows.md,
  },
  mapControls: {
    position: 'absolute',
    right: Layout.spacing.lg,
    gap: 10,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  callContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  callBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callDriverName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  callStatusText: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 6,
    marginBottom: 40,
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
