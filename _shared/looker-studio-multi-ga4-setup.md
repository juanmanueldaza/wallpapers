# Looker Studio + Multi-GA4 Unified Dashboard Setup

## Overview

Looker Studio (formerly Google Data Studio) connects to GA4 via the **GA4 Data API** (`analyticsdata.googleapis.com`).
Each GA4 property is a separate data source. You can have multiple GA4 data sources in one Looker Studio report.

---

## Step 1 — Create individual GA4 data sources

1. Go to [Looker Studio](https://lookerstudio.google.com)
2. Create a **Report** → **Add data** → Search for **"Google Analytics"**
3. Authorize the connector (needs a Google account with GA4 access)
4. For each site, select its **GA4 property** from the property dropdown
5. Give the data source a clear name: `GA4 - wallpapers.daza.ar`, `GA4 - cv.daza.ar`, etc.
6. Repeat for all 10 properties

**Quota note**: Each GA4 property has its own quota (10k requests/day standard, 100k/day 360).
For a dashboard refreshing every hour, 10 properties × ~50 requests/day = 500/day — well within limits.

---

## Step 2 — Build the unified report structure

### Approach A: Tabbed per-site reports (simpler, recommended)

```
Report: daza.ar — All Sites Dashboard
├── Tab: Overview (all-sites aggregated view)
├── Tab: wallpapers.daza.ar
├── Tab: cv.daza.ar
├── Tab: start.daza.ar
├── Tab: onepager.daza.ar
├── Tab: mdsite.daza.ar
├── Tab: navbar.daza.ar
├── Tab: data.daza.ar
├── Tab: laboratoriodeprogramacioncreativa.daza.ar
└── Tab: spanishlessons.daza.ar
```

For each tab, use that site's data source. This is clean and simple.

### Approach B: Blended data for cross-site overview

**When to use**: You want one page showing KPIs from all properties simultaneously.

**How it works**: Looker Studio "Blended Data" lets you JOIN multiple data sources on a shared dimension.
The join key must exist in ALL properties.

For daza.ar, add a **custom dimension `site_key`** (via Admin API) to every property.
Then blend:

```
Data source 1: GA4 - wallpapers    [site_key = "wallpapers"]
Data source 2: GA4 - cv            [site_key = "cv"]
...
Join on: site_key
Metrics: Sessions, Users, Bounce Rate (from each source)
```

**Limitation**: You can blend metrics from different sources but you CANNOT blend
dimensions from different GA4 properties in the same chart. Each source's dimensions
are isolated. So charts with custom dimensions only work when that source is the
sole data source.

### Recommended approach: Use `site_key` custom dimension everywhere

This is the key insight for cross-property Looker Studio work:

1. Admin API creates `site_key` custom dimension on every property (done by `provision-ga4-properties.py`)
2. Every gtag config sends it:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX', {
     'custom_map': {'site_key': 'site_key'}
   });
   ```
3. In Looker Studio, add this as a dimension to every data source
4. Create a blended data source joining all 10 on `site_key`
5. Build the all-sites overview using the blended source

---

## Step 3 — Key metrics per dashboard tab

### All-sites Overview (blended)
- Total sessions across all sites
- Total users across all sites
- Top 5 sites by sessions
- Top pages across all sites
- Conversion rate by site

### Per-site tab
- Sessions / Users / Bounce rate
- Top pages (filtered to that site via `page_location` filter)
- Engagement: avg session duration, pages/session
- Events: file_downloads, form_submits, cta_clicks
- Tech: Device breakdown, geography
- Acquisition: top traffic sources

---

## Step 4 — Connect Google Search Console (bonus)

For SEO health, add Google Search Console as a second data source in Looker Studio:

1. Add data → Search Console
2. Authorize (needs the same Google account with GA4 access)
3. Select the site URL property (one per site)
4. Add GSC data alongside GA4 on the same tabs

Key GSC metrics to include:
- Total clicks, impressions, CTR
- Average position
- Top queries (to cross-reference with GA4 traffic sources)

---

## Step 5 — Sharing

- Looker Studio reports are shareable via link (anyone with the link can view)
- Set sharing to "Anyone with the link" for easy team access
- Can schedule email delivery of PDF snapshots

---

## Key gotchas

1. **Data source name collision**: Don't name two data sources identically — Looker Studio treats them as the same.
2. **Custom dimensions cross-property**: A custom dimension defined in one property only exists there. You must create it in all 10 properties separately (the `provision-ga4-properties.py` script does this).
3. **Looker Studio connector quota**: The GA4 connector uses the Data API — not the Admin API. Each property's 10k/day limit applies separately.
4. **Timezone**: GA4 data is reported in the property's timezone. All daza.ar properties use Europe/Madrid — so reports are consistent.
5. **Blended reports and filters**: Blended data has limitations with top-N and filter contexts — keep it simple.

---

## Dashboard template structure

```
daza.ar — Analytics Overview/
├── Page 1: Executive Summary
│   ├── Scorecard: Total Sessions (all sites, MTD)
│   ├── Scorecard: Total Users (all sites, MTD)
│   ├── Scorecard: Total Conversions (all sites, MTD)
│   ├── Bar chart: Sessions by site (blended, last 30 days)
│   ├── Line chart: Sessions trend per site (last 90 days)
│   └── Table: Top 10 pages across all sites
├── Page 2: wallpapers.daza.ar
│   ├── Scorecards: Sessions, Users, Bounce Rate
│   ├── Line: Sessions over time
│   ├── Table: Top pages
│   ├── Donut: Device category
│   └── Table: Top conversion events
├── Page 3: cv.daza.ar
├── Page 4: start.daza.ar
... (repeat per site)
└── Page 10: SEO Health (GSC data)
    ├── Scorecards: Clicks, Impressions, CTR
    └── Table: Top queries by impressions
```