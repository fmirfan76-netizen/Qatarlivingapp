import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  FileCheck,
  Bell
} from 'lucide-react';
import {
  subscribeToDeviceNotifications,
  isDeviceSubscribed
} from '../services/notificationService';

interface DownloadApkViewProps {
  settings: AppSettings;
  onSyncConfig: () => Promise<void>;
  isSyncing: boolean;
}

export const DownloadApkView: React.FC<DownloadApkViewProps> = ({
  settings,
  onSyncConfig,
  isSyncing
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifSuccessToast, setNotifSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    // Check notification status
    setIsSubscribed(isDeviceSubscribed());

    // Check if running as standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Check iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      alert('To install on iPhone/iPad:\n1. Tap the Share button in Safari.\n2. Tap "Add to Home Screen".');
    } else {
      // Direct WebAPK install trigger or prompt
      alert('Tap browser options (⋮ on top-right) and select "Install app" or "Add to Home screen".');
    }
  };

  const handleDownloadDirectApk = () => {
    // Also prompt for notification permission so they receive update notifications
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            subscribeToDeviceNotifications().then(() => setIsSubscribed(true));
          }
        });
      }
    } catch {}

    // Direct download endpoint - NEVER app.html
    const directUrl = (settings.apkUrl && settings.apkUrl.startsWith('http') && !settings.apkUrl.includes('app.html'))
      ? settings.apkUrl
      : '/api/download/apk';

    const link = document.createElement('a');
    link.href = directUrl;
    link.setAttribute('download', 'QatarLivingJobs-v2.5.apk');
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 6000);
  };

  const handleSubscribeNotifications = async () => {
    try {
      const res = await subscribeToDeviceNotifications();
      if (res.success) {
        setIsSubscribed(true);
        setNotifSuccessToast('Device subscribed! You will now receive instant push alerts when new updates are posted.');
      } else {
        setNotifSuccessToast(res.error || 'Notification permission was not granted.');
      }
    } catch (e: any) {
      setNotifSuccessToast(e.message || 'Subscription failed');
    }
    setTimeout(() => setNotifSuccessToast(null), 5000);
  };

  const shareAppUrl = `https://wa.me/?text=${encodeURIComponent(
    '🇶🇦 Download Qatar Living Jobs App — Latest daily jobs in Qatar, ATS CV services & instant WhatsApp apply!\n' + window.location.href
  )}`;

  return (
    <div className="p-4 max-w-xl mx-auto pb-24">
      {/* Hero Banner with Official APK Profile Picture */}
      <div className="bg-gradient-to-br from-[#8e1e3c] to-[#6b142c] text-white rounded-2xl p-6 text-center shadow-lg border border-red-900/40 relative overflow-hidden">
        {/* Official APK Profile Picture / App Launcher Icon */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-white/60 mx-auto overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform">
            <img
              src="/apk-icon.png"
              alt="Qatar Living Jobs APK Profile Icon"
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md flex items-center gap-0.5 border border-white">
            <ShieldCheck className="w-3 h-3" />
            APK
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-white uppercase tracking-wide mb-1.5">
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          Official Mobile Application
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
          Qatar Living Jobs APK
        </h2>
        <p className="text-[13px] text-white/90 mt-1">
          Install on your Android or iPhone for daily job notifications &amp; fast access
        </p>

        {/* APK Meta Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11.5px] text-white/80">
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
            Version 1.0.4
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
            Android 5.0+ / iOS
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
            100% Free &amp; Safe
          </span>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccessToast && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[12.5px] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Opening APK download link. Check your downloads folder or notifications!</span>
        </div>
      )}

      {/* Primary Action Card */}
      <div className="bg-white rounded-2xl p-5 mt-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-stone-200/80">
        <h3 className="text-[15px] font-bold text-stone-800 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Download className="w-4 h-4 text-[#8e1e3c]" />
            Download &amp; Install Options
          </span>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Verified Package
          </span>
        </h3>

        {/* Option 1: Direct APK Download */}
        <div className="space-y-3 mt-3">
          <button
            id="download-direct-apk-btn"
            onClick={handleDownloadDirectApk}
            className="w-full py-3.5 px-4 rounded-xl bg-[#8e1e3c] hover:bg-[#72152e] active:scale-[0.99] text-white font-extrabold text-[15px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5 text-white" />
            Download Android APK (.apk)
          </button>

          {/* Option 2: WebAPK / Add to Home Screen */}
          <button
            id="install-pwa-btn"
            onClick={handleInstallPwa}
            className="w-full py-3 px-4 rounded-xl bg-[#2e9e5b] hover:bg-[#27864d] active:scale-[0.99] text-white font-bold text-[14.5px] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-white" />
            {isInstalled ? 'App Already Installed ✓' : 'Instant Install (No Storage Needed)'}
          </button>

          {/* Option 3: Share with Friends */}
          <a
            id="share-app-btn"
            href={shareAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[13px] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#25d366]" />
            Share APK Link on WhatsApp
          </a>
        </div>
      </div>

      {/* Update Notifications Subscription Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4.5 mt-4 border border-amber-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-[14.5px] font-extrabold text-amber-950">
                Turn On Update Notifications
              </h3>
              {isSubscribed && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                  Subscribed ✓
                </span>
              )}
            </div>
            <p className="text-[12px] text-amber-900/85 mt-1 leading-relaxed">
              Get notified immediately on your phone whenever new jobs, vehicles, rooms, or app versions are updated.
            </p>

            <button
              id="subscribe-notifications-btn"
              onClick={handleSubscribeNotifications}
              className={`mt-2.5 w-full py-2.5 px-4 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isSubscribed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#8e1e3c] hover:bg-[#72152e] text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{isSubscribed ? 'Notifications Active on this Device ✓' : 'Enable Instant Update Notifications'}</span>
            </button>

            {notifSuccessToast && (
              <div className="mt-2 p-2 bg-white/90 border border-amber-300 rounded-lg text-[11.5px] text-amber-900 font-medium">
                {notifSuccessToast}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Sync with Blogger app.html Info Card */}
      <div className="bg-stone-50 rounded-2xl p-4 mt-4 border border-stone-200/80 text-[12px] text-stone-600">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div className="flex items-center gap-1.5 font-bold text-stone-800">
            <Layers className="w-4 h-4 text-[#8e1e3c]" />
            Live Blogger Auto-Sync
          </div>
          <button
            onClick={onSyncConfig}
            disabled={isSyncing}
            className="flex items-center gap-1 text-[11px] font-bold text-[#8e1e3c] hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        <p className="mt-2 text-stone-500 leading-relaxed">
          This app continuously synchronizes with{' '}
          <a
            href="https://www.qatarlivingjobs1.com/p/app.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8e1e3c] font-semibold underline inline-flex items-center gap-0.5"
          >
            qatarlivingjobs1.com/p/app.html
            <ExternalLink className="w-3 h-3" />
          </a>
          . Whenever you update your WhatsApp number, payment link, or APK URL on Blogger, it automatically updates here!
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-stone-200/70 text-[11.5px]">
          <div>
            <span className="text-stone-400 block text-[10px]">CURRENT WHATSAPP</span>
            <span className="font-semibold text-stone-800">+{settings.whatsappNumber}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">ACTIVE BLOG URL</span>
            <span className="font-semibold text-stone-800 truncate block">
              {settings.blogUrl.replace('https://', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation Guide */}
      <div className="bg-white rounded-2xl p-5 mt-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/80">
        <h4 className="text-[14px] font-bold text-stone-900 mb-3 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-[#8e1e3c]" />
          How to Install APK on Android:
        </h4>

        <ol className="space-y-3 text-[12.5px] text-stone-600 list-decimal list-inside">
          <li className="pl-1 leading-relaxed">
            <strong className="text-stone-800">Download the APK:</strong> Tap the maroon <strong>Download Android APK</strong> button above.
          </li>
          <li className="pl-1 leading-relaxed">
            <strong className="text-stone-800">Confirm Download:</strong> If Chrome or Android shows <em>"File might be harmful"</em>, tap <strong>Download anyway</strong> (standard security prompt for apps outside Google Play).
          </li>
          <li className="pl-1 leading-relaxed">
            <strong className="text-stone-800">Open &amp; Install:</strong> Swipe down your notifications, tap <code>QatarLivingJobs.apk</code>, and select <strong>Install</strong>.
          </li>
          <li className="pl-1 leading-relaxed">
            <strong className="text-stone-800">Launch &amp; Apply:</strong> Open the app from your home screen and apply directly to daily Qatar jobs!
          </li>
        </ol>

        <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11.5px] text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>For iPhone / iPad users:</strong> Tap the Safari <strong>Share</strong> button (box with upward arrow) and select <strong>Add to Home Screen</strong>.
          </span>
        </div>
      </div>

      {/* Official APK Profile Picture / App Icon Card */}
      <div className="bg-white rounded-2xl p-5 mt-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-stone-200 p-1 bg-stone-50 overflow-hidden shrink-0 shadow-2xs">
              <img
                src="/apk-icon.png"
                alt="Qatar Living Job APK Profile"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-stone-900">
                Official APK Profile Icon
              </h4>
              <p className="text-[11.5px] text-stone-500">
                Qatar Living Job • 512x512 High-Res Launcher Icon
              </p>
            </div>
          </div>

          <a
            href="/apk-icon.png"
            download="qatar-living-jobs-apk-icon.png"
            className="py-1.5 px-3 rounded-lg border border-stone-300 hover:bg-stone-50 text-[11.5px] font-bold text-stone-700 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#8e1e3c]" />
            <span>Save Icon</span>
          </a>
        </div>
      </div>
    </div>
  );
};
