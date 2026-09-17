import type React from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

const masterLogo = require('../../assets/images/logo.png');
const logoIcon = require('../../assets/images/logo_icon.png');

interface QuickRideLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIconOnly?: boolean;
  showTagline?: boolean;
  style?: ViewStyle;
}

export const QuickRideLogo: React.FC<QuickRideLogoProps> = ({
  size = 'md',
  showIconOnly = false,
  showTagline = false,
  style,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { logoWidth: 108, logoHeight: 30, iconSize: 26, taglineSize: 7 };
      case 'sm':
        return { logoWidth: 120, logoHeight: 33, iconSize: 32, taglineSize: 8 };
      case 'lg':
        return { logoWidth: 220, logoHeight: 61, iconSize: 64, taglineSize: 11 };
      default:
        return { logoWidth: 155, logoHeight: 43, iconSize: 42, taglineSize: 10 };
    }
  };

  const { logoWidth, logoHeight, iconSize, taglineSize } = getDimensions();

  return (
    <View style={[styles.container, style]}>
      {showIconOnly ? (
        <Image
          source={logoIcon}
          style={{ width: iconSize, height: iconSize, borderRadius: iconSize * 0.22 }}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={masterLogo}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      )}
      {showTagline && (
        <Text style={[styles.tagline, { fontSize: taglineSize }]}>
          YOUR RIDE. ANYTIME. ANYWHERE.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontWeight: '700',
    color: Colors.gray500,
    letterSpacing: 2,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default QuickRideLogo;
