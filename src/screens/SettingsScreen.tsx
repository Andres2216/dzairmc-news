import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Switch,
  Alert,
  Modal,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useTheme, FontSizeScale } from '../context/ThemeContext';

const PRIVACY_URL = 'https://sites.google.com/view/dzairmc-news-privacy/accueil';
const YOUTUBE_URL = 'https://www.youtube.com/@dzairmcnews';
const CONTACT_EMAIL = 'dzairmcnews@gmail.com';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDark, toggleTheme, fontSize, setFontSize, colors } = useTheme();
  const [aboutVisible, setAboutVisible] = useState(false);

  const openExternal = async (url: string, fallbackTitle = 'تنبيه') => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(fallbackTitle, `يمكنك زيارة الرابط التالي:\n${url}`);
    }
  };

  const handleContactPress = () => {
    Alert.alert(
      'اتصل بنا - DzairMC News',
      `للاستفسارات الإعلامية أو التقنية، يسعدنا تواصلكم عبر البريد الرسمي:\n\n${CONTACT_EMAIL}`,
      [
        {
          text: 'إرسال بريد إلكتروني',
          onPress: () =>
            openExternal(
              `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('استفسار من تطبيق DzairMC News')}`,
              'البريد الإلكتروني'
            ),
        },
        {
          text: 'صفحة التواصل والخصوصية',
          onPress: () => openExternal(PRIVACY_URL),
        },
        { text: 'إغلاق', style: 'cancel' },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'حمّل وتابع آخر أخبار الجزائر والجالية والمنتخب الوطني عبر قناة وتطبيق DzairMC News:\nhttps://www.youtube.com/@dzairmcnews',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.brandCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.brandIconBox}>
            <Ionicons name="newspaper" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.brandInfo}>
            <Text style={[styles.brandName, { color: colors.text }]}>DzairMC News</Text>
            <Text style={[styles.brandSub, { color: colors.textSecondary }]}>
              أخبار الجزائر والجالية والمنتخب الوطني على مدار الساعة
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          المظهر وتجربة القراءة
        </Text>

        <View
          style={[
            styles.rowCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowRight}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny-outline'}
              size={22}
              color={colors.accent}
            />
            <Text style={[styles.itemText, { color: colors.text }]}>
              الوضع الليلي المريح للعين
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: '#D97706' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View
          style={[
            styles.fontCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowRight}>
            <Ionicons name="text-outline" size={22} color={colors.accent} />
            <Text style={[styles.itemText, { color: colors.text }]}>حجم خط الأخبار</Text>
          </View>

          <View style={styles.fontOptionsRow}>
            {(
              [
                { key: 'small', label: 'صغير' },
                { key: 'medium', label: 'متوسط' },
                { key: 'large', label: 'كبير' },
              ] as { key: FontSizeScale; label: string }[]
            ).map((opt) => {
              const active = fontSize === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.fontOptionBtn,
                    { backgroundColor: colors.chipBg, borderColor: colors.border },
                    active && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                  onPress={() => setFontSize(opt.key)}
                >
                  <Text
                    style={[
                      styles.fontOptionText,
                      { color: colors.text },
                      active && { color: '#FFFFFF' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          منصاتنا الرسمية
        </Text>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => openExternal(YOUTUBE_URL, 'يوتيوب')}
        >
          <View style={styles.rowRight}>
            <Ionicons name="logo-youtube" size={22} color="#DC2626" />
            <Text style={[styles.itemText, { color: colors.text }]}>
              قناتنا الرسمية على يوتيوب (@dzairmcnews)
            </Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => navigation.navigate('Facebook')}
        >
          <View style={styles.rowRight}>
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
            <Text style={[styles.itemText, { color: colors.text }]}>
              صفحتنا الرسمية على الفيسبوك
            </Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={handleShareApp}
        >
          <View style={styles.rowRight}>
            <Ionicons name="share-social-outline" size={22} color={colors.accent} />
            <Text style={[styles.itemText, { color: colors.text }]}>
              مشاركة التطبيق مع الأصدقاء
            </Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          حول التطبيق والدعم
        </Text>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setAboutVisible(true)}
        >
          <View style={styles.rowRight}>
            <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
            <Text style={[styles.itemText, { color: colors.text }]}>
              نبذة عن قناة وتطبيق DzairMC News
            </Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => openExternal(PRIVACY_URL, 'سياسة الخصوصية')}
        >
          <View style={styles.rowRight}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            <Text style={[styles.itemText, { color: colors.text }]}>سياسة الخصوصية</Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={handleContactPress}
        >
          <View style={styles.rowRight}>
            <Ionicons name="mail-outline" size={22} color={colors.primary} />
            <View>
              <Text style={[styles.itemText, { color: colors.text }]}>اتصل بنا</Text>
              <Text style={[styles.subEmail, { color: colors.textSecondary }]}>
                {CONTACT_EMAIL}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.versionCard}>
          <Text style={[styles.versionTitle, { color: colors.text }]}>DzairMC News</Text>
          <Text style={[styles.versionSub, { color: colors.textSecondary }]}>
            الإصدار 1.4.0 (Build 14) - النسخة الاحترافية
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={aboutVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              حول تطبيق DzairMC News
            </Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              تطبيق إخباري مستقل تابع لقناة DzairMC News الرسمية، مخصص لنقل آخر أخبار الجزائر، الجالية الجزائرية بالخارج، وأخبار المنتخب الوطني الجزائري بمصداقية واحترافية.{'\n\n'}
              الناشر والمطور: DzairMC News{'\n'}
              البلد: الجزائر (Algeria){'\n'}
              البريد الرسمي: {CONTACT_EMAIL}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setAboutVisible(false)}
            >
              <Text style={styles.modalCloseText}>حسناً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  brandCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  brandIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  brandInfo: { flex: 1 },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },
  brandSub: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 10,
    marginTop: 10,
  },
  rowCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fontCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  fontOptionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  fontOptionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fontOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  item: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 12,
    textAlign: 'right',
  },
  subEmail: {
    fontSize: 12,
    marginRight: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  versionCard: {
    marginTop: 24,
    alignItems: 'center',
    padding: 16,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  versionSub: {
    fontSize: 12,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
