import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

export const RoundIconButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ icon, onPress, size = 44, color = Colors.gray700, style }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.roundBtn, { width: size, height: size, borderRadius: size / 2 }, style]}
  >
    <Ionicons name={icon} size={size > 40 ? 20 : 18} color={color} />
  </TouchableOpacity>
);

export const PrimaryPillButton: React.FC<{
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ title, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.primaryPill, style]}>
    <Text style={styles.primaryPillText}>{title}</Text>
    <Ionicons name="arrow-forward" size={18} color={Colors.white} />
  </TouchableOpacity>
);

export const SoftPillButton: React.FC<{
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ title, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.softPill, style]}>
    <Text style={styles.softPillText}>{title}</Text>
  </TouchableOpacity>
);

export const RideSheet: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }, style]}>
      {children}
    </View>
  );
};

export const MapControlsColumn: React.FC<{
  top?: number;
  bottom?: number;
  extra?: React.ReactNode;
}> = ({ top, bottom, extra }) => (
  <View
    style={[styles.controls, top != null && { top }, bottom != null && { bottom, top: undefined }]}
  >
    {extra}
    <RoundIconButton icon="locate-outline" />
    <RoundIconButton icon="navigate" />
  </View>
);

export const MapSheetScreen: React.FC<{
  map: React.ReactNode;
  overlay?: React.ReactNode;
  children: React.ReactNode;
  mapFlex?: number;
}> = ({ map, overlay, children, mapFlex = 0.34 }) => (
  <View style={styles.flow}>
    <View style={[styles.mapPane, { flex: mapFlex }]}>
      {map}
      {overlay}
    </View>
    <View style={styles.sheetPane}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  roundBtn: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  primaryPill: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Layout.shadows.orangeGlow,
  },
  primaryPillText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  softPill: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  softPillText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 22,
    ...Layout.shadows.lg,
  },
  flow: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mapPane: {
    position: 'relative',
    overflow: 'hidden',
  },
  sheetPane: {
    flex: 1,
    minHeight: 0,
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 120,
    gap: 10,
    zIndex: 5,
  },
});
