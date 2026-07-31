import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../types';
import { admobService } from '../services/admobService';
import { PublisherComplianceFooter } from '../components/PublisherComplianceFooter';
import { AdBanner } from '../components/AdBanner';
import { useBookmarks } from '../context/BookmarkContext';

interface ArticleDetailScreenProps {
  route: { params: { article: Article } };
  navigation: any;
}

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { article } = route.params;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  useEffect(() => {
    admobService.trackArticleOpened();
  }, [article.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article.category}
        </Text>
        <TouchableOpacity onPress={() => toggleBookmark(article)} style={styles.shareIcon}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={bookmarked ? "#2563EB" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.author}>بقلم: {article.author || 'دزاير أم سي'}</Text>
          <Text style={styles.date}>
            {new Date(article.publishedAt).toLocaleDateString('ar-DZ')}
          </Text>
        </View>

        <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />

        <Text style={styles.summary}>{article.summary}</Text>

        <AdBanner />

        <Text style={styles.content}>{article.content}</Text>

        <PublisherComplianceFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 56,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  shareIcon: {
    padding: 4,
  },
  scrollContent: {
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'right',
    paddingHorizontal: 16,
    lineHeight: 32,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  author: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
    paddingHorizontal: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'right',
    paddingHorizontal: 16,
    lineHeight: 28,
  },
});
