import React, { useState } from 'react';
import { LEGAL_DOCUMENTS, LegalDocument } from '../data/legalPoliciesData';
import {
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  AlertTriangle,
  Cookie,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: 'privacy' | 'terms' | 'about' | 'contact' | 'anti-scam' | 'cookie';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDocId = 'privacy'
}) => {
  const [activeDocId, setActiveDocId] = useState<'privacy' | 'terms' | 'about' | 'contact' | 'anti-scam' | 'cookie'>(initialDocId);

  // Sync when reopened with different initialDocId
  React.useEffect(() => {
    if (initialDocId) {
      setActiveDocId(initialDocId);
    }
  }, [initialDocId]);

  if (!isOpen) return null;

  const currentDoc: LegalDocument = LEGAL_DOCUMENTS[activeDocId] || LEGAL_DOCUMENTS.privacy;

  const navItems = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'about', label: 'About Us', icon: HelpCircle },
    { id: 'contact', label: 'Contact & Support', icon: Mail },
    { id: 'anti-scam', label: 'Anti-Scam Advisory', icon: AlertTriangle },
    { id: 'cookie', label: 'Cookie Policy', icon: Cookie }
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8e1e3c] to-[#6b142c] p-4 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold leading-tight">
                Qatar Living Jobs — Trust &amp; Legal Center
              </h2>
              <p className="text-[11px] text-white/80">
                Official Policies, AdSense Disclosures &amp; Terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-stone-100 p-2 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDocId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveDocId(item.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8e1e3c] text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Document Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800">
          {/* Doc Title & Meta */}
          <div className="border-b border-stone-200 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                {currentDoc.badge}
              </span>
              <span className="text-[11.5px] text-stone-400">
                Last updated: {currentDoc.lastUpdated}
              </span>
            </div>
            <h3 className="text-[20px] font-extrabold text-stone-900 leading-snug">
              {currentDoc.title}
            </h3>
            <p className="text-[13px] text-stone-600 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
              {currentDoc.summary}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {currentDoc.sections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[14px] font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8e1e3c] shrink-0" />
                  <span>{sec.heading}</span>
                </h4>
                <div className="text-[13px] text-stone-700 leading-relaxed whitespace-pre-line pl-5.5">
                  {sec.body}
                </div>
              </div>
            ))}
          </div>

          {/* Specific AdSense Google Ad Choices Box if on privacy page */}
          {activeDocId === 'privacy' && (
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-[12px] text-blue-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google AdSense Opt-Out &amp; Privacy Links:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-blue-950"
                  >
                    Google Ads Settings (Manage personalized ads preferences)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-blue-950"
                  >
                    Digital Advertising Alliance (aboutads.info opt-out)
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-blue-950"
                  >
                    How Google uses data when you use our partners' sites or apps
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-stone-500">
            Qatar Living Jobs • Publisher ID: <code className="font-mono text-stone-700">ca-pub-5776525398556337</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-[12px] font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
