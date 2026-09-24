import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPhoneInput?: boolean;
  countryCode?: string;
  countryFlag?: string;
  onPressCountryCode?: () => void;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      icon,
      isPhoneInput = false,
      countryCode = '+91',
      countryFlag = '🇮🇳',
      onPressCountryCode,
      onClear,
      value,
      containerStyle,
      style,
      ...props
    },
    ref,
  ) => {
    return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, error ? styles.containerError : null]}>
        {isPhoneInput ? (
          <TouchableOpacity
            style={styles.countryPicker}
            activeOpacity={0.7}
            onPress={onPressCountryCode}
          >
            <Text style={styles.flag}>{countryFlag}</Text>
            <Text style={styles.countryCode}>{countryCode}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.gray600} />
            <View style={styles.divider} />
          </TouchableOpacity>
        ) : icon ? (
          <Ionicons name={icon} size={20} color={Colors.gray500} style={styles.icon} />
        ) : null}

        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={Colors.gray400}
          value={value}
          selectionColor={Colors.primary}
          {...props}
        />

        {value && onClear ? (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray600,
    marginBottom: Layout.spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Layout.spacing.lg,
    height: 56,
    ...Layout.shadows.sm,
  },
  containerError: {
    borderColor: Colors.danger,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray300,
    marginHorizontal: Layout.spacing.sm,
  },
  icon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    height: '100%',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
