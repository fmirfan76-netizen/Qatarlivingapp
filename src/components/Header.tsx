import React from 'react';
import { Settings, Sparkles, RefreshCw, Plus, ShieldCheck, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onRefresh: () => void;
  onOpenApk: () => void;
  onOpenPostAd: () => void;
  onOpenAdmin: () => void;
  onOpenNotifications?: () => void;
  onOpenAdSenseAudit?: () => void;
  unreadNotifCount?: number;
  pendingCount?: number;
  isLoading: boolean;
  totalJobs: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onRefresh,
  onOpenApk,
  onOpenPostAd,
  onOpenAdmin,
  onOpenNotifications,
  onOpenAdSenseAudit,
  unreadNotifCount = 0,
  pendingCount = 0,
  isLoading,
  totalJobs
}) => {
  return (
    <header className="sticky top-0 z-40 text-white shadow-md bg-gradient-to-r from-[#8e1e3c] to-[#6b142c] transition-all">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2.5">
          <img
            src="/apk-icon.png"
            alt="Qatar Living Jobs"
            className="w-9 h-9 rounded-xl shadow-md border border-white/40 bg-white object-contain p-0.5 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                Qatar Living Jobs
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/25">
                Live
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <p className="text-[11px] sm:text-[11.5px] text-white/90 font-medium">
                Latest Jobs in Qatar — Updated Daily
              </p>
              {totalJobs > 0 && (
                <span className="text-[10.5px] text-white/75 hidden xs:inline">
                  • {totalJobs} {totalJobs === 1 ? 'Job' : 'Jobs'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {/* Post Ad Button - High Visibility */}
          <button
            id="header-post-ad-btn"
            onClick={onOpenPostAd}
            title="Post Ad: Vehicles, Rooms, Bed Space, Mobiles, Jobs (Requires Admin Approval)"
            className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all text-[12px] font-black text-stone-950 flex items-center gap-1 shadow-md cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3] text-stone-950" />
            <span>+ Post Ad</span>
          </button>

          {/* Admin Moderation Panel Button */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            title="Admin Moderation Panel (Review & Approve Submissions)"
            className="px-2 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 transition-colors text-white text-[11.5px] font-bold flex items-center gap-1 border border-white/20 relative cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Admin</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded-full text-[10px] font-black shadow-xs">
                {pendingCount}
              </span>
            )}
          </button>

          {/* AdSense Approval Diagnostic Tool */}
          {onOpenAdSenseAudit && (
            <button
              id="header-adsense-btn"
              onClick={onOpenAdSenseAudit}
              title="Google AdSense Approval Audit &amp; Verification"
              className="px-2 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 active:scale-95 transition-colors text-amber-200 text-[11px] font-bold flex items-center gap-1 border border-amber-300/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">AdSense</span>
            </button>
          )}

          <button
            id="header-apk-btn"
            onClick={onOpenApk}
            title="Download APK"
            aria-label="Download APK"
            className="px-2 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-[11.5px] font-bold flex items-center gap-1 text-white border border-white/20 shadow-xs"
          >
            <span>📲</span>
            <span className="hidden sm:inline">APK</span>
          </button>
          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              title="Notifications & Updates"
              aria-label="Notifications & Updates"
              className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors text-white/90 relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping ring-2 ring-[#8e1e3c]" />
              )}
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
              )}
            </button>
          )}

          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            title="Refresh jobs feed"
            aria-label="Refresh jobs feed"
            className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors text-white/90"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title="App Settings (WhatsApp & Blog URL)"
            aria-label="App Settings"
            className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors text-white/90"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
