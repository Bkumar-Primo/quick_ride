import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name = 'Alex', size = 48, style }) => {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color={Colors.primary} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFE8D6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  initials: {
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
});

export default Avatar;
