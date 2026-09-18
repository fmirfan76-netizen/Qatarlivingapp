import { Job, AppSettings } from '../types';
import { FALLBACK_JOBS } from '../data/fallbackJobs';

export async function syncAppConfigFromBloggerPage(): Promise<Partial<AppSettings> | null> {
  try {
    const res = await fetch('/api/sync-app');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.config) {
        return {
          blogUrl: data.config.blogUrl,
          whatsappNumber: data.config.whatsappNumber,
          paymentUrl: data.config.paymentUrl,
          apkUrl: data.config.apkUrl,
          lastSynced: data.config.lastSynced,
          sourcePage: data.source
        };
      }
    }
  } catch (err) {
    console.warn('Could not sync config from server API:', err);
  }
  return null;
}

export async function fetchJobsFromBlogger(blogUrl: string): Promise<Job[]> {
  // 1. Try server proxy endpoint first (bypasses browser CORS & AdBlock completely)
  try {
    const apiRes = await fetch('/api/jobs');
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        return data.jobs;
      }
    }
  } catch (err) {
    console.warn('Server proxy /api/jobs not reachable, trying JSONP...', err);
  }

  // 2. Fallback to client-side JSONP
  const cleanUrl = blogUrl.replace(/\/+$/, '');
  const feedUrl = `${cleanUrl}/feeds/posts/default?alt=json-in-script&max-results=150`;

  return new Promise((resolve) => {
    const callbackName = `gotJobs_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const scriptId = 'jsonpScript';

    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }

    let resolved = false;

    // Safety timeout in case JSONP is blocked or Blogger is unreachable
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        console.warn('Blogger feed fetch timed out. Using verified Qatar Living jobs.');
        resolve(FALLBACK_JOBS);
      }
    }, 4000);

    const cleanup = () => {
      clearTimeout(timeout);
      const s = document.getElementById(scriptId);
      if (s) s.remove();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[callbackName];
    };

    // Define JSONP callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[callbackName] = (json: any) => {
      if (resolved) return;
      resolved = true;
      cleanup();

      try {
        const entries = json?.feed?.entry || [];
        if (!entries || entries.length === 0) {
          resolve(FALLBACK_JOBS);
          return;
        }

        const parsedJobs: Job[] = entries.map((e: any, index: number) => {
          let link = '';
          if (Array.isArray(e.link)) {
            for (let j = 0; j < e.link.length; j++) {
              if (e.link[j].rel === 'alternate') {
                link = e.link[j].href;
                break;
              }
            }
          }
          if (!link && e.link?.[0]?.href) {
            link = e.link[0].href;
          }

          let img = '';
          if (e.media$thumbnail?.url) {
            img = e.media$thumbnail.url.replace(/\/s[0-9]+(-c)?\//, '/w300/');
          }

          const rawContent = (e.summary ? e.summary.$t : (e.content ? e.content.$t : '')) || '';
          const snippet = rawContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 180);

          const title = e.title?.$t || 'Qatar Vacancy';
          const date = e.published?.$t ? e.published.$t.substring(0, 10) : new Date().toISOString().substring(0, 10);

          const tLower = title.toLowerCase();
          let category = 'General';
          if (tLower.includes('driver')) category = 'Driver';
          else if (tLower.includes('wait') || tLower.includes('chef') || tLower.includes('cook') || tLower.includes('barista') || tLower.includes('hotel')) category = 'Hospitality';
          else if (tLower.includes('nurse') || tLower.includes('medic') || tLower.includes('doctor') || tLower.includes('clinic')) category = 'Healthcare';
          else if (tLower.includes('engineer') || tLower.includes('civil') || tLower.includes('electric') || tLower.includes('technician')) category = 'Engineering';
          else if (tLower.includes('sales') || tLower.includes('cashier') || tLower.includes('retail')) category = 'Sales';
          else if (tLower.includes('secur')) category = 'Security';
          else if (tLower.includes('account') || tLower.includes('finance')) category = 'Finance';
          else if (tLower.includes('reception') || tLower.includes('admin') || tLower.includes('secretary')) category = 'Admin';

          return {
            id: `blogger-${index}-${Date.now()}`,
            title,
            link: link || cleanUrl,
            img: img || undefined,
            date,
            snippet,
            category,
            location: 'Qatar',
            company: 'Qatar Living Jobs'
          };
        });

        resolve(parsedJobs.length > 0 ? parsedJobs : FALLBACK_JOBS);
      } catch (err) {
        console.error('Error parsing Blogger feed:', err);
        resolve(FALLBACK_JOBS);
      }
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `${feedUrl}&callback=${callbackName}`;
    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        console.warn('Script onerror triggered for Blogger feed. Falling back to cached jobs.');
        resolve(FALLBACK_JOBS);
      }
    };

    document.body.appendChild(script);
  });
}
