/* Explore — Figma NPS › Explore Page (853:226362 default, 5283:18713 stories seen, 5283:14872 taxes widget,
   4149:25479 plan chips / asset split, 5498:30275 view-allocation sheet + 13231:215859 age slider,
   2640:200208 maturity info sheet (+803:228405 loading), 788:213892 loading failed, 559:33415 custom plan states)
   + All funds page (559:35209: 769:209326 list, 15136:27809 filter bar, 2640:200009 sort sheet,
   2640:199952 / 2640:199982 filters, 4006:31247 no results) + video player (3210:214179). */
(function(){
const { $, $$, h, A, inr, PLANS, FUNDS, fundById, S, SCREENS, go, navBack, resetTo, later, sheet, toast, wireCommon, I, jump } = P;

/* ---------- per-fund numbers (Figma 769:209326; funds not drawn in Figma use plausible values) ---------- */
const FD = {
  icici:{ logo:'ex-logo-icici.png', start:'18 May 2009', yr:2009, ret:15.12, rvc:'High',    risk:'Average', aum:42350,  top:true },
  axis: { logo:'ex-logo-axis.png',  start:'18 May 2009', yr:2009, ret:17.12, rvc:'High',    risk:'Average', aum:380 },
  kotak:{ logo:'ex-logo-kotak.png', start:'18 May 2009', yr:2009, ret:12.76, rvc:'Average', risk:'Low',     aum:4210 },
  sbi:  { logo:'ex-logo-sbi.png', start:'14 Dec 2008', yr:2008, ret:13.84, rvc:'Average', risk:'Low',     aum:162400 },
  hdfc: { logo:'ex-logo-hdfc.png', start:'1 Aug 2013',  yr:2013, ret:14.62, rvc:'High',    risk:'Average', aum:98700 },
  uti:  { logo:'ex-logo-uti.png', start:'5 Jun 2009',  yr:2009, ret:13.21, rvc:'Average', risk:'Average', aum:45600 },
  lic:  { ini:'LI', start:'22 Feb 2010', yr:2010, ret:12.94, rvc:'Average', risk:'Low',     aum:82300 },
  absl: { logo:'ex-logo-absl.png', start:'9 May 2017',  yr:2017, ret:14.05, rvc:'High',    risk:'High',    aum:1320 },
};
const TOP3 = ['icici','axis','kotak'];
const fname = (id)=> id==='icici' ? 'ICICI  Prudential Pension Fund' : fundById(id).name;
const NOW_YR = 2026;

/* ---------- calculations ---------- */
const split = ()=> S.d.plan==='custom' ? S.d.custom : PLANS[S.d.plan] || PLANS.aggressive;
const years = ()=> Math.max(1, (S.d.age < 60 ? 61 : 75) - S.d.age);   // "₹50,000 for 32 yrs" at age 29 (note 2946:192015)
function fundRet(id){
  const base = FD[id].ret;
  const d = { aggressive:0, moderate:1.62, conservative:3.4 }[S.d.plan];
  return +(base - (d!=null ? d : (75 - (S.d.custom.eq||0)) * 0.06)).toFixed(2);
}
// future value of a yearly contribution, calibrated so ICICI · Aggressive · ₹50k · 32 yrs = ₹3.67 Cr (Figma)
const fv = (amt, n, r)=> amt * ((Math.pow(1+r, n) - 1) / r) * (1+r);
const K = 3.67e7 / fv(50000, 32, 0.1512);
const maturity = (id)=> fv(S.d.amount, years(), fundRet(id)/100) * K;
const crore = (n)=> n>=1e7 ? '₹ '+(n/1e7).toFixed(2)+' Cr' : '₹ '+(n/1e5).toFixed(2)+' L';
const croreTight = (n)=> n>=1e7 ? '₹'+(+(n/1e7).toFixed(1))+' Cr' : '₹'+(+(n/1e5).toFixed(1))+' L';
const amtShort = (n)=> n>=1e5 ? '₹'+(+(n/1e5).toFixed(1))+'L' : '₹'+(+(n/1e3).toFixed(1))+'k';

/* ---------- shared bits ---------- */
const header = ()=>`
  <div class="topbar ex-top"><div class="l">${I.back()}<span class="b1">NPS</span></div>
    <div class="r"><button class="icon-btn" data-search aria-label="Search"><img src="${A}ex-search-24.svg" width="24" height="24" alt=""></button>${I.help}</div></div>
  <div class="tabs ex-tabs"><button class="tab" data-tab="portfolio">Portfolio</button><button class="tab on">Explore</button></div>`;
const scaleIcon = (level, reverse)=>{
  const f = level==='High' ? (reverse ? 'ex-scale-high-rev.svg' : 'ex-scale-high.svg') : level==='Average' ? 'ex-scale-avg-rev.svg' : 'ex-scale-low-rev.svg';
  return `<i class="ex-scale"><img src="${A}${f}" width="16" height="12" alt=""></i>`;
};
const lvlCls = (lvl, risk)=> lvl==='Average' ? 'ex-warn' : (lvl==='High') === !risk ? 'ex-good' : (risk ? 'ex-bad' : 'ex-good');
const logo = (id)=> FD[id].logo
  ? `<span class="ex-logo"><img src="${A}${FD[id].logo}" alt=""></span>`
  : `<span class="ex-logo ph">${FD[id].ini}</span>`;
function fundCard(id, {top=FD[id].top}={}){
  const f = FD[id];
  return `<button class="ex-card" data-fund="${id}">
    <div class="ex-card-h">${logo(id)}<div class="ex-card-id"><b>${fname(id)}</b><span>Started on ${f.start}</span></div></div>
    <div class="ex-row"><div><span>5Y returns</span><p>${fundRet(id).toFixed(2)}% p.a.</p></div>
      <div><span>On maturity</span><p class="ex-mat">${crore(maturity(id))}<i data-mat="${id}" role="button" aria-label="Maturity details"><img src="${A}ex-info-16.svg" width="16" height="16" alt=""></i></p></div></div>
    <div class="ex-row"><div><span>Returns vs category</span><p class="${lvlCls(f.rvc,false)}">${f.rvc}${scaleIcon(f.rvc,false)}</p></div>
      <div><span>Risk vs category</span><p class="${lvlCls(f.risk,true)}">${f.risk}${scaleIcon(f.risk,true)}</p></div></div>
    ${top?`<img class="ex-toptag" src="${A}ex-top-tag.svg" width="18" height="50" alt="Top rated">`:''}
  </button>`;
}
const SEG = [['eq','Equity','#AF91D1'],['corp','Corp bonds','#FD9172'],['gov','Govt bonds','#FDBD4D'],['alt','Alternate','#7DCECD']];
function donut(sp, size=41){
  const r = 16.6, c = 2*Math.PI*r, gap = 0.9; let off = 0;
  const arcs = SEG.filter(([k])=>sp[k]>0).map(([k,,col])=>{
    const len = c*sp[k]/100, s = `<circle r="${r}" cx="20.5" cy="20.5" fill="none" stroke="${col}" stroke-width="6" stroke-dasharray="${Math.max(0,len-gap)} ${c}" stroke-dashoffset="${-off}"/>`;
    off += len; return s;
  }).join('');
  return `<svg class="ex-donut" width="${size}" height="${size}" viewBox="0 0 41 41"><g transform="rotate(-90 20.5 20.5)"><circle r="${r}" cx="20.5" cy="20.5" fill="none" stroke="#F2F2F2" stroke-width="6"/>${arcs}</g></svg>`;
}
const legendIt = ([k,l,col], sp)=>`<div class="ex-lg"><span><i style="background:${col}"></i>${l}</span><b>${sp[k]}%</b></div>`;
function splitBody(sp){
  const L = [SEG[0], SEG[2]], R = [SEG[1]].concat(sp.alt>0 ? [SEG[3]] : []);
  return `${donut(sp)}<div class="ex-legend"><div>${L.map(s=>legendIt(s,sp)).join('')}</div><div>${R.map(s=>legendIt(s,sp)).join('')}</div></div>`;
}

/* ---------- failed state (788:213892 / 4006:31247) ---------- */
const failedBlock = (msg, btn, attr)=>`<div class="ex-failed"><img src="${A}${attr==='data-retry'?'ex-ufo.png':'ex-empty-filter.png'}" width="150" height="150" alt=""><p>${msg}</p><button class="chip" ${attr}>${btn}</button></div>`;

/* ====================================================================== EXPLORE */
const STORIES = [['what is <br>NPS',0],['Tax',1],['Withdrawal',2],['Return',3]];
const FAQS = [
  ['What is a ready-made portfolio?','A well-diversified portfolio helps to reduce risk and provide more stable returns over the long term by spreading investments across different assets. It also protects against unexpected market events.'],
  ['Who manages the portfolio?','Your money is managed by a PFRDA-registered pension fund manager that you pick. You can switch the fund manager once a year.'],
  ['Why should I invest in a portfolio?','A portfolio spreads your money across equity, corporate bonds and government bonds, so one bad market does not undo years of saving.'],
  ['How does a ready-made portfolio work?','You pick a plan — Aggressive, Moderate or Conservative. The equity share starts high and is reduced automatically as you get closer to 60.'],
  ['Who manages the portfolio?','Pension fund managers regulated by PFRDA manage NPS money. Upstox only helps you invest and track it.'],
  ['What are the fees charged?','NPS is among the cheapest retirement products: fund management charges are capped at 0.09% a year, plus a small transaction charge on each contribution.'],
  ['Can I start SIP in the portfolio?','Yes. After your first contribution you can set up a monthly or yearly SIP from the Portfolio tab.'],
];
const ALL_FAQS = [
  ['Who can join NPS?','Any Indian citizen between 18 and 70 years of age, resident or non-resident, can open an NPS account and contribute to it.'],
  ['What are the tax benefits under NPS?','You can claim up to ₹1.5 lakh under Section 80CCD(1) and an extra ₹50,000 under Section 80CCD(1B) every year.'],
  ['What are Tier 1 & Tier 2 accounts?','Tier 1 is the retirement account with tax benefits and a lock-in till 60. Tier 2 is an optional savings account you can withdraw from any time.'],
  ['Can I have multiple NPS accounts?','No. Each person can have only one NPS account (PRAN), which stays with you across jobs and cities.'],
  ['What is the lock in period for NPS?','Your money stays invested till you turn 60. Partial withdrawals are allowed after 3 years for specific needs like education or medical treatment.'],
  ['How is the annuity income taxed?','The monthly pension you get from the annuity is added to your income and taxed as per your slab.'],
];
let truthsOpen = null;          // null = follow S.d.storiesSeen
let restoreScroll = 0;

function taxState(){
  let inv = (S.scn.holdings ? 25000 : 0);
  const o = S.d.order; if(o && o.status!=='failed') inv += (+o.amount||0);
  inv = Math.min(inv, 50000);
  return { inv, pct: Math.round(inv/50000*100), saved: inv*0.3, done: inv>=50000 };
}
function taxWidget(){
  const t = taxState();
  const kStr = t.saved ? '₹'+(+(t.saved/1000).toFixed(1))+'k' : '₹0k';
  return `<div class="ex-taxwrap"><div class="ex-tax ${t.done?'done':''}">
    <div class="ex-tax-in">
      <p class="ex-tax-t">${t.done ? 'Saved ₹15,650 in taxes*' : 'Save taxes up to ₹15,650*'}</p>
      <div class="ex-bar"><i style="width:${Math.max(t.pct,3)}%"></i></div>
      ${t.done ? '' : `<p class="ex-tax-s">You’re saving <b>${kStr} (${t.pct}%)</b></p>`}
    </div>
    <img class="ex-coin1" src="${A}ex-tax-coin-1.svg" alt=""><img class="ex-coin2" src="${A}ex-tax-coin-2.svg" alt="">
  </div><p class="ex-tax-n">*Calculation as per 30% income tax bracket</p></div>`;
}
const chipsHtml = ()=>{
  const p = S.d.plan;
  return ['aggressive','moderate','conservative'].map(k=>`<button class="chip ${p===k?'sel':''}" data-plan="${k}">${PLANS[k].name}</button>`).join('')
    + `<button class="chip ex-cchip ${p==='custom'?'sel':''}" data-plan="custom">Custom</button>`;
};
const splitCard = ()=>`<div class="ex-split ${S.d.plan==='custom'?'cust':''}">
  <div class="ex-split-h"><span>Asset split</span><button data-alloc>View allocation</button></div>
  <div class="ex-split-b">${splitBody(split())}${S.d.plan==='custom'?`<button class="ex-split-go" data-editcustom aria-label="Edit custom plan"><img src="${A}ic-chevron-down-16.svg" style="transform:rotate(-90deg)" width="16" height="16" alt=""></button>`:''}</div></div>`;

function exploreContent(){
  const open = truthsOpen==null ? !S.d.storiesSeen : truthsOpen;
  return `<div class="scroll ex-scroll">
    <section class="ex-truths ${open?'':'shut'}">
      <button class="ex-truths-h" data-truths><span>Truths of investing in NPS</span><img src="${A}ex-chevron-up-24.svg" width="24" height="24" alt=""></button>
      <div class="ex-stories"><div class="ex-stories-in">${STORIES.map(([l,i])=>`<button class="ex-story" data-story="${i}"><span class="ex-ring">${STORY_ICONS[i]}</span><span class="ex-story-l">${l}</span></button>`).join('')}</div></div>
    </section>
    ${taxWidget()}
    <section class="ex-top3">
      <h2 class="h2">Top NPS Funds</h2>
      <button class="ex-amt" data-calc><b>${inr(S.d.amount)} for ${years()} yrs</b><span>Investment amount</span><img src="${A}ex-edit-16.svg" width="16" height="16" alt=""></button>
      <div class="ex-chips">${chipsHtml()}</div>
    </section>
    <div class="ex-split-wrap">${splitCard()}</div>
    <div class="ex-list">${TOP3.map(id=>fundCard(id,{top:true})).join('')}</div>
    <div class="ex-btnrow"><button class="btn outline" data-allfunds>View all funds</button></div>
    <section class="ex-vs"><div class="ex-fold">
      <div class="ex-fold-t"><h2 class="h2">NPS vs others</h2><p>*Estimated amount if you invest ${amtShort(S.d.amount)} per year till 60</p></div>
      <div class="ex-bars">
        ${[['NPS',249,'₹ 2.3 Cr','+12.3%'],['PPF',213,'₹ 1.3 Cr','+7.8%'],['Nifty-50',244,'₹ 2.1 Cr','+11.2%']].map(([l,w,v,r])=>`
        <div class="ex-barrow"><div class="ex-hbar" style="width:${w}px"><i></i><em></em><span>${l}</span></div><div class="ex-barv"><b>${v}</b><b class="cg">${r}</b></div></div>`).join('')}
      </div>
      <div class="ex-key"><span><i style="background:#E79D0D"></i>Invested</span><span><i style="background:#148564"></i>Profits + Taxes saved</span></div>
    </div></section>
    <section class="ex-vids">
      <div class="ex-vids-t"><p>Save smart with NPS</p><span>Learn about NPS &amp; plan your retirement strategy</span></div>
      <div class="ex-vrow">${VIDEOS.map((v,i)=>`<button class="ex-vid" data-video="${i}"><img src="${A}${v.thumb}" alt="${v.title}"><span class="ex-dur"><img src="${A}ex-play-16.svg" width="16" height="16" alt="">${v.dur}</span></button>`).join('')}</div>
    </section>
    <section class="ex-faqs"><div class="ex-faqs-t">FAQs</div>
      <div class="ex-faq">${FAQS.map(([q,a],i)=>`<div class="ex-faq-i ${i?'':'on'}"><button class="ex-faq-q"><span>${q}</span><img src="${A}ex-chevron-down-16.svg" width="16" height="16" alt=""></button><div class="ex-faq-a"><p>${a}</p></div></div>`).join('')}</div>
      <div class="ex-btnrow ex-faqbtn"><button class="btn outline" data-allfaqs>View all FAQs</button></div>
    </section>
  </div>`;
}
const exploreSkeleton = ()=>`<div class="scroll ex-scroll ex-skel">
  <div class="ex-sk-pad"><span class="skel" style="width:220px;height:24px"></span>
    <div class="ex-sk-circles">${'<span class="skel"></span>'.repeat(4)}</div></div>
  <div class="ex-sk-pad"><span class="skel" style="width:100%;height:72px;border-radius:8px"></span></div>
  <div class="ex-sk-pad"><span class="skel" style="width:160px;height:24px"></span><span class="skel" style="width:100%;height:52px;margin-top:16px;border-radius:8px"></span>
    <div style="display:flex;gap:8px;margin-top:16px">${'<span class="skel" style="width:86px;height:32px;border-radius:16px"></span>'.repeat(3)}</div></div>
  ${[0,1,2].map(()=>`<div class="ex-sk-card"><div style="display:flex;gap:16px;align-items:center"><span class="skel" style="width:40px;height:40px;border-radius:50%"></span><div style="flex:1"><span class="skel" style="width:70%;height:14px"></span><span class="skel" style="width:40%;height:10px;margin-top:8px"></span></div></div>
    <div class="ex-sk-row"><span class="skel"></span><span class="skel"></span></div><div class="ex-sk-row"><span class="skel"></span><span class="skel"></span></div></div>`).join('')}
</div>`;

SCREENS.explore = (el, p={})=>{
  function render(state){
    el.innerHTML = header() + (state==='loading' ? exploreSkeleton() : state==='fail'
      ? `<div class="scroll ex-scroll">${failedBlock("We couldn't catch the latest updates. <br>Give it another shot!", 'Retry', 'data-retry')}</div>`
      : exploreContent());
    if(state==='ok'){
      if(S.d.plan==='custom') S.d.customDone = true;
      const sc = $('.ex-scroll', el); if(restoreScroll){ sc.scrollTop = restoreScroll; restoreScroll = 0; }
    }
  }
  function load(){
    const L = S.scn.load;
    if(L==='fail') render('fail');
    else if(L==='loading'){ render('loading'); later(()=>render('ok'), 1200); }
    else render('ok');
  }
  const refreshFunds = ()=>{
    const c = $('.ex-chips', el); if(!c) return;
    const x = c.scrollLeft; c.innerHTML = chipsHtml(); c.scrollLeft = x;
    $('.ex-split-wrap', el).innerHTML = splitCard();
    $('.ex-list', el).innerHTML = TOP3.map(id=>fundCard(id,{top:true})).join('');
    $('.ex-amt b', el).textContent = `${inr(S.d.amount)} for ${years()} yrs`;
    $('.ex-fold-t p', el).textContent = `*Estimated amount if you invest ${amtShort(S.d.amount)} per year till 60`;
  };
  const leave = (fn)=>{ const sc = $('.ex-scroll', el); restoreScroll = sc ? sc.scrollTop : 0; fn(); };
  load();
  wireCommon(el);
  el.addEventListener('click', e=>{
    const t = e.target;
    if(t.closest('[data-tab]')) return go('portfolio', 'replace');
    if(t.closest('[data-search]')) return toast('Search NPS funds');
    if(t.closest('[data-retry]')){ render('loading'); later(()=>render('ok'), 1200); return; }
    if(t.closest('[data-truths]')){
      const s = $('.ex-truths', el); s.classList.toggle('shut'); truthsOpen = !s.classList.contains('shut'); return;
    }
    const st = t.closest('[data-story]'); if(st) return leave(()=>go('stories', 'push', {start:+st.dataset.story}));
    if(t.closest('[data-calc]')) return openCalc(refreshFunds);
    const pl = t.closest('[data-plan]');
    if(pl){
      const k = pl.dataset.plan;
      if(k==='custom' && !S.d.customDone) return leave(()=>go('customPlan'));
      if(S.d.plan!==k){ S.d.plan = k; refreshFunds(); }
      return;
    }
    if(t.closest('[data-editcustom]')) return leave(()=>go('customPlan'));
    if(t.closest('[data-alloc]')) return allocationSheet();
    const mi = t.closest('[data-mat]'); if(mi){ e.stopPropagation(); return maturitySheet(mi.dataset.mat); }
    const fc = t.closest('[data-fund]'); if(fc){ const id = fc.dataset.fund; S.d.fund = id; return leave(()=>go('fund', 'push', {fund:id})); }
    if(t.closest('[data-allfunds]')) return leave(()=>go('allFunds'));
    const v = t.closest('[data-video]'); if(v){ videoIdx = +v.dataset.video; return leave(()=>go('exVideo')); }
    const fq = t.closest('.ex-faq-q'); if(fq) return fq.parentElement.classList.toggle('on');
    if(t.closest('[data-allfaqs]')) return faqSheet();
  });
  el.__refresh = load;
};

function openCalc(done){
  if(P.openCalculator) P.openCalculator({ onDone:done });
  else toast('Calculator not built yet');
}
function faqSheet(){
  sheet({cls:'ex-faqsheet', html:`<div class="sh-title">FAQs</div><div class="sh-scroll"><div class="ex-faq">${ALL_FAQS.map(([q,a],i)=>`<div class="ex-faq-i ${i?'':'on'}"><button class="ex-faq-q"><span>${q}</span><img src="${A}ex-chevron-down-16.svg" width="16" height="16" alt=""></button><div class="ex-faq-a"><p>${a}</p></div></div>`).join('')}</div></div>`})
    .el.addEventListener('click', e=>{ const q = e.target.closest('.ex-faq-q'); q && q.parentElement.classList.toggle('on'); });
}

/* ---------- maturity info sheet (2640:200208, loading 803:228405) ---------- */
function maturitySheet(id){
  const tot = maturity(id), lump = tot*0.6, pension = tot*0.4*0.06/12;
  const s = sheet({cls:'ex-matsheet', html:`<div class="ex-mat-b"><div class="ex-mat-sk">
      <span class="skel" style="width:110px;height:16px"></span><span class="skel" style="width:150px;height:32px;margin-top:8px"></span>
      <div class="ex-mat-cols">${'<div><span class="skel" style="width:70px;height:14px"></span><span class="skel" style="width:80px;height:14px;margin-top:6px"></span></div>'.repeat(3)}</div></div></div>`});
  later(()=>{
    const b = $('.ex-mat-b', s.el); if(!b) return;
    b.innerHTML = `<div class="ex-mat-in"><p class="ex-mat-l">Total on maturity</p><p class="ex-mat-v">${croreTight(tot)}</p>
      <div class="ex-mat-cols"><div><span>Plan type</span><b>${PLANS[S.d.plan].name}</b></div><div><span>Lumpsum</span><b>${croreTight(lump)}</b></div><div><span>Pension/month</span><b>${inr(Math.round(pension/1000)*1000)}</b></div></div></div>`;
  }, 650);
}

/* ---------- view allocation sheet (5498:30275) + age slider (13231:215859) ---------- */
const START_EQ = { aggressive:75, moderate:50, conservative:25 };
function glide(planKey, age){
  const base = PLANS[planKey], eq0 = START_EQ[planKey];
  const drop = { aggressive:3, moderate:2, conservative:1 }[planKey];
  const eq = Math.max(5, age<=35 ? eq0 : Math.round(eq0 - (age-35)*drop));
  const rest = 100 - eq, cg = base.corp + base.gov;
  const corp = Math.round(rest*base.corp/cg);
  return { eq, corp, gov: rest-corp, alt:0 };
}
function allocationSheet(){
  const k = S.d.plan;
  if(k==='custom'){
    sheet({cls:'ex-alloc', html:`<div class="ex-al-t"><h2 class="h2">Custom plan</h2><p>Your allocation stays as you set it. You can change it any time.</p></div>
      <div class="ex-al-card"><div class="ex-split-b">${splitBody(S.d.custom)}</div></div>
      <div class="ex-al-foot"><button class="btn purple" data-close data-editc>Edit custom plan</button></div>`})
      .el.addEventListener('click', e=>{ if(e.target.closest('[data-editc]')){ const sc = $('.ex-scroll'); restoreScroll = sc ? sc.scrollTop : 0; go('customPlan'); } });
    return;
  }
  const age0 = S.d.age, steps = []; for(let a = age0; a <= 60; a += 10) steps.push(a);
  const PX = 8.2;                                    // px per year on the ruler (29→39 = 82px in Figma)
  const ticks = []; for(let a = age0; a <= 60; a += 2) ticks.push(a);
  const s = sheet({cls:'ex-alloc', html:`<div class="ex-al-t"><h2 class="h2">${PLANS[k].name} plan</h2>
      <p>Equity allocation starts at ${START_EQ[k]}% until you're 35 yrs old, gradually decreasing over time</p></div>
    <div class="ex-al-card"><div class="ex-split-b" data-sb>${splitBody(glide(k, age0))}</div></div>
    <div class="ex-scrub"><p>Slide to view how allocation adjusts with age</p><div class="ex-age"><b data-age>${age0}</b></div></div>
    <div class="ex-ruler" data-ruler>
      <img class="ex-glow" src="${A}ex-slider-glow.svg" alt="">
      <div class="ex-strip" data-strip>${ticks.map(a=>`<i style="left:${(a-age0)*PX}px"></i>`).join('')}${steps.map(a=>`<em style="left:${(a-age0)*PX}px">${a}</em>`).join('')}</div>
      <span class="ex-mark"></span>
    </div>`});
  const ruler = $('[data-ruler]', s.el), strip = $('[data-strip]', s.el);
  const maxOff = (steps[steps.length-1]-age0)*PX;
  let off = 0, startX = 0, startOff = 0, drag = false;
  const ageAt = (o)=> age0 + o/PX;
  const show = (o, snap)=>{
    off = Math.max(0, Math.min(maxOff, o));
    let a = ageAt(off); if(snap){ const st = steps.reduce((b,x)=>Math.abs(x-a)<Math.abs(b-a)?x:b, steps[0]); a = st; off = (st-age0)*PX; }
    strip.style.transition = snap ? 'transform .3s var(--std)' : 'none';
    strip.style.transform = `translateX(${-off}px)`;
    const ar = Math.round(a);
    $('[data-age]', s.el).textContent = ar;
    $('[data-sb]', s.el).innerHTML = splitBody(glide(k, ar));
  };
  ruler.addEventListener('pointerdown', e=>{ drag = true; startX = e.clientX; startOff = off; ruler.setPointerCapture(e.pointerId); });
  ruler.addEventListener('pointermove', e=>{ if(drag) show(startOff - (e.clientX-startX)); });
  const end = (e)=>{
    if(!drag) return; drag = false;
    if(Math.abs(e.clientX-startX) < 4){         // tap: jump to the tapped age
      const r = ruler.getBoundingClientRect(); show(off + (e.clientX - (r.left + r.width/2)), true);
    } else show(off, true);
  };
  ruler.addEventListener('pointerup', end); ruler.addEventListener('pointercancel', end);
}

/* ====================================================================== ALL FUNDS */
const AUM_OPTS = [['lt500','Less than 500 Cr',a=>a<500],['500-5k','500 Cr - 5,000 Cr',a=>a>=500&&a<5000],['5k-10k','5,000 Cr - 10,000 Cr',a=>a>=5000&&a<=10000],['gt10k','More than 10,000 Cr',a=>a>10000]];
const AGE_OPTS = [['lt1','Less than 1 yr',y=>y<1],['1-5','1 yr - 5 yrs',y=>y>=1&&y<5],['5-10','5 yrs - 10 yrs',y=>y>=5&&y<=10]];
const FILT = { aum:new Set(), age:new Set() };
let SORT = null;                                        // {key:'aum'|'cagr'|'age', dir:'asc'|'desc'}
const SORT_KEYS = [['aum','AUM'],['cagr','5Y CAGR'],['age','Fund age']];
const ORDER = ['icici','axis','kotak','hdfc','sbi','uti','lic','absl'];
const fCount = ()=> FILT.aum.size + FILT.age.size;

function fundsList(){
  let ids = ORDER.filter(id=>{
    const f = FD[id], age = NOW_YR - f.yr;
    const okA = !FILT.aum.size || AUM_OPTS.some(([k,,t])=>FILT.aum.has(k) && t(f.aum));
    const okG = !FILT.age.size || AGE_OPTS.some(([k,,t])=>FILT.age.has(k) && t(age));
    return okA && okG;
  });
  if(SORT){
    const v = (id)=> SORT.key==='aum' ? FD[id].aum : SORT.key==='cagr' ? fundRet(id) : NOW_YR - FD[id].yr;
    ids = ids.slice().sort((a,b)=> SORT.dir==='asc' ? v(a)-v(b) : v(b)-v(a));
  }
  return ids;
}
const filterBar = ()=>{
  const sk = SORT ? SORT_KEYS.find(x=>x[0]===SORT.key)[1] : '5Y CAGR';
  const arrow = SORT && SORT.dir==='desc' ? 'ex-arrow-down-16.svg' : 'ex-arrow-up-16.svg';
  return `<div class="ex-fbar">
    <button class="ex-fchip ${fCount()?'on':''}" data-filter><img src="${A}ex-filter.svg" width="16" height="16" alt="Filter">${fCount()?`<span class="ex-bub">${fCount()}</span>`:''}</button>
    <button class="ex-fchip" data-sort><img src="${A}${arrow}" width="16" height="16" alt="">${sk}</button>
    <button class="ex-fchip" data-plansheet>Plan: ${PLANS[S.d.plan].name}<img src="${A}ex-chevron-down-16.svg" width="16" height="16" alt=""></button>
    <button class="ex-fchip" data-calc>Investment: ${amtShort(S.d.amount)}<img src="${A}ex-chevron-down-16.svg" width="16" height="16" alt=""></button>
  </div>`;
};
const allFundsSkeleton = ()=>`<div class="ex-afl">${[0,1,2,3,4].map(()=>`<div class="ex-sk-card"><div style="display:flex;gap:16px;align-items:center"><span class="skel" style="width:40px;height:40px;border-radius:50%"></span><div style="flex:1"><span class="skel" style="width:70%;height:14px"></span><span class="skel" style="width:40%;height:10px;margin-top:8px"></span></div></div>
  <div class="ex-sk-row"><span class="skel"></span><span class="skel"></span></div><div class="ex-sk-row"><span class="skel"></span><span class="skel"></span></div></div>`).join('')}</div>`;

SCREENS.allFunds = (el)=>{
  el.innerHTML = `<div class="topbar ex-top"><div class="l">${I.back()}<span class="b1">Pick a fund manager</span></div>
      <div class="r"><button class="icon-btn" data-help aria-label="Help"><img src="${A}ex-support-fill.svg" width="24" height="24" alt=""></button></div></div>
    <div class="scroll ex-af"><div data-fb>${filterBar()}</div><div data-list></div></div>`;
  const listEl = $('[data-list]', el);
  function renderList(){
    $('[data-fb]', el).innerHTML = filterBar();
    const ids = fundsList();
    listEl.innerHTML = ids.length
      ? `<div class="ex-afl stg">${ids.map(id=>fundCard(id)).join('')}</div>`
      : failedBlock('0 funds matching your filter Criteria', 'Reset filters', 'data-reset');
  }
  function load(){
    $('[data-fb]', el).innerHTML = filterBar();
    if(S.scn.load==='fail'){ listEl.innerHTML = failedBlock("We couldn't catch the latest updates. <br>Give it another shot!", 'Retry', 'data-retry'); return; }
    if(S.scn.load==='loading'){ listEl.innerHTML = allFundsSkeleton(); later(renderList, 1200); return; }
    renderList();
  }
  load();
  wireCommon(el);
  el.addEventListener('click', e=>{
    const t = e.target;
    if(t.closest('[data-retry]')){ listEl.innerHTML = allFundsSkeleton(); later(renderList, 1200); return; }
    if(t.closest('[data-reset]')){ FILT.aum.clear(); FILT.age.clear(); return renderList(); }
    if(t.closest('[data-sort]')) return sortSheet(renderList);
    if(t.closest('[data-filter]')) return filterSheet(renderList);
    if(t.closest('[data-plansheet]')) return planSheet(renderList);
    if(t.closest('[data-calc]')) return openCalc(renderList);
    const mi = t.closest('[data-mat]'); if(mi){ e.stopPropagation(); return maturitySheet(mi.dataset.mat); }
    const fc = t.closest('[data-fund]'); if(fc){ const id = fc.dataset.fund; S.d.fund = id; go('fund', 'push', {fund:id}); }
  });
  el.__refresh = load;
};

/* ---------- sort sheet (2640:200009) ---------- */
function sortSheet(done){
  const btn = (k, dir)=>{
    const on = SORT && SORT.key===k && SORT.dir===dir;
    const img = on ? `<img src="${A}ex-arrow-up-16-white.svg" width="16" height="16" alt="" ${dir==='desc'?'style="transform:rotate(180deg)"':''}>` : `<img src="${A}ex-arrow-${dir==='asc'?'up':'down'}-16.svg" width="16" height="16" alt="">`;
    return `<button class="ex-sbtn ${on?'on':''}" data-k="${k}" data-dir="${dir}" aria-label="${dir==='asc'?'Ascending':'Descending'}">${img}</button>`;
  };
  const s = sheet({cls:'ex-sortsheet', html:`<div class="ex-sort-h"><b>Sort by</b><span>Asc.</span><span>Desc.</span></div>
    <div class="ex-sort-l">${SORT_KEYS.map(([k,l])=>`<div class="ex-sort-r"><span>${l}</span><div>${btn(k,'asc')}${btn(k,'desc')}</div></div>`).join('')}</div>`});
  s.el.addEventListener('click', e=>{
    const b = e.target.closest('[data-k]'); if(!b) return;
    SORT = { key:b.dataset.k, dir:b.dataset.dir };
    $$('.ex-sbtn', s.el).forEach(x=>{ const on = x===b; x.classList.toggle('on', on);
      const d = x.dataset.dir; x.innerHTML = on ? `<img src="${A}ex-arrow-up-16-white.svg" width="16" height="16" alt="" ${d==='desc'?'style="transform:rotate(180deg)"':''}>` : `<img src="${A}ex-arrow-${d==='asc'?'up':'down'}-16.svg" width="16" height="16" alt="">`; });
    setTimeout(()=>{ s.close(); done(); }, 220);
  });
}

/* ---------- filters (2640:199952 AUM / 2640:199982 Fund age) ---------- */
function filterSheet(done){
  const pend = { aum:new Set(FILT.aum), age:new Set(FILT.age) };
  let tab = 'aum';
  const s = sheet({cls:'ex-fsheet', handle:false, html:`
    <div class="ex-fs-top"><button class="icon-btn" data-close aria-label="Close"><img src="${A}ex-close-24.svg" width="24" height="24" alt=""></button><span>Filter funds</span><button class="ex-clear" data-clear>Clear all</button></div>
    <div class="ex-fs-body"><div class="ex-fs-tabs" data-tabs></div><div class="ex-fs-opts" data-opts></div></div>
    <div class="ex-fs-foot"><button class="btn outline" data-close>Cancel</button><button class="btn purple" data-apply>View results</button></div>`});
  const paint = ()=>{
    $('[data-tabs]', s.el).innerHTML = [['aum','AUM'],['age','Fund age']].map(([k,l])=>`<button class="ex-fs-tab ${tab===k?'on':''}" data-t="${k}"><span>${l}</span>${pend[k].size?`<em>${pend[k].size}</em>`:''}</button>`).join('');
    $('[data-opts]', s.el).innerHTML = (tab==='aum'?AUM_OPTS:AGE_OPTS).map(([k,l])=>`<button class="ex-fs-opt" data-o="${k}"><span>${l}</span><img src="${A}${pend[tab].has(k)?'ex-checkbox-on.svg':'ex-checkbox-off.svg'}" width="24" height="24" alt=""></button>`).join('');
  };
  paint();
  s.el.addEventListener('click', e=>{
    const t = e.target.closest('[data-t]'); if(t){ tab = t.dataset.t; return paint(); }
    const o = e.target.closest('[data-o]'); if(o){ const set = pend[tab], k = o.dataset.o; set.has(k) ? set.delete(k) : set.add(k); return paint(); }
    if(e.target.closest('[data-clear]')){ pend.aum.clear(); pend.age.clear(); return paint(); }
    if(e.target.closest('[data-apply]')){ FILT.aum = pend.aum; FILT.age = pend.age; s.close(); done(); }
  });
}

/* ---------- plan picker for the "Plan:" chip ---------- */
function planSheet(done){
  if(P.openPlans) return P.openPlans({ onDone:done });
  const s = sheet({html:`<div class="sh-title">Investment plan</div><div class="ex-plans">${['aggressive','moderate','conservative'].map(k=>`<button class="ex-plan-r" data-p="${k}"><div><b>${PLANS[k].name}</b><span>${PLANS[k].risk} · ${PLANS[k].ret}</span></div><i class="radio ${S.d.plan===k?'on':''}"></i></button>`).join('')}</div>`});
  s.el.addEventListener('click', e=>{ const b = e.target.closest('[data-p]'); if(!b) return; S.d.plan = b.dataset.p; s.close(); done(); });
}

/* ====================================================================== VIDEO (3:171311)
   A mock player: no playback, just the frame. Tapping pause toggles the icon. */
const VIDEOS = [
  { thumb:'ex-vthumb-1.jpg', dur:'0:58', title:'NPS in 60 seconds', yt:'NPS in 60 seconds: how it works for you', at:22 },
  { thumb:'ex-vthumb-2.jpg', dur:'2:14', title:'Save ₹50,000 more in tax', yt:'How NPS saves you ₹50,000 more in tax', at:38 },
];
let videoIdx = 0;
const VI = {
  kebab:'<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>', pause:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>', play:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>', vol:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>', gear:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.6h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L4.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>', full:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z"/></svg>'
};
SCREENS.exVideo = (el)=>{
  const v = VIDEOS[videoIdx] || VIDEOS[0];
  el.classList.add('ex-video');
  el.innerHTML = `<div class="topbar ex-top"><div class="l">${I.back()}<span class="b1">${v.title}</span></div><div class="r"><button class="icon-btn" data-help aria-label="Help"><img src="${A}ex-support-fill.svg" width="24" height="24" alt=""></button></div></div>
    <div class="ex-player">
      <div class="ex-yt-top"><span class="ex-yt-av">up</span><span class="ex-yt-t">${v.yt}</span>${VI.kebab}</div>
      <div class="ex-pv"><img src="${A}ex-video-portrait.jpg" alt=""></div>
      <div class="ex-yt-ctrl"><div class="ex-yt-prog"><i style="width:${v.at}%"></i><b style="left:${v.at}%"></b></div>
        <div class="ex-yt-row"><button data-pp aria-label="Pause">${VI.pause}</button>${VI.vol}<span class="ex-yt-sp"></span>${VI.gear}${VI.full}</div></div>
    </div>`;
  wireCommon(el);
  el.addEventListener('click', e=>{
    const b = e.target.closest('[data-pp]'); if(!b) return;
    const paused = b.getAttribute('aria-label')==='Play';
    b.innerHTML = paused ? VI.pause : VI.play; b.setAttribute('aria-label', paused ? 'Pause' : 'Play');
  });
};

/* ---------- jumps ---------- */
const fresh = ()=>{ restoreScroll = 0; truthsOpen = null; };
jump('explore', 'Explore', 'explore', ()=>{ fresh(); S.d.storiesSeen = false; resetTo(['home'], 'explore'); });
jump('exploreSeen', 'Explore · stories seen', 'explore', ()=>{ fresh(); S.d.storiesSeen = true; resetTo(['home'], 'explore'); });
jump('exploreCustom', 'Explore · custom plan', 'explore', ()=>{ fresh(); S.d.plan = 'custom'; S.d.customDone = true; resetTo(['home'], 'explore'); });
jump('allFunds', 'All funds', 'explore', ()=>{ resetTo(['home','explore'], 'allFunds'); });

/* Story icons — converted 1:1 from Figma 11410:24589 / 24599 / 24701 / 24920 (layered vectors). */
const STORY_ICONS = [
"                <div style=\"background:#fdd48e;flex:1 0 0;min-height:1px;position:relative;border-radius:87.5px;width:100%\"><div style=\"position:absolute;bottom:8.88%;left:50%;overflow:hidden;top:8.88%;width:40.294px;transform:translateX(-50%)\"><div style=\"position:absolute;display:contents;inset:14.56% -16.04%\"><div style=\"position:absolute;inset:15.09% 46.22% 15.09% -16.04%;overflow:hidden\"><div style=\"position:absolute;display:flex;flex-direction:column;font-family:Inter;font-weight:900;inset:18.89%;justify-content:center;line-height:0;font-size:17.51px;text-align:center;text-shadow:0px 1.25px 0px black,0px 0.313px 0px rgba(0,0,0,0.25);color:#fff\"><p style=\"line-height:17.505px\">N</p></div></div><div style=\"position:absolute;inset:14.56% -16.04% 14.56% 45.16%;overflow:hidden\"><div style=\"position:absolute;display:flex;flex-direction:column;font-family:Inter;font-weight:900;inset:18.89%;justify-content:center;line-height:0;font-size:17.77px;text-align:center;text-shadow:0px 1.269px 0px black,0px 0.317px 0px rgba(0,0,0,0.25);color:#fff\"><p style=\"line-height:17.771px\">S</p></div></div><div style=\"position:absolute;inset:14.56% 13.42% 14.56% 15.7%;overflow:hidden\"><div style=\"position:absolute;display:flex;flex-direction:column;font-family:Inter;font-weight:900;inset:18.89%;justify-content:center;line-height:0;font-size:17.77px;text-align:center;text-shadow:0px 1.269px 0px black,0px 0.317px 0px rgba(0,0,0,0.25);color:#fff\"><p style=\"line-height:17.771px\">P</p></div></div></div></div></div>",
"                <div style=\"background:#7dcecd;flex:1 0 0;min-height:1px;position:relative;border-radius:87.5px;width:100%\"><div style=\"position:absolute;display:contents;inset:12.77% 6.63%\"><div style=\"position:absolute;inset:38.1% 59.53% 25.88% 6.63%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group.svg\"></div><div style=\"position:absolute;inset:12.77% 10.51% 12.77% 20.75%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-1.svg\"></div><div style=\"position:absolute;inset:56.6% 32.82% 16.6% 38.48%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector.svg\"></div><div style=\"position:absolute;display:contents;inset:46.11% 6.63% 18.14% 42.31%\"><div style=\"position:absolute;inset:49.19% 6.95% 18.44% 42.6%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-1.svg\"></div><div style=\"position:absolute;inset:67.84% 38.92% 18.45% 42.6%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-2.svg\"></div><div style=\"position:absolute;inset:48.91% 6.63% 18.14% 42.33%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-3.svg\"></div><div style=\"position:absolute;inset:46.41% 7.01% 21.23% 42.58%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-4.svg\"></div><div style=\"position:absolute;inset:53.43% 14.8% 34.9% 65.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-5.svg\"></div><div style=\"position:absolute;display:contents;inset:55.89% 31.64% 37.64% 60.89%\"><div style=\"position:absolute;inset:56.8% 31.64% 37.64% 60.89%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-2.svg\"></div><div style=\"position:absolute;inset:55.89% 31.64% 39.3% 60.91%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-3.svg\"></div></div><div style=\"position:absolute;display:contents;inset:58.89% 26.36% 34.59% 66.17%\"><div style=\"position:absolute;inset:59.88% 26.36% 34.59% 66.17%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-4.svg\"></div><div style=\"position:absolute;inset:58.89% 26.37% 36.3% 66.19%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-5.svg\"></div></div><div style=\"position:absolute;display:contents;inset:61.97% 21.11% 31.53% 71.42%\"><div style=\"position:absolute;inset:62.91% 21.11% 31.53% 71.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-6.svg\"></div><div style=\"position:absolute;inset:61.97% 21.11% 33.22% 71.44%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-7.svg\"></div></div><div style=\"position:absolute;display:contents;inset:59.59% 38% 33.91% 54.48%\"><div style=\"position:absolute;inset:60.53% 38.03% 33.91% 54.48%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-8.svg\"></div><div style=\"position:absolute;inset:59.59% 38% 35.6% 54.55%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-9.svg\"></div></div><div style=\"position:absolute;display:contents;inset:62.6% 32.7% 30.91% 59.81%\"><div style=\"position:absolute;inset:63.54% 32.7% 30.91% 59.81%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-10.svg\"></div><div style=\"position:absolute;inset:62.6% 32.73% 32.59% 59.83%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-11.svg\"></div></div><div style=\"position:absolute;display:contents;inset:65.68% 27.45% 27.8% 65.06%\"><div style=\"position:absolute;inset:66.64% 27.45% 27.8% 65.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-12.svg\"></div><div style=\"position:absolute;inset:65.68% 27.47% 29.51% 65.08%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-13.svg\"></div></div><div style=\"position:absolute;display:contents;inset:63.32% 44.48% 30.16% 48%\"><div style=\"position:absolute;inset:64.28% 44.53% 30.16% 48%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-14.svg\"></div><div style=\"position:absolute;inset:63.32% 44.48% 31.87% 48.07%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-15.svg\"></div></div><div style=\"position:absolute;display:contents;inset:66.35% 39.18% 27.16% 53.32%\"><div style=\"position:absolute;inset:67.29% 39.18% 27.16% 53.32%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-16.svg\"></div><div style=\"position:absolute;inset:66.35% 39.21% 28.84% 53.35%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-17.svg\"></div></div><div style=\"position:absolute;display:contents;inset:69.41% 33.95% 24.1% 58.58%\"><div style=\"position:absolute;inset:70.34% 33.95% 24.1% 58.58%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-18.svg\"></div><div style=\"position:absolute;inset:69.41% 33.95% 25.78% 58.6%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-19.svg\"></div></div><div style=\"position:absolute;inset:48.09% 9.96% 37.47% 68.31%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-6.svg\"></div><div style=\"position:absolute;inset:51.46% 17.45% 44.59% 69.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-7.svg\"></div><div style=\"position:absolute;inset:53.17% 15.98% 43.73% 72.45%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-8.svg\"></div><div style=\"position:absolute;inset:56.73% 9.76% 40.17% 78.65%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-9.svg\"></div><div style=\"position:absolute;inset:47.81% 9.67% 37.16% 68.02%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-10.svg\"></div><div style=\"position:absolute;inset:46.11% 6.7% 20.95% 42.31%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-11.svg\"></div></div><div style=\"position:absolute;inset:20.49% 48.43% 51.69% 20.78%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-20.svg\"></div><div style=\"position:absolute;inset:40% 52.74% 56.93% 42.4%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-12.svg\"></div><div style=\"position:absolute;inset:45.27% 62.01% 47.75% 26.23%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-13.svg\"></div><div style=\"position:absolute;inset:45.87% 51.72% 51.33% 43.82%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-14.svg\"></div><div style=\"position:absolute;inset:51.19% 61.02% 41.73% 27.03%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-15.svg\"></div><div style=\"position:absolute;inset:50.49% 49.46% 46.76% 46.18%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-16.svg\"></div><div style=\"position:absolute;inset:55.59% 58.25% 37.47% 29.99%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-17.svg\"></div><div style=\"position:absolute;inset:53.88% 44.67% 43.46% 51.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-18.svg\"></div><div style=\"position:absolute;inset:58.88% 53.07% 33.72% 34.4%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-vector-19.svg\"></div><div style=\"position:absolute;inset:28.56% 57.9% 60.54% 30.39%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-21.svg\"></div></div></div>",
"                <div style=\"background:#d0bee6;flex:1 0 0;min-height:1px;position:relative;border-radius:87.5px;width:100%\"><div style=\"position:absolute;display:contents;inset:12.91% 14.14% 13.62% 12.39%\"><div style=\"position:absolute;display:contents;inset:12.91% 14.14% 13.62% 12.39%\"><div style=\"position:absolute;display:contents;inset:12.91% 20.29% 24.06% 12.39%\"><div style=\"position:absolute;display:contents;inset:32.7% 22.92% 24.06% 12.39%\"><div style=\"position:absolute;inset:32.7% 22.96% 30.11% 12.39%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-22.svg\"></div><div style=\"position:absolute;inset:37.61% 31.66% 34.97% 21.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-23.svg\"></div><div style=\"position:absolute;inset:56.9% 22.92% 24.06% 54.95%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-24.svg\"></div><div style=\"position:absolute;inset:44.83% 44.24% 24.06% 12.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-25.svg\"></div><div style=\"position:absolute;inset:53.88% 60.19% 33.14% 28.34%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-26.svg\"></div><div style=\"position:absolute;inset:41.81% 38.84% 39.19% 28.34%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-27.svg\"></div><div style=\"position:absolute;inset:55.04% 39.54% 39.82% 52.58%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-28.svg\"></div><div style=\"position:absolute;inset:42.1% 62.51% 52.76% 29.61%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-29.svg\"></div></div><div style=\"position:absolute;display:contents;inset:26.64% 22.89% 30.11% 12.42%\"><div style=\"position:absolute;inset:26.64% 22.92% 36.16% 12.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-30.svg\"></div><div style=\"position:absolute;inset:31.52% 31.62% 40.99% 21.16%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-31.svg\"></div><div style=\"position:absolute;inset:50.85% 22.89% 30.11% 54.99%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-32.svg\"></div><div style=\"position:absolute;inset:38.78% 44.2% 30.11% 12.42%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-33.svg\"></div><div style=\"position:absolute;inset:47.89% 60.16% 39.19% 28.38%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-34.svg\"></div><div style=\"position:absolute;inset:35.72% 38.77% 45.28% 28.38%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-35.svg\"></div><div style=\"position:absolute;inset:48.99% 39.5% 45.87% 52.65%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-36.svg\"></div><div style=\"position:absolute;inset:36.02% 62.44% 58.84% 29.68%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-37.svg\"></div></div><div style=\"position:absolute;display:contents;inset:19% 20.33% 37.76% 14.99%\"><div style=\"position:absolute;inset:19% 20.36% 43.85% 14.99%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-38.svg\"></div><div style=\"position:absolute;inset:23.88% 29.03% 48.63% 23.72%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-39.svg\"></div><div style=\"position:absolute;inset:43.2% 20.33% 37.76% 57.55%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-40.svg\"></div><div style=\"position:absolute;inset:31.13% 41.64% 37.76% 14.99%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-41.svg\"></div><div style=\"position:absolute;inset:40.21% 57.59% 46.87% 30.94%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-42.svg\"></div><div style=\"position:absolute;inset:28.07% 36.21% 52.92% 30.94%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-43.svg\"></div><div style=\"position:absolute;inset:41.34% 36.94% 53.52% 55.21%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-44.svg\"></div><div style=\"position:absolute;inset:28.37% 59.91% 66.49% 32.24%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-45.svg\"></div></div><div style=\"position:absolute;display:contents;inset:12.91% 20.29% 43.85% 15.06%\"><div style=\"position:absolute;inset:12.91% 20.33% 49.9% 15.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-46.svg\"></div><div style=\"position:absolute;inset:17.82% 28.99% 54.69% 23.76%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-47.svg\"></div><div style=\"position:absolute;inset:37.12% 20.29% 43.85% 57.58%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-48.svg\"></div><div style=\"position:absolute;inset:25.05% 41.57% 43.85% 15.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-49.svg\"></div><div style=\"position:absolute;inset:34.16% 57.53% 52.92% 31.01%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-50.svg\"></div><div style=\"position:absolute;inset:21.99% 36.21% 59.01% 31.01%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-51.svg\"></div><div style=\"position:absolute;inset:35.25% 36.87% 59.61% 55.25%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-52.svg\"></div><div style=\"position:absolute;inset:22.28% 59.84% 72.57% 32.28%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-53.svg\"></div></div></div><div style=\"position:absolute;display:contents;inset:65.75% 14.17% 13.62% 60.12%\"><div style=\"position:absolute;display:contents;inset:65.75% 14.17% 13.62% 60.12%\"><div style=\"position:absolute;display:contents;inset:68.56% 17.21% 19.7% 62.78%\"><div style=\"position:absolute;inset:68.96% 17.68% 20.14% 63.2%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-54.svg\"></div><div style=\"position:absolute;inset:68.56% 17.21% 19.7% 62.78%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-55.svg\"></div></div><div style=\"position:absolute;inset:69.75% 14.26% 13.62% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-56.svg\"></div><div style=\"position:absolute;display:contents;inset:75.17% 14.88% 14.09% 72.36%\"><div style=\"position:absolute;inset:75.17% 14.88% 14.09% 72.36%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-57.svg\"></div></div><div style=\"position:absolute;inset:69.75% 14.26% 13.62% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-58.svg\"></div><div style=\"position:absolute;inset:65.75% 14.17% 17.44% 60.17%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-59.svg\"></div><div style=\"position:absolute;inset:68.56% 17.44% 20.57% 63.59%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-60.svg\"></div><div style=\"position:absolute;display:contents;inset:69.66% 18.48% 20.73% 64.06%\"><div style=\"position:absolute;inset:69.66% 18.48% 20.73% 64.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-61.svg\"></div></div></div><div style=\"position:absolute;display:contents;inset:71.32% 21.61% 23.79% 68.41%\"><div style=\"position:absolute;inset:71.32% 21.61% 23.79% 68.41%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-62.svg\"></div></div><div style=\"position:absolute;inset:68.14% 17.05% 20.14% 63.14%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-63.svg\"></div></div><div style=\"position:absolute;display:contents;inset:62.33% 14.17% 16.98% 60.12%\"><div style=\"position:absolute;display:contents;inset:62.33% 14.17% 16.98% 60.12%\"><div style=\"position:absolute;display:contents;inset:65.17% 17.21% 23.1% 62.78%\"><div style=\"position:absolute;inset:65.57% 17.68% 23.53% 63.2%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-64.svg\"></div><div style=\"position:absolute;inset:65.17% 17.21% 23.1% 62.78%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-65.svg\"></div></div><div style=\"position:absolute;inset:66.39% 14.26% 16.98% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-66.svg\"></div><div style=\"position:absolute;display:contents;inset:71.82% 14.88% 17.44% 72.36%\"><div style=\"position:absolute;inset:71.82% 14.88% 17.44% 72.36%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-57.svg\"></div></div><div style=\"position:absolute;inset:66.39% 14.26% 16.98% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-67.svg\"></div><div style=\"position:absolute;inset:62.33% 14.17% 20.83% 60.17%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-68.svg\"></div><div style=\"position:absolute;inset:65.2% 17.44% 23.93% 63.59%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-60.svg\"></div><div style=\"position:absolute;display:contents;inset:66.23% 18.48% 24.16% 64.06%\"><div style=\"position:absolute;inset:66.23% 18.48% 24.16% 64.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-61.svg\"></div></div></div><div style=\"position:absolute;display:contents;inset:67.96% 21.61% 27.15% 68.41%\"><div style=\"position:absolute;inset:67.96% 21.61% 27.15% 68.41%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-69.svg\"></div></div><div style=\"position:absolute;inset:64.78% 17.05% 23.49% 63.14%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-70.svg\"></div></div><div style=\"position:absolute;display:contents;inset:58.41% 14.17% 20.97% 60.12%\"><div style=\"position:absolute;display:contents;inset:58.41% 14.17% 20.97% 60.12%\"><div style=\"position:absolute;display:contents;inset:61.18% 17.21% 27.09% 62.78%\"><div style=\"position:absolute;inset:61.61% 17.68% 27.49% 63.2%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-71.svg\"></div><div style=\"position:absolute;inset:61.18% 17.21% 27.09% 62.78%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-72.svg\"></div></div><div style=\"position:absolute;inset:62.4% 14.26% 20.97% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-73.svg\"></div><div style=\"position:absolute;display:contents;inset:67.83% 14.88% 21.43% 72.36%\"><div style=\"position:absolute;inset:67.83% 14.88% 21.43% 72.36%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-74.svg\"></div></div><div style=\"position:absolute;inset:62.4% 14.26% 20.97% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-75.svg\"></div><div style=\"position:absolute;inset:58.41% 14.17% 24.79% 60.17%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-76.svg\"></div><div style=\"position:absolute;inset:61.21% 17.45% 27.92% 63.59%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-77.svg\"></div><div style=\"position:absolute;display:contents;inset:62.28% 18.48% 28.12% 64.06%\"><div style=\"position:absolute;inset:62.28% 18.48% 28.12% 64.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-61.svg\"></div></div></div><div style=\"position:absolute;display:contents;inset:63.97% 21.61% 31.14% 68.41%\"><div style=\"position:absolute;inset:63.97% 21.61% 31.14% 68.41%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-69.svg\"></div></div><div style=\"position:absolute;inset:60.79% 17.05% 27.49% 63.14%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-78.svg\"></div></div><div style=\"position:absolute;display:contents;inset:54.42% 14.14% 24.92% 60.12%\"><div style=\"position:absolute;display:contents;inset:54.42% 14.14% 24.92% 60.12%\"><div style=\"position:absolute;display:contents;inset:57.25% 17.21% 31.01% 62.78%\"><div style=\"position:absolute;inset:57.65% 17.68% 31.44% 63.2%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-79.svg\"></div><div style=\"position:absolute;inset:57.25% 17.21% 31.01% 62.78%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-80.svg\"></div></div><div style=\"position:absolute;inset:58.46% 14.22% 24.92% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-81.svg\"></div><div style=\"position:absolute;display:contents;inset:63.87% 14.88% 25.36% 72.36%\"><div style=\"position:absolute;inset:63.87% 14.88% 25.36% 72.36%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-82.svg\"></div></div><div style=\"position:absolute;inset:58.46% 14.22% 24.92% 60.12%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-83.svg\"></div><div style=\"position:absolute;inset:54.42% 14.14% 28.75% 60.2%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-84.svg\"></div><div style=\"position:absolute;inset:57.26% 17.45% 31.88% 63.59%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-77.svg\"></div><div style=\"position:absolute;display:contents;inset:58.32% 18.48% 32.07% 64.06%\"><div style=\"position:absolute;inset:58.32% 18.48% 32.07% 64.06%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-85.svg\"></div></div></div><div style=\"position:absolute;display:contents;inset:60.05% 21.61% 35.07% 68.41%\"><div style=\"position:absolute;inset:60.05% 21.61% 35.07% 68.41%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-86.svg\"></div></div><div style=\"position:absolute;inset:56.84% 17.05% 31.44% 63.14%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-group-87.svg\"></div></div></div></div></div>",
"                <div style=\"background:#38c5c3;flex:1 0 0;min-height:1px;position:relative;border-radius:87.5px;width:100%\"><div style=\"position:absolute;inset:17.29% 28.54% 17.29% 17.35%\"><img alt=\"\" style=\"position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%\" src=\"assets/ex-frame-1244834820.svg\"></div></div>"
];
})();
