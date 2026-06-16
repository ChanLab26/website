# Chan Lab Website

**Neural Circuits and Neurotechnology Laboratory**  
West Virginia University, Rockefeller Neuroscience Institute  
Department of Neurology

---

## Live Site

After deployment: `https://chanlab-wvu.github.io` (or your configured custom domain)

---

## Quick Start — GitHub Pages Deployment

### 1. Create the repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `chanlab-wvu.github.io` (replacing your GitHub username) **or** name it anything (e.g., `lab-website`) for a subdirectory URL
3. Set visibility to **Public** (required for free GitHub Pages)
4. Do not add a README — you already have one

### 2. Upload the files

**Option A — GitHub web interface (simplest)**
1. Open your new repository on GitHub
2. Click "uploading an existing file" or drag and drop
3. Upload all files maintaining folder structure:
   ```
   index.html
   research.html
   people.html
   publications.html
   technology.html
   clinical.html
   join.html
   news.html
   README.md
   assets/
     css/
       style.css
     js/
       nav.js
       neural.js
       publications.js
   ```
4. Commit directly to `main`

**Option B — Git command line**
```bash
cd /path/to/chanlab/
git init
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git add .
git commit -m "Initial site launch"
git push -u origin main
```

### 3. Enable GitHub Pages

1. In your repository, go to **Settings → Pages**
2. Under "Source," select **Deploy from a branch**
3. Choose branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME` within 1-5 minutes

---

## Customization Guide

### Adding your photo (People page)

The People page (`people.html`) currently uses a placeholder for your photo. To replace it:

1. Add your photo to the repository: `assets/images/andy-chan.jpg`
2. In `people.html`, find the placeholder `<div class="pi-photo-placeholder">` and replace with:
   ```html
   <img src="assets/images/andy-chan.jpg" alt="Andy Chan, MD" class="pi-photo">
   ```
3. Add this CSS to `style.css`:
   ```css
   .pi-photo { width:100%; border-radius:var(--r-lg); object-fit:cover; }
   ```

### Adding hero background images

The home page hero uses a canvas neural network animation. If you want a photographic background instead (SEEG images, connectome graphics, etc.):

1. Add image to `assets/images/hero-bg.jpg`
2. In `index.html`, find `.hero` and add:
   ```css
   background-image: url('assets/images/hero-bg.jpg');
   background-size: cover;
   background-position: center;
   ```

### Updating the PubMed publication query

In `assets/js/publications.js`, find the `PUBMED_SEARCH` constant near the top of the file and edit the search string to match your publications:

```javascript
const PUBMED_SEARCH = `("Chan Ho Wing"[Author] OR "Chan H W"[Author] OR "Ho Wing Chan"[Author]) AND (epilepsy[MeSH] OR seizure[MeSH] OR "brain-computer interface"[Title/Abstract] OR intracranial[Title/Abstract] OR "deep brain stimulation"[MeSH])`;
```

Test your query directly at: `https://pubmed.ncbi.nlm.nih.gov/`

### Adding news items

Open `news.html` and copy this block inside the appropriate year group:

```html
<div class="news-item" data-cat="CATEGORY">
  <div class="news-date">
    <div class="news-month">Mon</div>
    <div class="news-day">01</div>
    <div class="news-year">2025</div>
  </div>
  <div class="news-body">
    <div><span class="nbadge nb-CATEGORY">Label</span></div>
    <div class="news-title">Your headline here</div>
    <div class="news-desc">Description of the item.</div>
  </div>
</div>
```

**Category options:**

| `data-cat` value | Badge class | Use for |
|---|---|---|
| `grant` | `nb-grant` | Grant awards, submissions, renewals |
| `paper` | `nb-paper` | Publications, manuscripts, preprints |
| `award` | `nb-award` | Honors, recognition |
| `press` | `nb-press` | Media coverage, podcasts, press |
| `event` | `nb-event` | Talks, conferences, presentations |
| `people` | `nb-people` | New lab members, departures, positions |

### Adding a new year section

Copy this block in `news.html`:

```html
<div class="year-group" id="year-2026">
  <div class="year-divider">2026</div>
  <!-- Add news items here -->
</div>
```

Place it above the 2025 block (newest year first).

### Adding a lab member (People page)

In `people.html`, find the graduate students or other relevant section and add:

```html
<div class="person-card">
  <div class="person-photo-placeholder">
    <svg><!-- existing placeholder SVG --></svg>
  </div>
  <div class="person-name">Full Name</div>
  <div class="person-role">PhD Student · Neuroscience</div>
  <div class="person-bio">Brief bio sentence.</div>
</div>
```

### Custom domain (optional)

To use `chanlab.wvu.edu` or a personal domain:

1. In the repository root, create a file named `CNAME` containing only your domain:
   ```
   chanlab.wvu.edu
   ```
2. In GitHub Settings → Pages, add your custom domain
3. Update DNS records with your domain registrar or WVU IT

---

## File Structure

```
chanlab/
├── index.html          # Home page (hero, research overview, news teaser)
├── research.html       # 4 research themes in detail
├── people.html         # PI, trainees, collaborators
├── publications.html   # PubMed auto-fetch
├── technology.html     # SeizEAR, Axon-R, SEEG platform, future tech
├── clinical.html       # Clinical programs and translational model
├── join.html           # Recruitment page (5 tracks)
├── news.html           # News archive with category filter
├── README.md           # This file
└── assets/
    ├── css/
    │   └── style.css   # All styles — CSS variables at top for easy theming
    └── js/
        ├── nav.js          # Mobile menu, active-page highlighting
        ├── neural.js       # Canvas animation for hero (electrode nodes + LFP)
        └── publications.js # PubMed E-utilities API fetch and render
```

---

## CSS Theming

All colors are defined as CSS variables at the top of `assets/css/style.css`:

```css
:root {
  --navy:    #002D62;   /* WVU Navy — primary headers, footer */
  --blue:    #1B6DB8;   /* Circuit Blue — accents, links */
  --gold:    #EAAA00;   /* WVU Gold — highlights, badges */
  --ghost:   #F5F7FA;   /* Background sections */
  --ink:     #131E2E;   /* Body text */
  --muted:   #6B7A99;   /* Secondary text */
  --divider: #E2E8F0;   /* Borders, dividers */
}
```

Change any of these to retheme the entire site instantly.

---

## Notes

- **No build step required.** This is plain HTML/CSS/JS. Open any `.html` file in a browser to preview locally.
- **Publications require internet.** The PubMed fetch in `publications.html` calls the NCBI E-utilities API. It will not work when previewing locally via `file://` — use a local server or push to GitHub Pages to test it.
- **Email link.** The join page links to `mailto:andy.chan@hsc.wvu.edu` — update this in `join.html` if your address changes.

---

*Chan Lab · West Virginia University · Rockefeller Neuroscience Institute*
