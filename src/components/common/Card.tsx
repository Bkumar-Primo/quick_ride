import type React from 'react';
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, variant = 'elevated' }) => {
  const containerStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
  },
  elevated: {
    ...Layout.shadows.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  flat: {
    backgroundColor: Colors.gray50,
  },
});

export default Card;
