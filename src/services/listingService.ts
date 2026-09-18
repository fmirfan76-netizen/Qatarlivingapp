import { UserListing } from '../types';

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export async function fetchApprovedListings(type?: 'job' | 'mobile'): Promise<UserListing[]> {
  try {
    const url = type ? `/api/listings?type=${type}` : '/api/listings';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.listings || [];
  } catch (err) {
    console.warn('Failed to fetch listings from backend, falling back to local storage:', err);
    try {
      const local = localStorage.getItem('ql_local_listings');
      if (local) {
        const parsed = JSON.parse(local) as UserListing[];
        const filtered = parsed.filter((l) => l.status === 'approved');
        return type ? filtered.filter((l) => l.type === type) : filtered;
      }
    } catch {
      // ignore
    }
    return [];
  }
}

export async function fetchPendingCount(): Promise<number> {
  try {
    const res = await fetch('/api/listings/pending-count');
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.pendingCount === 'number' ? data.pendingCount : 0;
  } catch {
    return 0;
  }
}

export async function submitNewListing(listing: Partial<UserListing>): Promise<{ success: boolean; message: string; listing?: UserListing }> {
  try {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Submission failed');
    }
    return data;
  } catch (err: any) {
    // Fallback: save to localStorage with pending status
    const pendingItem: UserListing = {
      id: `local-ad-${Date.now()}`,
      type: listing.type || 'mobile',
      title: listing.title || 'Untitled',
      categoryOrBrand: listing.categoryOrBrand || 'Other',
      priceOrSalary: listing.priceOrSalary || '0 QAR',
      location: listing.location || 'Qatar',
      condition: listing.condition,
      storage: listing.storage,
      description: listing.description || '',
      contactName: listing.contactName || 'Seller',
      contactPhone: listing.contactPhone || '97400000000',
      contactEmail: listing.contactEmail,
      imageUrl: listing.imageUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    try {
      const local = localStorage.getItem('ql_local_listings');
      const list = local ? JSON.parse(local) : [];
      list.unshift(pendingItem);
      localStorage.setItem('ql_local_listings', JSON.stringify(list));
    } catch {
      // ignore
    }
    return {
      success: true,
      message: 'Your ad has been saved and is pending admin approval.',
      listing: pendingItem
    };
  }
}

export async function fetchAdminListings(pin: string): Promise<{ stats: AdminStats; listings: UserListing[] }> {
  const res = await fetch('/api/admin/listings', {
    headers: { 'x-admin-pin': pin }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid Admin PIN');
  }
  return res.json();
}

export async function updateAdminListing(
  pin: string,
  id: string,
  update: { status?: 'approved' | 'rejected' | 'pending'; featured?: boolean; adminNotes?: string }
): Promise<UserListing> {
  const res = await fetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-pin': pin
    },
    body: JSON.stringify(update)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update listing');
  }
  const result = await res.json();
  return result.listing;
}

export async function deleteAdminListing(pin: string, id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'x-admin-pin': pin }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete listing');
  }
  return true;
}

export async function changeAdminPin(
  currentPin: string,
  newPin: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/change-pin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-pin': currentPin
    },
    body: JSON.stringify({ currentPin, newPin })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to change admin PIN');
  }
  return data;
}

export async function checkAdminPinStatus(): Promise<{ isDefault: boolean }> {
  try {
    const res = await fetch('/api/admin/pin-status');
    if (!res.ok) return { isDefault: false };
    return await res.json();
  } catch {
    return { isDefault: false };
  }
}

