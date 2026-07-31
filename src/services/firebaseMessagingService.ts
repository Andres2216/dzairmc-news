import { AppNotification } from '../types';

export interface RemoteNotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    articleId?: string;
    deepLink?: string;
  };
}

export class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;

  private constructor() {}

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  public async registerDeviceForRemoteMessages(): Promise<string | null> {
    console.log('[FirebaseMessagingService] Device registration layer ready.');
    return null;
  }

  public formatRemotePayload(payload: RemoteNotificationPayload): Omit<AppNotification, 'id' | 'createdAt' | 'isRead'> {
    return {
      title: payload.notification?.title || 'خبر جديد',
      body: payload.notification?.body || 'اضغط لمشاهدة التفاصيل الكاملة',
      articleId: payload.data?.articleId,
      deepLink: payload.data?.deepLink,
    };
  }

  public setupForegroundHandler(
    onNotificationReceived: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void
  ): () => void {
    console.log('[FirebaseMessagingService] Foreground handler listener ready.');
    return () => {};
  }
}

export const firebaseMessagingService = FirebaseMessagingService.getInstance();
