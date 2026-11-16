/* Fund — Figma NPS › Fund Details Page (546:136234)
   Default 12235:48413 / 658:176299 · Loading 3280:117512 · Loading failed 658:176867
   With holdings 3220:101492 (loading 3668:11796, failed 3220:97119)
   Sheets: Total investment info 6876:25353 (+loading 6876:25280) · Fund returns info 6886:39878 (+6876:25418)
           Return vs category 3108:87435 (+loading 3280:115552) · Risk vs category 3108:87447
           Taxes & exemptions 1056:153487 (+loading 775:170404)
           Your holdings 3220:97171 / 3220:97162 / 3220:97153 / 5080:155793 (+loading 3228:104879)
           Invest more – can't change plan 6722:218751 · Sell V1 – lock-in 4012:10850
   Withdrawal states: 3205:6092 symbol, instances 3205:7051 / 7179 / 6923 / 6795 / 6667 */
(function(){
const { $, $$, A, inr, PLANS, fundById, S, SCREENS, go, later, sheet, toast, wireCommon, I, jump, resetTo } = P;

/* ---------- data ---------- */
const FD = {
  icici:{ r3:11.8, r5:15.12, r10:12.4, launched:'14 Jan 2018', ago:'8.5 yrs ago', aum:'₹20,360 Cr', aumTag:'Top 20%' },
};
const fdData = (id)=> FD[id] || { r3:10.9, r5:13.4, r10:11.6, launched:'12 May 2009', ago:'17 yrs ago', aum:'₹1,42,300 Cr', aumTag:'Top 10%' };
const PLAN_RATE = { aggressive:11.1, moderate:9.8, conservative:8.6 };
const planRate = ()=>{
  if(S.d.plan==='custom'){ const c = S.d.custom||PLANS.custom; return (c.eq*12.5 + c.corp*9 + c.gov*8 + (c.alt||0)*8)/100; }
  return PLAN_RATE[S.d.plan] || 11.1;
};
// Indian compact amounts as the design writes them: ₹1.4 Cr · ₹16L · ₹50,000
const amt = (n)=>{ const t=(x)=>String(+x.toFixed(1)); if(n>=1e7) return '₹'+t(n/1e7)+' Cr'; if(n>=1e5) return '₹'+t(n/1e5)+'L'; return inr(Math.round(n)); };
// future value of a yearly contribution, paid at the start of each year
const fv = (a, r, n)=>{ const i=r/100; return a*((Math.pow(1+i,n)-1)/i)*(1+i); };
function calc(){
  const a = S.d.amount||50000, age = S.d.age||29, yrs = Math.max(1, 61-age);
  const mat = fv(a, planRate(), yrs), total = a*yrs;
  const pension = Math.round(mat*0.4*0.0855/12/100)*100;
  return { a, age, yrs, mat, total, interest: mat-total, pension };
}

/* ---------- small builders ---------- */
// fund manager logos, shared with Explore (LIC has none yet, so it keeps its initials)
const LOGOS = ['icici','axis','kotak','sbi','hdfc','uti','absl'];
const logo = (f)=>{ const d = { logo: LOGOS.includes(f.id) ? `ex-logo-${f.id}.png` : '' }; return d.logo ? `<span class="fd-logo"><img src="${A}${d.logo}" alt=""></span>` : `<span class="fd-logo fd-ini">${f.name.split(' ').slice(0,2).map(w=>w[0]).join('')}</span>`; };
const info16 = (k)=>`<button class="fd-i16" data-info="${k}" aria-label="Info"><img src="${A}fd-info-16.svg" width="16" height="16" alt=""></button>`;
const info24 = (k)=>`<button class="fd-i24" data-info="${k}" aria-label="Info"><img src="${A}fd-info-24.svg" width="24" height="24" alt=""></button>`;
const secTitle = (t, k)=>`<div class="fd-st"><span>${t}</span>${k?info24(k):''}</div>`;
const topbar = (fav)=>`<div class="topbar">${I.back()}<div class="r"><button class="icon-btn" data-fav aria-label="Favourite"><img src="${A}${fav?'fd-heart-fill.svg':'fd-heart.svg'}" width="24" height="24" alt=""></button>${I.help}</div></div>`;

/* Withdrawal content (states 3205:*) */
const WD = {
  mat:{ hi:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today until 60 yrs of age'],['fd-tl-wallet.svg',`Accumulate ${amt(c.mat)} by 60 yrs`,'Your total collection'],['fd-tl-coins.svg',`Get 60% lumpsum amount of ${amt(c.mat*0.6)}`,'At 60 yrs with 0 tax'],['fd-tl-coins.svg',`Get ${amt(c.pension*12)} pension/yr`,'After 60 yrs post tax deductions as per your slab']],
        lo:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today until 60 yrs of age'],['fd-tl-wallet.svg','At 60, if the amount is < ₹5L','Get 100% amount as lumpsum with 0 tax']],
        toggle:['If maturity amount > ₹5L','If maturity amount <= ₹5L'], note:true },
  pre:{ hi:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today until 60 yrs of age'],['fd-tl-wallet.svg','Accumulate ₹2.5L in 5 yrs','If you invest 50k regularly every year'],['fd-tl-coins.svg','Get 20% lumpsum with 0 tax','After 10 yrs of investing in NPS'],['fd-tl-coins.svg','Get ₹14k pension/yr','After 60 yrs post tax deductions as per your slab']],
        lo:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today until 60 yrs of age'],['fd-tl-wallet.svg','Accumulate <= ₹2.5L in 5 yrs','If you invest one-time or irregularly'],['fd-tl-coins.svg','Get 100% lumpsum with 0 tax','After 5 yrs of investing in NPS']],
        toggle:['If maturity amount > ₹2.5L','If maturity amount <= ₹2.5L'] },
  part:{ hi:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today until 60 yrs of age'],['fd-tl-wallet.svg','Withdraw up to 25% after 3 yrs','Thrice with 5 yrs gap under special conditions']], note:true },
  death:{ hi:(c)=>[['fd-tl-rupee.svg',`Invest ${inr(c.a)}/yr`,'Start today & invest for lifetime'],['fd-tl-wallet.svg','100% lumpsum paid on death of investor','Amount paid to nominee/legal heir with 0 tax']] },
};
const WD_TABS = [['mat','On maturity'],['pre','Premature exit'],['part','Partial withdrawal'],['death','On death']];
function wdBody(st, c){
  const w = WD[st.tab], hi = !w.toggle || st.hi[st.tab];
  const rows = (hi ? w.hi : w.lo)(c);
  return `${w.toggle?`<button class="fd-wtog" data-wtog><b>${w.toggle[hi?0:1]}</b><img src="${A}fd-switch.svg" width="16" height="16" alt=""></button>`:''}
    <div class="fd-ladder">${rows.map(([ic,t,s],i)=>`<div class="fd-lr"><div class="fd-loc"><i class="${i?'':'off'}"></i><span class="fd-dot"><img src="${A}${ic}" width="12" height="12" alt=""></span><i class="${i===rows.length-1?'off':''}"></i></div><div class="fd-li"><div class="b2">${t}</div><div class="meta c2">${s}</div></div></div>`).join('')}</div>
    ${w.note?'<p class="meta c2 fd-wnote">*Users can continue investing in NPS till 75 years</p>':''}`;
}

/* Returns calculator (instance I658:176299;658:174950) */
function chartHtml(f, per, a){
  const d = fdData(f.id), r = {3:d.r3,5:d.r5,10:d.r10}[per];
  const inv = a*per;
  const nifty = fv(a,12,per); const niftyNet = nifty - (nifty-inv)*0.125;
  const cols = [['This fund', fv(a,r,per)], ['PPF', fv(a,7.1,per)], ['Nifty 50', niftyNet]];
  const max = Math.max(inv, ...cols.map(x=>x[1])), H = 92, ih = inv/max*H;
  return `<p class="meta c2 fd-cap">Your <b>investment of ${inr(a)}/yr</b> will become</p>
    <div class="fd-chart"><i class="fd-ref" style="bottom:${ih+53}px"></i>${cols.map(([n,v])=>{
      const gain = v-inv, pct = Math.round(gain/inv*100);
      const ph = Math.abs(gain)/max*H;
      return `<div class="fd-col"><div class="fd-barw"><div class="fd-bar">${gain>=0?`<i class="p" style="height:${ph}px"></i><i class="v" style="height:${ih}px"></i>`:`<i class="v" style="height:${ih-ph}px"></i><i class="l" style="height:${ph}px"></i>`}</div></div>
        <div class="fd-cl"><b>${n}</b><span>${inr(Math.round(v))}</span><em class="${pct<0?'neg':''}">${pct>=0?'+':''}${pct}%</em></div></div>`;
    }).join('')}</div>
    <div class="fd-leg"><span><i style="background:var(--warn)"></i>Invested</span><span><i style="background:var(--green)"></i>Profit</span></div>`;
}

/* ---------- page ---------- */
function contentHtml(f, c, holdings, st){
  const d = fdData(f.id);
  const row = (l, v, extra='')=>`<div class="fd-sr"><span class="b2 c2">${l}${extra}</span>${v}</div>`;
  return `
  <div class="fd-hd">${logo(f)}<div><div class="b1 bold">${f.name}</div><div class="meta c2">Public Tier 1 • Tax saving</div></div></div>
  <div class="fd-ps">
    <div class="fd-inp">
      <button data-calc><span class="meta c2">Invested/yr</span><b>${inr(c.a)}<img src="${A}fd-chev-down-12.svg" width="12" height="12" alt=""></b></button>
      <button data-plan style="align-items:flex-end"><span class="meta c2">Plan</span><b>${(PLANS[S.d.plan]||PLANS.aggressive).name}<img src="${A}fd-chev-down-12.svg" width="12" height="12" alt=""></b></button>
    </div>
    <div class="fd-card">
      <div class="fd-ch"><div><span class="meta c2 fd-il">Maturity amount${info16('mat')}</span><div class="h2">${amt(c.mat)}</div></div><div style="text-align:right"><span class="meta c2">Pension/month</span><div class="h2">${inr(c.pension)}</div></div></div>
      <div class="fd-cb">
        ${row('Total investment', `<b class="b2 semi">${amt(c.total)}</b>`, info16('total'))}
        ${row('Interest earned', `<b class="b2 semi">${amt(c.interest)}</b>`)}
        ${row('5Y returns', `<b class="b2 semi">${d.r5}% p.a.</b>`)}
        <button class="fd-sr" data-rvc><span class="b2 c2">Return</span><span class="fd-sv cg">High<img src="${A}fd-scale-high.svg" width="16" height="12" alt=""><img src="${A}fd-chev-right-16.svg" width="16" height="16" alt=""></span></button>
        <button class="fd-sr" data-risk><span class="b2 c2">Risk</span><span class="fd-sv" style="color:var(--warn)">Low<img src="${A}fd-scale-low.svg" width="16" height="12" alt=""><img src="${A}fd-chev-right-16.svg" width="16" height="16" alt=""></span></button>
      </div>
    </div>
    <p class="meta c2">The above calculations are made for a ${c.age}-year-old investing until retirement</p>
  </div>
  ${holdings ? `<section class="fd-sec fd-hold">${secTitle('Your holdings')}
    <div class="fd-gcard">
      <button class="fd-cv" data-hold><div><div class="meta c2">Current value</div><div class="h3">₹18,890.05</div></div><img src="${A}ic-chevron-right-24.svg" width="24" height="24" alt=""></button>
      ${[['Total P&L','+₹2,000.36 (11.39%)','cg'],['Annualised rate of return','+3.50%','cg'],['Invested value','₹20,000',''],['On maturity','₹6.7 Cr','']].map(([l,v,k])=>`<div class="fd-hr"><span class="b2 c2">${l}</span><span class="b2 ${k}">${v}</span></div>`).join('')}
    </div></section>` : ''}
  <div class="tabs fd-tabs" id="fdTabs">${[['fdRet','Returns'],['fdWd','Withdrawal'],['fdInfo','Fund Info'],['fdTax','Taxes']].map(([k,l],i)=>`<button class="tab ${i?'':'on'}" data-sec="${k}">${l}</button>`).join('')}</div>
  <section class="fd-sec" id="fdRet">${secTitle('Calculate fund returns','ret')}
    <div class="fd-calc">
      <div class="fd-chips">${[3,5,10].map(n=>`<button class="chip ${n===st.per?'sel':''}" data-per="${n}">${n}Y</button>`).join('')}</div>
      <div id="fdChart">${chartHtml(f, st.per, c.a)}</div>
      <p class="meta c2 fd-after">Returns shown are after tax deductions*</p>
    </div></section>
  <section class="fd-sec fd-wd" id="fdWd">${secTitle('Withdrawal')}
    <div class="tabs fd-wtabs">${WD_TABS.map(([k,l])=>`<button class="tab ${k===st.tab?'on':''}" data-wt="${k}">${l}</button>`).join('')}</div>
    <div id="fdWdBody">${wdBody(st, c)}</div></section>
  <section class="fd-sec" id="fdInfo">${secTitle('Fund info')}
    <div class="fd-gcard fd-list">
      <div class="fd-lrow"><span class="b1 c2">Launched on</span><span><b class="b1">${d.launched}</b><small class="meta c2">${d.ago}</small></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Partial withdrawal</span><span><b class="b1">After 3 yrs</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Maturity</span><span><b class="b1">60 yrs</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">AUM</span><span><b class="b1">${d.aum}</b><small class="meta c2">${d.aumTag}</small></span></div>
    </div></section>
  <section class="fd-sec" id="fdTax">${secTitle('Taxes &amp; exemptions','tax')}
    <div class="fd-gcard fd-list fd-taxc">
      <div class="fd-lrow"><span class="b1 c2">Individual exemptions</span><span><b class="b2">Up to ₹2L/yr</b></span></div>
      <div class="fd-lrow sm"><span class="meta c2">Under section 80CCD</span><span><b class="meta">₹1.5L</b></span></div>
      <div class="fd-lrow sm"><span class="meta c2">Exclusive NPS investor benefit</span><span><b class="meta">₹50,000</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Corporate exemptions</span><span><b class="b1">Up to ₹7.5L/yr</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Tax on capital gains</span><span><b class="b2">0</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Tax on lumpsum/partial<br>withdrawal</span><span><b class="b2">0</b></span></div><i class="fd-div"></i>
      <div class="fd-lrow"><span class="b1 c2">Tax on pension</span><span><b class="b1">as per slab</b></span></div>
    </div></section>
  <div class="fd-disc"><i class="fd-div"></i><p class="meta">Disclaimer: Top rated funds does not constitute a personal recommendation. Neither RKSV, nor any person connected with it, accepts any liability arising from the use of such this information. Investors should read scheme documents before investing. All the information available on our platform is basis analysis carried out by <a data-vr>Value Research</a> and RKSV is just a sharing the said information for information purpose.</p></div>`;
}

const footHtml = (holdings)=> holdings
  ? `<div class="foot fd-foot2"><button class="btn fd-sell" data-sell><img src="${A}ic-info-16-grey.svg" width="16" height="16" alt="" class="fd-sell-i">Sell</button><button class="btn" data-more>Invest more</button></div>`
  : `<div class="foot"><button class="btn" data-invest>Invest now</button></div>`;

/* Loading skeleton (3280:117512) */
const sk = (w,h=12,s='')=>`<i class="skel" style="width:${w}px;height:${h}px;${s}"></i>`;
const skelHtml = ()=>`<div class="fd-sk">
  <div class="fd-hd"><i class="skel" style="width:40px;height:40px;border-radius:50%"></i><div style="display:flex;flex-direction:column;gap:6px">${sk(148)}${sk(92,10)}</div></div>
  <div class="fd-ps"><div class="fd-inp">${sk(36,8)}${sk(36,8)}</div><div class="fd-inp" style="margin-top:-12px">${sk(60)}${sk(100)}</div>
    <div class="fd-card"><div class="fd-ch" style="height:80px"><div style="display:flex;flex-direction:column;gap:8px">${sk(64,8)}${sk(84,22)}</div><div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">${sk(64,8)}${sk(100,22)}</div></div>
      <div class="fd-cb">${[0,1,2,3,4].map(()=>`<div class="fd-sr">${sk(80)}${sk(32)}</div>`).join('')}</div></div>
    <div style="display:flex;flex-direction:column;gap:6px">${sk(328,10)}${sk(170,10)}</div></div>
  <div class="fd-sktabs">${sk(60)}${sk(80)}${sk(80)}${sk(40)}</div>
  <section class="fd-sec">${secTitle('Calculate fund returns')}<div class="fd-calc" style="height:330px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:24px"><div style="display:flex;gap:12px">${sk(52,24,'border-radius:12px')}${sk(52,24,'border-radius:12px')}${sk(52,24,'border-radius:12px')}</div>${sk(200)}<div style="display:flex;gap:40px;align-items:flex-end;height:110px">${sk(48,90)}${sk(48,50)}${sk(48,62)}</div>${sk(200)}</div></section>
  <section class="fd-sec">${secTitle('Withdrawal')}<div class="fd-sktabs" style="padding-top:0">${sk(60)}${sk(80)}${sk(80)}${sk(40)}</div>
    <div style="margin:16px;border:1px solid var(--ui3);border-radius:8px;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px">${sk(100)}${sk(14,14)}</div>
    ${[0,1,2,3].map(()=>`<div style="display:flex;gap:16px;padding:6px 20px;align-items:center">${sk(20,20,'border-radius:50%')}<div style="display:flex;flex-direction:column;gap:6px">${sk(120)}${sk(200,10)}</div></div>`).join('')}</section>
  ${['Fund info','Taxes &amp; exemptions'].map(t=>`<section class="fd-sec">${secTitle(t)}<div class="fd-gcard" style="background:#fff;border:1px solid var(--ui3)">${[0,1,2,3,4].map(()=>`<div class="fd-lrow">${sk(100)}${sk(100)}</div>`).join('')}</div></section>`).join('')}
</div>`;

const failHtml = ()=>`<div class="fd-fail"><img src="${A}fd-ufo.png" width="150" height="150" alt=""><p class="b1 c2">We couldn't catch the latest updates.<br>Give it another shot!</p><button class="chip" data-retry>Retry</button></div>`;

SCREENS.fund = (el, p={})=>{
  const fid = p.fund || S.d.fund || 'icici'; S.d.fund = fid;
  const f = fundById(fid);
  const st = { per:10, tab:'mat', hi:{mat:true, pre:true}, fav:false };
  wireCommon(el);
  let spyLock = 0;

  function render(mode){
    const holdings = !!(p.holdings || S.scn.holdings);
    const load = mode || S.scn.load;
    if(load==='fail'){ el.innerHTML = `<div class="topbar">${I.back()}</div><div class="scroll">${failHtml()}</div>`; return; }
    if(load==='loading'){
      el.innerHTML = `${topbar(st.fav)}<div class="scroll">${skelHtml()}</div><div class="foot fd-foot2"><i class="skel" style="flex:1;height:48px;border-radius:24px;background:#fff;box-shadow:inset 0 0 0 1px var(--ui3)"></i><i class="skel" style="flex:1;height:48px;border-radius:24px"></i></div>`;
      later(()=>render('ok'), 1200); return;
    }
    const c = calc();
    el.innerHTML = `${topbar(st.fav)}<div class="scroll fd-scroll" id="fdS"><div class="stg fd-stg">${contentHtml(f, c, holdings, st)}</div></div>${footHtml(holdings)}`;
    const sc = $('#fdS', el);
    // drop the entrance-stagger class once it has played: its animated children would otherwise paint over the sticky tab bar
    later(()=>{ const g = $('.fd-stg', el); g && g.classList.remove('stg'); }, 800);
    sc.addEventListener('scroll', ()=>{
      if(Date.now() < spyLock) return;
      let on = 'fdRet';
      ['fdRet','fdWd','fdInfo','fdTax'].forEach(id=>{ if($('#'+id, el).offsetTop - sc.scrollTop <= 80) on = id; });
      if(sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) on = 'fdTax';
      markTab(on);
    });
  }
  const markTab = (on)=>{ const t = $('#fdTabs', el); if(!t) return; $$('[data-sec]', t).forEach(b=>b.classList.toggle('on', b.dataset.sec===on)); const a = $(`[data-sec="${on}"]`, t); if(!a) return;
    const l = a.offsetLeft - 16, r = a.offsetLeft + a.offsetWidth + 16 - t.clientWidth;
    if(t.scrollLeft > l) t.scrollTo({left:Math.max(0,l), behavior:'smooth'}); else if(t.scrollLeft < r) t.scrollTo({left:r, behavior:'smooth'}); };
  const rerenderKeepScroll = ()=>{ const s = $('#fdS', el), y = s ? s.scrollTop : 0; render('ok'); const n = $('#fdS', el); if(n){ n.scrollTop = y; const sg = $('.fd-stg', el); sg && sg.classList.remove('stg'); } };

  el.addEventListener('click', e=>{
    const t = e.target;
    if(t.closest('[data-retry]')) return render('loading');
    if(t.closest('[data-fav]')){ st.fav = !st.fav; const im = $('[data-fav] img', el); im.src = A + (st.fav?'fd-heart-fill.svg':'fd-heart.svg'); im.parentElement.classList.remove('fd-pop'); void im.offsetWidth; im.parentElement.classList.add('fd-pop'); return toast(st.fav ? 'Added to watchlist' : 'Removed from watchlist'); }
    if(t.closest('[data-calc]')) return P.openCalculator ? P.openCalculator({onDone: rerenderKeepScroll}) : toast('Calculator not built yet');
    if(t.closest('[data-plan]')) return P.openPlans ? P.openPlans({onDone: rerenderKeepScroll}) : toast('Plans not built yet');
    const inf = t.closest('[data-info]'); if(inf) return openInfo(inf.dataset.info);
    if(t.closest('[data-rvc]')) return openReturnVs();
    if(t.closest('[data-risk]')) return openRiskVs();
    if(t.closest('[data-hold]')) return openHoldings();
    const sec = t.closest('[data-sec]'); if(sec){ spyLock = Date.now()+900; markTab(sec.dataset.sec); const sc = $('#fdS', el); sc.scrollTo({top: $('#'+sec.dataset.sec, el).offsetTop - 56 - 8, behavior:'smooth'}); return; }
    const per = t.closest('[data-per]'); if(per){ st.per = +per.dataset.per; $$('[data-per]', el).forEach(b=>b.classList.toggle('sel', b===per)); $('#fdChart', el).innerHTML = chartHtml(f, st.per, S.d.amount||50000); return; }
    const wt = t.closest('[data-wt]'); if(wt){ st.tab = wt.dataset.wt; $$('[data-wt]', el).forEach(b=>b.classList.toggle('on', b===wt)); $('#fdWdBody', el).innerHTML = wdBody(st, calc()); return; }
    if(t.closest('[data-wtog]')){ st.hi[st.tab] = !st.hi[st.tab]; $('#fdWdBody', el).innerHTML = wdBody(st, calc()); return; }
    if(t.closest('[data-vr]')) return toast('Opening Value Research…');
    if(t.closest('[data-invest]')) return go('buyAmount', 'push', {fund:fid});
    if(t.closest('[data-more]')) return investMore(fid);
    if(t.closest('[data-sell]')) return openSell();
  });
  el.__refresh = ()=>render();
  render();
};

/* ---------- sheets ---------- */
// sheet that shows its Figma loading skeleton first, then the content
function loadingSheet(skel, html, {cls='', style='', ms=650}={}){
  const s = sheet({html:`<div class="fd-shb">${skel}</div>`, cls:'fd-sh '+cls, style});
  later(()=>{ const b = $('.fd-shb', s.el); if(b){ b.innerHTML = html; b.classList.add('fd-in'); } }, ms);
  return s;
}
const skLines = (ws)=>`<div class="fd-skl">${ws.map(w=>`<i class="skel" style="width:${w}px;height:12px"></i>`).join('')}</div>`;
const listSheet = (title, items)=>`<div class="fd-sht">${title}</div><ol class="fd-ol">${items.map(x=>`<li>${x}</li>`).join('')}</ol>`;

function openInfo(k){
  if(k==='mat' || k==='total') return loadingSheet(`${skLines([184])}${skLines([218,218,283,269,292,177])}`, listSheet('How are returns calculated?', ['Compound interest formula.','Tenure taken is based on your age.','Total investment is taken based on your selected invested/yr value.','Pension per month is calculated by assuming 7% annual interest rate on 40% of your maturity amount.']));
  if(k==='ret') return loadingSheet(`${skLines([184])}${skLines([218,218,283,269])}`, listSheet('How are returns calculated?', ['Compound interest formula.','Tenure taken is based on your age.','PPF and Index returns are assumed as 7.1% and 12% respectively.','Tax % for index fund is 12.5%.']));
  if(k==='tax') return loadingSheet(`${skLines([184])}${[0,1,2,3,4,5].map(()=>skLines([162,282,142])).join('')}`, `<div class="fd-sht">Taxes &amp; exemptions</div><div class="fd-tx">${[
    ['Tax benefits under 80CCD1 &amp; 80CCD(1B)','Users can get tax exemption up to ₹2L'],
    ['Tax benefits on partial withdrawal','Amount received from partial withdrawal are tax exempt under section 10(12B) of Income Tax Act'],
    ['Tax benefits on capital gains','Zero tax on capital gains'],
    ['Tax benefit on Annuity purchase:','Amount invested in purchase of Annuity, is fully exempt from tax but annuity income received in the subsequent years is taxable'],
    ['Tax benefit on lump sum withdrawal','Up to 60% of the total corpus withdrawn in lumpsum is exempt from tax'],
    ['Additional tax benefit for corporate contribution','Investors can invest up to 10% of basic + DA via employer, capped at ₹7.5L/yr exempted under section 80CCD(1B))']].map(([a,b])=>`<div><div class="b1">${a}</div><div class="b2 c2">${b}</div></div>`).join('')}</div>`, {cls:'fd-tall'});
}
// Linear gauge: segs = colours, sel = index of the selected segment
const gauge = (segs, sel)=>`<span class="fd-gauge">${segs.map((c,i)=>`<span class="${i===sel?'on':''}"><i style="background:${c}"></i>${i===sel?`<img src="${A}fd-ptr.svg" width="16" height="4" alt="">`:'<em></em>'}</span>`).join('')}</span>`;
const R='var(--err)', Y='var(--warn)', G='var(--green)';
const vsItem = (l, v, g, d, link='')=>`<div class="fd-vi"><div class="fd-vt"><span class="b2">${l}</span><span class="fd-vr"><span class="b2">${v}</span>${g}</span></div><p class="meta c2">${d}</p>${link}</div>`;
const vsHead = (strong, rest, icon)=>`<div class="fd-vh"><div class="h3"><span class="cg">${strong}</span> ${rest}</div><span class="fd-vbox"><img src="${A}${icon}" width="24" height="18" alt=""></span></div>`;
const vsDisc = `<p class="meta c2 fd-vd">Disclaimer: Research &amp; analysis data provided by <a data-vr2>Value Research</a></p>`;
const vsSkel = `<div class="fd-vh">${skLines([200])}<i class="skel" style="width:56px;height:56px;border-radius:8px"></i></div>${[0,1].map(()=>`<div class="fd-vi">${skLines([80,300])}</div>`).join('')}`;
function openReturnVs(){
  const s = loadingSheet(vsSkel, vsHead('High return','vs category','fd-scale-high-24.svg') + `<div class="fd-vl">${vsItem('5Y CAGR','High',gauge([R,Y,G],2),'Yearly return provided by the fund over a period of 5 yrs')}${vsItem('10Y CAGR','Medium',gauge([R,Y,G],1),'Yearly return provided by the fund over a period of 10 yrs')}</div>` + vsDisc);
  s.el.addEventListener('click', e=>{ if(e.target.closest('[data-vr2]')) toast('Opening Value Research…'); });
}
function openRiskVs(){
  const d = fdData(S.d.fund);
  const s = loadingSheet(vsSkel, vsHead('Low risk','vs category','fd-scale-low-24.svg') + `<div class="fd-vl">${vsItem('Risk Rating','AAA',gauge([R,Y,G],2),'This represents the credit worthiness of the investments made by the funds. AAA is the highest credit rating any fund can have.')}${vsItem('Fund size',d.aum,gauge([R,G],1),'This is the total market value of all assets in a fund.','<a class="fd-rm" data-rm>Read more</a>')}${vsItem('Year since inception','8 years',gauge([R,G],1),'Total number of years the fund has been in operation.')}</div>` + vsDisc);
  s.el.addEventListener('click', e=>{ if(e.target.closest('[data-vr2]')) toast('Opening Value Research…'); if(e.target.closest('[data-rm]')) toast('Fund size explained'); });
}

/* Your holdings sheet (3220:97171 · 97162 · 97153 · 5080:155793) */
const H_TABS = [['sum','Summary'],['ord','Orders'],['brk','Breakdown'],['rep','Reports']];
function holdBody(k){
  if(k==='sum'){
    const r = (l,v,c='')=>`<div class="fd-hs"><span class="b1 c2">${l}</span><span class="b1 ${c}">${v}</span></div>`;
    return `<div class="fd-hsum">${r('Total P&amp;L','+₹2,000.36 (11.39%)','cg')}${r('Lumpsum maturity','₹6.7 Cr')}${r('Pension/month','₹40,000')}
      <div class="fd-hs top"><div><div class="b1 c2">Annualised rate of return</div><p class="meta c2" style="width:190px;margin-top:4px">It’s the annual return earned by an investor over the investment holding period.</p></div><span class="b1 cg">+3.51%</span></div>
      ${r('Plan type','Aggressive')}
      <div class="fd-donut"><i class="fd-ring"></i><div class="fd-dl"><span><i style="background:#AF91D1"></i>Equity<b>75%</b></span><span><i style="background:#F2946E"></i>Corp bonds<b>15%</b></span><span><i style="background:#F6BF4F"></i>Govt bonds<b>10%</b></span></div></div></div>`;
  }
  if(k==='ord') return [['Transferred to','In progress'],['₹6,000.23','Completed']].map(([a,b])=>`<div class="fd-ord"><div><div class="b2 semi">${a}</div><div class="meta c2">16 Sep 2022</div></div><div style="text-align:right"><div class="b2 semi cg">${b}</div><div class="meta c2">Units 37.00</div></div></div>`).join('');
  if(k==='brk') return `<div class="fd-brk">${[['E','618.75','74.99%','₹38,066'],['C','132.12','9.99%','₹5,074'],['G','229.15','15.07%','₹7,647']].map(([s,u,a,m])=>`<div class="fd-bi"><div class="b1 c2">ICICI Prudential Pension Fund Scheme ${s}</div><div class="fd-b3">${[['Units',u],['Allocation',a],['Amount',m]].map(([l,v])=>`<span><small class="meta c2">${l}</small><b class="b2">${v}</b></span>`).join('')}</div></div>`).join('')}</div>`;
  return `<div class="fd-rep">${[['Tax proof','Proof for tax declaration under Section 80CCD'],['Holding statement','Statement of holding for NPS'],['Voluntary contribution statement','Statement of voluntary contribution']].map(([a,b])=>`<button class="fd-ri" data-rep><div><div class="b1">${a}</div><div class="meta c2">${b}</div></div><img src="${A}fd-open-24.svg" width="24" height="24" alt=""></button>`).join('')}</div>`;
}
function openHoldings(){
  let tab = 'sum';
  const top = `<div class="fd-sht">Total investments</div><div class="fd-ivc"><div><span class="b2 c2">Invested value</span><span class="b2">₹62,000.39</span></div><i></i><div><span class="b2 c2">Current value</span><span class="b2">₹64,000.71</span></div></div>`;
  const tabs = ()=>`<div class="tabs fd-htabs">${H_TABS.map(([k,l])=>`<button class="tab ${k===tab?'on':''}" data-ht="${k}">${l}</button>`).join('')}</div>`;
  const skel = `<div class="fd-sht"><i class="skel" style="width:200px;height:24px;display:block"></i></div><div class="fd-ivc">${skLines([68,48])}<i></i>${skLines([84,48])}</div><div class="fd-sktabs" style="padding-top:8px">${[60,80,70].map(w=>`<i class="skel" style="width:${w}px;height:12px"></i>`).join('')}</div>${[0,1,2].map(()=>`<div class="fd-hs"><i class="skel" style="width:48px;height:12px"></i><i class="skel" style="width:94px;height:12px"></i></div>`).join('')}`;
  const s = loadingSheet(skel, `${top}${tabs()}<div class="sh-scroll fd-hb">${holdBody(tab)}</div>`, {cls:'fd-holdsh', style:'height:600px'});
  s.el.addEventListener('click', e=>{
    const t = e.target.closest('[data-ht]');
    if(t){ tab = t.dataset.ht; $$('[data-ht]', s.el).forEach(b=>b.classList.toggle('on', b===t)); const b = $('.fd-hb', s.el); b.innerHTML = holdBody(tab); b.scrollTop = 0; t.scrollIntoView({inline:'nearest', block:'nearest', behavior:'smooth'}); return; }
    if(e.target.closest('[data-rep]')) toast('Downloading report…');
  });
}
const dialog = (icon, title, body, primary, secondary)=>`<div class="fd-dlg"><img src="${A}${icon}" width="56" height="56" alt=""><div class="h2">${title}</div><p class="b1 c2">${body}</p></div><div class="sh-foot fd-dfoot"><button class="btn purple" data-ok>${primary}</button>${secondary?`<button class="fd-txt" data-close>${secondary}</button>`:''}</div>`;
function investMore(fid){
  if(S.d.plan === 'aggressive') return go('buyAmount', 'push', {fund:fid});
  const s = sheet({cls:'fd-sh', html: dialog('fd-warning-56.svg','Can’t change plan type','As per PFRDA regulations, changing the plan type isn’t allowed<br><br>Alternatively, you can change it using <a class="fd-link" data-cams>CAMs</a> portal','Continue with existing plan','Back')});
  s.el.addEventListener('click', e=>{
    if(e.target.closest('[data-cams]')) return toast('Opening CAMs portal…');
    if(e.target.closest('[data-ok]')){ S.d.plan = 'aggressive'; s.close(); setTimeout(()=>go('buyAmount','push',{fund:fid}), 250); }
  });
}
function openSell(){
  const s = sheet({cls:'fd-sh', html: dialog('fd-danger-56.svg','Lock-in period active','You need to continue investing for at least 3 years to make a partial withdrawal','Got it')});
  s.el.addEventListener('click', e=>{ if(e.target.closest('[data-ok]')) s.close(); });
}

jump('fund', 'Fund details', 'fund', ()=>{ S.d.fund = 'icici'; resetTo(['home','explore'], 'fund', {fund:'icici'}); });
jump('fundHoldings', 'Fund · with holdings', 'fund', ()=>{ S.d.fund = 'icici'; resetTo(['home','portfolio'], 'fund', {fund:'icici', holdings:true}); });
})();
