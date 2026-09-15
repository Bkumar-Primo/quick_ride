import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type React from 'react';
import { Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray200,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'RideTab':
              iconName = focused ? 'car-sport' : 'car-sport-outline';
              break;
            case 'ActivityTab':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'WalletTab':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'AccountTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'car';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="RideTab" component={HomeScreen} options={{ tabBarLabel: 'Ride' }} />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityScreen}
        options={{ tabBarLabel: 'Activity' }}
      />
      <Tab.Screen name="WalletTab" component={WalletScreen} options={{ tabBarLabel: 'Wallet' }} />
      <Tab.Screen
        name="AccountTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
