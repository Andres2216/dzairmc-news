import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import Constants from 'expo-constants';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const publisherInfo = Constants.expoConfig?.extra?.publisherInfo;

  const openUrl = async (url?: string) => {
    if (url && (await Linking.canOpenURL(url))) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>إعدادات التطبيق</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => openUrl(publisherInfo?.privacyPolicyUrl)}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
          <Text style={styles.itemText}>سياسة الخصوصية</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => openUrl(publisherInfo?.facebookPageUrl)}
        >
          <Ionicons name="logo-facebook" size={22} color="#2563EB" />
          <Text style={styles.itemText}>صفحتنا على الفيسبوك</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => openUrl(`mailto:${publisherInfo?.contactEmail}`)}
        >
          <Ionicons name="mail-outline" size={22} color="#2563EB" />
          <Text style={styles.itemText}>اتصل بنا</Text>
        </TouchableOpacity>

        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>{publisherInfo?.name || 'دزاير أم سي NEWS'}</Text>
          <Text style={styles.versionSub}>الإصدار 1.2.0 (Build 12)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  versionCard: {
    marginTop: 32,
    alignItems: 'center',
    padding: 16,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  versionSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
