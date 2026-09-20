import React, { useState, useEffect } from 'react';
import { UserListing, AppSettings, JobApplication } from '../types';
import {
  fetchAdminListings,
  updateAdminListing,
  deleteAdminListing,
  changeAdminPin,
  checkAdminPinStatus,
  AdminStats
} from '../services/listingService';
import { broadcastAdminNotification } from '../services/notificationService';
import {
  X,
  Lock,
  LogOut,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  Clock,
  Phone,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Briefcase,
  Car,
  Home,
  Gauge,
  Calendar,
  Zap,
  KeyRound,
  Bell,
  Send,
  Radio
} from 'lucide-react';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onListingsUpdated?: () => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onListingsUpdated
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDefaultPin, setIsDefaultPin] = useState(true);
  const [autoSignOutOnApprove, setAutoSignOutOnApprove] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [listings, setListings] = useState<UserListing[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vehicle' | 'room' | 'mobile' | 'job'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New PIN modal state
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');

  // Delete confirmation and broadcast state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'jobs' | 'vehicles' | 'rooms' | 'mobiles' | 'apk'>('jobs');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Strictly do NOT keep admin panel open: require PIN every time it is opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setActionMessage(null);
      // Ensure any previous session is cleared - panel is locked by default
      sessionStorage.removeItem('ql_admin_pin_auth');
      setIsAuthenticated(false);
      setPinInput('');
      checkAdminPinStatus(settings.adminPin).then((res) => {
        setIsDefaultPin(res.isDefault);
      });
    } else {
      // Immediately wipe auth on close
      sessionStorage.removeItem('ql_admin_pin_auth');
      setIsAuthenticated(false);
      setPinInput('');
      setActionMessage(null);
    }
  }, [isOpen, settings.adminPin]);

  const loadAdminData = async (pin: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminListings(pin, settings.adminPin);
      setListings(data.listings || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      setIsAuthenticated(true);
      // Keep in local component state only, do not persist to browser storage
      setPinInput(pin);
    } catch (err: any) {
      setError(err.message || 'Invalid Admin PIN');
      setIsAuthenticated(false);
      sessionStorage.removeItem('ql_admin_pin_auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    loadAdminData(pinInput.trim());
  };

  // Sign out and close the modal completely
  const handleSignOutAndClose = () => {
    sessionStorage.removeItem('ql_admin_pin_auth');
    setPinInput('');
    setIsAuthenticated(false);
    setError(null);
    setActionMessage(null);
    onClose();
  };

  // Sign out but remain on the locked PIN login screen
  const handleSignOutOnly = () => {
    sessionStorage.removeItem('ql_admin_pin_auth');
    setPinInput('');
    setIsAuthenticated(false);
    setError(null);
    setActionMessage('Signed out. Admin panel locked 🔒');
    checkAdminPinStatus(settings.adminPin).then((res) => {
      setIsDefaultPin(res.isDefault);
    });
    setTimeout(() => setActionMessage(null), 2500);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'approved' | 'rejected',
    forceSignOut?: boolean
  ) => {
    try {
      setActionMessage(`Updating listing...`);
      const updated = await updateAdminListing(pinInput, id, { status: newStatus });
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));

      // Re-calculate stats
      setStats((prev) => {
        const item = listings.find((l) => l.id === id);
        const oldStatus = item?.status || 'pending';
        return {
          ...prev,
          [oldStatus]: Math.max(0, prev[oldStatus as keyof AdminStats] - 1),
          [newStatus]: prev[newStatus as keyof AdminStats] + 1
        };
      });

      if (onListingsUpdated) onListingsUpdated();

      // If approved and either autoSignOutOnApprove is ON or forceSignOut is requested
      if (newStatus === 'approved' && (autoSignOutOnApprove || forceSignOut)) {
        setActionMessage(`Approved & published live! Signing out & locking panel... ✅`);
        setTimeout(() => {
          handleSignOutAndClose();
        }, 1200);
        return;
      }

      setActionMessage(`Listing ${newStatus === 'approved' ? 'Approved & Published Live! ✅' : 'Rejected ❌'}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured?: boolean) => {
    try {
      const updated = await updateAdminListing(pinInput, id, { featured: !currentFeatured });
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
      setActionMessage(updated.featured ? 'Marked as Featured! ⭐' : 'Unmarked featured');
      if (onListingsUpdated) onListingsUpdated();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteAdminListing(pinInput, id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        pending: prev.pending - (listings.find(l => l.id === id)?.status === 'pending' ? 1 : 0),
        approved: prev.approved - (listings.find(l => l.id === id)?.status === 'approved' ? 1 : 0),
        rejected: prev.rejected - (listings.find(l => l.id === id)?.status === 'rejected' ? 1 : 0)
      }));
      setConfirmDeleteId(null);
      setActionMessage('Listing deleted permanently.');
      if (onListingsUpdated) onListingsUpdated();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      setError('Title and message are required for update broadcast');
      return;
    }
    setIsBroadcasting(true);
    setError(null);
    try {
      const res = await broadcastAdminNotification(pinInput, {
        title: broadcastTitle.trim(),
        body: broadcastBody.trim(),
        actionUrl: broadcastTarget,
        type: broadcastTarget === 'apk' ? 'update' : broadcastTarget === 'jobs' ? 'job' : 'classified'
      });
      setActionMessage(res.message || 'Update notification broadcasted to all users!');
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastBody('');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to send broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewPin = newPinValue.trim();
    if (cleanNewPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      // Persist to server backend
      await changeAdminPin(pinInput, cleanNewPin, settings.adminPin);
      const updatedSettings = { ...settings, adminPin: cleanNewPin };
      onUpdateSettings(updatedSettings);
      setPinInput(cleanNewPin);
      sessionStorage.setItem('ql_admin_pin_auth', cleanNewPin);
      setShowPinChange(false);
      setNewPinValue('');
      setIsDefaultPin(false);
      setActionMessage(`Admin PIN successfully changed to "${cleanNewPin}"! Old default PIN (9740) is now disabled.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to change Admin PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchStatus = activeTab === 'all' || l.status === activeTab;
    const matchCategory = categoryFilter === 'all' || l.type === categoryFilter;
    return matchStatus && matchCategory;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSignOutAndClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8e1e3c] flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] flex items-center gap-2">
                Qatar Living Admin Moderation Panel
              </h3>
              <p className="text-[11px] text-stone-400">
                Method 2: Review and approve phone sales &amp; job submissions before they go live
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleSignOutOnly}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white text-[11.5px] font-bold flex items-center gap-1 border border-red-400/30 transition-colors cursor-pointer"
                title="Sign Out & Lock Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={handleSignOutAndClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer"
              title="Close & Lock"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 text-center max-w-sm mx-auto my-auto space-y-4">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-700">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-[17px] font-bold text-stone-900">Admin Security PIN</h4>
              <p className="text-[12.5px] text-stone-500 mt-1">
                Enter your Admin PIN to review pending classifieds and job postings.
              </p>
              <div className="mt-2 text-[11px]">
                {isDefaultPin ? (
                  <span className="text-stone-500">
                    Factory default PIN: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-stone-800">9740</code> (Change it anytime inside)
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    🔒 Custom Admin PIN active (Default 9740 is disabled)
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px] flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin PIN"
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 px-3 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8e1e3c]"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#8e1e3c] hover:bg-[#72152e] text-white font-bold rounded-xl text-[14px] shadow-sm transition-colors cursor-pointer disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Unlock Admin Panel'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Authenticated Controls Bar */}
            <div className="bg-stone-50 border-b border-stone-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Quick Status Stats Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[12px]">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10.5px] bg-black/20 text-white font-extrabold">
                    {stats.pending}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approved Live</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10.5px] bg-black/20 text-white font-extrabold">
                    {stats.approved}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'rejected'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Rejected</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10.5px] bg-black/20 text-white font-extrabold">
                    {stats.rejected}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-stone-800 text-white'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All ({stats.total})
                </button>
              </div>

              {/* Action utilities */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Auto sign-out toggle */}
                <label
                  className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg cursor-pointer select-none hover:bg-stone-50"
                  title="When enabled, approving any listing automatically signs you out and closes the panel"
                >
                  <input
                    type="checkbox"
                    checked={autoSignOutOnApprove}
                    onChange={(e) => setAutoSignOutOnApprove(e.target.checked)}
                    className="rounded text-[#8e1e3c] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold text-stone-700">Auto sign-out on approval</span>
                </label>

                <button
                  onClick={() => loadAdminData(pinInput)}
                  title="Refresh listings"
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-[12px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={() => setShowPinChange(!showPinChange)}
                  title="Change PIN"
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-[12px] flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change PIN</span>
                </button>

                {/* Broadcast Push Notification Button */}
                <button
                  id="admin-broadcast-notif-btn"
                  onClick={() => setShowBroadcastModal(!showBroadcastModal)}
                  title="Send push notification to all users who downloaded or subscribed"
                  className="p-1.5 px-2.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[12px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  <span>Broadcast Update</span>
                </button>

                {/* Sign Out / Lock Button */}
                <button
                  onClick={handleSignOutOnly}
                  title="Sign Out & Lock Panel"
                  className="p-1.5 px-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[12px] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="bg-stone-100/80 border-b border-stone-200 px-3 sm:px-5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[11px] font-bold text-stone-500 mr-1 shrink-0">Category:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setCategoryFilter('vehicle')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === 'vehicle'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                🚗 Vehicles ({listings.filter((l) => l.type === 'vehicle').length})
              </button>
              <button
                onClick={() => setCategoryFilter('room')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === 'room'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                🛏️ Rooms / Bed Space ({listings.filter((l) => l.type === 'room').length})
              </button>
              <button
                onClick={() => setCategoryFilter('mobile')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === 'mobile'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                📱 Mobiles ({listings.filter((l) => l.type === 'mobile').length})
              </button>
              <button
                onClick={() => setCategoryFilter('job')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === 'job'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                💼 Jobs ({listings.filter((l) => l.type === 'job').length})
              </button>
            </div>

            {/* Notification messages */}
            {actionMessage && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-emerald-800 text-[12px] font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Change PIN Form dropdown */}
            {showPinChange && (
              <form onSubmit={handleChangePin} className="p-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                <span className="text-[12px] font-bold text-amber-900">New Admin PIN:</span>
                <input
                  type="text"
                  required
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="e.g. 1234"
                  className="px-2.5 py-1 text-[12px] font-mono border border-stone-300 rounded bg-white w-28"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#8e1e3c] text-white text-[11.5px] font-bold rounded hover:bg-[#72152e]"
                >
                  Save PIN
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinChange(false)}
                  className="text-stone-500 text-[11.5px] hover:text-stone-800"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Broadcast Update Notification Form */}
            {showBroadcastModal && (
              <form onSubmit={handleBroadcast} className="p-4 bg-amber-50/80 border-b border-amber-200 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-800" />
                    <h4 className="text-[13.5px] font-extrabold text-amber-950">
                      Broadcast Instant Update to App Users
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="text-stone-400 hover:text-stone-700 text-[12px] cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
                <p className="text-[11.5px] text-amber-900/80">
                  Sends an immediate push notification alert to all users who installed the APK or subscribed on their phone.
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Alert Title (e.g. 📢 Urgent Walk-in Interviews in Doha!)"
                    className="w-full px-3 py-1.5 text-[12.5px] border border-amber-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-semibold"
                  />
                  <textarea
                    required
                    rows={2}
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Message description (e.g. 45 new driver & office jobs posted today. Apply via WhatsApp directly.)"
                    className="w-full px-3 py-1.5 text-[12px] border border-amber-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-amber-950">Target Destination:</span>
                    <select
                      value={broadcastTarget}
                      onChange={(e: any) => setBroadcastTarget(e.target.value)}
                      className="px-2 py-1 text-[11.5px] font-bold border border-amber-300 rounded-md bg-white text-stone-800"
                    >
                      <option value="jobs">💼 Jobs Tab</option>
                      <option value="vehicles">🚗 Vehicles Tab</option>
                      <option value="rooms">🛏️ Rooms / Bed Space Tab</option>
                      <option value="mobiles">📱 Mobile Phones Tab</option>
                      <option value="apk">📲 APK Direct Download Tab</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isBroadcasting}
                      className="ml-auto px-4 py-1.5 bg-[#8e1e3c] hover:bg-[#72152e] text-white text-[12px] font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isBroadcasting ? 'Broadcasting...' : 'Send Push Alert Now'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Listings Review List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {filteredListings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <p className="text-stone-500 font-medium text-[13.5px]">
                    No listings in <strong className="capitalize">{activeTab}</strong>.
                  </p>
                  <p className="text-stone-400 text-[11.5px] mt-1">
                    {activeTab === 'pending'
                      ? 'Great job! All user submitted mobile sales and jobs have been reviewed.'
                      : 'Submissions will appear here once users submit ads.'}
                  </p>
                </div>
              ) : (
                filteredListings.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200'
                        : item.status === 'approved'
                        ? 'bg-white border-stone-200'
                        : 'bg-stone-50 border-stone-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 ${
                              item.type === 'vehicle'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : item.type === 'room'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : item.type === 'mobile'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.type === 'vehicle' && <Car className="w-3 h-3 text-amber-600" />}
                            {item.type === 'room' && <Home className="w-3 h-3 text-emerald-600" />}
                            {item.type === 'mobile' && <Smartphone className="w-3 h-3 text-purple-600" />}
                            {item.type === 'job' && <Briefcase className="w-3 h-3 text-blue-600" />}
                            <span>
                              {item.type === 'vehicle' && 'Vehicle / Car'}
                              {item.type === 'room' && 'Room / Bed Space'}
                              {item.type === 'mobile' && 'Mobile Phone'}
                              {item.type === 'job' && 'Job Vacancy'}
                            </span>
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-stone-100 text-stone-700">
                            {item.categoryOrBrand}
                          </span>

                          {item.yearModel && (
                            <span className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-stone-100 text-stone-700 flex items-center gap-0.5">
                              <Calendar className="w-2.5 h-2.5" /> {item.yearModel}
                            </span>
                          )}

                          {item.mileage && (
                            <span className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-stone-100 text-stone-700 flex items-center gap-0.5">
                              <Gauge className="w-2.5 h-2.5" /> {item.mileage}
                            </span>
                          )}

                          {item.furnished && (
                            <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-stone-100 text-stone-700">
                              {item.furnished}
                            </span>
                          )}

                          {item.utilitiesIncluded && (
                            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-700 flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-amber-500" /> Free Kahramaa &amp; WiFi
                            </span>
                          )}

                          {item.condition && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {item.condition}
                            </span>
                          )}

                          {item.storage && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-200 text-stone-700">
                              {item.storage}
                            </span>
                          )}

                          {item.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}

                          {/* Status pill */}
                          <span
                            className={`ml-auto px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                              item.status === 'pending'
                                ? 'bg-amber-200 text-amber-900'
                                : item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Title & Price */}
                        <h4 className="text-[15px] font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-3 mt-1 text-[13px]">
                          <span className="font-extrabold text-[#8e1e3c]">
                            {item.priceOrSalary}
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-600 text-[12px]">{item.location}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-400 text-[11px]">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-[12px] text-stone-600 mt-2 line-clamp-2 bg-white/70 p-2 rounded-lg border border-stone-100">
                            {item.description}
                          </p>
                        )}

                        {/* Submitter details */}
                        <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2 border-t border-stone-200/60 text-[11.5px] text-stone-500">
                          <span>
                            Posted by: <strong>{item.contactName}</strong>
                          </span>
                          <span>
                            WhatsApp: <strong className="font-mono">{item.contactPhone}</strong>
                          </span>

                          <a
                            href={`https://wa.me/${item.contactPhone}?text=${encodeURIComponent(
                              `Hi ${item.contactName}! Regarding your listing "${item.title}" on Qatar Living Jobs...`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25d366] hover:underline font-bold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-[#25d366]" /> Chat
                          </a>
                        </div>
                      </div>

                      {/* Image Thumbnail if provided */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-200 shrink-0"
                        />
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-stone-200/80">
                      {item.status !== 'approved' && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(item.id, 'approved', true)}
                            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
                            title="Approve this listing and immediately sign out & lock the admin panel"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve &amp; Sign Out</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(item.id, 'approved', false)}
                            className="py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 text-[11.5px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Approve but remain in admin panel to review more ads"
                          >
                            <span>Approve (Stay)</span>
                          </button>
                        </div>
                      )}

                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(item.id, 'rejected')}
                          className="py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 font-semibold text-[12px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleFeatured(item.id, item.featured)}
                        className={`py-1.5 px-3 rounded-lg font-semibold text-[12px] flex items-center gap-1 cursor-pointer transition-colors ${
                          item.featured
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        {item.featured ? 'Featured' : 'Mark Feature'}
                      </button>

                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200 ml-auto">
                          <span className="text-[11.5px] font-bold text-red-800">Confirm delete?</span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[11.5px] cursor-pointer shadow-xs"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[11.5px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold text-[12px] ml-auto flex items-center gap-1.5 border border-red-200 cursor-pointer transition-all shadow-xs"
                          title="Delete this post permanently anytime"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
