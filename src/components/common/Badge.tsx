import type React from 'react';
import { StyleSheet, Text, type TextStyle, View, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'sm',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'danger':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'info':
        return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'neutral':
        return { bg: '#F3F4F6', text: '#4B5563' };
      default:
        return { bg: '#FFF3E8', text: Colors.primary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        style,
      ]}
    >
      <Text style={[styles.text, { color: text }, size === 'md' && styles.textMd, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sizeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sizeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textMd: {
    fontSize: 13,
  },
});

export default Badge;
