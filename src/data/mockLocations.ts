import type { LocationPoint } from '../types';

export const CURRENT_LOCATION: LocationPoint = {
  id: 'loc-current',
  title: 'MG Road, Sector 25',
  subtitle: 'Gurugram, Haryana 122002',
  address: 'MG Road, Sector 25, Gurugram, Haryana 122002',
  latitude: 28.4595,
  longitude: 77.0266,
  type: 'recent',
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

export const GURUGRAM_HOME: LocationPoint = {
  id: 'loc-home-ggn',
  title: 'Home',
  subtitle: 'Sector 56',
  address: 'Sector 56, Gurugram, Haryana 122011',
  latitude: 28.4245,
  longitude: 77.101,
  type: 'home',
};

export const DLF_CYBER_CITY: LocationPoint = {
  id: 'loc-cyber',
  title: 'DLF Cyber City',
  subtitle: 'Phase 2, Gurugram',
  address: 'DLF Cyber City, Gurugram, Haryana 122002',
  latitude: 28.4946,
  longitude: 77.0882,
  type: 'work',
};

export const AMBIENCE_MALL: LocationPoint = {
  id: 'loc-ambience',
  title: 'Ambience Mall',
  subtitle: 'National Highway 8, Gurugram',
  address: 'Ambience Mall, NH-8, Gurugram, Haryana 122002',
  latitude: 28.5055,
  longitude: 77.0969,
  type: 'popular',
};

export const IGI_AIRPORT: LocationPoint = {
  id: 'loc-igi',
  title: 'IGI Airport',
  subtitle: 'Indira Gandhi International Airport',
  address: 'Indira Gandhi International Airport, New Delhi 110037',
  latitude: 28.5562,
  longitude: 77.1,
  type: 'airport',
};

export const POPULAR_DESTINATIONS: LocationPoint[] = [
  DLF_CYBER_CITY,
  AMBIENCE_MALL,
  IGI_AIRPORT,
  SAHARA_MALL,
  KINGDOM_OF_DREAMS,
  ARAVALLI_PARK,
  MG_ROAD_METRO,
  {
    id: 'loc-bkc',
    title: 'Bandra Kurla Complex (BKC)',
    subtitle: 'G Block, BKC, Bandra East, Mumbai',
    address: 'Bandra Kurla Complex, G Block, Bandra East, Mumbai, Maharashtra 400051',
    latitude: 19.0657,
    longitude: 72.8687,
    type: 'work',
  },
  {
    id: 'loc-airport',
    title: 'Chhatrapati Shivaji Terminal 2',
    subtitle: 'International Airport, Sahar, Andheri East',
    address: 'Terminal 2, Mumbai International Airport, Andheri East, Mumbai 400099',
    latitude: 19.0974,
    longitude: 72.8744,
    type: 'airport',
  },
  {
    id: 'loc-powai',
    title: 'Hiranandani Gardens, Powai',
    subtitle: 'Central Ave, Hiranandani Business Park',
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076',
    latitude: 19.1197,
    longitude: 72.9056,
    type: 'popular',
  },
  {
    id: 'loc-juhu',
    title: 'Juhu Beach & Tara Road',
    subtitle: 'Juhu Tara Rd, Juhu, Mumbai',
    address: 'Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049',
    latitude: 19.0988,
    longitude: 72.8267,
    type: 'popular',
  },
  {
    id: 'loc-marinedrive',
    title: 'Marine Drive Promenade',
    subtitle: 'Netaji Subhash Chandra Bose Rd, Churchgate',
    address: 'Marine Drive, Nariman Point, Mumbai, Maharashtra 400021',
    latitude: 18.9432,
    longitude: 72.8236,
    type: 'popular',
  },
  {
    id: 'loc-home',
    title: 'Home (Green Heights Apt)',
    subtitle: 'Tower 3, Apt 1102, Link Road, Malad West',
    address: 'New Link Road, Malad West, Mumbai 400064',
    latitude: 19.1864,
    longitude: 72.8347,
    type: 'home',
  },
];
