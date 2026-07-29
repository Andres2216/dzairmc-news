import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from './src/components/AppHeader';
import { AdBanner } from './src/components/AdBanner';
import { BottomNav } from './src/components/BottomNav';
import { DetailModal } from './src/components/DetailModal';
import { useBookmarks } from './src/hooks/useBookmarks';
import { useFeed } from './src/hooks/useFeed';
import { FeedScreen } from './src/screens/FeedScreen';
import { FacebookScreen } from './src/screens/FacebookScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { COLORS } from './src/theme';
import type { ContentItem, TabId } from './src/types';

function DzairMcApp() {
  const [tab, setTab] = useState<TabId>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const feed = useFeed();
  const bookmarks = useBookmarks();

  const changeTab = (next: TabId) => {
    setTab(next);
    setSearchOpen(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <StatusBar style="dark" />
      <AppHeader
        onOpenMenu={() => {
          setTab('settings');
          setSearchOpen(false);
        }}
        onToggleSearch={() => {
          if (tab === 'settings' || tab === 'facebook') {
            Alert.alert('البحث', 'افتح الرئيسية أو الفيديوهات للبحث في المحتوى.');
            return;
          }
          setSearchOpen((current) => !current);
        }}
        searchOpen={searchOpen}
      />
      <View style={styles.body}>
        {tab === 'settings' ? (
          <SettingsScreen />
        ) : tab === 'facebook' ? (
          <FacebookScreen />
        ) : (
          <FeedScreen
            items={feed.items}
            loading={feed.loading}
            offline={feed.offline}
            onOpen={setSelected}
            onRefresh={feed.refresh}
            onToggleSaved={bookmarks.toggle}
            refreshing={feed.refreshing}
            savedIds={bookmarks.savedIds}
            searchOpen={searchOpen}
            tab={tab}
          />
        )}
      </View>
      {tab !== 'facebook' && <AdBanner />}
      <BottomNav active={tab} onChange={changeTab} />
      <DetailModal
        item={selected}
        onClose={() => setSelected(null)}
        onToggleSaved={() => selected && bookmarks.toggle(selected.id)}
        saved={selected ? bookmarks.isSaved(selected.id) : false}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DzairMcApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
