/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Job, AppSettings, UserListing, ListingType } from './types';
import { fetchJobsFromBlogger, syncAppConfigFromBloggerPage } from './services/jobService';
import { fetchApprovedListings, fetchPendingCount } from './services/listingService';
import { FALLBACK_JOBS } from './data/fallbackJobs';
import { Header } from './components/Header';
import { JobsView } from './components/JobsView';
import { ClassifiedsView } from './components/ClassifiedsView';
import { CvSection } from './components/CvSection';
import { QatarToolsView } from './components/QatarToolsView';
import { DownloadApkView } from './components/DownloadApkView';
import { SettingsModal } from './components/SettingsModal';
import { JobDetailModal } from './components/JobDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { NotificationModal } from './components/NotificationModal';
import { fetchNotifications } from './services/notificationService';
import { CheckCircle2, Plus } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  blogUrl: 'https://www.qatarlivingjobs1.com',
  whatsappNumber: '97400000000',
  paymentUrl: '',
  apkUrl: '/api/download/apk',
  apkDirectDownloadUrl: '/api/download/apk',
  sourcePage: 'https://www.qatarlivingjobs1.com/p/app.html',
  adminPin: '9740'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'vehicles' | 'rooms' | 'mobiles' | 'tools' | 'cv' | 'apk'>('jobs');
  const [postAdDefaultType, setPostAdDefaultType] = useState<ListingType>('mobile');
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListingsLoading, setIsListingsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // App settings state with localStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('ql_app_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchNotifications().then((list) => {
      if (list && list.length > 0) {
        setUnreadNotifCount(list.length);
      }
    }).catch(() => {});
  }, []);

  // Sync settings directly from https://www.qatarlivingjobs1.com/p/app.html
  const syncFromBlogger = useCallback(async () => {
    setIsSyncing(true);
    try {
      const liveConfig = await syncAppConfigFromBloggerPage();
      if (liveConfig) {
        setSettings((prev) => {
          const cleanApkUrl = (liveConfig.apkUrl && !liveConfig.apkUrl.includes('app.html'))
            ? liveConfig.apkUrl
            : (prev.apkUrl && !prev.apkUrl.includes('app.html'))
            ? prev.apkUrl
            : '/api/download/apk';
          const updated: AppSettings = {
            ...prev,
            ...liveConfig,
            apkUrl: cleanApkUrl,
            apkDirectDownloadUrl: cleanApkUrl,
            lastSynced: new Date().toISOString()
          };
          try {
            localStorage.setItem('ql_app_settings', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        setSyncToast('Synced with qatarlivingjobs1.com/p/app.html');
        setTimeout(() => setSyncToast(null), 4000);
      }
    } catch (err) {
      console.warn('Auto-sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Load jobs from Blogger
  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const fetchedJobs = await fetchJobsFromBlogger(settings.blogUrl);
      if (fetchedJobs && fetchedJobs.length > 0) {
        setJobs(fetchedJobs);
      } else {
        setJobs(FALLBACK_JOBS);
      }
    } catch (err) {
      console.warn('Unable to load from Blogger directly:', err);
      setFetchError('Feed synced with active Qatar listings');
      setJobs(FALLBACK_JOBS);
    } finally {
      setIsLoading(false);
    }
  }, [settings.blogUrl]);

  // Load approved listings and public pending count
  const loadListings = useCallback(async () => {
    setIsListingsLoading(true);
    try {
      const data = await fetchApprovedListings();
      setListings(data);

      const count = await fetchPendingCount();
      setPendingCount(count);
    } catch (err) {
      console.warn('Listing load note:', err);
    } finally {
      setIsListingsLoading(false);
    }
  }, []);

  // Initial load: sync app config, load jobs, and load classifieds
  useEffect(() => {
    syncFromBlogger();
    loadJobs();
    loadListings();

    // Dynamically mount Adsterra Social Bar from publisher site
    try {
      if (typeof window !== 'undefined' && !document.getElementById('adsterra-socialbar')) {
        const s = document.createElement('script');
        s.id = 'adsterra-socialbar';
        s.src = 'https://pl30329679.effectivecpmnetwork.com/a7/3e/01/a73e01599d21de71f147be0dd1f183e9.js';
        s.async = true;
        document.body.appendChild(s);
      }
    } catch (err) {
      console.warn('Adsterra Social Bar note:', err);
    }
  }, [syncFromBlogger, loadJobs, loadListings]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('ql_app_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
    // Reload if blogUrl changed
    if (newSettings.blogUrl !== settings.blogUrl) {
      setTimeout(() => loadJobs(), 100);
    }
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('ql_app_settings');
    } catch (e) {
      console.error(e);
    }
    loadJobs();
  };

  // Combine Blogger feed with user-submitted approved jobs
  const combinedJobs = useMemo(() => {
    const userApprovedJobs: Job[] = listings
      .filter((l) => l.type === 'job' && l.status === 'approved')
      .map((l) => ({
        id: l.id,
        title: l.title,
        link: `https://wa.me/${l.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          `Hi! I saw your job vacancy "${l.title}" on Qatar Living Jobs app.`
        )}`,
        snippet: l.description,
        category: l.categoryOrBrand,
        location: l.location,
        salary: l.priceOrSalary,
        company: l.contactName,
        img: l.imageUrl,
        date: new Date(l.createdAt).toLocaleDateString('en-GB')
      }));
    return [...userApprovedJobs, ...jobs];
  }, [jobs, listings]);

  // Counts for each category of approved ads
  const vehiclesCount = useMemo(
    () => listings.filter((l) => l.type === 'vehicle' && l.status === 'approved').length,
    [listings]
  );
  const roomsCount = useMemo(
    () => listings.filter((l) => l.type === 'room' && l.status === 'approved').length,
    [listings]
  );
  const mobilesCount = useMemo(
    () => listings.filter((l) => l.type === 'mobile' && l.status === 'approved').length,
    [listings]
  );

  const handleOpenPostAd = (type?: ListingType) => {
    if (type) {
      setPostAdDefaultType(type);
    } else if (activeTab === 'vehicles') {
      setPostAdDefaultType('vehicle');
    } else if (activeTab === 'rooms') {
      setPostAdDefaultType('room');
    } else if (activeTab === 'mobiles') {
      setPostAdDefaultType('mobile');
    } else {
      setPostAdDefaultType('job');
    }
    setIsPostAdOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#333] font-sans antialiased flex flex-col items-center">
      {/* Mobile container constraint */}
      <div className="w-full max-w-xl min-h-screen bg-white shadow-xl flex flex-col border-x border-[#e0dcd9]">
        {/* Header */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRefresh={() => {
            loadJobs();
            loadListings();
            syncFromBlogger();
          }}
          onOpenApk={() => setActiveTab('apk')}
          onOpenPostAd={() => handleOpenPostAd()}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenNotifications={() => {
            setIsNotificationOpen(true);
            setUnreadNotifCount(0);
          }}
          unreadNotifCount={unreadNotifCount}
          pendingCount={pendingCount}
          isLoading={isLoading || isSyncing}
          totalJobs={combinedJobs.length}
        />

        {/* Dynamic Auto-Sync Notification Toast */}
        {syncToast && (
          <div className="bg-emerald-600 text-white text-[11.5px] px-3 py-1.5 flex items-center justify-center gap-1.5 transition-all shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{syncToast}</span>
          </div>
        )}

        {/* Navigation Tabs (Jobs | Vehicles | Rooms & Bed Space | Mobiles | Tools | CV | APK) */}
        <nav className="flex bg-white border-b-2 border-[#e5dde0] sticky top-[48px] sm:top-[50px] z-30 shadow-2xs overflow-x-auto no-scrollbar">
          <button
            id="tabJobs"
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-[68px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'text-[#8e1e3c] border-b-[#8e1e3c]'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            💼 Jobs {combinedJobs.length > 0 && <span className="text-[10px] font-semibold text-stone-500">({combinedJobs.length})</span>}
          </button>

          <button
            id="tabVehicles"
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 min-w-[76px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'text-amber-600 border-b-amber-500'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            🚗 Cars {vehiclesCount > 0 && <span className="text-[10px] font-bold text-amber-700">({vehiclesCount})</span>}
          </button>

          <button
            id="tabRooms"
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 min-w-[82px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'rooms'
                ? 'text-emerald-700 border-b-emerald-600'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            🛏️ Rooms {roomsCount > 0 && <span className="text-[10px] font-bold text-emerald-700">({roomsCount})</span>}
          </button>

          <button
            id="tabMobiles"
            onClick={() => setActiveTab('mobiles')}
            className={`flex-1 min-w-[76px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'mobiles'
                ? 'text-purple-700 border-b-purple-600'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            📱 Mobiles {mobilesCount > 0 && <span className="text-[10px] font-bold text-purple-700">({mobilesCount})</span>}
          </button>

          <button
            id="tabTools"
            onClick={() => setActiveTab('tools')}
            className={`flex-1 min-w-[62px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'tools'
                ? 'text-[#8e1e3c] border-b-[#8e1e3c]'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            🧮 Tools
          </button>

          <button
            id="tabCv"
            onClick={() => setActiveTab('cv')}
            className={`flex-1 min-w-[62px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'cv'
                ? 'text-[#8e1e3c] border-b-[#8e1e3c]'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            📄 CV
          </button>

          <button
            id="tabApk"
            onClick={() => setActiveTab('apk')}
            className={`flex-1 min-w-[58px] py-3 text-center font-bold text-[12px] sm:text-[13px] cursor-pointer transition-all border-b-3 relative whitespace-nowrap ${
              activeTab === 'apk'
                ? 'text-[#8e1e3c] border-b-[#8e1e3c]'
                : 'text-[#777] border-b-transparent hover:text-stone-700'
            }`}
          >
            📲 APK
          </button>
        </nav>

        {/* Content Views */}
        <main className="flex-1 p-3 sm:p-4">
          {activeTab === 'jobs' ? (
            <JobsView
              jobs={combinedJobs}
              isLoading={isLoading}
              onRefresh={() => {
                loadJobs();
                loadListings();
                syncFromBlogger();
              }}
              onSelectJob={(job) => {
                setSelectedJob(job);
              }}
              onApplyJob={(job) => {
                setSelectedJob(job);
              }}
              onOpenPostAd={() => handleOpenPostAd('job')}
              error={fetchError}
            />
          ) : activeTab === 'vehicles' ? (
            <ClassifiedsView
              listings={listings}
              isLoading={isListingsLoading}
              onRefresh={loadListings}
              onOpenPostAd={handleOpenPostAd}
              initialCategory="vehicle"
              whatsappAdminNumber={settings.whatsappNumber}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          ) : activeTab === 'rooms' ? (
            <ClassifiedsView
              listings={listings}
              isLoading={isListingsLoading}
              onRefresh={loadListings}
              onOpenPostAd={handleOpenPostAd}
              initialCategory="room"
              whatsappAdminNumber={settings.whatsappNumber}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          ) : activeTab === 'mobiles' ? (
            <ClassifiedsView
              listings={listings}
              isLoading={isListingsLoading}
              onRefresh={loadListings}
              onOpenPostAd={handleOpenPostAd}
              initialCategory="mobile"
              whatsappAdminNumber={settings.whatsappNumber}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          ) : activeTab === 'tools' ? (
            <QatarToolsView />
          ) : activeTab === 'cv' ? (
            <CvSection settings={settings} />
          ) : (
            <DownloadApkView
              settings={settings}
              onSyncConfig={syncFromBlogger}
              isSyncing={isSyncing}
            />
          )}
        </main>

        {/* Prominent Floating Action Button "+ Post Ad" */}
        <button
          id="fab-post-ad"
          onClick={() => handleOpenPostAd()}
          className="fixed bottom-6 right-4 sm:right-6 z-40 py-3 px-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-stone-950 font-black text-[13px] sm:text-[14px] shadow-2xl flex items-center gap-2 border-2 border-white cursor-pointer transition-all hover:shadow-amber-500/30"
          title="Post Ad (Vehicles, Rooms, Mobiles, Jobs - Requires Admin Approval)"
        >
          <div className="w-6 h-6 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span>+ Post Ad</span>
        </button>

        {/* Post Ad Submission Modal */}
        <PostAdModal
          isOpen={isPostAdOpen}
          onClose={() => setIsPostAdOpen(false)}
          onSuccess={(newListing) => {
            loadListings();
          }}
          settings={settings}
          defaultType={postAdDefaultType}
        />

        {/* Admin Moderation Dashboard (Method 2) */}
        <AdminModerationModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          settings={settings}
          onUpdateSettings={handleSaveSettings}
          onListingsUpdated={() => {
            loadListings();
            loadJobs();
          }}
        />

        {/* App Settings Modal */}
        <SettingsModal
          settings={settings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
          onSyncFromBlogger={syncFromBlogger}
          isSyncing={isSyncing}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Job Detail View Modal */}
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          whatsappAdminNumber={settings.whatsappNumber}
        />

        {/* Notifications & Updates Modal */}
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsNotificationOpen(false);
          }}
        />
      </div>
    </div>
  );
}
