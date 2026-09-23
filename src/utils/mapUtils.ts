import { getRhumbLineBearing } from 'geolib';

export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Calculates compass bearing (heading in degrees: 0..360) from start to end coordinate using geolib.
 */
export function calculateBearing(start: LatLng, end: LatLng): number {
  if (start.latitude === end.latitude && start.longitude === end.longitude) {
    return 0;
  }
  return getRhumbLineBearing(
    { latitude: start.latitude, longitude: start.longitude },
    { latitude: end.latitude, longitude: end.longitude },
  );
}

/**
 * Interpolates a set of key waypoints into a dense, smooth path for animation.
 */
export function interpolatePath(waypoints: LatLng[], stepsPerSegment = 25): LatLng[] {
  if (waypoints.length < 2) return waypoints;
  const densePath: LatLng[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i];
    const end = waypoints[i + 1];

    for (let s = 0; s < stepsPerSegment; s++) {
      const fraction = s / stepsPerSegment;
      densePath.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude: start.longitude + (end.longitude - start.longitude) * fraction,
      });
    }
  }

  // Include final point
  densePath.push(waypoints[waypoints.length - 1]);
  return densePath;
}

/**
 * Trims a polyline path as driver moves (Rapido style), returning only remaining untravelled points.
 */
export function trimPolyline(
  fullPath: LatLng[],
  currentIndex: number,
  currentPos?: LatLng,
): LatLng[] {
  if (!fullPath || fullPath.length === 0) return [];
  if (currentIndex >= fullPath.length - 1) {
    return [currentPos || fullPath[fullPath.length - 1]];
  }

  const remaining = fullPath.slice(currentIndex);
  if (currentPos) {
    return [currentPos, ...remaining.slice(1)];
  }
  return remaining;
}

/**
 * Computes optimal bounding box region for a set of coordinates.
 */
export function getRegionForCoordinates(points: LatLng[], padding = 1.4) {
  if (!points || points.length === 0) {
    return {
      latitude: 30.7060817,
      longitude: 76.6856152,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  for (const p of points) {
    minLat = Math.min(minLat, p.latitude);
    maxLat = Math.max(maxLat, p.latitude);
    minLng = Math.min(minLng, p.longitude);
    maxLng = Math.max(maxLng, p.longitude);
  }

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const latDelta = Math.max((maxLat - minLat) * padding, 0.012);
  const lngDelta = Math.max((maxLng - minLng) * padding, 0.012);

  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
