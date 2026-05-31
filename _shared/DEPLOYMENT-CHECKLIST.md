# GA4 Deployment Checklist — daza.ar ecosystem

## Overview

All 13 sites now have dedicated measurement IDs in GA4 property `daza.ar` (properties/521233901).
The shared config is at `~/Projects/daza.ar-env/sites/_shared/analytics-config.umd.js`.

**For each site, you need to:**
1. Make `/sites/_shared/` accessible at `/_shared/` on the deployed site
2. Inject the GA4 snippet + ConsentManager into the site's `index.html`
3. Rebuild (for Vite-built sites)

---

## MEASUREMENT IDs

| Site | Measurement ID | Site Key |
|------|---------------|----------|
| wallpapers | G-DBDHBPP6ZS | wallpapers |
| linkedin2md | G-KBXL3M8D5P | linkedin2md |
| github2md | G-757KW9Y1RM | github2md |
| gitlab2md | G-D2DMNZMZQH | gitlab2md |
| cv | G-GWCZ0041FP | cv |
| start | G-549QBGBBKS | start |
| onepager | G-99DHPDQ9VB | onepager |
| mdsite | G-KL32NMGJL4 | mdsite |
| navbar | G-L3JHQSC8TV | navbar |
| data | G-KL0NEYS6Z4 | data |
| laboratoriodeprogramacioncreativa | G-00HLR6S41M | laboratoriodeprogramacioncreativa |
| spanishlessons | G-N3NJX0CR82 | spanishlessons |

---

## PER-SITE DEPLOYMENT

### cv / start / onepager / mdsite / data / laboratoriodeprogramacioncreativa / spanishlessons
Static HTML sites — deploy directly from `~/Projects/daza.ar-env/sites/{site}/`

**Steps:**
1. Deploy `~/Projects/daza.ar-env/sites/_shared/` to `/_shared/` on the server
2. Add to `<head>` (after `env-config.umd.js` include):
   ```html
   <script src="/_shared/analytics-config.umd.js"></script>
   ```
3. Add to `<body>` (before `</body>`):
   ```html
   <div id="cookie-banner" role="dialog" aria-labelledby="cookie-title" hidden
        style="position:fixed;bottom:0;left:0;right:0;background:#222;color:#fff;padding:16px;z-index:9999;font-family:sans-serif;font-size:14px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
     <span id="cookie-title">We use analytics cookies.</span>
     <div style="display:flex;gap:8px;">
       <button id="cookie-accept" style="background:#4CAF50;color:#fff;border:none;padding:8px 16px;cursor:pointer;border-radius:4px;">Accept</button>
       <button id="cookie-reject" style="background:#666;color:#fff;border:none;padding:8px 16px;cursor:pointer;border-radius:4px;">Reject</button>
     </div>
   </div>
   <script>
     window.addEventListener('DOMContentLoaded', function() {
       var s = localStorage.getItem('cookie_consent');
       if (s === null) { document.getElementById('cookie-banner').hidden = false; }
       document.getElementById('cookie-accept').addEventListener('click', function() {
         localStorage.setItem('cookie_consent', 'granted');
         document.getElementById('cookie-banner').hidden = true;
         if (typeof gtag !== 'undefined') gtag('consent', 'update', {'analytics_storage': 'granted'});
       });
       document.getElementById('cookie-reject').addEventListener('click', function() {
         localStorage.setItem('cookie_consent', 'denied');
         document.getElementById('cookie-banner').hidden = true;
         if (typeof gtag !== 'undefined') gtag('consent', 'update', {'analytics_storage': 'denied'});
       });
     });
   </script>
   <script>
     window.addEventListener('DOMContentLoaded', function() {
       DazaAnalytics.bootstrap('SITE_KEY');
       DazaAnalytics.initAutoTrackers();
     });
   </script>
   ```
   Replace `SITE_KEY` with the site key from the table above.

4. Commit and push — auto-deploy picks it up

---

### navbar
Same as above, but the `_shared/` is already deployed from `daza.ar-env`. Cookie banner + bootstrap needed.
Site key: `navbar`

---

### wallpapers
Vite/React build — output in `dist/`

**Steps:**
1. Deploy `~/Projects/daza.ar-env/sites/_shared/` to `/_shared/` accessible from wallpapers.ultravietnamita.com.ar
2. Add to `src/index.html` (in the Vite template `<head>` section):
   ```html
   <script src="/_shared/analytics-config.umd.js"></script>
   ```
3. Add before `</body>` in the same file:
   ```html
   <div id="cookie-banner" ...>...</div>
   <script>
     window.addEventListener('DOMContentLoaded', function() {
       // ConsentManager init
       var s = localStorage.getItem('cookie_consent');
       if (s === null) { document.getElementById('cookie-banner').hidden = false; }
       document.getElementById('cookie-accept').addEventListener('click', function() {
         localStorage.setItem('cookie_consent', 'granted');
         document.getElementById('cookie-banner').hidden = true;
         if (typeof gtag !== 'undefined') gtag('consent', 'update', {'analytics_storage': 'granted'});
       });
       document.getElementById('cookie-reject').addEventListener('click', function() {
         localStorage.setItem('cookie_consent', 'denied');
         document.getElementById('cookie-banner').hidden = true;
         if (typeof gtag !== 'undefined') gtag('consent', 'update', {'analytics_storage': 'denied'});
       });
     });
   </script>
   <script>
     window.addEventListener('DOMContentLoaded', function() {
       DazaAnalytics.bootstrap('wallpapers');
       DazaAnalytics.initAutoTrackers();
     });
   </script>
   ```
4. `cd ~/Projects/daza.ar-env/sites/wallpapers && npm run build`
5. Deploy the new `dist/` folder

---

### linkedin2md / github2md / gitlab2md
Docs sites deployed from `~/Projects/{site}/docs/`

**Steps:**
1. The `_shared/` folder needs to be accessible at `/_shared/` from each deployed domain (linkedin2md.daza.ar, etc.)
2. Update `docs/index.html` — the existing inline GA4 snippet needs to be replaced with the shared config call

**In `docs/index.html`:**
- Find the existing inline gtag snippet (lines with `gtag('consent', 'default',...)`, `gtag('config', 'G-...')`, `googletagmanager.com/gtag/js`)
- Remove the inline gtag script block (keep everything else including ConsentManager)
- Add in `<head>`:
  ```html
  <script src="/_shared/analytics-config.umd.js"></script>
  ```
- Add before `</body>`:
  ```html
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      DazaAnalytics.bootstrap('SITE_KEY');
      DazaAnalytics.initAutoTrackers();
    });
  </script>
  ```
  Replace `SITE_KEY` with: `linkedin2md`, `github2md`, or `gitlab2md`

3. The existing ConsentManager in these docs/index.html files is already compatible — keep it

---

## DEPLOYING THE _shared/ FOLDER

The `_shared/analytics-config.umd.js` must be accessible at `/_shared/analytics-config.umd.js` from all deployed domains.

**Options per deployment method:**
- **Static file serving** (Apache/Nginx): copy `_shared/` to each site's document root, or symlink
- **Git-based deploy** (Cloudflare Pages, Netlify, etc.): add `_shared/` to each project's source, or reference it from a shared git submodule
- **Rsync/scp**: copy `_shared/` to the server and symlink from each site's root

---

## GA4 ADMIN TASKS (manual, one-time)

1. Enable enhanced measurement for each data stream:
   - GA4 Admin → daza.ar property → Data Streams → click each stream → Enhanced Measurement → enable:
     - Scrolls, Outbound clicks, Site search, Video engagement, File downloads

2. In Looker Studio, add each measurement ID as a separate data source:
   - Create report → Add data → Google Analytics → select each property/stream
   - Use `site_key` custom dimension for cross-property joins (already created)

---

## VERIFICATION

After deploying, test each site:
1. Open site → cookie banner should appear
2. Click "Accept" → banner hides
3. Check browser DevTools → Network → find `analytics-config.umd.js` load
4. GA4 Realtime report should show active user within 2 minutes

---

## REFRESH TOKEN

The OAuth refresh token is saved at `~/.config/daza-ar-ga4/refresh_token`.
If the access token expires, re-run: `python3 /tmp/get_token.py` and re-authorize.