import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { ActiveRideScreen } from '../screens/home/ActiveRideScreen';
import { BookingConfirmScreen } from '../screens/home/BookingConfirmScreen';
import { DriverAssignedScreen } from '../screens/home/DriverAssignedScreen';
import { DriverCallScreen } from '../screens/home/DriverCallScreen';
import { DriverChatScreen } from '../screens/home/DriverChatScreen';
import { LocationSearchScreen } from '../screens/home/LocationSearchScreen';
import { PickupConfirmScreen } from '../screens/home/PickupConfirmScreen';
import { RideCompletedScreen } from '../screens/home/RideCompletedScreen';
import { RoutePreviewScreen } from '../screens/home/RoutePreviewScreen';
import { SearchingDriverScreen } from '../screens/home/SearchingDriverScreen';
import { VehicleSelectScreen } from '../screens/home/VehicleSelectScreen';
import { PrivacyPolicyScreen } from '../screens/legal/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '../screens/legal/TermsOfServiceScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const [splashFinished, setSplashFinished] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasGrantedLocation = useAuthStore((state) => state.hasGrantedLocation);

  const showMainApp = isAuthenticated && hasGrantedLocation;

  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!showMainApp ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            <RootStack.Screen name="DriverChat" component={DriverChatScreen} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
            <RootStack.Screen name="Wallet" component={WalletScreen} />
            <RootStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
            <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
