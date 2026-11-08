import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { AdBanner } from '../components/AdBanner';
import { Article } from '../types';
import { useTheme } from '../context/ThemeContext';

const CACHE_KEY = '@dzairmc_cached_videos_v1';

const CATEGORIES = [
  { id: 'all', label: 'الكل', keywords: [] },
  { id: 'algeria', label: 'أخبار الجزائر', keywords: ['الجزائر', 'تبون', 'الوطن', 'ولاية', 'وزير', 'الجيش'] },
  { id: 'sports', label: 'رياضة والمنتخب', keywords: ['المنتخب', 'الخضر', 'كرة', 'مباراة', 'بيتكوفيتش', 'محرز', 'مولودية', 'رياضة', 'كأس'] },
  { id: 'diaspora', label: 'الجالية', keywords: ['فرنسا', 'الجالية', 'أوروبا', 'مهاجر', 'باريس', 'فيزا', 'رحلات', 'كندا', 'إسبانيا'] },
  { id: 'world', label: 'دولي وعالمي', keywords: ['العالم', 'دولي', 'الساحل', 'تشاد', 'النيجر', 'مالي', 'فلسطين', 'غزة', 'أمريكا', 'روسيا', 'المغرب'] },
];

export const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          setArticles(JSON.parse(cached));
        }
      } catch (e) {
        console.warn(e);
      }
    };
    loadArticles();
    const unsubscribe = navigation.addListener('focus', loadArticles);
    return unsubscribe;
  }, [navigation]);

  const filtered = articles.filter((item) => {
    if (selectedCategory === 'all') return true;
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!cat || cat.keywords.length === 0) return true;
    const text = `${item.title} ${item.summary}`;
    return cat.keywords.some((kw) => text.includes(kw));
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />

      <View
        style={[
          styles.categoriesBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <FlatList
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = item.id === selectedCategory;
            return (
              <TouchableOpacity
                style={[
                  styles.chip,
                  { backgroundColor: colors.chipBg },
                  isActive && { backgroundColor: colors.accent },
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textSecondary },
                    isActive && styles.activeChipText,
                  ]}
                >
                  {item.label}
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
        ListFooterComponent={<AdBanner />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  categoriesBar: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chipsPadding: { paddingHorizontal: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listPadding: { padding: 16 },
});
