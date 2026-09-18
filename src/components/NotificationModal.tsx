import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import {
  Bell,
  X,
  CheckCircle,
  Briefcase,
  Car,
  Home,
  Smartphone,
  Sparkles,
  ArrowRight,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  fetchNotifications,
  subscribeToDeviceNotifications,
  isDeviceSubscribed
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'jobs' | 'vehicles' | 'rooms' | 'mobiles' | 'apk') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifs();
      setIsSubscribed(isDeviceSubscribed());
    }
  }, [isOpen]);

  const loadNotifs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setSubscribeMessage(null);
    try {
      const result = await subscribeToDeviceNotifications();
      if (result.success) {
        setIsSubscribed(true);
        setSubscribeMessage('Push notifications enabled! You will be notified whenever new jobs or updates are posted.');
      } else {
        setSubscribeMessage(result.error || 'Permission was not granted.');
      }
    } catch (err: any) {
      setSubscribeMessage(err.message || 'Subscription failed');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscribeMessage(null), 5000);
    }
  };

  const handleItemClick = (notif: AppNotification) => {
    onClose();
    if (notif.actionUrl === 'apk') {
      onNavigateTab('apk');
    } else if (notif.actionUrl === 'vehicles') {
      onNavigateTab('vehicles');
    } else if (notif.actionUrl === 'rooms') {
      onNavigateTab('rooms');
    } else if (notif.actionUrl === 'mobiles') {
      onNavigateTab('mobiles');
    } else {
      onNavigateTab('jobs');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8e1e3c] to-[#6b142c] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-white">Updates &amp; Notifications</h3>
              <p className="text-[11px] text-white/80">Qatar jobs, classifieds &amp; APK updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subscribe Banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200/70 shrink-0">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">🔔</span>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-amber-950">
                {isSubscribed ? 'Device Notifications Active ✓' : 'Instant Phone Notifications'}
              </h4>
              <p className="text-[11.5px] text-amber-900/90 leading-tight mt-0.5">
                {isSubscribed
                  ? 'Your device will receive alerts when new jobs, cars, rooms, or app updates go live.'
                  : 'Turn on notifications to get alerted on your phone whenever new jobs or updates are posted.'}
              </p>
            </div>
          </div>

          {!isSubscribed && (
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-[#8e1e3c] hover:bg-[#73142e] text-white font-bold text-[12.5px] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isSubscribing ? 'Enabling...' : 'Enable Phone Notifications'}</span>
            </button>
          )}

          {subscribeMessage && (
            <div className="mt-2 p-2 bg-white/80 border border-amber-300 rounded-lg text-[11.5px] font-medium text-amber-900">
              {subscribeMessage}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto divide-y divide-stone-100 flex-1 space-y-1">
          {isLoading ? (
            <div className="py-12 text-center text-stone-400 text-[13px]">
              Loading updates...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-[13px] space-y-2">
              <Bell className="w-8 h-8 mx-auto text-stone-300 opacity-60" />
              <p>No new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className="p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'update' ? (
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                    ) : notif.type === 'job' ? (
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                    ) : notif.type === 'classified' ? (
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-[13px] font-bold text-stone-900 leading-snug group-hover:text-[#8e1e3c] transition-colors">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 whitespace-nowrap">
                        {new Date(notif.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="text-[12px] text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#8e1e3c] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[12.5px] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
