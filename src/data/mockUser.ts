import type { UserProfile } from '../types';
import { AMBIENCE_MALL, DLF_CYBER_CITY, GURUGRAM_HOME } from './mockLocations';

export const MOCK_USER: UserProfile = {
  id: 'usr-901',
  name: 'Bittu Kumar',
  phone: '+91 98765 43210',
  email: 'bittu.dev@quickride.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  rating: 4.94,
  totalRides: 48,
  walletBalance: 450.0,
  memberSince: 'March 2025',
  savedPlaces: [GURUGRAM_HOME, DLF_CYBER_CITY, AMBIENCE_MALL],
};
