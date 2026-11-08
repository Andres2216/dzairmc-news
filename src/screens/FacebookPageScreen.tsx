import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Share,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function FacebookPageScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // استخدام رابط الموبايل لسرعة التحميل وتجنب نوافذ تسجيل الدخول المزعجة
  const facebookUrl = 'https://m.facebook.com/dzairmcnews';

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'تابعوا آخر الأخبار على صفحة DzairMC News الرسمية على فيسبوك: https://www.facebook.com/dzairmcnews',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* شريط علوي احترافي للتحكم بصفحة الفيسبوك */}
      <View style={styles.topBar}>
        <View style={styles.actionsRight}>
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          <Text style={styles.title}>DzairMC News - فيسبوك</Text>
        </View>

        <View style={styles.actionsLeft}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => webViewRef.current?.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              setError(false);
              webViewRef.current?.reload();
            }}
          >
            <Ionicons name="refresh" size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>تعذر تحميل الصفحة. يرجى التحقق من اتصالك بالإنترنت.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(false);
              setLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webviewWrapper}>
          <WebView
            ref={webViewRef}
            source={{ uri: facebookUrl }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setError(true)}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#1877F2" />
              <Text style={styles.loadingText}>جاري تحميل المنشورات...</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
  },
  actionsRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginRight: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  webviewWrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});