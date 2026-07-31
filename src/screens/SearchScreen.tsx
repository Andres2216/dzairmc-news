import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';

export const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="ابحث هنا..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
      <FlatList
        data={[]}
        keyExtractor={(item: any) => item.id}
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  searchBar: { padding: 16, backgroundColor: '#FFFFFF' },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: 'right',
  },
  listPadding: { padding: 16 },
});
