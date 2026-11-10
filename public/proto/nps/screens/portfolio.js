/* Portfolio — Figma NPS › Portfolio (section 565:86151; order sheets 2654:201956; holdings sheets 616:173683;
   tax proof 15736:47993; view all orders 4415:205532)
   States: loading 733:171123 · load failed 565:86346 · zero 9405:212110 · investments 738:181408 · orders 6739:352288 / 4415:207723 /
   4963:24269 (transfer) · order pending nudge 6846:324935 · just-ordered 9119:47655 / 13297:41879 · PRAN in progress 9373:14678 ·
   PRAN failed 9503:212431 */
(function(){
const { $, $$, h, A, inr, fundById, S, SCREENS, go, navBack, resetTo, later, sheet, toast, wireCommon, loadingBtn, I, jump } = P;

/* ---------------- data ---------------- */
const TAG = {
  PENDING:['PENDING','#E79D0D'], 'ORDER PENDING':['ORDER PENDING','#E79D0D'], 'PAYMENT PENDING':['PAYMENT PENDING','#E79D0D'],
  'IN PROGRESS':['IN PROGRESS','#E79D0D'], COMPLETED:['COMPLETED','#148564'], COMPLETE:['COMPLETE','#148564'],
  'PAYMENT FAILED':['PAYMENT FAILED','#DB542A'], REJECTED:['REJECTED','#DB542A'], FAILED:['FAILED','#DB542A'], CANCELLED:['CANCELLED','#6A6A6A'],
};
// Orders list "Portfolio/Orders" long list (4415:207723)
const BASE_ORDERS = [
  { fund:'HDFC Pension Fund', tag:'ORDER PENDING', amt:10000, date:'5 Jun 2025', kind:'pay' },
  { fund:'HDFC Pension Fund', tag:'PAYMENT PENDING', amt:10000, date:'5 Jun 2025', kind:'pay' },
  { fund:'ICICI Prudential Pension Fund', tag:'PAYMENT FAILED', amt:50000, date:'5 May 2025', kind:'payfail' },
  { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:35000, date:'5 Apr 2025', kind:'done' },
  { fund:'ICICI Prudential Pension Fund', tag:'REJECTED', amt:50000, date:'2 Apr 2025', kind:'rejected' },
  { fund:'ICICI Prudential Pension Fund', tag:'CANCELLED', amt:50000, date:'28 Mar 2025', kind:'cancelled' },
  { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:50000, date:'14 Mar 2025', kind:'done' },
];
// "Orders | Transfer" (4963:24269 / 4963:24337)
const TRANSFER_ORDERS = (done)=>[
  { fund:'HDFC Pension Fund', logo:'hdfc', tag:'PENDING', amt:10000, date:'5 Jun 2025', kind:'pending' },
  { transfer:true, tag: done ? 'COMPLETE' : 'IN PROGRESS', kind: done ? 'tdone' : 'transfer' },
];
// View all orders (4415:204867 / 4415:206213)
const ALL_PENDING = [
  { fund:'HDFC Pension Fund', tag:'PENDING', amt:10000, date:'5 Jun 2025', kind:'pending' },
  { fund:'HDFC Pension Fund', tag:'PENDING', amt:149260, date:'3 Jun 2025', dl:'Request placed on', kind:'pending' },
  { fund:'ICICI Prudential Pension Fund', tag:'PENDING', amt:50000, date:'5 Jun 2025', kind:'pending' },
];
const ALL_CLOSED = [
  { fund:'HDFC Pension Fund', tag:'COMPLETED', amt:10000, date:'5 May 2025', kind:'done' },
  { fund:'HDFC Pension Fund', tag:'COMPLETED', amt:149260, date:'2 May 2025', dl:'Request placed on', kind:'done' },
  { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:35000, date:'5 Apr 2025', kind:'done' },
  { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:50000, date:'28 Mar 2025', kind:'done' },
  { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:50000, date:'14 Mar 2025', kind:'done' },
];
const FYS = ['Apr 2024 - Mar 2025','Apr 2023 - Mar 2024','Apr 2022 - Mar 2023','Apr 2021 - Mar 2022','Apr 2020 - Mar 2021','Apr 2019 - Mar 2020','Apr 2018 - Mar 2019'];
const pf = { fy:0, fmt:'pdf', cancelled:false };

const fmtDate = (t)=>{ const d = new Date(t || Date.now()); return d.getDate()+' '+d.toLocaleString('en-GB',{month:'short'})+' '+d.getFullYear(); };
const fmtStamp = (t)=>{ const d = new Date(t || Date.now()); let hh = d.getHours(), ap = hh>=12?'PM':'AM'; hh = hh%12||12; return fmtDate(t)+' '+String(hh).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+' '+ap; };
const fullName = (id)=> fundById(id).name;

// the order placed in this session (S.d.order) → list card
function myOrder(){
  const o = S.d.order; if(!o) return null;
  if(pf.cancelled) return { mine:true, fund:fullName(o.fund), logo:o.fund==='hdfc'?'hdfc':'', tag:'CANCELLED', amt:o.amount, date:fmtDate(o.at), kind:'cancelled', at:o.at };
  const map = { success:['PENDING','mine'], processing:['ORDER PENDING','pay'], failed:['PAYMENT FAILED','payfail'], done:['COMPLETED','done'] };
  const [tag, kind] = map[o.status] || map.success;
  return { mine:true, fund:fullName(o.fund), logo:o.fund==='hdfc'?'hdfc':'', tag, amt:o.amount, date:fmtDate(o.at), kind, at:o.at };
}

/* ---------------- small pieces ---------------- */
const logoImg = (k)=> k==='hdfc'
  ? `<span class="pf-lg"><img src="${A}pf-logo-hdfc.png" alt=""></span>`
  : `<span class="pf-lg"><img src="${A}pf-logo-icici-red.png" alt=""></span>`;
const tagHtml = (t, big)=>{ const [l,c] = TAG[t] || [t,'#E79D0D']; return `<span class="pf-tag${big?' big':''}" style="background:${c}">${l}</span>`; };
const orderCard = (o, i)=> o.transfer
  ? `<button class="pf-card" data-ord="${i}"><span class="pf-lg pf-sw"><img src="${A}pf-ic-switch-20.svg" width="20" height="20" alt=""></span>
      <div class="pf-cb"><div class="pf-ct"><b>Transfer request</b>${tagHtml(o.tag)}</div>
      <div class="pf-kv"><div><span>From</span>ICICI Prudential....</div><div><span>To</span>HDFC pension sch...</div></div></div></button>`
  : `<button class="pf-card" data-ord="${i}">${logoImg(o.logo || (/HDFC/.test(o.fund) ? 'hdfc' : ''))}
      <div class="pf-cb"><div class="pf-ct"><b>${o.fund}</b>${tagHtml(o.tag)}</div>
      <div class="pf-kv"><div><span>Order value</span>${inr(o.amt)}</div><div><span>${o.dl || 'Order placed on'}</span>${o.date}</div></div></div></button>`;
const holdCard = ()=>`<button class="pf-card" data-hold>${logoImg()}
    <div class="pf-cb"><div class="pf-ct"><b>ICICI Prudential Pension Fund</b><span class="pf-sub">Aggressive plan<i>•</i>Auto Choice</span></div>
    <div class="pf-kv"><div><span>Current value</span>₹1.49L</div><div><span>Total P&amp;L</span><em class="cg">+₹14.3K (10.56%)</em></div></div></div></button>`;
const emptyBlock = (msg, btn, attr)=>`<div class="pf-empty"><img src="${A}pf-empty-safe.png" width="150" height="150" alt="">
    <p>${msg}</p><button class="pf-sbtn" ${attr}>${btn}</button></div>`;
const statCard = ()=>`<div class="pf-stat">
    <button class="pf-sl" data-pinfo>Your portfolio value<img src="${A}pf-ic-info-16.svg" width="16" height="16" alt=""></button>
    <div class="pf-sv"><b>₹1,49,260</b><span>Till date</span></div>
    <div class="pf-s3"><div><span>Invested</span><b>₹1,35,000</b></div><div><span>Total returns</span><b class="cg">+₹14,260 (10.56%)</b></div><div><span>On maturity</span><b>₹1.2 Cr</b></div></div>
  </div>`;
const pranBox = `<div class="pf-pran"><b>PRAN: </b>110072548391</div>`;
const sectionHead = (top=0)=>`<div class="pf-sh" style="margin-top:${top}px"><span class="pf-sht">Your portfolio</span><button class="pf-sbtn pf-tax" data-tax>Tax proof <img src="${A}pf-ic-download-16.svg" width="16" height="16" alt=""></button></div>`;
const innerTabs = (tab, invCount)=>`<div class="pf-itabs">
    <button class="pf-it ${tab==='investments'?'on':''}" data-itab="investments"><span>Investments</span>${invCount!=null?`<em>${invCount}</em>`:''}<i></i></button>
    <button class="pf-it ${tab==='orders'?'on':''}" data-itab="orders"><span>Orders</span><i></i></button></div>`;
const arrowArt = `<div class="pf-art"><img src="${A}pf-arrow-g1.svg" style="left:28.39px;top:91.8px;width:113.2px;height:83.35px" alt=""><img src="${A}pf-arrow-g2.svg" style="left:0;top:100.15px;width:122.23px;height:74.96px" alt=""><img src="${A}pf-arrow-g3.svg" style="left:44.65px;top:0;width:83.15px;height:133.34px" alt=""></div>`;
const errArt = `<div class="pf-err"><img src="${A}pf-err-bg.svg" style="left:0;top:0;width:92px;height:92px" alt=""><img src="${A}pf-err-circle.svg" style="left:15.64px;top:13.8px;width:61.64px;height:63.48px" alt=""><img src="${A}pf-err-bar.svg" style="left:43.21px;top:26.9px;width:5.58px;height:29.26px" alt=""><img src="${A}pf-err-dot.svg" style="left:43.21px;top:59.62px;width:5.58px;height:8.24px" alt=""></div>`;
const banner = (kind)=>{
  if(kind==='failed') return `<div class="pf-bnw"><div class="pf-bn"><div class="pf-bnt"><b>NPS account creation failed</b><p>PRAN not generated due to failed loan repayment</p><button class="pf-help" data-gethelp>Get Help</button></div>${errArt}</div></div>`;
  const [t, s] = kind==='pran' ? ['NPS account creation is in progress...','PRAN will be generated shortly'] : ['NPS account created!','Your order is in progress'];
  return `<div class="pf-bnw"><div class="pf-bn"><div class="pf-bnt"><b>${t}</b><p>${s}</p></div>${arrowArt}</div></div>`;
};
const nudge = `<div class="pf-nudge"><div class="pf-nic"><img src="${A}pf-nudge-bg.svg" style="left:0;top:0;width:48px;height:48px" alt=""><img src="${A}pf-nudge-circle.svg" style="left:8.16px;top:7.2px;width:32.15px;height:33.12px" alt=""><img src="${A}pf-nudge-bar.svg" style="left:22.72px;top:12.29px;width:2.56px;height:14.91px" alt=""><img src="${A}pf-nudge-dot.svg" style="left:22.72px;top:29.36px;width:2.56px;height:3.94px" alt=""></div>
  <p>1 order payment<br>requires action</p><button class="pf-retry" data-payretry>Retry</button></div>`;

const hubHead = `<div class="topbar"><div class="l">${I.back()}<span class="b1">NPS</span></div>
    <div class="r"><button class="icon-btn" data-search aria-label="Search"><img src="${A}pf-ic-search-24.svg" width="24" height="24" alt=""></button>${I.help}</div></div>
  <div class="tabs"><button class="tab on">Portfolio</button><button class="tab" data-hub="explore">Explore</button></div>`;

/* ---------------- Portfolio screen ---------------- */
SCREENS.portfolio = (el, p={})=>{
  const st = { tab: p.tab || (S.d.order ? 'orders' : 'investments'), force: p.force || null, variant: p.variant || null, retried:false, more:false };
  el.innerHTML = `${hubHead}<div class="scroll pf-scroll" id="pfScroll"><div id="pfBody"></div></div><div class="foot pf-foot" id="pfFoot" hidden></div>`;
  wireCommon(el);
  const body = $('#pfBody', el), foot = $('#pfFoot', el);

  const mode = ()=>{
    const o = S.d.order, hold = st.force ? st.force==='holdings' : S.scn.holdings;
    if(st.force==='zero') return {kind:'zero'};
    if(o && !hold) return {kind: pf.cancelled ? 'zero' : o.status==='failed' ? 'pranfail' : o.status==='processing' ? 'pran' : 'created'};
    if(hold) return {kind:'holdings', nudge: !!(o && o.status==='processing' && !pf.cancelled)};
    return {kind:'zero'};
  };
  const ordersFor = (m)=>{
    const mine = myOrder();
    if(m.kind!=='holdings'){ if(mine && mine.tag==='ORDER PENDING') mine.tag = 'PENDING'; return mine ? [mine] : []; }
    // 'done': this order has completed, alongside the earlier contributions behind the holding
    const EARLIER = [{ fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:50000, date:'28 Mar 2025', kind:'done' }, { fund:'ICICI Prudential Pension Fund', tag:'COMPLETED', amt:50000, date:'14 Mar 2025', kind:'done' }];
    let L = st.variant==='transfer' ? TRANSFER_ORDERS(false) : st.variant==='transferDone' ? TRANSFER_ORDERS(true) : st.variant==='done' ? EARLIER : BASE_ORDERS.slice();
    if(mine) L = [mine, ...L];
    return L.map(o=>({...o}));
  };
  const listHtml = (m)=>{
    if(st.tab==='investments'){
      if(m.kind==='holdings') return `<div class="pf-list stg">${holdCard()}</div>`;
      return emptyBlock('You don’t have any<br>investments at the moment.', 'Start investing', 'data-start');
    }
    const L = ordersFor(m); el.__orders = L;
    if(!L.length) return emptyBlock('You don’t have any<br>orders at the moment.', 'Start investing', 'data-start');
    const show = L.slice(0, 7);
    return `<div class="pf-list stg">${show.map(orderCard).join('')}</div>${L.length>=7 && !st.variant ? `<div class="pf-va"><button class="btn outline" data-viewall>View all</button></div>` : ''}`;
  };
  const setFoot = (on, disabled)=>{
    foot.hidden = !on;
    foot.innerHTML = on ? `<button class="btn purple" data-more ${disabled?'disabled':''}>Invest more</button>` : '';
  };
  const render = ()=>{
    const m = mode();
    let html = '';
    if(m.kind==='zero'){
      html = `<div class="pf-zero">${emptyBlock('You don’t have any<br>investments at the moment', 'Start investing', 'data-start')}</div>`;
      setFoot(false);
    } else if(m.kind==='holdings'){
      html = `${m.nudge ? `<div class="pf-pad" style="padding-bottom:0">${nudge}</div>` : ''}<div class="pf-pad">${statCard()}${pranBox}</div>
        ${sectionHead(16)}${innerTabs(st.tab, 1)}<div id="pfList">${listHtml(m)}</div>`;
      setFoot(true, false);
    } else {
      const bk = m.kind==='created' ? 'created' : m.kind==='pran' ? 'pran' : 'failed';
      html = `${banner(bk)}${bk==='created' ? `<div class="pf-pad" style="padding-top:0">${pranBox}</div>` : ''}
        ${sectionHead(bk==='created'?4:0)}${innerTabs(st.tab, bk==='created' ? null : 1)}<div id="pfList">${listHtml(m)}</div>`;
      setFoot(true, bk!=='created');
    }
    body.innerHTML = html;
  };
  const skeleton = ()=>{
    setFoot(false);
    body.innerHTML = `<div class="pf-pad"><div class="pf-stat pf-sk">
        <div style="display:flex;justify-content:space-between"><span class="skel" style="width:78px;height:12px"></span><span class="skel" style="width:104px;height:12px"></span></div>
        <span class="skel" style="width:46px;height:24px;margin-top:6px"></span>
        <div style="display:flex;justify-content:space-between;margin-top:14px">${[0,1,2].map(()=>`<div style="display:flex;flex-direction:column;gap:12px"><span class="skel" style="width:42px;height:12px"></span><span class="skel" style="width:30px;height:12px"></span></div>`).join('')}</div></div>
      <div class="pf-pran"><span class="skel" style="width:96px;height:12px"></span></div><span class="skel" style="width:72px;height:12px;margin-top:4px"></span></div>
      <div class="pf-sh" style="margin-top:12px"><span class="pf-sht">Your portfolio</span></div>${innerTabs('investments')}
      <div class="pf-list"><div class="pf-card pf-skc"><span class="skel" style="width:32px;height:32px;border-radius:50%"></span>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px"><span class="skel" style="width:136px;height:12px"></span>
        <div style="display:flex;gap:72px"><div style="display:flex;flex-direction:column;gap:6px"><span class="skel" style="width:54px;height:10px"></span><span class="skel" style="width:14px;height:10px"></span></div><div style="display:flex;flex-direction:column;gap:6px"><span class="skel" style="width:36px;height:10px"></span><span class="skel" style="width:52px;height:10px"></span></div></div>
        <div style="display:flex;gap:72px"><span class="skel" style="width:36px;height:10px"></span><span class="skel" style="width:52px;height:10px"></span></div></div></div></div>`;
  };
  const failed = ()=>{
    setFoot(false);
    body.innerHTML = `<div class="pf-zero"><div class="pf-empty"><img src="${A}pf-load-error.png" width="150" height="150" alt=""><p>We couldn't catch the latest updates.<br>Give it another shot!</p><button class="pf-sbtn" data-retry>Retry</button></div></div>`;
  };
  const load = ()=>{
    const l = S.scn.load;
    if(l==='ok' || st.retried && l!=='loading'){ render(); return; }
    skeleton();
    later(()=>{ if(l==='fail' && !st.retried) failed(); else render(); }, 1200);
  };
  load();
  el.__refresh = ()=>{ st.retried = false; st.force = null; load(); };
  el.__render = render;

  const reRenderList = ()=>{ const y = $('#pfScroll', el).scrollTop; render(); $('#pfScroll', el).scrollTop = y; };
  el.addEventListener('click', e=>{
    const t = e.target;
    if(t.closest('[data-hub]')) return go('explore', 'replace');
    if(t.closest('[data-search]')) return toast('Search NPS funds');
    if(t.closest('[data-retry]')){ st.retried = true; skeleton(); later(render, 1200); return; }
    if(t.closest('[data-start]')) return go('explore', 'replace');
    const it = t.closest('[data-itab]'); if(it){ st.tab = it.dataset.itab; return reRenderList(); }
    if(t.closest('[data-pinfo]')) return valueSheet();
    if(t.closest('[data-tax]')) return taxSheet();
    if(t.closest('[data-hold]')) return fundSheet();
    if(t.closest('[data-viewall]')) return go('pfAllOrders', 'push');
    if(t.closest('[data-gethelp]')) return toast('Help & support');
    if(t.closest('[data-payretry]')) return go('buyAmount', 'push', {fund:(S.d.order||{}).fund || S.d.fund});
    const oc = t.closest('[data-ord]'); if(oc){ const o = (el.__orders||[])[+oc.dataset.ord]; if(o) orderSheet(o, ()=>{ if(o.mine) reRenderList(); else { const tg = $('.pf-tag', oc); if(tg) tg.outerHTML = tagHtml(o.tag); } }); return; }
  });
  foot.addEventListener('click', e=>{ const b = e.target.closest('[data-more]'); if(b && !b.disabled) go('buyAmount', 'push', {fund:S.d.fund}); });
};

/* ---------------- Sheets ---------------- */
// "Your portfolio value" (6739:347720)
function valueSheet(){
  sheet({cls:'pf-vsh', html:`<div class="pf-vs"><h3>Your portfolio value</h3><p>This is the cumulative value of your total investment done till date and the profit or loss over it.<br>It doesn’t include pending buy orders, sell orders &amp; wallet balance.</p></div>
    <div class="pf-vsf"><button class="btn purple" data-close>Done</button></div>`});
}

// Tax proof (15736:48048) + FY drop-down (15793:23720 loading → 15793:23739)
function taxSheet(){
  const s = sheet({cls:'pf-tsh', html:`<div class="pf-ts"></div>`});
  const draw = ()=>{
    $('.pf-ts', s.el).innerHTML = `<div class="pf-tsb"><h3>Get your NPS tax proof</h3><p class="pf-tsd">Download your NPS tax report to get tax exemption under section 80CCD (1B)</p>
      <div class="pf-tsl">Select financial year</div><button class="pf-fy" data-fy>${FYS[pf.fy]}<img src="${A}pf-chev-down-16.svg" width="16" height="16" alt=""></button>
      <div class="pf-tsl" style="margin-top:16px">Select download &amp; email format</div>
      ${[['pdf','PDF'],['xlsx','XLSX']].map(([k,l])=>`<button class="pf-rad" data-fmt="${k}"><img src="${A}${pf.fmt===k?'pf-radio-on-24.svg':'pf-radio-off-24.svg'}" width="24" height="24" alt="">${l}</button>`).join('')}</div>
      <div class="pf-tsf"><button class="btn purple" data-dl>Download</button></div>`;
  };
  draw();
  s.el.addEventListener('click', e=>{
    const f = e.target.closest('[data-fmt]'); if(f){ pf.fmt = f.dataset.fmt; return draw(); }
    if(e.target.closest('[data-fy]')) return fySheet(draw);
    const d = e.target.closest('[data-dl]'); if(d) loadingBtn(d, 1100, ()=>{ s.close(); toast(`Tax proof (${pf.fmt.toUpperCase()}) downloaded and sent to your email`); });
  });
}
function fySheet(onPick){
  const s = sheet({cls:'pf-fsh', html:`<div class="pf-fyh">Choose Financial Year</div><div class="pf-fyl"></div>`});
  const list = $('.pf-fyl', s.el);
  list.innerHTML = FYS.concat(FYS.slice(-2)).map(()=>`<div class="pf-rad pf-sk"><span class="skel" style="width:24px;height:24px;border-radius:50%"></span><span class="skel" style="width:120px;height:14px"></span></div>`).join('');
  later(()=>{
    list.innerHTML = FYS.map((y,i)=>`<button class="pf-rad" data-y="${i}"><img src="${A}${pf.fy===i?'pf-radio-on-24.svg':'pf-radio-off-24.svg'}" width="24" height="24" alt="">${y}</button>`).join('');
  }, 700);
  list.addEventListener('click', e=>{ const b = e.target.closest('[data-y]'); if(!b) return; pf.fy = +b.dataset.y; $$('[data-y] img', list).forEach((im,i)=>im.src = A+(i===pf.fy?'pf-radio-on-24.svg':'pf-radio-off-24.svg')); onPick(); setTimeout(()=>s.close(), 180); });
}

// Fund details bottom sheet (616:173683: Summary 13943:31361, Orders 13943:31541, Breakdown 13943:31523, Reports 13943:31532)
function fundSheet(){
  let tab = 'summary';
  const s = sheet({cls:'pf-fdsh', html:`<div class="pf-fdh"><span class="pf-lg40"><img src="${A}pf-logo-icici-red.png" alt=""></span><b>ICICI Prudential Pension Fund</b></div>
    <div class="tabs pf-fdt">${[['summary','Summary'],['orders','Orders'],['breakdown','Breakdown'],['reports','Reports']].map(([k,l])=>`<button class="tab" data-ft="${k}">${l}</button>`).join('')}</div>
    <div class="sh-scroll pf-fdb"></div>
    <div class="pf-fdf"><button class="btn outline" data-fund>View fund details</button></div>`});
  const bodyEl = $('.pf-fdb', s.el);
  const row = (l, v, cls='')=>`<div class="pf-r"><span>${l}</span><b class="${cls}">${v}</b></div>`;
  const C = {
    summary: ()=>`<div class="pf-sum">${row('Total P&amp;L','+₹14,260 (10.56%)','cg')}${row('Lumpsum maturity','₹1.2 Cr')}${row('Pension/month','₹24,000')}
      <div class="pf-r pf-r2"><div><span>Annualised rate of return</span><small>It’s the annual return earned by an investor over the investment holding period.</small></div><b class="cg">+11.8%</b></div>
      ${row('Plan type','Aggressive')}
      <div class="pf-alloc"><div class="pf-donut"><img src="${A}pf-donut-grey.svg" style="left:-1.31px;top:-1.31px;width:43.61px;height:43.61px" alt=""><img src="${A}pf-donut-100.svg" style="left:-1.31px;top:-1.31px;width:43.61px;height:43.61px" alt=""><img src="${A}pf-donut-75.svg" style="left:12.15px;top:-1.31px;width:30.15px;height:43.61px" alt=""><img src="${A}pf-donut-25.svg" style="left:20.5px;top:-1.31px;width:21.81px;height:24.36px" alt=""></div>
        <div class="pf-lg2"><div><p><span><img src="${A}pf-dot-eq.svg" width="8" height="8" alt="">Equity</span><b>75%</b></p><p><span><img src="${A}pf-dot-gov.svg" width="8" height="8" alt="">Govt bonds</span><b>10%</b></p></div>
        <div><p><span><img src="${A}pf-dot-corp.svg" width="8" height="8" alt="">Corp bonds</span><b>15%</b></p></div></div></div></div>`,
    orders: ()=>`<div class="pf-fo">${[['Transferred to','In progress'],['₹6,000','Completed']].map(([a,b])=>`<div class="pf-for"><div><b>${a}</b><span>16 Apr 2025</span></div><div style="text-align:right"><b class="cg">${b}</b><span>Units 37.00</span></div></div>`).join('')}</div>`,
    breakdown: ()=>`<div class="pf-bd">${[['E','1,820.24','75.00%','₹1,11,945'],['C','583.05','15.00%','₹22,389'],['G','446.89','10.00%','₹14,926']].map(([k,u,a,m])=>`<div class="pf-bdi"><b>ICICI Prudential Pension Fund Scheme ${k}</b><div class="pf-bdk"><div><span>Units</span>${u}</div><div><span>Allocation</span>${a}</div><div><span>Amount</span>${m}</div></div></div>`).join('')}</div>`,
    reports: ()=>`<div class="pf-rep">${[['Tax proof','Proof for tax declaration under Section 80CCD','tax'],['Holding statement','Statement of holding for NPS','hold'],['Voluntary contribution statement','Statement of voluntary contribution','vol']].map(([t,d,k])=>`<button class="pf-rp" data-rep="${k}"><div><b>${t}</b><span>${d}</span></div><img src="${A}pf-ic-open-24.svg" width="24" height="24" alt=""></button>`).join('')}</div>`,
  };
  const draw = ()=>{
    $$('[data-ft]', s.el).forEach(b=>b.classList.toggle('on', b.dataset.ft===tab));
    bodyEl.innerHTML = C[tab]();
  };
  // Fund details loading state (first frame of 616:173683) → content
  bodyEl.innerHTML = `<div class="pf-sum">${[0,1,2].map(()=>`<div class="pf-r"><span class="skel" style="width:40px;height:12px"></span><span class="skel" style="width:80px;height:12px"></span></div>`).join('')}</div>`;
  $$('[data-ft]', s.el).forEach(b=>b.classList.toggle('on', b.dataset.ft===tab));
  later(draw, 600);
  s.el.addEventListener('click', e=>{
    const f = e.target.closest('[data-ft]'); if(f){ tab = f.dataset.ft; return draw(); }
    const r = e.target.closest('[data-rep]'); if(r){ if(r.dataset.rep==='tax'){ s.close(); return taxSheet(); } return toast('Opening statement…'); }
    if(e.target.closest('[data-fund]')) return go('fund', 'push', {fund:'icici'});
  });
}

// Order detail sheet (2654:201956 — Master 3269:15357 / 3269:15818, Error 7648:16171, payment failed 8324:35477,
// cancel dialog 790:32855, cancelled 7662:16851, can't-cancel toast 8324:35189, order pending 8324:35190, transfer 8324:35626 / 8324:35968)
function ladderFor(o){
  const amt = '₹'+(o.amt||5000)+' in NPS fund', ts = fmtStamp(o.at || new Date(2022,0,21,10,9).getTime());
  const C = (t, sub, stamp=ts, extra='')=>({st:'done', t, sub, stamp, extra});
  switch(o.kind){
    case 'mine': return { tag:'PENDING', steps:[C('Order created',amt), C('Payment processed',null), {st:'cur', t:'Request sent to NPS fund'}, {st:'todo', t:'Units to be credited to portfolio'}], btns:['cancel','done'] };
    case 'pending': return { tag:'PENDING', steps:[C('Order created',amt), {st:'cur', t:'Payment processing'}, {st:'todo', t:'Request to be sent to NPS fund'}, {st:'todo', t:'Units to be credited to portfolio'}], btns:['cancel','done'] };
    case 'pay': return { tag:'PENDING', steps:[C('Order created',amt), {st:'todo', t:'Payment to be processed'}, {st:'todo', t:'Request to be sent to NPS fund'}, {st:'todo', t:'Units to be credited to portfolio'}], btns:['cancel','retrypay'] };
    case 'payfail': return { tag:'FAILED', steps:[C('Order created',amt), {st:'err', t:'Payment failed', sub:'Transaction failed due to timeout', learn:true, stamp:ts.replace(/(\d{4}) /,'$1, ')}], btns:['done2','again'] };
    case 'rejected': return { tag:'FAILED', steps:[{st:'err', t:'Order failed', sub:'Rejected due to incorrect profile details', learn:true, stamp:ts.replace(/(\d{4}) /,'$1, ')}], btns:['done2','again'] };
    case 'cancelled': return { tag:'CANCELLED', steps:[C('Order created',amt), {st:'err', t:'Order cancelled by you', stamp:ts}], btns:['done2','again'] };
    case 'done': return { tag:'COMPLETED', steps:[C('Order created',amt), C('Payment processed',null), C('Request processed by NPS fund',null), C('Units credited to portfolio',null,null)], btns:['doneOnly'] };
    case 'transfer': return { tag:'PENDING', steps:[C('Fund transfer requested to HDFC','₹1,49,260 transferred from ICICI Prudential Pension Fund'), C('Transfer processed',null), {st:'cur', t:'Units to be updated'}], btns:['cancel','done'] };
    case 'tdone': return { tag:'COMPLETED', steps:[C('Fund transfer requested to HDFC','₹1,49,260 transferred from ICICI Prudential Pension Fund'), C('Transfer processed',null), C('Units updated',null)], btns:['doneOnly'] };
  }
  return ladderFor({...o, kind:'pending'});
}
function orderSheet(o, onChange){
  const s = sheet({cls:'pf-osh', html:`<div class="pf-oc"></div>`});
  const box = $('.pf-oc', s.el);
  const draw = (L)=>{
    const n = L.steps.length;
    const ic = (st)=> st==='done' ? 'pf-check-circle-16.svg' : st==='cur' ? 'pf-radio-on-16.svg' : st==='err' ? 'pf-error-16.svg' : 'pf-radio-off-16.svg';
    const BTN = { cancel:`<button class="btn outline" data-ocancel>Cancel order</button>`, done:`<button class="btn purple" data-close>Done</button>`, done2:`<button class="btn outline" data-close>Done</button>`,
      again:`<button class="btn purple" data-again>Order again</button>`, retrypay:`<button class="btn purple" data-rpay>Retry payment</button>`, doneOnly:`<button class="btn purple" data-close>Done</button>` };
    box.innerHTML = `<div class="pf-oh"><div><b>${o.transfer ? 'ICICI Prudential Pension Fund' : o.fund}</b><span>ID: 3252352312345</span></div>${tagHtml(L.tag, true)}</div>
      <div class="pf-lad">${L.steps.map((x,i)=>{
        const next = L.steps[i+1];
        const lineIn = i===0 ? 'none' : (x.st==='done'||x.st==='cur'||x.st==='err') && L.steps[i-1].st==='done' ? 'g' : 'n';
        const lineOut = i===n-1 ? 'none' : x.st==='done' && next && next.st!=='todo' ? 'g' : 'n';
        return `<div class="pf-ls ${x.st}"><div class="pf-lp"><i class="pf-l1 ${lineIn}"></i><img src="${A}${ic(x.st)}" width="16" height="16" alt=""><i class="pf-l2 ${lineOut}"></i></div>
          <div class="pf-lt"><b>${x.t}</b>${x.sub?`<span>${x.sub}</span>`:''}${x.learn?`<button class="pf-learn" data-learn>Learn more</button>`:''}${x.stamp && x.st!=='todo' && x.st!=='cur' ? `<small>${x.stamp}</small>`:''}</div></div>`;
      }).join('')}</div>
      <div class="pf-of">${L.btns.map(b=>BTN[b]).join('')}</div>`;
  };
  const L0 = ladderFor(o);
  // Order ladder loading state (8336:37078)
  box.innerHTML = `<div class="pf-oh"><div><span class="skel" style="width:166px;height:14px"></span><span class="skel" style="width:90px;height:10px;margin-top:8px"></span></div></div>
    <div class="pf-lad">${[0,1,2].map(()=>`<div class="pf-ls"><div class="pf-lp"><i class="pf-l1 none"></i><span class="skel" style="width:12px;height:12px;border-radius:50%;margin:2px"></span><i class="pf-l2 n"></i></div><div class="pf-lt" style="gap:8px"><span class="skel" style="width:120px;height:12px"></span><span class="skel" style="width:70px;height:10px"></span></div></div>`).join('')}</div>
    <div class="pf-of"><button class="btn outline" disabled>Cancel order</button><button class="btn purple" disabled>Done</button></div>`;
  later(()=>draw(L0), 500);
  s.el.addEventListener('click', e=>{
    const t = e.target;
    if(t.closest('[data-learn]')) return toast('Opens help article');
    if(t.closest('[data-again]')){ s.close(); return go('buyAmount', 'push', {fund: o.mine ? (S.d.order||{}).fund : S.d.fund}); }
    if(t.closest('[data-rpay]')){ s.close(); return go('buyAmount', 'push', {fund:S.d.fund}); }
    if(t.closest('[data-ocancel]')){
      if(o.kind==='mine' || o.kind==='transfer'){ return toast('Order can’t be cancelled as it’s already under progress'); }
      const fname = o.transfer ? 'ICICI Prudential Pension Fund' : o.fund;
      const d = sheet({cls:'pf-dsh', html:`<div class="pf-dg"><img src="${A}pf-danger-56.svg" width="56" height="56" alt=""><h3>Cancel order</h3><p>Are you sure you want to cancel this order for ${fname}?</p></div>
        <div class="pf-of"><button class="btn pf-red" data-yes>Cancel</button><button class="btn outline" data-close>Back</button></div>`});
      d.el.addEventListener('click', ev=>{ const y = ev.target.closest('[data-yes]'); if(!y) return;
        loadingBtn(y, 700, ()=>{ d.close(); o.kind = 'cancelled'; o.tag = 'CANCELLED'; if(o.mine) pf.cancelled = true; draw(ladderFor(o)); onChange && onChange(); }); });
    }
  });
}

/* ---------------- View all orders (4415:205532: loading 4415:204882, pending 4415:204867, closed 4415:206213) ---------------- */
SCREENS.pfAllOrders = (el, p={})=>{
  const st = { tab: p.tab || 'pending', closedN: ALL_CLOSED.length, sortDesc:true };
  el.innerHTML = `<div class="topbar"><div class="l">${I.back()}<span class="b1">Order history</span></div><div class="r"><button class="icon-btn" data-help aria-label="Help"><img src="${A}pf-ic-support-fill.svg" width="24" height="24" alt=""></button></div></div>
    <div class="tabs"><button class="tab" data-at="pending">Pending orders</button><button class="tab" data-at="closed">Closed orders</button></div>
    <div class="scroll" id="pfAo"></div>`;
  wireCommon(el);
  const sc = $('#pfAo', el);
  const lists = ()=>{
    const mine = myOrder();
    const pend = ALL_PENDING.map(o=>({...o})), closed = [];
    if(mine){ (/PENDING/.test(mine.tag) ? pend : closed).unshift(mine); }
    for(let i=0;i<st.closedN;i++) closed.push({...ALL_CLOSED[i % ALL_CLOSED.length]});
    return { pending:pend, closed };
  };
  const filterRow = (n)=>`<div class="pf-filt"><span>${n>=st.closedN && st.tab==='closed' ? 14 + (st.closedN - ALL_CLOSED.length) : 14} orders</span><button class="pf-sort" data-sort>Sorted by date<img src="${A}pf-chev-down-16.svg" width="16" height="16" alt=""></button></div>`;
  const draw = ()=>{
    $$('[data-at]', el).forEach(b=>b.classList.toggle('on', b.dataset.at===st.tab));
    const L = lists()[st.tab]; el.__orders = L;
    const shown = st.sortDesc ? L : L.slice().reverse();
    sc.innerHTML = `${filterRow(L.length)}<div class="pf-list pf-al stg">${shown.map((o)=>orderCard(o, L.indexOf(o))).join('')}</div>
      ${st.tab==='closed' ? `<div class="pf-va" style="padding-top:8px"><button class="btn outline" data-load10>Load 10 more</button></div>` : ''}`;
  };
  const skeleton = ()=>{
    $$('[data-at]', el).forEach(b=>b.classList.toggle('on', b.dataset.at===st.tab));
    sc.innerHTML = `<div class="pf-filt"><span class="skel" style="width:64px;height:12px"></span><span class="pf-sort" style="color:var(--ui4)">Sorted by date<img src="${A}pf-chev-down-16.svg" width="16" height="16" style="opacity:.3" alt=""></span></div>
      <div class="pf-list pf-al">${[0,1,2].map(()=>`<div class="pf-skc2"><div style="display:flex;gap:12px;align-items:center"><span class="skel" style="width:32px;height:32px;border-radius:50%"></span><div style="display:flex;flex-direction:column;gap:6px"><span class="skel" style="width:136px;height:12px"></span><span class="skel" style="width:72px;height:12px"></span></div></div><div style="display:flex;justify-content:space-between;margin-top:16px"><div style="display:flex;flex-direction:column;gap:6px"><span class="skel" style="width:86px;height:10px"></span><span class="skel" style="width:86px;height:10px"></span></div><div style="display:flex;flex-direction:column;gap:6px"><span class="skel" style="width:86px;height:10px"></span><span class="skel" style="width:86px;height:10px"></span></div></div></div>`).join('')}</div>`;
  };
  skeleton(); later(draw, 900);
  el.__refresh = draw;
  el.addEventListener('click', e=>{
    const t = e.target;
    const tb = t.closest('[data-at]'); if(tb){ st.tab = tb.dataset.at; return draw(); }
    if(t.closest('[data-sort]')){ st.sortDesc = !st.sortDesc; toast(st.sortDesc ? 'Sorted by date · newest first' : 'Sorted by date · oldest first'); return draw(); }
    const lm = t.closest('[data-load10]'); if(lm) return loadingBtn(lm, 700, ()=>{ const y = sc.scrollTop; st.closedN += 10; draw(); sc.scrollTop = y; });
    const oc = t.closest('[data-ord]'); if(oc){ const o = (el.__orders||[])[+oc.dataset.ord]; if(o) orderSheet(o, ()=>{ if(o.mine) draw(); else { const tg = $('.pf-tag', oc); if(tg) tg.outerHTML = tagHtml(o.tag); } }); }
  });
};

/* ---------------- jumps ---------------- */
const fresh = ()=>{ pf.cancelled = false; };
jump('pfZero', 'Portfolio (zero)', 'portfolio', ()=>{ fresh(); S.d.order = null; resetTo(['more'], 'portfolio', {force:'zero'}); });
jump('pfInvest', 'Portfolio (investments)', 'portfolio', ()=>{ fresh(); S.d.order = null; resetTo(['more'], 'portfolio', {force:'holdings', tab:'investments'}); });
jump('pfOrders', 'Portfolio · orders', 'portfolio', ()=>{ fresh(); S.d.order = null; resetTo(['more'], 'portfolio', {force:'holdings', tab:'orders'}); });
jump('pfTransfer', 'Orders · transfer', 'portfolio', ()=>{ fresh(); S.d.order = null; resetTo(['more'], 'portfolio', {force:'holdings', tab:'orders', variant:'transfer'}); });
jump('pfJustOrdered', 'Portfolio · just invested', 'portfolio', ()=>{ fresh(); S.d.order = { fund:S.d.fund||'icici', amount:S.d.amount||50000, plan:S.d.plan, status:S.scn.pay, at:Date.now() }; resetTo(['more','explore'], 'portfolio', {tab:'orders'}); });
jump('pfOrderDone', 'Portfolio · order completed', 'portfolio', ()=>{ fresh(); S.d.order = { fund:'icici', amount:35000, plan:S.d.plan, status:'done', at:Date.now() }; resetTo(['more','explore'], 'portfolio', {force:'holdings', tab:'orders', variant:'done'}); });
jump('pfAllOrders', 'All orders', 'portfolio', ()=>{ fresh(); resetTo(['more', {id:'portfolio', p:{force:'holdings', tab:'orders'}}], 'pfAllOrders'); });
})();
