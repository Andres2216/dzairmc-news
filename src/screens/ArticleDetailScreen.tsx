import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../types';
import { admobService } from '../services/admobService';
import { PublisherComplianceFooter } from '../components/PublisherComplianceFooter';
import { AdBanner } from '../components/AdBanner';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

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
  const { colors, fontSize, setFontSize, fontMultiplier } = useTheme();
  const bookmarked = isBookmarked(article.id);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    admobService.trackArticleOpened();
  }, [article.id]);

  const videoUrl =
    (article as any).url ||
    (article.id && article.id.length > 5
      ? `https://www.youtube.com/watch?v=${article.id}`
      : '');

  const cycleFontSize = () => {
    if (fontSize === 'small') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('large');
    else setFontSize('small');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nشاهد عبر تطبيق DzairMC News:\n${videoUrl}`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const totalScrollable = contentSize.height - layoutMeasurement.height;
    if (totalScrollable > 0) {
      const progress = Math.min(Math.max(contentOffset.y / totalScrollable, 0), 1);
      setReadingProgress(progress * 100);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-forward" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {article.category || 'تفاصيل الخبر'}
        </Text>

        <View style={styles.topActions}>
          <TouchableOpacity onPress={cycleFontSize} style={styles.fontBtn}>
            <Text style={[styles.fontBtnText, { color: colors.accent }]}>ع+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBookmark(article)} style={styles.iconBtn}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={bookmarked ? colors.accent : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressBar, { width: `${readingProgress}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: 21 * fontMultiplier, lineHeight: 32 * fontMultiplier },
          ]}
        >
          {article.title}
        </Text>

        <View style={styles.metaContainer}>
          <Text style={[styles.author, { color: colors.accent }]}>
            المصدر: {article.author || 'DzairMC News'}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(article.publishedAt).toLocaleDateString('ar-DZ')}
          </Text>
        </View>

        <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />

        {videoUrl ? (
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={() => Linking.openURL(videoUrl)}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
            <Text style={styles.youtubeButtonText}>مشاهدة الفيديو كاملاً على يوتيوب</Text>
          </TouchableOpacity>
        ) : null}

        <Text
          style={[
            styles.summary,
            {
              color: colors.text,
              fontSize: 16 * fontMultiplier,
              lineHeight: 27 * fontMultiplier,
            },
          ]}
        >
          {article.summary}
        </Text>

        <AdBanner />

        {article.content ? (
          <Text
            style={[
              styles.content,
              {
                color: colors.textSecondary,
                fontSize: 15 * fontMultiplier,
                lineHeight: 28 * fontMultiplier,
              },
            ]}
          >
            {article.content}
          </Text>
        ) : null}

        <PublisherComplianceFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    height: 56,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 6,
    marginHorizontal: 2,
  },
  fontBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D97706',
    marginRight: 6,
  },
  fontBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  progressTrack: {
    height: 3,
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#D97706',
  },
  scrollContent: {
    paddingTop: 16,
  },
  title: {
    fontWeight: '800',
    textAlign: 'right',
    paddingHorizontal: 16,
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
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
  },
  image: {
    width: '100%',
    height: 235,
    backgroundColor: '#334155',
    marginBottom: 16,
  },
  youtubeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    marginBottom: 18,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  youtubeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
  },
  summary: {
    fontWeight: '600',
    textAlign: 'right',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    textAlign: 'right',
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
