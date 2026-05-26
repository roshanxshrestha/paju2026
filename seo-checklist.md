# SEO Checklist — Paju Lounge & Family Restaurant
# Complete this list before and after going live.

---

## A. TECHNICAL SEO (Website)

### Done by Claude in this session ✅
- [x] Unique, keyword-rich <title> tags on every page
- [x] Meta description on every page (under 160 chars)
- [x] Canonical URLs on every page
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card meta tags
- [x] Schema.org structured data — Restaurant + LocalBusiness (index.html)
- [x] Schema.org structured data — Menu (menu.html)
- [x] Schema.org BreadcrumbList on both pages
- [x] Schema.org review/aggregateRating data
- [x] robots.txt with sitemap declaration
- [x] XML sitemap (sitemap.xml)
- [x] Web App Manifest (site.webmanifest) with theme-color
- [x] Geo meta tags (latitude/longitude)
- [x] Semantic HTML (aria-labels, itemprop, itemscope)
- [x] Hero image preload (fetchpriority="high")
- [x] Mobile-responsive design
- [x] No horizontal scroll
- [x] Fast load (no heavy JS libraries)

### You need to complete ⬜
- [ ] Generate favicons from https://realfavicongenerator.net
      → Upload PAJUGOLD.webp → download package → put in /assets/favicon/
      → Uncomment the favicon lines in both HTML files' <head>
- [ ] Link rel="manifest" href="/site.webmanifest" in both HTML <head> sections
- [ ] Submit sitemap to Google Search Console (see step B below)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify no broken links (check with https://www.drlinkcheck.com)
- [ ] Add real alt text to all images when you replace placeholders
      Bad:  alt=""  or  alt="image1.jpg"
      Good: alt="Paju Lounge steamed momo with tomato chutney"
- [ ] Compress all images to WebP under 150KB (use squoosh.app)
- [ ] Update <lastmod> dates in sitemap.xml when content changes
- [ ] Host on HTTPS (Netlify/Cloudflare Pages provides this free)

---

## B. GOOGLE SEARCH CONSOLE

1. Go to https://search.google.com/search-console
2. Add property → URL prefix → https://pajulounge.com.np
3. Verify ownership (choose "HTML file" method — download file, upload to root)
4. Go to Sitemaps → enter "sitemap.xml" → Submit
5. Go to URL Inspection → enter "/" → Request Indexing
6. Go to URL Inspection → enter "/menu.html" → Request Indexing
7. Check back in 1–2 weeks for any crawl errors

---

## C. BING WEBMASTER TOOLS

1. Go to https://www.bing.com/webmasters
2. Add your site
3. Submit sitemap.xml
(Bing also shares data with DuckDuckGo and Yahoo)

---

## D. ON-PAGE SEO — Content Improvements

### Already good ✅
- [x] H1 tag on every page (hero title / menu page title)
- [x] H2 tags for each section
- [x] H3/H4 for sub-sections
- [x] Restaurant established year mentioned
- [x] Location (Dhading Bensi) mentioned multiple times on page
- [x] Phone numbers in text and clickable tel: links
- [x] Google Maps embed
- [x] Opening hours structured and visible
- [x] Review/testimonial section

### Improve when possible ⬜
- [ ] Add a short blog or news section with local content
      Example posts:
      "Best Places to Eat in Dhading Bensi" (mention yourselves)
      "Live Music in Dhading — What to Expect at Paju Lounge"
      "Our Momo Recipe Story — 30 Years in the Making"
      Even 3–4 posts per year significantly boosts organic ranking.
- [ ] Add an FAQ section to index.html (structured with FAQPage schema)
      Google shows FAQ answers directly in search results — high click rate.
- [ ] Add "Dhading Bensi" and "Dhading" naturally in section text
      (already done in contact/footer, add more in about/hero copy)

---

## E. LOCAL SEO — Off-Page

### Priority order:
1. ⬜ Google Business Profile — complete all steps in google-business-guide.md
2. ⬜ Get 10+ Google reviews in first month
3. ⬜ Post on Facebook 3× per week (food photos, events, specials)
4. ⬜ Register on Bing Places
5. ⬜ Register on TripAdvisor
6. ⬜ Share website link in local Facebook groups
7. ⬜ Ask local bloggers / influencers in Dhading to visit and post

---

## F. SOCIAL MEDIA (Signals Google Notices)

- Facebook: Post 3× per week minimum. Always include location tag.
- Instagram: Post food photos with hashtags:
  #DhadingBensi #DhadingFood #PajuLounge #NepalRestaurant
  #MomoDhading #DhadingEats #NepalFood
- WhatsApp Status: Share specials and live music reminders every week
- Tag your location in every post

---

## G. PAGE SPEED (Core Web Vitals)

Google uses page speed as a direct ranking factor.
After going live, test with:
- https://pagespeed.web.dev — target score 90+ on mobile
- https://gtmetrix.com

Common fixes if score is low:
- Convert all images to WebP (biggest win)
- Add loading="lazy" to all below-fold images
- Make sure Google Fonts loads with display=swap (already done)
- Host on Netlify or Cloudflare Pages (free CDN, fast globally)

---

## H. KEYWORD TARGETS

### Primary (what you want to rank #1 for):
- "restaurant Dhading Bensi"
- "Paju Lounge"
- "best restaurant Dhading"
- "momo Dhading Bensi"

### Secondary (realistic within 6 months):
- "family restaurant Dhading Nepal"
- "live music restaurant Dhading"
- "lounge Dhading Bensi"
- "chicken sekuwa Dhading"
- "hookah Dhading Bensi"

### Long-tail (easy wins):
- "Paju Lounge & Family Restaurant Dhading"
- "restaurant near Dhading Besi bus park"
- "where to eat in Dhading Bensi"
- "best momo in Dhading"

---

## TIMELINE — Realistic Expectations

Month 1:  Submit sitemap, complete GBP, get first 10 reviews
Month 2:  Start appearing in local 3-pack for branded searches
Month 3:  Ranking for "restaurant Dhading Bensi" on page 1
Month 6:  Ranking for multiple local food keywords
Month 12: Established local authority, consistent organic traffic

