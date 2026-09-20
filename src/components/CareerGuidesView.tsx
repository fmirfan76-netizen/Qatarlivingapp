import React, { useState, useMemo } from 'react';
import { CAREER_GUIDES, CareerGuide } from '../data/careerGuidesData';
import { AdBanner } from './AdBanner';
import {
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  Clock,
  Calendar,
  ShieldCheck,
  ChevronRight,
  X,
  Share2,
  FileText
} from 'lucide-react';

export const CareerGuidesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<CareerGuide | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const categories = ['all', 'Labour Law', 'Career Advice', 'Expat Life', 'Job Safety'];

  const filteredGuides = useMemo(() => {
    return CAREER_GUIDES.filter((guide) => {
      const matchesCategory =
        selectedCategory === 'all' || guide.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.excerpt.toLowerCase().includes(q) ||
        guide.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (guide: CareerGuide) => {
    const shareUrl = `${window.location.origin}/#guide-${guide.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: guide.title,
          text: guide.excerpt,
          url: shareUrl
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${guide.title}\n${shareUrl}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-[#4a0d1e] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-stone-950">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Qatar Career &amp; Labour Knowledge Base</span>
          </div>
          <h2 className="text-[20px] sm:text-[22px] font-extrabold leading-tight tracking-tight">
            Qatar Labour Law &amp; Expat Career Guides
          </h2>
          <p className="text-[12.5px] text-stone-300 leading-relaxed max-w-lg">
            Essential editorial guides covering Qatar Labour Law No. 14 of 2004, End of Service Gratuity calculations, employer transfers without NOC, and job scam protection.
          </p>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Qatar labour rules, gratuity, notice periods..."
            className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#8e1e3c] shadow-2xs placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8e1e3c] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? '📚 All Guides' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* AdSense Compliant Banner */}
      <AdBanner
        client="ca-pub-5776525398556337"
        format="auto"
        label="Qatar Labour Advisory Sponsor"
      />

      {/* Guides List */}
      <div className="space-y-3">
        {filteredGuides.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
            <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="font-bold text-[14px]">No articles found matching "{searchQuery}"</p>
            <p className="text-[12px] text-stone-400 mt-1">Try searching for "gratuity", "visa", or "notice".</p>
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <article
              key={guide.id}
              onClick={() => setActiveGuide(guide)}
              className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-[#8e1e3c]/40 hover:shadow-md transition-all cursor-pointer group space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#8e1e3c]/10 text-[#8e1e3c]">
                  {guide.category}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.readTime}
                  </span>
                  <span>•</span>
                  <span>{guide.publishedDate}</span>
                </div>
              </div>

              <h3 className="text-[15px] sm:text-[16px] font-bold text-stone-900 group-hover:text-[#8e1e3c] transition-colors leading-snug">
                {guide.title}
              </h3>

              <p className="text-[12.5px] text-stone-600 leading-relaxed line-clamp-2">
                {guide.excerpt}
              </p>

              {/* Highlights pills */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                {guide.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{takeaway}</span>
                  </span>
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between text-[11.5px] font-bold text-[#8e1e3c]">
                <span>Read Full Law &amp; FAQs</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))
        )}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveGuide(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#8e1e3c] to-[#6b142c] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase">
                  {activeGuide.category}
                </span>
                <span className="text-[11.5px] text-white/80">
                  {activeGuide.readTime}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleShare(activeGuide)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveGuide(null)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {shareSuccess && (
              <div className="bg-emerald-600 text-white text-center py-1 text-[11px] font-bold">
                Link copied to clipboard!
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-stone-800">
              <div>
                <h2 className="text-[18px] sm:text-[21px] font-black text-stone-900 leading-snug">
                  {activeGuide.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-stone-500">
                  <span>Published by {activeGuide.author}</span>
                  <span>•</span>
                  <span>{activeGuide.publishedDate}</span>
                </div>
              </div>

              {/* Key Takeaways Box */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[12.5px] text-amber-950 space-y-1.5">
                <div className="font-extrabold text-[13px] text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  <span>Key Statutory Takeaways</span>
                </div>
                <ul className="space-y-1 pl-1 text-amber-900/90">
                  {activeGuide.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Content Rendered */}
              <div
                className="article-content space-y-3 text-[13px] sm:text-[13.5px] text-stone-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeGuide.content }}
              />

              {/* In-Article AdSense Banner */}
              <AdBanner
                client="ca-pub-5776525398556337"
                format="auto"
                label="Sponsored Career Partner"
              />

              {/* FAQs Section */}
              {activeGuide.faqs && activeGuide.faqs.length > 0 && (
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <h3 className="text-[15px] font-extrabold text-stone-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#8e1e3c]" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <div className="space-y-2.5">
                    {activeGuide.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-[12.5px]"
                      >
                        <strong className="block text-stone-900 mb-1">
                          Q: {faq.question}
                        </strong>
                        <p className="text-stone-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-stone-500">
                Qatar Labour Law Advisory &amp; Verified Resources
              </span>
              <button
                onClick={() => setActiveGuide(null)}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-[12px] font-bold cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
