/* publications.js — PubMed E-utilities integration for ChanLab */

/*
  CONFIGURATION
  ─────────────
  Edit PUBMED_SEARCH to match your author name in PubMed.
  The best approach is to find your unique author identifier in
  PubMed Author Search: https://www.ncbi.nlm.nih.gov/myncbi/
  and use Author ID for highest precision.

  Current strategy: name search + MeSH topic filter
*/

const PUBMED_SEARCH = '("Chan Ho Wing"[Author] OR "Chan H W"[Author] OR "Ho Wing Chan"[Author]) AND (epilepsy[MeSH] OR seizure[MeSH] OR "brain-computer interface"[Title/Abstract] OR intracranial[Title/Abstract] OR "deep brain stimulation"[MeSH])';
const MAX_RESULTS   = 100;

/* Author name to bold in author lists */
const MY_NAMES = ['Chan H', 'Chan HW', 'Chan Ho W', 'Chan A'];

const BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

async function loadPubs() {
  const container = document.getElementById('pubs-container');
  const loading   = document.getElementById('pubs-loading');
  const notice    = document.getElementById('pubs-notice');

  if (!container) return;

  try {
    /* ── 1. Search ── */
    const searchResp = await fetch(
      `${BASE}esearch.fcgi?db=pubmed&term=${encodeURIComponent(PUBMED_SEARCH)}&retmax=${MAX_RESULTS}&retmode=json&sort=pubdate`
    );
    const searchData = await searchResp.json();
    const ids        = searchData?.esearchresult?.idlist || [];

    if (!ids.length) {
      loading.style.display = 'none';
      container.innerHTML = `
        <div class="pub-notice">
          No publications fetched automatically. 
          <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(PUBMED_SEARCH)}&sort=date" target="_blank" rel="noopener">
            View on PubMed ↗
          </a>
        </div>`;
      return;
    }

    /* ── 2. Fetch summaries ── */
    const summResp = await fetch(
      `${BASE}esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
    );
    const summData = await summResp.json();
    const result   = summData?.result || {};

    loading.style.display = 'none';
    if (notice) notice.style.display = 'block';

    /* ── 3. Group by year ── */
    const byYear = {};
    ids.forEach(id => {
      const pub = result[id];
      if (!pub || pub.error) return;
      const year = (pub.pubdate || pub.epubdate || '').match(/\d{4}/)?.[0] || 'In Press';
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(pub);
    });

    const years = Object.keys(byYear).sort((a, b) => (b === 'In Press' ? -1 : b - a));

    container.innerHTML = years.map(yr => `
      <div class="pub-year-group">
        <div class="pub-year-header">${yr}</div>
        ${byYear[yr].map(p => renderPub(p)).join('')}
      </div>`).join('');

    /* Filter on search input */
    const searchInput = document.getElementById('pub-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        document.querySelectorAll('.pub-item').forEach(el => {
          el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

  } catch (err) {
    if (loading) loading.style.display = 'none';
    container.innerHTML = `
      <div class="pub-notice">
        ⚠ Could not reach PubMed API. 
        <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(PUBMED_SEARCH)}&sort=date" target="_blank" rel="noopener">
          Search PubMed directly ↗
        </a>
      </div>`;
    console.error('[ChanLab publications]', err);
  }
}

function renderPub(pub) {
  const title   = (pub.title  || 'Untitled').replace(/\.$/, '');
  const authors = formatAuthors(pub.authors || []);
  const journal = pub.fulljournalname || pub.source || '';
  const volume  = pub.volume ? `;${pub.volume}` : '';
  const issue   = pub.issue  ? `(${pub.issue})` : '';
  const pages   = pub.pages  ? `:${pub.pages}` : '';
  const year    = (pub.pubdate || '').match(/\d{4}/)?.[0] || '';
  const pmid    = pub.uid;
  const doi     = pub.elocationid?.match(/doi:\s*(.+)/i)?.[1]?.trim() || '';

  return `
    <div class="pub-item" data-pmid="${pmid}">
      <div>
        <div class="pub-title">
          <a href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener">${title}</a>
        </div>
        <div class="pub-authors">${authors}</div>
        <div class="pub-journal">
          <em>${journal}</em>${volume}${issue}${pages}.${year ? ' ' + year + '.' : ''}
          ${doi ? `<a href="https://doi.org/${doi}" target="_blank" rel="noopener" class="pub-doi">DOI</a>` : ''}
        </div>
      </div>
      <div>
        <a class="pub-pmid-btn" href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener">
          PMID ${pmid} ↗
        </a>
      </div>
    </div>`;
}

function formatAuthors(authors) {
  const names = authors.map(a => a.name || '').filter(Boolean);
  if (!names.length) return '';
  const formatted = names.map(n =>
    MY_NAMES.some(m => n.startsWith(m) || n.includes(m))
      ? `<strong>${n}</strong>`
      : n
  );
  if (formatted.length <= 12) return formatted.join(', ');
  return formatted.slice(0, 12).join(', ') + ` et al.`;
}

document.addEventListener('DOMContentLoaded', loadPubs);
