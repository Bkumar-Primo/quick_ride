import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDialogProvider } from './src/components/common/AppDialog';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppDialogProvider>
        <AppNavigator />
      </AppDialogProvider>
    </SafeAreaProvider>
  );
}
