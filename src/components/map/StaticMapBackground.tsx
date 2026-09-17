import type React from 'react';
import { Image, StyleSheet } from 'react-native';
import { images } from '../../../assets';

export const StaticMapBackground: React.FC = () => (
  <Image source={images.staticMap} style={styles.image} resizeMode="cover" />
);

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
