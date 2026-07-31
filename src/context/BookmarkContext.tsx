import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types';

interface BookmarkContextType {
  bookmarks: Article[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (article: Article) => Promise<void>;
}

const STORAGE_KEY = '@dzairmc_bookmarks_v1';

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load bookmarks', e);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = async (article: Article) => {
    let updated: Article[];
    if (bookmarks.some((item) => item.id === article.id)) {
      updated = bookmarks.filter((item) => item.id !== article.id);
    } else {
      updated = [article, ...bookmarks];
    }
    setBookmarks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isBookmarked = (id: string) => bookmarks.some((item) => item.id === id);

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
