import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
}

const STORAGE_KEY = '@dzairmc_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'مرحباً بكم في تطبيق دزاير أم سي',
    body: 'تابعوا آخر الأخبار المستجدة والتغطيات الحصرية لحظة بلحظة.',
    createdAt: new Date().toISOString(),
    isRead: false,
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch (e) {
      console.warn('Failed to load notifications from storage', e);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const saveNotifications = async (updated: AppNotification[]) => {
    try {
      setNotifications(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist notifications', e);
    }
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    await saveNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    await saveNotifications(updated);
  };

  const clearAll = async () => {
    await saveNotifications([]);
  };

  const addNotification = async (
    item: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>
  ) => {
    const newEntry: AppNotification = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const updated = [newEntry, ...notifications];
    await saveNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
