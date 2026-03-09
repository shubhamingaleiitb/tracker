/* ============================================
   Shared UI helpers
   ============================================ */

// Highlight active nav link
function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topnav nav a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

// Initialize checklists: restore state, bind events, update section progress
function initChecklists() {
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    const id = cb.dataset.id;
    if (!id) return;

    cb.checked = Store.isChecked(id);
    if (cb.checked) cb.closest('li')?.classList.add('checked');

    cb.addEventListener('change', () => {
      Store.setChecked(id, cb.checked);
      cb.closest('li')?.classList.toggle('checked', cb.checked);
      updateSectionProgress();
      updatePageProgress();
    });
  });
  updateSectionProgress();
  updatePageProgress();
}

// Update per-card progress bars
function updateSectionProgress() {
  document.querySelectorAll('.card[data-section]').forEach(card => {
    const checks = card.querySelectorAll('.checklist input[type="checkbox"]');
    if (!checks.length) return;
    const done = [...checks].filter(c => c.checked).length;
    const total = checks.length;
    const pct = Math.round((done / total) * 100);

    const bar = card.querySelector('.progress-bar-fill');
    const label = card.querySelector('.progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = `${done}/${total} completed`;

    // Save for dashboard
    const section = card.dataset.section;
    if (section) Store.setSectionStats(section, total, done);
  });
}

// Update overall page progress
function updatePageProgress() {
  const all = document.querySelectorAll('.checklist input[type="checkbox"]');
  if (!all.length) return;
  const done = [...all].filter(c => c.checked).length;
  const total = all.length;
  const pct = Math.round((done / total) * 100);

  const bar = document.querySelector('.page-progress .progress-bar-fill');
  const label = document.querySelector('.page-progress .progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${done}/${total} items completed (${pct}%)`;
}

// Section collapse toggling
function initToggles() {
  document.querySelectorAll('.section-toggle').forEach(h => {
    h.addEventListener('click', () => {
      h.classList.toggle('collapsed');
      const content = h.nextElementSibling;
      if (content) content.style.display = h.classList.contains('collapsed') ? 'none' : '';
    });
  });
}

// Build the nav bar HTML
function renderNav(activePage) {
  // Determine if we're in /pages/ or root
  const inPages = location.pathname.includes('/pages/');
  const prefix = inPages ? '../' : '';
  const pagesPrefix = inPages ? '' : 'pages/';

  return `
  <div class="topnav">
    <div class="topnav-inner">
      <a class="logo" href="${prefix}index.html">RE<span>Tracker</span></a>
      <nav>
        <a href="${prefix}index.html">Dashboard</a>
        <a href="${pagesPrefix}track-a.html">Track A</a>
        <a href="${pagesPrefix}track-b.html">Track B</a>
        <a href="${pagesPrefix}projects.html">Projects</a>
        <a href="${pagesPrefix}journal.html">Journal</a>
        <a href="${pagesPrefix}resources.html">Resources</a>
      </nav>
    </div>
  </div>`;
}

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initChecklists();
  initToggles();
});
