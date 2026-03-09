/* ============================================
   LocalStorage-backed persistence layer
   ============================================ */

const Store = {
  _get(key) {
    try {
      const raw = localStorage.getItem('ret_' + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  _set(key, val) {
    localStorage.setItem('ret_' + key, JSON.stringify(val));
  },

  // --- Checklist items ---
  getChecked() {
    return this._get('checked') || {};
  },

  setChecked(id, done) {
    const c = this.getChecked();
    if (done) c[id] = Date.now();
    else delete c[id];
    this._set('checked', c);
  },

  isChecked(id) {
    return !!this.getChecked()[id];
  },

  // --- Journal entries ---
  getJournal() {
    return this._get('journal') || [];
  },

  addJournalEntry(entry) {
    const j = this.getJournal();
    entry.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    j.unshift(entry);
    this._set('journal', j);
    return entry;
  },

  deleteJournalEntry(id) {
    const j = this.getJournal().filter(e => e.id !== id);
    this._set('journal', j);
  },

  updateJournalEntry(id, updates) {
    const j = this.getJournal().map(e => e.id === id ? { ...e, ...updates } : e);
    this._set('journal', j);
  },

  // --- Stats ---
  getStats() {
    const checked = this.getChecked();
    const total = document.querySelectorAll('.checklist input[type="checkbox"]').length;
    const done = Object.keys(checked).length;
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  },

  // For cross-page stats, store totals per section
  getSectionStats() {
    return this._get('sectionStats') || {};
  },

  setSectionStats(section, total, done) {
    const s = this.getSectionStats();
    s[section] = { total, done };
    this._set('sectionStats', s);
  },

  // --- LeetCode counter ---
  getLeetcode() {
    return this._get('leetcode') || 0;
  },

  setLeetcode(n) {
    this._set('leetcode', n);
  },

  // --- Papers read counter ---
  getPapersRead() {
    return this._get('papers') || 0;
  },

  setPapersRead(n) {
    this._set('papers', n);
  },

  // --- Blog posts counter ---
  getBlogPosts() {
    return this._get('blogs') || 0;
  },

  setBlogPosts(n) {
    this._set('blogs', n);
  },

  // --- OSS contributions counter ---
  getOSSContributions() {
    return this._get('oss') || 0;
  },

  setOSSContributions(n) {
    this._set('oss', n);
  },

  // --- Export / Import ---
  exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('ret_')) data[k] = localStorage.getItem(k);
    }
    return JSON.stringify(data, null, 2);
  },

  importAll(json) {
    const data = JSON.parse(json);
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith('ret_')) localStorage.setItem(k, v);
    }
  }
};
