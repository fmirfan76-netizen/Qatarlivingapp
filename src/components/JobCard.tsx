import React, { useState } from 'react';
import { Job } from '../types';
import { Share2, Calendar, MapPin, Building2, Bookmark, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onSelectJob,
  onApplyJob
}) => {
  const [imgError, setImgError] = useState(false);

  // WhatsApp share link
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`🇶🇦 ${job.title} — Apply here: ${job.link}`)}`;

  return (
    <article
      className="bg-white rounded-xl p-3.5 mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-stone-100 hover:border-[#8e1e3c]/30 transition-all flex flex-col sm:flex-row gap-3 relative group"
    >
      {/* Thumbnail */}
      {job.img && !imgError && (
        <div className="relative shrink-0 w-[74px] h-[74px] rounded-[10px] overflow-hidden bg-stone-100 border border-stone-200/60">
          <img
            src={job.img}
            alt={job.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            onClick={() => onSelectJob?.(job)}
            className="text-[14.5px] font-bold text-[#2c2c2c] leading-snug line-clamp-2 hover:text-[#8e1e3c] cursor-pointer"
          >
            {job.title}
          </h3>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(job.id)}
              title={isSaved ? 'Remove from saved' : 'Save job'}
              className="text-stone-400 hover:text-[#8e1e3c] p-1 rounded-md transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#8e1e3c] text-[#8e1e3c]' : ''}`} />
            </button>
          )}
        </div>

        {/* Meta */}
        <div className="text-[12px] text-[#777] my-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="inline-flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#8e1e3c]" />
            {job.date}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {job.company || 'Qatar Living Jobs'}
          </span>
          {job.location && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-stone-500">
                <MapPin className="w-3 h-3 text-red-500" />
                {job.location}
              </span>
            </>
          )}
          {job.salary && (
            <span className="inline-block px-1.5 py-0.2 text-[10.5px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {job.salary}
            </span>
          )}
        </div>

        {/* Snippet */}
        <p className="text-[12.5px] text-[#555] leading-relaxed line-clamp-2 mt-1">
          {job.snippet || 'Click Apply to view comprehensive job specifications, salary details, and employer contact criteria.'}
        </p>

        {/* Button Row */}
        <div className="flex gap-2 mt-2.5 pt-1 border-t border-stone-100">
          <button
            id={`apply-btn-${job.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onApplyJob) {
                onApplyJob(job);
              } else if (onSelectJob) {
                onSelectJob(job);
              }
            }}
            className="flex-1 py-2 px-3 rounded-lg text-[12.5px] font-bold text-center text-white bg-[#8e1e3c] hover:bg-[#72152e] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Apply Now
          </button>
          <a
            id={`share-btn-${job.id}`}
            href={waShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2 px-3 rounded-lg text-[12.5px] font-bold text-center text-white bg-[#25d366] hover:bg-[#20b859] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </a>
        </div>
      </div>
    </article>
  );
};
