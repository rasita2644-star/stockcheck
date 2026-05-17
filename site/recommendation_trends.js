/* v8.2.1 Finnhub Recommendation Trends Chart loader fix
   Static-site safe: reads generated data/recommendation_trends.json.
   No Finnhub API key is exposed in the browser. */
(function recommendationTrendsPatch(){
  const DATA_URL = "data/recommendation_trends.json";
  const CATEGORIES = [
    ["strongBuy", "Strong Buy", "strong-buy"],
    ["buy", "Buy", "buy"],
    ["hold", "Hold", "hold"],
    ["sell", "Sell", "sell"],
    ["strongSell", "Strong Sell", "strong-sell"],
  ];
  let payload = null;
  let loading = null;

  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#039;"}[c]));
  const num = (value) => { const n = Number(value); return Number.isFinite(n) ? n : 0; };

  function injectStyles(){
    if (document.getElementById("recommendationTrendsStyles")) return;
    const style = document.createElement("style");
    style.id = "recommendationTrendsStyles";
    style.textContent = `
      .recommendation-section{margin:14px 0 16px;padding:16px;border:1px solid #30363D;border-radius:16px;background:rgba(13,17,23,.42)}
      .rec-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}
      .rec-head strong{font-size:16px;color:#E6EDF3}.rec-head span{font-size:12px;color:#8B949E;text-align:right}
      .rec-chart{display:grid;gap:10px;margin-top:10px}.rec-row{display:grid;grid-template-columns:74px minmax(0,1fr) 42px;gap:10px;align-items:center}.rec-period{font:700 12px/1.1 'IBM Plex Mono',monospace;color:#8B949E}.rec-total{font:700 12px/1 'IBM Plex Mono',monospace;color:#8B949E;text-align:right}
      .rec-track{display:flex;height:30px;overflow:hidden;border-radius:10px;background:#0D1117;border:1px solid rgba(48,54,61,.7)}.rec-seg{min-width:0;height:100%;display:flex;align-items:center;justify-content:center;font:800 11px/1 'IBM Plex Mono',monospace;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.35)}.rec-seg.zero{display:none}
      .rec-seg.strong-buy{background:#1a7f37}.rec-seg.buy{background:#3FB950}.rec-seg.hold{background:#D29922}.rec-seg.sell{background:#F85149}.rec-seg.strong-sell{background:#8b0000}
      .rec-legend{display:flex;flex-wrap:wrap;gap:8px 12px;margin:12px 0 0;color:#8B949E;font-size:12px}.rec-legend span{display:inline-flex;align-items:center;gap:6px}.rec-dot{width:10px;height:10px;border-radius:99px;display:inline-block}.rec-dot.strong-buy{background:#1a7f37}.rec-dot.buy{background:#3FB950}.rec-dot.hold{background:#D29922}.rec-dot.sell{background:#F85149}.rec-dot.strong-sell{background:#8b0000}
      .rec-summary-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:14px}.rec-summary-item{padding:10px;border:1px solid rgba(48,54,61,.8);border-radius:12px;background:#161B22}.rec-summary-item .label{display:block;font-size:11px;color:#8B949E;margin-bottom:4px}.rec-summary-item .value{display:block;font:800 14px/1.2 'IBM Plex Mono',monospace;color:#E6EDF3}.rec-summary-item .value.green{color:#3FB950}.rec-summary-item .value.muted{color:#8B949E}
      .rec-empty,.rec-error,.rec-loading{padding:18px;border:1px dashed #30363D;border-radius:12px;color:#8B949E;text-align:center;background:rgba(22,27,34,.45)}.rec-error{color:#ffaaa5;border-color:rgba(248,81,73,.45)}.rec-loading{background:linear-gradient(90deg,#161B22 25%,#1c2230 50%,#161B22 75%);background-size:200% 100%;animation:recShimmer 1.5s infinite}@keyframes recShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @media(max-width:767px){.recommendation-section{padding:13px;margin-bottom:18px}.rec-head{display:block}.rec-head span{display:block;text-align:left;margin-top:4px}.rec-row{grid-template-columns:58px minmax(0,1fr) 34px;gap:7px}.rec-track{height:28px}.rec-summary-row{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function loadData(){
    if (payload) return Promise.resolve(payload);
    if (!loading) {
      loading = fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" })
        .then(res => {
          if (!res.ok) throw new Error(`recommendation_trends.json HTTP ${res.status}`);
          return res.json();
        })
        .then(data => (payload = data))
        .catch(err => (payload = { generated_at: null, trends: {}, errors: { _load: err.message }, api_key_present: false }));
    }
    return loading;
  }

  function getTicker(card){
    const text = card.textContent || "";
    const tickerMatch = text.match(/Ticker:\s*([A-Z0-9.\-]+)/i);
    if (tickerMatch) return tickerMatch[1].toUpperCase();
    const dashboard = card.closest(".fundamental-dashboard") || document.querySelector("#fundamentalDashboard");
    const note = dashboard?.querySelector(".note")?.textContent || "";
    const noteMatch = note.match(/^\s*([A-Z0-9.\-]+)\s+dashboard/i);
    if (noteMatch) return noteMatch[1].toUpperCase();
    const title = document.querySelector("#detailCard h2, .detail-identity h2, #mobileDetailTitle")?.textContent || "";
    const titleMatch = title.match(/([A-Z0-9.\-]{1,10})/);
    return titleMatch ? titleMatch[1].toUpperCase() : "";
  }

  function periodLabel(period){
    const raw = String(period || "").slice(0, 7);
    const [year, month] = raw.split("-");
    if (!year || !month) return raw || "—";
    const d = new Date(Number(year), Number(month) - 1, 1);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  function latestSummary(rows){
    const d = rows[rows.length - 1] || {};
    const total = CATEGORIES.reduce((sum, [key]) => sum + num(d[key]), 0);
    if (!total) return { label: "—", score: "—", bullish: "—", period: periodLabel(d.period) };
    const bullish = num(d.strongBuy) + num(d.buy);
    const scoreNum = ((num(d.strongBuy) * 2 + num(d.buy) - num(d.sell) - num(d.strongSell) * 2) / total);
    const label = scoreNum > 1.5 ? "Strong Buy" : scoreNum > 0.5 ? "Buy" : scoreNum > -0.5 ? "Hold" : scoreNum > -1.5 ? "Sell" : "Strong Sell";
    return { label, score: `${scoreNum.toFixed(2)} / 2.00`, bullish: `${bullish} / ${total} (${Math.round((bullish / total) * 100)}%)`, period: periodLabel(d.period) };
  }

  function renderRows(rows){
    return rows.map(row => {
      const total = Math.max(1, num(row.total) || CATEGORIES.reduce((s, [key]) => s + num(row[key]), 0));
      const segs = CATEGORIES.map(([key, label, cls]) => {
        const value = num(row[key]);
        const width = (value / total) * 100;
        return `<span class="rec-seg ${cls} ${value ? "" : "zero"}" style="width:${width}%" title="${esc(label)}: ${value}">${value > 0 && width >= 8 ? value : ""}</span>`;
      }).join("");
      return `<div class="rec-row"><span class="rec-period">${esc(periodLabel(row.period))}</span><div class="rec-track">${segs}</div><span class="rec-total">${total}</span></div>`;
    }).join("");
  }

  function renderSection(ticker, data){
    const rows = ((data.trends || {})[ticker] || []).slice(-6);
    const generated = data.generated_at ? new Date(data.generated_at).toLocaleString() : "not generated";
    if (!rows.length) {
      const reason = data.api_key_present === false ? "Finnhub API key is missing. Add FINNHUB_API_KEY secret and rerun Generate Attention List." : (data.errors?.[ticker] || data.errors?._load || "No analyst recommendation data available for this ticker.");
      return `<section class="recommendation-section"><div class="rec-head"><strong>${esc(ticker)} Recommendation Trends</strong><span>Finnhub · ${esc(generated)}</span></div><div class="rec-empty">${esc(reason)}</div></section>`;
    }
    const summary = latestSummary(rows);
    const legend = CATEGORIES.map(([, label, cls]) => `<span><i class="rec-dot ${cls}"></i>${esc(label)}</span>`).join("");
    return `<section class="recommendation-section"><div class="rec-head"><strong>${esc(ticker)} Recommendation Trends</strong><span>Finnhub · ${esc(generated)} · last 6 periods</span></div><div class="rec-chart">${renderRows(rows)}</div><div class="rec-legend">${legend}</div><div class="rec-summary-row"><div class="rec-summary-item"><span class="label">Consensus</span><span class="value green">${esc(summary.label)}</span></div><div class="rec-summary-item"><span class="label">Rating Score</span><span class="value">${esc(summary.score)}</span></div><div class="rec-summary-item"><span class="label">Bullish Analysts</span><span class="value green">${esc(summary.bullish)}</span></div><div class="rec-summary-item"><span class="label">Period</span><span class="value muted">${esc(summary.period)}</span></div></div></section>`;
  }

  function patchCard(card){
    if (!card || card.dataset.recTrendsPatched === "1") return;
    const ticker = getTicker(card);
    if (!ticker) return;
    card.dataset.recTrendsPatched = "1";
    const mount = document.createElement("div");
    mount.className = "recommendation-mount";
    mount.innerHTML = `<section class="recommendation-section"><div class="rec-head"><strong>${esc(ticker)} Recommendation Trends</strong><span>Finnhub</span></div><div class="rec-loading">Loading recommendation trends…</div></section>`;
    const linkRow = card.querySelector(".link-row, .action-buttons, .button-row");
    card.insertBefore(mount, linkRow || card.firstChild);
    loadData().then(data => { mount.innerHTML = renderSection(ticker, data || {}); });
  }

  function findYahooCards(){
    const out = new Set(document.querySelectorAll(".yahoo-analysis-card"));
    const candidates = document.querySelectorAll("#fundamentalDashboard section, #fundamentalDashboard article, #fundamentalDashboard .card, #fundamentalDashboard .panel-card, #fundamentalDashboard div, .fundamental-dashboard section, .fundamental-dashboard article, .fundamental-dashboard .card, .fundamental-dashboard div");
    candidates.forEach(el => {
      if (el.closest(".recommendation-section") || el.querySelector(":scope > .recommendation-mount")) return;
      const text = el.textContent || "";
      if (text.includes("Yahoo Finance Analysis") && el.querySelector('a[href*="finance.yahoo.com/quote"]')) out.add(el);
    });
    return Array.from(out);
  }

  function scan(){ findYahooCards().forEach(patchCard); }

  function init(){
    injectStyles();
    scan();
    const observer = new MutationObserver(() => scan());
    observer.observe(document.body, { childList: true, subtree: true });
    window.__stockcheckRecommendationTrendsRefresh = function(){
      payload = null; loading = null;
      document.querySelectorAll("[data-rec-trends-patched='1']").forEach(card => {
        card.dataset.recTrendsPatched = "";
        card.querySelectorAll(".recommendation-mount").forEach(x => x.remove());
      });
      scan();
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
