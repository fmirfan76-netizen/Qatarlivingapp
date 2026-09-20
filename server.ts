import express from "express";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface SyncedConfig {
  blogUrl: string;
  whatsappNumber: string;
  paymentUrl: string;
  apkUrl: string;
  lastSynced: string;
  announcement?: string;
}

let cachedConfig: SyncedConfig = {
  blogUrl: "https://www.qatarlivingjobs1.com",
  whatsappNumber: "97400000000",
  paymentUrl: "",
  apkUrl: "/api/download/apk",
  lastSynced: new Date().toISOString()
};

function fetchUrl(targetUrl: string, maxRedirects = 3): Promise<string> {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error("Too many redirects"));
    }

    const client = targetUrl.startsWith("https") ? https : http;
    const req = client.get(
      targetUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        timeout: 8000
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          return resolve(fetchUrl(redirectUrl, maxRedirects - 1));
        }

        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
          return reject(new Error(`Status code ${res.statusCode}`));
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function syncAppFromBlogger(): Promise<SyncedConfig> {
  try {
    const pageUrl = "https://www.qatarlivingjobs1.com/p/app.html";
    const html = await fetchUrl(pageUrl);

    // Extract settings defined on app.html
    const blogMatch = html.match(/var\s+BLOG_URL\s*=\s*["']([^"']+)["']/i);
    const waMatch = html.match(/var\s+WHATSAPP\s*=\s*["']([^"']+)["']/i);
    const paymentMatch = html.match(/var\s+PAYMENT_URL\s*=\s*["']([^"']*)["']/i);

    // Extract potential APK links
    const apkVarMatch = html.match(/var\s+APK_URL\s*=\s*["']([^"']+)["']/i);
    const apkHrefMatch = html.match(/href=["']([^"']+\.apk(?:[^"']*)?)["']/i);
    const downloadLinkMatch = html.match(
      /href=["'](https?:\/\/(?:drive\.google\.com|mediafire\.com|github\.com|dropbox\.com)[^"']+)["']/i
    );

    const blogUrl = blogMatch ? blogMatch[1].trim() : cachedConfig.blogUrl;
    const whatsappNumber = waMatch ? waMatch[1].trim() : cachedConfig.whatsappNumber;
    const paymentUrl = paymentMatch ? paymentMatch[1].trim() : cachedConfig.paymentUrl;
    let apkUrl = "/api/download/apk";
    if (apkHrefMatch && apkHrefMatch[1].trim().endsWith(".apk")) {
      apkUrl = apkHrefMatch[1].trim();
    } else if (apkVarMatch && (apkVarMatch[1].includes(".apk") || apkVarMatch[1].includes("drive.google.com") || apkVarMatch[1].includes("mediafire.com"))) {
      apkUrl = apkVarMatch[1].trim();
    } else if (downloadLinkMatch && (downloadLinkMatch[1].includes(".apk") || downloadLinkMatch[1].includes("drive.google.com") || downloadLinkMatch[1].includes("mediafire.com"))) {
      apkUrl = downloadLinkMatch[1].trim();
    } else if (cachedConfig.apkUrl && !cachedConfig.apkUrl.includes("app.html")) {
      apkUrl = cachedConfig.apkUrl;
    }

    // Extract notice/announcement if present in body
    let announcement = "";
    const noticeMatch = html.match(/class=["'][^"']*notice[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    if (noticeMatch) {
      announcement = noticeMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    cachedConfig = {
      blogUrl,
      whatsappNumber,
      paymentUrl,
      apkUrl,
      lastSynced: new Date().toISOString(),
      announcement: announcement || undefined
    };
  } catch (err) {
    console.warn("Failed to sync directly from app.html, keeping current config:", err);
  }

  return cachedConfig;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Google AdSense ads.txt endpoint
  app.get("/ads.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("google.com, pub-5776525398556337, DIRECT, f08c47fec0942fa0\n");
  });

  // SEO robots.txt endpoint
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(
      `User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nSitemap: https://www.qatarlivingjobs1.com/sitemap.xml\n`
    );
  });

  // SEO sitemap.xml endpoint
  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.sendFile(sitemapPath);
    }
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.qatarlivingjobs1.com/</loc><priority>1.0</priority></url></urlset>`);
  });

  // Dynamic sync endpoint - fetches latest settings from https://www.qatarlivingjobs1.com/p/app.html
  app.get("/api/sync-app", async (_req, res) => {
    try {
      const config = await syncAppFromBlogger();
      res.json({
        success: true,
        source: "https://www.qatarlivingjobs1.com/p/app.html",
        config
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || "Failed to sync app config",
        config: cachedConfig
      });
    }
  });

  // Jobs feed proxy endpoint to eliminate browser CORS/content-security limitations
  app.get("/api/jobs", async (req, res) => {
    try {
      const baseUrl = (cachedConfig.blogUrl || "https://www.qatarlivingjobs1.com").replace(
        /\/+$/,
        ""
      );
      const feedUrl = `${baseUrl}/feeds/posts/default?alt=json&max-results=150`;
      const rawJson = await fetchUrl(feedUrl);
      const json = JSON.parse(rawJson);

      const entries = json?.feed?.entry || [];
      const parsedJobs = entries.map((e: any, index: number) => {
        let link = "";
        if (Array.isArray(e.link)) {
          for (let j = 0; j < e.link.length; j++) {
            if (e.link[j].rel === "alternate") {
              link = e.link[j].href;
              break;
            }
          }
        }
        if (!link && e.link?.[0]?.href) {
          link = e.link[0].href;
        }

        let img = "";
        if (e.media$thumbnail?.url) {
          img = e.media$thumbnail.url.replace(/\/s[0-9]+(-c)?\//, "/w300/");
        }

        const rawContent = (e.summary ? e.summary.$t : e.content ? e.content.$t : "") || "";
        const snippet = rawContent
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim()
          .substring(0, 180);

        const title = e.title?.$t || "Qatar Job Opening";
        const date = e.published?.$t
          ? e.published.$t.substring(0, 10)
          : new Date().toISOString().substring(0, 10);

        const tLower = title.toLowerCase();
        const terms = Array.isArray(e.category) ? e.category.map((c: any) => c.term?.toLowerCase() || "") : [];

        let category = "General";
        if (terms.includes("qatar airways careers") || tLower.includes("airways") || tLower.includes("cabin crew") || tLower.includes("aviation") || tLower.includes("airport")) {
          category = "Qatar Airways";
        } else if (terms.includes("office jobs") || tLower.includes("office") || tLower.includes("clerk") || tLower.includes("reception") || tLower.includes("admin")) {
          category = "Office Jobs";
        } else if (tLower.includes("driver") || terms.includes("driver")) {
          category = "Driver";
        } else if (
          tLower.includes("wait") ||
          tLower.includes("chef") ||
          tLower.includes("cook") ||
          tLower.includes("barista") ||
          tLower.includes("hotel") ||
          tLower.includes("restaurant")
        ) {
          category = "Hospitality";
        } else if (
          tLower.includes("nurse") ||
          tLower.includes("medic") ||
          tLower.includes("doctor") ||
          tLower.includes("clinic") ||
          tLower.includes("pharmacy")
        ) {
          category = "Healthcare";
        } else if (
          tLower.includes("engineer") ||
          tLower.includes("civil") ||
          tLower.includes("electric") ||
          tLower.includes("technician") ||
          tLower.includes("mechanical")
        ) {
          category = "Engineering";
        } else if (
          tLower.includes("sales") ||
          tLower.includes("cashier") ||
          tLower.includes("retail") ||
          tLower.includes("duty free")
        ) {
          category = "Sales";
        } else if (tLower.includes("secur")) {
          category = "Security";
        } else if (tLower.includes("account") || tLower.includes("finance") || tLower.includes("audit")) {
          category = "Finance";
        } else if (
          tLower.includes("reception") ||
          tLower.includes("secretary")
        ) {
          category = "Admin";
        }

        return {
          id: `blogger-post-${index}-${e.id?.$t ? e.id.$t.slice(-8) : index}`,
          title,
          link: link || baseUrl,
          img: img || undefined,
          date,
          snippet,
          category,
          location: "Qatar",
          company: tLower.includes("qatar airways") ? "Qatar Airways" : tLower.includes("qatar duty free") ? "Qatar Duty Free" : "Qatar Living Jobs"
        };
      });

      res.json({
        success: true,
        count: parsedJobs.length,
        jobs: parsedJobs
      });
    } catch (err: any) {
      console.warn("Blogger feed proxy error:", err.message);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to fetch Blogger jobs feed"
      });
    }
  });

  // ==========================================
  // CLASSIFIEDS & JOB POSTINGS MODERATION API
  // ==========================================
  const LISTINGS_FILE = path.join(process.cwd(), "data", "listings.json");
  const ADMIN_CONFIG_FILE = path.join(process.cwd(), "data", "admin_config.json");
  const NOTIFICATIONS_FILE = path.join(process.cwd(), "data", "notifications.json");
  const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");
  const APPLICATIONS_FILE = path.join(process.cwd(), "data", "applications.json");

  function readApplications(): any[] {
    try {
      if (fs.existsSync(APPLICATIONS_FILE)) {
        return JSON.parse(fs.readFileSync(APPLICATIONS_FILE, "utf8"));
      }
    } catch (err) {
      console.warn("Error reading applications:", err);
    }
    return [];
  }

  function writeApplications(apps: any[]): void {
    try {
      const dir = path.dirname(APPLICATIONS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing applications:", err);
    }
  }

  function readNotifications(): any[] {
    try {
      if (fs.existsSync(NOTIFICATIONS_FILE)) {
        return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, "utf8"));
      }
    } catch (err) {
      console.warn("Error reading notifications:", err);
    }
    return [];
  }

  function writeNotifications(notifs: any[]): void {
    try {
      const dir = path.dirname(NOTIFICATIONS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifs, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing notifications:", err);
    }
  }

  function readSubscribers(): any[] {
    try {
      if (fs.existsSync(SUBSCRIBERS_FILE)) {
        return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf8"));
      }
    } catch (err) {
      console.warn("Error reading subscribers:", err);
    }
    return [];
  }

  function writeSubscribers(subs: any[]): void {
    try {
      const dir = path.dirname(SUBSCRIBERS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing subscribers:", err);
    }
  }

  function getAdminPin(): string {
    try {
      if (fs.existsSync(ADMIN_CONFIG_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, "utf8"));
        if (parsed && typeof parsed.adminPin === "string" && parsed.adminPin.trim().length >= 4) {
          return parsed.adminPin.trim();
        }
      }
    } catch (err) {
      console.warn("Error reading admin PIN config:", err);
    }
    return process.env.ADMIN_PIN || "9740";
  }

  function setAdminPin(newPin: string): void {
    try {
      const dir = path.dirname(ADMIN_CONFIG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        ADMIN_CONFIG_FILE,
        JSON.stringify({ adminPin: newPin.trim(), updatedAt: new Date().toISOString() }, null, 2),
        "utf8"
      );
    } catch (err) {
      console.error("Error saving admin PIN config:", err);
    }
  }

  function readListings(): any[] {
    try {
      if (fs.existsSync(LISTINGS_FILE)) {
        const raw = fs.readFileSync(LISTINGS_FILE, "utf8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error reading listings:", e);
    }
    return [];
  }

  function writeListings(listings: any[]): void {
    try {
      const dir = path.dirname(LISTINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing listings:", e);
    }
  }

  // 1. Public: Get Approved Listings
  app.get("/api/listings", (req, res) => {
    const { type } = req.query;
    const all = readListings();
    let approved = all.filter((item) => item.status === "approved");

    if (type && type !== "all") {
      approved = approved.filter((item) => item.type === type);
    }

    // Sort: featured first, then newest
    approved.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({
      success: true,
      count: approved.length,
      listings: approved
    });
  });

  // 1.1 Public: Get count of pending listings (for badge display without keeping admin PIN in browser)
  app.get("/api/listings/pending-count", (_req, res) => {
    const all = readListings();
    const count = all.filter((item) => item.status === "pending").length;
    res.json({
      success: true,
      pendingCount: count
    });
  });

  // 2. Public: Submit a new ad (Job, Mobile, Vehicle, Room/Bed Space) - always marked as "pending"
  app.post("/api/listings", (req, res) => {
    try {
      const {
        type,
        title,
        categoryOrBrand,
        priceOrSalary,
        location,
        condition,
        storage,
        subCategory,
        mileage,
        yearModel,
        furnished,
        utilitiesIncluded,
        description,
        contactName,
        contactPhone,
        contactEmail,
        imageUrl
      } = req.body;

      if (!title || !priceOrSalary || !contactPhone) {
        return res.status(400).json({
          success: false,
          error: "Title, price/salary, and WhatsApp contact phone are required."
        });
      }

      const validTypes = ["job", "mobile", "vehicle", "room"];
      const resolvedType = validTypes.includes(type) ? type : "mobile";

      const all = readListings();
      const newListing = {
        id: `ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: resolvedType,
        title: String(title).trim(),
        categoryOrBrand: categoryOrBrand ? String(categoryOrBrand).trim() : (resolvedType === "job" ? "General" : "Other"),
        priceOrSalary: String(priceOrSalary).trim(),
        location: location ? String(location).trim() : "Qatar",
        condition: condition ? String(condition).trim() : undefined,
        storage: storage ? String(storage).trim() : undefined,
        subCategory: subCategory ? String(subCategory).trim() : undefined,
        mileage: mileage ? String(mileage).trim() : undefined,
        yearModel: yearModel ? String(yearModel).trim() : undefined,
        furnished: furnished ? String(furnished).trim() : undefined,
        utilitiesIncluded: Boolean(utilitiesIncluded),
        description: description ? String(description).trim() : "",
        contactName: contactName ? String(contactName).trim() : "Seller / Employer",
        contactPhone: String(contactPhone).replace(/[^0-9]/g, ""),
        contactEmail: contactEmail ? String(contactEmail).trim() : undefined,
        imageUrl: imageUrl || undefined,
        status: "pending", // strictly pending admin permission
        createdAt: new Date().toISOString()
      };

      all.unshift(newListing);
      writeListings(all);

      res.json({
        success: true,
        message: "Your ad has been submitted! It will appear after admin approval.",
        listing: newListing
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Failed to submit listing"
      });
    }
  });

  // 3. Admin: Get all listings including pending, approved, rejected
  app.get("/api/admin/listings", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const all = readListings();
    const stats = {
      total: all.length,
      pending: all.filter((l) => l.status === "pending").length,
      approved: all.filter((l) => l.status === "approved").length,
      rejected: all.filter((l) => l.status === "rejected").length
    };

    res.json({
      success: true,
      stats,
      listings: all
    });
  });

  // 4. Admin: Update listing status (Approve, Reject, Feature)
  app.patch("/api/admin/listings/:id", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const { id } = req.params;
    const { status, featured, adminNotes } = req.body;

    const all = readListings();
    const index = all.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    if (status) {
      all[index].status = status;
      // If approved, automatically broadcast notification to all app users
      if (status === "approved") {
        const item = all[index];
        const typeLabel = item.type === "vehicle" ? "🚗 Vehicle" : item.type === "room" ? "🛏️ Room / Bed Space" : item.type === "job" ? "💼 Job" : "📱 Mobile";
        const newNotif = {
          id: `notif-appr-${Date.now()}`,
          title: `New ${typeLabel} Ad Approved!`,
          body: `${item.title} (${item.priceOrSalary}) in ${item.location}`,
          date: new Date().toISOString(),
          type: "classified",
          actionUrl: item.type === "vehicle" ? "vehicles" : item.type === "room" ? "rooms" : item.type === "job" ? "jobs" : "mobiles"
        };
        const notifs = readNotifications();
        notifs.unshift(newNotif);
        if (notifs.length > 50) notifs.pop();
        writeNotifications(notifs);
      }
    }
    if (featured !== undefined) all[index].featured = Boolean(featured);
    if (adminNotes !== undefined) all[index].adminNotes = String(adminNotes);

    writeListings(all);

    res.json({
      success: true,
      listing: all[index]
    });
  });

  // 5. Admin: Delete a listing
  app.delete("/api/admin/listings/:id", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const { id } = req.params;
    let all = readListings();
    const initialLen = all.length;
    all = all.filter((l) => l.id !== id);

    if (all.length === initialLen) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    writeListings(all);
    res.json({ success: true, message: "Listing deleted successfully" });
  });

  // 5b. Admin: Directly post an ad with HTML / Compose rich description
  app.post("/api/admin/create-ad", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    try {
      const {
        type,
        title,
        categoryOrBrand,
        priceOrSalary,
        location,
        condition,
        storage,
        subCategory,
        mileage,
        yearModel,
        furnished,
        utilitiesIncluded,
        description,
        contactName,
        contactPhone,
        contactEmail,
        imageUrl,
        featured,
        status
      } = req.body || {};

      if (!title || !priceOrSalary) {
        return res.status(400).json({
          success: false,
          error: "Title and price/salary are required."
        });
      }

      const validTypes = ["job", "mobile", "vehicle", "room"];
      const resolvedType = validTypes.includes(type) ? type : "job";

      const all = readListings();
      const newListing = {
        id: `admin-ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: resolvedType,
        title: String(title).trim(),
        categoryOrBrand: categoryOrBrand ? String(categoryOrBrand).trim() : (resolvedType === "job" ? "General" : "Other"),
        priceOrSalary: String(priceOrSalary).trim(),
        location: location ? String(location).trim() : "Doha, Qatar",
        condition: condition ? String(condition).trim() : undefined,
        storage: storage ? String(storage).trim() : undefined,
        subCategory: subCategory ? String(subCategory).trim() : undefined,
        mileage: mileage ? String(mileage).trim() : undefined,
        yearModel: yearModel ? String(yearModel).trim() : undefined,
        furnished: furnished ? String(furnished).trim() : undefined,
        utilitiesIncluded: Boolean(utilitiesIncluded),
        description: description ? String(description).trim() : "",
        contactName: contactName ? String(contactName).trim() : "Qatar Living Admin",
        contactPhone: contactPhone ? String(contactPhone).replace(/[^0-9]/g, "") : "97400000000",
        contactEmail: contactEmail ? String(contactEmail).trim() : undefined,
        imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
        status: status === "pending" ? "pending" : "approved",
        featured: Boolean(featured),
        createdAt: new Date().toISOString(),
        adminNotes: "Created directly by Admin with rich HTML / Compose view"
      };

      all.unshift(newListing);
      writeListings(all);

      // Auto-broadcast if approved live
      if (newListing.status === "approved") {
        const typeLabel = resolvedType === "vehicle" ? "🚗 Vehicle" : resolvedType === "room" ? "🛏️ Room" : resolvedType === "job" ? "💼 Job Vacancy" : "📱 Mobile";
        const newNotif = {
          id: `notif-appr-${Date.now()}`,
          title: `New ${typeLabel} Ad Posted!`,
          body: `${newListing.title} (${newListing.priceOrSalary}) in ${newListing.location}`,
          date: new Date().toISOString(),
          type: "classified",
          actionUrl: resolvedType === "vehicle" ? "vehicles" : resolvedType === "room" ? "rooms" : resolvedType === "job" ? "jobs" : "mobiles"
        };
        const notifs = readNotifications();
        notifs.unshift(newNotif);
        if (notifs.length > 50) notifs.pop();
        writeNotifications(notifs);
      }

      res.json({
        success: true,
        message: "Ad published successfully!",
        listing: newListing
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Failed to create ad"
      });
    }
  });

  // 6. Notifications: Public endpoint to get latest update announcements
  app.get("/api/notifications", (_req, res) => {
    const notifs = readNotifications();
    res.json({
      success: true,
      count: notifs.length,
      notifications: notifs
    });
  });

  // 7. Notifications: Subscribe device endpoint
  app.post("/api/notifications/subscribe", (req, res) => {
    const { platform, userAgent } = req.body || {};
    const subs = readSubscribers();
    const newSub = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      platform: platform || "Web",
      userAgent: userAgent || "Unknown",
      createdAt: new Date().toISOString(),
      active: true
    };
    subs.unshift(newSub);
    // Keep max 5000 recent device subscribers
    if (subs.length > 5000) subs.pop();
    writeSubscribers(subs);

    res.json({
      success: true,
      message: "Device subscribed for instant Qatar Living Jobs updates!"
    });
  });

  // 8. Admin: Broadcast update notification to all subscribers
  app.post("/api/admin/broadcast-notification", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const { title, body, type, actionUrl } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        error: "Title and body are required for broadcasting an update"
      });
    }

    const newNotif = {
      id: `notif-broad-${Date.now()}`,
      title: String(title).trim(),
      body: String(body).trim(),
      date: new Date().toISOString(),
      type: type || "update",
      actionUrl: actionUrl || "jobs"
    };

    const notifs = readNotifications();
    notifs.unshift(newNotif);
    if (notifs.length > 50) notifs.pop();
    writeNotifications(notifs);

    const subs = readSubscribers();

    res.json({
      success: true,
      message: `Notification broadcast sent successfully to ${subs.length} active device(s)!`,
      subscriberCount: subs.length,
      notification: newNotif
    });
  });

  // 9. Admin: Change Admin PIN (persisted to server, immediately disables old PIN)
  app.post("/api/admin/change-pin", (req, res) => {
    const headerPin = req.headers["x-admin-pin"];
    const { currentPin, newPin } = req.body;
    const pinToVerify = headerPin || currentPin;

    const activeAdminPin = getAdminPin();
    if (!pinToVerify || pinToVerify !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Current Admin PIN is incorrect"
      });
    }

    if (!newPin || typeof newPin !== "string" || newPin.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: "New PIN must be at least 4 digits"
      });
    }

    setAdminPin(newPin.trim());

    res.json({
      success: true,
      message: "Admin PIN changed successfully. Default PIN is now disabled."
    });
  });

  // 10. In-App Applications: Submit candidate job application inside the app
  app.post("/api/applications", (req, res) => {
    try {
      const {
        jobId,
        jobTitle,
        company,
        applicantName,
        phone,
        email,
        currentVisaStatus,
        experienceYears,
        expectedSalary,
        coverNote,
        cvFileName
      } = req.body || {};

      if (!applicantName || !phone) {
        return res.status(400).json({
          success: false,
          error: "Full name and WhatsApp/Phone number are required"
        });
      }

      const newApp = {
        id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        jobId: jobId || "job-general",
        jobTitle: (jobTitle || "Qatar Vacancy").trim(),
        company: (company || "Qatar Employer").trim(),
        applicantName: String(applicantName).trim(),
        phone: String(phone).trim(),
        email: String(email || "").trim(),
        currentVisaStatus: currentVisaStatus || "Qatar ID & Transferable Visa with NOC",
        experienceYears: experienceYears || "1-3 Years",
        expectedSalary: expectedSalary ? String(expectedSalary).trim() : "",
        coverNote: coverNote ? String(coverNote).trim() : "",
        cvFileName: cvFileName ? String(cvFileName).trim() : "",
        appliedAt: new Date().toISOString(),
        status: "submitted"
      };

      const all = readApplications();
      all.unshift(newApp);
      // Keep up to 2000 applications
      if (all.length > 2000) all.pop();
      writeApplications(all);

      res.status(201).json({
        success: true,
        message: "Job application submitted successfully inside the app!",
        application: newApp
      });
    } catch (err: any) {
      console.error("Error submitting application:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Admin: Get all candidate job applications
  app.get("/api/admin/applications", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const apps = readApplications();
    res.json({
      success: true,
      count: apps.length,
      applications: apps
    });
  });

  // 12. Admin: Update candidate application status
  app.patch("/api/admin/applications/:id", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const apps = readApplications();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    if (status) apps[index].status = status;
    writeApplications(apps);

    res.json({
      success: true,
      application: apps[index]
    });
  });

  // 13. Admin: Delete an application
  app.delete("/api/admin/applications/:id", (req, res) => {
    const pin = req.headers["x-admin-pin"] || req.query.pin;
    const activeAdminPin = getAdminPin();
    if (!pin || pin !== activeAdminPin) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid Admin PIN"
      });
    }

    const { id } = req.params;
    let apps = readApplications();
    const initialLen = apps.length;
    apps = apps.filter((a) => a.id !== id);

    if (apps.length === initialLen) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    writeApplications(apps);
    res.json({ success: true, message: "Application deleted successfully" });
  });

  // 10. Check if Admin PIN is still set to factory default
  app.get("/api/admin/pin-status", (_req, res) => {
    const isDefault = getAdminPin() === "9740";
    res.json({
      success: true,
      isDefault
    });
  });

  // Direct APK download routes - NEVER redirects to app.html
  const handleApkDownload = (_req: express.Request, res: express.Response) => {
    // If a custom direct .apk link or direct file host is explicitly configured, redirect to it
    if (
      cachedConfig.apkUrl &&
      cachedConfig.apkUrl.startsWith("http") &&
      !cachedConfig.apkUrl.includes("app.html") &&
      (cachedConfig.apkUrl.endsWith(".apk") ||
        cachedConfig.apkUrl.includes("drive.google.com") ||
        cachedConfig.apkUrl.includes("mediafire.com") ||
        cachedConfig.apkUrl.includes("dropbox.com") ||
        cachedConfig.apkUrl.includes("github.com"))
    ) {
      return res.redirect(302, cachedConfig.apkUrl);
    }

    // Serve the direct APK binary package
    const apkPath = path.join(process.cwd(), "public", "QatarLivingJobs.apk");
    if (fs.existsSync(apkPath)) {
      res.setHeader("Content-Disposition", 'attachment; filename="QatarLivingJobs-v2.5.apk"');
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      return res.sendFile(apkPath);
    }

    // Fallback redirect to install
    res.redirect(302, "/?action=install-apk");
  };

  app.get("/api/download/apk", handleApkDownload);
  app.get("/download/QatarLivingJobs.apk", handleApkDownload);
  app.get("/QatarLivingJobs.apk", handleApkDownload);
  app.get("/download-apk", handleApkDownload);

  // Initial background sync
  syncAppFromBlogger().catch(() => {});

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Qatar Living Jobs server running on port ${PORT}`);
  });
}

startServer();
