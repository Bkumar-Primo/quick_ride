import type React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/colors';
import { SM_HEIGHTS_PICKUP } from '../../data/mockLocations';
import { MapVehicleMarker } from './MapVehicleMarker';

const NEARBY_DRIVERS = [
  { icon: 'bikeLite' as const, latOffset: 0.002, lngOffset: 0.0018, bearing: 45 },
  { icon: 'auto' as const, latOffset: -0.0015, lngOffset: 0.0025, bearing: 180 },
  { icon: 'cabEconomy' as const, latOffset: 0.003, lngOffset: -0.002, bearing: 290 },
  { icon: 'cabSuv' as const, latOffset: -0.0022, lngOffset: -0.0015, bearing: 120 },
  { icon: 'bikePlus' as const, latOffset: 0.0012, lngOffset: -0.0032, bearing: 75 },
];

export const HomeExploreMap: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: SM_HEIGHTS_PICKUP.latitude,
          longitude: SM_HEIGHTS_PICKUP.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsCompass={false}
        showsUserLocation={true}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: SM_HEIGHTS_PICKUP.latitude,
            longitude: SM_HEIGHTS_PICKUP.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.youAreHere}>
            <View style={styles.hereBubble}>
              <Text style={styles.hereText}>You are here</Text>
            </View>
            <View style={styles.hereDot} />
          </View>
        </Marker>

        {/* Nearby Drivers */}
        {NEARBY_DRIVERS.map((driver, index) => (
          <Marker
            key={`driver-${index}`}
            coordinate={{
              latitude: SM_HEIGHTS_PICKUP.latitude + driver.latOffset,
              longitude: SM_HEIGHTS_PICKUP.longitude + driver.lngOffset,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={driver.bearing}
          >
            <MapVehicleMarker icon={driver.icon} bearing={driver.bearing} scale={0.95} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E8EEF2',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  youAreHere: {
    alignItems: 'center',
  },
  hereBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  hereText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hereDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    borderWidth: 3,
    borderColor: Colors.white,
  },
});

export default HomeExploreMap;
