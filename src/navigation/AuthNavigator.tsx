import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { AllSetScreen } from '../screens/auth/AllSetScreen';
import { LocationPermissionScreen } from '../screens/auth/LocationPermissionScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { ProfileSetupScreen } from '../screens/auth/ProfileSetupScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { PrivacyPolicyScreen } from '../screens/legal/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '../screens/legal/TermsOfServiceScreen';
import { useAuthStore } from '../store/authStore';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  return (
    <Stack.Navigator
      initialRouteName={hasCompletedOnboarding ? 'Login' : 'Splash'}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="AllSet" component={AllSetScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
