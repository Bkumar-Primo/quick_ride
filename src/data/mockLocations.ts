import type { LocationPoint } from '../types';

export const FINVASIA_DRIVER_START: LocationPoint = {
  id: 'loc-finvasia',
  title: 'Finvasia',
  subtitle: 'Industrial Area Phase 8B, Mohali',
  address: 'Finvasia, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160055',
  latitude: 30.7093383,
  longitude: 76.682954,
  type: 'recent',
};

export const SM_HEIGHTS_PICKUP: LocationPoint = {
  id: 'loc-sm-heights',
  title: 'SM Heights',
  subtitle: 'Industrial Area Phase 8B, Mohali',
  address: 'SM Heights, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160055',
  // latitude: 30.7060817,
  // longitude: 76.6856152,
  latitude: 30.707121,
  longitude: 76.685022,
  type: 'recent',
};

export const CP67_MALL_DESTINATION: LocationPoint = {
  id: 'loc-cp67-mall',
  title: 'CP 67 Mall',
  subtitle: 'Airport Road, Sector 67, Mohali',
  address: 'CP 67 Mall, International Airport Road, Sector 67, Mohali, Punjab 160062',
  latitude: 30.677714,
  longitude: 76.7206665,
  type: 'popular',
};

export const CURRENT_LOCATION: LocationPoint = SM_HEIGHTS_PICKUP;

export const DEMO_DRIVER_ROUTE = {
  driverStart: FINVASIA_DRIVER_START,
  pickup: SM_HEIGHTS_PICKUP,
  destination: CP67_MALL_DESTINATION,
  // Turn-by-turn road waypoints for Driver -> Pickup segment (Finvasia to SM Heights)
  driverToPickupWaypoints: [
    { latitude: 30.7093383, longitude: 76.682954 },
    { latitude: 30.708435, longitude: 76.683708 },
    { latitude: 30.708336, longitude: 76.683548 },
    { latitude: 30.708302, longitude: 76.683506 },
    { latitude: 30.708251, longitude: 76.6835 },
    { latitude: 30.70817, longitude: 76.68354 },
    { latitude: 30.707655, longitude: 76.684006 },
    { latitude: 30.706938, longitude: 76.684614 },
    { latitude: 30.706559, longitude: 76.684002 },
    { latitude: 30.706054, longitude: 76.684407 },
    { latitude: 30.706022, longitude: 76.684433 },
    { latitude: 30.70557, longitude: 76.684795 },
    { latitude: 30.705244, longitude: 76.68506 },
    { latitude: 30.705762, longitude: 76.685886 },
    { latitude: 30.7060817, longitude: 76.6856152 },
  ],
  // Turn-by-turn road waypoints for Pickup -> Destination segment (SM Heights to CP 67 Mall via Airport Road)
  pickupToDestWaypoints: [
    { latitude: 30.7060817, longitude: 76.6856152 },
    { latitude: 30.705762, longitude: 76.685886 },
    { latitude: 30.70679, longitude: 76.687529 },
    { latitude: 30.706686, longitude: 76.687617 },
    { latitude: 30.706255, longitude: 76.687983 },
    { latitude: 30.705644, longitude: 76.688497 },
    { latitude: 30.704808, longitude: 76.6892 },
    { latitude: 30.70491, longitude: 76.689373 },
    { latitude: 30.705241, longitude: 76.689973 },
    { latitude: 30.705985, longitude: 76.691165 },
    { latitude: 30.706068, longitude: 76.691299 },
    { latitude: 30.706131, longitude: 76.691399 },
    { latitude: 30.706635, longitude: 76.692208 },
    { latitude: 30.707051, longitude: 76.692864 },
    { latitude: 30.708509, longitude: 76.695125 },
    { latitude: 30.70866, longitude: 76.695373 },
    { latitude: 30.708803, longitude: 76.695592 },
    { latitude: 30.709071, longitude: 76.696056 },
    { latitude: 30.70918, longitude: 76.696228 },
    { latitude: 30.708665, longitude: 76.69662 },
    { latitude: 30.705944, longitude: 76.698792 },
    { latitude: 30.70325, longitude: 76.70114 },
    { latitude: 30.703187, longitude: 76.701228 },
    { latitude: 30.702841, longitude: 76.701579 },
    { latitude: 30.702736, longitude: 76.70168 },
    { latitude: 30.702291, longitude: 76.70205 },
    { latitude: 30.701881, longitude: 76.702391 },
    { latitude: 30.700331, longitude: 76.703705 },
    { latitude: 30.698496, longitude: 76.705289 },
    { latitude: 30.698442, longitude: 76.705336 },
    { latitude: 30.698348, longitude: 76.705417 },
    { latitude: 30.69782, longitude: 76.705848 },
    { latitude: 30.697447, longitude: 76.706149 },
    { latitude: 30.697389, longitude: 76.706197 },
    { latitude: 30.696758, longitude: 76.706717 },
    { latitude: 30.696446, longitude: 76.70699 },
    { latitude: 30.696071, longitude: 76.707292 },
    { latitude: 30.695959, longitude: 76.707364 },
    { latitude: 30.695834, longitude: 76.707378 },
    { latitude: 30.695669, longitude: 76.70736 },
    { latitude: 30.695456, longitude: 76.707348 },
    { latitude: 30.695275, longitude: 76.707341 },
    { latitude: 30.695111, longitude: 76.707405 },
    { latitude: 30.695008, longitude: 76.707477 },
    { latitude: 30.694924, longitude: 76.707592 },
    { latitude: 30.694792, longitude: 76.707879 },
    { latitude: 30.694741, longitude: 76.708158 },
    { latitude: 30.6947, longitude: 76.708361 },
    { latitude: 30.694679, longitude: 76.708432 },
    { latitude: 30.694627, longitude: 76.708508 },
    { latitude: 30.694026, longitude: 76.709 },
    { latitude: 30.693909, longitude: 76.709089 },
    { latitude: 30.693006, longitude: 76.709848 },
    { latitude: 30.692133, longitude: 76.710569 },
    { latitude: 30.691538, longitude: 76.711055 },
    { latitude: 30.691361, longitude: 76.711203 },
    { latitude: 30.691246, longitude: 76.711298 },
    { latitude: 30.691217, longitude: 76.711323 },
    { latitude: 30.690984, longitude: 76.711524 },
    { latitude: 30.690886, longitude: 76.711615 },
    { latitude: 30.690417, longitude: 76.711974 },
    { latitude: 30.690282, longitude: 76.712084 },
    { latitude: 30.689531, longitude: 76.712718 },
    { latitude: 30.688391, longitude: 76.713673 },
    { latitude: 30.687851, longitude: 76.714128 },
    { latitude: 30.685989, longitude: 76.715694 },
    { latitude: 30.685505, longitude: 76.716102 },
    { latitude: 30.685417, longitude: 76.716175 },
    { latitude: 30.685059, longitude: 76.716464 },
    { latitude: 30.684968, longitude: 76.716539 },
    { latitude: 30.684872, longitude: 76.716634 },
    { latitude: 30.684397, longitude: 76.717028 },
    { latitude: 30.682148, longitude: 76.718893 },
    { latitude: 30.682085, longitude: 76.718945 },
    { latitude: 30.680131, longitude: 76.720594 },
    { latitude: 30.68008, longitude: 76.720637 },
    { latitude: 30.679579, longitude: 76.721057 },
    { latitude: 30.679165, longitude: 76.721403 },
    { latitude: 30.679096, longitude: 76.72146 },
    { latitude: 30.679011, longitude: 76.721535 },
    { latitude: 30.678934, longitude: 76.721392 },
    { latitude: 30.67851, longitude: 76.720706 },
    { latitude: 30.678139, longitude: 76.720098 },
    { latitude: 30.678016, longitude: 76.72021 },
    { latitude: 30.67823, longitude: 76.720521 },
    { latitude: 30.678238, longitude: 76.720567 },
    { latitude: 30.678236, longitude: 76.720606 },
    { latitude: 30.678218, longitude: 76.720637 },
    { latitude: 30.677849, longitude: 76.720949 },
    { latitude: 30.677714, longitude: 76.7206665 },
  ],
};

export const MG_ROAD_METRO: LocationPoint = {
  id: 'loc-metro',
  title: 'MG Road Metro Station',
  subtitle: 'MG Road, Gurugram',
  address: 'MG Road Metro Station, Gurugram, Haryana 122002',
  latitude: 28.4808,
  longitude: 77.0802,
  type: 'recent',
};

export const SAHARA_MALL: LocationPoint = {
  id: 'loc-sahara',
  title: 'Sahara Mall',
  subtitle: 'MG Road, Gurugram',
  address: 'Sahara Mall, MG Road, Gurugram, Haryana 122002',
  latitude: 28.4794,
  longitude: 77.0809,
  type: 'popular',
};

export const KINGDOM_OF_DREAMS: LocationPoint = {
  id: 'loc-kod',
  title: 'Kingdom of Dreams',
  subtitle: 'Sector 29, Gurugram',
  address: 'Kingdom of Dreams, Sector 29, Gurugram, Haryana 122001',
  latitude: 28.4679,
  longitude: 77.0688,
  type: 'popular',
};

export const ARAVALLI_PARK: LocationPoint = {
  id: 'loc-aravalli',
  title: 'Aravalli Biodiversity Park',
  subtitle: 'Gurugram',
  address: 'Aravalli Biodiversity Park, Gurugram, Haryana 122001',
  latitude: 28.48,
  longitude: 77.05,
  type: 'popular',
};

export const DEMO_ROUTE = {
  distanceKm: 6.8,
  durationMin: 12,
  estimatedFare: 180,
};

export const MOHALI_HOME: LocationPoint = {
  id: 'loc-home-mohali',
  title: 'Home',
  subtitle: 'Sector 70, Mohali',
  address: 'Sector 70, Sahibzada Ajit Singh Nagar, Mohali, Punjab 160071',
  latitude: 30.6947,
  longitude: 76.7121,
  type: 'home',
};

export const GURUGRAM_HOME: LocationPoint = MOHALI_HOME;

export const DLF_CYBER_CITY: LocationPoint = CP67_MALL_DESTINATION;

export const VR_PUNJAB_MALL: LocationPoint = {
  id: 'loc-vr-punjab',
  title: 'VR Punjab Mall',
  subtitle: 'Kharar - Landran Rd, Mohali',
  address: 'VR Punjab Mall, NH-21, Kharar, Mohali, Punjab 140301',
  latitude: 30.738,
  longitude: 76.657,
  type: 'popular',
};

export const AMBIENCE_MALL: LocationPoint = VR_PUNJAB_MALL;

export const MOHALI_AIRPORT: LocationPoint = {
  id: 'loc-ixc-airport',
  title: 'Chandigarh Int. Airport (IXC)',
  subtitle: 'Airport Road, Mohali',
  address: 'Chandigarh International Airport, New Civil Air Terminal, Mohali, Punjab 160004',
  latitude: 30.6735,
  longitude: 76.7885,
  type: 'airport',
};

export const IGI_AIRPORT: LocationPoint = MOHALI_AIRPORT;

export const PHASE_3B2_MARKET: LocationPoint = {
  id: 'loc-phase3b2',
  title: 'Phase 3B2 Market',
  subtitle: 'Sector 60, Mohali',
  address: 'Phase 3B2 Market, Sector 60, Mohali, Punjab 160059',
  latitude: 30.7104,
  longitude: 76.7214,
  type: 'popular',
};

export const POPULAR_DESTINATIONS: LocationPoint[] = [
  CP67_MALL_DESTINATION,
  VR_PUNJAB_MALL,
  MOHALI_AIRPORT,
  PHASE_3B2_MARKET,
  MOHALI_HOME,
  {
    id: 'loc-bestech',
    title: 'Bestech Square Mall',
    subtitle: 'Sector 66, Mohali',
    address: 'Bestech Square Mall, Sector 66, Mohali, Punjab 160062',
    latitude: 30.6865,
    longitude: 76.7325,
    type: 'popular',
  },
  {
    id: 'loc-sec70-market',
    title: 'Sector 70 Market',
    subtitle: 'Sector 70, Mohali',
    address: 'Sector 70 Market, Mohali, Punjab 160071',
    latitude: 30.695,
    longitude: 76.713,
    type: 'recent',
  },
];
