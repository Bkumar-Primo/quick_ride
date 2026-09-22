import type React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../../../assets';
import { FINVASIA_LOCATION } from '../../data/mockLocations';
import { getGeoapifyStaticMapUrl } from '../../services/mapService';
import { useRideStore } from '../../store/rideStore';

interface StaticMapBackgroundProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  showDestination?: boolean;
}

export const StaticMapBackground: React.FC<StaticMapBackgroundProps> = ({
  latitude: customLat,
  longitude: customLon,
  zoom = 13,
  showDestination = true,
}) => {
  const pickup = useRideStore((state) => state.pickup);
  const destination = useRideStore((state) => state.destination);
  const flowStep = useRideStore((state) => state.flowStep);
  const [hasError, setHasError] = useState(false);

  const lat = customLat ?? pickup?.latitude ?? 30.7060817;
  const lon = customLon ?? pickup?.longitude ?? 76.6856152;
  const isConfirmed = [
    'DRIVER_ASSIGNED',
    'DRIVER_ARRIVING',
    'DRIVER_ARRIVED',
    'RIDE_IN_PROGRESS',
  ].includes(flowStep);
  const driverLat = isConfirmed ? FINVASIA_LOCATION.latitude : undefined;
  const driverLon = isConfirmed ? FINVASIA_LOCATION.longitude : undefined;
  const destLat = isConfirmed && showDestination ? destination?.latitude : undefined;
  const destLon = isConfirmed && showDestination ? destination?.longitude : undefined;

  const mapUrl = getGeoapifyStaticMapUrl({
    latitude: lat,
    longitude: lon,
    latitudeDelta: isConfirmed ? 0.0115 : undefined,
    longitudeDelta: isConfirmed ? 0.0052 : undefined,
    zoom: customLat ? zoom : isConfirmed ? 13.5 : 15.5,
    width: 800,
    height: 1200,
    destLat,
    destLon,
    driverLat,
    driverLon,
    isConfirmed,
  });

  return (
    <View style={styles.container}>
      <Image source={images.staticMap} style={styles.image} resizeMode="cover" />
      {!hasError && (
        <Image
          source={{ uri: mapUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#E8EEF2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default StaticMapBackground;
