import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationProvider } from './src/context/NotificationContext';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { TabNavigator } from './src/navigation/TabNavigator';
import { ArticleDetailScreen } from './src/screens/ArticleDetailScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { RootStackParamList } from './src/types';
import { admobService } from './src/services/admobService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    admobService.showAppOpenAdIfAvailable();
  }, []);

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <BookmarkProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#111827" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_left',
              }}
            >
              <Stack.Screen name="MainTabs" component={TabNavigator} />
              <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen as any} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </BookmarkProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}
