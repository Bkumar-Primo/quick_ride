import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { Avatar } from '../../components/common/Avatar';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { useAuthStore } from '../../store/authStore';
import { useRideStore } from '../../store/rideStore';
import { useUserStore } from '../../store/userStore';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const resetDemoAuth = useAuthStore((state) => state.resetDemoAuth);
  const resetRide = useRideStore((state) => state.resetRide);
  const { showDialog } = useAppDialog();

  const handleResetDemo = () => {
    showDialog({
      title: 'Restart Demo Experience',
      message:
        'This will reset the app back to the Splash & Onboarding screens for client presentation.',
      tone: 'warning',
      actions: [
        { label: 'Cancel', variant: 'secondary' },
        {
          label: 'Reset Demo',
          variant: 'danger',
          onPress: () => {
            resetRide();
            resetDemoAuth();
          },
        },
      ],
    });
  };

  const handleLogout = () => {
    showDialog({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      tone: 'warning',
      actions: [
        { label: 'Cancel', variant: 'secondary' },
        { label: 'Log Out', variant: 'danger', onPress: logout },
      ],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Notch Protection */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <View style={styles.userCard}>
          <Avatar name={user.name} size={64} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statValRow}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.statVal}>{user.rating}</Text>
            </View>
            <Text style={styles.statLabel}>User Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user.totalRides}</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>₹{user.walletBalance}</Text>
            <Text style={styles.statLabel}>QuickRide Cash</Text>
          </View>
        </View>

        {/* Account Menu */}
        <Text style={styles.menuSectionTitle}>Account & Places</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#FFF3E8' }]}>
                <Ionicons name="person-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Edit Profile Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              showDialog({
                title: 'Saved Places',
                message: 'Home: Sector 56\nWork: DLF Cyber City\nRecent: Ambience Mall',
              })
            }
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="bookmark-outline" size={18} color="#0284C7" />
              </View>
              <Text style={styles.menuLabel}>Saved Addresses ({user.savedPlaces.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="wallet-outline" size={18} color="#15803D" />
              </View>
              <Text style={styles.menuLabel}>Payment & Wallet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity> */}
        </View>

        {/* Safety & Preferences */}
        <Text style={styles.menuSectionTitle}>Safety & Security</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              showDialog({
                title: 'Emergency Contacts',
                message: 'Primary Contact: Mom (+91 98200 12345)',
              })
            }
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#DC2626" />
              </View>
              <Text style={styles.menuLabel}>Emergency Contacts & SOS</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Legal & Policies */}
        <Text style={styles.menuSectionTitle}>Legal & Information</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="document-text-outline" size={18} color="#475569" />
              </View>
              <Text style={styles.menuLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#475569" />
              </View>
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Client Demo Controls */}
        <Text style={styles.menuSectionTitle}>Demo Presentation Controls</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={handleResetDemo}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="refresh" size={18} color="#D97706" />
              </View>
              <View>
                <Text style={[styles.menuLabel, { color: '#B45309', fontWeight: '700' }]}>
                  Restart Demo From Splash
                </Text>
                <Text style={styles.menuSub}>Rerun onboarding & walkthrough</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>QuickRide Customer App • v1.0.0 (Build 2026)</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  editLink: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Layout.spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.gray600,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    paddingVertical: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gray200,
    alignSelf: 'center',
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Layout.spacing.sm,
  },
  menuBox: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xl,
    ...Layout.shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.gray500,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    backgroundColor: '#FFF1F2',
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8,
    marginTop: Layout.spacing.sm,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.gray400,
    marginTop: Layout.spacing.xl,
  },
});

export default ProfileScreen;
