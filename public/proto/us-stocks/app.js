/* US Stocks — interactive prototype (happy flow) */
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const h = (html)=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const A = 'assets/';

/* ---------------- data ---------------- */
const STOCKS = {
  AAPL:{n:'Apple Inc', t:'AAPL', p:269.53, c:0.48, pc:0.18},
  GOOGL:{n:'Alphabet Inc', t:'GOOGL', p:324.32, c:1.46, pc:0.45},
  AMZN:{n:'Amazon Inc', t:'AMZN', p:208.72, c:1.60, pc:0.77},
  NVDA:{n:'NVIDIA Corporation', t:'NVDA', p:190.04, c:-1.62, pc:-0.85},
  MSFT:{n:'Microsoft Corporation', t:'MSFT', p:413.60, c:12.89, pc:3.21},
  TSLA:{n:'Tesla Inc', t:'TSLA', p:417.32, c:6.21, pc:1.51},
  META:{n:'Meta Platforms Inc', t:'META', p:712.40, c:4.10, pc:0.58},
  NFLX:{n:'Netflix Inc', t:'NFLX', p:1184.20, c:9.65, pc:0.82},
};
const FX = 92.44;                                 // ₹ per $ (best rate shown in breakup)
const wCharges = inr => inr ? 45 + inr*0.007401 : 0;  // GST ₹45 + bank charge
const wGet = inr => inr>=1000 ? (inr - wCharges(inr))/FX : 0;
const oCharges = amt => amt>0 ? { brok:amt*0.0017, gst:0.12, other:0.1215 } : { brok:0, gst:0, other:0 };
const oTotalCharges = amt => { const c=oCharges(amt); return c.brok+c.gst+c.other; };

const S = {};
function resetData(){
  Object.assign(S, { activated:false, wallet:0, holdings:[], sym:'AAPL', amt:'', inr:'', walletReturn:'explore', decl:{reg:false,legal:false}, details:{funds:null,emp:null,wealth:null,ok:true}, visited:new Set() });
}
resetData();

/* ---------------- formatting ---------------- */
const usd = (n, d=2) => '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:d, maximumFractionDigits:d});
const inr = n => '₹' + Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
const sgn = n => (n>=0?'+':'') + n.toFixed(2);
const chg = s => `${sgn(s.c)} (${Math.abs(s.pc).toFixed(2)}%)`;

/* ---------------- icons ---------------- */
const I = {
  back:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>`,
  search:(c='#262626',s=22)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>`,
  help:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17v.01"/></svg>`,
  chevR:(c='#262626',s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`,
  chevD:(c='#6f6f6f',s=14)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  arrowR:(c='currentColor')=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  close:(c='#fff')=>`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  check:(c='#fff',s=10)=>`<svg width="${s}" height="${s}" viewBox="0 0 12 12" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 4.5 8.5 2 6"/></svg>`,
  info:`<svg width="16" height="16" viewBox="0 0 24 24" fill="#262626"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.5v.01" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  swap:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-4-4M20 16H6l4 4"/></svg>`,
  del:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.7" stroke-linejoin="round"><path d="M8 5h12v14H8l-6-7Z"/><path d="m11 9 6 6M17 9l-6 6" stroke-linecap="round"/></svg>`,
  kb:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.6"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M7 9h.01M11 9h.01M15 9h.01M7 13h10" stroke-linecap="round"/></svg>`,
  eye:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  plusC:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`,
  globe:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>`,
  bolt:`<svg width="18" height="18" viewBox="0 0 24 24" fill="#975bd4"><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></svg>`,
  trend:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>`,
  srch2:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M8 11l2 2 3-4" stroke-width="1.5"/></svg>`,
  gear:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>`,
  shield:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="2"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z"/></svg>`,
  sparkle:`<svg viewBox="0 0 24 24"><path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0Z"/></svg>`,
  bell:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 21h4"/></svg>`,
  wallet:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M21 10h-5a2.5 2.5 0 0 0 0 5h5"/></svg>`,
  sort:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="2" stroke-linecap="round"><path d="M4 5h16l-6 7v6l-4 2v-8Z"/></svg>`,
};
const NAV = {
  home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z"/></svg>`,
  lists:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="3" width="13" height="15" rx="2"/><path d="M4 7v12a2 2 0 0 0 2 2h10M9 8h7M9 12h7"/></svg>`,
  orders:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.5l2.2 11h10.6L20.5 7H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>`,
  port:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 15 4-4 3 3 4-5"/></svg>`,
  hold:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v4H2V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2Zm0 2v1h6V5ZM2 13.5h8V15h4v-1.5h8V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/></svg>`,
};
const NVDA_LOGO = `<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#76b900"/><path d="M9.4 9.1V7.9h.4c3.2-.1 5.3 2.7 5.3 2.7s-2.3 3.2-4.7 3.2c-.4 0-.7 0-1-.1v-3.7c1.3.2 1.5.7 2.3 2l1.7-1.4s-1.2-1.6-3.3-1.6c-.2 0-.5 0-.7.1Zm0-3.9v1.8h.4c4.4-.1 7.2 3.6 7.2 3.6s-3.2 3.9-6.6 3.9c-.3 0-.6 0-.9-.1v1.1c.3 0 .5.1.8.1 3.1 0 5.4-1.6 7.6-3.5.4.3 1.8 1 2.1 1.3-2.1 1.7-6.9 3.1-9.6 3.1h-.9v1.5h11.9V5.2Zm0 8.4v.9c-2.9-.5-3.7-3.5-3.7-3.5s1.4-1.5 3.7-1.8v1c-1.2-.1-2.2 1-2.2 1s.6 1.9 2.2 2.4Zm-5.1-2.7s1.7-2.5 5.1-2.8v-.9C5.6 7.5 2.3 10.8 2.3 10.8s1.9 5.5 7.1 6v-1c-3.8-.5-5.1-4.9-5.1-4.9Z" fill="#fff"/></svg>`;
function logo(t, cls=''){
  const k = t.toLowerCase();
  const inner = k==='nvda' ? NVDA_LOGO : k==='tsla' ? `<img src="${A}logos/tsla.png" alt="">` : `<img src="${A}logos/${k}.svg" alt="">`;
  return `<span class="logo ${k} ${cls}">${inner}</span>`;
}

/* ---------------- view engine ---------------- */
const viewsEl = $('#views'), sheetLayer = $('#sheetLayer');
let cur = null, curId = null, token = 0;
const later = (fn, ms) => { const t = token; return setTimeout(()=>{ if(t===token) fn(); }, ms); };
const statusLight = (on) => $('#statusbar').classList.toggle('light', !!on);
const SCREENS = {};

function go(id, tr='push', p={}){
  token++;
  clearSheets(tr!=='none');
  statusLight(false);
  const el = h(`<div class="view" data-id="${id}"></div>`);
  const prev = cur; cur = el; curId = id;
  SCREENS[id](el, p);
  viewsEl.appendChild(el);
  if(el._mounted) el._mounted();
  if(prev){
    if(tr==='none') prev.remove();
    else {
      el.classList.add('enter-'+tr); prev.classList.add('leave-'+tr);
      if(tr==='push' || tr==='pop'){ prev.style.zIndex = tr==='pop' ? 2 : 0; el.style.zIndex = tr==='pop' ? 1 : 2; }
      setTimeout(()=>{ prev.remove(); el.classList.remove('enter-'+tr); }, 520);
    }
  }
  S.visited.add(id);
  markJourney(id, p);
}
function clearSheets(anim){
  if(window.lottie) setTimeout(()=>{ if(!$('[data-tick]') && !$('#osLottie')) lottie.destroy('success'); if(!$('#clockAnim')) lottie.destroy('clock'); }, 600);
  $$('.sheet, .scrim, .os-wrap', sheetLayer).forEach(n=>{
    if(!anim){ n.remove(); return; }
    n.classList.remove('on'); n.style.transition='opacity .3s'; if(n.classList.contains('os-wrap')) n.style.opacity=0;
    setTimeout(()=>n.remove(), 450);
  });
}
function sheet({html='', onScrim=null, cls=''}={}){
  const sc = h(`<div class="scrim"></div>`);
  const sh = h(`<div class="sheet ${cls}"><div class="grab"></div>${html}</div>`);
  sheetLayer.append(sc, sh);
  const api = { el:sh, close(){ sh.classList.remove('on'); sc.classList.remove('on'); setTimeout(()=>{ sh.remove(); sc.remove(); }, 480); } };
  sc.addEventListener('click', ()=>{ if(onScrim) onScrim(); else api.close(); });
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ sc.classList.add('on'); sh.classList.add('on'); }));
  return api;
}
function toast(msg, ms=2200){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'), ms); }
function shine(btn){ if(!btn) return; btn.classList.remove('shine'); void btn.offsetWidth; btn.classList.add('shine'); }

/* ---------------- shared pieces ---------------- */
function bottomnav(on='home'){
  const items=[['home','Home'],['lists','My Lists'],['orders','Orders'],['port','Portfolio'],['hold','Holdings']];
  return `<div class="bottomnav">${items.map(([k,l])=>`<button data-nav="${k}" class="${k===on?'on':''}">${NAV[k]}<span>${l}</span></button>`).join('')}</div>`;
}
function wireBottomnav(el){
  $$('[data-nav]', el).forEach(b=>b.addEventListener('click', ()=>{
    const k=b.dataset.nav;
    if(k==='home' && curId!=='explore') return go('explore','dissolve',{tab:'us'});
    if(k==='hold' && curId!=='holdings') return go('holdings','dissolve');
    if(k!=='home' && k!=='hold') toast('Not part of this prototype');
  }));
}
function header(title, {help=true, search=false}={}){
  return `<div class="hdr"><button class="ib" data-back>${I.back}</button><h2>${title}</h2>${search?`<button class="ib">${I.search()}</button>`:''}${help?`<button class="ib" data-help>${I.help}</button>`:''}</div>`;
}
function wireBack(el, fn){ const b=$('[data-back]', el); if(b) b.addEventListener('click', fn); const hp=$('[data-help]',el); if(hp) hp.addEventListener('click', ()=>toast('Help centre opens here')); }
const legal = `<div class="foot-legal">Trading and broking services are provided by<br><b><i class="alpaca"></i>Alpaca</b> regulated by <span class="finra">FINRA</span> <a class="link" style="color:#262626">Learn more</a></div>`;

/* deterministic random-walk line chart */
function chartSvg(seed=7, up=true){
  let x=seed*9301+49297; const rnd=()=>((x=(x*9301+49297)%233280)/233280);
  const N=96, W=360, H=150; let v=0.62; const pts=[];
  for(let i=0;i<N;i++){
    const t=i/(N-1);
    const drift = up ? (t<.45 ? .0015 : t<.75 ? -.006 : -.004) : .004;
    v += drift + (rnd()-.5)*.06;
    if(i>60 && i<66) v -= .05*(up?1:-.2);
    v = Math.min(.95, Math.max(.05, v));
    pts.push([t*W*0.88, 12 + v*H]);
  }
  pts[N-1][1] = Math.min(pts[N-1][1], pts[N-2][1]);
  const d = 'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
  const [ex,ey] = pts[N-1];
  return `<svg viewBox="0 0 360 170" preserveAspectRatio="none"><defs><linearGradient id="cg${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c7a4f" stop-opacity=".14"/><stop offset="1" stop-color="#0c7a4f" stop-opacity="0"/></linearGradient></defs>
    <path class="area" d="${d} L${ex} 170 L0 170Z" fill="url(#cg${seed})"/><path class="ln" d="${d}"/><circle class="endp" cx="${ex}" cy="${ey}" r="4"/><circle class="end" cx="${ex}" cy="${ey}" r="4"/></svg>`;
}
function drawCharts(root){
  $$('.chart .ln', root).forEach(p=>{ const L=p.getTotalLength(); p.style.setProperty('--len', L); p.classList.remove('draw'); void p.getBBox(); p.classList.add('draw'); });
}

/* ================================================================
   1. HOME / EXPLORE  (Commodities tab with FTUE sheet → spotlight → US Stocks tab)
   ================================================================ */
function stepperHtml(){
  const st = S.holdings.length ? 3 : S.wallet>0 ? 2 : S.activated ? 1 : 0;
  const lbl = ['Activate','Add funds','Trade'];
  const cta = st===0 ? `Start now` : st===1 ? `Add money to US wallet` : `Explore stocks to trade`;
  const pct = st===0 ? 0 : st===1 ? 50 : 100;
  const gift = `<svg class="gift" viewBox="0 0 28 28" width="18" height="18"><rect x="5" y="12" width="18" height="12" rx="1.5" fill="#b48be6"/><rect x="12.5" y="12" width="3" height="12" fill="#7a3bc4"/><g class="lid"><rect x="3.5" y="8" width="21" height="5" rx="1.2" fill="#9a63db"/><rect x="12.5" y="8" width="3" height="5" fill="#6b2bb0"/><path d="M14 8c-2-4-6-4-6-1.5S12 8 14 8c2 0 6 0 6-1.5S16 4 14 8Z" fill="none" stroke="#6b2bb0" stroke-width="1.4"/></g></svg>`;
  return `<div class="stepper" id="stepper"><div class="st-strip">${gift}Free brokerage for 30 days</div>
    <div class="st-body"><h4>Complete steps to start investing</h4>
    <div class="steps"><div class="rail"><i data-w="${pct}%"></i></div>
      ${lbl.map((l,i)=>`<div class="step ${i<st?'done':i===st?'cur':''}"><span class="dot">${i<st?I.check('#fff',9):''}</span>${i===0&&st>0?'Activated':l}</div>`).join('')}
    </div>
    <button class="btn" id="stepCta">${cta} ${I.chevR('#fff',16)}</button></div></div>`;
}
function usContent(){
  const top = [['GOOGL','AAPL','AMZN'],['MSFT','NVDA','TSLA']];
  const movers = ['NVDA','GOOGL','AAPL','AMZN','MSFT'];
  const showStepper = !S.holdings.length;
  return `
  <div class="market-live"><i class="live-dot"></i><b>US market live.</b> Extended hours start at 1:30 AM IST</div>
  <div class="ex-head"><h3>Explore</h3><a class="link">View orders</a></div>
  ${showStepper ? stepperHtml() : ''}
  <div class="sec"><div class="sec-h">${I.srch2} Top Searched Stocks</div>
    <div class="hscroll">${top.map(col=>`<div class="ts-col">${col.map(t=>{const s=STOCKS[t]; return `<button class="ts-card ${t==='AAPL'&&S.activated&&!S.holdings.length?'nudge':''}" data-stock="${t}">${logo(t)}<span><div class="nm">${s.n}</div><div class="tk">${t}</div></span><span class="px"><b class="${s.c<0?'neg':'pos'}">${usd(s.p)}</b><span>${chg(s)}</span></span></button>`;}).join('')}</div>`).join('')}</div>
  </div>
  <div class="divider"></div>
  <div class="sec"><div class="sec-h">${I.globe} American Markets</div>
    <div class="mkt-pills">${['S&P 500','NASDAQ','USD INR','DOW Jones'].map((l,i)=>`<button class="pill ${i===0?'on':''}" data-idx="${i}">${l}</button>`).join('')}</div>
    <div class="chart" id="mktChart">${chartSvg(7)}</div>
    <div class="range" id="mktRange"><div class="r1"><span class="num">6,906.01</span><span>1% up in 1 day</span><span class="num">6,980.10</span></div><div class="bar">L<i style="--p:50%"></i>H</div></div>
    <div class="tf">${['1D','1W','1M','3M','6M','1Y','5Y'].map((l,i)=>`<button class="${i===0?'on':''}">${l}</button>`).join('')}</div>
  </div>
  <div class="divider"></div>
  <div class="sec"><div class="sec-h">${I.bolt} Movers and Shakers <span class="chev">${I.chevR()}</span></div>
    <div class="mkt-pills">${['Top gainers','Top losers','52W high','52W low'].map((l,i)=>`<button class="pill ${i===0?'on':''}">${l}</button>`).join('')}</div>
    <div class="rows">${movers.map(t=>{const s=STOCKS[t]; return `<button class="row" data-stock="${t}">${logo(t,'sm')}<span><div class="nm">${s.n}</div><div class="tk">${t}</div></span><span class="px"><b class="${s.c<0?'neg':'pos'}">${usd(s.p)}</b><span>${chg(s)}</span></span></button>`;}).join('')}</div>
  </div>
  <div class="divider"></div>
  <div class="sec"><div class="sec-h">${I.trend} Trend Plays <span class="chev">${I.chevR()}</span></div>
    <div class="trend">${[['🤖','AI Power house','#efe7fb'],['⚡','Electric Future','#e7f0fb'],['📈','Fintech Disruptors','#fdf1e3'],['🩺','Healthcare Heroes','#e6f6ef'],['🛒','Everyday essentials','#fbe9ee']].map(([e,l,b])=>`<div><i style="background:${b}">${e}</i>${l}</div>`).join('')}</div>
  </div>
  <div class="divider"></div>
  <div class="sec"><div class="sec-h">Frequently Asked Questions <span class="chev">${I.chevR()}</span></div>
    <div class="faq">
      <details open><summary>What are the limits &amp; charges for US Stocks? ${I.chevD('#262626',16)}</summary><p>You can send up to $250,000 a year under RBI's Liberalised Remittance Scheme. Brokerage is 0.25% per order, with a minimum of $0.01.</p></details>
      <details><summary>How long can I hold US Stocks? ${I.chevD('#262626',16)}</summary><p>As long as you like. There is no holding period limit for delivery orders.</p></details>
      <details><summary>What should I keep in mind when trading using US Stocks? ${I.chevD('#262626',16)}</summary><p>US markets run 7:00 PM – 1:30 AM IST (8:00 PM in winter). Prices are in USD, so your returns also move with the USD/INR rate.</p></details>
    </div>
  </div>
  ${legal}`;
}
const INL = { KOTAK:['#ed1c24','<svg width="16" height="10" viewBox="0 0 16 10"><path d="M4.5 1a4 4 0 1 0 0 8c1.6 0 2.6-1 3.5-2.2C8.9 8 9.9 9 11.5 9a4 4 0 1 0 0-8C9.9 1 8.9 2 8 3.2 7.1 2 6.1 1 4.5 1Z" fill="none" stroke="#fff" stroke-width="1.6"/></svg>'], PNB:['#a3123a','<b style="color:#fbc02d;font:800 11px/1 Inter">pnb</b>'], SBI:['#1f5aa6','<span style="width:14px;height:14px;border-radius:50%;border:3px solid #fff;display:block;position:relative"><i style="position:absolute;left:3px;top:4px;width:2px;height:8px;background:#fff"></i></span>'], UP:['#5b1f9a','<b style="color:#fff;font:700 11px/1 Inter">up</b>'] };
const inLogo = k => `<span class="logo" style="background:${INL[k][0]};border-color:${INL[k][0]}">${INL[k][1]}</span>`;
function stocksContent(){
  const rows = [['KOTAK','Kotak Mahindra Bank','NSE'],['PNB','Punjab National Bank','NSE'],['SBI','State Bank of India','KOTAKBANK']];
  const col2 = ['UP','KOTAK','KOTAK'];
  return `<div class="sec" style="padding-top:14px"><div class="sec-h" style="font-size:14px">Movers and Shakers</div>
    <div class="mkt-pills"><button class="pill">Large Cap ${I.chevD('#262626',12)}</button><button class="pill on">Today’s Gainers</button><button class="pill">Today’s Losers</button><button class="pill">52W High</button></div>
    <div class="hscroll" style="padding-top:4px"><div class="ts-col">${rows.map(([k,n,x])=>`<div class="ts-card">${inLogo(k)}<span style="min-width:0"><div class="nm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px">${n}</div><div class="tk">${x}</div></span><span class="px"><b style="color:#262626">2,345.67</b><span class="pos">+72.89 (9.82%)</span></span></div>`).join('')}</div>
      <div class="ts-col">${col2.map(k=>`<div class="ts-card">${inLogo(k)}<span><div class="nm">${k==='UP'?'Upstox':'Kotak Bank'}</div><div class="tk">NSE</div></span><span class="px"><b style="color:#262626">1,812.40</b><span class="pos">+2.10%</span></span></div>`).join('')}</div></div>
    <div style="padding:10px 16px 0"><button class="btn ghost sm" style="border:1px solid #e0e0e0;font-weight:500">View more</button></div></div>
  <div class="divider"></div>
  <div class="sec"><div class="sec-h" style="font-size:14px">📣 Buzzing Stocks</div>
    <div class="mkt-pills"><button class="pill on">Trending</button><button class="pill">Smart money</button><button class="pill">Big wins</button><button class="pill">Earnings</button></div>
    <p style="font-size:12px;color:#6f6f6f;padding:0 16px 10px">View all trending stocks across the platform!</p>
    <div class="hscroll"><div class="ts-card">${inLogo('KOTAK')}<span><div class="nm">Kotak Bank</div><div class="tk">KOTAKBANK</div></span><span class="px"><b class="pos">2,345.67</b><span>+72.89 (9.82%)</span></span></div><div class="ts-card">${inLogo('SBI')}<span><div class="nm">SBI</div><div class="tk">SBIN</div></span><span class="px"><b class="pos">812.30</b><span>+1.2%</span></span></div></div></div>`;
}
function cmContent(){
  return `<div class="market-live" style="background:linear-gradient(180deg,#eef0f4,#fafbfc);color:#555"><i class="live-dot" style="background:#999"></i>MCX open till 11:30 PM</div>
  <div class="ex-head"><h3>Explore</h3><a class="link">View orders</a></div>
  ${[['#f2c94c','Gold','₹1,23,450'],['#bdbdbd','Silver','₹1,52,300'],['#3a3a3a','Crude Oil','₹5,412'],['#e07b39','Copper','₹1,012']].map(([c,n,p])=>`<div class="cm-card"><i style="background:${c}"></i><span style="flex:1"><div class="nm">${n}</div><div class="tk">MCX · Futures</div></span><span class="px"><b>${p}</b><span class="pos">+0.42%</span></span></div>`).join('')}
  <div style="padding:8px 16px"><div class="skel" style="width:60%;margin-bottom:10px"></div><div class="skel" style="width:85%;margin-bottom:10px"></div><div class="skel" style="width:40%"></div></div>`;
}
SCREENS.explore = (el, p)=>{
  let tab = p.tab || (p.stage ? 'st' : 'us');
  el.innerHTML = `
    <div class="ticker">${tab==='us' && !p.stage ? tickerUS() : tickerIN()}</div>
    <div class="topnav"><span class="uplogo">up</span><div class="search">${I.search('#555',16)} Search</div><span class="nb-ic">${I.bell}</span><span class="nb-ic">${I.wallet}</span><span class="plus">Plus</span></div>
    <div class="tabs" id="tabs"><span class="tab-ind" id="tabInd"></span>
      <button class="tab" data-tab="id">Ideas</button>
      <button class="tab" data-tab="st">Stocks</button>
      <button class="tab" data-tab="op">Options</button>
      <button class="tab" data-tab="cm">Commodities</button>
      <button class="tab" data-tab="us">US Stocks <span class="new">NEW</span></button>
      <button class="tab" data-tab="mf">Mutual Funds</button>
    </div>
    <div class="scroll" id="exScroll"></div>
    ${bottomnav('home')}`;
  const sc = $('#exScroll', el);
  function setTab(t, animate=true){
    tab = t;
    $$('.tab', el).forEach(b=>b.classList.toggle('on', b.dataset.tab===t));
    const b = $(`.tab[data-tab="${t}"]`, el), ind=$('#tabInd', el);
    if(!animate) ind.style.transition='none';
    ind.style.left = b.offsetLeft+'px'; ind.style.width = b.offsetWidth+'px';
    if(!animate){ void ind.offsetWidth; ind.style.transition=''; }
    const strip=$('#tabs', el); strip.scrollTo({left: Math.max(0, b.offsetLeft - 70), behavior: animate?'smooth':'auto'});
    sc.innerHTML = t==='us' ? usContent() : t==='st' ? stocksContent() : cmContent();
    sc.scrollTop = 0;
    sc.classList.remove('stg'); void sc.offsetWidth; if(animate) sc.classList.add('stg');
    if(t==='us') wireUS();
  }
  function wireUS(){
    drawCharts(sc);
    const rail = $('.rail i', sc); if(rail){ const from = p.railFrom; if(from!=null){ rail.style.width=from; } requestAnimationFrame(()=>requestAnimationFrame(()=>rail.style.width=rail.dataset.w)); }
    const sc2 = $('#stepCta', sc);
    if(sc2) sc2.addEventListener('click', ()=>{
      if(!S.activated) return go('actIntro','push');
      if(S.wallet<=0){ S.walletReturn='explore'; return go('wallet','push'); }
      const card=$('.ts-card[data-stock="AAPL"]', sc); card && card.scrollIntoView({behavior:'smooth',block:'center'});
    });
    $$('[data-stock]', sc).forEach(b=>b.addEventListener('click', ()=>{ S.sym=b.dataset.stock; go('scrip','push'); }));
    $$('[data-idx]', sc).forEach(b=>b.addEventListener('click', ()=>{
      $$('[data-idx]', sc).forEach(x=>x.classList.toggle('on', x===b));
      $('#mktChart', sc).innerHTML = chartSvg(7+ +b.dataset.idx*13, b.dataset.idx!=='2'); drawCharts($('#mktChart', sc));
      const bar=$('#mktRange .bar i', sc); bar.style.setProperty('--p', (30+Math.random()*50)+'%');
    }));
    $$('.tf button', sc).forEach(b=>b.addEventListener('click', ()=>{ $$('.tf button', sc).forEach(x=>x.classList.toggle('on', x===b)); $('#mktChart', sc).innerHTML = chartSvg(3+b.textContent.length*5); drawCharts($('#mktChart', sc)); }));
  }
  $$('.tab', el).forEach(b=>b.addEventListener('click', ()=>{
    const t=b.dataset.tab; if(['us','cm','st'].includes(t)) setTab(t); else toast('Not part of this prototype');
  }));
  wireBottomnav(el);
  el._mounted = ()=>{
    setTab(tab, false);
    if(tab==='us') sc.classList.add('stg');
    if(p.scrollTo==='stock'){ const c=$('.ts-card[data-stock="AAPL"]', sc); if(c) later(()=>c.scrollIntoView({behavior:'smooth', block:'nearest'}), 700); }
    if(p.stage==='ftue') later(()=>openFtue(el, setTab), 500);
    if(p.stage==='ftux') { later(()=>openFtux(el, setTab), 50); }
  };
};
const tickerIN = ()=>`<div><span>NIFTY50 <span class="t-tag">2hr 01m left</span></span><span><b class="num">24,981.41</b> <span class="pos">+311.91 (0.55%)</span></span></div><i class="sep"></i><div><span>NIFTYBANK <span style="color:#9a9a9a">29 May</span></span><span><b class="num">24,981.41</b> <span class="pos">+311.91 (0.55%)</span></span></div>`;
const tickerUS = ()=>`<div><span>S&amp;P 500</span><span><b class="num">6,906.09</b> <span class="pos">+0.26 (0.55%)</span></span></div><i class="sep"></i><div><span>NASDAQ</span><span><b class="num">23,993.15</b> <span class="pos">+32.07 (1.08%)</span></span></div><i class="sep"></i><div><span>DOW Jones</span><span><b class="num">47,112.4</b></span></div>`;

/* --- FTUE: Statue of Liberty sheet over Commodities --- */
function archPath(H){
  // Outline sampled row-by-row from the design screenshot (888x1958 -> 360x800), y=0 at the finial tip.
  // Ogee finial, then round lobes: each leaves its notch flat, swells out to an extreme, and curls back into the next notch.
  const k=.552, tip=[180,0], F0=[160.54,19.20];
  const N=[[124.86,36.77],[107.84,61.29],[60.81,85.80],[35.27,119.31],[18.65,164.25]];   // notches
  const E=[null,[102.16,40.86],[57.97,77.63],[34.46,114.81],[15.40,147.09]];             // outermost point of each lobe
  const out=(s0,e)=>[s0,[s0[0]-k*(s0[0]-e[0]),s0[1]],[e[0],e[1]-k*(e[1]-s0[1])],e];     // flat start -> vertical end
  const back=(s0,e)=>[s0,[s0[0],s0[1]+k*(e[1]-s0[1])],[e[0]-k*(e[0]-s0[0]),e[1]],e];    // vertical start -> curls inward
  const segs=[[tip,[177.16,4.09],[168.24,17.57],F0], out(F0,N[0])];
  for(let i=1;i<N.length;i++){ segs.push(out(N[i-1],E[i]), back(E[i],N[i])); }
  segs.push(out(N[4],[0,184.68]), [[0,184.68],[-2.7,198],[-5.4,211.4],[-8.11,224.72]]);
  const f=n=>(+n).toFixed(2), pt=q=>`${f(q[0])} ${f(q[1])}`, mir=q=>[360-q[0],q[1]];
  const last=segs[segs.length-1][3];
  let d=`M${pt(tip)}`;
  for(const [,c1,c2,e] of segs) d+=` C${pt(mir(c1))} ${pt(mir(c2))} ${pt(mir(e))}`;      // right side, top -> bottom
  d+=` L${pt(mir([last[0],H]))} L${pt([last[0],H])} L${pt(last)}`;
  for(let i=segs.length-1;i>=0;i--){ const [st,c1,c2]=segs[i]; d+=` C${pt(c2)} ${pt(c1)} ${pt(st)}`; } // left side, bottom -> top
  return d+'Z';
}
function openFtue(el, setTab){
  const dim = h(`<div class="dim"></div>`);
  const APPLE = `<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#111" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-1-2.4-3.9ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z"/></svg>`;
  const META = `<svg width="34" height="22" viewBox="0 0 10.5 7"><path fill="#fff" d="M5.39 1.47C4.55.41 3.85 0 3.02 0 1.31 0 0 2.23 0 4.59 0 6.07.71 7 1.9 7c.86 0 1.48-.41 2.58-2.33l.77-1.37c.81 1.27 1.8 2.6 2.63 3.12.39.25.75.37 1.13.37 1.13 0 1.5-1.07 1.5-2.37C10.5 2.24 9.27 0 7.6 0 6.75 0 6.05.45 5.39 1.47Zm-3.44 4.4c-.62 0-.84-.47-.84-1.5 0-1.47.84-3.23 1.89-3.23.55 0 1.01.32 1.71 1.33-.67 1.03-1.07 1.67-1.07 1.67-.89 1.4-1.2 1.73-1.69 1.73Zm5.53-.55c-.45-.22-.86-.69-1.53-1.68.4-.66.83-1.36 1.13-1.75.45-.6.84-.75 1.2-.75.88 0 1.6 1.4 1.6 3.24 0 .82-.17 1.33-.73 1.33-.51 0-.98-.17-1.67-.39Z"/></svg>`;
  // [class, centreX, centreY (screen px from the video), size, rotate, delay, inner]
  const B = [
    ['b-meta', 265, 393, 54, -28, .78, META],
    ['b-nflx', 56, 450, 40, -14, .84, `<b style="color:#fff;font:900 24px/1 Inter;letter-spacing:-1px;transform:scaleY(1.2)">N</b>`],
    ['b-tsla', 272, 503, 46, 0, .9, `<img src="${A}logos/tsla.png" style="width:24px;height:24px;object-fit:cover;object-position:50% 0;filter:brightness(0) invert(1)" alt="">`],
    ['b-aapl', 88, 548, 60, 0, .96, APPLE],
  ];
  const TOP = 347; // finial tip (screen y) in the design
  const f = h(`<div class="ftue">
    <div class="arch" style="top:${TOP}px">
      <svg viewBox="0 0 360 ${752-TOP}" preserveAspectRatio="none" style="overflow:visible"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43207a"/><stop offset=".5" stop-color="#341561"/><stop offset="1" stop-color="#2a0f50"/></linearGradient></defs><path d="${archPath(752-TOP)}" fill="url(#ag)"/></svg>
      <img class="statue" src="${A}statue.png" alt="" style="top:${-TOP+92}px;left:12px">
      ${B.map(([c,x,y,sz,r,d,inner])=>`<span class="badge3 ${c}" style="left:${x-sz/2}px;top:${y-TOP-sz/2}px;width:${sz}px;height:${sz}px;--r:${r}deg;--d:${d}s;--fx:${(180-x)*.35}px;--fy:${(470-y)*.35}px">${inner}</span>`).join('')}
      <div class="copy"><div class="ey">NEW ON UPSTOX</div><h2>You can now invest<br>in US stocks from India</h2><button class="btn" id="ftueCta">Explore now</button></div>
    </div></div>`);
  el.append(dim, f);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ dim.classList.add('on'); f.classList.add('on'); }));
  // looping shine sweep on the CTA, as in the video (~every 2.2s)
  const cta = $('#ftueCta', f); const loop = ()=>{ if(!f.isConnected) return; shine(cta); setTimeout(loop, 2250); }; setTimeout(loop, 1500);
  const dismiss = (next)=>{ f.classList.remove('on'); f.classList.add('off'); dim.classList.remove('on'); setTimeout(()=>{ f.remove(); dim.remove(); next && next(); }, 600); };
  dim.style.pointerEvents='auto'; dim.addEventListener('click', ()=>dismiss());
  cta.addEventListener('click', ()=>dismiss(()=>{ setTab('us'); later(()=>openFtux(el, setTab, true), 450); markJourney('explore',{stage:'ftux'}); }));
}
/* --- FTUX spotlight on the new US Stocks tab --- */
function openFtux(el, setTab, already){
  if(!already) setTab('us', false);
  statusLight(true);
  const tb = $('.tab[data-tab="us"]', el), scr=$('#screen').getBoundingClientRect(), r=tb.getBoundingClientRect(), k=scr.width/360;
  const chips = [['MSFT','Microsoft Corp'],['GOOGL','Alphabet Inc.'],['TSLA','Tesla Inc.'],['NFLX','Netflix Inc.'],['AAPL','Apple Inc.'],['META','Meta Platforms Inc.'],['AMZN','Amazon Inc.']];
  const o = h(`<div class="ftux"><i class="aurora a1"></i><i class="aurora a2"></i>
    <button class="x" aria-label="Close">${I.close()}</button>
    <span class="spot" style="left:${(r.left-scr.left)/k}px;top:${(r.top-scr.top)/k}px;height:${r.height/k}px">US Stocks <span class="new">NEW</span></span>
    <div class="msg" style="top:${(r.bottom-scr.top)/k+28}px"><h2>Invest in 10,000+ stocks,<br>Start with $1</h2>
      <div class="fchips">${chips.map(([t,n],i)=>`<span class="fchip" style="--d:${.75+i*.07}s">${logo(t,'xs')}${n}</span>`).join('')}</div></div>
    <div class="cta-f"><button class="btn" id="ftuxCta">Get started</button></div></div>`);
  el.appendChild(o);
  requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')));
  later(()=>shine($('#ftuxCta', o)), 1800);
  const close = ()=>{ o.classList.remove('on'); statusLight(false); setTimeout(()=>o.remove(), 500); markJourney('explore',{}); drawCharts(el); };
  $('.x', o).addEventListener('click', close);
  $('#ftuxCta', o).addEventListener('click', ()=>{ statusLight(false); go('actIntro','push'); });
}

/* ================================================================
   2. ACTIVATION
   ================================================================ */
SCREENS.actIntro = (el)=>{
  el.innerHTML = `<div class="hdr"><button class="ib" data-back>${I.back}</button></div>
    <div class="scroll act stg">
      <div class="act-hero"><img src="${A}activate.gif" alt=""></div>
      <h1>Activate your US Stocks account for <u>free<svg viewBox="0 0 50 8" preserveAspectRatio="none"><path d="M1 5c12-4 34-5 48-1" stroke="#542087" stroke-width="2" fill="none" stroke-linecap="round"/></svg></u></h1>
      <ul class="bullets"><li>Invest in 500+ US listed companies</li><li>Invest fractionally starting at $1</li><li>Zero account maintenance charges</li></ul>
    </div>
    <div class="free"><svg class="gift" viewBox="0 0 28 28"><rect x="5" y="12" width="18" height="12" rx="1.5" fill="#b48be6"/><rect x="12.5" y="12" width="3" height="12" fill="#7a3bc4"/><g class="lid"><rect x="3.5" y="8" width="21" height="5" rx="1.2" fill="#9a63db"/><rect x="12.5" y="8" width="3" height="5" fill="#6b2bb0"/><path d="M14 8c-2-4-6-4-6-1.5S12 8 14 8c2 0 6 0 6-1.5S16 4 14 8Z" fill="none" stroke="#6b2bb0" stroke-width="1.4"/></g><circle cx="23" cy="6" r="1" fill="#cbb2f0"/><circle cx="5" cy="5" r=".8" fill="#cbb2f0"/></svg><span><b>Free brokerage for 30 days</b><span>On every US stock order you place</span></span></div>
    <div class="cta-area"><button class="btn" id="cta">Activate account in 2 mins</button></div>
    ${legal}`;
  wireBack(el, ()=>go('explore','pop',{tab:'us'}));
  $('#cta', el).addEventListener('click', ()=>go('details','push'));
  el._mounted = ()=>later(()=>shine($('#cta', el)), 900);
};

SCREENS.details = (el)=>{
  const d = S.details;
  const FUNDS = [['Under $20K','Below $20,000'],['$20K – $50K','$20,000 - $49,999'],['$50K – $100K','$50,000 - $99,999'],['$100K – $500K','$100,000 - $499,999'],['$500K – $1M','$500,000 - $999,999'],['$1M – $10M','$1,000,000 - $9,999,999']];
  const EMP = ['Employed','Self employed','Student','Retired'];
  const WEALTH = ['Employment income','Business income','Investments','Savings','Inheritances','Family'];
  const num = (k,n)=>`<i>${n}</i>`;
  el.innerHTML = `${header('Share your details',{help:false})}
    <div class="scroll stg">
      <div class="d-top"><h3>Tell us about you</h3><p>Three quick questions required by US regulators.</p></div>
      <div class="d-sec" data-sec="funds"><div class="hd"><span>${num('funds',1)}Funds available for US stocks</span><em>USD</em></div>
        <div class="d-grid">${FUNDS.map(([s,v])=>`<button class="d-tile ${d.funds===v?'on':''}" data-q="funds" data-v="${v}">${s}</button>`).join('')}</div></div>
      <div class="d-sec" data-sec="emp"><div class="hd"><span>${num('emp',2)}Employment status</span></div>
        <div class="chips">${EMP.map(v=>`<button class="pill ${d.emp===v?'on':''}" data-q="emp" data-v="${v}">${v}</button>`).join('')}</div></div>
      <div class="d-sec" data-sec="wealth"><div class="hd"><span>${num('wealth',3)}Source of wealth</span></div>
        <div class="chips">${WEALTH.map(v=>`<button class="pill ${d.wealth===v?'on':''}" data-q="wealth" data-v="${v}">${v}</button>`).join('')}</div></div>
    </div>
    <label class="consent"><input type="checkbox" class="check" id="ok" ${d.ok?'checked':''}><span>By continuing, I accept the <a class="link">T&amp;Cs</a> and consent to sharing my <a class="link" id="pd">personal details</a> with the broker</span></label>
    <div class="cta-area"><button class="btn" id="cta" disabled>Continue</button></div>`;
  const upd = ()=>{ const on = d.funds && d.emp && d.wealth && d.ok; const b=$('#cta', el); const was=b.disabled; b.disabled=!on; if(was && on) shine(b); };
  $$('[data-q]', el).forEach(b=>b.addEventListener('click', ()=>{ const k=b.dataset.q; d[k]=b.dataset.v; $$(`[data-q="${k}"]`, el).forEach(x=>x.classList.toggle('on', x===b)); upd(); }));
  $('#ok', el).addEventListener('change', e=>{ d.ok=e.target.checked; upd(); });
  $('#pd', el).addEventListener('click', e=>{ e.preventDefault(); const s=sheet({html:`<div class="sh-body"><div class="sh-title">Personal details</div>${[['Full name','Nandini Singh'],['DOB','12/12/1990'],['Email','san*******@gmail.com'],['Mobile number','******3024'],['PAN','XXXXX1219F']].map(([k,v])=>`<div class="kv"><span>${k}</span><b style="font-weight:500">${v}</b></div>`).join('')}</div><div class="sh-foot"><button class="btn">Okay</button></div>`}); $('.btn', s.el).addEventListener('click', s.close); });
  wireBack(el, ()=>go('actIntro','pop'));
  $('#cta', el).addEventListener('click', ()=>go('declare','push'));
  upd();
};

let declSvg = null;
declSvg = window.DECLARE_SVG || null;
SCREENS.declare = (el)=>{
  const dc = S.decl;
  el.innerHTML = `${header('Declarations for investment',{help:false})}
    <div class="scroll">
      <div class="decl-hero">${declSvg || `<img src="${A}declare.svg" width="207" height="200" alt="">`}</div>
      <button class="decl-row ${dc.reg?'seen':''}" data-d="reg">I agree to the Regulatory declarations <span class="r"><span class="ok">${I.check('#fff',9)}</span>${I.chevR('#6f6f6f',16)}</span></button>
      <button class="decl-row ${dc.legal?'seen':''}" data-d="legal">I agree to the US Stocks legal agreements <span class="r"><span class="ok">${I.check('#fff',9)}</span>${I.chevR('#6f6f6f',16)}</span></button>
    </div>
    <label class="consent"><input type="checkbox" class="check" id="ok" checked><span>I acknowledge and confirm that the information provided by me is true and correct</span></label>
    <div class="cta-area"><button class="btn" id="cta">Finish activation</button></div>`;
  const TXT = {
    reg:['Regulatory declarations',`<ul class="legal-list"><li>I certify that I am not a US citizen, US resident alien or other US person for US tax purposes, &amp; I am submitting the applicable <a>Form W-8 BEN</a> with this form to certify my foreign status and, if applicable, claim tax treaty benefits.</li><li>I have read, understood, and agree to be bound by Alpaca Securities LLC and Upstox account terms, and all other terms, disclosures and disclaimers applicable to me, as referenced in the Alpaca Customer Agreement. I also acknowledge that the Alpaca Customer Agreement contains a pre-dispute arbitration clause in Section 43.</li><li>I understand I am signing this agreement electronically, and that my electronic signature will have the same effect as physically signing and returning the Application Agreement.</li></ul>`],
    legal:['US Stocks Legal agreements',`<ul class="legal-list"><li>Not politically exposed or related</li><li>Not a senior executive at or a 10% or greater shareholder of a publicly traded company</li><li>Not affiliated or has worked with a US registered broker-dealer or FINRA</li><li>Not a family member or relative of a senior political figure</li><li>Not a senior political figure</li></ul>`],
  };
  $$('[data-d]', el).forEach(b=>b.addEventListener('click', ()=>{
    const k=b.dataset.d, [t, body]=TXT[k];
    const s = sheet({html:`<div class="sh-body"><div class="sh-title">${t}</div>${body}</div><div class="sh-foot"><button class="btn">Okay</button></div>`});
    $('.sh-foot .btn', s.el).addEventListener('click', ()=>{ s.close(); dc[k]=true; setTimeout(()=>b.classList.add('seen'), 250); });
  }));
  $('#ok', el).addEventListener('change', e=>{ $('#cta', el).disabled = !e.target.checked; });
  wireBack(el, ()=>go('details','pop'));
  $('#cta', el).addEventListener('click', ()=>{ dc.reg=dc.legal=true; go('activating','dissolve'); });
};
SCREENS.activating = (el)=>{
  el.innerHTML = `<div class="loader"><div class="orbit"><i></i><b>$</b></div><h3>Activating your US Stocks account</h3><p>Sharing your details securely with Alpaca…</p></div>`;
  el._mounted = ()=>later(()=>{ S.activated=true; go('actDone','dissolve'); }, 1600);
};
SCREENS.actDone = (el)=>{
  el.innerHTML = `<div class="act-done">
      <div class="badge-wrap lot" id="actLottie"></div>
      <div class="ok-l">US Stocks account activated!</div>
      <h2>Start investing now!</h2>
      <p>Add money in your US wallet, funds will reflect in 3-5 business days</p>
    </div>
    <div class="cta-area"><button class="btn" id="add">Add money to US wallet</button><button class="btn ghost" id="later">I’ll do it later</button></div>`;
  if(window.lottie && window.SUCCESS_ANIM){ lottie.destroy('actTick');
    el._mounted = ()=>{ const an=lottie.loadAnimation({name:'actTick', container:$('#actLottie', el), renderer:'svg', loop:false, autoplay:false, animationData:window.SUCCESS_ANIM}); setTimeout(()=>an.play(), 200); }; }
  $('#add', el).addEventListener('click', ()=>{ S.walletReturn='explore'; go('wallet','push'); });
  $('#later', el).addEventListener('click', ()=>go('explore','dissolve',{tab:'us', railFrom:'0%', scrollTo:'stock'}));
};

/* ================================================================
   3. SCRIP DETAILS
   ================================================================ */
SCREENS.scrip = (el)=>{
  const s = STOCKS[S.sym];
  const sim = ['GOOGL','MSFT','AMZN'].filter(t=>t!==S.sym).concat(S.sym!=='AAPL'?[]:[]).slice(0,3);
  el.innerHTML = `
    <div class="sd-hdr"><button class="ib" data-back style="margin-left:-6px">${I.back}</button>${logo(s.t)}<span class="t"><b>${s.n}</b><span>${s.t}</span></span><span class="p"><b class="${s.c<0?'neg':''}">${usd(s.p)}</b><span>${chg(s)}</span></span></div>
    <div class="sd-tabs"><span class="on">Summary</span><span>Chart</span><span>News</span><span>Fundamental</span></div>
    <div class="scroll" id="sdScroll">
      <div class="market-live"><i class="live-dot"></i><b>US market live.</b> Extended hours start at 4:00 AM IST</div>
      <div class="chart" style="height:200px;margin-top:8px">${chartSvg(s.t.length*11+3)}</div>
      <div class="range"><div class="r1"><span class="num">${usd(s.p*0.993)}</span><span>16% up in 1 month</span><span class="num">${usd(s.p*1.0087)}</span></div><div class="bar">L<i style="--p:48%"></i>H</div></div>
      <div class="tf">${['1D','1W','1M','3M','6M','1Y','5Y'].map((l,i)=>`<button class="${i===2?'on':''}">${l}</button>`).join('')}</div>
      <div class="divider" style="margin-top:12px"></div>
      <div class="sec"><div class="sec-h">Quick Insights</div>
        <div class="hscroll">${[['Op Profit Trend','Up by 250.62% QoQ'],['Net Profit Trend','Up by 76.95% QoQ'],['Revenue Trend','Up by 12.1% YoY']].map(([a,b])=>`<div class="qi"><span class="tag">$ Latest Earning</span><b>${a}</b><span>${b}</span><br><button data-buy>Buy</button></div>`).join('')}</div></div>
      <div class="divider"></div>
      <div class="sec"><div class="sec-h">Fundamentals Summary <span class="chev">${I.chevR()}</span></div>
        <div class="fund">${[['4/5','Performance','Excellent','#3cbf8a',80],['2/5','Valuation','Expensive','#e9c46a',40],['5/5','Earnings','Positive','#0c7a4f',100]].map(([v,a,b,c,pc])=>`<div><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#f0f0f0" stroke-width="4"/><circle class="v" cx="27" cy="27" r="22" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" transform="rotate(-90 27 27)" style="--a:${(pc/100*138).toFixed(0)}"/><text x="27" y="32" text-anchor="middle" font-size="14" font-weight="500" fill="#262626">${v}</text></svg>${a}<b>${b}</b></div>`).join('')}</div>
        <div class="roe">Return on equity (ROE) improved from 18.5% to 21.3% year-on-year<button data-buy>Buy</button></div></div>
      <div class="divider"></div>
      <div class="sec"><div class="sec-h">Income Statement <a class="link" style="margin-left:auto;font-size:12px">Full statement</a></div>
        <div class="mkt-pills"><button class="pill on">Revenue</button><button class="pill">Operating profit</button><button class="pill">Net Profit</button></div>
        <div style="display:flex;justify-content:space-between;padding:4px 16px;font-size:12px"><span><b style="font-weight:600">Consolidated - Annually</b><br><span style="color:#6f6f6f">All values are in USD Billion</span></span>${I.gear}</div>
        <div class="bars" id="bars">${[[389.6,'+12.5%'],[189.3,'+7.5%'],[398.3,'+2.8%'],[656.0,'+7.3%']].map(([v,c])=>`<div>${v}<span>${c}</span><i data-h="${(v/700*140).toFixed(0)}"></i></div>`).join('')}</div>
        <div class="bars-x"><span>Jun 2022</span><span>Jun 2023</span><span>Jun 2024</span><span>Jun 2025</span></div></div>
      <div class="divider"></div>
      <div class="sec"><div class="sec-h">Company Profile <span class="chev">${I.chevR()}</span></div>
        <div style="display:flex;gap:28px;padding:0 16px;font-size:12px;color:#6f6f6f">${logo(s.t,'sm')}<span>Sector<br><b style="font-size:14px;color:#262626;font-weight:500">Technology</b></span><span>Market cap<br><b style="font-size:14px;color:#262626;font-weight:500">$3.96 T</b></span></div>
        <p style="padding:12px 16px 0;font-size:13px;line-height:19px;color:#6f6f6f"><b style="color:#262626;font-weight:500">${s.n}</b><br>${s.n} designs, makes and sells consumer electronics, software and services, and is one of the largest companies in the world by market capitalisation.</p></div>
      <div class="divider"></div>
      <div class="sec"><div class="sec-h">Similar Stocks</div>
        <div class="rows">${sim.map(t=>{const x=STOCKS[t]; return `<button class="row" data-stock="${t}">${logo(t,'sm')}<span><div class="nm">${x.n}</div><div class="tk">${t}</div></span><span class="px"><b class="pos">${usd(x.p)}</b><span>${chg(x)}</span></span></button>`;}).join('')}</div></div>
      ${legal}
    </div>
    <div class="sd-cta"><button class="btn buy" id="buy">Buy</button><button class="btn ghost">${I.plusC} My Lists</button></div>`;
  const buy = ()=>{ if(!S.activated) return go('actIntro','push'); S.amt=''; go('order','push'); };
  $('#buy', el).addEventListener('click', buy);
  $$('[data-buy]', el).forEach(b=>b.addEventListener('click', buy));
  $$('[data-stock]', el).forEach(b=>b.addEventListener('click', ()=>{ S.sym=b.dataset.stock; go('scrip','push'); }));
  wireBack(el, ()=>go('explore','pop',{tab:'us'}));
  el._mounted = ()=>{
    drawCharts(el);
    const bars = $('#bars', el), sd=$('#sdScroll', el);
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ $$('i', bars).forEach((i,k)=>setTimeout(()=>i.style.height=i.dataset.h+'px', k*90)); io.disconnect(); } }), {root:sd, threshold:.3});
    io.observe(bars);
  };
};

/* ================================================================
   4. ORDER FORM  (+ insufficient funds → wallet → payment)
   ================================================================ */
function keypad(){ return `<div class="keypad">${['1','2','3','kb','4','5','6','','7','8','9','','.','0','del','sw'].map(k=>k==='kb'?`<span class="side">${I.kb}</span>`:k===''?'<span></span>':k==='sw'?`<span class="side"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16"/></svg></span>`:`<button data-k="${k}">${k==='del'?I.del:k}</button>`).join('')}</div>`; }
function bindKeypad(el, onKey){
  $$('[data-k]', el).forEach(b=>b.addEventListener('click', ()=>onKey(b.dataset.k)));
  const kh = e=>{ if(cur!==el || $('.sheet.on') || $('.os-wrap')) return; let k=null;
    if(/^[0-9.]$/.test(e.key)) k=e.key; else if(e.key==='Backspace') k='del'; else return;
    e.preventDefault(); onKey(k); const b=$(`[data-k="${k}"]`, el); if(b){ b.classList.add('press'); setTimeout(()=>b.classList.remove('press'), 120); } };
  document.addEventListener('keydown', kh);
  const mo = new MutationObserver(()=>{ if(!el.isConnected){ document.removeEventListener('keydown', kh); mo.disconnect(); } });
  mo.observe(viewsEl, {childList:true});
}
function editNum(str, k, {maxInt=7, maxDec=2}={}){
  if(k==='del') return str.slice(0,-1);
  if(k==='.'){ if(str.includes('.')||maxDec===0) return str; return (str||'0')+'.'; }
  const [i,d] = str.split('.');
  if(d!==undefined){ if(d.length>=maxDec) return str; return str+k; }
  if((i||'').length>=maxInt) return str;
  if(str==='0') return k;
  return str+k;
}
SCREENS.order = (el, p)=>{
  const s = STOCKS[S.sym];
  el.innerHTML = `
    <div class="of-hdr"><button class="ib" data-back style="margin-left:-6px">${I.back}</button><span class="t"><b>${s.n}</b><span><b style="display:inline;color:#262626;font-size:12px;font-weight:500">${usd(s.p)}</b> <span class="${s.c<0?'neg':'pos'}">${chg(s)}</span></span></span><span class="bs"><i class="on">B</i><i>S</i></span></div>
    <div class="of-fields">
      <div><label>Amount ${I.chevD('#262626',12)} <em id="qtyLbl">Qty 0</em></label><div class="field focus" id="fAmt"><span class="v" id="amtV"></span><span class="sw">${I.swap}</span></div></div>
      <div><label>Market ${I.chevD('#262626',12)}</label><div class="field dis"><span class="v"></span><span class="sw">${I.swap}</span></div></div>
    </div>
    <div id="errSlot"></div>
    <div class="of-gap"></div>
    <div class="of-bar"><div class="req"><span class="rl">Required</span> <b id="req">$0.00</b> ↻<br><span class="avail" id="availW">Available <b id="avail">${usd(S.wallet)}</b></span></div><button class="btn buy" id="cta" disabled>Buy</button></div>
    <div class="quick">${[1,5,10,15,20].map(v=>`<button data-q="${v}">$${v}</button>`).join('')}</div>
    ${keypad()}`;
  const render = ()=>{
    const amt = parseFloat(S.amt)||0, req = amt ? amt + oTotalCharges(amt) : 0, qty = amt/s.p;
    $('#amtV', el).innerHTML = S.amt ? `$ ${S.amt}<i class="caret"></i>` : `<span class="ph">$ </span><i class="caret"></i>`;
    $('#qtyLbl', el).textContent = 'Qty ' + (amt ? qty.toFixed(4) : '0');
    $('#req', el).textContent = usd(req);
    $$('.quick button', el).forEach(b=>b.classList.toggle('on', +b.dataset.q===amt));
    const short = amt>0 && S.wallet < req;
    const btn = $('#cta', el);
    $('#fAmt', el).classList.toggle('err', short);
    $('#errSlot', el).innerHTML = short ? `<div class="of-err">You have insufficient funds to place an order. Add funds to continue.</div>` : '';
    const was = btn.disabled;
    if(short){ btn.disabled=false; btn.className='btn'; btn.textContent='Add funds'; }
    else { btn.disabled = !amt; btn.className='btn buy'; btn.textContent='Buy'; }
    if(was && !btn.disabled) shine(btn);
  };
  const key = k=>{ S.amt = editNum(S.amt, k, {maxInt:5}); render(); };
  bindKeypad(el, key);
  $$('.quick button', el).forEach(b=>b.addEventListener('click', ()=>{ S.amt = b.dataset.q; render(); }));
  $('#cta', el).addEventListener('click', ()=>{
    const amt = parseFloat(S.amt)||0, req = amt + oTotalCharges(amt);
    if(S.wallet < req){ S.walletReturn='order'; return go('wallet','push',{need:req}); }
    review();
  });
  wireBack(el, ()=>go('scrip','pop'));
  function review(){
    const amt = parseFloat(S.amt), c = oCharges(amt), tc = oTotalCharges(amt), qty = amt/s.p;
    const sh = sheet({html:`<div class="sh-body"><div class="sh-title">Delivery order summary</div>
      <div class="kv"><span>Quantity</span><b class="num">${qty.toFixed(4)}</b></div>
      <div class="kv"><span>Trade value (Required)</span><b class="num">${usd(amt+tc)}</b></div>
      <div class="kv" style="border-bottom:0"><button id="tgC">Estimated charges ${I.chevD('#6f6f6f',14)}</button><b class="num">${usd(tc)}</b></div>
      <div class="collapse" id="cC"><div>
        <div class="kv sub"><span>Brokerage</span><span class="num">${usd(c.brok,4)}</span></div>
        <div class="kv sub"><span>Charges</span><span class="num">${usd(c.gst+c.other,4)}</span></div>
        <div class="kv sub2"><span>GST charges</span><span class="num">${usd(c.gst,4)}</span></div>
        <div class="kv sub2"><span>Other charges</span><span class="num">${usd(c.other,4)}</span></div>
        <div class="note">${I.info} Securities orders are placed via Alpaca and under insurance by SIPC</div>
        <a class="link" style="font-size:12px">How is this calculated?</a>
      </div></div>
      <label class="consent" style="padding:14px 0 0;border-top:1px solid #ececec;margin-top:10px"><input type="checkbox" class="check" style="border-radius:50%"><span>Don’t show this review screen from the next order. Change anytime from settings.</span></label>
      </div><div class="sh-foot"><button class="btn buy" id="submit">Submit order</button></div>`});
    $('#tgC', sh.el).addEventListener('click', e=>{ e.currentTarget.classList.toggle('open'); $('#cC', sh.el).classList.toggle('open'); });
    $('#submit', sh.el).addEventListener('click', ()=>{
      const b=$('#submit', sh.el); b.innerHTML='<span class="orbit" style="width:22px;height:22px"><i style="border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff"></i></span>'; b.style.pointerEvents='none';
      setTimeout(()=>{ sh.close(); placeOrder(qty, amt, tc); }, 700);
    });
  }
  function placeOrder(qty, amt, tc){
    S.wallet = Math.max(0, S.wallet - amt - tc);
    const ex = S.holdings.find(x=>x.t===s.t);
    if(ex){ ex.avg = (ex.avg*ex.q + s.p*qty)/(ex.q+qty); ex.q += qty; ex.inv += amt; ex.fresh=true; }
    else S.holdings.unshift({t:s.t, q:qty, avg:s.p, inv:amt, fresh:true});
    $('#avail', el).textContent = usd(S.wallet);
    orderSuccess(qty, amt);
  }
  el._mounted = ()=>{
    render();
    if(p.funded){ const a=$('#availW', el); later(()=>{ a.classList.add('bump'); toast(`${usd(p.funded)} added to your US wallet`); }, 450); }
    if(p.autoSuccess){ S.amt = S.amt || '5'; render(); later(()=>{ const amt=parseFloat(S.amt); placeOrder(amt/s.p, amt, oTotalCharges(amt)); }, 300); }
  };
};

/* --- Order success: Figma "Orders 6.0" delight-tick motion (8802:96118), timings mapped 1:1 --- */
function orderSuccess(qty, amt){
  const s = STOCKS[S.sym], hold = S.holdings.find(x=>x.t===s.t);
  const next = ['NVDA','MSFT','AMZN','GOOGL','TSLA'].filter(t=>t!==s.t).slice(0,3);
  // confetti tracks from get_motion_context: [startX, startY, endX, endY, rotateDeg, startT(ms)]
  const CONF = [[-160,-125,-140,35,-720,1000],[155,-145,135,42,600,1120],[-80,-135,-55,30,-660,1220],[70,-155,50,40,720,1060],[-130,-120,-105,38,-540,1170],[120,-140,100,45,660,1280],[-20,-150,-45,32,-600,1030],[30,-130,55,40,540,1150],[-110,-145,-85,43,-580,1090],[100,-135,75,35,700,1200],[-50,-125,-30,38,-620,1250],[0,-155,20,33,580,1100]];
  const COLS = ['#7b3fc4','#0d7a4c','#c6e66b','#c9a8f0','#9b5ce0','#33b07a'];
  const confHtml = CONF.map((c,i)=>`<svg class="conf" viewBox="0 0 14 8" style="width:${12+(i%3)*3}px;height:7px"><path d="M1 6c2-4 4-4 6 0s4 4 6 0" fill="none" stroke="${COLS[i%COLS.length]}" stroke-width="2.2" stroke-linecap="round"/></svg>`).join('');
  const w = h(`<div class="os-wrap" style="position:absolute;inset:0;pointer-events:auto">
    <div class="os-overlay"></div>
    <div class="os-sheet"><img class="os-glow" src="${A}os-glow.svg" alt=""><img class="os-pat" src="${A}os-pattern.svg" alt=""><div class="grab"></div>
      <div class="os-badge">${confHtml}
        <svg class="os-star" viewBox="0 0 62.5 62.5"><defs><linearGradient id="osStarG" x1="44.3" y1="22.04" x2="10.76" y2="48.08" gradientUnits="userSpaceOnUse"><stop stop-color="#00CE53"/><stop offset=".14" stop-color="#00C854"/><stop offset=".55" stop-color="#00BD57"/><stop offset="1" stop-color="#00BA58"/></linearGradient></defs><path d="M29.04 1.61C30.36.65 32.14.65 33.46 1.61L38.47 5.26C39.11 5.73 39.89 5.99 40.68 5.99L46.88 5.97C48.51 5.97 49.96 7.02 50.46 8.57L52.36 14.47C52.61 15.23 53.09 15.89 53.73 16.36L58.75 19.99C60.07 20.95 60.63 22.64 60.12 24.19L58.19 30.08C57.95 30.84 57.95 31.66 58.19 32.42L60.12 38.31C60.63 39.86 60.07 41.55 58.75 42.51L53.73 46.14C53.09 46.61 52.61 47.27 52.36 48.03L50.46 53.93C49.96 55.48 48.51 56.53 46.88 56.53L40.68 56.51C39.89 56.51 39.11 56.77 38.47 57.24L33.46 60.89C32.14 61.85 30.36 61.85 29.04 60.89L24.03 57.24C23.39 56.77 22.61 56.51 21.82 56.51L15.62 56.53C13.99 56.53 12.54 55.48 12.04 53.93L10.14 48.03C9.89 47.27 9.41 46.61 8.77 46.14L3.75 42.51C2.43 41.55 1.87 39.86 2.38 38.31L4.31 32.42C4.55 31.66 4.55 30.84 4.31 30.08L2.38 24.19C1.87 22.64 2.43 20.95 3.75 19.99L8.77 16.36C9.41 15.89 9.89 15.23 10.14 14.47L12.04 8.57C12.54 7.02 13.99 5.97 15.62 5.97L21.82 5.99C22.61 5.99 23.39 5.73 24.03 5.26Z" fill="url(#osStarG)"/><path class="tk" pathLength="1" d="M20.51 31.65L27.75 38.9 42.23 24.41" fill="none" stroke="#fff" stroke-width="3.91" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 1"/></svg>
      </div>
      <div class="os-text"><h3>Order complete</h3><p class="num">${qty.toFixed(4)} qty of ${s.t} @ ${usd(s.p)}</p><a id="osDetails">View order details ${I.arrowR()}</a></div>
      <div class="os-pos"><div class="top"><span>Qty <span class="pos">+${qty.toFixed(4)}</span> • Avg ${usd(hold.avg)}</span><span class="num">${usd(s.p)} LTP</span></div>
        <div class="mid"><b>${s.n}</b><b class="pos num">+$0.00</b></div><div class="top"><span>US • DELIVERY</span><span>Invested ${usd(hold.inv)}</span></div>
        <div class="bot"><span>HOLDINGS</span><a id="osHold">View holdings ${I.arrowR()}</a></div></div>
      <div class="os-next"><span class="lbl">EXPLORE YOUR NEXT TRADE</span>
        ${next.map(t=>{const x=STOCKS[t]; return `<div class="row">${logo(t)}<span><div class="nm">${t}</div><div class="tk"><span class="num">${usd(x.p)}</span> <span class="${x.c<0?'neg':'pos'}">(${x.c<0?'':'+'}${x.pc.toFixed(2)}%)</span></div></span><button class="buy" data-next="${t}">Buy ${I.arrowR()}</button></div>`;}).join('')}
      </div>
    </div></div>`);
  sheetLayer.appendChild(w);
  const ov=$('.os-overlay',w), sh=$('.os-sheet',w), txt=$('.os-text',w), pos=$('.os-pos',w), nx=$('.os-next',w);
  const H = sh.offsetHeight, COMPACT = H - 300;
  const T = 7988, o = {fill:'both'};
  ov.animate([{opacity:0},{opacity:1}], {...o, duration:300, easing:'ease-out'});
  sh.animate([{transform:`translateY(${H+10}px)`, offset:0},{transform:`translateY(${H+10}px)`, offset:.0626/0.4882, easing:'ease-in-out'},{transform:`translateY(${COMPACT}px)`, offset:.1252/.4882},{transform:`translateY(${COMPACT}px)`, offset:.4256/.4882, easing:'cubic-bezier(.88,.1,.22,.78)'},{transform:'translateY(0)', offset:1}], {...o, duration:T*.4882});
  const star=$('.os-star',w), tk=$('.tk',w);
  star.animate([{opacity:0, transform:'scale(0) rotate(30deg)'},{opacity:1, transform:'scale(.6) rotate(18deg)', offset:.37},{opacity:1, transform:'scale(1) rotate(0deg)'}], {...o, delay:1000, duration:400, easing:'cubic-bezier(.45,1.45,.8,1)'});
  tk.animate([{strokeDasharray:'0 1'},{strokeDasharray:'1 1'}], {...o, delay:1246, duration:408, easing:'ease-out'});
  $$('.conf', w).forEach((c,i)=>{ const [x0,y0,x1,y1,r,t0]=CONF[i];
    c.animate([{opacity:0, transform:`translate(${x0*.55}px,${y0*.4+20}px) rotate(0deg)`},{opacity:1, offset:.075},{opacity:.8, offset:.8, easing:'ease-out'},{opacity:0, transform:`translate(${x1*.9}px,${y1+30}px) rotate(${r}deg)`}],
      {...o, delay:t0, duration:2000, easing:'cubic-bezier(.1,.3,.4,1)'}); });
  txt.animate([{opacity:0},{opacity:1}], {...o, delay:1250, duration:300, easing:'cubic-bezier(.5,0,.5,1)'});
  [pos, nx].forEach((n,i)=>n.animate([{opacity:0, transform:'translateY(50px)'},{opacity:1, transform:'none'}], {...o, delay:3400+i*90, duration:690, easing:'cubic-bezier(.988,-.007,0,1.003)'}));
  const goHold = ()=>{ go('holdings','dissolve'); };
  $('#osHold', w).addEventListener('click', goHold);
  $('#osDetails', w).addEventListener('click', ()=>toast('Order details open here'));
  $$('[data-next]', w).forEach(b=>b.addEventListener('click', ()=>{ S.sym=b.dataset.next; S.amt=''; go('order','push'); }));
  ov.addEventListener('click', goHold);
  markJourney('success');
}

/* --- Wallet: Add money to US wallet --- */
SCREENS.wallet = (el, p)=>{
  if(p.need && !S.inr){ const inrNeed = Math.max(1000, Math.ceil((p.need*FX + 45)/0.992599/500)*500); S.inr = String(inrNeed); }
  el.innerHTML = `${header('Add money to US wallet')}
    <div class="w-amt"><label>Enter amount</label><div class="big num" id="wBig"></div>
      <div class="w-get" id="wGet"></div>
      <div class="w-quick">${[1000,5000,10000].map(v=>`<button data-w="${v}">+ ${inr(v)}</button>`).join('')}</div>
    </div>
    <div class="of-gap"></div>
    <div class="vid"><i>▶</i><span><b>How to Add Funds to Upstox US wallet</b><span>2:10</span></span>${I.chevR('#6f6f6f',16)}</div>
    <div class="bankrow"><span class="bl">A</span><span><b style="font-weight:500">Axis Bank</b><span>••••1234 · Secured</span></span><a>Edit ${I.chevR('#542087',12)}</a></div>
    <div class="cta-area" style="padding-bottom:10px"><button class="btn" id="cta" disabled>Continue to add</button></div>
    ${keypad()}`;
  const render = ()=>{
    const v = parseFloat(S.inr)||0;
    $('#wBig', el).innerHTML = `₹ ${S.inr ? Number(S.inr).toLocaleString('en-IN') : ''}<i class="caret"></i>`;
    const g = $('#wGet', el);
    if(v>0 && v<1000) g.innerHTML = `<span class="neg" style="font-size:12px">Amount cannot be less than ₹1,000</span>`;
    else if(v>=1000) g.innerHTML = `<span>You get <b>${usd(wGet(v))}</b><small>Estimated exchange rate ₹${FX}</small></span><a class="link" id="brk" style="font-size:12px">View breakup ${I.chevR('#542087',12)}</a>`;
    else g.innerHTML = `<span style="color:#9a9a9a;font-size:12px">Min ₹1,000 · funds are converted to USD at the best available rate</span>`;
    const b=$('#cta', el), was=b.disabled; b.disabled = v<1000; if(was && !b.disabled) shine(b);
    const brk = $('#brk', el); if(brk) brk.addEventListener('click', breakup);
  };
  function breakup(){
    const v = parseFloat(S.inr), ch = wCharges(v);
    const s = sheet({html:`<div class="sh-body"><div class="sh-title">Breakup details</div>
      <div class="kv"><span>Amount you transfer</span><b class="num">${inr(v)}</b></div>
      <div class="kv"><span>Estimated charges</span><b class="num">${inr(ch.toFixed(2))}</b></div>
      <div class="kv sub"><span>Best exchange rate</span><span class="num">₹${FX}</span></div>
      <div class="kv sub"><span>GST charges</span><span class="num">₹45</span></div>
      <div class="kv sub"><span>Upstox platform fee</span><span class="num">₹0</span></div>
      <div class="kv"><span>You get in US wallet</span><b class="num pos">${usd(wGet(v))}</b></div>
      <div class="note">${I.info} Deposit time and exchange rate displayed is subject to the approval by the banking partner</div></div>
      <div class="sh-foot"><button class="btn">Okay</button></div>`});
    $('.sh-foot .btn', s.el).addEventListener('click', s.close);
  }
  bindKeypad(el, k=>{ if(k==='.') return; S.inr = editNum(S.inr, k, {maxInt:7, maxDec:0}); render(); });
  $$('[data-w]', el).forEach(b=>b.addEventListener('click', ()=>{ S.inr = String((parseFloat(S.inr)||0) + +b.dataset.w); render(); }));
  wireBack(el, ()=> S.walletReturn==='order' ? go('order','pop') : go('explore','pop',{tab:'us'}));
  $('#cta', el).addEventListener('click', ()=>paySheet());
  function paySheet(){
    const v = parseFloat(S.inr);
    const s = sheet({cls:'paysheet', html:`<div class="sh-body"><div class="sh-title">Pay using</div>
      <div class="amt"><span style="font-size:13px;color:#6f6f6f">Amount</span><b class="num">${inr(v)}</b></div>
      <button class="opt on"><i class="bl pay-bl">A</i><span><b style="font-weight:500">Axis Bank · Net banking</b><span>••••1234 · Registered with Upstox</span></span><i class="rad"></i></button>
      <div class="note">${I.info} LRS rules need US-wallet payments to come from your own registered bank account. UPI isn't supported.</div></div>
      <div class="sh-foot"><button class="btn" id="pay">Pay ${inr(v)}</button></div>`});
    $('#pay', s.el).addEventListener('click', ()=>{ s.close(); setTimeout(()=>go('bankpay','push'), 250); });
  }
  el._mounted = render;
};
SCREENS.bankpay = (el)=>{
  const v = parseFloat(S.inr);
  el.innerHTML = `<div class="bank-pg">
    <div class="bank-top"><i>A</i>Net Banking · Secure payment</div>
    <div class="bank-card"><div class="sh-title" style="padding-top:0">Confirm payment</div>
      <div class="kv"><span>Merchant</span><b style="font-weight:500">Upstox Securities (US wallet)</b></div>
      <div class="kv"><span>From account</span><b style="font-weight:500">Savings ••••1234</b></div>
      <div class="kv" style="border-bottom:0"><span>Amount</span><b class="num" style="font-size:18px">${inr(v)}</b></div>
    </div>
    <div style="padding:0 16px"><button class="btn" id="pay" style="background:#97144d">Pay now</button><button class="btn ghost" id="cancel" style="font-size:14px;color:#6f6f6f">Cancel</button></div>
    <div class="lock">${I.shield} Simulated bank page for this prototype</div></div>`;
  $('#pay', el).addEventListener('click', ()=>go('paying','dissolve'));
  $('#cancel', el).addEventListener('click', ()=>go('wallet','pop'));
};
SCREENS.paying = (el)=>{
  const v = parseFloat(S.inr), got = wGet(v);
  el.innerHTML = `<div class="loader pay-loader"><div class="orbit"><i></i><b>₹</b></div><h3>Confirming your payment</h3><p>Don’t close the app. This takes a few seconds.</p></div>`;
  el._mounted = ()=>{
    later(()=>{
      S.wallet += got;
      const s = sheet({html:`<div class="money-ok"><div class="tick-lottie" data-tick></div><h3>Money added to US wallet</h3><p>${inr(v)} converted at ₹${FX}/$</p><span class="chip-usd num">+ ${usd(got)}</span></div><div class="sh-foot" style="border:0"><button class="btn" id="go">${S.walletReturn==='order' ? 'Continue to order' : 'Start investing'}</button></div>`, onScrim:()=>{}});
      if(window.lottie && window.SUCCESS_ANIM) lottie.loadAnimation({name:'success', container:$('[data-tick]', s.el), renderer:'svg', loop:false, autoplay:true, animationData:window.SUCCESS_ANIM});
      const done = ()=>{ S.inr=''; if(S.walletReturn==='order') go('order','dissolve',{funded:got}); else go('explore','dissolve',{tab:'us', railFrom:'50%', scrollTo:'stock'}); };
      $('#go', s.el).addEventListener('click', done);
    }, 2600);
  };
};

/* ================================================================
   5. HOLDINGS
   ================================================================ */
SCREENS.holdings = (el)=>{
  const hs = S.holdings;
  const inv = hs.reduce((a,x)=>a+x.inv,0);
  const curV = hs.reduce((a,x)=>a + x.q*STOCKS[x.t].p*1.0013, 0);
  const pnl = curV - inv, pct = (pnl/inv*100||0);
  const sgn = v=>v>=0?'+':'-';
  const sortIc = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16l-6 7.5V19l-4 1.5v-8Z"/></svg>`;
  el.innerHTML = `
    <div class="hd-top">
      <div class="hd-tick"><div><span class="nm">NIFTY50</span> <b class="num">23,577.85</b> <span class="chip num">+0.30%</span></div><i></i><div><span class="nm">SENSEX</span> <b class="num">81,784.10</b> <span class="flat num">0.00%</span></div></div>
      <div class="hd-card">
        <div class="hd-nav"><span class="uplogo hd-logo">up<i></i></span><div class="hd-search">${I.search('#262626',18)}<span>Search holdings</span></div><span class="hd-btn">${I.bell}</span><span class="hd-btn">${I.wallet}</span></div>
        <div class="hd-tabs"><span>Overview</span><span>Stocks (99)</span><span>Mutual funds</span><span class="on">US Stocks</span></div>
      </div>
    </div>
    <div class="scroll hd-scroll">
      <div class="hd-sum">
        <div class="cv">Current value <span class="cur"><svg width="10" height="12" viewBox="0 0 10 12"><path d="M5 0 9 4.5H1Z M5 12 1 7.5H9Z" fill="#542087"/></svg>$</span></div>
        <div class="big num" id="hBig">0.00</div>
        <span class="eye">${I.eye}</span>
        <div class="g"><span>Invested<b class="num u">${usd(inv)}</b></span><span>Overall P&amp;L<b class="num ${pnl>=0?'pos':'neg'}">${sgn(pnl)}${usd(Math.abs(pnl))} (${pct.toFixed(2)}%)</b></span><span class="r"><span class="dl">Day’s P&amp;L</span> <svg width="9" height="8" viewBox="0 0 9 8" fill="none" stroke="#545454" stroke-width="1.2"><path d="M3 1 .8 4 3 7M6 1l2.2 3L6 7"/></svg><b class="num ${pnl>=0?'pos':'neg'}">${sgn(pnl)}${usd(Math.abs(pnl))} (${Math.abs(pct).toFixed(2)}%)</b></span></div>
        <span class="chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
      </div>
      <div class="hd-list">
      ${hs.length ? hs.map(x=>{ const s=STOCKS[x.t], ltp=s.p*1.0013, cv=x.q*ltp, pl=cv-x.inv, pp=pl/x.inv*100; return `<div class="hd-row ${x.fresh?'new':''}">
        <div class="a"><span class="num">Qty ${x.q.toFixed(4)} · Avg ${usd(x.avg)}</span><span class="num">${usd(ltp)} <span class="${pl>=0?'pos':'neg'}">(${sgn(pl)}${Math.abs(pp).toFixed(2)}%)</span> LTP</span></div>
        <div class="b"><b>${s.n}</b><b class="num ${pl>=0?'pos':'neg'}">${sgn(pl)}${usd(Math.abs(pl)).replace('$','')}</b></div>
        <div class="c"><span>Current <span class="num">${usd(cv)}</span></span><span class="num">${sgn(pl)}${Math.abs(pp).toFixed(2)}%</span></div>
        <div class="tag">Invested <b class="num">${usd(x.inv)}</b></div></div>`; }).join('') : `<div class="h-empty">No US holdings yet.<br>Buy your first US stock to see it here.</div>`}
      </div>
    </div>
    <div class="hd-fab"><button class="sort">${sortIc}Sort</button><button class="more"><svg width="18" height="18" viewBox="0 0 24 24" fill="#542087"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button></div>
    ${bottomnav('hold')}`;
  wireBottomnav(el);
  el._mounted = ()=>{
    const big=$('#hBig', el), t0=performance.now(), D=900;
    const step=t=>{ const k=Math.min(1,(t-t0)/D), e=1-Math.pow(1-k,3); big.innerHTML = usd(curV*e).replace('$','').replace(/(\.\d+)$/,'<small>$1</small>'); if(k<1) requestAnimationFrame(step); else hs.forEach(x=>x.fresh=false); };
    requestAnimationFrame(step);
  };
};

/* ================================================================
   Panel: journey + restart
   ================================================================ */
const JOURNEY = [
  ['ftue','FTUE — Statue sheet', ()=>{ resetData(); go('explore','dissolve',{stage:'ftue'}); }],
  ['ftux','Spotlight on US Stocks', ()=>{ resetData(); go('explore','dissolve',{stage:'ftux'}); }],
  ['explore','Explore (not activated)', ()=>{ resetData(); go('explore','dissolve',{tab:'us'}); }],
  ['actIntro','Activate account', ()=>{ resetData(); go('actIntro','dissolve'); }],
  ['details','Share your details', ()=>{ resetData(); go('details','dissolve'); }],
  ['declare','Declarations', ()=>{ resetData(); go('declare','dissolve'); }],
  ['actDone','Account activated', ()=>{ resetData(); S.activated=true; go('actDone','dissolve'); }],
  ['explore2','Explore (activated)', ()=>{ resetData(); S.activated=true; go('explore','dissolve',{tab:'us', railFrom:'0%'}); }],
  ['scrip','Scrip details — Apple', ()=>{ resetData(); S.activated=true; go('scrip','dissolve'); }],
  ['order','Order form', ()=>{ resetData(); S.activated=true; S.amt='5'; go('order','dissolve'); }],
  ['wallet','Payment — add money', ()=>{ resetData(); S.activated=true; S.amt='5'; S.walletReturn='order'; go('wallet','dissolve',{need:5.25}); }],
  ['success','Order complete', ()=>{ resetData(); S.activated=true; S.wallet=106.89; S.amt='5'; go('order','dissolve',{autoSuccess:true}); }],
  ['holdings','Holdings', ()=>{ resetData(); S.activated=true; S.wallet=101.64; S.holdings=[{t:'AAPL', q:5/269.53, avg:269.53, inv:5, fresh:true}]; go('holdings','dissolve'); }],
];
const jEl = $('#journey');
jEl.innerHTML = JOURNEY.map(([id,l])=>`<li data-j="${id}"><button>${l}</button></li>`).join('');
$$('li', jEl).forEach((li,i)=>$('button', li).addEventListener('click', JOURNEY[i][2]));
function markJourney(id, p={}){
  let key = id;
  if(id==='explore') key = p.stage==='ftue' ? 'ftue' : p.stage==='ftux' ? 'ftux' : S.activated ? 'explore2' : 'explore';
  if(id==='activating') key='declare';
  if(['bankpay','paying'].includes(id)) key='wallet';
  const idx = JOURNEY.findIndex(j=>j[0]===key); if(idx<0) return;
  $$('li', jEl).forEach((li,i)=>{ li.classList.toggle('on', i===idx); li.classList.toggle('jdone', i<idx); });
}
$('#restart').addEventListener('click', JOURNEY[0][2]);

function fitDevice(){
  const d = $('#device'); if(window.innerWidth<=440){ d.style.transform=''; return; }
  const sc = Math.min(1, (window.innerHeight-40)/820); d.style.transform = sc<1 ? `scale(${sc})` : '';
}
window.addEventListener('resize', fitDevice); fitDevice();

const start = (location.hash||'').slice(1);
const j = JOURNEY.find(x=>x[0]===start);
if(j) j[2](); else go('explore','none',{stage:'ftue'});
window.__S = S; window.__go = go;
})();
