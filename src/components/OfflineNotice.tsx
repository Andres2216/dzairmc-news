import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const OfflineNotice: React.FC = React.memo(() => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>لا يوجد اتصال بالإنترنت. يرجى التحقق من الشبكة.</Text>
    </View>
  );
});

OfflineNotice.displayName = 'OfflineNotice';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EF4444',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
