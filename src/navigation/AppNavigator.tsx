import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { ActiveRideScreen } from '../screens/home/ActiveRideScreen';
import { DriverAssignedScreen } from '../screens/home/DriverAssignedScreen';
import { LocationSearchScreen } from '../screens/home/LocationSearchScreen';
import { RideCompletedScreen } from '../screens/home/RideCompletedScreen';
import { SearchingDriverScreen } from '../screens/home/SearchingDriverScreen';
import { VehicleSelectScreen } from '../screens/home/VehicleSelectScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasGrantedLocation = useAuthStore((state) => state.hasGrantedLocation);

  const showMainApp = isAuthenticated && hasGrantedLocation;

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
            <RootStack.Screen
              name="LocationSearch"
              component={LocationSearchScreen}
              options={{ animation: 'fade_from_bottom' }}
            />
            <RootStack.Screen name="VehicleSelect" component={VehicleSelectScreen} />
            <RootStack.Screen
              name="SearchingDriver"
              component={SearchingDriverScreen}
              options={{ gestureEnabled: false }}
            />
            <RootStack.Screen
              name="DriverAssigned"
              component={DriverAssignedScreen}
              options={{ gestureEnabled: false }}
            />
            <RootStack.Screen
              name="ActiveRide"
              component={ActiveRideScreen}
              options={{ gestureEnabled: false }}
            />
            <RootStack.Screen
              name="RideCompleted"
              component={RideCompletedScreen}
              options={{ gestureEnabled: false }}
            />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
