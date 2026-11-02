/* NPS prototype — shared engine (adapted from the NCD prototype).
   Figma: NPS (4sol9mcMYd8ae6LUjAb2L8) › pages More, Explore Page, Fund Details Page, Buy/Sell, Portfolio.
   Everything screen modules need lives on window.P. */
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const h = (html)=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const A = 'assets/';
const inr = (n)=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:0});
// ₹1.4 Cr / ₹16L / ₹50,000 — compact Indian notation used across NPS screens
const inrShort = (n)=>{ if(n>=1e7) return '₹'+(+(n/1e7).toFixed(2))+' Cr'; if(n>=1e5) return '₹'+(+(n/1e5).toFixed(2))+'L'; return inr(n); };

/* ---------------- shared data ---------------- */
const PLANS = {
  aggressive:   { key:'aggressive',   name:'Aggressive',   risk:'High risk',   ret:'12.2% - 14.5%', eq:75, corp:15, gov:10, alt:0 },
  moderate:     { key:'moderate',     name:'Moderate',     risk:'Medium risk', ret:'10.2% - 12.5%', eq:50, corp:30, gov:20, alt:0 },
  conservative: { key:'conservative', name:'Conservative', risk:'Low risk',    ret:'8.3% - 10.5%',  eq:25, corp:45, gov:30, alt:0 },
  custom:       { key:'custom',       name:'Custom',       risk:'',            ret:'',              eq:30, corp:50, gov:15, alt:5 },
};
// Pension fund managers. Screen modules may add fields (returns, AUM…) but keep ids stable.
const FUNDS = [
  { id:'icici', name:'ICICI Prudential Pension Fund' },
  { id:'sbi',   name:'SBI Pension Fund' },
  { id:'hdfc',  name:'HDFC Pension Fund' },
  { id:'kotak', name:'Kotak Mahindra Pension Fund' },
  { id:'uti',   name:'UTI Retirement Solutions' },
  { id:'lic',   name:'LIC Pension Fund' },
  { id:'absl',  name:'Aditya Birla Sun Life Pension' },
  { id:'axis',  name:'Axis Pension Fund' },
];
const fundById = (id)=>FUNDS.find(f=>f.id===id) || FUNDS[0];

// Scenario switches (left panel) + per-run data
const S = { scn:{ holdings:false, nominee:true, married:false, pay:'success', load:'ok' }, d:{} };
function resetData(){
  S.d = { amount:50000, age:29, plan:'aggressive', custom:{ ...PLANS.custom }, fund:'icici', storiesSeen:false, order:null };
}
resetData();

/* ---------------- view engine ---------------- */
const SCREENS = {};
const viewsEl = $('#views'), sheetLayer = $('#sheetLayer');
let token = 0;
const st = { cur:null, curId:null };
const hist = [];
const later = (fn, ms) => { const t = token; return setTimeout(()=>{ if(t===token) fn(); }, ms); };

function go(id, tr='push', p={}, {record=true}={}){
  if(!SCREENS[id]){ toast('Screen "'+id+'" not built'); return; }
  token++;
  if(FI.active) FI.blur(); else KB.hide();
  clearSheets(tr !== 'none');
  if(record){ if(tr==='pop') hist.pop(); else if(tr==='replace'){ hist.pop(); hist.push({id,p}); } else hist.push({id, p}); }
  if(tr==='replace') tr = 'dissolve';
  const el = h(`<div class="view" data-id="${id}"></div>`);
  const prev = st.cur;
  st.cur = el; st.curId = id;
  SCREENS[id](el, p);
  viewsEl.appendChild(el);
  $('#statusbar').classList.toggle('light', el.classList.contains('dark'));
  if(prev){
    if(tr==='none'){ prev.remove(); }
    else {
      el.classList.add('enter-'+tr); prev.classList.add('leave-'+tr);
      if(tr==='push' || tr==='pop'){ prev.style.zIndex = tr==='pop' ? 2 : 0; el.style.zIndex = tr==='pop' ? 1 : 2; }
      setTimeout(()=>{ prev.remove(); el.classList.remove('enter-'+tr); }, 480);
    }
  }
  markJump(id);
}
function navBack(){
  if(openSheets.length){ const s = openSheets[openSheets.length-1]; if(s.dismissable) s.close(); return; }
  if(FI.active){ FI.blur(); return; }
  if(hist.length > 1){ const t = hist[hist.length-2]; hist.pop(); go(t.id, 'pop', t.p, {record:false}); }
}
function startOver(id, p={}){ hist.length = 0; go(id, 'dissolve', p); }
// replace the whole back stack, then show `id` (used by jumps and by flows that reset history, e.g. order success → portfolio)
function resetTo(stack, id, p={}, tr='dissolve'){ hist.length = 0; stack.forEach(x=>hist.push(typeof x==='string' ? {id:x, p:{}} : x)); go(id, tr, p); }

const openSheets = [];
function clearSheets(anim){
  openSheets.length = 0;
  $$('.sheet, .scrim', sheetLayer).forEach(n=>{
    if(!anim){ n.remove(); return; }
    n.classList.remove('on'); setTimeout(()=>n.remove(), 420);
  });
}
/* Bottom sheet. html = inner content (handle is added). Returns {el, close}. */
function sheet({html='', cls='', style='', onClose=null, dismissable=true, handle=true}={}){
  const sc = h(`<div class="scrim"></div>`);
  const sh = h(`<div class="sheet ${cls}" style="${style}">${handle?'<div class="handle"><i></i></div>':''}${html}</div>`);
  sheetLayer.appendChild(sc); sheetLayer.appendChild(sh);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ sc.classList.add('on'); sh.classList.add('on'); }));
  const api = {
    el:sh, dismissable,
    close(){
      const i = openSheets.indexOf(api); if(i<0) return; openSheets.splice(i,1);
      if(FI.active && sh.contains(FI.active.el)) FI.blur(); else if(!FI.active) KB.hide();
      sh.classList.remove('on'); sc.classList.remove('on');
      setTimeout(()=>{ sh.remove(); sc.remove(); }, 420);
      onClose && onClose();
    }
  };
  if(dismissable){ sc.addEventListener('click', ()=>api.close()); const hd=$('.handle', sh); hd && hd.addEventListener('click', ()=>api.close()); }
  sh.addEventListener('click', e=>{ if(e.target.closest('[data-close]')) api.close(); });
  openSheets.push(api);
  return api;
}
function infoSheet(title, items, extra=''){
  return sheet({html:`${title?`<div class="sh-title">${title}</div>`:''}<div class="sh-scroll" style="padding:12px 16px 24px;display:flex;flex-direction:column;gap:16px">${items.map(([t,d])=>`<div class="info-it">${t?`<b>${t}</b>`:''}<p>${d}</p></div>`).join('')}${extra}</div>`});
}
function toast(msg, ms=2200){
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), ms);
}
// data-back → back, data-help → toast, data-go="screenId" → push
function wireCommon(el){
  el.addEventListener('click', e=>{
    const g = e.target.closest('[data-go]');
    if(e.target.closest('[data-back]')) navBack();
    else if(e.target.closest('[data-help]')) toast('Help & support');
    else if(g) go(g.dataset.go);
  });
}
function loadingBtn(b, ms, done){ b.classList.add('loading'); later(()=>{ b.classList.remove('loading'); done(); }, ms); }
const I = {
  back:(dark=true)=>`<button class="icon-btn" data-back aria-label="Back"><img src="${A}${dark?'ic-arrow-left-dark.svg':'ic-arrow-left-white.svg'}" width="24" height="24" alt=""></button>`,
  help:`<button class="icon-btn" data-help aria-label="Help"><img src="${A}ic-support.svg" width="24" height="24" alt=""></button>`,
};

/* ---------------- jump registry (left panel) ----------------
   P.jump(id, label, group, run) — run() sets up history/state and shows the screen (use P.resetTo). */
const JUMPS = [];
function jump(id, label, group, run){ JUMPS.push({id, label, group, run}); }
function markJump(id){ $$('[data-j]').forEach(b=>b.classList.toggle('on', b.dataset.j===id)); }

window.P = { $, $$, h, A, inr, inrShort, PLANS, FUNDS, fundById, S, resetData, SCREENS, go, navBack, startOver, resetTo, hist, st, later,
  sheet, infoSheet, openSheets, clearSheets, toast, wireCommon, loadingBtn, I, jump, JUMPS, markJump };
})();
