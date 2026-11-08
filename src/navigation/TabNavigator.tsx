import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import FacebookPageScreen from '../screens/FacebookPageScreen';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TAB_ITEMS: {
  name: string;
  label: string;
  iconFocused: keyof typeof Ionicons.glyphMap;
  iconDefault: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'Home', label: 'الرئيسية', iconFocused: 'home', iconDefault: 'home-outline' },
  { name: 'Categories', label: 'الأقسام والفيديو', iconFocused: 'play-circle', iconDefault: 'play-circle-outline' },
  { name: 'Facebook', label: 'فيسبوك', iconFocused: 'logo-facebook', iconDefault: 'logo-facebook' },
  { name: 'Bookmarks', label: 'المحفوظات', iconFocused: 'bookmark', iconDefault: 'bookmark-outline' },
  { name: 'Settings', label: 'المزيد', iconFocused: 'grid', iconDefault: 'grid-outline' },
];

function CustomRTLTabBar({ state, navigation }: any) {
  const { colors } = useTheme();
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.tabBarContainer,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      {TAB_ITEMS.map((item) => {
        const isFocused = activeRouteName === item.name;
        const tintColor = isFocused ? '#D97706' : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: item.name,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.name);
          }
        };

        return (
          <TouchableOpacity
            key={item.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isFocused ? item.iconFocused : item.iconDefault}
              size={22}
              color={tintColor}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: tintColor, fontWeight: isFocused ? '800' : '600' },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const TabNavigator: React.FC = () => {
  return (
    <ThemeProvider>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <CustomRTLTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Facebook" component={FacebookPageScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row-reverse',
    height: 66,
    borderTopWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    backgroundColor: '#D97706',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
