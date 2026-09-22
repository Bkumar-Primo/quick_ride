export const GEOAPIFY_API_KEY = '177013cbc0294cbf8efaa492b88e1ce2';

export interface StaticMapUrlOptions {
  latitude: number;
  longitude: number;
  zoom?: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  width?: number;
  height?: number;
  destLat?: number;
  destLon?: number;
  driverLat?: number;
  driverLon?: number;
  isConfirmed?: boolean;
  style?: string;
}

export const getGeoapifyStaticMapUrl = ({
  latitude,
  longitude,
  zoom = 15.5,
  latitudeDelta,
  longitudeDelta,
  width = 800,
  height = 1200,
  destLat,
  destLon,
  driverLat,
  driverLon,
  isConfirmed = false,
  style = 'osm-bright-smooth',
}: StaticMapUrlOptions): string => {
  const computedZoom = latitudeDelta ? Math.round(Math.log2(360 / latitudeDelta) - 1.5) : zoom;

  // If ride is not confirmed, focus tightly on current location without polyline
  if (!isConfirmed) {
    let url = `https://maps.geoapify.com/v1/staticmap?style=${style}&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${computedZoom}&apiKey=${GEOAPIFY_API_KEY}`;
    url += `&marker=lonlat:${longitude},${latitude};color:%23ff6b00;size:medium;icon:circle`;
    return url;
  }

  // Centered directly on current active location / driver coordinates
  const mapZoom = computedZoom || 15.5;
  let url = `https://maps.geoapify.com/v1/staticmap?style=${style}&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${mapZoom}&apiKey=${GEOAPIFY_API_KEY}`;

  const markers: string[] = [
    `lonlat:${longitude},${latitude};color:%23ff6b00;size:medium;icon:circle`,
  ];

  if (driverLat && driverLon) {
    markers.push(`lonlat:${driverLon},${driverLat};color:%232563eb;size:medium;icon:car`);
  }

  if (destLat && destLon) {
    markers.push(`lonlat:${destLon},${destLat};color:%23ef4444;size:medium;icon:flag`);
  }

  url += `&marker=${markers.join('|')}`;

  // Actual road polyline waypoints along Sector 74, 73, 70, Kumbhra, 67, and Airport Road
  const roadWaypoints = [
    'lonlat:76.682954,30.7093383',
    'lonlat:76.683500,30.7081000',
    'lonlat:76.684500,30.7072000',
    'lonlat:76.6856152,30.7060817',
    'lonlat:76.689000,30.7015000',
    'lonlat:76.694000,30.6970000',
    'lonlat:76.701000,30.6920000',
    'lonlat:76.709000,30.6860000',
    'lonlat:76.715000,30.6815000',
    'lonlat:76.7206665,30.6777140',
  ];

  url += `&path=${roadWaypoints.join('|')};color:%23ff6b00;weight:4`;

  return url;
};
