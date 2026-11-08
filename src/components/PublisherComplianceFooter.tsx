import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PRIVACY_URL = 'https://sites.google.com/view/dzairmc-news-privacy/accueil';
const FACEBOOK_URL = 'https://www.facebook.com/dzairmcnews';
const CONTACT_EMAIL = 'dzairmcnews@gmail.com';

export const PublisherComplianceFooter: React.FC = React.memo(() => {
  const { colors } = useTheme();

  const openExternal = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('تنبيه', 'تعذر فتح الرابط حالياً.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <Text style={[styles.publisherTitle, { color: colors.text }]}>
        المصدر: دزاير أم سي NEWS (DzairMC News)
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        قناة إخبارية ومعلوماتية مستقلة تقدم تغطية شاملة لأخبار الجزائر والجالية والمنتخب الوطني.
      </Text>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => openExternal(PRIVACY_URL)}>
          <Text style={[styles.linkText, { color: colors.accent }]}>سياسة الخصوصية</Text>
        </TouchableOpacity>
        <Text style={[styles.divider, { color: colors.textSecondary }]}>|</Text>
        <TouchableOpacity onPress={() => openExternal(FACEBOOK_URL)}>
          <Text style={[styles.linkText, { color: colors.accent }]}>صفحة الفيسبوك</Text>
        </TouchableOpacity>
        <Text style={[styles.divider, { color: colors.textSecondary }]}>|</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('اتصل بنا', `البريد الرسمي للقناة:\n${CONTACT_EMAIL}`, [
              { text: 'إرسال بريد', onPress: () => openExternal(`mailto:${CONTACT_EMAIL}`) },
              { text: 'إغلاق', style: 'cancel' },
            ])
          }
        >
          <Text style={[styles.linkText, { color: colors.accent }]}>اتصل بنا</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.copyright, { color: colors.textSecondary }]}>
        © {new Date().getFullYear()} DzairMC News. جميع الحقوق محفوظة.
      </Text>
    </View>
  );
});

PublisherComplianceFooter.displayName = 'PublisherComplianceFooter';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 1,
    marginTop: 24,
    alignItems: 'center',
  },
  publisherTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
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
    fontWeight: '700',
  },
  divider: {
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 11,
  },
});
