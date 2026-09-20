import React, { useState, useMemo } from 'react';
import { UserListing, ListingType } from '../types';
import { AdsterraBanner } from './AdsterraBanner';
import { stripHtmlTags, SafeHtmlRenderer } from '../utils/htmlRenderer';
import {
  Smartphone,
  Car,
  Home,
  Briefcase,
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
  Filter,
  Check,
  Zap,
  Gauge,
  Calendar,
  Layers,
  Trash2
} from 'lucide-react';

interface ClassifiedsViewProps {
  listings: UserListing[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenPostAd: (defaultType?: ListingType) => void;
  initialCategory?: 'all' | 'vehicle' | 'room' | 'mobile' | 'job';
  whatsappAdminNumber?: string;
  onOpenAdmin?: () => void;
}

const VEHICLE_BRANDS = ['All', 'Toyota', 'Nissan', 'Hyundai', 'Kia', 'Lexus', 'Honda', 'Ford', 'Mitsubishi', 'Other'];
const ROOM_TYPES = ['All', 'Bed Space', 'Single Room', 'Master Bedroom', 'Studio', 'Partition Room'];
const MOBILE_BRANDS = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'Huawei', 'Other'];

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({
  listings,
  isLoading,
  onRefresh,
  onOpenPostAd,
  initialCategory = 'all',
  whatsappAdminNumber,
  onOpenAdmin
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vehicle' | 'room' | 'mobile' | 'job'>(initialCategory);
  const [subFilter, setSubFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);

  // Sync when initialCategory prop changes
  React.useEffect(() => {
    setActiveCategory(initialCategory);
    setSubFilter('All');
  }, [initialCategory]);

  // Only approved listings
  const approvedListings = useMemo(() => {
    return listings.filter((l) => l.status === 'approved');
  }, [listings]);

  // Group approved listings by type so they are NEVER mixed together
  const vehicles = useMemo(() => approvedListings.filter((l) => l.type === 'vehicle'), [approvedListings]);
  const rooms = useMemo(() => approvedListings.filter((l) => l.type === 'room'), [approvedListings]);
  const mobiles = useMemo(() => approvedListings.filter((l) => l.type === 'mobile'), [approvedListings]);
  const jobs = useMemo(() => approvedListings.filter((l) => l.type === 'job'), [approvedListings]);

  // Filter helper for sub-filter & search
  const filterList = (items: UserListing[]) => {
    return items.filter((item) => {
      let matchSub = true;
      if (subFilter !== 'All') {
        if (item.type === 'vehicle') {
          matchSub =
            item.categoryOrBrand.toLowerCase() === subFilter.toLowerCase() ||
            item.subCategory?.toLowerCase() === subFilter.toLowerCase();
        } else if (item.type === 'room') {
          matchSub =
            item.categoryOrBrand.toLowerCase() === subFilter.toLowerCase() ||
            item.subCategory?.toLowerCase() === subFilter.toLowerCase();
        } else if (item.type === 'mobile') {
          matchSub = item.categoryOrBrand.toLowerCase() === subFilter.toLowerCase();
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.priceOrSalary.toLowerCase().includes(q) ||
        item.categoryOrBrand.toLowerCase().includes(q);

      return matchSub && matchSearch;
    });
  };

  const filteredVehicles = useMemo(() => filterList(vehicles), [vehicles, subFilter, searchQuery]);
  const filteredRooms = useMemo(() => filterList(rooms), [rooms, subFilter, searchQuery]);
  const filteredMobiles = useMemo(() => filterList(mobiles), [mobiles, subFilter, searchQuery]);
  const filteredJobs = useMemo(() => filterList(jobs), [jobs, subFilter, searchQuery]);

  // Render listing card
  const renderListingCard = (item: UserListing) => {
    const isVehicle = item.type === 'vehicle';
    const isRoom = item.type === 'room';
    const isMobile = item.type === 'mobile';
    const isJob = item.type === 'job';

    return (
      <div
        key={item.id}
        onClick={() => setSelectedListing(item)}
        className="bg-white rounded-xl border border-stone-200 hover:border-stone-400 p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div>
          {/* Top image & badges */}
          <div className="relative mb-3 rounded-lg overflow-hidden bg-stone-100 aspect-16/10">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
                {isVehicle && <Car className="w-10 h-10 mb-1 text-stone-300" />}
                {isRoom && <Home className="w-10 h-10 mb-1 text-stone-300" />}
                {isMobile && <Smartphone className="w-10 h-10 mb-1 text-stone-300" />}
                {isJob && <Briefcase className="w-10 h-10 mb-1 text-stone-300" />}
                <span className="text-[11px] font-medium">Qatar Verified Ad</span>
              </div>
            )}

            {/* Category Pill Tag */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              {isVehicle && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
                  <Car className="w-3 h-3" /> Vehicle
                </span>
              )}
              {isRoom && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                  <Home className="w-3 h-3" /> Room / Bed Space
                </span>
              )}
              {isMobile && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> Mobile
                </span>
              )}
              {isJob && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Job
                </span>
              )}

              {item.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 shadow-xs flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" /> Featured
                </span>
              )}
            </div>

            {/* Price pill */}
            <div className="absolute bottom-2 right-2 bg-stone-900/90 backdrop-blur-xs text-amber-300 px-2.5 py-0.5 rounded-md text-[12px] font-black shadow-md">
              {item.priceOrSalary}
            </div>
          </div>

          {/* Title */}
          <h4 className="font-bold text-[14.5px] text-stone-900 leading-snug line-clamp-2 group-hover:text-[#8e1e3c] transition-colors">
            {item.title}
          </h4>

          {/* Specific Meta Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {isVehicle && (
              <>
                {item.yearModel && (
                  <span className="text-[10.5px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.yearModel}
                  </span>
                )}
                {item.mileage && (
                  <span className="text-[10.5px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> {item.mileage}
                  </span>
                )}
                {item.condition && (
                  <span className="text-[10.5px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    {item.condition}
                  </span>
                )}
              </>
            )}

            {isRoom && (
              <>
                <span className="text-[10.5px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                  {item.categoryOrBrand}
                </span>
                {item.furnished && (
                  <span className="text-[10.5px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {item.furnished}
                  </span>
                )}
                {item.utilitiesIncluded && (
                  <span className="text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <Zap className="w-3 h-3 text-amber-500" /> Free Kahramaa &amp; WiFi
                  </span>
                )}
              </>
            )}

            {isMobile && (
              <>
                <span className="text-[10.5px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                  {item.categoryOrBrand}
                </span>
                {item.storage && (
                  <span className="text-[10.5px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {item.storage}
                  </span>
                )}
                {item.condition && (
                  <span className="text-[10.5px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    {item.condition}
                  </span>
                )}
              </>
            )}

            {isJob && (
              <span className="text-[10.5px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                {item.categoryOrBrand}
              </span>
            )}
          </div>

          {/* Description snippet */}
          {item.description && (
            <p className="text-[12px] text-stone-500 mt-2 line-clamp-2">
              {stripHtmlTags(item.description)}
            </p>
          )}
        </div>

        {/* Card Footer: Location & WhatsApp Button */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAdmin();
                }}
                title="Admin: Delete or moderate this post"
                className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            <a
              href={`https://wa.me/${item.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi ${item.contactName}! I saw your ad "${item.title}" on Qatar Living Jobs app.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 rounded-md bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>Chat</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-[#8e1e3c] to-stone-900 text-white p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase text-stone-200 mb-1.5 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Verified Qatar Classifieds</span>
            </div>
            <h2 className="text-[18px] sm:text-[21px] font-black tracking-tight">
              Vehicles, Rooms, Bed Space &amp; Mobiles
            </h2>
            <p className="text-[12px] sm:text-[13px] text-stone-200 mt-0.5 max-w-md">
              All ads are separated by category and moderated by admin before publishing.
            </p>
          </div>

          <button
            onClick={() => onOpenPostAd()}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-[13px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Post Your Ad</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Pills (Separated by Category) */}
      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setActiveCategory('all');
              setSubFilter('All');
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#8e1e3c] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories (Separated)</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('vehicle');
              setSubFilter('All');
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'vehicle'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>🚗 Vehicles &amp; Cars ({vehicles.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('room');
              setSubFilter('All');
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'room'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>🛏️ Rooms &amp; Bed Space ({rooms.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('mobile');
              setSubFilter('All');
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'mobile'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Mobiles ({mobiles.length})</span>
          </button>
        </div>

        {/* Sub-Filters for active category */}
        {activeCategory === 'vehicle' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100 mt-2">
            <span className="text-[11px] font-bold text-stone-500 shrink-0 mr-1">Car Make:</span>
            {VEHICLE_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSubFilter(brand)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  subFilter === brand
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'room' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100 mt-2">
            <span className="text-[11px] font-bold text-stone-500 shrink-0 mr-1">Room Type:</span>
            {ROOM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSubFilter(type)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  subFilter === type
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'mobile' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100 mt-2">
            <span className="text-[11px] font-bold text-stone-500 shrink-0 mr-1">Brand:</span>
            {MOBILE_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSubFilter(brand)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  subFilter === brand
                    ? 'bg-purple-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeCategory === 'vehicle'
              ? 'Search cars (e.g. Land Cruiser, Sunny, Nissan)...'
              : activeCategory === 'room'
              ? 'Search rooms (e.g. Mansoura, Bed Space, Al Sadd)...'
              : activeCategory === 'mobile'
              ? 'Search mobile phones (e.g. iPhone 15, S24 Ultra)...'
              : 'Search vehicles, rooms, bed space, or mobile phones...'
          }
          className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#8e1e3c] focus:ring-1 focus:ring-[#8e1e3c] shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ads Separated by Title */}
      {/* 1. VEHICLES SECTION */}
      {(activeCategory === 'all' || activeCategory === 'vehicle') && (
        <section className="space-y-3 pt-2">
          {/* Section Header Title */}
          <div className="flex items-center justify-between pb-1 border-b-2 border-amber-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-2xs">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[16px] text-stone-900 tracking-tight">
                🚗 Vehicles &amp; Cars for Sale / Rent
              </h3>
              <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                {filteredVehicles.length} Ads
              </span>
            </div>
            <button
              onClick={() => onOpenPostAd('vehicle')}
              className="text-[11.5px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Post Vehicle
            </button>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-dashed border-stone-200 text-center">
              <Car className="w-8 h-8 text-stone-300 mx-auto mb-1" />
              <p className="text-[13px] text-stone-500 font-medium">No vehicles found in this filter.</p>
              <button
                onClick={() => onOpenPostAd('vehicle')}
                className="mt-2 px-3 py-1 bg-amber-500 text-stone-950 font-bold text-[11.5px] rounded-lg cursor-pointer"
              >
                + Post Your Car Ad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredVehicles.map(renderListingCard)}
            </div>
          )}
        </section>
      )}

      {/* 2. ROOMS & BED SPACE SECTION */}
      {(activeCategory === 'all' || activeCategory === 'room') && (
        <section className="space-y-3 pt-4">
          {/* Section Header Title */}
          <div className="flex items-center justify-between pb-1 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-2xs">
                <Home className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[16px] text-stone-900 tracking-tight">
                🛏️ Rooms &amp; Bed Space for Rent in Qatar
              </h3>
              <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900">
                {filteredRooms.length} Ads
              </span>
            </div>
            <button
              onClick={() => onOpenPostAd('room')}
              className="text-[11.5px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Post Room
            </button>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-dashed border-stone-200 text-center">
              <Home className="w-8 h-8 text-stone-300 mx-auto mb-1" />
              <p className="text-[13px] text-stone-500 font-medium">No rooms or bed spaces found in this filter.</p>
              <button
                onClick={() => onOpenPostAd('room')}
                className="mt-2 px-3 py-1 bg-emerald-600 text-white font-bold text-[11.5px] rounded-lg cursor-pointer"
              >
                + Post Bed Space / Room Ad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredRooms.map(renderListingCard)}
            </div>
          )}
        </section>
      )}

      {/* Adsterra Mobile Banner 320x50 between sections */}
      <AdsterraBanner />

      {/* 3. MOBILES SECTION */}
      {(activeCategory === 'all' || activeCategory === 'mobile') && (
        <section className="space-y-3 pt-4">
          {/* Section Header Title */}
          <div className="flex items-center justify-between pb-1 border-b-2 border-purple-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold shadow-2xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[16px] text-stone-900 tracking-tight">
                📱 Mobile Phones &amp; Tablets
              </h3>
              <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900">
                {filteredMobiles.length} Ads
              </span>
            </div>
            <button
              onClick={() => onOpenPostAd('mobile')}
              className="text-[11.5px] font-bold text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Sell Mobile
            </button>
          </div>

          {filteredMobiles.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-dashed border-stone-200 text-center">
              <Smartphone className="w-8 h-8 text-stone-300 mx-auto mb-1" />
              <p className="text-[13px] text-stone-500 font-medium">No mobile phones found in this filter.</p>
              <button
                onClick={() => onOpenPostAd('mobile')}
                className="mt-2 px-3 py-1 bg-purple-600 text-white font-bold text-[11.5px] rounded-lg cursor-pointer"
              >
                + Post Mobile Ad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredMobiles.map(renderListingCard)}
            </div>
          )}
        </section>
      )}

      {/* Ad Detail Modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
              {selectedListing.imageUrl ? (
                <img
                  src={selectedListing.imageUrl}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                  {selectedListing.type === 'vehicle' && <Car className="w-12 h-12" />}
                  {selectedListing.type === 'room' && <Home className="w-12 h-12" />}
                  {selectedListing.type === 'mobile' && <Smartphone className="w-12 h-12" />}
                  {selectedListing.type === 'job' && <Briefcase className="w-12 h-12" />}
                  <span className="text-[12px] mt-2">Qatar Living Verified Ad</span>
                </div>
              )}

              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-900/85 text-white backdrop-blur-xs">
                  {selectedListing.type === 'vehicle' && '🚗 Vehicle'}
                  {selectedListing.type === 'room' && '🛏️ Room / Bed Space'}
                  {selectedListing.type === 'mobile' && '📱 Mobile Phone'}
                  {selectedListing.type === 'job' && '💼 Job Vacancy'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-stone-950">
                  {selectedListing.priceOrSalary}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 space-y-4">
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

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-[12px]">
                {selectedListing.type === 'vehicle' && (
                  <>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Make / Brand</span>
                      <strong className="text-stone-800">{selectedListing.categoryOrBrand}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Model Year</span>
                      <strong className="text-stone-800">{selectedListing.yearModel || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Mileage</span>
                      <strong className="text-stone-800">{selectedListing.mileage || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Condition</span>
                      <strong className="text-stone-800">{selectedListing.condition || 'Used'}</strong>
                    </div>
                  </>
                )}

                {selectedListing.type === 'room' && (
                  <>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Room Type</span>
                      <strong className="text-stone-800">{selectedListing.categoryOrBrand}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Furnishing</span>
                      <strong className="text-stone-800">{selectedListing.furnished || 'Furnished'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 text-[11px] block">Utilities (Water/Electricity/WiFi)</span>
                      <strong className="text-emerald-700">
                        {selectedListing.utilitiesIncluded ? '✅ Included in Rent' : 'Excluded'}
                      </strong>
                    </div>
                  </>
                )}

                {selectedListing.type === 'mobile' && (
                  <>
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
                      <strong className="text-stone-800">{selectedListing.condition || 'Used'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">City</span>
                      <strong className="text-stone-800">{selectedListing.location}</strong>
                    </div>
                  </>
                )}

                {selectedListing.type === 'job' && (
                  <>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Role / Category</span>
                      <strong className="text-stone-800">{selectedListing.categoryOrBrand}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Salary Offered</span>
                      <strong className="text-[#8e1e3c] font-black">{selectedListing.priceOrSalary}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Company / Recruiter</span>
                      <strong className="text-stone-800">{selectedListing.contactName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[11px] block">Location</span>
                      <strong className="text-stone-800">{selectedListing.location}</strong>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              {selectedListing.description && (
                <div>
                  <h4 className="text-[12px] font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Description &amp; Details
                  </h4>
                  <div className="text-[13px] text-stone-600 bg-stone-50/50 p-3.5 rounded-lg border border-stone-100">
                    <SafeHtmlRenderer content={selectedListing.description} />
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={`https://wa.me/${selectedListing.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${selectedListing.contactName}! I am contacting you regarding your ad "${selectedListing.title}" (${selectedListing.priceOrSalary}) on Qatar Living Jobs app.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-black text-[13.5px] flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedListing.contactPhone.replace(/[^0-9]/g, '')}`}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedListing.contactPhone}</span>
                </a>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      onOpenAdmin();
                    }}
                    title="Admin Moderation: Delete this approved or pending listing"
                    className="py-3 px-3 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Admin Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
