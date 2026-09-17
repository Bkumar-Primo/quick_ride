import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';
import type { ActiveRide } from '../../types';

export const ActivityScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const rideHistory = useUserStore((state) => state.rideHistory);
  const setDestination = useRideStore((state) => state.setDestination);
  const setSelectedVehicle = useRideStore((state) => state.setSelectedVehicle);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedRide, setSelectedRide] = useState<ActiveRide | null>(null);

  const filteredRides = rideHistory.filter((ride) => {
    if (activeFilter === 'COMPLETED') return ride.status === 'RIDE_COMPLETED';
    if (activeFilter === 'CANCELLED') return ride.status === 'CANCELLED';
    return true;
  });

  const handleRebook = (ride: ActiveRide) => {
    setDestination(ride.destination);
    setSelectedVehicle(ride.vehicle);
    setSelectedRide(null);
    navigation.navigate('RoutePreview');
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Notch Protection */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.headerTitle}>Ride Activity</Text>
        <Text style={styles.headerSubtitle}>{rideHistory.length} total rides taken</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersRow}>
        {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.8}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
          >
            <Text
              style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}
            >
              {filter === 'ALL' ? 'All Rides' : filter === 'COMPLETED' ? 'Completed' : 'Cancelled'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rides List */}
      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCompleted = item.status === 'RIDE_COMPLETED';
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedRide(item)}
              style={styles.rideCard}
            >
              {/* Header: Date & Status */}
              <View style={styles.cardHeader}>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.gray500} />
                  <Text style={styles.dateText}>{item.createdAt}</Text>
                </View>
                <Badge
                  label={isCompleted ? 'Completed' : 'Cancelled'}
                  variant={isCompleted ? 'success' : 'danger'}
                />
              </View>

              {/* Route: Pickup & Destination */}
              <View style={styles.routeContainer}>
                <View style={styles.routeLineColumn}>
                  <View style={styles.pickupDot} />
                  <View style={styles.routeDottedLine} />
                  <View style={styles.dropSquare} />
                </View>
                <View style={styles.routeTextColumn}>
                  <Text style={styles.routeStop} numberOfLines={1}>
                    {item.pickup.title}
                  </Text>
                  <Text style={[styles.routeStop, styles.destStop]} numberOfLines={1}>
                    {item.destination.title}
                  </Text>
                </View>
              </View>

              {/* Vehicle & Price Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.vehicleInfo}>
                  <Ionicons
                    name={
                      item.vehicle.group === 'bike'
                        ? 'bicycle'
                        : item.vehicle.group === 'auto'
                          ? 'bus-outline'
                          : 'car-outline'
                    }
                    size={16}
                    color={Colors.gray600}
                  />
                  <Text style={styles.vehicleName}>
                    {item.vehicle.name} • {item.distanceKm} km
                  </Text>
                </View>
                <Text style={styles.fareText}>₹{item.fareBreakdown.totalFare}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRebook(item)}
                  style={styles.rebookBtn}
                >
                  <Ionicons name="repeat" size={16} color={Colors.primary} />
                  <Text style={styles.rebookText}>Rebook Ride</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedRide(item)}
                  style={styles.receiptBtn}
                >
                  <Text style={styles.receiptText}>View Receipt</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Ride Detail / Receipt Modal */}
      {selectedRide && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.receiptHeader}>
                <Text style={styles.receiptTitle}>Ride Receipt</Text>
                <TouchableOpacity onPress={() => setSelectedRide(null)}>
                  <Ionicons name="close" size={24} color={Colors.gray600} />
                </TouchableOpacity>
              </View>

              <Text style={styles.receiptId}>Trip ID: {selectedRide.id}</Text>

              <View style={styles.receiptRouteBox}>
                <Text style={styles.routePointLabel}>FROM</Text>
                <Text style={styles.routePointTitle}>{selectedRide.pickup.title}</Text>
                <View style={styles.receiptDivider} />
                <Text style={styles.routePointLabel}>TO</Text>
                <Text style={styles.routePointTitle}>{selectedRide.destination.title}</Text>
              </View>

              <View style={styles.receiptBreakdown}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Vehicle</Text>
                  <Text style={styles.receiptVal}>{selectedRide.vehicle.name}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Captain</Text>
                  <Text style={styles.receiptVal}>
                    {selectedRide.driver?.name} ({selectedRide.driver?.carNumber})
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Payment Method</Text>
                  <Text style={styles.receiptVal}>{selectedRide.paymentMethod}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Total Fare Paid</Text>
                  <Text style={styles.receiptTotal}>₹{selectedRide.fareBreakdown.totalFare}</Text>
                </View>
              </View>

              <Button
                title="Rebook This Route"
                onPress={() => handleRebook(selectedRide)}
                showArrow
                style={{ width: '100%', marginTop: Layout.spacing.lg }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    gap: Layout.spacing.sm,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.gray100,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray600,
  },
  filterTabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  listContent: {
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  rideCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray500,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  routeLineColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginRight: Layout.spacing.md,
    paddingVertical: 4,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  routeDottedLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: Colors.gray300,
    marginVertical: 2,
  },
  dropSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: Colors.primary,
  },
  routeTextColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeStop: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  destStop: {
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    marginBottom: Layout.spacing.md,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleName: {
    fontSize: 13,
    color: Colors.gray600,
    fontWeight: '500',
  },
  fareText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  rebookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E8',
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
  },
  rebookText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  receiptBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
  },
  receiptText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray700,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Layout.spacing.xl,
    ...Layout.shadows.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  receiptId: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
    marginBottom: Layout.spacing.md,
  },
  receiptRouteBox: {
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: Layout.spacing.md,
  },
  routePointLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray400,
    letterSpacing: 1,
  },
  routePointTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Layout.spacing.sm,
  },
  receiptBreakdown: {
    gap: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 13,
    color: Colors.gray600,
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  receiptTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
});

export default ActivityScreen;
