import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
  ListRenderItemInfo,
} from 'react-native';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { OfflineNotice } from '../components/OfflineNotice';
import { AdBanner } from '../components/AdBanner';
import { Article } from '../types';

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'تغطية خاصة: أحدث مستجدات التنمية والمشاريع الوطنية',
    summary: 'استعراض شامل لأبرز المشاريع التنموية الجديدة والتطورات الأخيرة على الساحة.',
    content: 'تفاصيل الخبر الكاملة وتغطية صحفية مكثفة مع كافة الأطراف المعنية والمختصين في الشأن المحلّي والدولي...',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    publishedAt: new Date().toISOString(),
    category: 'أخبار',
    author: 'فريق التحرير',
  },
  {
    id: '2',
    title: 'متابعة اقتصادية: أسواق اليوم وتحليلات خبراء المالي',
    summary: 'قراءة تحليليّة لأداء الأسواق والتغيرات الاقتصادية الحاصلة اليوم.',
    content: 'تقرير مفصل يحتوي على أهم التحليلات والتوقعات الاقتصادية المستقبلية مع مقارنات دقيقة...',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    publishedAt: new Date().toISOString(),
    category: 'اقتصاد',
    author: 'قسم الاقتصاد',
  },
  {
    id: '3',
    title: 'تغطية رياضية: تحضيرات المنتخبات الوطنية للبطولات القادمة',
    summary: 'آخر المستجدات حول أداء الفرق والرياضيين في الاستحقاقات الرياضية الأخيرة.',
    content: 'متابعة حية وشاملة لاستعدادات النجوم ومواعيد المباريات المرتقبة...',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    publishedAt: new Date().toISOString(),
    category: 'رياضة',
    author: 'القسم الرياضي',
  },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleArticlePress = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation]
  );

  const filteredArticles = MOCK_ARTICLES.filter(
    (item) =>
      item.title.includes(searchQuery) || item.summary.includes(searchQuery)
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Article>) => (
      <ArticleCard article={item} onPress={handleArticlePress} />
    ),
    [handleArticlePress]
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onSearchPress={() => setIsSearching((prev) => !prev)}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />
      <OfflineNotice />

      {isSearching && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن الأخبار..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <FlatList
        data={filteredArticles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        ListFooterComponent={<AdBanner />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'right',
    fontSize: 14,
    color: '#111827',
  },
  listPadding: {
    padding: 16,
  },
});
