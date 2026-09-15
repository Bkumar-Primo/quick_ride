import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useRideStore } from '../../store/rideStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RideCompleted'>;

const FEEDBACK_TAGS = [
  'Clean & Fresh Car',
  'Polite Driver',
  'Smooth Driving',
  'Great Music',
  'Fast Route',
];

const TIP_OPTIONS = [0, 20, 50, 100];

export const RideCompletedScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const activeRide = useRideStore((state) => state.activeRide);
  const resetRide = useRideStore((state) => state.resetRide);

  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(20);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Clean & Fresh Car',
    'Polite Driver',
  ]);

  const driver = activeRide?.driver;
  const fare = activeRide?.fareBreakdown || {
    baseFare: 180,
    distanceFare: 118,
    tax: 15,
    discount: 34,
    totalFare: 279,
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDone = () => {
    resetRide();
    navigation.navigate('MainTabs', { screen: 'RideTab' });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
      >
        {/* Success Arrival Icon Header */}
        <View style={styles.header}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
          </View>
          <Text style={styles.title}>You've Arrived!</Text>
          <Text style={styles.subtitle}>
            Thanks for riding with QuickRide. Hope you had a smooth journey!
          </Text>
        </View>

        {/* Fare Summary Receipt Card */}
        <View style={styles.fareCard}>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Fare Paid</Text>
              <Text style={styles.paidMethod}>via QuickRide Wallet</Text>
            </View>
            <Text style={styles.totalAmount}>₹{fare.totalFare + selectedTip}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownList}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Fare</Text>
              <Text style={styles.breakdownVal}>₹{fare.baseFare}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Distance Fare (14.8 km)</Text>
              <Text style={styles.breakdownVal}>₹{fare.distanceFare}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Taxes & Fees</Text>
              <Text style={styles.breakdownVal}>₹{fare.tax}</Text>
            </View>
            {fare.discount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: '#10B981' }]}>
                  Promo Discount (QUICK50)
                </Text>
                <Text style={[styles.breakdownVal, { color: '#10B981' }]}>-₹{fare.discount}</Text>
              </View>
            )}
            {selectedTip > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Driver Tip</Text>
                <Text style={styles.breakdownVal}>₹{selectedTip}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rating & Review Section */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingCardTitle}>Rate your ride with {driver?.name || 'Rahul'}</Text>
          <Avatar name={driver?.name || 'Rahul'} size={60} style={styles.driverAvatar} />

          {/* 5 Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.7}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Badges */}
          <Text style={styles.sectionSubTitle}>What made your ride great?</Text>
          <View style={styles.tagsContainer}>
            {FEEDBACK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  activeOpacity={0.8}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tip Options */}
          <Text style={styles.sectionSubTitle}>Add a tip for captain</Text>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((tip) => {
              const isSelected = selectedTip === tip;
              return (
                <TouchableOpacity
                  key={tip}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTip(tip)}
                  style={[styles.tipBtn, isSelected && styles.tipBtnSelected]}
                >
                  <Text style={[styles.tipBtnText, isSelected && styles.tipBtnTextSelected]}>
                    {tip === 0 ? 'No tip' : `₹${tip}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Back to Home Button */}
        <Button title="Done • Back to Home" onPress={handleDone} showArrow style={styles.doneBtn} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Layout.spacing.md,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Layout.spacing.lg,
    lineHeight: 18,
  },
  fareCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  paidMethod: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Layout.spacing.md,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 13,
    color: Colors.gray600,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratingCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Layout.shadows.sm,
  },
  ratingCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.md,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginVertical: Layout.spacing.sm,
  },
  starBtn: {
    padding: 2,
  },
  sectionSubTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    alignSelf: 'flex-start',
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  tagPillSelected: {
    backgroundColor: '#FFF3E8',
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: Colors.gray700,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    width: '100%',
  },
  tipBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  tipBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tipBtnTextSelected: {
    color: Colors.white,
    fontWeight: '800',
  },
  doneBtn: {
    marginTop: Layout.spacing.lg,
    width: '100%',
  },
});

export default RideCompletedScreen;
