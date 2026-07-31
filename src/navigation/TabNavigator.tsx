import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'newspaper-outline';

          if (route.name === 'Home') {
            iconName = 'newspaper-outline';
          } else if (route.name === 'Categories') {
            iconName = 'grid-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = 'bookmark-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'الرئيسية' }} />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: 'الأقسام' }} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} options={{ tabBarLabel: 'المحفوظات' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'الإعدادات' }} />
    </Tab.Navigator>
  );
};
