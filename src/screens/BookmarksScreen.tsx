import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { useBookmarks } from '../context/BookmarkContext';

export const BookmarksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { bookmarks } = useBookmarks();

  return (
    <SafeAreaView style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={(art) => navigation.navigate('ArticleDetail', { article: art })}
          />
        )}
        contentContainerStyle={bookmarks.length === 0 ? styles.emptyContainer : styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>لا توجد مقالات محفوظة</Text>
            <Text style={styles.emptySubtitle}>احفظ الأخبار التي تهمك لقراءتها لاحقاً</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listPadding: {
    padding: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
