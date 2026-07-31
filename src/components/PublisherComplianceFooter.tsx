import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Constants from 'expo-constants';

export const PublisherComplianceFooter: React.FC = React.memo(() => {
  const publisherInfo = Constants.expoConfig?.extra?.publisherInfo;

  const openUrl = async (url?: string) => {
    if (url && (await Linking.canOpenURL(url))) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.publisherTitle}>
        المصدر: {publisherInfo?.name || 'دزاير أم سي NEWS'}
      </Text>
      <Text style={styles.description}>
        قناة إخبارية ومعلوماتية مستقلة تقدم تغطية شاملة للأخبار المحلية والدولية.
      </Text>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => openUrl(publisherInfo?.privacyPolicyUrl)}>
          <Text style={styles.linkText}>سياسة الخصوصية</Text>
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity onPress={() => openUrl(publisherInfo?.facebookPageUrl)}>
          <Text style={styles.linkText}>صفحة الفيسبوك</Text>
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity onPress={() => openUrl(`mailto:${publisherInfo?.contactEmail}`)}>
          <Text style={styles.linkText}>اتصل بنا</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} DzairMC News. جميع الحقوق محفوظة.
      </Text>
    </View>
  );
});

PublisherComplianceFooter.displayName = 'PublisherComplianceFooter';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 24,
    alignItems: 'center',
  },
  publisherTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  linksRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  divider: {
    marginHorizontal: 8,
    color: '#9CA3AF',
  },
  copyright: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
