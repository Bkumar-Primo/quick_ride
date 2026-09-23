import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import {
  AMBIENCE_MALL,
  CURRENT_LOCATION,
  DEMO_ROUTE,
  DLF_CYBER_CITY,
  GURUGRAM_HOME,
  IGI_AIRPORT,
  POPULAR_DESTINATIONS,
  RIDE_GROUPS,
  startingFareForGroup,
  vehicleCapacityLabel,
  vehiclesInGroup,
} from '../../data';
import { type FlowStep, useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';
import type { LocationPoint, RideGroup } from '../../types';
import { Button } from '../common/Button';
import { DriverRidePanel } from './DriverRidePanel';
import { PrimaryPillButton, SoftPillButton } from './RideChrome';

interface Props {
  onOpenChat: () => void;
  onOpenCall: () => void;
  onOpenSafety: () => void;
  onOpenRating: () => void;
}

const SEARCHABLE: LocationPoint[] = [
  DLF_CYBER_CITY,
  AMBIENCE_MALL,
  GURUGRAM_HOME,
  IGI_AIRPORT,
  ...POPULAR_DESTINATIONS.filter(
    (d) =>
      d.id !== DLF_CYBER_CITY.id &&
      d.id !== AMBIENCE_MALL.id &&
      d.id !== GURUGRAM_HOME.id &&
      d.id !== IGI_AIRPORT.id,
  ),
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SEARCH_TIMELINE_STEPS = [
  'Searching\nfor drivers',
  'Driver\non the way',
  'Arriving\nsoon',
  'Trip\nin progress',
];

export const SingleRideFlowSheet: React.FC<Props> = ({
  onOpenChat,
  onOpenCall,
  onOpenSafety,
  onOpenRating,
}) => {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  const flowStep = useRideStore((state) => state.flowStep);
  const setFlowStep = useRideStore((state) => state.setFlowStep);
  const currentStatus = useRideStore((state) => state.currentStatus);
  const pickup = useRideStore((state) => state.pickup);
  const setPickup = useRideStore((state) => state.setPickup);
  const destination = useRideStore((state) => state.destination);
  const setDestination = useRideStore((state) => state.setDestination);
  const selectedVehicle = useRideStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useRideStore((state) => state.setSelectedVehicle);
  const activeRide = useRideStore((state) => state.activeRide);
  const startSearchingForDriver = useRideStore((state) => state.startSearchingForDriver);
  const cancelRide = useRideStore((state) => state.cancelRide);
  const resetRide = useRideStore((state) => state.resetRide);

  const selectedPaymentMethod = useUserStore((state) => state.selectedPaymentMethod);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'destination' | 'pickup'>('destination');
  const activeGroup = selectedVehicle.group;
  const options = vehiclesInGroup(activeGroup);

  const _maxSheetHeight = SCREEN_HEIGHT - (insets.top + 90);

  // Fixed snap point per step. ROUTE_PREVIEW uses 78% (Cab height) so sheet never goes down when changing options.
  const stepSnapPoint = useMemo(() => {
    switch (flowStep) {
      case 'IDLE':
        return '38%';
      case 'LOCATION_SEARCH':
        return '78%';
      case 'PICKUP_CONFIRM':
        return '42%';
      case 'ROUTE_PREVIEW':
        return '85%';
      case 'BOOKING_CONFIRM':
        return '60%';
      case 'SEARCHING_DRIVER':
        return '40%';
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVING':
      case 'DRIVER_ARRIVED':
      case 'RIDE_IN_PROGRESS':
        return '54%';
      case 'RIDE_COMPLETED':
        return '54%';
      default:
        return '52%';
    }
  }, [flowStep]);

  const snapPoints = useMemo(() => [stepSnapPoint], [stepSnapPoint]);

  // Ensure sheet snaps cleanly to index 0 on step change
  // useEffect(() => {
  //   sheetRef.current?.snapToIndex(0);
  // }, [flowStep]);

  const selectGroup = (group: RideGroup) => {
    if (group === activeGroup) return;
    const next = vehiclesInGroup(group)[0];
    if (next) setSelectedVehicle(next);
  };

  const handleSelectDestination = (loc: LocationPoint) => {
    setDestination(loc);
    setFlowStep('ROUTE_PREVIEW');
  };

  const handleBack = () => {
    switch (flowStep) {
      case 'LOCATION_SEARCH':
      case 'PICKUP_CONFIRM':
      case 'ROUTE_PREVIEW':
        setFlowStep('IDLE');
        break;
      case 'BOOKING_CONFIRM':
        setFlowStep('ROUTE_PREVIEW');
        break;
      case 'SEARCHING_DRIVER':
        cancelRide();
        setFlowStep('IDLE');
        break;
      default:
        setFlowStep('IDLE');
    }
  };

  const needle = searchQuery.trim().toLowerCase();
  const filteredSearch = needle
    ? SEARCHABLE.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.subtitle.toLowerCase().includes(needle) ||
          item.address.toLowerCase().includes(needle),
      )
    : SEARCHABLE;

  const vehicleIconName: keyof typeof Ionicons.glyphMap =
    selectedVehicle.group === 'bike' ? 'bicycle' : selectedVehicle.group === 'auto' ? 'bus' : 'car';

  const _hasArrived = currentStatus === 'DRIVER_ARRIVED';

  // Account for bottom tab bar height (~75-90px) so buttons are never cut off
  // const bottomPad = Math.max(insets.bottom + 75, 90);
  const bottomPad = 16;

  // --- Step Content Renderers ---

  const renderIdleContent = () => (
    <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
      <View style={styles.pickupRow}>
        <View style={styles.pickupPinCol}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <View style={styles.pickupDots}>
            <View style={styles.pickupDot} />
            <View style={styles.pickupDot} />
            <View style={styles.pickupDot} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.pickupInfo}
          activeOpacity={0.8}
          onPress={() => {
            setSearchMode('pickup');
            setFlowStep('LOCATION_SEARCH');
          }}
        >
          <Text style={styles.pickupLabel}>Pickup location</Text>
          <Text style={styles.pickupTitle}>{pickup.title}</Text>
          <Text style={styles.pickupSubtitle} numberOfLines={1}>
            {pickup.subtitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSearchMode('pickup');
            setFlowStep('LOCATION_SEARCH');
          }}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setSearchMode('destination');
          setFlowStep('LOCATION_SEARCH');
        }}
        style={styles.searchBar}
      >
        <Ionicons name="search" size={18} color={Colors.primary} />
        <Text style={styles.searchPlaceholder}>Where are you going?</Text>
      </TouchableOpacity>

      <View style={styles.shortcutsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelectDestination(GURUGRAM_HOME)}
          style={styles.shortcutItem}
        >
          <Ionicons name="home-outline" size={20} color={Colors.primary} />
          <View>
            <Text style={styles.shortcutLabel}>Home</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>
              Sector 56
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelectDestination(DLF_CYBER_CITY)}
          style={styles.shortcutItem}
        >
          <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
          <View>
            <Text style={styles.shortcutLabel}>Work</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>
              Cyber City
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.popularTitle}>Popular destinations</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularScroll}
      >
        {SEARCHABLE.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() => handleSelectDestination(item)}
            style={styles.popularCard}
          >
            <View style={styles.popularIconBg}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.popularName} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.popularMeta}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BottomSheetView>
  );

  const renderLocationSearchContent = () => {
    const isPickupMode = searchMode === 'pickup';

    const handleSelectLocation = (loc: LocationPoint) => {
      if (isPickupMode) {
        setPickup(loc);
        if (destination) {
          setFlowStep('ROUTE_PREVIEW');
        } else {
          setSearchMode('destination');
        }
      } else {
        setDestination(loc);
        setFlowStep('ROUTE_PREVIEW');
      }
    };

    return (
      <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtnHeader} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{isPickupMode ? 'Where from?' : 'Where to?'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setSearchMode(isPickupMode ? 'destination' : 'pickup')}
          >
            <Ionicons
              name={isPickupMode ? 'location' : 'navigate'}
              size={13}
              color={Colors.primary}
            />
            <Text style={styles.editText}>{isPickupMode ? 'Drop ›' : 'Pickup ›'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBoxInputRow}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.gray500}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            style={styles.searchInputText}
            placeholder={
              isPickupMode ? 'Search pickup location...' : 'Search destination or landmark...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 10 }}>
              <Ionicons name="close-circle" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          ) : null}
        </View>

        {!searchQuery ? (
          <View style={styles.shortcutsRow}>
            {isPickupMode && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectLocation(CURRENT_LOCATION)}
                style={styles.shortcutItem}
              >
                <Ionicons name="locate" size={20} color={Colors.primary} />
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.shortcutLabel}>Current location</Text>
                  <Text style={styles.shortcutSubtitle} numberOfLines={1}>
                    Use device location
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelectLocation(GURUGRAM_HOME)}
              style={styles.shortcutItem}
            >
              <Ionicons name="home-outline" size={20} color={Colors.primary} />
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.shortcutLabel}>Home</Text>
                <Text style={styles.shortcutSubtitle} numberOfLines={1}>
                  Sector 56
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelectLocation(DLF_CYBER_CITY)}
              style={styles.shortcutItem}
            >
              <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.shortcutLabel}>Work</Text>
                <Text style={styles.shortcutSubtitle} numberOfLines={1}>
                  Cyber City
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        <BottomSheetScrollView style={{ maxHeight: 300, marginTop: 12 }}>
          {filteredSearch.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.searchResultItem}
              activeOpacity={0.7}
              onPress={() => handleSelectLocation(item)}
            >
              <View style={styles.searchResultIconBg}>
                <Ionicons
                  name={isPickupMode ? 'location-outline' : 'location'}
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.searchResultTitle}>{item.title}</Text>
                <Text style={styles.searchResultSubtitle}>
                  {item.subtitle} • {item.address}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetView>
    );
  };

  const renderPickupConfirmContent = () => (
    <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
      <View style={styles.headerTitleRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtnHeader} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Confirm pickup location</Text>
          <Text style={styles.sub}>Confirm your pickup point or search a new location.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.routeCard}
        activeOpacity={0.9}
        onPress={() => {
          setSearchMode('pickup');
          setFlowStep('LOCATION_SEARCH');
        }}
      >
        <View style={styles.routeCol}>
          <MaterialCommunityIcons name="map-marker" size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.place}>{pickup.title}</Text>
            <Text style={styles.city}>{pickup.address || 'Gurugram, Haryana'}</Text>
          </View>
          <Ionicons name="search" size={18} color={Colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.shortcutsRow}>
        <TouchableOpacity
          style={styles.shortcutItem}
          activeOpacity={0.8}
          onPress={() => setPickup(CURRENT_LOCATION)}
        >
          <Ionicons name="locate" size={18} color={Colors.primary} />
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.shortcutLabel}>Current location</Text>
            <Text style={styles.shortcutSubtitle}>Use device GPS</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shortcutItem}
          activeOpacity={0.8}
          onPress={() => setPickup(GURUGRAM_HOME)}
        >
          <Ionicons name="home-outline" size={18} color={Colors.primary} />
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.shortcutLabel}>Home</Text>
            <Text style={styles.shortcutSubtitle}>Sector 56</Text>
          </View>
        </TouchableOpacity>
      </View>

      <PrimaryPillButton
        title="Confirm Pickup Location"
        onPress={() => setFlowStep(destination ? 'ROUTE_PREVIEW' : 'LOCATION_SEARCH')}
      />
    </BottomSheetView>
  );

  const renderRoutePreviewContent = () => (
    <BottomSheetView style={[styles.sheetBody, { paddingBottom: 16 }]}>
      {/* Back Button in front of title */}
      <View style={styles.headerTitleRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtnHeader} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Choose your ride</Text>
          <Text style={styles.sub}>Bike, auto, or cab — pick what fits this trip.</Text>
        </View>
      </View>

      {/* Route Summary Card */}
      <View style={styles.routeCard}>
        <View style={styles.routeTop}>
          <View style={styles.routeCol}>
            <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
            <View>
              <Text style={styles.place}>{pickup.title}</Text>
              <Text style={styles.city}>Gurugram, Haryana</Text>
            </View>
          </View>
          <View style={styles.routeCol}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#EF4444" />
            <View>
              <Text style={styles.place}>{destination?.title}</Text>
              <Text style={styles.city}>Gurugram, Haryana</Text>
            </View>
          </View>
        </View>
        <View style={styles.routeMeta}>
          <Text style={styles.metaText}>{DEMO_ROUTE.distanceKm} km</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{DEMO_ROUTE.durationMin} min</Text>
        </View>
      </View>

      {/* Cab Group Selector Tabs */}
      <View style={styles.groups}>
        {RIDE_GROUPS.map((group) => {
          const on = group.id === activeGroup;
          return (
            <TouchableOpacity
              key={group.id}
              activeOpacity={0.9}
              onPress={() => selectGroup(group.id)}
              style={[styles.groupCard, on && styles.groupCardOn]}
            >
              <MaterialCommunityIcons
                name={group.icon}
                size={26}
                color={on ? Colors.primary : Colors.gray700}
              />
              <Text style={[styles.groupLabel, on && styles.groupLabelOn]}>{group.label}</Text>
              <Text style={styles.groupFare}>from ₹{startingFareForGroup(group.id)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View>
        {options.map((vehicle) => {
          const isSelected = selectedVehicle.id === vehicle.id;
          return (
            <TouchableOpacity
              key={vehicle.id}
              activeOpacity={0.9}
              onPress={() => setSelectedVehicle(vehicle)}
              style={[styles.vehicleCard, isSelected && styles.vehicleCardOn]}
            >
              {vehicle.imageUrl ? (
                <Image source={vehicle.imageUrl} style={styles.carImg} resizeMode="contain" />
              ) : (
                <View style={styles.carImg} />
              )}
              <View style={styles.vehicleCopy}>
                <View style={styles.nameRow}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  {vehicle.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{vehicle.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.vehicleMeta}>
                  {vehicleCapacityLabel(vehicle)} · {vehicle.etaMinutes} min away
                </Text>
                <Text style={styles.tagline}>{vehicle.tagline}</Text>
              </View>
              <View style={styles.priceCol}>
                <View style={[styles.radio, isSelected && styles.radioOn]} />
                <Text style={styles.price}>₹{vehicle.price}</Text>
                <Text style={styles.est}>Estimated fare</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.disclaimer}>
        All prices include estimated fare. Final fare may vary based on traffic and route.
      </Text>

      <PrimaryPillButton
        title={`Book ${selectedVehicle.name}  ·  ₹${selectedVehicle.price}`}
        onPress={() => setFlowStep('BOOKING_CONFIRM')}
      />
    </BottomSheetView>
  );

  const renderBookingConfirmContent = () => (
    <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
      <View style={styles.headerTitleRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtnHeader} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Confirm your ride</Text>
          <Text style={styles.sub}>Review trip details before booking.</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => setFlowStep('ROUTE_PREVIEW')}>
          <Ionicons name="pencil" size={13} color={Colors.primary} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.block}
        onPress={() => {
          setSearchMode('pickup');
          setFlowStep('LOCATION_SEARCH');
        }}
      >
        <Ionicons name="location" size={18} color={Colors.primary} />
        <View style={styles.blockCopy}>
          <Text style={styles.blockLabel}>Pickup</Text>
          <Text style={styles.blockTitle}>{pickup.title}</Text>
          <Text style={styles.blockSub}>Gurugram, Haryana</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.block}
        onPress={() => {
          setSearchMode('destination');
          setFlowStep('LOCATION_SEARCH');
        }}
      >
        <Ionicons name="location" size={18} color="#EF4444" />
        <View style={styles.blockCopy}>
          <Text style={styles.blockLabel}>Destination</Text>
          <Text style={styles.blockTitle}>{destination?.title}</Text>
          <Text style={styles.blockSub}>Gurugram, Haryana</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.vehicleBlock} onPress={() => setFlowStep('ROUTE_PREVIEW')}>
        {selectedVehicle.imageUrl ? (
          <Image source={selectedVehicle.imageUrl} style={styles.carSmall} resizeMode="contain" />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
          <Text style={styles.vehicleMeta}>
            {vehicleCapacityLabel(selectedVehicle)} · {selectedVehicle.etaMinutes} min away
          </Text>
          <Text style={styles.tagline}>{selectedVehicle.tagline}</Text>
        </View>
        <Text style={styles.price}>₹{selectedVehicle.price}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
      </TouchableOpacity>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricVal}>{DEMO_ROUTE.distanceKm} km</Text>
          <Text style={styles.metricLabel}>Distance</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricVal}>{DEMO_ROUTE.durationMin} min</Text>
          <Text style={styles.metricLabel}>Est. duration</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricVal}>₹{selectedVehicle.price}</Text>
          <Text style={styles.metricLabel}>Estimated fare</Text>
        </View>
      </View>

      <PrimaryPillButton
        title="Confirm Ride"
        onPress={startSearchingForDriver}
        style={{ marginTop: 12 }}
      />
      <Text style={styles.legal}>
        By confirming, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </BottomSheetView>
  );

  const renderSearchingDriverContent = () => (
    <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
      <View style={styles.headerTitleRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtnHeader} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Finding you a driver</Text>
          <Text style={styles.sub}>
            We’re checking nearby drivers. This usually takes less than a minute.
          </Text>
        </View>
        <View style={styles.waitBox}>
          <Text style={styles.waitVal}>~ 1 min</Text>
          <Text style={styles.waitLabel}>Estimated wait</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {SEARCH_TIMELINE_STEPS.map((label, index) => (
          <View key={label} style={styles.step}>
            <View style={[styles.stepIcon, index === 0 && styles.stepIconOn]}>
              <Ionicons
                name={
                  index === 0
                    ? vehicleIconName
                    : index === 1
                      ? 'person-outline'
                      : index === 2
                        ? vehicleIconName
                        : 'checkmark'
                }
                size={14}
                color={index === 0 ? Colors.white : Colors.gray400}
              />
            </View>
            <Text style={[styles.stepLabel, index === 0 && styles.stepLabelOn]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.routeCard}>
        <View style={styles.routeCol}>
          <Text style={styles.pinLabel}>Pickup location</Text>
          <Text style={styles.place}>{pickup.title}</Text>
          <Text style={styles.city}>Gurugram, Haryana</Text>
        </View>
        <View style={styles.routeCol}>
          <Text style={styles.pinLabel}>Destination</Text>
          <Text style={styles.place}>{destination?.title}</Text>
          <Text style={styles.city}>Gurugram, Haryana</Text>
        </View>
      </View>

      <SoftPillButton title="Cancel ride" onPress={cancelRide} />
    </BottomSheetView>
  );

  const renderActiveDriverContent = () => {
    if (!activeRide) return null;
    const driver = activeRide.driver;
    if (!driver) return null;

    const isArrived = currentStatus === 'DRIVER_ARRIVED';
    const isInProgress = currentStatus === 'RIDE_IN_PROGRESS';
    const isAssigned = currentStatus === 'DRIVER_ASSIGNED';

    let titleText = 'Driver assigned • On the way';
    let subText = 'Your driver is heading to the pickup point.';

    if (isInProgress) {
      titleText = 'Trip is in progress';
      subText = 'Heading safely to your destination.';
    } else if (isArrived) {
      titleText = 'Your driver has arrived!';
      subText = 'Please share your OTP with the driver.';
    } else {
      titleText = 'Driver assigned • On the way';
      subText = 'Your driver is heading to the pickup point.';
    }

    return (
      <BottomSheetView style={[styles.sheetBody, { paddingBottom: bottomPad }]}>
        <View style={styles.headerTitleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{titleText}</Text>
            <Text style={styles.sub}>{subText}</Text>
          </View>
          {isInProgress ? (
            <View style={styles.arrivedBadge}>
              <Ionicons name="navigate-circle" size={16} color={Colors.primary} />
              <Text style={styles.arrivedText}>On the way</Text>
            </View>
          ) : isArrived ? (
            <View style={styles.arrivedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
              <Text style={styles.arrivedText}>Arrived</Text>
            </View>
          ) : (
            <View style={styles.etaBox}>
              <Text style={styles.etaVal}>3 min</Text>
              <Text style={styles.etaSub}>1.2 km away</Text>
            </View>
          )}
        </View>

        <DriverRidePanel
          driver={driver}
          vehicle={activeRide.vehicle}
          onCall={onOpenCall}
          onMessage={onOpenChat}
          showDirections={isArrived || isInProgress}
          onDirections={onOpenSafety}
        />

        {isArrived && (
          <View style={styles.otpCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.otpCardTitle}>SHARE OTP WITH DRIVER</Text>
              <Text style={styles.otpCardSub}>Give this code to start your ride</Text>
            </View>
            <View style={styles.otpBadge}>
              <Text style={styles.otpBadgeText}>{activeRide.otpPin || '4821'}</Text>
            </View>
          </View>
        )}

        <View style={styles.routeCard}>
          <View style={styles.routeCol}>
            <Text style={styles.pinLabel}>
              {isInProgress ? 'Destination' : isArrived ? 'Pickup point' : 'Pickup location'}
            </Text>
            <Text style={styles.place}>
              {isInProgress ? activeRide.destination.title : activeRide.pickup.title}
            </Text>
            <Text style={styles.city}>Gurugram, Haryana</Text>
          </View>
          {!isArrived && !isInProgress ? (
            <View style={styles.routeCol}>
              <Text style={styles.pinLabel}>Destination</Text>
              <Text style={styles.place}>{activeRide.destination.title}</Text>
              <Text style={styles.city}>Gurugram, Haryana</Text>
            </View>
          ) : null}
        </View>

        {isInProgress ? null : !isArrived ? (
          <SoftPillButton title="Cancel Ride" onPress={cancelRide} style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.hint}>
            Sharing OTP... Ride will start automatically in 3 seconds.
          </Text>
        )}
      </BottomSheetView>
    );
  };

  const renderCompletedContent = () => (
    <BottomSheetView style={[styles.sheetBody, { alignItems: 'center', paddingBottom: bottomPad }]}>
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark" size={36} color={Colors.white} />
      </View>
      <Text style={styles.completedTitle}>You have arrived!</Text>
      <Text style={styles.completedSub}>Hope you had a comfortable ride</Text>

      <View style={styles.completedFareCard}>
        <Text style={styles.completedFareLabel}>Total Fare Paid</Text>
        <Text style={styles.completedFareVal}>
          ₹{activeRide?.fareBreakdown.totalFare || selectedVehicle.price}
        </Text>
        <Text style={styles.completedPayMethod}>
          Paid via {activeRide?.paymentMethod || selectedPaymentMethod}
        </Text>
      </View>

      <Button
        title="Rate & Review Driver"
        onPress={onOpenRating}
        style={{ width: '100%', marginTop: 14 }}
      />
      <TouchableOpacity onPress={resetRide} style={styles.cancelLinkBtn}>
        <Text style={styles.cancelLinkText}>Done / Back to Home</Text>
      </TouchableOpacity>
    </BottomSheetView>
  );

  const renderSheetBody = () => {
    switch (flowStep) {
      case 'IDLE':
        return renderIdleContent();
      case 'LOCATION_SEARCH':
        return renderLocationSearchContent();
      case 'PICKUP_CONFIRM':
        return renderPickupConfirmContent();
      case 'ROUTE_PREVIEW':
        return renderRoutePreviewContent();
      case 'BOOKING_CONFIRM':
        return renderBookingConfirmContent();
      case 'SEARCHING_DRIVER':
        return renderSearchingDriverContent();
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVING':
      case 'DRIVER_ARRIVED':
      case 'RIDE_IN_PROGRESS':
        return renderActiveDriverContent();
      case 'RIDE_COMPLETED':
        return renderCompletedContent();
      default:
        return renderIdleContent();
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enableOverDrag={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      {renderSheetBody()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
  },
  handleIndicator: {
    backgroundColor: '#CBD5E1',
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  sheetBody: {
    paddingHorizontal: 16,
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  backBtnHeader: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupPinCol: {
    width: 22,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  pickupDots: {
    marginTop: 4,
    alignItems: 'center',
    gap: 3,
  },
  pickupDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray300,
  },
  pickupInfo: { flex: 1 },
  pickupLabel: { fontSize: 11, color: Colors.gray500 },
  pickupTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  pickupSubtitle: { fontSize: 12, color: Colors.gray500 },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    gap: 10,
  },
  searchPlaceholder: { fontSize: 15, fontWeight: '600', color: '#F3B48A' },
  shortcutsRow: { flexDirection: 'row', marginTop: 14, marginBottom: 4 },
  shortcutItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  shortcutLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  shortcutSubtitle: { fontSize: 11, color: Colors.gray500 },
  popularTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  popularScroll: { gap: 10, paddingRight: 4 },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
    minWidth: 150,
  },
  popularIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  popularMeta: { fontSize: 10, color: Colors.gray500 },
  searchBoxInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
  },
  searchInputText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingHorizontal: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: 10,
  },
  searchResultIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchResultSubtitle: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  cancelLinkBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelLinkText: { fontSize: 14, fontWeight: '700', color: Colors.gray500 },
  routeCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  routeTop: { flexDirection: 'row', gap: 12 },
  routeCol: { flex: 1, flexDirection: 'row', gap: 6 },
  place: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  city: { fontSize: 11, color: Colors.gray500 },
  routeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  metaText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  metaDot: { color: Colors.gray400, fontWeight: '700' },
  groups: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  groupCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 4,
  },
  groupCardOn: { borderColor: Colors.primary, backgroundColor: '#FFF8F2' },
  groupLabel: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  groupLabelOn: { color: Colors.primary },
  groupFare: { fontSize: 11, color: Colors.gray500, fontWeight: '600' },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 18,
    padding: 10,
    gap: 8,
    marginBottom: 8,
  },
  vehicleCardOn: { borderColor: Colors.primary, backgroundColor: '#FFF8F2' },
  carImg: { width: 74, height: 46 },
  vehicleCopy: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  vehicleMeta: { fontSize: 12, color: Colors.gray600, marginTop: 2 },
  tagline: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  priceCol: { alignItems: 'flex-end', width: 86 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray300,
    marginBottom: 6,
  },
  radioOn: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  price: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  est: { fontSize: 10, color: Colors.gray500 },
  disclaimer: {
    fontSize: 11,
    color: Colors.gray500,
    marginVertical: 8,
    lineHeight: 16,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1E6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  blockCopy: { flex: 1 },
  blockLabel: { fontSize: 11, color: Colors.gray500 },
  blockTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  blockSub: { fontSize: 12, color: Colors.gray500 },
  vehicleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
    marginTop: 6,
  },
  carSmall: { width: 72, height: 44 },
  metrics: { flexDirection: 'row', marginVertical: 12 },
  metric: { flex: 1 },
  metricVal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  legal: {
    fontSize: 11,
    color: Colors.gray400,
    textAlign: 'center',
    marginTop: 10,
  },
  waitBox: { alignItems: 'flex-end' },
  waitVal: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  waitLabel: { fontSize: 11, color: Colors.gray500 },
  timeline: { flexDirection: 'row', marginBottom: 16 },
  step: { flex: 1, alignItems: 'flex-start' },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepIconOn: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: 11, color: Colors.gray400, lineHeight: 14 },
  stepLabelOn: { color: Colors.textPrimary, fontWeight: '700' },
  pinLabel: { fontSize: 11, color: Colors.gray500 },
  arrivedBadge: {
    backgroundColor: '#FFF1E6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 2,
  },
  arrivedText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#FF5500',
  },
  otpCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  otpCardSub: {
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 2,
  },
  otpBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  otpBadgeText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  etaBox: { alignItems: 'flex-end' },
  etaVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  etaSub: { fontSize: 11, color: Colors.gray500 },
  hint: {
    textAlign: 'center',
    color: Colors.gray400,
    fontSize: 12,
    marginTop: 10,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  completedSub: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 4,
    marginBottom: 16,
  },
  completedFareCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  completedFareLabel: { fontSize: 12, color: Colors.gray500 },
  completedFareVal: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  completedPayMethod: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 4,
  },
});

export default SingleRideFlowSheet;
