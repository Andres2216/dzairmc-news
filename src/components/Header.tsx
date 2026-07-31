import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';

interface HeaderProps {
  title?: string;
  onSearchPress?: () => void;
  onNotificationPress: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  title = 'دزاير أم سي NEWS',
  onSearchPress,
  onNotificationPress,
}) => {
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {onSearchPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            accessibilityLabel="بحث"
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          accessibilityLabel="الإشعارات"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

Header.displayName = 'Header';

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#111827',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  brandContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: 0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
