import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import type { LocationPoint } from '../types';

const GPS_TIMEOUT_MS = 8000;

export type LocationRequestResult = {
  granted: boolean;
  location?: LocationPoint;
  message?: string;
  canOpenSettings?: boolean;
};

function buildAddress(place: Location.LocationGeocodedAddress): {
  title: string;
  subtitle: string;
  address: string;
} {
  const title = place.name || place.street || place.district || place.city || 'Current location';
  const subtitle = [
    place.streetNumber && place.street ? `${place.streetNumber} ${place.street}` : place.street,
    place.city,
    place.region,
  ]
    .filter(Boolean)
    .join(', ');
  const address = place.formattedAddress || subtitle || title;
  return { title, subtitle: subtitle || title, address };
}

function toLocationPoint(latitude: number, longitude: number): LocationPoint {
  const subtitle = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  return {
    id: 'loc-current-gps',
    title: 'Current location',
    subtitle,
    address: subtitle,
    latitude,
    longitude,
    type: 'recent',
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Location timed out')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function readCoordinates(): Promise<LocationPoint | undefined> {
  if (Platform.OS === 'android') {
    try {
      await Location.enableNetworkProviderAsync();
    } catch {
      // User can dismiss the accuracy dialog; GPS may still work.
    }
  }

  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last?.coords) {
      return toLocationPoint(last.coords.latitude, last.coords.longitude);
    }
  } catch {
    // Fall through to a fresh GPS reading.
  }

  const position = await withTimeout(
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    }),
    GPS_TIMEOUT_MS,
  );
  return toLocationPoint(position.coords.latitude, position.coords.longitude);
}

async function attachAddress(point: LocationPoint): Promise<LocationPoint> {
  if (Platform.OS === 'web') return point;
  try {
    const places = await withTimeout(
      Location.reverseGeocodeAsync({
        latitude: point.latitude,
        longitude: point.longitude,
      }),
      4000,
    );
    const place = places[0];
    if (!place) return point;
    const parsed = buildAddress(place);
    return { ...point, ...parsed };
  } catch {
    return point;
  }
}

export async function requestCurrentLocation(): Promise<LocationRequestResult> {
  let permission: Location.LocationPermissionResponse;
  try {
    permission = await Location.requestForegroundPermissionsAsync();
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    const needsRebuild =
      /nslocation|usage description|native module|cannot find|expo-location/i.test(raw);
    return {
      granted: false,
      message: needsRebuild
        ? 'Location is not available in this iOS build. Rebuild the app with npx expo run:ios so the permission prompt can appear.'
        : `Could not request location permission. ${raw}`,
    };
  }

  if (permission.status !== 'granted') {
    return {
      granted: false,
      canOpenSettings: permission.canAskAgain === false,
      message:
        'Location permission was not granted. In iOS Simulator set Features → Location to Apple (or a custom location), then allow access when prompted.',
    };
  }

  try {
    const coords = await readCoordinates();
    const location = coords ? await attachAddress(coords) : undefined;
    return { granted: true, location };
  } catch {
    // Permission was granted; still continue if the simulator has no GPS fix yet.
    return { granted: true };
  }
}

export function openLocationSettings(): void {
  void Linking.openSettings();
}
