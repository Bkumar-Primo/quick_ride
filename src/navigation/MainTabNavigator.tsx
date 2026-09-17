import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<
  keyof MainTabParamList,
  { focused: keyof typeof Ionicons.glyphMap; idle: keyof typeof Ionicons.glyphMap }
> = {
  HomeTab: { focused: 'home', idle: 'home-outline' },
  RidesTab: { focused: 'time', idle: 'time-outline' },
  ProfileTab: { focused: 'person', idle: 'person-outline' },
};

const HomeTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : (options.title ?? route.name);
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name as keyof MainTabParamList];
        const color = isFocused ? Colors.primary : Colors.gray400;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            activeOpacity={0.85}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItem}
          >
            <Ionicons name={isFocused ? icons.focused : icons.idle} size={22} color={color} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            <View style={[styles.tabIndicator, isFocused && styles.tabIndicatorActive]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <HomeTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.white },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="RidesTab" component={ActivityScreen} options={{ tabBarLabel: 'Rides' }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: Layout.spacing.sm,
    ...Layout.shadows.lg,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIndicator: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  tabIndicatorActive: {
    backgroundColor: Colors.primary,
  },
});

export default MainTabNavigator;
