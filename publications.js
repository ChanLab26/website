/* publications.js â€” pulls works from ORCID public API */
(function () {
  const ORCID_ID = '0009-0002-5055-9470';
  const container = document.getElementById('pubs-container');
  const loading = document.getElementById('pubs-loading');
  const notice = document.getElementById('pubs-notice');
  const search = document.getElementById('pub-search');
  if (!container) return;

  let allWorks = [];

  const API = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

  fetch(API, { headers: { Accept: 'application/json' } })
    .then(r => {
      if (!r.ok) throw new Error('ORCID request failed: ' + r.status);
      return r.json();
    })
    .then(data => {
      const groups = data.group || [];
      if (loading) loading.style.display = 'none';

      if (!groups.length) {
        container.innerHTML = '<p style="color:var(--muted);font-size:.95rem;">No publications found on ORCID yet.</p>';
        return;
      }

      allWorks = groups.map(g => {
        const s = g['work-summary'] && g['work-summary'][0];
        if (!s) return null;
        const title = s.title && s.title.title ? s.title.title.value : 'Untitled';
        const journal = s['journal-title'] ? s['journal-title'].value : '';
        const year = s['publication-date'] && s['publication-date'].year
          ? s['publication-date'].year.value : '';
        let link = '';
        const ids = s['external-ids'] && s['external-ids']['external-id'];
        if (ids) {
          const doi = ids.find(i => i['external-id-type'] === 'doi');
          if (doi) {
            link = (doi['external-id-url'] && doi['external-id-url'].value)
              ? doi['external-id-url'].value
              : 'https://doi.org/' + doi['external-id-value'];
          } else if (ids[0] && ids[0]['external-id-url']) {
            link = ids[0]['external-id-url'].value;
          }
        }
        return { title, journal, year: parseInt(year) || 0, link };
      }).filter(Boolean);

      allWorks.sort((a, b) => b.year - a.year);
      if (notice) notice.style.display = 'block';
      render(allWorks);
    })
    .catch(err => {
      console.error(err);
      if (loading) {
        loading.innerHTML = 'Unable to load publications automatically. ' +
          `View the full list on <a href="https://orcid.org/${ORCID_ID}" target="_blank" rel="noopener" style="color:var(--blue);">ORCID</a>.`;
      }
    });

  function render(works) {
    const byYear = {};
    works.forEach(w => {
      const y = w.year || 'Other';
      (byYear[y] = byYear[y] || []).push(w);
    });
    const years = Object.keys(byYear).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return b - a;
    });

    container.innerHTML = '';
    if (!works.length) {
      container.innerHTML = '<p style="color:var(--muted);font-size:.95rem;">No publications match your search.</p>';
      return;
    }

    years.forEach(y => {
      const block = document.createElement('div');
      block.className = 'pub-year-group';
      block.innerHTML = `<div class="pub-year">${y}</div>`;
      byYear[y].forEach(w => {
        const item = document.createElement('div');
        item.className = 'pub-item';
        const titleHtml = w.link
          ? `<a href="${w.link}" target="_blank" rel="noopener" class="pub-title-link">${w.title}</a>`
          : `<span class="pub-title-link">${w.title}</span>`;
        item.innerHTML =
          `<div class="pub-title">${titleHtml}</div>` +
          (w.journal ? `<div class="pub-journal">${w.journal}</div>` : '');
        block.appendChild(item);
      });
      container.appendChild(block);
    });
  }

  // Search filter
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      if (!q) { render(allWorks); return; }
      const filtered = allWorks.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.journal.toLowerCase().includes(q) ||
        String(w.year).includes(q)
      );
      render(filtered);
    });
  }
})();
