const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const scanTable = $('#scanTable');
const tableBody = $('#scanTable tbody');
const tableHeader = $('#scanHeader');
const mobileCards = $('#mobileCards');
const statusEl = $('#status');
const errorsEl = $('#errors');
const scanBtn = $('#scanBtn');
const refreshBtn = $('#refreshBtn');
const marketClock = $('#market-clock');

const STORAGE_KEYS = {
  screeners: 'stockTimingRadar.screeners.v3',
  active: 'stockTimingRadar.activeSettings.v3'
};

const columnDefs = [
  { key: 'symbol', label: 'Ticker', sortKey: 'symbol', align: 'left', group: 'base', defaultVisible: true },
  { key: 'score', label: 'Score', sortKey: 'score', align: 'right', group: 'base', defaultVisible: true },
  { key: 'signal', label: 'Signal', sortKey: 'signal', align: 'left', group: 'base', defaultVisible: true },
  { key: 'close', label: 'Last Price', sortKey: 'close', align: 'right', group: 'price', defaultVisible: true },
  { key: 'ema5', label: 'EMA5 Price', sortKey: 'ema5', align: 'right', group: 'ema', defaultVisible: true },
  { key: 'pctVsEma5', label: 'vs EMA 5', sortKey: 'pctVsEma5', align: 'right', group: 'gap', defaultVisible: true },
  { key: 'ema20', label: 'EMA20 Price', sortKey: 'ema20', align: 'right', group: 'ema', defaultVisible: true },
  { key: 'pctVsEma20', label: 'vs EMA 20', sortKey: 'pctVsEma20', align: 'right', group: 'gap', defaultVisible: true },
  { key: 'ema89', label: 'EMA89 Price', sortKey: 'ema89', align: 'right', group: 'ema', defaultVisible: true },
  { key: 'pctVsEma89', label: 'vs EMA 89', sortKey: 'pctVsEma89', align: 'right', group: 'gap', defaultVisible: true },
  { key: 'ema200', label: 'EMA200 Price', sortKey: 'ema200', align: 'right', group: 'ema', defaultVisible: true },
  { key: 'pctVsEma200', label: 'vs EMA 200', sortKey: 'pctVsEma200', align: 'right', group: 'gap', defaultVisible: true },
  { key: 'rsi14', label: 'RSI', sortKey: 'rsi14', align: 'right', group: 'indicator', defaultVisible: true },
  { key: 'macd1226', label: 'MACD 12,26', sortKey: 'macd1226', align: 'right', group: 'macd', defaultVisible: true },
  { key: 'macdSignal9', label: 'MACD Signal 9', sortKey: 'macdSignal9', align: 'right', group: 'macd', defaultVisible: false },
  { key: 'macdHist', label: 'MACD Hist', sortKey: 'macdHist', align: 'right', group: 'macd', defaultVisible: false },
  { key: 'volumeRatio20', label: 'Vol/20D', sortKey: 'volumeRatio20', align: 'right', group: 'indicator', defaultVisible: true },
  { key: 'high52w', label: '52 Wks High', sortKey: 'high52w', align: 'right', group: 'range', defaultVisible: true },
  { key: 'low52w', label: '52 Wks Low', sortKey: 'low52w', align: 'right', group: 'range', defaultVisible: true }
];


const fundamentalColumnDefs = [
  { key: 'symbol', label: 'Ticker', sortKey: 'symbol', align: 'left', group: 'base', defaultVisible: true },
  { key: 'fundamentalScore', label: 'Fund. Score', sortKey: 'fundamentalScore', align: 'right', group: 'base', defaultVisible: true },
  { key: 'fundamentalSignal', label: 'Signal', sortKey: 'fundamentalSignal', align: 'left', group: 'base', defaultVisible: true },
  { key: 'latestQuarter', label: 'Latest Quarter', sortKey: 'latestQuarter', align: 'left', group: 'fundamental', defaultVisible: true },
  { key: 'earningsDate', label: 'Earnings Date', sortKey: 'earningsDate', align: 'left', group: 'fundamental', defaultVisible: true },
  { key: 'daysToNextQuarter', label: 'Days to Next Q', sortKey: 'daysToNextQuarter', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenue', label: 'Revenue', sortKey: 'revenue', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenuePrevQuarter', label: 'Rev Prev Q', sortKey: 'revenuePrevQuarter', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenueYearAgo', label: 'Rev Year Ago', sortKey: 'revenueYearAgo', align: 'right', group: 'fundamental', defaultVisible: false },
  { key: 'estimatedRevenue', label: 'Est. Revenue', sortKey: 'estimatedRevenue', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenueSurprisePct', label: 'Rev Surprise %', sortKey: 'revenueSurprisePct', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenueQoQ', label: 'Rev QoQ', sortKey: 'revenueQoQ', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'revenueYoY', label: 'Rev YoY', sortKey: 'revenueYoY', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'netIncome', label: 'Net Income', sortKey: 'netIncome', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'netIncomePrevQuarter', label: 'NI Prev Q', sortKey: 'netIncomePrevQuarter', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'netIncomeYearAgo', label: 'NI Year Ago', sortKey: 'netIncomeYearAgo', align: 'right', group: 'fundamental', defaultVisible: false },
  { key: 'profitQoQ', label: 'Profit QoQ', sortKey: 'profitQoQ', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'profitYoY', label: 'Profit YoY', sortKey: 'profitYoY', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'eps', label: 'EPS', sortKey: 'eps', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'epsPrevQuarter', label: 'EPS Prev Q', sortKey: 'epsPrevQuarter', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'epsYearAgo', label: 'EPS Year Ago', sortKey: 'epsYearAgo', align: 'right', group: 'fundamental', defaultVisible: false },
  { key: 'estimatedEps', label: 'Est. EPS', sortKey: 'estimatedEps', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'epsSurprisePct', label: 'EPS Surprise %', sortKey: 'epsSurprisePct', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'epsQoQ', label: 'EPS QoQ', sortKey: 'epsQoQ', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'epsYoY', label: 'EPS YoY', sortKey: 'epsYoY', align: 'right', group: 'fundamental', defaultVisible: true },
  { key: 'targetMeanPrice', label: 'Target Mean', sortKey: 'targetMeanPrice', align: 'right', group: 'target', defaultVisible: true },
  { key: 'targetUpsidePct', label: 'Upside to Target', sortKey: 'targetUpsidePct', align: 'right', group: 'target', defaultVisible: true },
  { key: 'targetAnalystCount', label: 'Analysts', sortKey: 'targetAnalystCount', align: 'right', group: 'target', defaultVisible: true }
];

const defaultFundColumns = Object.fromEntries(fundamentalColumnDefs.map(col => [col.key, col.defaultVisible]));

const defaultColumns = Object.fromEntries(columnDefs.map(col => [col.key, col.defaultVisible]));

const compactColumns = {
  symbol: true,
  score: true,
  signal: true,
  close: true,
  ema5: false,
  pctVsEma5: false,
  ema20: true,
  pctVsEma20: true,
  ema89: false,
  pctVsEma89: false,
  ema200: true,
  pctVsEma200: true,
  rsi14: true,
  macd1226: true,
  macdSignal9: false,
  macdHist: false,
  volumeRatio20: true,
  high52w: true,
  low52w: true
};

const emaFocusColumns = {
  symbol: true,
  score: true,
  signal: false,
  close: true,
  ema5: true,
  pctVsEma5: true,
  ema20: true,
  pctVsEma20: true,
  ema89: true,
  pctVsEma89: true,
  ema200: true,
  pctVsEma200: true,
  rsi14: false,
  macd1226: true,
  macdSignal9: true,
  macdHist: true,
  volumeRatio20: false,
  high52w: false,
  low52w: false
};

const state = {
  rows: [],
  filteredRows: [],
  sortKey: 'score',
  sortDir: 'desc',
  lastSymbols: '',
  columns: { ...defaultColumns },
  fundColumns: { ...defaultFundColumns },
  activeTab: 'technical',
  scannerData: null,
  quotes: {}
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function formatPct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  const sign = Number(value) > 0 ? '+' : '';
  return `${sign}${formatNumber(value, 2)}%`;
}

function clsForPct(value) {
  if (value === null || value === undefined) return '';
  if (value > 0) return 'good';
  if (value < 0) return 'bad';
  return '';
}

function clsForRsi(value) {
  if (value === null || value === undefined) return '';
  if (value >= 75) return 'hot';
  if (value >= 65) return 'warn';
  if (value >= 45) return 'good';
  if (value < 35) return 'bad';
  return 'warn';
}

function clsForMacd(value) {
  if (value === null || value === undefined) return '';
  if (value > 0) return 'good';
  if (value < 0) return 'bad';
  return 'warn';
}

function signalClass(signal = '') {
  const text = String(signal || '');
  if (text.includes('Fundamental Beat') || text.includes('Strong')) return 'fund-strong';
  if (text.includes('Solid')) return 'fund-watch';
  if (text.includes('Mixed')) return 'fund-mixed';
  if (text.includes('WEAK') || text.includes('AVOID') || text.includes('Weak')) return 'fund-weak';
  if (text.includes('BUY')) return 'buy';
  if (text.includes('WATCH')) return 'watch';
  if (text.includes('HOT')) return 'hot';
  return 'neutral';
}

function setStatus(text) {
  statusEl.textContent = text;
}

function setScreenerStatus(text) {
  $('#screenerStatus').textContent = text;
}

function parseSymbols() {
  return $('#symbols').value
    .replace(/\n/g, ',')
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

function getActiveColumnDefs() {
  return state.activeTab === 'fundamental' ? fundamentalColumnDefs : columnDefs;
}

function getActiveColumnState() {
  return state.activeTab === 'fundamental' ? state.fundColumns : state.columns;
}

function getVisibleColumns() {
  const defs = getActiveColumnDefs();
  const colState = getActiveColumnState();
  const visible = defs.filter(col => colState[col.key]);
  if (!visible.length) return [defs[0]];
  return visible;
}

function classForColumn(col) {
  const classes = [];
  if (col.align === 'right') classes.push('num');
  if (col.group) classes.push(`col-${col.group}`);
  return classes.join(' ');
}

function renderValue(row, col) {
  const value = row[col.key];
  if (value === null || value === undefined || value === '') return 'N/A';
  if (['pctVsEma5', 'pctVsEma20', 'pctVsEma89', 'pctVsEma200', 'revenueSurprisePct', 'revenueQoQ', 'revenueYoY', 'profitSurprisePct', 'profitQoQ', 'profitYoY', 'epsSurprisePct', 'epsSurprisePct', 'epsQoQ', 'epsYoY', 'targetUpsidePct'].includes(col.key)) return formatPct(value);
  if (col.key === 'rsi14') return formatNumber(value, 1);
  if (col.key === 'volumeRatio20') return `${formatNumber(value, 2)}x`;
  if (['macd1226', 'macdSignal9', 'macdHist', 'eps', 'estimatedEps', 'epsPrevQuarter', 'epsYearAgo'].includes(col.key)) return formatNumber(value, 3);
  if (['revenue', 'revenuePrevQuarter', 'revenueYearAgo', 'estimatedRevenue', 'netIncome', 'netIncomePrevQuarter', 'netIncomeYearAgo'].includes(col.key)) return formatBig(value);
  if (typeof value === 'string') return escapeHtml(value);
  return formatNumber(value);
}

function valueClass(row, col) {
  if (['pctVsEma5', 'pctVsEma20', 'pctVsEma89', 'pctVsEma200', 'revenueSurprisePct', 'revenueQoQ', 'revenueYoY', 'profitSurprisePct', 'profitQoQ', 'profitYoY', 'epsSurprisePct', 'epsQoQ', 'epsYoY', 'targetUpsidePct'].includes(col.key)) return clsForPct(row[col.key]);
  if (col.key === 'rsi14') return clsForRsi(row.rsi14);
  if (['macd1226', 'macdSignal9', 'macdHist'].includes(col.key)) return clsForMacd(row[col.key]);
  return '';
}

function renderTableHeader() {
  const visibleCols = getVisibleColumns();
  const approxColumnWidth = state.activeTab === 'fundamental' ? 132 : 118;
  if (scanTable) {
    scanTable.className = state.activeTab === 'fundamental' ? 'table-fundamental' : 'table-technical';
    scanTable.style.minWidth = `${Math.max(window.innerWidth - 72, visibleCols.length * approxColumnWidth)}px`;
  }
  tableHeader.innerHTML = visibleCols.map(col => {
    const sorted = state.sortKey === (col.sortKey || col.key) ? ` <span class="sort-mark">${state.sortDir === 'asc' ? '▲' : '▼'}</span>` : '';
    return `<th data-sort="${col.sortKey || col.key}" class="${classForColumn(col)}">${escapeHtml(col.label)}${sorted}</th>`;
  }).join('');

  tableHeader.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      else {
        state.sortKey = key;
        state.sortDir = key === 'symbol' || key === 'signal' ? 'asc' : 'desc';
      }
      applyFilters();
      saveActiveSettings();
    });
  });
}

function renderColumnToggles() {
  const defs = getActiveColumnDefs();
  const colState = getActiveColumnState();
  $('#columnToggles').innerHTML = defs.map(col => {
    const visible = Boolean(colState[col.key]);
    return `
      <button class="column-toggle ${visible ? 'active' : 'inactive'}" data-column="${col.key}">
        <span>${escapeHtml(col.label)}</span>
        <strong>${visible ? 'ON' : 'OFF'}</strong>
      </button>`;
  }).join('');

  $('#columnToggles').querySelectorAll('button[data-column]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.column;
      if (state.activeTab === 'fundamental') state.fundColumns[key] = !state.fundColumns[key];
      else state.columns[key] = !state.columns[key];
      renderColumnToggles();
      applyFilters();
      saveActiveSettings();
    });
  });
}

function setColumns(nextColumns) {
  if (state.activeTab === 'fundamental') state.fundColumns = { ...defaultFundColumns, ...nextColumns };
  else state.columns = { ...defaultColumns, ...nextColumns };
  renderColumnToggles();
  applyFilters();
  saveActiveSettings();
}

function getSettingsFromUi() {
  return {
    symbolsText: $('#symbols').value,
    range: $('#range').value,
    minScore: $('#minScore').value,
    filters: {
      above200: $('#filterAbove200').checked,
      emaStack: $('#filterEmaStack').checked,
      sweetRsi: $('#filterSweetRsi').checked
    },
    columns: { ...state.columns },
    fundColumns: { ...state.fundColumns },
    activeTab: state.activeTab,
    sortKey: state.sortKey,
    sortDir: state.sortDir
  };
}

function applySettingsToUi(settings = {}) {
  if (settings.symbolsText !== undefined) $('#symbols').value = settings.symbolsText;
  if (settings.range !== undefined) $('#range').value = settings.range;
  if (settings.minScore !== undefined) $('#minScore').value = settings.minScore;
  if (settings.filters) {
    $('#filterAbove200').checked = Boolean(settings.filters.above200);
    $('#filterEmaStack').checked = Boolean(settings.filters.emaStack);
    $('#filterSweetRsi').checked = Boolean(settings.filters.sweetRsi);
  }
  state.columns = { ...defaultColumns, ...(settings.columns || {}) };
  state.fundColumns = { ...defaultFundColumns, ...(settings.fundColumns || {}) };
  state.activeTab = settings.activeTab || 'technical';
  updateTabs();
  state.sortKey = settings.sortKey || (state.activeTab === 'fundamental' ? 'fundamentalScore' : 'score');
  state.sortDir = settings.sortDir || 'desc';
  renderColumnToggles();
  applyFilters();
}

function getScreeners() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.screeners) || '{}') || {};
  } catch (_) {
    return {};
  }
}

function setScreeners(screeners) {
  localStorage.setItem(STORAGE_KEYS.screeners, JSON.stringify(screeners));
}

function updateSavedScreenersDropdown(selectedName = '') {
  const select = $('#savedScreeners');
  const screeners = getScreeners();
  const names = Object.keys(screeners).sort((a, b) => a.localeCompare(b));
  select.innerHTML = names.length
    ? names.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')
    : '<option value="">ยังไม่มี saved screener</option>';
  if (selectedName && names.includes(selectedName)) select.value = selectedName;
}

function saveActiveSettings() {
  localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(getSettingsFromUi()));
}

function restoreActiveSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.active);
    if (!raw) return false;
    applySettingsToUi(JSON.parse(raw));
    return true;
  } catch (_) {
    return false;
  }
}

function saveNamedScreener() {
  const name = $('#screenerName').value.trim();
  if (!name) {
    setScreenerStatus('ใส่ชื่อ screener ก่อน เช่น AI Infra');
    return;
  }
  const screeners = getScreeners();
  screeners[name] = getSettingsFromUi();
  setScreeners(screeners);
  updateSavedScreenersDropdown(name);
  setScreenerStatus(`Saved: ${name}`);
}

function loadNamedScreener() {
  const name = $('#savedScreeners').value || $('#screenerName').value.trim();
  const screeners = getScreeners();
  if (!name || !screeners[name]) {
    setScreenerStatus('ยังไม่ได้เลือก screener ที่จะโหลด');
    return;
  }
  $('#screenerName').value = name;
  applySettingsToUi(screeners[name]);
  saveActiveSettings();
  setScreenerStatus(`Loaded: ${name}`);
  scan();
}

function deleteNamedScreener() {
  const name = $('#savedScreeners').value || $('#screenerName').value.trim();
  const screeners = getScreeners();
  if (!name || !screeners[name]) {
    setScreenerStatus('ยังไม่ได้เลือก screener ที่จะลบ');
    return;
  }
  delete screeners[name];
  setScreeners(screeners);
  updateSavedScreenersDropdown();
  setScreenerStatus(`Deleted: ${name}`);
}

function applyFilters() {
  const minScore = Number($('#minScore').value || 0);
  const above200 = $('#filterAbove200').checked;
  const emaStack = $('#filterEmaStack').checked;
  const sweetRsi = $('#filterSweetRsi').checked;

  let rows = [...state.rows];
  if (state.activeTab === 'fundamental') {
    rows = rows.filter(row => Number(row.fundamentalScore ?? 0) >= minScore);
  } else {
    rows = rows.filter(row => Number(row.score || 0) >= minScore);
    if (above200) rows = rows.filter(row => Number(row.pctVsEma200) > 0);
    if (emaStack) rows = rows.filter(row => Number(row.ema20) > Number(row.ema89));
    if (sweetRsi) rows = rows.filter(row => Number(row.rsi14) >= 45 && Number(row.rsi14) <= 65);
  }

  rows.sort((a, b) => {
    const key = state.sortKey;
    const va = a[key];
    const vb = b[key];
    let result;
    if (typeof va === 'string' || typeof vb === 'string') {
      result = String(va || '').localeCompare(String(vb || ''));
    } else {
      result = Number(va ?? -999999) - Number(vb ?? -999999);
    }
    return state.sortDir === 'asc' ? result : -result;
  });

  state.filteredRows = rows;
  renderTableHeader();
  renderTable(rows);
  renderMobileCards(rows);
  renderSummary(rows);
}

function renderTable(rows) {
  const visibleCols = getVisibleColumns();
  if (!rows.length) {
    tableBody.innerHTML = `<tr><td colspan="${visibleCols.length}" class="muted">ยังไม่มีหุ้นผ่าน filter</td></tr>`;
    return;
  }

  tableBody.innerHTML = rows.map(row => {
    const cells = visibleCols.map(col => renderCell(row, col)).join('');
    return `<tr data-symbol="${escapeHtml(row.symbol)}">${cells}</tr>`;
  }).join('');

  tableBody.querySelectorAll('tr[data-symbol]').forEach(row => {
    row.addEventListener('click', () => loadSymbol(row.dataset.symbol));
  });
}

function renderCell(row, col) {
  const baseClass = classForColumn(col);
  if (col.key === 'symbol') {
    return `<td class="${baseClass}"><strong>${escapeHtml(row.symbol)}</strong><br><span class="muted">${escapeHtml(row.exchange || '')} ${escapeHtml(row.currency || '')}</span></td>`;
  }
  if (col.key === 'score' || col.key === 'fundamentalScore') {
    return `<td class="${baseClass} score">${row[col.key] ?? 'N/A'}</td>`;
  }
  if (col.key === 'signal' || col.key === 'fundamentalSignal') {
    const sig = row[col.key] || 'Insufficient data';
    return `<td class="${baseClass}"><span class="pill ${signalClass(sig)}">${escapeHtml(sig)}</span></td>`;
  }
  return `<td class="${baseClass} ${valueClass(row, col)}">${renderValue(row, col)}</td>`;
}

function renderMobileCards(rows) {
  if (!mobileCards) return;
  const visibleCols = getVisibleColumns().filter(col => !['symbol', 'score', 'signal', 'fundamentalScore', 'fundamentalSignal'].includes(col.key));
  if (!rows.length) {
    mobileCards.innerHTML = '<div class="mobile-empty muted">ยังไม่มีหุ้นผ่าน filter</div>';
    return;
  }
  mobileCards.innerHTML = rows.map(row => {
    const metricItems = visibleCols.map(col => `
      <div class="mobile-metric ${col.group ? `metric-${col.group}` : ''}">
        <span>${escapeHtml(col.label)}</span>
        <strong class="${valueClass(row, col)}">${renderValue(row, col)}</strong>
      </div>`).join('');
    return `
      <article class="stock-card" data-symbol="${escapeHtml(row.symbol)}">
        <div class="stock-card-top">
          <div>
            <h3>${escapeHtml(row.symbol)}</h3>
            <p>${escapeHtml(row.exchange || '')} ${escapeHtml(row.currency || '')}</p>
          </div>
          <div class="stock-card-score">
            <span>${state.activeTab === 'fundamental' ? 'Fund. Score' : 'Score'}</span>
            <strong>${state.activeTab === 'fundamental' ? (row.fundamentalScore ?? 'N/A') : (row.score ?? '-')}</strong>
          </div>
        </div>
        <div class="stock-card-signal"><span class="pill ${signalClass(state.activeTab === 'fundamental' ? row.fundamentalSignal : row.signal)}">${escapeHtml((state.activeTab === 'fundamental' ? row.fundamentalSignal : row.signal) || '-')}</span></div>
        <div class="mobile-metric-grid">${metricItems}</div>
      </article>`;
  }).join('');

  mobileCards.querySelectorAll('.stock-card[data-symbol]').forEach(card => {
    card.addEventListener('click', () => loadSymbol(card.dataset.symbol));
  });
}

function renderSummary(rows) {
  const best = rows[0];
  if (state.activeTab === 'fundamental') {
    $('#bestSetup').textContent = best ? `${best.symbol} ${best.fundamentalScore ?? 'N/A'}` : '-';
    $('#buyWatchCount').textContent = rows.filter(r => (r.fundamentalSignal || '').includes('Strong') || (r.fundamentalSignal || '').includes('Solid')).length;
    $('#hotCount').textContent = rows.filter(r => (r.fundamentalSignal || '').includes('Weak') || (r.fundamentalSignal || '').includes('Insufficient')).length;
  } else {
    $('#bestSetup').textContent = best ? `${best.symbol} ${best.score}` : '-';
    $('#buyWatchCount').textContent = rows.filter(r => (r.signal || '').includes('BUY') || (r.signal || '').includes('WATCH')).length;
    $('#hotCount').textContent = rows.filter(r => (r.signal || '').includes('HOT') || Number(r.rsi14) >= 75).length;
  }
  $('#lastScan').textContent = new Date().toLocaleTimeString();
}

function renderErrors(errors = []) {
  if (!errors.length) {
    errorsEl.innerHTML = '';
    return;
  }
  errorsEl.innerHTML = `<strong>บางตัวดึงข้อมูลไม่ได้:</strong> ${errors.map(e => `${escapeHtml(e.symbol)}: ${escapeHtml(e.error)}`).join(' | ')}`;
}

async function loadScannerJson(force = false) {
  if (state.scannerData && !force) return state.scannerData;
  const url = `data/scanner.json?v=${force ? Date.now() : 'static'}`;
  const res = await fetch(url, { cache: force ? 'reload' : 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();
  if (!res.ok) throw new Error(`โหลด scanner.json ไม่สำเร็จ: HTTP ${res.status}`);
  const first = raw.trim().slice(0, 1);
  if (first === '<') {
    throw new Error('data/scanner.json ไม่เจอหรือ workflow ยังไม่ generate — ได้ HTML แทน JSON');
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`scanner.json ไม่ใช่ JSON ที่ถูกต้อง: ${err.message || err}`);
  }
  state.scannerData = data;
  state.quotes = data.quotes || {};
  return data;
}

async function scan(force = false) {
  const symbols = parseSymbols();
  if (!symbols.length) return;
  state.lastSymbols = symbols.join(',');
  scanBtn.disabled = true;
  refreshBtn.disabled = true;
  setStatus(`กำลังโหลดข้อมูล static ${symbols.length} ตัว...`);
  errorsEl.innerHTML = '';
  saveActiveSettings();
  try {
    const data = await loadScannerJson(force);
    const wanted = new Set(symbols.map(s => s.toUpperCase()));
    state.rows = (data.rows || []).filter(row => wanted.has(String(row.symbol || '').toUpperCase()));
    marketClock.textContent = `${state.rows.length} tickers`;
    applyFilters();
    renderErrors((data.errors || []).filter(e => wanted.has(String(e.symbol || '').toUpperCase())));
    setStatus(`โหลดสำเร็จ ${state.rows.length} ตัว • ${data.generatedAt || ''}`);
    if (state.rows[0]) loadSymbol(state.rows[0].symbol, false);
  } catch (err) {
    setStatus('โหลดข้อมูลไม่สำเร็จ');
    errorsEl.textContent = err.message || String(err);
  } finally {
    scanBtn.disabled = false;
    refreshBtn.disabled = false;
  }
}

async function loadSymbol(symbol, updateInput = true) {
  if (!symbol) return;
  if (updateInput) $('#singleSymbol').value = symbol;
  $('#detailTitle').textContent = `${symbol} detail`;
  $('#detailSub').textContent = 'กำลังโหลด chart และ indicators จาก scanner.json...';
  try {
    const data = await loadScannerJson(false);
    const quote = (data.quotes || {})[symbol] || (data.quotes || {})[symbol.toUpperCase()];
    if (!quote) throw new Error(`${symbol}: ยังไม่มี detail ใน data/scanner.json — เพิ่มใน watchlist.txt แล้ว Run workflow ใหม่`);
    renderDetail(quote);
  } catch (err) {
    $('#detailSub').textContent = err.message || String(err);
  }
}

function renderDetail(data) {
  const latest = data.latest;
  $('#detailTitle').textContent = `${latest.symbol} — ${latest.close} ${latest.currency || ''}`;
  $('#detailSub').textContent = `Score ${latest.score}/100 • RSI ${formatNumber(latest.rsi14, 1)} • MACD ${formatNumber(latest.macd1226, 3)} • ${latest.exchange || ''} • 52 Wks Low/High ${formatNumber(latest.low52w)} - ${formatNumber(latest.high52w)}`;
  const pill = $('#detailSignal');
  pill.textContent = latest.signal;
  pill.className = `signal-pill ${signalClass(latest.signal)}`;

  renderScoreBars(latest.scoreParts || {});
  $('#reasons').innerHTML = (latest.reasons || []).slice(0, 9).map(r => `<li>${escapeHtml(r)}</li>`).join('');
  drawChart(data.series || [], latest.symbol);
  renderFundamentalDetail(data);
}

function formatBig(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  const n = Number(value);
  if (Math.abs(n) >= 1e12) return `${formatNumber(n / 1e12, 2)}T`;
  if (Math.abs(n) >= 1e9) return `${formatNumber(n / 1e9, 2)}B`;
  if (Math.abs(n) >= 1e6) return `${formatNumber(n / 1e6, 2)}M`;
  return formatNumber(n, 0);
}

function formatMetricValue(value, kind = 'money') {
  if (kind === 'eps') return value === null || value === undefined ? 'N/A' : formatNumber(value, 3);
  if (kind === 'days') return value === null || value === undefined ? 'N/A' : String(value);
  if (kind === 'pct') return value === null || value === undefined ? 'N/A' : formatPct(value);
  return formatBig(value);
}

function metricLine(label, value, kind = 'money', extraClass = '', sublabel = '') {
  return `
    <div class="statement-line ${extraClass}">
      <span>${escapeHtml(label)}</span>
      <div>
        <strong class="${extraClass}">${escapeHtml(formatMetricValue(value, kind))}</strong>
        ${sublabel ? `<small>${escapeHtml(sublabel)}</small>` : ''}
      </div>
    </div>`;
}

function statementCardHtml(title, cfg) {
  const kind = cfg.kind || 'money';
  return `
    <section class="statement-card">
      <div class="statement-card-head">
        <h4>${escapeHtml(title)}</h4>
        <span class="mini-chip">${escapeHtml(cfg.period || 'Latest')}</span>
      </div>
      <div class="statement-main">${escapeHtml(formatMetricValue(cfg.current, kind))}</div>
      <div class="statement-lines">
        ${metricLine('Prev Q', cfg.prev, kind, '', cfg.prevLabel || '')}
        ${metricLine('Year Ago', cfg.yearAgo, kind, '', cfg.yearAgoLabel || '')}
        ${metricLine('Estimate', cfg.estimate, kind, '', cfg.estimateStatus || '')}
        ${metricLine('Surprise', cfg.surprise, 'pct', clsForPct(cfg.surprise), 'vs estimate')}
        ${metricLine('QoQ', cfg.qoq, 'pct', clsForPct(cfg.qoq), '')}
        ${metricLine('YoY', cfg.yoy, 'pct', clsForPct(cfg.yoy), '')}
      </div>
    </section>`;
}

function targetRailHtml(f, currentPrice) {
  const rawItems = [
    ['Low', f.targetLowPrice],
    ['Current', currentPrice],
    ['Mean', f.targetMeanPrice],
    ['Median', f.targetMedianPrice],
    ['High', f.targetHighPrice]
  ].filter(([, value]) => value !== null && value !== undefined && !Number.isNaN(Number(value)));

  if (!rawItems.length) {
    return `
      <div class="target-empty">
        <strong>Price target ยังไม่เชื่อมสำเร็จ</strong>
        <p>ถ้าเห็น N/A แปลว่า source ไม่ส่งค่า หรือ Yahoo endpoint ฝั่ง target ถูกบล็อกในรอบนั้น</p>
      </div>`;
  }

  const values = rawItems.map(([, value]) => Number(value));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const pad = Math.max((maxValue - minValue) * 0.12, maxValue * 0.04 || 1);
  const scaleMin = minValue - pad;
  const scaleMax = maxValue + pad;
  const pos = (value) => `${Math.max(0, Math.min(100, ((Number(value) - scaleMin) / (scaleMax - scaleMin || 1)) * 100))}%`;

  return `
    <div class="target-rail-wrap">
      <div class="target-scale-row">
        <span>${escapeHtml(formatNumber(scaleMin, 2))}</span>
        <span>${escapeHtml(formatNumber(scaleMax, 2))}</span>
      </div>
      <div class="target-rail">
        <div class="target-rail-line"></div>
        ${rawItems.map(([label, value]) => `
          <div class="target-marker target-marker-${label.toLowerCase()}" style="left:${pos(value)}">
            <span class="marker-dot"></span>
            <div class="marker-label">
              <strong>${escapeHtml(label)}</strong>
              <small>${escapeHtml(formatNumber(value, 2))}</small>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderFundamentalDetail(data) {
  const f = data.fundamental || data.latest || {};
  const latest = data.latest || {};
  const reasons = f.fundamentalReasons || [];
  const highlights = f.fundamentalHighlights || [];
  const detail = $('#fundamentalDetail');
  if (!detail) return;

  const currentPrice = latest.close;
  const analystCount = f.targetAnalystCount ?? null;
  const allTargetsAbove = analystCount !== null && analystCount !== undefined && f.targetLowPrice !== null && f.targetLowPrice !== undefined && currentPrice !== null && currentPrice !== undefined && Number(f.targetLowPrice) > Number(currentPrice);
  const allTargetsBelow = analystCount !== null && analystCount !== undefined && f.targetHighPrice !== null && f.targetHighPrice !== undefined && currentPrice !== null && currentPrice !== undefined && Number(f.targetHighPrice) < Number(currentPrice);
  const aboveCount = allTargetsAbove ? analystCount : null;
  const belowCount = allTargetsBelow ? analystCount : null;

  detail.innerHTML = `
    <div class="fund-card fund-card-premium">
      <div class="fund-head fund-head-premium">
        <div>
          <p class="fund-kicker">Fundamental Dashboard</p>
          <h3>${escapeHtml(latest.symbol || '')} earnings snapshot</h3>
          <p>ดีไซน์ใหม่ให้อ่านงบง่ายขึ้น: มี latest / prev quarter / year ago / estimate ในการ์ดเดียว</p>
        </div>
        <div class="fund-head-side">
          <span class="pill ${signalClass(f.fundamentalSignal || '')}">${escapeHtml(f.fundamentalSignal || 'Insufficient data')}</span>
          <small>Source: ${escapeHtml(f.fundamentalSource || 'N/A')}</small>
        </div>
      </div>

      <div class="fund-hero-grid">
        <div class="hero-mini-card"><span>Fundamental Score</span><strong>${f.fundamentalScore ?? 'N/A'}</strong><small>/100 rules-based</small></div>
        <div class="hero-mini-card"><span>Latest Quarter</span><strong>${escapeHtml(f.latestQuarter || 'N/A')}</strong><small>actual reported quarter</small></div>
        <div class="hero-mini-card"><span>Earnings Date</span><strong>${escapeHtml(f.earningsDate || 'N/A')}</strong><small>${f.daysToNextQuarter === null || f.daysToNextQuarter === undefined ? 'reported date / no next date yet' : `${f.daysToNextQuarter} days to next`}</small></div>
        <div class="hero-mini-card"><span>Price Target Status</span><strong>${escapeHtml(f.priceTargetStatus || 'N/A')}</strong><small>${f.targetAnalystCount ? `${f.targetAnalystCount} analyst opinions` : 'analyst count unavailable'}</small></div>
      </div>

      <div class="fund-note-strip">
        <div class="note-pill note-info">N/A ใน Est. Revenue = ${escapeHtml(f.estimatedRevenueStatus || 'ไม่มี consensus estimate หรือ source ไม่ส่งค่า')}</div>
        <div class="note-pill note-info">N/A ใน Est. EPS = ${escapeHtml(f.estimatedEpsStatus || 'ไม่มี consensus estimate หรือ source ไม่ส่งค่า')}</div>
        <div class="note-pill note-info">ตัวเลขในตารางย่อเป็นหน่วย M / B / T เพื่อให้อ่านง่าย</div>
      </div>

      <div class="statement-card-grid">
        ${statementCardHtml('Revenue', {
          kind: 'money',
          period: f.latestQuarter,
          current: f.revenue,
          prev: f.revenuePrevQuarter,
          prevLabel: f.revenuePrevQuarterLabel,
          yearAgo: f.revenueYearAgo,
          yearAgoLabel: f.revenueYearAgoLabel,
          estimate: f.estimatedRevenue,
          estimateStatus: f.estimatedRevenueStatus,
          surprise: f.revenueSurprisePct,
          qoq: f.revenueQoQ,
          yoy: f.revenueYoY,
        })}
        ${statementCardHtml('Net Income', {
          kind: 'money',
          period: f.latestQuarter,
          current: f.netIncome,
          prev: f.netIncomePrevQuarter,
          prevLabel: f.netIncomePrevQuarterLabel,
          yearAgo: f.netIncomeYearAgo,
          yearAgoLabel: f.netIncomeYearAgoLabel,
          estimate: f.estimatedNetIncome,
          estimateStatus: 'Estimate ไม่มีใน source นี้',
          surprise: f.profitSurprisePct,
          qoq: f.profitQoQ,
          yoy: f.profitYoY,
        })}
        ${statementCardHtml('EPS', {
          kind: 'eps',
          period: f.latestQuarter,
          current: f.eps,
          prev: f.epsPrevQuarter,
          prevLabel: f.epsPrevQuarterLabel,
          yearAgo: f.epsYearAgo,
          yearAgoLabel: f.epsYearAgoLabel,
          estimate: f.estimatedEps,
          estimateStatus: f.estimatedEpsStatus,
          surprise: f.epsSurprisePct,
          qoq: f.epsQoQ,
          yoy: f.epsYoY,
        })}
      </div>

      <div class="fund-two-col fund-two-col-premium">
        <div class="insight-card">
          <h4>What stood out</h4>
          <ul>${highlights.map(x => `<li>${escapeHtml(x)}</li>`).join('') || '<li>Insufficient data</li>'}</ul>
        </div>
        <div class="insight-card">
          <h4>AI view</h4>
          <ul>${reasons.map(x => `<li>${escapeHtml(x)}</li>`).join('') || '<li>ข้อมูลพื้นฐานไม่พอ ยังไม่ควรสรุปเชิงพื้นฐาน</li>'}</ul>
        </div>
      </div>

      <section class="target-section">
        <div class="target-section-head">
          <div>
            <h4>Analyst Target View</h4>
            <p>เปลี่ยนจากกล่องธรรมดาเป็นเส้นตรงแบบอ่านระยะ current → target ชัดขึ้น</p>
          </div>
          <span class="mini-chip ${f.priceTargetConnected ? 'chip-good' : 'chip-muted'}">${escapeHtml(f.priceTargetConnected ? 'Price target connected' : 'No target data')}</span>
        </div>
        <div class="target-summary-grid">
          <div class="target-mini-card"><span>Current</span><strong>${formatNumber(currentPrice, 2)}</strong></div>
          <div class="target-mini-card"><span>Mean Target</span><strong>${formatNumber(f.targetMeanPrice, 2)}</strong><small class="${clsForPct(f.targetUpsidePct)}">${formatPct(f.targetUpsidePct)}</small></div>
          <div class="target-mini-card"><span>Analysts</span><strong>${f.targetAnalystCount ?? 'N/A'}</strong><small>consensus count</small></div>
          <div class="target-mini-card"><span>Above / Below Current</span><strong>${aboveCount ?? 'N/A'} / ${belowCount ?? 'N/A'}</strong><small>มีค่าเมื่อทั้ง range อยู่เหนือ/ต่ำกว่าราคาปัจจุบัน; ถ้า N/A แปลว่า source ไม่มี per-analyst split</small></div>
        </div>
        ${targetRailHtml(f, currentPrice)}
      </section>
    </div>`;
}

function renderScoreBars(parts) {
  const max = { trend: 40, momentum: 30, rsi: 20, volume: 10 };
  const labels = { trend: 'Trend', momentum: 'Momentum', rsi: 'RSI', volume: 'Volume' };
  $('#scoreBars').innerHTML = Object.keys(max).map(k => {
    const value = Number(parts[k] || 0);
    const width = Math.max(0, Math.min(100, value / max[k] * 100));
    return `
      <div class="bar-row">
        <span>${labels[k]}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
        <strong>${value}/${max[k]}</strong>
      </div>`;
  }).join('');
}

function drawChart(series, symbol) {
  const canvas = $('#priceChart');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 620;
  const w = Math.max(330, rect.width || canvas.clientWidth || 330);

  const points = series.slice(-260);
  if (!points.length) {
    const fallbackH = isMobile ? 880 : 820;
    canvas.width = w * dpr;
    canvas.height = fallbackH * dpr;
    canvas.style.height = `${fallbackH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, fallbackH);
    return;
  }

  const pricePanel = { x: 54, y: 24, w: w - 76, h: isMobile ? 230 : 260 };
  const rsiPanel = { x: 54, y: pricePanel.y + pricePanel.h + 34, w: w - 76, h: 110 };
  const macdPanel = { x: 54, y: rsiPanel.y + rsiPanel.h + 34, w: w - 76, h: isMobile ? 140 : 150 };
  const volPanel = { x: 54, y: macdPanel.y + macdPanel.h + 34, w: w - 76, h: isMobile ? 125 : 115 };
  const h = volPanel.y + volPanel.h + 42;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const dateLabel = (dateText) => {
    if (!dateText) return '';
    const parts = String(dateText).split('-');
    if (parts.length !== 3) return String(dateText);
    return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
  };
  const x = (i) => pricePanel.x + (i / Math.max(1, points.length - 1)) * pricePanel.w;
  const drawPanelBg = (panel, title) => {
    ctx.save();
    ctx.fillStyle = 'rgba(8,15,40,.32)';
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const rx = panel.x - 42;
    const ry = panel.y - 18;
    const rw = panel.w + 54;
    const rh = panel.h + 28;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(rx, ry, rw, rh, 14);
    } else {
      ctx.rect(rx, ry, rw, rh);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(248,251,255,.80)';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText(title, panel.x - 36, panel.y - 1);
    ctx.restore();
  };

  const drawHorizontalGrid = (panel, ticks = 4) => {
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= ticks; i++) {
      const yy = panel.y + (i / ticks) * panel.h;
      ctx.beginPath();
      ctx.moveTo(panel.x, yy);
      ctx.lineTo(panel.x + panel.w, yy);
      ctx.stroke();
    }
  };

  const drawDateAxis = () => {
    ctx.fillStyle = 'rgba(248,251,255,.78)';
    ctx.font = isMobile ? '10px system-ui' : '11px system-ui';
    ctx.textAlign = 'center';
    const dateTicks = isMobile ? 3 : 5;
    for (let i = 0; i < dateTicks; i++) {
      const idx = Math.round((i / Math.max(1, dateTicks - 1)) * (points.length - 1));
      const xx = x(idx);
      ctx.fillText(dateLabel(points[idx]?.date), xx, volPanel.y + volPanel.h + 26);
    }
    ctx.textAlign = 'left';
  };

  const line = (panel, key, yScale, color, width = 1.6, dash = []) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    let started = false;
    points.forEach((p, i) => {
      const value = p[key];
      if (value === null || value === undefined || Number.isNaN(Number(value))) return;
      if (!started) {
        ctx.moveTo(x(i), yScale(Number(value)));
        started = true;
      } else {
        ctx.lineTo(x(i), yScale(Number(value)));
      }
    });
    ctx.stroke();
    ctx.restore();
  };

  // PRICE + EMA PANEL
  drawPanelBg(pricePanel, `${symbol} Price / EMA`);
  drawHorizontalGrid(pricePanel, 4);
  const priceKeys = ['close', 'ema5', 'ema20', 'ema89', 'ema200'];
  const priceValues = points.flatMap(p => priceKeys.map(k => p[k]).filter(v => v !== null && v !== undefined));
  if (priceValues.length) {
    const minPrice = Math.min(...priceValues) * 0.98;
    const maxPrice = Math.max(...priceValues) * 1.02;
    const yPrice = (v) => pricePanel.y + (maxPrice - v) / (maxPrice - minPrice || 1) * pricePanel.h;
    ctx.fillStyle = 'rgba(234,240,255,.76)';
    ctx.font = '11px system-ui';
    for (let i = 0; i <= 4; i++) {
      const price = maxPrice - i / 4 * (maxPrice - minPrice);
      const yy = pricePanel.y + i / 4 * pricePanel.h;
      ctx.fillText(formatNumber(price), 8, yy + 4);
    }
    line(pricePanel, 'close', yPrice, '#f8fbff', 2.2);
    line(pricePanel, 'ema5', yPrice, '#22c55e', 1.5);
    line(pricePanel, 'ema20', yPrice, '#38bdf8', 1.5);
    line(pricePanel, 'ema89', yPrice, '#f59e0b', 1.3, [4, 4]);
    line(pricePanel, 'ema200', yPrice, '#f43f5e', 1.3, [6, 5]);

    const legend = [
      ['Close', '#f8fbff'], ['EMA5', '#22c55e'], ['EMA20', '#38bdf8'], ['EMA89', '#f59e0b'], ['EMA200', '#f43f5e']
    ];
    let lx = pricePanel.x;
    legend.forEach(([name, color]) => {
      if (lx > w - 86) return;
      ctx.fillStyle = color;
      ctx.fillRect(lx, pricePanel.y + pricePanel.h + 9, 10, 10);
      ctx.fillStyle = 'rgba(248,251,255,.86)';
      ctx.fillText(name, lx + 14, pricePanel.y + pricePanel.h + 18);
      lx += 72;
    });
  }

  // RSI PANEL
  drawPanelBg(rsiPanel, 'RSI(14)');
  drawHorizontalGrid(rsiPanel, 2);
  const yRsi = (v) => rsiPanel.y + (100 - v) / 100 * rsiPanel.h;
  [70, 50, 30].forEach(level => {
    ctx.strokeStyle = level === 50 ? 'rgba(255,255,255,.18)' : 'rgba(251,191,36,.22)';
    ctx.setLineDash(level === 50 ? [] : [5, 5]);
    ctx.beginPath();
    ctx.moveTo(rsiPanel.x, yRsi(level));
    ctx.lineTo(rsiPanel.x + rsiPanel.w, yRsi(level));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(248,251,255,.65)';
    ctx.font = '10px system-ui';
    ctx.fillText(String(level), 22, yRsi(level) + 3);
  });
  line(rsiPanel, 'rsi14', yRsi, '#0ea5e9', 2.0);
  const latest = points[points.length - 1] || {};
  ctx.fillStyle = '#0ea5e9';
  ctx.font = 'bold 13px system-ui';
  ctx.fillText(`RSI14: ${formatNumber(latest.rsi14, 2)}`, rsiPanel.x + 72, rsiPanel.y - 1);

  // MACD PANEL
  drawPanelBg(macdPanel, 'MACD(12,26,9)');
  drawHorizontalGrid(macdPanel, 2);
  const macdValues = points.flatMap(p => ['macd1226', 'macdSignal9', 'macdHist'].map(k => p[k]).filter(v => v !== null && v !== undefined));
  if (macdValues.length) {
    const absMax = Math.max(0.001, ...macdValues.map(v => Math.abs(Number(v))));
    const yMacd = (v) => macdPanel.y + (absMax - v) / (absMax * 2 || 1) * macdPanel.h;
    const zeroY = yMacd(0);
    ctx.strokeStyle = 'rgba(255,255,255,.24)';
    ctx.beginPath();
    ctx.moveTo(macdPanel.x, zeroY);
    ctx.lineTo(macdPanel.x + macdPanel.w, zeroY);
    ctx.stroke();

    const barW = Math.max(1, Math.min(8, macdPanel.w / points.length * 0.72));
    points.forEach((p, i) => {
      const hist = p.macdHist;
      if (hist === null || hist === undefined || Number.isNaN(Number(hist))) return;
      const xx = x(i) - barW / 2;
      const yy = yMacd(Number(hist));
      ctx.fillStyle = Number(hist) >= 0 ? 'rgba(20,184,166,.95)' : 'rgba(244,63,94,.95)';
      ctx.fillRect(xx, Math.min(yy, zeroY), barW, Math.max(1, Math.abs(zeroY - yy)));
    });

    line(macdPanel, 'macd1226', yMacd, '#0ea5e9', 2.0);
    line(macdPanel, 'macdSignal9', yMacd, '#f97316', 1.8);
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText(`MACD: ${formatNumber(latest.macd1226, 3)}`, macdPanel.x + 112, macdPanel.y - 1);
    ctx.fillStyle = '#f97316';
    ctx.fillText(`Signal: ${formatNumber(latest.macdSignal9, 3)}`, macdPanel.x + 224, macdPanel.y - 1);
    ctx.fillStyle = '#d946ef';
    ctx.fillText(`Hist: ${formatNumber(latest.macdHist, 3)}`, macdPanel.x + 350, macdPanel.y - 1);
  }

  // VOLUME PANEL with VMA5/VMA10 calculated client-side
  drawPanelBg(volPanel, 'VOL(5,10)');
  drawHorizontalGrid(volPanel, 2);
  const volumes = points.map(p => Number(p.volume || 0));
  const maxVol = Math.max(1, ...volumes);
  const yVol = (v) => volPanel.y + (maxVol - v) / maxVol * volPanel.h;
  const smaClient = (arr, period) => arr.map((_, i) => {
    const start = Math.max(0, i - period + 1);
    const slice = arr.slice(start, i + 1).filter(v => Number.isFinite(v));
    if (slice.length < period) return null;
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
  const vma5 = smaClient(volumes, 5);
  const vma10 = smaClient(volumes, 10);
  const barW = Math.max(1, Math.min(8, volPanel.w / points.length * 0.72));
  points.forEach((p, i) => {
    const vol = Number(p.volume || 0);
    const prevClose = i > 0 ? Number(points[i - 1].close || 0) : Number(p.open || p.close || 0);
    const up = Number(p.close || 0) >= prevClose;
    ctx.fillStyle = up ? 'rgba(20,184,166,.95)' : 'rgba(244,63,94,.95)';
    const yy = yVol(vol);
    ctx.fillRect(x(i) - barW / 2, yy, barW, Math.max(1, volPanel.y + volPanel.h - yy));
  });
  const yVolLine = (v) => yVol(v);
  const drawArrayLine = (values, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    let started = false;
    values.forEach((value, i) => {
      if (value === null || value === undefined) return;
      if (!started) { ctx.moveTo(x(i), yVolLine(value)); started = true; }
      else ctx.lineTo(x(i), yVolLine(value));
    });
    ctx.stroke();
    ctx.restore();
  };
  drawArrayLine(vma5, '#0ea5e9');
  drawArrayLine(vma10, '#f97316');
  ctx.fillStyle = '#0ea5e9';
  ctx.font = 'bold 13px system-ui';
  ctx.fillText(`VMA5: ${formatNumber(vma5[vma5.length - 1], 0)}`, volPanel.x + 82, volPanel.y - 1);
  ctx.fillStyle = '#f97316';
  ctx.fillText(`VMA10: ${formatNumber(vma10[vma10.length - 1], 0)}`, volPanel.x + 218, volPanel.y - 1);

  drawDateAxis();
}

function updateTabs() {
  $$('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === state.activeTab));
  const note = $('#tabNote');
  if (note) note.textContent = state.activeTab === 'fundamental'
    ? 'Fundamental tab เน้นอ่านงบให้ง่ายขึ้น • N/A = ไม่มี consensus estimate / source ไม่ส่งค่า / endpoint ถูกบล็อก'
    : 'Technical indicators จาก workflow ล่าสุด';
}

function switchTab(tab) {
  state.activeTab = tab;
  state.sortKey = tab === 'fundamental' ? 'fundamentalScore' : 'score';
  state.sortDir = 'desc';
  updateTabs();
  renderColumnToggles();
  applyFilters();
  saveActiveSettings();
}

function setupEventListeners() {
  $('#scanBtn').addEventListener('click', scan);
  $('#refreshBtn').addEventListener('click', () => scan(true));
  $('#loadSingleBtn').addEventListener('click', () => loadSymbol($('#singleSymbol').value.trim().toUpperCase()));
  $('#singleSymbol').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') loadSymbol($('#singleSymbol').value.trim().toUpperCase());
  });

  ['symbols', 'range', 'minScore', 'filterAbove200', 'filterEmaStack', 'filterSweetRsi'].forEach(id => {
    const el = $(`#${id}`);
    el.addEventListener('input', () => { saveActiveSettings(); if (id !== 'symbols' && id !== 'range') applyFilters(); });
    el.addEventListener('change', () => { saveActiveSettings(); if (id !== 'symbols' && id !== 'range') applyFilters(); });
  });

  $$('.tab-button').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  $('#saveScreenerBtn').addEventListener('click', saveNamedScreener);
  $('#loadScreenerBtn').addEventListener('click', loadNamedScreener);
  $('#deleteScreenerBtn').addEventListener('click', deleteNamedScreener);
  $('#savedScreeners').addEventListener('change', () => {
    const selected = $('#savedScreeners').value;
    if (selected) $('#screenerName').value = selected;
  });

  $('#showAllColsBtn').addEventListener('click', () => setColumns(Object.fromEntries(columnDefs.map(c => [c.key, true]))));
  $('#compactColsBtn').addEventListener('click', () => setColumns(compactColumns));
  $('#emaFocusColsBtn').addEventListener('click', () => setColumns(emaFocusColumns));

  window.addEventListener('resize', () => {
    renderMobileCards(state.filteredRows);
    const symbol = $('#singleSymbol').value.trim().toUpperCase();
    if (symbol) drawChart.__resizeTimer = clearTimeout(drawChart.__resizeTimer) || setTimeout(() => loadSymbol(symbol, false), 150);
  });
}

function init() {
  updateSavedScreenersDropdown();
  updateTabs();
  renderColumnToggles();
  renderTableHeader();
  setupEventListeners();
  const restored = restoreActiveSettings();
  if (!restored) {
    renderColumnToggles();
    renderTableHeader();
  }
  scan();
}

init();
