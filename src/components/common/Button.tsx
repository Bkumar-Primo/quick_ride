import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  showArrow = false,
  icon,
  style,
  textStyle,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_e) {
        // ignore on unsupported devices
      }
    }
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'danger':
        return styles.dangerContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'md':
        return styles.sizeMd;
      default:
        return styles.sizeLg;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.base, getContainerStyle(), getSizeStyle(), disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={variant === 'outline' ? Colors.primary : Colors.white}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.textBase, getTextStyle(), textStyle]}>{title}</Text>
          {showArrow && (
            <Ionicons
              name="arrow-forward"
              size={size === 'sm' ? 16 : 20}
              color={variant === 'outline' ? Colors.primary : Colors.white}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: Layout.spacing.xl,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
    ...Layout.shadows.orangeGlow,
  },
  secondaryContainer: {
    backgroundColor: Colors.secondary,
    ...Layout.shadows.sm,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  sizeSm: {
    height: 40,
    paddingHorizontal: Layout.spacing.md,
  },
  sizeMd: {
    height: 48,
    paddingHorizontal: Layout.spacing.lg,
  },
  sizeLg: {
    height: 56,
    paddingHorizontal: Layout.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  primaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.danger,
  },
  iconLeft: {
    marginRight: Layout.spacing.sm,
  },
  iconRight: {
    marginLeft: Layout.spacing.sm,
  },
});

export default Button;
