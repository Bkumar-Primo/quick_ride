import type { NavigatorScreenParams } from '@react-navigation/native';
import { ActiveRide } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OtpVerification: { phone: string };
  ProfileSetup: undefined;
  AllSet: undefined;
  LocationPermission: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  RidesTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LocationSearch: undefined;
  PickupConfirm: undefined;
  RoutePreview: undefined;
  VehicleSelect: undefined;
  BookingConfirm: undefined;
  SearchingDriver: undefined;
  DriverAssigned: undefined;
  ActiveRide: undefined;
  RideCompleted: undefined;
  EditProfile: undefined;
  Wallet: undefined;
  SavedPlaces: undefined;
};
