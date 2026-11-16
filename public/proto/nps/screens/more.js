/* More — Figma NPS › More (541:15263)
   More tab 8686:6171 · stories chrome 5720:4168/4205/4058/3964 (bodies redrawn for the case study: tax, how it works, withdrawal, returns),
   story loading 764:115274 / error 764:115292 · Calculate contribution sheet 2531:201432/201795/201788 ·
   Plan selection sheet 2991:191466, 2531:203172, 2991:190900, 2531:201842, Here's why 11090:32371 ·
   Customise NPS plan 2991:191241, 2531:202013, 2531:204002, 2640:199708, 2991:191720, 2991:191910 */
(function(){
const { $, $$, h, A, inr, PLANS, S, SCREENS, go, navBack, resetTo, later, sheet, toast, wireCommon, I, jump } = P;

/* ================= More tab (8686:6171) ================= */
const tile = (name, icon, o={})=>`
  <button class="mo-tile" data-tile="${o.id||name}">
    <span class="mo-circ">
      <img class="mo-ic${o.lum?' lum':''}${o.nps?' nps':''}" src="${A}${icon}" alt="" ${o.nps?'width="17" height="24"':'width="24" height="24"'}>
      ${o.dot?`<img class="mo-dot" src="${A}mo-dot.svg" alt="">`:''}
      ${o.tag?`<span class="mo-ttag" style="background:${o.tagc}">${o.tag}</span>`:''}
    </span>
    <span class="mo-tname">${name}</span>
  </button>`;
const section = (title, sub, tiles, isNew)=>`
  <section class="mo-sec">
    <div class="mo-sec-h"><div class="mo-sec-t">${title}${isNew?'<span class="mo-new">NEW</span>':''}</div><div class="mo-sec-s">${sub}</div></div>
    ${tiles.map(r=>`<div class="mo-row">${r.join('')}</div>`).join('')}
  </section>`;
const bondTiles = [tile('Government Securities','mo-ic-bond.svg'), tile('Treasury<br>bills','mo-ic-bond.svg',{id:'Treasury bills'}), tile('State Dev. Loans (SDL)','mo-ic-bond.svg'), tile('Non-convert. debentures (NCD)','mo-ic-bond.svg')];
const TABICON = {
  home:'<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  stocks:'<path d="M3 20.5h18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="3.5" y="12" width="3" height="8" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="8" y="7" width="3" height="13" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="12.5" y="14" width="3" height="6" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="17" y="9" width="3" height="11" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  mf:'<path d="M12 20v-8M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5ZM12 14.5c0-3-2.4-5-6-5 0 3 2.4 5 6 5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  news:'<path d="M4 5h12v15H6a2 2 0 0 1-2-2Zm12 4h4v9a2 2 0 0 1-4 0M7 8.5h6M7 12h6M7 15.5h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  more:'<circle cx="7" cy="7" r="3.6"/><circle cx="17" cy="7" r="3.6"/><circle cx="7" cy="17" r="3.6"/><circle cx="17" cy="17" r="3.6"/>',
};
const tabbar = ()=>`<nav class="mo-tabbar">${[['home','Home'],['stocks','Stocks'],['news','News'],['mf','Mutual Funds'],['more','More']].map(([k,l])=>
  `<button class="mo-tb${k==='more'?' on':''}" data-tab="${l}"><svg width="24" height="24" viewBox="0 0 24 24" fill="${k==='more'?'currentColor':'none'}">${TABICON[k]}</svg><span>${l}</span></button>`).join('')}</nav>`;

SCREENS.more = (el)=>{
  el.innerHTML = `
    <div class="topbar mo-top"><div class="l"><img src="${A}mo-ic-account.svg" width="24" height="24" alt=""><span class="b1" style="font-weight:500">More</span></div>
      <div class="r"><button class="icon-btn" data-search aria-label="Search"><img src="${A}mo-ic-search.svg" width="24" height="24" alt=""></button>${I.help}</div></div>
    <div class="scroll mo-more stg">
      ${section('Diversify your portfolio','Start investing beyond stocks &amp; explore more',[[
        tile('Gold','mo-ic-gold.svg',{dot:1,lum:1}),
        tile('Fixed Deposits','mo-ic-fd.svg',{dot:1,lum:1,tag:'8.5%',tagc:'#148564'}),
        tile('IPOs','mo-ic-ipo.svg',{dot:1,lum:1,tag:'10 Live',tagc:'#DB542A'}),
        tile('Peer-to-peer investing','mo-ic-p2p.svg',{dot:1,lum:1,tag:'9.5%',tagc:'#148564'})]])}
      ${section('Bonds','Invest in bonds for stable returns',[bondTiles],true)}
      ${section('Loan','Add a safety net with the best coverage plans',[[tile('Personal','mo-ic-personal.svg',{dot:1,lum:1}), tile('Pledge loan','mo-ic-pledge.svg',{dot:1,lum:1})]])}
      ${section('Insurance','Add a safety net with the best coverage plans',[[tile('Life','mo-ic-bond.svg'), tile('Health','mo-ic-bond.svg'), tile('Motor','mo-ic-bond.svg')]])}
      ${section('Content','Get the latest finance news and learn seamlessly',[[tile('Learn','mo-ic-learn.svg',{dot:1,lum:1}), tile('Webinars','mo-ic-webinar.svg',{dot:1,lum:1})]])}
      ${section('Quicklinks','Get market news, expert insights &amp; learning resources',[[
        tile('Switch to PRO mode','mo-ic-pro.svg',{dot:1}), tile('Youtube','mo-ic-youtube.svg',{dot:1}), tile('Telegram','mo-ic-ipo.svg',{dot:1}), tile('Twitter','mo-ic-ipo.svg',{dot:1})],
        [tile('Instagram','mo-ic-insta.svg',{dot:1})]])}
      ${section('Bonds','Invest in bonds for stable returns',[bondTiles],true)}
    </div>
    ${tabbar()}`;
  wireCommon(el);
  el.addEventListener('click', e=>{
    const t = e.target.closest('[data-tile]');
    if(t){
      return toast(t.dataset.tile.replace(/<br>/,' ')+' — not part of this prototype');
    }
    const tb = e.target.closest('[data-tab]');
    if(tb){ if(tb.dataset.tab==='Home') return resetTo([], 'home'); if(tb.dataset.tab!=='More') return toast(tb.dataset.tab+' tab'); return; }
    if(e.target.closest('[data-search]')) toast('Search');
  });
};

/* ================= Education stories ================= */
// Bodies are the redesigned "Truths of NPS": brand purple stays on the CTA only,
// green carries gains, teal and blue carry the infographics.
const SB_CARD = 'sb-card';
const sw = (c)=>`<i class="sb-sw" style="background:${c}"></i>`;
const STORY_BLOBS = [
  [[320,280,'right:-130px',150,'#E1F3EE','58% 42% 47% 53%/45% 55% 45% 55%'],[220,200,'left:-100px',360,'#EAF6F1','40% 60% 55% 45%/60% 40% 60% 40%']],
  [[320,320,'left:-160px',110,'#E3F4F6','45% 55% 60% 40%/50% 45% 55% 50%'],[260,240,'right:-130px',400,'#EFF8FA','60% 40% 45% 55%/40% 60% 40% 60%']],
  [[300,340,'right:-150px',100,'#EAF0F8','52% 48% 40% 60%/55% 45% 55% 45%'],[240,220,'left:-120px',420,'#EFF8FA','45% 55% 58% 42%/48% 52% 48% 52%']],
  [[360,280,'left:-130px',120,'#E1F3EE','48% 52% 62% 38%/52% 40% 60% 48%'],[240,260,'right:-120px',380,'#EAF6F1','60% 40% 45% 55%/45% 60% 40% 55%']],
];
const blobs = (k)=>STORY_BLOBS[k].map(([w,hh,x,y,c,r])=>`<i class="sb-blob" style="width:${w}px;height:${hh}px;${x};top:${y}px;background-color:${c};border-radius:${r}"></i>`).join('');
const head = (kicker, title)=>`<p class="meta c3">${kicker}</p><h2 class="h2 sb-h">${title}</h2>`;

function pillar(){
  const rows = [['3 YRS',70,'#EAF0F8','Partial withdrawal',['Allowed 3 times, 5 yrs apart,','in special cases']],
    ['10 YRS',88,'#D6E3F4','Premature exit',['100% lump sum under ₹1L','Above ₹1L: 80% lump sum,','rest as pension']],
    ['AT 60',88,'#8FAEDE','On maturity',['100% lump sum under ₹5L','Above ₹5L: 60% lump sum,','rest as pension']],
    ['ANY',44,'#3F6CBC','On death',['100% lump sum to your nominee']]];
  let y = 14, g = '';
  rows.forEach(([tag,hh,side,title,lines],i)=>{
    const t = y; y += hh + 12;
    g += `<g stroke="#262626" stroke-width=".7" stroke-linejoin="round">
      <polygon points="0,${t} 14,${t-8} 46,${t-8} 32,${t}" fill="#F9F8FD"/><rect x="0" y="${t}" width="32" height="${hh}" fill="#fff"/>
      <polygon points="32,${t} 46,${t-8} 46,${t+hh-8} 32,${t+hh}" fill="${side}"/></g>
      <text transform="translate(20,${t+hh/2}) rotate(-90)" text-anchor="middle" font-size="11" font-weight="600" fill="#3F6CBC">${tag}</text>
      ${i ? `<line x1="64" y1="${t-6}" x2="312" y2="${t-6}" stroke="#D9E1EC"/>` : ''}
      <text x="64" y="${t+18}" font-size="16" font-weight="600" fill="#262626">${title}</text>
      ${lines.map((l,n)=>`<text x="64" y="${t+38+n*17}" font-size="12" font-weight="500" fill="#6A6A6A">${l}</text>`).join('')}`;
  });
  return `<svg class="sb-pillar" viewBox="0 0 312 344" width="312" height="344" role="img" aria-label="NPS withdrawal rules as a stacked pillar">
    <defs><filter id="sbShadow" x="-30%" y="-10%" width="160%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#10182B" flood-opacity=".16"/></filter></defs>${g}</svg>`;
}

const STORY_HTML = [
  ()=>`${head('Introducing','National Pension Scheme')}<p class="meta c2 sb-sub">Government-backed retirement savings</p>
    <div class="sb-hero"><p class="meta cg">Save tax up to</p><p class="sb-big">₹15,600</p><p class="meta c2">On ₹50k, under 80CCD(1)</p></div>
    <div class="${SB_CARD} sb-extra"><div class="sb-row"><span class="b2 c2">Additionally, save up to</span><b class="sb-amt">₹46,800</b></div>
      <i class="sb-bar sb-grow"></i><p class="meta c3">Using ₹1.5 L as an alternate to 80C</p></div>`,
  ()=>`${head('How NPS works','Invest now, get paid after 60')}
    <div class="sb-life"><div class="sb-rail"><i style="background:#A7D9DF;color:#0F3A41">Today</i><i style="background:#3E8A95">At 60</i><i style="background:#1F5A63">After 60</i></div>
      <div class="sb-stops">
        <div class="${SB_CARD}" style="border-left-color:#A7D9DF"><p class="b1 semi">Invest up to ₹50k a year</p><p class="meta c2">Tax exemption up to ₹15,600 u/s 80CCD(1)</p><p class="meta sb-lock">${'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'}Locked till 60</p></div>
        <div class="${SB_CARD}" style="border-left-color:#3E8A95"><p class="b1 semi">Withdraw 60% of your corpus</p><p class="meta c2">All tax-free</p></div>
        <div class="${SB_CARD}" style="border-left-color:#1F5A63"><p class="b1 semi">Monthly or yearly pension</p><p class="meta c2">Taxed as per your slab</p></div>
      </div></div>`,
  ()=>`${head('Withdrawal rules','When money comes out')}<div class="sb-pillar-wrap">${pillar()}</div>`,
  ()=>`${head('Returns vs risk','High returns at low risk')}
    <div class="${SB_CARD} sb-cmp">
      <div class="sb-cmp-g"><span class="meta semi">NPS</span><span class="sb-sbar sb-grow"><i style="width:36%"></i><i></i></span><b class="meta cg">10–13%</b>
        <span class="meta semi">PPF</span><span class="sb-sbar sb-grow" style="width:66%"><i style="width:55%"></i><i></i></span><b class="meta c2">7.1%</b></div>
      <div class="meta c2 sb-legend"><span>${sw('#E1E1E1')}Invested</span><span>${sw('#8DD5B8')}Profit</span></div>
      <p class="meta c2 sb-note">Up to 12% a year with an aggressive plan, higher than PPF</p></div>
    <div class="${SB_CARD} sb-mix">
      <svg viewBox="0 0 42 42" width="96" height="96" aria-hidden="true"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#3F6CBC" stroke-width="6.5" stroke-dasharray="43 57" stroke-dashoffset="25"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#8DD5B8" stroke-width="6.5" stroke-dasharray="28 72" stroke-dashoffset="-19.5"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#8AD5DE" stroke-width="6.5" stroke-dasharray="24 76" stroke-dashoffset="-49"/></svg>
      <div class="meta"><div>${sw('#3F6CBC')}Equity</div><div>${sw('#8DD5B8')}Corporate bonds</div><div>${sw('#8AD5DE')}Govt. bonds</div><p class="c2">Diversified as per your age</p></div></div>`,
];
const STORY_MS = 5000, N_STORIES = 4;
SCREENS.stories = (el, p={})=>{
  let i = Math.max(0, Math.min(N_STORIES-1, p.start|0)), hold = false, downAt = 0, state = 'ok';
  el.classList.add('mo-story');
  el.innerHTML = `
    <div class="sb-blobs" id="stBlobs"></div>
    <div class="mo-st-grad"></div>
    <div class="mo-st-bar"><button class="mo-st-x" data-x aria-label="Close"><img src="${A}mo-close.svg" width="24" height="24" alt=""></button>
      <div class="mo-st-steps">${Array.from({length:N_STORIES},(_, k)=>`<i data-s="${k}"><b></b></i>`).join('')}</div></div>
    <div class="mo-st-body" id="stBody"></div>
    <div class="mo-st-foot"><button class="btn purple" data-cta>Save ₹15,600 in taxes</button></div>`;
  const body = $('#stBody', el), steps = $$('.mo-st-steps i', el);
  const close = ()=>{ S.d.storiesSeen = true; navBack(); };
  const setDark = (on)=>{ el.classList.toggle('dark', on); $('#statusbar').classList.toggle('light', on); };
  function show(k){
    i = k; state = 'ok'; setDark(false);
    body.innerHTML = `<div class="sb stg">${STORY_HTML[k]()}</div>`;
    $('#stBlobs', el).innerHTML = blobs(k);
    body.dataset.story = k+1;
    steps.forEach((s, n)=>{ s.className = n<k ? 'done' : n===k ? 'cur' : ''; const b = s.firstChild; b.style.animation='none'; void b.offsetWidth; b.style.animation=''; });
  }
  function loadState(kind){
    state = kind; setDark(true);
    steps.forEach(s=>s.className='');
    body.innerHTML = kind==='loading'
      ? `<div class="mo-st-dots"><i></i><i></i><i></i><i></i><i></i></div>`
      : `<div class="mo-st-err"><p>We were unable to fetch<br>the next story</p><button data-retry>Retry</button></div>`;
  }
  // auto-advance: the current segment's CSS animation runs 5s; pause while held or a sheet is open
  el.addEventListener('animationend', e=>{
    if(!e.target.parentElement || !e.target.parentElement.classList.contains('cur')) return;
    if(i < N_STORIES-1) show(i+1); else e.target.parentElement.className = 'done';
  });
  (function tick(){
    const paused = hold || P.openSheets.length > 0;
    el.classList.toggle('paused', paused);
    later(tick, 150);
  })();
  el.addEventListener('pointerdown', e=>{ if(e.target.closest('button')) return; hold = true; downAt = Date.now(); });
  el.addEventListener('pointerup', e=>{
    if(!hold) return; hold = false;
    if(Date.now()-downAt > 350 || state!=='ok') return;   // long-press = pause only
    const r = el.getBoundingClientRect();
    if(e.clientX - r.left > r.width/2){ if(i < N_STORIES-1) show(i+1); }
    else if(i > 0) show(i-1); else show(0);
  });
  el.addEventListener('pointercancel', ()=>hold=false);
  el.addEventListener('click', e=>{
    if(e.target.closest('[data-x]')) return close();
    if(e.target.closest('[data-retry]')){ loadState('loading'); later(()=>show(i), 1200); return; }
    if(e.target.closest('[data-cta]')){ S.d.storiesSeen = true; P.openCalculator(); }
  });
  const ld = S.scn.load;
  if(ld==='loading'){ loadState('loading'); later(()=>show(i), 1200); }
  else if(ld==='fail'){ loadState('loading'); later(()=>loadState('fail'), 900); }
  else show(i);
  el.__refresh = ()=>{};
};

/* ================= Calculate contribution sheet ================= */
const MIN_AMT = 1000, MAX_AMT = 200000, TICK_V = 2500, TICK_PX = 18, FULL = 50000;
const kfmt = (v)=> v>=100000 ? (+(v/100000).toFixed(2))+'L' : (v/1000)+'K';
P.openCalculator = function({onDone}={}){
  const done = onDone || (()=>P.openPlans());
  const ticks = [];
  for(let v=0; v<=MAX_AMT; v+=TICK_V){
    const x = v/TICK_V*TICK_PX;
    ticks.push(`<i style="left:${x}px"></i>`);
    if(v===MIN_AMT || (v>0 && v%10000===0)) ticks.push(`<em style="left:${x}px">${kfmt(v)}</em>`);
  }
  ticks.push(`<em style="left:${MIN_AMT/TICK_V*TICK_PX}px">1K</em>`);
  const body = `
    <div class="mo-calc">
      <p class="mo-calc-q">How much are you planning to invest in NPS this year?</p>
      <div class="mo-calc-in" data-field><span>₹</span><span class="mo-fi" id="calcFi"></span></div>
      <p class="mo-calc-help">Min. investment: ₹1000</p>
      <div class="mo-ruler" id="ruler">
        <div class="mo-r-glow"></div>
        <div class="mo-r-strip" id="strip">${ticks.join('')}</div>
        <div class="mo-r-mid"></div>
        <img class="mo-r-ptr" src="${A}mo-pointer.svg" width="13" height="11" alt="">
      </div>
    </div>
    <div class="mo-calc-note" id="calcNote"></div>
    <div class="sh-foot mo-foot"><button class="btn purple" data-cont>Continue</button></div>`;
  const skel = `
    <div class="mo-calc" style="align-items:center;gap:10px;padding-top:24px">
      <span class="skel" style="width:296px;height:12px"></span><span class="skel" style="width:120px;height:12px"></span>
      <span class="skel" style="width:96px;height:20px;margin-top:6px"></span><span class="skel" style="width:110px;height:10px"></span>
      <div style="display:flex;gap:16px;margin:18px 0 6px">${'<span class="skel" style="width:2px;height:16px"></span>'.repeat(18)}</div>
    </div>
    <div style="padding:16px;display:flex;gap:16px;align-items:center"><span class="skel" style="width:24px;height:24px;border-radius:50%"></span><span class="skel" style="flex:1;height:12px"></span></div>
    <div class="sh-foot mo-foot"><button class="btn purple" disabled>Continue</button></div>`;
  const sh = sheet({cls:'mo-sheet', html:`<div id="calcRoot">${S.scn.load==='loading' ? skel : body}</div>`});
  const root = $('#calcRoot', sh.el);
  if(S.scn.load==='loading') later(()=>{ root.innerHTML = body; wire(); }, 1200); else wire();

  function wire(){
    const strip = $('#strip', root), note = $('#calcNote', root), fiEl = $('#calcFi', root);
    let v = Math.max(MIN_AMT, S.d.amount || FULL);
    const fmt = (n)=>Number(n).toLocaleString('en-IN');
    const place = (anim)=>{
      strip.style.transition = anim ? 'transform .35s var(--std)' : 'none';
      strip.style.transform = `translateX(${164 - Math.min(v, MAX_AMT)/TICK_V*TICK_PX}px)`;
    };
    const paint = ()=>{
      S.d.amount = v;
      if(v >= FULL) note.innerHTML = `<div class="mo-note ok"><img src="${A}mo-check-16.svg" width="16" height="16" alt=""><p>Yay! You’re saving ${inr(Math.round(FULL*0.312))} in taxes under 80CCD</p></div>`;
      else note.innerHTML = `<div class="mo-note warn"><img src="${A}mo-moneybag-16.svg" width="16" height="16" alt=""><p>Invest <b>${+((FULL-v)/1000).toFixed(1)}k more </b>to get full tax exemption under 80CCD in FY 23-24</p></div>`;
    };
    const fi = FI.create(fiEl, { kb:'num', max:7, value:String(v), allow:c=>/\d/.test(c),
      onChange:(s)=>{ const n = parseInt(s||'0',10); if(n>=MIN_AMT){ v = n; place(true); paint(); } },
      onSubmit:()=>FI.blur(),
      onBlur:()=>{ const n = parseInt(fi.value||'0',10); v = Math.max(MIN_AMT, n||MIN_AMT); fi.value = String(v); place(true); paint(); fiEl.textContent = fmt(v); } });
    fiEl.textContent = fmt(v);
    place(false); paint();
    // draggable ruler
    const ruler = $('#ruler', root);
    let sx = null, sv = 0;
    ruler.addEventListener('pointerdown', e=>{ if(FI.active) FI.blur(); sx = e.clientX; sv = v; ruler.setPointerCapture(e.pointerId); ruler.classList.add('drag'); });
    ruler.addEventListener('pointermove', e=>{
      if(sx===null) return;
      const scale = ruler.getBoundingClientRect().width / ruler.offsetWidth || 1;
      const nv = Math.round(Math.max(MIN_AMT, Math.min(MAX_AMT, sv - (e.clientX - sx)/scale/TICK_PX*TICK_V))/1000)*1000;
      if(nv!==v){ v = Math.max(MIN_AMT, nv); fi.value = String(v); fiEl.textContent = fmt(v); paint(); }
      strip.style.transition = 'none';
      strip.style.transform = `translateX(${164 - Math.max(MIN_AMT, Math.min(MAX_AMT, sv - (e.clientX - sx)/scale/TICK_PX*TICK_V))/TICK_V*TICK_PX}px)`;
    });
    const end = ()=>{ if(sx===null) return; sx = null; ruler.classList.remove('drag'); place(true); };
    ruler.addEventListener('pointerup', end); ruler.addEventListener('pointercancel', end);
    root.addEventListener('click', e=>{
      if(FI.active===fi && !e.target.closest('[data-field]')) FI.blur();
      if(e.target.closest('[data-cont]')){
        if(FI.active) FI.blur();
        // straight into plans: keep this sheet and morph it, no close-then-reopen jump
        if(!onDone) return P.openPlans({reuse:sh});
        sh.close(); done();
      }
    });
  }
  return sh;
};

/* ================= Plan selection sheet ================= */
const COLORS = { eq:'#AF91D1', corp:'#FD9172', gov:'#FDBD4D', alt:'#3CC7C5' };
const RISK = { aggressive:['High risk','mo-risk-high.svg','var(--err)'], moderate:['Medium risk','mo-risk-med.svg','var(--warn)'], conservative:['Low risk','mo-risk-low.svg','var(--green)'] };
const suggestFor = (age)=> age < 30 ? 'aggressive' : age < 45 ? 'moderate' : 'conservative';
const WHY = {
  aggressive:`At your age, you have a long investment horizon and higher risk tolerance. The 'Aggressive' plan's 75% equity allocation could help you capitalize on market growth. This plan automatically adjusts equity exposure over time to protect your investment as you near retirement.`,
  moderate:`At your age, you still have a good investment horizon with moderate risk tolerance. The 'Moderate' plan's 50% equity allocation balances market growth with stability. This plan automatically adjusts equity exposure over time to protect your investment as you near retirement.`,
  conservative:`As you get closer to retirement, protecting what you have built matters most. The 'Conservative' plan's 25% equity allocation keeps your savings steady with lower risk. This plan automatically adjusts equity exposure over time to protect your investment as you near retirement.`,
};
function donut(pl, size=41){
  const parts = [['eq',pl.eq],['corp',pl.corp],['gov',pl.gov],['alt',pl.alt]].filter(x=>x[1]>0);
  const r = 17.5, c = size/2; let off = 0;
  const segs = parts.map(([k,v])=>{ const len = Math.max(0, v - (parts.length>1?1.2:0)); const s = `<circle cx="${c}" cy="${c}" r="${r}" pathLength="100" stroke="${COLORS[k]}" stroke-width="6" fill="none" stroke-dasharray="${len} ${100-len}" stroke-dashoffset="${-off}"/>`; off += v; return s; });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">${segs.join('')}</svg>`;
}
const legend = (k, label, v)=>`<div class="mo-lg"><span><i style="background:${COLORS[k]}"></i>${label}</span><b>${v}%</b></div>`;
P.openPlans = function({onDone, reuse}={}){
  const done = onDone || (()=>resetTo(['home'],'explore'));
  let sel = S.d.plan || 'aggressive';
  const sug = suggestFor(S.d.age);
  const row = (k)=>{
    const pl = PLANS[k], on = sel===k;
    if(k==='custom') return `<div class="mo-plan${on?' on':''}" data-plan="custom"><div class="mo-pl-top"><img class="mo-radio" src="${A}${on?'mo-radio-on.svg':'mo-radio-off.svg'}" width="24" height="24" alt=""><div class="mo-pl-name">Customise plan</div></div></div>`;
    const [rl, ri, rc] = RISK[k];
    return `<div class="mo-plan${on?' on':''}" data-plan="${k}">
      <div class="mo-pl-top"><img class="mo-radio" src="${A}${on?'mo-radio-on.svg':'mo-radio-off.svg'}" width="24" height="24" alt="">
        <div><div class="mo-pl-name">${pl.name}</div><div class="mo-pl-risk" style="color:${rc}">${rl}<img src="${A}${ri}" width="16" height="12" alt=""></div></div>
        <div class="mo-pl-ret">${pl.ret.replace(' - ',' -')}</div></div>
      ${on?`<div class="mo-pl-alloc"><div class="mo-alloc">${donut(pl)}
        <div class="mo-lgs"><div>${legend('eq','Equity',pl.eq)}${legend('gov','Govt bonds',pl.gov)}</div><div>${legend('corp','Corp bonds',pl.corp)}</div></div></div></div>`:''}
    </div>
    ${k===sug?`<div class="mo-nudge"><span class="mo-ng-age">${S.d.age} yrs</span><span class="mo-ng-div"><i></i><img src="${A}mo-nudge-chev.svg" width="7.6" height="4.5" alt=""><i></i></span>
      <p>Consider the ${PLANS[sug].name} plan as per your age. <b data-why>Here’s why</b></p></div>`:''}`;
  };
  const render = ()=>`
    <div class="mo-pl-head"><div class="h2">Plans</div><div class="b2 c2">Select a plan based on your risk preference</div></div>
    <div class="sh-scroll mo-pl-list">${['aggressive','moderate','conservative','custom'].map(row).join('')}</div>
    <div class="sh-foot mo-foot"><button class="btn purple" data-cont>Continue</button></div>`;
  const skel = `
    <div class="mo-pl-head"><span class="skel" style="width:86px;height:24px;margin-bottom:8px"></span><span class="skel" style="width:186px;height:14px"></span></div>
    <div class="mo-pl-list">${[1,2,3].map((_,n)=>`<div class="mo-plan"><div class="mo-pl-top"><span class="mo-sk-radio"></span><div><span class="skel" style="width:47px;height:14px;margin-bottom:8px"></span><span class="skel" style="width:52px;height:14px"></span></div><span class="skel" style="width:57px;height:14px;margin-left:auto"></span></div>${n===0?`<div style="padding:0 16px 16px"><span class="skel" style="height:22px;border-radius:8px"></span></div><div class="mo-sk-nudge"><span class="skel" style="width:43px;height:24px;background:#e1e1e1"></span><span class="skel" style="flex:1;height:12px;background:#e1e1e1"></span></div>`:''}</div>`).join('')}
      <div class="mo-plan"><div class="mo-pl-top"><span class="mo-sk-radio"></span><span class="skel" style="width:93px;height:16px"></span></div></div></div>
    <div class="sh-foot mo-foot"><button class="btn purple" disabled>Continue</button></div>`;
  let sh, root;
  if(reuse){
    // morph the open contribution sheet into Plans: ease its height, fade the new content in
    sh = reuse;
    const el = sh.el, h0 = el.offsetHeight;
    root = h(`<div id="plRoot" class="mo-pl-root mo-morph-in">${render()}</div>`);
    const old = $('#calcRoot', el);
    old.replaceWith(root);
    el.classList.add('mo-plans');
    const h1 = el.offsetHeight;
    el.style.height = h0+'px'; void el.offsetHeight;
    el.style.transition = 'transform .6s var(--gentle), height .52s var(--out)';
    el.style.height = h1+'px';
    setTimeout(()=>{ el.style.height = ''; el.style.transition = ''; root.classList.remove('mo-morph-in'); }, 560);
  } else {
    sh = sheet({cls:'mo-sheet mo-plans', html:`<div id="plRoot" class="mo-pl-root">${S.scn.load==='loading' ? skel : render()}</div>`});
    root = $('#plRoot', sh.el);
  }
  if(S.scn.load==='loading' && !reuse) later(()=>{ root.innerHTML = render(); }, 1200);
  root.addEventListener('click', e=>{
    if(e.target.closest('[data-why]')){ e.stopPropagation(); return sheet({cls:'mo-sheet', html:`<p class="mo-why">${WHY[sug]}</p>`}); }
    const pl = e.target.closest('[data-plan]');
    if(pl && pl.dataset.plan!==sel){ const st = $('.sh-scroll', root).scrollTop; sel = pl.dataset.plan; root.innerHTML = render(); $('.sh-scroll', root).scrollTop = st; return; }
    if(e.target.closest('[data-cont]')){
      sh.close();
      if(sel==='custom') return go('customPlan','push');
      S.d.plan = sel; done();
    }
  });
  return sh;
};

/* ================= Customise NPS plan ================= */
const FIELDS = [
  { k:'eq',   label:'Equity (max. 75%)',             max:75,  range:100 },
  { k:'corp', label:'Corporate debts',               max:100, range:100 },
  { k:'gov',  label:'Government bonds',              max:100, range:100 },
  { k:'alt',  label:'Alternate investment (max. 5%)', max:5,  range:35 },
];
const RET = { eq:.14, corp:.10, gov:.08, alt:.10 };
SCREENS.customPlan = (el)=>{
  el.classList.add('grey');
  const c = S.d.custom = { eq:S.d.custom.eq, corp:S.d.custom.corp, gov:S.d.custom.gov, alt:S.d.custom.alt };
  const head = `
    <div class="topbar mo-cp-top"><div class="l">${I.back()}<span class="b1" style="font-weight:500">Customise NPS plan</span></div></div>`;
  const content = `
    <div class="mo-cp-calc" id="cpCalc"></div>
    <div class="scroll mo-cp-body" id="cpBody">${FIELDS.map(f=>`
      <div class="mo-cp-blk" data-k="${f.k}">
        <div class="mo-cp-row"><p>${f.label}</p><div class="mo-cp-in" data-field><span class="mo-fi" data-fi="${f.k}"></span><span class="mo-pct">%</span></div></div>
        <div class="mo-sl" data-sl="${f.k}"><i class="mo-sl-bg"></i><i class="mo-sl-zone" style="width:${f.max/f.range*100}%"></i><i class="mo-sl-fill"></i><b class="mo-sl-knob"></b></div>
      </div>`).join('')}</div>
    <div class="foot mo-cp-foot"><button class="btn outline" data-reset>Reset</button><button class="btn purple" data-cont>Continue</button></div>`;
  const skel = `
    <div class="mo-cp-calc"><div><span class="skel" style="width:30px;height:10px;margin-bottom:6px"></span><span class="skel" style="width:46px;height:14px"></span></div><div style="margin-left:auto;text-align:right"><span class="skel" style="width:30px;height:10px;margin:0 0 6px auto"></span><span class="skel" style="width:46px;height:14px"></span></div></div>
    <div class="scroll mo-cp-body">${FIELDS.map(()=>`<div class="mo-cp-blk"><div class="mo-cp-row"><span class="skel" style="width:120px;height:16px"></span><span class="skel" style="width:28px;height:24px;margin-left:auto"></span></div><span class="skel" style="height:8px;margin-top:20px;border-radius:8px"></span></div>`).join('')}</div>
    <div class="foot mo-cp-foot"><button class="btn outline" disabled>Reset</button><button class="btn purple" disabled>Continue</button></div>`;
  el.innerHTML = head + `<div class="mo-cp-wrap" id="cpWrap">${S.scn.load==='loading' ? skel : content}</div>`;
  wireCommon(el);
  if(S.scn.load==='loading') later(()=>{ $('#cpWrap', el).innerHTML = content; wire(); }, 1200); else wire();

  function wire(){
    const fis = {};
    const total = ()=>c.eq + c.corp + c.gov + c.alt;
    const paint = ()=>{
      const t = total(), over = FIELDS.some(f=>c[f.k] > f.max), ok = t===100 && !over;
      const eq = c.eq, risk = eq <= 30 ? ['Low','mo-risk-low.svg','var(--green)'] : eq <= 50 ? ['Medium','mo-risk-med.svg','var(--warn)'] : ['High','mo-risk-high.svg','var(--err)'];
      const ret = t ? (c.eq*RET.eq + c.corp*RET.corp + c.gov*RET.gov + c.alt*RET.alt) / t * 100 : 0;
      $('#cpCalc', el).innerHTML = `
        <div class="mo-cp-l"><div><span>Risk</span><b style="color:${risk[2]}">${risk[0]}<img src="${A}${risk[1]}" width="16" height="12" alt=""></b></div>
          <div><span>3Y returns</span><b>${ret.toFixed(1)}% p.a.</b></div></div>
        ${t===100 ? `<div class="mo-cp-r"><span>Total</span><b>100%</b></div>` : `<div class="mo-cp-r err"><span>Total should be 100</span><b><i class="mo-err-ic">!</i>${t}%</b></div>`}`;
      FIELDS.forEach(f=>{
        const v = c[f.k], pct = Math.min(v, f.max)/f.range*100;
        const sl = $(`[data-sl="${f.k}"]`, el);
        sl.style.setProperty('--p', pct+'%');
        $(`[data-k="${f.k}"] .mo-cp-in`, el).classList.toggle('err', v > f.max);
      });
      $('[data-cont]', el).disabled = !ok;
    };
    FIELDS.forEach(f=>{
      const fe = $(`[data-fi="${f.k}"]`, el);
      fis[f.k] = FI.create(fe, { kb:'num', max:3, value:String(c[f.k]), allow:(ch,v)=>/\d/.test(ch) && +(v+ch) <= 100 && !(v==='0'),
        onChange:(s)=>{ c[f.k] = parseInt(s||'0',10); paint(); },
        onSubmit:()=>FI.blur(),
        onFocus:()=>setTimeout(()=>fe.closest('.mo-cp-blk').scrollIntoView({block:'nearest', behavior:'smooth'}), 320),
        onBlur:(fi)=>{ if(fi.value==='') { fi.value = '0'; fi.render(); } } });
      // draggable slider
      const sl = $(`[data-sl="${f.k}"]`, el);
      let drag = false;
      const setFrom = (x)=>{
        const r = sl.getBoundingClientRect();
        const v = Math.round(Math.max(0, Math.min(1, (x - r.left)/r.width)) * f.range);
        const nv = Math.min(v, f.max);
        if(nv!==c[f.k]){ c[f.k] = nv; fis[f.k].value = String(nv); fis[f.k].render(); paint(); }
      };
      sl.addEventListener('pointerdown', e=>{ if(FI.active) FI.blur(); drag = true; sl.setPointerCapture(e.pointerId); sl.classList.add('drag'); setFrom(e.clientX); });
      sl.addEventListener('pointermove', e=>{ if(drag) setFrom(e.clientX); });
      const up = ()=>{ drag = false; sl.classList.remove('drag'); };
      sl.addEventListener('pointerup', up); sl.addEventListener('pointercancel', up);
    });
    paint();
    $('#cpWrap', el).addEventListener('click', e=>{
      if(FI.active && !e.target.closest('[data-field]')) FI.blur();
      if(e.target.closest('[data-reset]')){
        Object.assign(c, { eq:PLANS.custom.eq, corp:PLANS.custom.corp, gov:PLANS.custom.gov, alt:PLANS.custom.alt });
        FIELDS.forEach(f=>{ fis[f.k].value = String(c[f.k]); fis[f.k].render(); }); paint();
      }
      const cb = e.target.closest('[data-cont]');
      if(cb && !cb.disabled){ S.d.plan = 'custom'; P.loadingBtn(cb, 700, ()=>resetTo(['home'],'explore')); }
    });
  }
};

/* ================= Jumps ================= */
jump('stories', 'Stories', 'more', ()=> resetTo(['home'], 'stories', {start:0}));
jump('calc', 'Contribution', 'more', ()=>{ resetTo([], 'home'); P.openCalculator(); });
jump('plans', 'Plans', 'more', ()=>{ resetTo([], 'home'); P.openPlans(); });
jump('customPlan', 'Custom plan', 'more', ()=> resetTo(['home'], 'customPlan'));
})();
