import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';
import { AppNotification } from '../types';

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const handleItemPress = async (item: AppNotification) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    if (item.articleId) {
      navigation.navigate('ArticleDetail', { articleId: item.articleId });
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<AppNotification>) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          {!item.isRead && <View style={styles.unreadDot} />}
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleDateString('ar-DZ')}
        </Text>
      </View>
      <Text style={styles.cardBody} numberOfLines={3}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.actionHeaderBtn}>
          <Text style={styles.actionHeaderBtnText}>قراءة الكل</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>لا توجد إشعارات حالياً</Text>
            <Text style={styles.emptySubtitle}>ستصلك التنبيهات فور نشر أخبار جديدة</Text>
          </View>
        }
      />

      {notifications.length > 0 && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={styles.clearButtonText}>مسح كل الإشعارات</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topBar: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  actionHeaderBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionHeaderBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  listPadding: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadCard: {
    borderRightWidth: 4,
    borderRightColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardBody: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'right',
    lineHeight: 20,
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
  footerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
});
