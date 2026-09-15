import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { LocationPermissionScreen } from '../screens/auth/LocationPermissionScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
