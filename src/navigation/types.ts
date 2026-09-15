import type { NavigatorScreenParams } from '@react-navigation/native';
import { ActiveRide } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OtpVerification: { phone: string };
  LocationPermission: undefined;
};

export type MainTabParamList = {
  RideTab: undefined;
  ActivityTab: undefined;
  WalletTab: undefined;
  AccountTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LocationSearch: undefined;
  VehicleSelect: undefined;
  SearchingDriver: undefined;
  DriverAssigned: undefined;
  ActiveRide: undefined;
  RideCompleted: undefined;
  EditProfile: undefined;
  SavedPlaces: undefined;
};
