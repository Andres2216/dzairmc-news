import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

export const BookmarksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { bookmarks } = useBookmarks();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
        contentContainerStyle={
          bookmarks.length === 0 ? styles.emptyContainer : styles.listPadding
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              لا توجد مقالات أو فيديوهات محفوظة
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              اضغط على أيقونة الحفظ في أي خبر للرجوع إليه وقراءته لاحقاً
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listPadding: { padding: 16 },
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
    fontWeight: '800',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
