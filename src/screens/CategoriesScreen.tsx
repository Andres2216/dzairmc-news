import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';

const CATEGORIES = ['الكل', 'أخبار', 'اقتصاد', 'رياضة', 'ثقافة', 'تكنولوجيا'];

const CATEGORY_ARTICLES: Article[] = [
  {
    id: '101',
    title: 'تقرير خاص: التحول الرقمي والتكنولوجيا المستقبليّة',
    summary: 'نظرة شاملة على أحدث الابتكارات البرمجية وحلول الذكاء الاصطناعي.',
    content: 'تفاصيل كاملة حول حلول التقنية الرقمية المتطورة...',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    publishedAt: new Date().toISOString(),
    category: 'تكنولوجيا',
    author: 'القسم التقني',
  },
  {
    id: '102',
    title: 'تغطية ثقافية: مهرجانات التراث والفنون المحلية',
    summary: 'احتفاليات كبرى تسلط الضوء على الموروث الثقافي والفني.',
    content: 'تفاصيل المهرجان والمشاركات الثقافية المتنوعة...',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    publishedAt: new Date().toISOString(),
    category: 'ثقافة',
    author: 'قسم الثقافة',
  },
];

export const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filtered = selectedCategory === 'الكل'
    ? CATEGORY_ARTICLES
    : CATEGORY_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />
      
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isActive = item === selectedCategory;
            return (
              <TouchableOpacity
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.chipsPadding}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={(art) => navigation.navigate('ArticleDetail', { article: art })}
          />
        )}
        contentContainerStyle={styles.listPadding}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  categoriesBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chipsPadding: {
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  activeChip: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listPadding: {
    padding: 16,
  },
});
