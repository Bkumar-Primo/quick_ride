import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

export const PrivacyPolicyScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
      >
        <Text style={styles.effectiveDate}>Last updated: September 21, 2026</Text>

        <Text style={styles.leadText}>
          Your privacy is paramount to us at QuickRide. This Privacy Policy outlines how we collect,
          use, safeguard, and disclose your personal information when you use our application.
        </Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="location-outline" size={20} color="#0284C7" />
            </View>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          </View>
          <Text style={styles.paragraph}>
            • <Text style={styles.boldText}>Location Data:</Text> Real-time precise GPS coordinates
            to match you with nearby drivers, optimize pickup routes, and calculate accurate trip
            fares.{'\n'}• <Text style={styles.boldText}>Account Information:</Text> Your phone
            number, name, email address, profile photo, and saved locations.{'\n'}•{' '}
            <Text style={styles.boldText}>Transaction Data:</Text> Ride history, trip timestamps,
            payment receipts, and wallet transaction records.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="cog-outline" size={20} color="#15803D" />
            </View>
            <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
          </View>
          <Text style={styles.paragraph}>
            We process your information solely to facilitate seamless ride bookings, ensure rider
            safety via live trip tracking, process payments securely, provide customer support, and
            improve our algorithm dispatch speed.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>3. Data Sharing & Protection</Text>
          </View>
          <Text style={styles.paragraph}>
            Your precise pickup and destination addresses are shared only with the assigned driver
            for the duration of the trip. We encrypt all data in transit using TLS 1.3 and never
            sell your personal information to third-party advertisers.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="key-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>4. Your Rights & Controls</Text>
          </View>
          <Text style={styles.paragraph}>
            You can view and update your profile information, manage location permission settings,
            clear saved addresses, or request complete account deletion at any time directly through
            the app settings or by contacting privacy@quickride.com.
          </Text>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Have privacy questions? Reach out to our Data Protection Officer at{' '}
            <Text style={styles.footerEmail}>privacy@quickride.com</Text>.
          </Text>
        </View>
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
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  effectiveDate: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray500,
    marginBottom: 8,
  },
  leadText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.gray600,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footerNote: {
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.md,
    backgroundColor: '#F1F5F9',
    borderRadius: Layout.borderRadius.lg,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.gray600,
    textAlign: 'center',
  },
  footerEmail: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default PrivacyPolicyScreen;
