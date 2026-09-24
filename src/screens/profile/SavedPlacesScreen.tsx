import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';
import type { LocationPoint } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedPlaces'>;

const RECENT_SAVED_PRESETS: {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  pinColor: string;
  bgColor: string;
  latitude: number;
  longitude: number;
}[] = [
  {
    id: 'rec-1',
    title: 'VR Punjab Mall',
    subtitle: 'Mohali, Punjab',
    address: 'VR Punjab Mall, NH-21, Kharar, Mohali, Punjab 140301',
    pinColor: '#10B981',
    bgColor: '#DCFCE7',
    latitude: 30.738,
    longitude: 76.657,
  },
  {
    id: 'rec-2',
    title: 'Phase 7 Market',
    subtitle: 'Sector 61, Mohali',
    address: 'Phase 7 Market, Sector 61, Mohali, Punjab 160062',
    pinColor: '#EF4444',
    bgColor: '#FEE2E2',
    latitude: 30.704,
    longitude: 76.718,
  },
  {
    id: 'rec-3',
    title: 'CP 67 Mall',
    subtitle: 'Sector 67, Mohali',
    address: 'CP 67 Mall, International Airport Road, Sector 67, Mohali, Punjab 160062',
    pinColor: '#9333EA',
    bgColor: '#F3E8FF',
    latitude: 30.6777,
    longitude: 76.7206,
  },
  {
    id: 'rec-4',
    title: 'Chandigarh Int. Airport (IXC)',
    subtitle: 'Mohali',
    address: 'Chandigarh International Airport, New Civil Air Terminal, Mohali, Punjab 160004',
    pinColor: '#D97706',
    bgColor: '#FEF3C7',
    latitude: 30.6735,
    longitude: 76.7885,
  },
  {
    id: 'rec-5',
    title: 'Phase 3B2 Market',
    subtitle: 'Mohali, Punjab',
    address: 'Phase 3B2 Market, Sector 60, Mohali, Punjab 160059',
    pinColor: '#0284C7',
    bgColor: '#E0F2FE',
    latitude: 30.7104,
    longitude: 76.7214,
  },
];

export const SavedPlacesScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const addSavedPlace = useUserStore((state) => state.addSavedPlace);
  const removeSavedPlace = useUserStore((state) => state.removeSavedPlace);
  const setDestination = useRideStore((state) => state.setDestination);
  const setFlowStep = useRideStore((state) => state.setFlowStep);
  const { showDialog } = useAppDialog();

  const [recentPlaces, setRecentPlaces] = useState(RECENT_SAVED_PRESETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const homePlace = user.savedPlaces.find((p) => p.type === 'home') || {
    id: 'home-default',
    title: 'Home',
    subtitle: 'Sector 70, Mohali',
    address: 'Sector 70, Mohali, Punjab 160071',
    latitude: 30.6947,
    longitude: 76.7121,
  };

  const workPlace = user.savedPlaces.find((p) => p.type === 'work') || {
    id: 'work-default',
    title: 'Work',
    subtitle: 'CP 67 Mall, Mohali',
    address: 'CP 67 Mall, International Airport Road, Sector 67, Mohali, Punjab 160062',
    latitude: 30.6777,
    longitude: 76.7206,
  };

  const handleSelectPlace = (place: LocationPoint | any) => {
    const targetLoc: LocationPoint = {
      id: place.id || `loc-${Date.now()}`,
      title: place.title,
      subtitle: place.subtitle,
      address: place.address || place.subtitle,
      latitude: place.latitude || 30.6777,
      longitude: place.longitude || 76.7206,
      type: place.type || 'popular',
    };
    setDestination(targetLoc);
    setFlowStep('ROUTE_PREVIEW');
    navigation.navigate('MainTabs', { screen: 'HomeTab' });
  };

  const handleAddNewPlace = () => {
    if (!newTitle.trim() || !newAddress.trim()) {
      Alert.alert('Missing Info', 'Please provide location name and address.');
      return;
    }
    const colors = [
      { pin: '#10B981', bg: '#DCFCE7' },
      { pin: '#EF4444', bg: '#FEE2E2' },
      { pin: '#9333EA', bg: '#F3E8FF' },
      { pin: '#0284C7', bg: '#E0F2FE' },
    ];
    const pickColor = colors[recentPlaces.length % colors.length];

    const newLoc = {
      id: `rec-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Mohali, Punjab',
      address: newAddress.trim(),
      pinColor: pickColor.pin,
      bgColor: pickColor.bg,
      latitude: 30.7,
      longitude: 76.7,
    };
    setRecentPlaces([newLoc, ...recentPlaces]);
    addSavedPlace({
      id: newLoc.id,
      title: newLoc.title,
      subtitle: newLoc.subtitle,
      address: newLoc.address,
      latitude: newLoc.latitude,
      longitude: newLoc.longitude,
      type: 'popular',
    });
    setNewTitle('');
    setNewSubtitle('');
    setNewAddress('');
    setShowAddModal(false);
    showDialog({
      title: 'Address Saved',
      message: `"${newLoc.title}" has been added to your saved places.`,
      tone: 'success',
    });
  };

  const handleOptionsPress = (title: string, id: string) => {
    Alert.alert(title, 'Choose an option', [
      { text: 'Set as Destination', onPress: () => handleSelectPlace({ title, id }) },
      {
        text: 'Remove from Saved',
        style: 'destructive',
        onPress: () => {
          setRecentPlaces(recentPlaces.filter((p) => p.id !== id));
          removeSavedPlace(id);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar Navigation */}
      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Decorative Art Container */}
        <View style={styles.artBadge}>
          <Ionicons name="location" size={24} color={Colors.primary} />
          <Ionicons name="car-sport" size={20} color="#1E293B" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Main Screen Title */}
      <View style={styles.titleSection}>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.headerSub}>Quick access to your favourite destinations</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Saved Card (Home, Work, Add New) */}
        <View style={styles.mainCard}>
          {/* Home Row */}
          <TouchableOpacity
            style={styles.placeRow}
            activeOpacity={0.75}
            onPress={() => handleSelectPlace(homePlace)}
          >
            <View style={[styles.placeIconCircle, { backgroundColor: '#FFF3ED' }]}>
              <Ionicons name="home" size={20} color={Colors.primary} />
            </View>
            <View style={styles.placeTextWrap}>
              <Text style={styles.placeTitle}>Home</Text>
              <Text style={styles.placeSubtitle} numberOfLines={1}>
                {homePlace.subtitle || homePlace.address || 'Sector 70, Mohali'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => handleOptionsPress('Home', homePlace.id)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Work Row */}
          <TouchableOpacity
            style={styles.placeRow}
            activeOpacity={0.75}
            onPress={() => handleSelectPlace(workPlace)}
          >
            <View style={[styles.placeIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="briefcase" size={20} color="#2563EB" />
            </View>
            <View style={styles.placeTextWrap}>
              <Text style={styles.placeTitle}>Work</Text>
              <Text style={styles.placeSubtitle} numberOfLines={1}>
                {workPlace.subtitle || workPlace.address || 'CP 67 Mall, Mohali'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => handleOptionsPress('Work', workPlace.id)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Add New Place Button */}
          <TouchableOpacity
            style={styles.addNewPlaceBox}
            activeOpacity={0.85}
            onPress={() => setShowAddModal(true)}
          >
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={20} color={Colors.white} />
            </View>
            <Text style={styles.addNewPlaceText}>Add New Place</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Recent Saved Places Section */}
        <Text style={styles.sectionHeader}>Recent Saved Places</Text>

        <View style={styles.recentCard}>
          {recentPlaces.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.placeRow}
                activeOpacity={0.75}
                onPress={() => handleSelectPlace(item)}
              >
                <View style={[styles.placeIconCircle, { backgroundColor: item.bgColor }]}>
                  <Ionicons name="location-sharp" size={20} color={item.pinColor} />
                </View>
                <View style={styles.placeTextWrap}>
                  <Text style={styles.placeTitle}>{item.title}</Text>
                  <Text style={styles.placeSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.moreBtn}
                  onPress={() => handleOptionsPress(item.title, item.id)}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray400} />
                </TouchableOpacity>
              </TouchableOpacity>
              {idx < recentPlaces.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add New Place Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Place</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={22} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Place Name (e.g. Gym, Friend's House)"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={Colors.gray400}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="City / Area (e.g. Sector 68, Mohali)"
              value={newSubtitle}
              onChangeText={setNewSubtitle}
              placeholderTextColor={Colors.gray400}
            />

            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              placeholder="Full Address"
              multiline
              value={newAddress}
              onChangeText={setNewAddress}
              placeholderTextColor={Colors.gray400}
            />

            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleAddNewPlace}>
              <Text style={styles.saveBtnText}>Save Address</Text>
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
    backgroundColor: '#F8FAFC',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.sm,
  },
  artBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3ED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD8C2',
  },
  titleSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: 18,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Layout.spacing.md,
    ...Layout.shadows.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  placeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  placeTextWrap: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  placeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  moreBtn: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
  },
  addNewPlaceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3ED',
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addNewPlaceText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 12,
  },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Layout.spacing.md,
    ...Layout.shadows.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Layout.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalInput: {
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
});

export default SavedPlacesScreen;
