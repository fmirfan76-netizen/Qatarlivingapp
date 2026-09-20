import React, { useState } from 'react';
import { Job } from '../types';
import { SafeHtmlRenderer } from '../utils/htmlRenderer';
import {
  Share2,
  Calendar,
  Building2,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  whatsappAdminNumber?: string;
  // Keep optional initialMode for backward compatibility without error
  initialMode?: string;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `🇶🇦 *Qatar Living Job Vacancy: ${job.title}*\nCompany: ${job.company || 'Qatar Employer'}\nLocation: ${job.location || 'Doha, Qatar'}\nSalary: ${job.salary || 'Competitive'}\n\nView details & apply here:\n${job.link}`
  )}`;

  const handleCopyLink = () => {
    if (!job.link) return;
    navigator.clipboard.writeText(job.link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8e1e3c]/10 text-[#8e1e3c]">
                  {job.category || 'Qatar Vacancy'}
                </span>
                {job.salary && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    💰 {job.salary}
                  </span>
                )}
                <span className="text-[11px] text-stone-400 font-medium">
                  {job.date}
                </span>
              </div>
              <h3 className="text-[16px] sm:text-[18px] font-black text-stone-900 leading-snug">
                {job.title}
              </h3>
              <p className="text-[12px] text-stone-500 flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-700">{job.company || 'Qatar Employer'}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{job.location || 'Doha, Qatar'}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm shrink-0 transition-colors cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Job Image if available */}
          {job.img && (
            <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={job.img}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[12px]">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-[#8e1e3c]" />
              <span>Posted: {job.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span className="truncate">{job.company || 'Qatar Living Jobs'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{job.location || 'Doha, Qatar'}</span>
            </div>
            {job.salary && (
              <div className="text-emerald-700 font-semibold truncate">
                💰 {job.salary}
              </div>
            )}
          </div>

          {/* Job Description / Snippet */}
          <div>
            <h4 className="text-[13.5px] font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#8e1e3c]" />
              <span>Job Overview &amp; Specifications</span>
            </h4>
            <div className="text-[13px] text-stone-600 bg-stone-50/50 p-3.5 rounded-xl border border-stone-100">
              <SafeHtmlRenderer
                content={job.snippet || 'Full job details, employer requirements, and application procedures are available via the official job link.'}
              />
            </div>
          </div>

          {/* Direct Apply Callout Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-stone-900 text-[13px]">
                Ready to submit your application?
              </p>
              <p className="text-stone-500 text-[11.5px] mt-0.5">
                Apply directly on the employer or Qatar Living listing page.
              </p>
            </div>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl text-[13px] font-black text-white bg-[#8e1e3c] hover:bg-[#72152e] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <span>Apply on Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:px-5 border-t border-stone-200 bg-stone-50 shrink-0 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg text-[12px] font-bold text-white bg-[#25d366] hover:bg-[#20b859] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Job Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl text-[12.5px] font-bold text-white bg-[#8e1e3c] hover:bg-[#72152e] active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 rounded-xl text-[12px] font-semibold text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
