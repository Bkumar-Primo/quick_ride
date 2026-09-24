import type React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../../../assets';
import type { VehicleOption } from '../../types';

export type MapVehicleIcon = Exclude<keyof typeof images, 'staticMap'>;

export type MarkerData = {
  icon: MapVehicleIcon;
  x?: number;
  y?: number;
  flip?: boolean;
  bearing?: number;
  scale?: number;
};

const ICON_SIZE: Partial<Record<MapVehicleIcon, { width: number; height: number }>> = {
  bike2D: { width: 44, height: 44 },
  auto2D: { width: 44, height: 44 },
  cab2D: { width: 44, height: 44 },
  bikeLite: { width: 48, height: 32 },
  bikePlus: { width: 52, height: 34 },
  auto: { width: 52, height: 40 },
  cabEconomy: { width: 58, height: 36 },
  cabPremium: { width: 60, height: 38 },
  cabSuv: { width: 64, height: 40 },
};

export const mapIconForVehicle = (
  vehicle?: Pick<VehicleOption, 'id' | 'group'> | null,
): MapVehicleIcon => {
  if (!vehicle) return 'cab2D';
  if (vehicle.group === 'bike') return 'bike2D';
  if (vehicle.group === 'auto') return 'auto2D';
  return 'cab2D';
};

export const MapVehicleMarker: React.FC<MarkerData> = ({
  icon,
  x,
  y,
  flip,
  bearing = 0,
  scale = 1,
}) => {
  const size = ICON_SIZE[icon] || { width: 44, height: 44 };
  const width = size.width * scale;
  const height = size.height * scale;

  const is2D = icon === 'bike2D' || icon === 'auto2D' || icon === 'cab2D';
  // 2D top-down vehicle assets point North (0deg), while 3D side PNG assets face Right (90deg).
  const adjustedBearing = is2D ? bearing % 360 : (bearing - 90 + 360) % 360;

  const transformStyle = [{ rotate: `${adjustedBearing}deg` }, flip ? { scaleX: -1 } : null].filter(
    Boolean,
  ) as any;

  if (x !== undefined && y !== undefined) {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.wrap,
          {
            left: `${x}%`,
            top: `${y}%`,
            width,
            height,
            marginLeft: -width / 2,
            marginTop: -height / 2,
          },
        ]}
      >
        <View style={styles.halo} />
        <Image
          source={images[icon]}
          style={[styles.image, { width, height, transform: transformStyle }]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.standaloneWrap, { width, height }]}>
      <View style={styles.halo} />
      <Image
        source={images[icon]}
        style={[styles.image, { width, height, transform: transformStyle }]}
        resizeMode="contain"
      />
    </View>
  );
};

export const MapVehicleLayer: React.FC<{ markers: MarkerData[] }> = ({ markers }) => (
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
  standaloneWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: '78%',
    height: '78%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 107, 0, 0.16)',
  },
  image: {
    zIndex: 1,
  },
});
