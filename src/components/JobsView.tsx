import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { AdBanner } from './AdBanner';
import { AdsterraBanner } from './AdsterraBanner';
import { Search, X, Filter, Bookmark, RefreshCw, AlertCircle, Plus, Sparkles } from 'lucide-react';

interface JobsViewProps {
  jobs: Job[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
  onOpenPostAd?: () => void;
  error?: string | null;
}

const CATEGORIES = [
  'All',
  'Qatar Airways',
  'Office Jobs',
  'Driver',
  'Hospitality',
  'Healthcare',
  'Engineering',
  'Sales',
  'Security',
  'Finance',
  'Admin'
];

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  isLoading,
  onRefresh,
  onSelectJob,
  onApplyJob,
  onOpenPostAd,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ql_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem('ql_saved_jobs', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Filter jobs by search term, category, and saved status
  const filteredJobs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      if (showSavedOnly && !savedJobIds.includes(job.id)) {
        return false;
      }
      if (selectedCategory !== 'All') {
        const matchesCat =
          (job.category && job.category.toLowerCase() === selectedCategory.toLowerCase()) ||
          job.title.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCat) return false;
      }
      if (!q) return true;
      const titleMatch = job.title.toLowerCase().includes(q);
      const snippetMatch = job.snippet.toLowerCase().includes(q);
      const companyMatch = job.company?.toLowerCase().includes(q) || false;
      return titleMatch || snippetMatch || companyMatch;
    });
  }, [jobs, searchTerm, selectedCategory, showSavedOnly, savedJobIds]);

  return (
    <div id="jobsView" className="pb-20">
      {/* Employer / Hiring Quick Action Banner */}
      {onOpenPostAd && (
        <div className="mx-3 mt-2.5 mb-1 p-2.5 rounded-xl bg-amber-50/90 border border-amber-300/60 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">📢</span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-stone-900 leading-tight truncate">
                Hiring Staff in Qatar?
              </p>
              <p className="text-[10.5px] text-stone-600 leading-tight truncate">
                Post your job vacancy for free (Admin approval required)
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPostAd}
            className="px-2.5 py-1.5 rounded-lg bg-[#8e1e3c] text-white hover:bg-[#72152e] text-[11.5px] font-extrabold flex items-center gap-1 shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Post Job</span>
          </button>
        </div>
      )}

      {/* Search Box */}
      <div className="p-3 bg-white border-b border-stone-200/80 shadow-xs sticky top-[58px] z-30">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
          <input
            id="searchInput"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search jobs... (driver, waiter, nurse)"
            className="w-full pl-9.5 pr-8 py-2.5 bg-stone-50 border border-[#e0d7da] rounded-[10px] text-[14px] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#8e1e3c] focus:ring-1 focus:ring-[#8e1e3c] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[12px] font-semibold rounded-full shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#8e1e3c] text-white border-[#8e1e3c]'
                  : 'bg-stone-100 text-stone-600 border-stone-200/70 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowSavedOnly((prev) => !prev)}
            className={`px-3 py-1 text-[12px] font-semibold rounded-full shrink-0 transition-colors border flex items-center gap-1 ${
              showSavedOnly
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-stone-100 text-stone-600 border-stone-200/70 hover:bg-stone-200'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            Saved ({savedJobIds.length})
          </button>
        </div>
      </div>

      {/* Error alert notice if Blogger rate limited, while still showing jobs */}
      {error && (
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[12px] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Showing verified active Qatar vacancies. ({error})</span>
          </div>
          <button
            onClick={onRefresh}
            className="text-[11px] font-bold underline hover:text-amber-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div id="loading" className="text-center py-6 text-[#777] text-[14px] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#8e1e3c]" />
          <span>Loading latest jobs...</span>
        </div>
      )}

      {/* Job list container */}
      <div id="jobsList" className="p-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <JobCard
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={toggleSaveJob}
                onSelectJob={onSelectJob}
                onApplyJob={onApplyJob}
              />
              {/* Strategic Adsterra & Sponsor slots between job cards */}
              {index === 3 && index < filteredJobs.length - 1 && (
                <AdsterraBanner
                  adKey="43df2ac0cbaf2d78b90c39f9e38fd913"
                  width={320}
                  height={50}
                  label="Sponsored Partner Offer"
                />
              )}
              {index === 11 && index < filteredJobs.length - 1 && (
                <AdsterraBanner
                  adKey="43df2ac0cbaf2d78b90c39f9e38fd913"
                  width={320}
                  height={50}
                  label="Featured Vacancies &amp; Deals"
                />
              )}
            </React.Fragment>
          ))
        ) : !isLoading ? (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-stone-300">
            <p className="text-stone-500 font-medium text-[14px]">No jobs found.</p>
            <p className="text-stone-400 text-[12px] mt-1">
              Try searching with another keyword like "driver", "waiter", or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setShowSavedOnly(false);
              }}
              className="mt-3 px-4 py-1.5 text-[12px] font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Fixed bottom refresh button matching #refreshBtn */}
      <button
        id="refreshBtn"
        onClick={onRefresh}
        title="Refresh jobs"
        aria-label="Refresh jobs"
        className="fixed bottom-[18px] right-[18px] w-[52px] h-[52px] rounded-full bg-[#8e1e3c] text-white flex items-center justify-center text-[22px] shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:bg-[#70152e] active:scale-95 transition-all z-40"
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
