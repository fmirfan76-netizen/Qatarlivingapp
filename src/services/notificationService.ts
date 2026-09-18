import { AppNotification } from '../types';

export async function fetchNotifications(): Promise<AppNotification[]> {
  try {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return data.notifications || [];
  } catch (err) {
    console.warn('Error fetching notifications, loading local fallback:', err);
    try {
      const local = localStorage.getItem('ql_notifications');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  }
}

export async function subscribeToDeviceNotifications(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!('Notification' in window)) {
      return { success: false, error: 'Notifications not supported on this browser' };
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Notification permission denied' };
    }

    // Try service worker subscription if available
    let subscriptionData: any = {
      platform: navigator.userAgent.includes('Android') ? 'Android' : 'Web',
      userAgent: navigator.userAgent,
      grantedAt: new Date().toISOString()
    };

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.pushManager) {
          // Record active registration
          subscriptionData.hasServiceWorker = true;
        }
      } catch (swErr) {
        console.warn('Service worker ready check failed:', swErr);
      }
    }

    // Register with server backend
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData)
    });

    // Mark subscribed locally
    localStorage.setItem('ql_notif_subscribed', 'true');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Subscription failed' };
  }
}

export function isDeviceSubscribed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ql_notif_subscribed') === 'true' && Notification.permission === 'granted';
}

export async function broadcastAdminNotification(
  pin: string,
  notification: { title: string; body: string; type?: 'job' | 'classified' | 'update' | 'general'; actionUrl?: string }
): Promise<{ success: boolean; subscriberCount: number; message: string }> {
  const res = await fetch('/api/admin/broadcast-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-pin': pin
    },
    body: JSON.stringify(notification)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to send broadcast');
  }

  return data;
}

export function showSystemNotification(title: string, body: string, actionUrl?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          data: { actionUrl }
        });
      });
    } else {
      new Notification(title, {
        body,
        icon: '/icon.svg'
      });
    }
  } catch (e) {
    console.warn('Failed to display system notification:', e);
  }
}
