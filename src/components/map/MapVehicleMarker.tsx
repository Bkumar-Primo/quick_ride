import type React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../../../assets';
import type { VehicleOption } from '../../types';

export type MapVehicleIcon = Exclude<keyof typeof images, 'staticMap'>;

type Marker = {
  icon: MapVehicleIcon;
  x: number;
  y: number;
  flip?: boolean;
};

const ICON_SIZE: Record<MapVehicleIcon, { width: number; height: number }> = {
  bikeLite: { width: 54, height: 36 },
  bikePlus: { width: 58, height: 38 },
  auto: { width: 58, height: 44 },
  cabEconomy: { width: 66, height: 40 },
  cabPremium: { width: 68, height: 42 },
  cabSuv: { width: 72, height: 44 },
};

export const mapIconForVehicle = (vehicle: Pick<VehicleOption, 'id' | 'group'>): MapVehicleIcon => {
  switch (vehicle.id) {
    case 'veh-bike':
      return 'bikeLite';
    case 'veh-bike-plus':
      return 'bikePlus';
    case 'veh-auto':
      return 'auto';
    case 'veh-comfort':
      return 'cabPremium';
    case 'veh-xl':
      return 'cabSuv';
    default:
      return vehicle.group === 'bike'
        ? 'bikeLite'
        : vehicle.group === 'auto'
          ? 'auto'
          : 'cabEconomy';
  }
};

export const MapVehicleMarker: React.FC<Marker> = ({ icon, x, y, flip }) => {
  const size = ICON_SIZE[icon];
  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          left: `${x}%`,
          top: `${y}%`,
          width: size.width,
          height: size.height,
          marginLeft: -size.width / 2,
          marginTop: -size.height / 2,
        },
      ]}
    >
      <View style={styles.halo} />
      <Image
        source={images[icon]}
        style={[styles.image, size, flip && styles.flip]}
        resizeMode="contain"
      />
    </View>
  );
};

export const MapVehicleLayer: React.FC<{ markers: Marker[] }> = ({ markers }) => (
  <View pointerEvents="none" style={styles.layer}>
    {markers.map((marker, index) => (
      <MapVehicleMarker key={`${marker.icon}-${index}`} {...marker} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  wrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: '72%',
    height: '72%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 107, 0, 0.14)',
  },
  image: {
    zIndex: 1,
  },
  flip: {
    transform: [{ scaleX: -1 }],
  },
});
