import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { Settings, Save, RotateCcw, Globe, MessageSquare, CreditCard, Download, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: AppSettings) => void;
  onReset: () => void;
  onSyncFromBlogger?: () => Promise<void>;
  isSyncing?: boolean;
  onOpenAdmin?: () => void;
  onOpenAdSenseAudit?: () => void;
  onOpenLegal?: (docId: 'privacy' | 'terms' | 'about' | 'contact' | 'anti-scam' | 'cookie') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
  onReset,
  onSyncFromBlogger,
  isSyncing = false,
  onOpenAdmin,
  onOpenAdSenseAudit,
  onOpenLegal
}) => {
  const [form, setForm] = useState<AppSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <img
              src="/apk-icon.png"
              alt="Qatar Living Jobs"
              className="w-7 h-7 rounded-lg object-contain border border-stone-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-[16px] font-bold text-stone-800">
              App Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Sync from Blogger Bar */}
        {onSyncFromBlogger && (
          <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[11.5px] font-bold text-stone-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#8e1e3c]" />
                Sync with app.html
              </span>
              <p className="text-[10px] text-stone-500">
                {settings.lastSynced
                  ? `Synced: ${new Date(settings.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Reads vars from Blogger'}
              </p>
            </div>
            <button
              type="button"
              onClick={onSyncFromBlogger}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 text-[11.5px] font-bold flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-stone-700 mb-1">
              <Globe className="w-3.5 h-3.5 text-[#8e1e3c]" />
              Blogger Website URL (BLOG_URL)
            </label>
            <input
              type="url"
              required
              value={form.blogUrl}
              onChange={(e) => setForm({ ...form, blogUrl: e.target.value })}
              placeholder="https://www.qatarlivingjobs1.com"
              className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
            />
            <p className="text-[10.5px] text-stone-400 mt-0.5">
              Live job feed endpoint on Blogger
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-stone-700 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" />
              WhatsApp Number (WHATSAPP)
            </label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="97400000000"
              className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
            />
            <p className="text-[10.5px] text-stone-400 mt-0.5">
              Receives ATS CV orders & inquiries (country code, no +)
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-stone-700 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-[#2e9e5b]" />
              Payment Gateway URL (PAYMENT_URL)
            </label>
            <input
              type="url"
              value={form.paymentUrl}
              onChange={(e) => setForm({ ...form, paymentUrl: e.target.value })}
              placeholder="https://tap.company/... or leave blank for WhatsApp"
              className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
            />
            <p className="text-[10.5px] text-stone-400 mt-0.5">
              Optional payment link, or leave blank to order via WhatsApp.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-bold text-stone-700 mb-1">
              <Download className="w-3.5 h-3.5 text-[#8e1e3c]" />
              APK Download URL (APK_URL)
            </label>
            <input
              type="text"
              value={form.apkUrl}
              onChange={(e) => setForm({ ...form, apkUrl: e.target.value })}
              placeholder="https://.../QatarLivingJobs.apk or MediaFire / Drive link"
              className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
            />
            <p className="text-[10.5px] text-stone-400 mt-0.5">
              Direct download link when visitors click "Download APK"
            </p>
          </div>

          {/* Method 2: Admin Moderation Panel */}
          {onOpenAdmin && (
            <div className="p-3 bg-stone-900 text-white rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-[12.5px] font-bold">Admin Moderation Panel</p>
                  <p className="text-[10.5px] text-stone-300">Method 2: Review &amp; approve pending mobile ads &amp; jobs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 bg-[#8e1e3c] hover:bg-[#a52447] text-white text-[11.5px] font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Open Admin
              </button>
            </div>
          )}

          {/* Google AdSense Approval Diagnostic Card */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-bold text-stone-800">
                  Google AdSense Publisher Status
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                100% Ready
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Publisher ID: <code className="font-mono text-stone-700 font-bold">ca-pub-5776525398556337</code>. All required legal pages, ads.txt, robots.txt, and original editorial content are active.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onOpenAdSenseAudit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdSenseAudit();
                  }}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-md text-[11px] transition-colors cursor-pointer"
                >
                  View AdSense Audit
                </button>
              )}
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLegal('privacy');
                  }}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold rounded-md text-[11px] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              )}
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-mono text-[10.5px] rounded-md transition-colors ml-auto"
              >
                ads.txt
              </a>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                onReset();
                setForm({
                  blogUrl: 'https://www.qatarlivingjobs1.com',
                  whatsappNumber: '97400000000',
                  paymentUrl: '',
                  apkUrl: 'https://www.qatarlivingjobs1.com/p/app.html'
                });
              }}
              className="px-3 py-2 text-[12px] font-semibold text-stone-600 hover:bg-stone-100 rounded-lg flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Defaults
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-[12px] font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8e1e3c] hover:bg-[#72152e] text-white text-[12.5px] font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
