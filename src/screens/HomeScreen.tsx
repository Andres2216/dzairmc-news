import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { OfflineNotice } from '../components/OfflineNotice';
import { AdBanner } from '../components/AdBanner';
import { useTheme } from '../context/ThemeContext';

const CACHE_KEY = '@dzairmc_cached_videos_v1';

const CATEGORIES = [
  { id: 'all', label: 'الكل', keywords: [] },
  { id: 'algeria', label: 'الجزائر', keywords: ['الجزائر', 'تبون', 'الوطن', 'ولاية', 'وزير', 'الجيش'] },
  { id: 'team', label: 'المنتخب', keywords: ['المنتخب', 'الخضر', 'كرة', 'مباراة', 'بيتكوفيتش', 'محرز', 'مولودية', 'رياضة', 'كأس'] },
  { id: 'diaspora', label: 'الجالية', keywords: ['فرنسا', 'الجالية', 'أوروبا', 'مهاجر', 'باريس', 'فيزا', 'رحلات', 'كندا', 'إسبانيا'] },
  { id: 'world', label: 'العالم', keywords: ['العالم', 'دولي', 'الساحل', 'تشاد', 'النيجر', 'مالي', 'فلسطين', 'غزة', 'أمريكا', 'روسيا', 'المغرب'] },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, fontMultiplier } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const decodeHtml = (html: string) => {
    if (!html) return '';
    return html
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };

  const formatArabicDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const fetchYouTubeVideos = async () => {
    setError(false);
    try {
      const API_KEY = 'AIzaSyCaehhcoK3qE869p4EW-sabMSzWzXCYLJU';
      const CHANNEL_ID = 'UC-k2FdaMuAw9FUrPLqkuXnw';

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=25&type=video`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const formattedVideos = data.items.map((item: any) => {
          const videoId = item.id?.videoId || item.id || item.etag;
          const summaryText = decodeHtml(
            item.snippet.description ||
              'شاهد التفاصيل الكاملة في الفيديو عبر قناة DzairMC News الرسمية...'
          );
          return {
            id: videoId,
            videoId: videoId,
            title: decodeHtml(item.snippet.title),
            summary: summaryText,
            content: `${summaryText}\n\nلمشاهدة التغطية الكاملة بالصوت والصورة، يمكنك فتح الفيديو مباشرة على قناة DzairMC News الرسمية على يوتيوب عبر الزر الموجود أدناه.`,
            imageUrl:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url,
            publishedAt: item.snippet.publishedAt,
            formattedDate: formatArabicDate(item.snippet.publishedAt),
            author: item.snippet.channelTitle || 'DzairMC News',
            category: 'فيديو',
            url: `https://www.youtube.com/watch?v=${videoId}`,
          };
        });

        setVideos(formattedVideos);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(formattedVideos));
      } else {
        await loadCachedVideos();
      }
    } catch {
      await loadCachedVideos();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCachedVideos = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setVideos(JSON.parse(cached));
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchYouTubeVideos();
  };

  const handleArticlePress = useCallback(
    (article: any) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation]
  );

  const handleShareVideo = async (video: any) => {
    try {
      await Share.share({
        message: `${video.title}\n\nشاهد عبر قناة DzairMC News:\nhttps://www.youtube.com/watch?v=${video.id}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const filteredVideos = videos.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;

    const categoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!categoryObj || categoryObj.keywords.length === 0) return true;

    const textToMatch = `${item.title} ${item.summary}`;
    return categoryObj.keywords.some((kw) => textToMatch.includes(kw));
  });

  const featuredVideo = filteredVideos.length > 0 ? filteredVideos[0] : null;
  const remainingVideos = filteredVideos.length > 1 ? filteredVideos.slice(1) : [];

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
    ),
    [handleArticlePress]
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderListHeader = () => (
    <View>
      {featuredVideo && !isSearching && (
        <TouchableOpacity
          style={styles.breakingTicker}
          activeOpacity={0.85}
          onPress={() => handleArticlePress(featuredVideo)}
        >
          <View style={styles.breakingBadge}>
            <Text style={styles.breakingBadgeText}>عاجل</Text>
          </View>
          <Text style={styles.breakingText} numberOfLines={1}>
            {featuredVideo.title}
          </Text>
          <Ionicons name="chevron-back" size={16} color="#D97706" />
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isActive && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: colors.textSecondary },
                  isActive && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {featuredVideo && (
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => handleArticlePress(featuredVideo)}
        >
          <Image source={{ uri: featuredVideo.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTopBadges}>
              <View style={styles.latestBadge}>
                <View style={styles.dot} />
                <Text style={styles.latestBadgeText}>الأحدث</Text>
              </View>

              <TouchableOpacity
                style={styles.shareHeroBtn}
                onPress={() => handleShareVideo(featuredVideo)}
              >
                <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.videoTagBadge}>
              <Ionicons name="play" size={12} color="#FFFFFF" />
              <Text style={styles.videoTagText}>فيديو</Text>
            </View>

            <View style={styles.heroBottomInfo}>
              <Text style={styles.heroMetaText}>
                {featuredVideo.author} • {featuredVideo.formattedDate}
              </Text>
              <Text
                style={[styles.heroTitle, { fontSize: 17 * fontMultiplier }]}
                numberOfLines={2}
              >
                {featuredVideo.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>آخر الأخبار</Text>
        <Text style={[styles.sectionHeaderCount, { color: colors.textSecondary }]}>
          {filteredVideos.length} مواد
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        onSearchPress={() => setIsSearching((prev) => !prev)}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />
      <OfflineNotice />

      {isSearching && (
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <View style={[styles.searchInputWrapper, { backgroundColor: colors.chipBg }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="ابحث في فيديوهات وأخبار القناة..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            جاري تحميل أحدث فيديوهات وأخبار القناة...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color="#EF4444" />
          <Text style={[styles.errorText, { color: colors.text }]}>
            تعذر تحميل الفيديوهات حالياً. يرجى التحقق من الاتصال بالإنترنت.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchYouTubeVideos}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={remainingVideos}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D97706"
              colors={['#D97706']}
            />
          }
          ListEmptyComponent={
            !featuredVideo ? (
              <View style={styles.emptyBox}>
                <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  لا توجد نتائج مطابقة لبحثك في هذا القسم
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={<AdBanner />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    paddingVertical: 4,
  },
  breakingTicker: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  breakingBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  breakingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  breakingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'right',
  },
  categoriesScroll: {
    flexDirection: 'row-reverse',
    paddingVertical: 6,
    marginBottom: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111827',
    marginBottom: 20,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 14,
    justifyContent: 'space-between',
  },
  heroTopBadges: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  latestBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginLeft: 6,
  },
  latestBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  shareHeroBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 8,
    borderRadius: 20,
  },
  videoTagBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  videoTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  heroBottomInfo: {
    alignItems: 'flex-end',
  },
  heroMetaText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  sectionHeaderCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  listPadding: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
  },
});
