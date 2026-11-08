import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarkContext';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ article, onPress }) => {
  const { colors, fontMultiplier, isDark } = useTheme();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleShare = async () => {
    try {
      const url = (article as any).url || `https://www.youtube.com/watch?v=${article.id}`;
      await Share.share({
        message: `${article.title}\n\nتابع عبر تطبيق DzairMC News:\n${url}`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth: isDark ? 1 : 0 },
      ]}
      onPress={() => onPress(article)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.category || 'فيديو'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: 16 * fontMultiplier, lineHeight: 24 * fontMultiplier },
          ]}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        <Text
          style={[
            styles.summary,
            { color: colors.textSecondary, fontSize: 13 * fontMultiplier, lineHeight: 19 * fontMultiplier },
          ]}
          numberOfLines={2}
        >
          {article.summary}
        </Text>

        <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(article.publishedAt).toLocaleDateString('ar-DZ')}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleBookmark(article)} style={styles.actionBtn}>
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={19}
                color={bookmarked ? colors.accent : colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={19} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ArticleCard.displayName = 'ArticleCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 195,
    backgroundColor: '#334155',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(217, 119, 6, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    padding: 14,
  },
  title: {
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 6,
  },
  summary: {
    textAlign: 'right',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 4,
    marginRight: 10,
  },
});
