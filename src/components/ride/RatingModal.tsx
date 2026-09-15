import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

interface RatingModalProps {
  visible: boolean;
  driverName?: string;
  driverAvatar?: string;
  carModel?: string;
  onSubmit: (rating: number, tip: number, tags: string[]) => void;
  onSkip: () => void;
}

const FEEDBACK_TAGS = [
  'Clean & Fresh Car',
  'Polite Driver',
  'Smooth Driving',
  'Great Music',
  'Safe Route',
  'On-time Arrival',
];

const TIP_OPTIONS = [0, 20, 50, 100];

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  driverName = 'Rahul Sharma',
  driverAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  carModel = 'White Honda City',
  onSubmit,
  onSkip,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Clean & Fresh Car',
    'Polite Driver',
  ]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.driverSection}>
            <Avatar name={driverName} size={64} />
            <Text style={styles.title}>How was your ride with {driverName}?</Text>
            <Text style={styles.subtitle}>{carModel}</Text>
          </View>

          {/* Star Rating */}
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

          {/* Feedback tags */}
          <Text style={styles.sectionLabel}>What went well?</Text>
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

          {/* Driver Tip */}
          <Text style={styles.sectionLabel}>Add a tip for {driverName}</Text>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((tip) => {
              const isSelected = selectedTip === tip;
              return (
                <TouchableOpacity
                  key={tip}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTip(tip)}
                  style={[styles.tipPill, isSelected && styles.tipPillSelected]}
                >
                  <Text style={[styles.tipText, isSelected && styles.tipTextSelected]}>
                    {tip === 0 ? 'No tip' : `₹${tip}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Submit Feedback"
              variant="primary"
              onPress={() => onSubmit(rating, selectedTip, selectedTags)}
              style={styles.submitBtn}
            />
            <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    ...Layout.shadows.lg,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    marginBottom: Layout.spacing.lg,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginVertical: Layout.spacing.md,
  },
  starBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 14,
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
    paddingVertical: 7,
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
  tipPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  tipPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tipTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  actions: {
    width: '100%',
    marginTop: Layout.spacing.xl,
    gap: Layout.spacing.sm,
  },
  submitBtn: {
    width: '100%',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray500,
  },
});

export default RatingModal;
