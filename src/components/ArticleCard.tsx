import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(article)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: article.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.date}>
            {new Date(article.publishedAt).toLocaleDateString('ar-DZ')}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {article.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

ArticleCard.displayName = 'ArticleCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  date: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'right',
    lineHeight: 18,
  },
});
