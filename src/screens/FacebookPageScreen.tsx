import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export const FacebookPageScreen: React.FC = () => {
  const facebookUrl = Constants.expoConfig?.extra?.publisherInfo?.facebookPageUrl;

  const handleOpenFacebook = async () => {
    if (facebookUrl && (await Linking.canOpenURL(facebookUrl))) {
      await Linking.openURL(facebookUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="logo-facebook" size={64} color="#1877F2" />
        <Text style={styles.title}>تابع دزاير أم سي على الفيسبوك</Text>
        <Text style={styles.subtitle}>انضم إلى أزيد من 250 ألف متابع للتغطيات الحصرية</Text>

        <TouchableOpacity style={styles.button} onPress={handleOpenFacebook}>
          <Text style={styles.buttonText}>فتح الصفحة الرسمية</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
