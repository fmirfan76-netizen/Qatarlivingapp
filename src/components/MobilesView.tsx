import React, { useState, useMemo } from 'react';
import { UserListing } from '../types';
import { AdsterraBanner } from './AdsterraBanner';
import { stripHtmlTags, SafeHtmlRenderer } from '../utils/htmlRenderer';
import {
  Smartphone,
  Search,
  X,
  MessageCircle,
  Phone,
  MapPin,
  Tag,
  Plus,
  ShieldCheck,
  Star,
  Sparkles,
  Filter
} from 'lucide-react';

interface MobilesViewProps {
  listings: UserListing[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenPostAd: () => void;
  whatsappAdminNumber?: string;
}

const BRANDS = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'Huawei', 'Other'];

export const MobilesView: React.FC<MobilesViewProps> = ({
  listings,
  isLoading,
  onRefresh,
  onOpenPostAd,
  whatsappAdminNumber
}) => {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);

  // Filter approved mobile phones
  const mobileListings = useMemo(() => {
    return listings.filter((l) => l.type === 'mobile' && l.status === 'approved');
  }, [listings]);

  const filtered = useMemo(() => {
    return mobileListings.filter((item) => {
      const matchBrand =
        selectedBrand === 'All' ||
        item.categoryOrBrand.toLowerCase() === selectedBrand.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.priceOrSalary.toLowerCase().includes(q);

      return matchBrand && matchSearch;
    });
  }, [mobileListings, selectedBrand, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Banner Card with "+ Sell Mobile Phone" Call to Action */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-[#8e1e3c] to-stone-900 text-white p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase text-stone-200 mb-1.5 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Qatar Verified Mobile Classifieds</span>
            </div>
            <h2 className="text-[18px] sm:text-[20px] font-black tracking-tight">
              Buy &amp; Sell Mobile Phones in Qatar
            </h2>
            <p className="text-[12px] sm:text-[13px] text-stone-200 mt-0.5 max-w-md">
              All ads are reviewed and verified by Qatar Living Jobs admin before publishing.
            </p>
          </div>

          <button
            onClick={onOpenPostAd}
            className="self-start sm:self-center py-2.5 px-4 rounded-xl bg-white text-[#8e1e3c] hover:bg-stone-100 active:scale-95 font-extrabold text-[13.5px] shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#8e1e3c]" />
            <span>+ Sell Your Phone</span>
          </button>
        </div>
      </div>

      {/* Search & Brand Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search iPhone 15, Samsung S24, 256GB, Al Sadd..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-[13.5px] focus:outline-none focus:border-[#8e1e3c] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[12px] no-scrollbar">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-[#8e1e3c] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Adsterra Sponsor Banner */}
      <AdsterraBanner
        adKey="43df2ac0cbaf2d78b90c39f9e38fd913"
        width={320}
        height={50}
        label="Qatar Tech Offers &amp; Partner Deals"
      />

      {/* Listings Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-3.5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div
                  onClick={() => setSelectedListing(item)}
                  className="relative mb-2.5 rounded-xl overflow-hidden bg-stone-100 aspect-video flex items-center justify-center cursor-pointer group"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <Smartphone className="w-12 h-12 text-stone-300" />
                  )}

                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-black/70 text-white backdrop-blur-xs">
                      {item.categoryOrBrand}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-500 text-white flex items-center gap-0.5 shadow-xs">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>

                  {item.condition && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-white/90 text-emerald-800 shadow-xs backdrop-blur-xs">
                      {item.condition}
                    </span>
                  )}
                </div>

                {/* Price & Storage */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-black text-[#8e1e3c]">
                    {item.priceOrSalary}
                  </span>
                  {item.storage && (
                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-mono font-bold bg-stone-100 text-stone-700">
                      {item.storage}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => setSelectedListing(item)}
                  className="font-bold text-[14px] text-stone-900 mt-1 line-clamp-2 leading-snug cursor-pointer hover:text-[#8e1e3c] transition-colors"
                >
                  {item.title}
                </h3>

                {/* Location & Seller */}
                <div className="flex items-center gap-2 mt-2 text-[11.5px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span>•</span>
                  <span className="truncate">Seller: {item.contactName}</span>
                </div>

                {/* Short snippet */}
                {item.description && (
                  <p className="text-[11.5px] text-stone-600 mt-1.5 line-clamp-2 bg-stone-50/80 p-2 rounded-lg">
                    {stripHtmlTags(item.description)}
                  </p>
                )}
              </div>

              {/* Action: WhatsApp Chat Button */}
              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center gap-2">
                <a
                  href={`https://wa.me/${item.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${item.contactName}! I am interested in your "${item.title}" for ${item.priceOrSalary} listed on Qatar Living Jobs.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#25d366] hover:bg-[#20b859] active:scale-98 text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat with Seller</span>
                </a>

                <a
                  href={`tel:${item.contactPhone.replace(/[^0-9]/g, '')}`}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                  title="Call Seller"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-stone-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-700 text-[14px]">No mobile listings found</h4>
            <p className="text-[12px] text-stone-400 mt-0.5">
              Be the first to post your iPhone, Samsung, or Xiaomi phone in Qatar!
            </p>
          </div>
          <button
            onClick={onOpenPostAd}
            className="py-2 px-4 rounded-xl bg-[#8e1e3c] text-white font-bold text-[13px] hover:bg-[#72152e] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Mobile Ad (Admin Approval)</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-10 text-stone-400 text-[13px]">
          Loading verified mobile listings...
        </div>
      )}

      {/* Selected Mobile Detail Modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedListing(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative aspect-video w-full bg-stone-900 overflow-hidden shrink-0">
              {selectedListing.imageUrl ? (
                <img
                  src={selectedListing.imageUrl}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                  <Smartphone className="w-12 h-12" />
                  <span className="text-[12px] mt-2">Qatar Mobile Listing</span>
                </div>
              )}

              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-900/85 text-white backdrop-blur-xs">
                  📱 {selectedListing.categoryOrBrand}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-stone-950">
                  {selectedListing.priceOrSalary}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-[17px] font-extrabold text-stone-900 leading-snug">
                  {selectedListing.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[12px] text-stone-500">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {selectedListing.location}
                  </span>
                  <span>•</span>
                  <span>
                    Posted {new Date(selectedListing.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-[12px]">
                <div>
                  <span className="text-stone-400 text-[11px] block">Brand</span>
                  <strong className="text-stone-800">{selectedListing.categoryOrBrand}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Storage</span>
                  <strong className="text-stone-800">{selectedListing.storage || 'Standard'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Condition</span>
                  <strong className="text-emerald-700">{selectedListing.condition || 'Used'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Location</span>
                  <strong className="text-stone-800">{selectedListing.location}</strong>
                </div>
              </div>

              {/* Description */}
              {selectedListing.description && (
                <div>
                  <h4 className="text-[12px] font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Details &amp; Specifications
                  </h4>
                  <div className="text-[13px] text-stone-600 bg-stone-50/50 p-3.5 rounded-lg border border-stone-100">
                    <SafeHtmlRenderer content={selectedListing.description} />
                  </div>
                </div>
              )}

              {/* Contact Seller */}
              <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={`https://wa.me/${selectedListing.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${selectedListing.contactName}! I am interested in your "${selectedListing.title}" (${selectedListing.priceOrSalary}) listed on Qatar Living Jobs app.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-black text-[13.5px] flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedListing.contactPhone.replace(/[^0-9]/g, '')}`}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[13px] flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Seller</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
