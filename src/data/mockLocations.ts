import type { LocationPoint } from '../types';

export const CURRENT_LOCATION: LocationPoint = {
  id: 'loc-current',
  title: 'Oberoi Mall, Goregaon East',
  subtitle: 'Western Express Highway, Yashodham, Mumbai',
  address: 'Western Express Highway, Yashodham, Goregaon, Mumbai, Maharashtra 400063',
  latitude: 19.1738,
  longitude: 72.8611,
  type: 'recent',
};

export const POPULAR_DESTINATIONS: LocationPoint[] = [
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
