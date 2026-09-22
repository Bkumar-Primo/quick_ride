import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

export const TermsOfServiceScreen: React.FC<any> = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
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
          Welcome to QuickRide. By creating an account or using our ride-hailing services, you agree
          to be bound by these Terms of Service. Please read them carefully.
        </Text>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>1. User Account & Registration</Text>
          </View>
          <Text style={styles.paragraph}>
            You must be at least 18 years old to create a QuickRide account. You are responsible for
            maintaining the accuracy and confidentiality of your account credentials and for all
            activities performed under your profile.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="car-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>2. Ride Booking & Services</Text>
          </View>
          <Text style={styles.paragraph}>
            QuickRide acts as a technology platform connecting passengers with independent
            driver-partners. While we verify drivers and maintain quality standards, trip
            availability and estimated travel times are dependent on traffic and weather conditions.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="card-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>3. Pricing & Payments</Text>
          </View>
          <Text style={styles.paragraph}>
            Fares are calculated based on distance, duration, and demand surge factors. By
            confirming a booking, you authorize QuickRide to charge your selected payment method
            (QuickRide Cash, UPI, Cards, or Cash). Cancellation fees may apply if a trip is
            cancelled after driver acceptance.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>4. User Code of Conduct</Text>
          </View>
          <Text style={styles.paragraph}>
            We promote a respectful, safe environment for passengers and drivers alike. Any physical
            abuse, harassment, property damage, or violation of traffic laws will result in
            immediate and permanent account suspension.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>5. Modifications & Termination</Text>
          </View>
          <Text style={styles.paragraph}>
            QuickRide reserves the right to update these terms at any time. Continued use of our
            mobile app following any modifications constitutes acceptance of the new terms. You may
            terminate your account at any time via Profile Settings.
          </Text>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            For questions or support regarding these Terms, contact our legal team at{' '}
            <Text style={styles.footerEmail}>legal@quickride.com</Text>.
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
    backgroundColor: '#FFF3E8',
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

export default TermsOfServiceScreen;
