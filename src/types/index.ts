export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  author: string;
  sourceUrl?: string;
  readTimeMinutes?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  articleId?: string;
  deepLink?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ArticleDetail: { article: Article };
  Notifications: undefined;
  Search: undefined;
  FacebookPage: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};

export interface AdState {
  isInterstitialReady: boolean;
  isAppOpenReady: boolean;
  isShowingAd: boolean;
  articleOpenCount: number;
}
