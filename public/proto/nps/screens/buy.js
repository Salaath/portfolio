/* Buy — Figma NPS › Buy/Sell (546:136235) › "Buy Flow | New User" 6023:13823
   Order form: 6023:13957 (loading) · 6023:14565 (empty) · 6023:14535 (error) · 12107:205735 / 12107:205704 / 12107:205766
   Friction sheet 7133:5217 · Married → personal details 13770:8164 · Nominee 9552:243687 / 9597:254582, relationship 9309:7661, DOB 9331:211807
   Review (revised) 15160:51951 / 15160:51841 / 15160:52043 · T&C 12047:96552
   Payment 6023:14362 (timer) · 6023:14380 / 6023:14401 / 6023:14461 (UPI app placeholders)
   Order status 6815:24975 · 6023:14206 · 9373:8062 · 9001:38671 · 9011:5667 / 9011:5841 */
(function(){
const { $, $$, h, A, inr, inrShort, PLANS, fundById, S, SCREENS, go, navBack, resetTo, later, sheet, infoSheet, toast, wireCommon, loadingBtn, I, jump } = P;

const MIN = 1000, MAX = 9999999, TAX_CAP = 50000;
const fundName = ()=>fundById(S.d.fund).name;
const planName = ()=>(PLANS[S.d.plan] || PLANS.aggressive).name + ' plan';
const amt = ()=>S.d.amount || 0;
const FEES = 507;                       // Figma review: ₹50,000 → total ₹50,507.40 (platform 400 + processing 30 + GST 77.40)
const total = ()=> inr(amt()+FEES)+'.40';
const esc = (s)=>String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const kbPad = (el)=>({ onFocus:()=>el.classList.add('by-kb'), onBlur:()=>el.classList.remove('by-kb') });
const topbar = (title, help=true, back=I.back())=>`<div class="topbar">
  <div class="l">${back}<span class="b1">${title}</span></div><div class="r">${help?I.help:''}</div></div>`;
const STACK = ()=>['home','explore',{id:'fund', p:{fund:S.d.fund}}];

/* what comes after the order form / personal details */
function nextAfterAmount(){
  if(S.scn.married && !S.d.byPersonal) return 'byPersonal';
  return nextAfterPersonal();
}
function nextAfterPersonal(){ return hasNominee() ? 'byReview' : 'byNominee'; }
const hasNominee = ()=>S.scn.nominee ? !S.d.byNomineeDeleted : !!S.d.nominee;

/* ===================== 1. Order form ===================== */
SCREENS.buyAmount = (el, p={})=>{
  if(p.fund) S.d.fund = p.fund;
  const render = ()=>{
    if(S.scn.load==='loading' && !el.__loaded){ el.innerHTML = skeleton(); el.__loaded = true; later(render, 1200); return; }
    if(S.scn.load==='fail' && !el.__retried){ el.innerHTML = failed(); return; }
    form();
  };
  const skeleton = ()=>`<div class="topbar"><div class="l"><img src="${A}ic-arrow-left-dark.svg" width="24" height="24" alt="" style="opacity:.3"><span class="b1 c3 by-ell">${fundName()}</span></div>${I.help}</div>
    <div class="by-skel">
      <i class="skel" style="width:120px;height:16px;margin:40px auto 0"></i>
      <i class="skel" style="width:160px;height:40px;margin:16px auto 0"></i>
      <i class="skel" style="width:110px;height:12px;margin:12px auto 0"></i>
      <div class="by-skel-chips">${'<i class="skel"></i>'.repeat(4)}</div>
    </div>
    <div class="foot" style="margin-top:auto"><button class="btn purple" disabled>Continue</button></div>`;
  const failed = ()=>`${topbar(fundName())}
    <div class="by-fail">
      <img src="${A}by-info-56.svg" width="56" height="56" alt="">
      <div class="h3">Couldn’t load this page</div>
      <p class="b2 c2">Something went wrong while fetching the order details. Please try again.</p>
      <button class="btn purple" id="retry" style="width:auto;padding:0 32px">Retry</button>
    </div>`;
  const form = ()=>{
    el.innerHTML = `<div class="topbar by-ofbar">
        <div class="l"><button class="icon-btn" id="bk" aria-label="Back"><img src="${A}ic-arrow-left-dark.svg" width="24" height="24" alt=""></button>
          <div class="by-tt"><span class="b1 by-ell">${fundName()}</span><button class="by-plan" id="plan">${planName()}<img src="${A}by-chevron-down-16-purple.svg" width="16" height="16" alt=""></button></div></div>
        <div class="r">${I.help}</div></div>
      <div class="scroll" id="body">
        <div class="by-amt stg">
          <div class="h3">Enter amount to invest</div>
          <div class="by-afld" data-field><span class="by-fi" id="av"></span></div>
          <div class="meta c2 by-help" id="help">Min. investment: ₹1,000</div>
          <div class="by-chips">${[5000,1000,500,100].map(n=>`<button class="chip" data-add="${n}">+${n.toLocaleString('en-IN')}</button>`).join('')}</div>
        </div>
        <div id="bn"></div>
        <div id="mat"></div>
      </div>
      <div class="foot by-foot"><button class="btn purple" id="go">Continue</button></div>`;
    const update = (v)=>{
      const n = parseInt(v||'0', 10) || 0;
      const err = v && n < MIN ? 'Min. investment amount should be ₹1,000' : '';
      const help = $('#help', el); help.textContent = err || 'Min. investment: ₹1,000'; help.classList.toggle('by-err', !!err);
      $('.by-afld', el).classList.toggle('empty', !v);
      const ok = n >= MIN;
      $('#go', el).disabled = !ok;
      S.d.amount = n;
      const save = Math.round(Math.min(n, TAX_CAP) * 0.312);
      $('#bn', el).innerHTML = !ok ? '' : n >= TAX_CAP
        ? `<div class="by-banner ok"><img src="${A}by-check-selected-16.svg" width="16" height="16" alt=""><p>Yay! You’re saving ${inr(save)} in taxes under 80CCD</p></div>`
        : `<div class="by-banner"><img src="${A}by-money-bag-16.svg" width="16" height="16" alt=""><p>Invest <b>${Math.ceil((TAX_CAP-n)/1000)}k more</b> to get full tax exemption under 80CCD in FY 23-24</p></div>`;
      const k = n / 50000;
      $('#mat', el).innerHTML = ok
        ? `<div class="by-mat"><div><span>Total on maturity</span><b class="cg">${inrShort(9.2e7*k)}</b></div><div><span>Lumpsum</span><em>${inrShort(1.28e7*k)}</em></div><div><span>Pension/month</span><em>${inr(40000*k)}</em></div></div>`
        : `<div class="by-acc"><span>Enter amount to see charges</span><img src="${A}ic-chevron-down-24.svg" width="24" height="24" alt="" style="opacity:.35"></div>`;
    };
    const fi = FI.create($('#av', el), { kb:'num', max:7, value: S.d.amount ? String(S.d.amount) : '', allow:(c,v)=>/\d/.test(c) && !(c==='0' && !v),
      onChange:update, onSubmit:()=>{ FI.blur(); }, ...kbPad(el) });
    el.__fi = fi;
    update(fi.value);
    // amount renders with Indian grouping
    const fmt = ()=>{ const s = $('#av', el); const raw = fi.value;
      const txt = raw ? '₹' + Number(raw).toLocaleString('en-IN') : '₹0';
      const caret = s.querySelector('.caret');
      s.innerHTML = `<span class="v">${txt}</span>` + (caret ? '<span class="caret"></span>' : '');
    };
    const _render = fi.render.bind(fi); fi.render = ()=>{ _render(); fmt(); }; fi.render();
    later(()=>fi.focus(), 380);
    $('#body', el).addEventListener('click', e=>{
      const a = e.target.closest('[data-add]');
      if(a){ fi.setValue(String(Math.min(MAX, (parseInt(fi.value||'0',10)||0) + +a.dataset.add))); return; }
      if(FI.active===fi && !e.target.closest('[data-field]')) FI.blur();
    });
    $('#plan', el).addEventListener('click', ()=>{ FI.blur(); if(P.openPlans) P.openPlans({onDone:()=>{ const t=$('#plan', el); t && (t.innerHTML = `${planName()}<img src="${A}by-chevron-down-16-purple.svg" width="16" height="16" alt="">`); }}); else toast('Plans'); });
    $('#bk', el).addEventListener('click', ()=>{ FI.blur(); friction(); });
    $('#go', el).addEventListener('click', ()=>{ FI.blur(); loadingBtn($('#go', el), 700, ()=>go(nextAfterAmount())); });
    el.__refresh = null;
  };
  el.innerHTML = ''; wireCommon(el);
  el.addEventListener('click', e=>{ if(e.target.closest('#retry')){ el.__retried = true; loadingBtn(e.target.closest('#retry'), 900, render); } });
  render();
  el.__refresh = ()=>{ if(!$('#av', el)){ el.__loaded = false; el.__retried = false; render(); } };
};

/* Friction bottom sheet — 7133:5217 */
function friction(){
  const sh = sheet({cls:'by-fric', html:`<div class="by-fric-b"><img src="${A}by-info-56.svg" width="56" height="56" alt="">
      <div class="h2">Cancel this order?</div>
      <p class="b1 c2">You're almost there! If you cancel now, you'll miss saving up to ₹15,600 in taxes.</p></div>
    <div class="sh-foot by-two"><button class="btn outline by-sec" id="cx">Cancel order</button><button class="btn purple" data-close>Continue</button></div>`});
  $('#cx', sh.el).addEventListener('click', ()=>{ sh.close(); later(navBack, 10); });
}

/* ===================== 2. Married → personal details — 13770:8164 ===================== */
SCREENS.byPersonal = (el)=>{
  el.innerHTML = `${topbar('Add your details', false)}
    <div class="scroll" id="body"><div class="by-pad stg">
      <div><div class="by-h18">Please add the following details</div><div class="b2 c2" style="font-weight:400">These details are mandatory for NPS</div></div>
      <div class="h3 c3" style="margin-top:8px">Your personal details</div>
      <label class="by-lab"><b>Father’s name</b><div class="by-tf" data-field><span class="by-fi" id="fa"></span></div></label>
      <label class="by-lab"><b>Spouse name</b><div class="by-tf" data-field><span class="by-fi" id="sp"></span></div></label>
    </div></div>
    <div class="foot"><button class="btn purple" id="go" disabled>Continue</button></div>`;
  wireCommon(el);
  const d = S.d.byPers || (S.d.byPers = {father:'', spouse:''});
  const chk = ()=>{ $('#go', el).disabled = !(d.father.trim() && d.spouse.trim()); };
  const opt = (k, next)=>({ kb:'alpha', go:false, max:40, value:d[k], allow:c=>/[a-zA-Z .]/.test(c), onChange:v=>{ d[k]=v; chk(); }, onSubmit:next, ...kbPad(el) });
  const f2 = FI.create($('#sp', el), opt('spouse', ()=>FI.blur()));
  const f1 = FI.create($('#fa', el), opt('father', ()=>f2.focus()));
  chk(); later(()=>f1.focus(), 380);
  $('#body', el).addEventListener('click', e=>{ if(FI.active && !e.target.closest('[data-field]')) FI.blur(); });
  $('#go', el).addEventListener('click', ()=>{ FI.blur(); loadingBtn($('#go', el), 700, ()=>{ S.d.byPersonal = true; go(nextAfterPersonal()); }); });
};

/* ===================== 3. Nominee details — 9597:254582 / 9552:243687 ===================== */
const RELS = ['Wife','Husband','Son','Daughter','Dependent father','Dependent mother','Brother','Sister','Husband’s dependent father','Husband’s dependent mother','Daughter-in-law','Deceased son’s child','Deceased son’s widow','Others'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const ageOf = (dt)=>{ const n = new Date(); let a = n.getFullYear()-dt.getFullYear(); if(n < new Date(n.getFullYear(), dt.getMonth(), dt.getDate())) a--; return a; };
const dmy = (dt)=>`${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;

SCREENS.byNominee = (el)=>{
  const n = S.d.byNomDraft || (S.d.byNomDraft = { first:'', last:'', dob:null, rel:'', guardian:'', same:true, ...(S.d.nominee||{}) });
  el.innerHTML = `${topbar('Nominee details', false)}
    <div class="scroll" id="body"><div class="by-nom stg">
      <div class="h2 c3">Your nominee details</div>
      <p class="b2">Verify the entered details. Added nominee can't be removed later.</p>
      <div class="h3" style="margin-top:8px">Nominee 1 details</div>
      <label class="by-lab"><b>First name</b><div class="by-tf" data-field><span class="by-fi" id="nf"></span></div></label>
      <label class="by-lab"><b>Last name</b><div class="by-tf" data-field><span class="by-fi" id="nl"></span></div></label>
      <div class="by-lab"><b>Date of birth</b><button class="by-tf by-dob" id="dob"><span id="dobv"></span><img src="${A}by-calendar-24.svg" width="24" height="24" alt=""></button></div>
      <div class="by-lab" id="gw" hidden><b>Guardian’s full name</b><div class="by-tf" data-field><span class="by-fi" id="ng"></span></div><span class="meta c2" style="font-weight:400">Nominee is a minor, so a guardian is required</span></div>
      <div class="by-lab"><b>Relationship</b><button class="by-rel" id="rel"><span id="relv"></span><img src="${A}by-chevron-down-16.svg" width="16" height="16" alt=""></button></div>
      <button class="by-same" id="same"><img id="samei" width="24" height="24" alt=""><span>Nominee address is the same as my address</span></button>
    </div></div>
    <div class="foot"><button class="btn purple" id="go" disabled>Continue</button></div>`;
  wireCommon(el);
  const minor = ()=>n.dob && ageOf(n.dob) < 18;
  const chk = ()=>{
    $('#dobv', el).textContent = n.dob ? dmy(n.dob) : 'DD/MM/YYYY'; $('#dobv', el).classList.toggle('c3', !n.dob);
    $('#relv', el).textContent = n.rel || 'Select';
    $('#samei', el).src = A + (n.same ? 'by-checkbox-nominee-on.svg' : 'by-checkbox-off.svg');
    $('#gw', el).hidden = !minor();
    $('#go', el).disabled = !(n.first.trim() && n.last.trim() && n.dob && n.rel && (!minor() || n.guardian.trim()));
  };
  const opt = (k, next)=>({ kb:'alpha', go:false, max:30, value:n[k], allow:c=>/[a-zA-Z .]/.test(c), onChange:v=>{ n[k]=v; chk(); }, onSubmit:next, ...kbPad(el) });
  const fl = FI.create($('#nl', el), opt('last', ()=>{ FI.blur(); openDate(); }));
  const ff = FI.create($('#nf', el), opt('first', ()=>fl.focus()));
  FI.create($('#ng', el), opt('guardian', ()=>FI.blur()));
  chk();
  if(!n.first) later(()=>ff.focus(), 380);
  $('#body', el).addEventListener('click', e=>{ if(FI.active && !e.target.closest('[data-field]')) FI.blur(); });
  const openDate = ()=>datePicker(el, n.dob || new Date(1987, 6, 23), dt=>{ n.dob = dt; chk(); });
  $('#dob', el).addEventListener('click', ()=>{ FI.blur(); openDate(); });
  $('#rel', el).addEventListener('click', ()=>{ FI.blur(); relSheet(n.rel, r=>{ n.rel = r; chk(); }); });
  $('#same', el).addEventListener('click', ()=>{ n.same = !n.same; chk(); });
  $('#go', el).addEventListener('click', ()=>{ FI.blur(); loadingBtn($('#go', el), 1000, ()=>{
    S.d.nominee = { ...n }; S.d.byNomineeDeleted = false;
    const back = P.hist.length > 1 && P.hist[P.hist.length-2].id === 'byReview';
    if(back) navBack(); else go('byReview');
  }); });
};

/* Relationship sheet — 9309:7661 */
function relSheet(cur, done){
  const sh = sheet({cls:'by-relsh', html:`<div class="sh-scroll by-rels">${RELS.map(r=>`<button data-r="${esc(r)}"><img src="${A}${r===cur?'by-radio-on-20.svg':'by-radio-off-20.svg'}" width="20" height="20" alt=""><span>${r}</span></button>`).join('')}</div>`});
  sh.el.addEventListener('click', e=>{ const b = e.target.closest('[data-r]'); if(!b) return;
    $$('[data-r] img', sh.el).forEach(i=>i.src = A + 'by-radio-off-20.svg'); $('img', b).src = A + 'by-radio-on-20.svg';
    done(b.dataset.r); later(()=>sh.close(), 220); });
}

/* Material date picker — 9331:211807 */
function datePicker(el, init, done){
  let sel = new Date(init), view = new Date(sel.getFullYear(), sel.getMonth(), 1);
  const today = new Date();
  const dlg = h(`<div class="by-dp-wrap"><div class="by-dp">
      <div class="by-dp-hd"><button class="by-dp-y" id="yr"></button><div class="by-dp-d" id="dd"></div></div>
      <div class="by-dp-nav"><button id="pm" aria-label="Previous month"><img src="${A}ic-chevron-right-24.svg" width="24" height="24" alt="" style="transform:scaleX(-1)"></button><b id="ml"></b><button id="nm" aria-label="Next month"><img src="${A}ic-chevron-right-24.svg" width="24" height="24" alt=""></button></div>
      <div class="by-dp-g" id="g"></div>
      <div class="by-dp-ft"><button id="cn">CANCEL</button><button id="ok">OK</button></div>
    </div></div>`);
  el.appendChild(dlg);
  requestAnimationFrame(()=>dlg.classList.add('on'));
  const draw = ()=>{
    $('#yr', dlg).textContent = sel.getFullYear();
    $('#dd', dlg).textContent = `${DAYS[sel.getDay()]}, ${MONTHS[sel.getMonth()].slice(0,3)} ${sel.getDate()}`;
    $('#ml', dlg).textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const first = view.getDay(), nd = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
    let html = 'SMTWTFS'.split('').map(d=>`<span class="w">${d}</span>`).join('') + '<span></span>'.repeat(first);
    for(let d=1; d<=nd; d++){
      const dt = new Date(view.getFullYear(), view.getMonth(), d);
      const isSel = dt.toDateString()===sel.toDateString(), isT = dt.toDateString()===today.toDateString(), fut = dt > today;
      html += `<button data-d="${d}" class="${isSel?'sel':''} ${isT?'td':''}" ${fut?'disabled':''}>${d}</button>`;
    }
    $('#g', dlg).innerHTML = html;
  };
  draw();
  const close = ()=>{ dlg.classList.remove('on'); setTimeout(()=>dlg.remove(), 250); };
  dlg.addEventListener('click', e=>{
    const t = e.target;
    if(t===dlg) return close();
    const d = t.closest('[data-d]'); if(d){ sel = new Date(view.getFullYear(), view.getMonth(), +d.dataset.d); draw(); return; }
    if(t.closest('#pm')){ view.setMonth(view.getMonth()-1); draw(); }
    else if(t.closest('#nm')){ view.setMonth(view.getMonth()+1); draw(); }
    else if(t.closest('#yr')){ view.setFullYear(view.getFullYear()-10); sel.setFullYear(sel.getFullYear()-10); draw(); }
    else if(t.closest('#cn')) close();
    else if(t.closest('#ok')){ done(new Date(sel)); close(); }
  });
}

/* ===================== 4. Review — 15160:51951 (collapsed) / 15160:51841 (open) / 15160:52043 (no nominee) ===================== */
const navDate = ()=>{ const d = new Date(); d.setDate(d.getDate()+1); if(d.getDay()===0) d.setDate(d.getDate()+1); if(d.getDay()===6) d.setDate(d.getDate()+2);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`; };

SCREENS.byReview = (el)=>{
  const st = el.__st || (el.__st = { open:false });
  const render = ()=>{
    const nom = hasNominee();
    el.innerHTML = `${topbar('Review your plan')}
      <div class="scroll"><div class="by-rv stg">
        <div class="by-rv-hd"><div class="h3 c2">I want to</div><div class="h2 cg">invest ${inr(amt())} in NPS</div></div>
        <div class="by-rows">
          <div class="by-row"><span>Total amount</span><em>${total()}</em></div>
          <div class="by-row"><span>Expected delivery<button class="by-lm" id="lm">Learn more<img src="${A}by-arrow-right-8.svg" width="8" height="8" alt=""></button></span><em>2-3 working days</em></div>
          <div class="by-row"><span>Applicable NAV date</span><em>${navDate()}</em></div>
          <div class="by-row"><span>Nominee</span><button class="by-link" id="nom">${nom?'Edit nominees':'Add nominee'}</button></div>
          <button class="by-row by-accrow" id="acc"><span>View tax &amp; charges</span><img src="${A}${st.open?'by-chevron-up-24.svg':'by-chevron-down-24.svg'}" width="24" height="24" alt=""></button>
          <div class="by-fees ${st.open?'on':''}"><div><span>GST</span><em>₹77.40</em></div><div><span>Platform Fees for NPS (One-time)</span><em>₹400.00</em></div><div><span>Transaction Processing Fees</span><em>₹30.00</em></div></div>
        </div>
      </div></div>
      <div class="by-rv-ft">
        <div class="by-toast" id="tst"><img src="${A}by-warning-16.svg" width="16" height="16" alt=""><span>Add a nominee to proceed</span></div>
        ${consentBlock()}
        <div class="by-rv-btn"><button class="btn" id="go" ${S.d.byConsent?'':'disabled'}>Continue to invest</button></div>
      </div>`;
    wireConsent(el, ()=>render());
    $('#lm', el).addEventListener('click', ()=>infoSheet('Expected delivery', [['', 'Your contribution is credited to your PRAN account and units are allotted at the applicable NAV, usually within 2-3 working days after payment is confirmed.']]));
    $('#nom', el).addEventListener('click', ()=>go('byNominee'));
    $('#acc', el).addEventListener('click', ()=>{ st.open = !st.open; $('.by-fees', el).classList.toggle('on', st.open); $('#acc img', el).src = A + (st.open?'by-chevron-up-24.svg':'by-chevron-down-24.svg'); });
    $('#go', el).addEventListener('click', ()=>{
      if(!hasNominee()){ const t = $('#tst', el); t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(()=>t.classList.remove('on'), 2400); return; }
      loadingBtn($('#go', el), 900, ()=>go('byPayTimer'));
    });
  };
  wireCommon(el); render();
  el.__refresh = render;
};
const consentBlock = ()=>`<div class="by-consent"><button class="by-cb" id="cb" aria-label="Consent"><img src="${A}${S.d.byConsent?'by-checkbox-on.svg':'by-checkbox-off.svg'}" width="24" height="24" alt=""></button>
  <div class="meta c2"><p>I consent to share my PAN, DOB, Father’s name, nominee &amp; other bank details with CAMs for PRAN generation. <button class="by-a" id="vd">View details</button></p>
  <p>I also agree to NPS <button class="by-a" id="tnc">Terms &amp; conditions</button></p></div></div>`;
function wireConsent(el, rerender){
  $('#cb', el).addEventListener('click', ()=>{ S.d.byConsent = !S.d.byConsent; $('#cb img', el).src = A + (S.d.byConsent?'by-checkbox-on.svg':'by-checkbox-off.svg'); $('#go', el).disabled = !S.d.byConsent; });
  $('#vd', el).addEventListener('click', ()=>infoSheet('Data shared with CAMS', [['Why we share this', 'CAMS (Central Recordkeeping Agency) needs your PAN, date of birth, father’s name, nominee and bank details to generate your Permanent Retirement Account Number (PRAN).'],['Is it safe?', 'Your data is shared over an encrypted channel and used only for opening and servicing your NPS account.']]));
  const t = $('#tnc', el); t && t.addEventListener('click', ()=>go('byTnc'));
}

/* Terms & Conditions — 12047:96552 */
const TNC = ['Only new NPS investors can open the account','The applicant should be between 18 - 65 years of age as on the date of submission of his/her application to the Point of Presence Point.','The applicant should comply with the Know Your Customer ("KYC") norms by completing the subscriber registration application form and provide all the required documents/information.','The applicant is required to open a demat account with Upstox Securities Private Limited and agrees to share this for opening NPS account with RKSV Commodities India Private Limited.','After the account is opened, CRA shall send all the details to the subscriber including a unique Permanent Retirement Account Number ("PRAN") Card and the complete information provided by the subscriber in the subscriber registration form.','Investments in selected NPS schemes will be subject to completion of all formalities like KYC, etc and submission of required documents/information.','If the subscriber does not make the minimum annual contribution, the account will be frozen. Further transactions will be done only when the account is reactivated by making the minimum contribution and applicable penalty charges.','User agrees that if any contribution is made after business hours/on non-business and national/bank holidays, then the request shall be taken up during the next business day','The Subscriber can claim the tax benefits only upon successful allocation of the units.','User understand that the quantum of Tax benefits mentioned are as per the existing Income Tax rebate rates mentioned in the latest Union Budget.'];
const DECL = ['I confirm that I am eligible to invest in the schemes of NPS.','I have read and understood the features of the pension schemes fully','I understand that investment in NPS is subject to completion of KYC and realizations of payment by NPS Trust or any additional information required by PoP/CRA/PFRDA.','I confirm that the investments made do not contravene any applicable Laws.','I understand that the tax benefit will be available to me only upon confirmation of allotment of units and not immediately upon debit of funds from the bank.','I understand that NPS Trust has the right to peruse my financial profile or share the information, with other government authorities.','I further agree that NPS Trust has the right to close my PRAN in case I am found violating the provisions of any law relating to prevention of money laundering.'];
SCREENS.byTnc = (el)=>{
  el.innerHTML = `${topbar('T&amp;C', false)}
    <div class="scroll"><div class="by-tnc">
      <div class="h2">Terms and Conditions</div><ol>${TNC.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>
      <div class="h2">User Declaration</div><ul>${DECL.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
    </div></div>
    <div class="by-rv-ft">${consentBlock().replace(/I also agree to NPS <button class="by-a" id="tnc">Terms &amp; conditions<\/button>/, 'I also agree to NPS Terms &amp; conditions.')}
      <div class="by-rv-btn"><button class="btn" id="go" ${S.d.byConsent?'':'disabled'}>Continue to invest</button></div></div>`;
  wireCommon(el); wireConsent(el);
  $('#go', el).addEventListener('click', ()=>{
    if(!hasNominee()){ navBack(); return; }
    loadingBtn($('#go', el), 900, ()=>go('byPayTimer'));
  });
};

/* ===================== 5. Payment — 6023:14362 timer + UPI app placeholders ===================== */
SCREENS.byPayTimer = (el)=>{
  el.innerHTML = `${topbar('Step 2 : Review and pay')}
    <div class="by-prog"><i style="--f:50.6%"></i><i style="--f:50%"></i><i></i><i></i></div>
    <div class="scroll"><div class="by-timer stg">
      <div class="by-tm" id="tm">9:59</div>
      <p class="b2 c2">A confirmation request has been sent. Please respond within the time above to proceed with your deposit.</p>
      <div class="by-hr"></div>
      <div class="by-help-bn"><img src="${A}by-support-16.svg" width="16" height="16" alt=""><p class="meta c2">Can’t find your bank in your browser?<br><button class="by-vs" data-help>Visit support</button></p></div>
    </div></div>
    <div class="foot" style="box-shadow:none"><button class="btn outline" id="cx">Cancel</button></div>`;
  wireCommon(el);
  let s = 599;
  const iv = setInterval(()=>{ if(!el.isConnected){ clearInterval(iv); return; } s = Math.max(0, s-1); const t = $('#tm', el); if(t) t.textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }, 1000);
  $('#cx', el).addEventListener('click', ()=>navBack());
  later(()=>go('byGpay', 'push'), 2600);
};

// Google Pay collect request — 6023:14380
SCREENS.byGpay = (el)=>{
  el.classList.add('by-ext');
  el.style.background = '#5791F2';
  el.innerHTML = `<div class="by-gp-top"><div class="by-gp-logo"><img src="${A}by-gpay-logo.jpg" width="48" height="48" alt="Google Pay"></div>
      <img class="by-ph" src="${A}by-placeholder.svg" width="371" height="47" alt=""></div>
    <div class="by-gp-card">
      <div class="by-gp-amt"><b>${total()}</b><span>Payment request from RKSV Securities Pvt. Ltd.</span></div>
      <div class="by-gp-bank"><span class="lg"><img src="${A}by-axis-logo.png" width="24" height="24" alt=""></span><div><b>Axis Bank Ltd. ••••1943</b><span>Savings account</span></div><img src="${A}by-gpay-chevron.svg" width="24" height="24" alt=""></div>
      <div style="padding:16px"><button class="by-gp-btn" id="pp">Proceed to pay</button></div>
    </div>`;
  wireCommon(el);
  $('#pp', el).addEventListener('click', ()=>go('byPin', 'push'));
  later(()=>go('byPin', 'push'), 2400);
};

// UPI PIN — 6023:14401
SCREENS.byPin = (el)=>{
  el.classList.add('by-ext');
  el.innerHTML = `<div class="by-pin-bar"><div><b>Axis Bank Ltd.</b><span>XX1943</span></div><img src="${A}by-upi-logo.png" width="65" height="24" alt="UPI"></div>
    <div class="by-pin-sum"><span>Sending: ${total()}</span><span>To: RKSV Securities Pv....</span></div>
    <div class="by-pin-mid"><span>Enter 4-digit UPI PIN</span><div class="by-dots" id="dots">${'<i></i>'.repeat(4)}</div>
      <img class="by-ph" src="${A}by-placeholder.svg" width="371" height="47" alt=""></div>
    <div class="by-pin-kp">${[1,2,3,4,5,6,7,8,9,'',0].map(k=>`<button ${k===''?'disabled':`data-k="${k}"`}>${k}</button>`).join('')}<button data-k="go" class="go"><img src="${A}by-pin-btn-bg.svg" width="34" height="34" alt=""><img src="${A}by-pin-arrow.svg" width="24" height="24" alt="" class="ar"></button></div>`;
  wireCommon(el);
  let pin = '';
  const done = ()=>later(()=>go('byPayDone', 'dissolve'), 350);
  const draw = ()=>$$('#dots i', el).forEach((d,i)=>d.classList.toggle('on', i<pin.length));
  el.addEventListener('click', e=>{ const b = e.target.closest('[data-k]'); if(!b) return;
    if(b.dataset.k==='go'){ if(pin.length===4) done(); else toast('Enter 4-digit UPI PIN'); return; }
    if(pin.length<4){ pin += b.dataset.k; draw(); if(pin.length===4) done(); } });
  // auto-fill as a placeholder app
  later(()=>{ let i=0; const step=()=>{ if(pin.length>=4) return; pin += '1'; draw(); if(pin.length===4) done(); else later(step, 260); }; if(!pin) step(); }, 1400);
};

// Payment done — 6023:14461
SCREENS.byPayDone = (el)=>{
  el.classList.add('by-ext');
  el.style.background = '#6F6F6F';
  el.innerHTML = `<div class="by-done"><span><svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#6F6F6F" stroke-width="2.6"/></svg></span>
    <img class="by-ph" src="${A}by-placeholder.svg" width="371" height="47" alt=""></div>`;
  later(()=>{ placeOrder(); }, 1300);
};

function placeOrder(){
  S.d.order = { fund:S.d.fund, amount:amt(), plan:S.d.plan, status:S.scn.pay, at:Date.now() };
  go('byStatus', 'dissolve');
}

/* ===================== 6. Order status ===================== */
const STEPS = {
  success:   [['NPS payment confirmed','3m ago','done'],['PRAN generated','1m ago','done'],['Order placed with Pension Fund','1m ago','done cur'],['Investment confirmed','1m ago','todo'],['Units alloted','1m ago','todo']],
  processing:[['NPS payment confirmed','3m ago','done'],['PRAN generation in progress','1m ago','prog cur'],['Order placed with Pension Fund','1m ago','todo'],['Investment confirmed','1m ago','todo'],['Units alloted','1m ago','todo']],
  failed:    [['NPS payment confirmed','3m ago','done'],['PRAN generation failed','1m ago','err'],['Refund successful','1m ago','done cur']],
};
// Success badge, inlined so its parts can animate: the badge spins in, the tick stamps on,
// a ring bursts, confetti flies out and the sparkles keep twinkling (css: .by-badge-anim).
let BADGE = null;
fetch(A+'by-success-badge.svg').then(r=>r.text()).then(t=>{ BADGE = t.replace(/<svg[^>]*?>/, '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'); }).catch(()=>{});
const CONFETTI = ['#fff','#DBD2FC','#FDBD4D','#AEA7E0','#fff','#FD9172','#DBD2FC','#3CC7C5','#fff','#FDBD4D','#AEA7E0','#fff'];
function successBadge(){
  if(!BADGE) return `<img class="by-badge" src="${A}by-success-badge.svg" width="120" height="120" alt="">`;
  const dots = CONFETTI.map((c,i)=>`<b class="by-cf" style="--c:${c};--a:${i*30+(i%2?9:-6)}deg;--d:${i%3===0?150:i%3===1?122:104}px;--s:${i%3===1?6:9}px;animation-delay:${.42+(i%4)*.03}s"></b>`).join('');
  return `<span class="by-badge by-badge-anim" role="img" aria-label="Success"><i class="by-ring"></i><i class="by-ring r2"></i>${dots}${BADGE}</span>`;
}
SCREENS.byStatus = (el)=>{
  const render = ()=>{
    const o = S.d.order || (S.d.order = { fund:S.d.fund, amount:amt(), plan:S.d.plan, status:S.scn.pay, at:Date.now() });
    const status = o.status;
    const bad = status==='failed';
    const f = fundById(o.fund);
    el.className = 'view dark ' + (bad ? 'by-st-bad' : 'by-st-ok');
    $('#statusbar').classList.add('light');
    const steps = STEPS[status];
    el.innerHTML = `<div class="by-hero ${bad?'':'big'}" id="hero">
        ${bad ? `<div class="by-failic"><img src="${A}by-fail-ring.svg" width="150" height="150" alt=""><img src="${A}by-fail-core.svg" width="100.5" height="103.5" alt="" style="left:25.5px;top:22.5px"><img src="${A}by-fail-bar.svg" width="9.105" height="47.7" alt="" style="left:70.45px;top:43.85px"><img src="${A}by-fail-dot.svg" width="9.105" height="13.4373" alt="" style="left:70.45px;top:97.2px"></div>`
              : successBadge()}
        <p class="by-msg">${bad ? 'PRAN generation failed,<br>expect refund in 2 days' : `Congratulations!<br>You've successfully invested ${inr(o.amount)} in ${f.name}.`}</p>
      </div>
      <div class="by-scrim" id="scrim"></div>
      <div class="by-ssheet" id="ss">
        <div class="handle"><i></i></div>
        <div class="h2 by-ss-t">Order status</div>
        <div class="by-ss-f">${o.fund==='icici' ? `<span class="by-lg"><img src="${A}by-icici-logo.png" width="40" height="40" alt=""></span>` : ['axis','kotak','sbi','hdfc','uti','absl'].includes(o.fund) ? `<span class="by-lg"><img src="${A}ex-logo-${o.fund}.png" width="40" height="40" alt=""></span>` : `<span class="by-lg by-lg-t">${f.name[0]}</span>`}<b>${f.name}</b></div>
        <div class="by-ladder">${steps.map(([t,s,k],i)=>`<div class="by-step ${k} ${i===steps.length-1?'last':''} ${steps[i+1] && /done|err|prog/.test(k) && /done|prog/.test(steps[i+1][2]) ? 'gl':''}">
            <span class="ic">${k.includes('err') ? `<img src="${A}by-step-error.svg" width="16" height="16" alt="">` : k.includes('done') ? `<img src="${A}by-step-done.svg" width="16" height="16" alt="">` : k.includes('prog') ? '<i class="by-prog-ic"></i>' : `<img src="${A}by-step-pending.svg" width="16" height="16" alt="">`}</span>
            <div><span class="b1">${t}</span><span class="meta c2">${s}</span></div></div>`).join('')}</div>
        <div class="by-ss-ft">${bad ? `<button class="btn purple" id="retry">Retry</button>` : `<button class="btn outline" id="close">Close</button><button class="btn purple" id="chk">Check status</button>`}</div>
      </div>`;
    const ss = $('#ss', el), hero = $('#hero', el);
    later(()=>{ ss.classList.add('on'); hero.classList.add('up'); $('#scrim', el).classList.add('on'); }, bad ? 1400 : 1900);
    const toPf = ()=>resetTo(['home','explore'], 'portfolio', {tab:'orders'});
    const c = $('#close', el); c && c.addEventListener('click', toPf);
    const k = $('#chk', el); k && k.addEventListener('click', e=>loadingBtn(e.currentTarget, 700, toPf));
    const r = $('#retry', el); r && r.addEventListener('click', ()=>{
      // back to payment: drop the UPI app screens + status from history
      const H = P.hist; while(H.length && H[H.length-1].id !== 'byPayTimer') H.pop();
      if(H.length){ H.pop(); }
      go('byPayTimer', 'dissolve');
    });
  };
  render();
  el.__refresh = ()=>{ if(S.d.order) S.d.order.status = S.scn.pay; render(); };
};

/* ===================== Jumps ===================== */
const seedOrder = ()=>{ S.d.amount = S.d.amount || 50000; };
jump('buyAmount', 'Order form', 'buy', ()=>resetTo(STACK(), 'buyAmount', {fund:S.d.fund}));
jump('byPersonal', 'Personal details', 'buy', ()=>{ seedOrder(); resetTo([...STACK(), 'buyAmount'], 'byPersonal'); });
jump('byNominee', 'Nominee', 'buy', ()=>{ seedOrder(); resetTo([...STACK(), 'buyAmount'], 'byNominee'); });
jump('byReview', 'Review', 'buy', ()=>{ seedOrder(); resetTo([...STACK(), 'buyAmount'], 'byReview'); });
jump('byPayTimer', 'Payment (UPI)', 'buy', ()=>{ seedOrder(); resetTo([...STACK(), 'buyAmount', 'byReview'], 'byPayTimer'); });
jump('byStatus', 'Order status', 'buy', ()=>{ seedOrder(); S.d.order = null; resetTo([...STACK(), 'buyAmount', 'byReview', 'byPayTimer'], 'byStatus'); });
})();
