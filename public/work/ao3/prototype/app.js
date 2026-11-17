/* Account Opening 3.0 — interactive prototype */
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const h = (html)=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const A = 'assets/';

/* ---------------- state ---------------- */
const DEF_BANK = { name:'AXIS BANK', short:'Axis Bank', acct:'8763 2736 9873 0329', holder:'NIDHI PATEL', ifsc:'UTI00000085', branch:'Borivali West', color:'#95144C', logo:'axis' };
const DEF_PERSONAL = { gender:'Female', marital:'Unmarried', income:'> 5 lakhs', occupation:'Salaried', addr:'201, Vasundhara Nivas , Shanthi Colony, Anna Nagar West, Chennai, Tamil Nadu, 600040' };
const S = {
  scn:{ panAuto:true, bankAuto:true, personalAuto:true, pennyFail:false },
  d:{}, stage:0, maxStage:0
};
function resetData(){
  S.d = { phone:'', email:'', pan:'ABCDE1234Z', name:'NIDHI PATEL', father:'SURESH PATEL', dob:'21/05/2001',
          panReady:S.scn.panAuto, bank:S.scn.bankAuto?{...DEF_BANK}:null, personal:S.scn.personalAuto?{...DEF_PERSONAL}:null,
          exp:null, nominee:null, segs:new Set(), stocks:new Set(), pennyFailOnce:false };
  S.stage = 0; S.maxStage = 0;
}
resetData();

/* ---------------- tiny icon set ---------------- */
const I = {
  back:`<img src="${A}ic-back.svg" width="24" height="24" alt="Back">`,
  help:`<img src="${A}ic-help.svg" width="24" height="24" alt="Help">`,
  close:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  chev:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  chevR:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`,
  check:(c='#008858',s=12)=>`<svg width="${s}" height="${s}" viewBox="0 0 12 12" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 4.5 8.5 2 6"/></svg>`,
  pencil:`<svg width="13" height="13" viewBox="0 0 24 24" fill="#542087"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25Zm17.7-10.2a1 1 0 0 0 0-1.42l-2.33-2.33a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg>`,
  shield:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="2"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z"/></svg>`,
  cal:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,
  // Hugeicons BankIcon (stroke-rounded) — <HugeiconsIcon icon={BankIcon} />
  bank:(c='#542087')=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.125 5.75H12M12.25 5.75C12.25 5.88807 12.1381 6 12 6C11.8619 6 11.75 5.88807 11.75 5.75C11.75 5.61193 11.8619 5.5 12 5.5C12.1381 5.5 12.25 5.61193 12.25 5.75Z"/><path d="M5 9V19M9 9V19"/><path d="M15 9V19M19 9V19"/><path d="M21.3518 9H2.64822C2.29022 9 2 8.70651 2 8.34447C2 8.12259 2.11099 7.91577 2.29495 7.79485L8.73007 3.56485C10.3171 2.52162 11.1107 2 12 2C12.8893 2 13.6829 2.52162 15.2699 3.56485L21.7051 7.79485C21.889 7.91577 22 8.12259 22 8.34447C22 8.70651 21.7098 9 21.3518 9Z"/><path d="M21.0397 20.2929L20.3519 19.5858C20.0707 19.2968 19.9301 19.1522 19.7514 19.0761C19.5726 19 19.3738 19 18.9762 19H5.02382C4.62621 19 4.4274 19 4.24863 19.0761C4.06987 19.1522 3.92929 19.2968 3.64814 19.5858L2.9603 20.2929C2.25356 21.0194 1.9002 21.3827 2.02456 21.6913C2.14893 22 2.64867 22 3.64814 22H20.3519C21.3513 22 21.8511 22 21.9754 21.6913C22.0998 21.3827 21.7464 21.0194 21.0397 20.2929Z"/></svg>`,
  user:(c='#542087')=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>`,
  warn:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b26b00" stroke-width="2" stroke-linecap="round"><path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17.5v.01"/></svg>`,
  info:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>`,
  lock:`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7A5 5 0 0 0 7 7v2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM9 7a3 3 0 0 1 6 0v2H9Z"/></svg>`,
  google:`<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`,
  upload:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>`,
  reset:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#542087" stroke-width="2.4" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.6M20 3v5.6h-5.6"/></svg>`,
  eye:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  sun:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  okc:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6f6f" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>`,
  cam:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
  search:`<svg class="ic-search" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  plus:`<svg width="10" height="10" viewBox="0 0 12 12" stroke="#262626" stroke-width="1.6" stroke-linecap="round"><path d="M6 2v8M2 6h8"/></svg>`,
};
// Success tick — "Bank linked tick" Lottie (Claude motion). Plays once and holds on the final frame.
// Falls back to the Figma-exported animated WebP if Lottie isn't available.
let badgeN = 0;
const badge = ()=> (window.lottie && window.TICK_ANIM)
  ? `<div class="badge"><div class="tick-lottie" data-tick></div></div>`
  : `<div class="badge"><img class="check-anim" src="${A}check-anim.webp?r=${++badgeN}" alt=""></div>`;
function initTicks(root){
  if(!window.lottie || !window.TICK_ANIM) return;
  $$('[data-tick]:not(.ready)', root).forEach(n=>{
    n.classList.add('ready');
    lottie.loadAnimation({ name:'tick', container:n, renderer:'svg', loop:false, autoplay:true, animationData:window.TICK_ANIM, rendererSettings:{preserveAspectRatio:'xMidYMid meet'} });
  });
}

/* ---------------- view engine ---------------- */
const viewsEl = $('#views'), sheetLayer = $('#sheetLayer');
let cur = null, curId = null, token = 0;
const later = (fn, ms) => { const t = token; return setTimeout(()=>{ if(t===token) fn(); }, ms); };
const sleep = (ms) => { const t = token; return new Promise((res, rej)=>setTimeout(()=> t===token ? res() : rej('stale'), ms)); };
const statusLight = (on) => { $('#statusbar').classList.toggle('light', !!on); $('.home-ind').classList.toggle('light', !!on); };

function go(id, tr='dissolve', p={}){
  token++;
  if(FI.active) FI.blur(); else KB.hide();
  KB.sug = null;
  clearSheets(tr !== 'none' && !p.keepSheets);
  statusLight(false);
  const el = h(`<div class="view" data-id="${id}"></div>`);
  const prev = cur;
  cur = el; curId = id;
  SCREENS[id](el, p);
  viewsEl.appendChild(el);
  initTicks(el);
  if(prev){
    if(tr==='none'){ prev.remove(); }
    else {
      el.classList.add('enter-'+tr); prev.classList.add('leave-'+tr);
      if(tr==='push' || tr==='pop'){ prev.style.zIndex = tr==='pop' ? 2 : 0; el.style.zIndex = tr==='pop' ? 1 : 2; }
      setTimeout(()=>{ prev.remove(); el.classList.remove('enter-'+tr); }, 560);
    }
  }
  markJump(id);
}
function clearSheets(anim){
  if(window.lottie) setTimeout(()=>{ if(!$('#boxAnim')) lottie.destroy('folder'); if(!$('#clockAnim')) lottie.destroy('clock'); if(!$('[data-tick]')) lottie.destroy('tick'); if(!$('#graphAnim')) lottie.destroy('graph'); }, 600);   // stop Lottie loops once their screen is gone
  $$('.sheet, .scrim, .ios-alert-wrap', sheetLayer).forEach(n=>{
    if(!anim){ n.remove(); return; }
    n.classList.remove('on'); setTimeout(()=>n.remove(), 500);
  });
}
function sheet({cls='', html='', scrim=true, blur=false, onScrim=null, grab=true}={}){
  const sc = scrim ? h(`<div class="scrim ${blur?'blur':''}"></div>`) : null;
  const sh = h(`<div class="sheet ${cls}">${grab?'<div class="grab"></div>':''}${html}</div>`);
  if(sc){ sheetLayer.appendChild(sc); if(onScrim) sc.addEventListener('click', onScrim); }
  sheetLayer.appendChild(sh);
  initTicks(sh);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ sc && sc.classList.add('on'); sh.classList.add('on'); }));
  return { el:sh, close(){ sh.classList.remove('on'); sc && sc.classList.remove('on'); setTimeout(()=>{ sh.remove(); sc && sc.remove(); }, 520); } };
}
function iosAlert({title, msg, actions}){
  return new Promise(res=>{
    const w = h(`<div class="ios-alert-wrap"><div class="ios-alert"><b>${title}</b><p>${msg}</p><div class="ia-acts">${actions.map((a,i)=>`<button data-i="${i}" class="${a.bold?'bold':''}">${a.label}</button>`).join('')}</div></div></div>`);
    sheetLayer.appendChild(w);
    requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.add('on')));
    w.addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; w.classList.remove('on'); setTimeout(()=>w.remove(), 250); res(+b.dataset.i); });
  });
}
function toast(html, ms=2200){
  const t = $('#toast'); t.innerHTML = html; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), ms);
}
document.addEventListener('kb', e=>{ if(cur) cur.classList.toggle('kb-open', e.detail.open); });
viewsEl.addEventListener('click', e=>{
  const w = e.target.closest('.cta-wrap'); if(!w) return;
  const b = $('.cta', w); if(!b || !b.disabled) return;
  w.classList.remove('nudge'); void w.offsetWidth; w.classList.add('nudge');
  if(cur && cur._invalid) cur._invalid();
});

function topnav(pct, {back=true, help=true, close=false, onBack=null}={}){
  return `<div class="topnav z">
    ${back?`<button class="icon-btn" data-act="back">${I.back}</button>`:close?`<span style="width:36px"></span>`:'<span style="width:36px"></span>'}
    <div class="progress"><i style="width:${pct}%"></i></div>
    ${close?`<button class="icon-btn" data-act="close">${I.close}</button>`:help?`<button class="icon-btn" data-act="help">${I.help}</button>`:'<span style="width:36px"></span>'}
  </div>`;
}
function wireNav(el, onBack){
  const b = $('[data-act="back"]', el); if(b) b.addEventListener('click', onBack);
  const hp = $('[data-act="help"]', el); if(hp) hp.addEventListener('click', ()=>toast('Help centre opens here'));
}
function brandbar(){ return `<div class="brandbar z"><img src="${A}upstox-logo.svg" alt="upstox"><span class="sebi"><img src="${A}verified.svg" width="13" height="13" alt="">SEBI registered</span></div>`; }
function cta(label, {disabled=false, id='cta'}={}){ return `<div class="cta-wrap"><button class="cta" id="${id}" ${disabled?'disabled':''}><span>${label}</span></button></div>`; }
function setCta(el, on, label){ const b=$('#cta', el); if(!b) return; const was=b.disabled; b.disabled=!on; if(label) $('span',b).textContent=label; if(was && on){ b.classList.remove('shine'); void b.offsetWidth; b.classList.add('shine'); } }
/* "Confirmed!" CTA moment (from screen recording):
   1) a magenta light traces the button border  2) label crossfades  3) border turns green + glow  4) green fades to a mint glow  5) next screen */
function celebrateCta(el, label, done){
  const wrap = $('.cta-wrap', el), b = $('#cta', el);
  if(!wrap || wrap.classList.contains('celebrating')) return;
  wrap.classList.add('celebrating');
  b.style.pointerEvents = 'none';
  const old = $('span', b).textContent;
  b.innerHTML = `<span class="lbl lbl-old">${old}</span><span class="lbl lbl-new">${label}</span>`;
  const r = b.getBoundingClientRect(), sc = r.width / b.offsetWidth;
  const w = b.offsetWidth, h = b.offsetHeight;
  wrap.insertAdjacentHTML('beforeend', `<svg class="cta-trace" viewBox="-2 -2 ${w+4} ${h+4}" style="width:${w+4}px;height:${h+4}px">
    <defs><linearGradient id="ctg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5fd2" stop-opacity="0"/><stop offset=".55" stop-color="#e040fb"/><stop offset="1" stop-color="#ff7ae0"/></linearGradient></defs>
    <rect class="tr-full" x="0" y="0" width="${w}" height="${h}" rx="8" pathLength="100"/>
    <rect class="tr-comet" x="0" y="0" width="${w}" height="${h}" rx="8" pathLength="100" stroke="url(#ctg)"/>
    <rect class="tr-ok" x="0" y="0" width="${w}" height="${h}" rx="8" pathLength="100"/></svg>`);
  later(()=>wrap.classList.add('st-lit'), 820);        // border fully lit magenta
  later(()=>wrap.classList.add('st-swap'), 980);       // label crossfade
  later(()=>wrap.classList.add('st-ok'), 1120);        // green border + glow
  later(()=>wrap.classList.add('st-settle'), 2050);    // green stroke fades, mint glow stays
  later(done, 2550);
}
/* scroll a container so `target` sits just above the on-screen keyboard (+ the Verify button under it) */
function revealAboveKb(container, target, extra=0){
  if(!container || !target) return;
  const scr = $('#screen'), sr = scr.getBoundingClientRect(), sc = sr.height / scr.offsetHeight;
  const kb = (KB.el ? KB.height : 0);
  const tr = target.getBoundingClientRect();
  const limit = sr.bottom - (kb + 20 + extra) * sc;
  const delta = (tr.bottom - limit) / sc;
  if(delta > 0) container.scrollBy({ top: delta, behavior: 'smooth' });
}
function animateProgress(el, from, to){ const i=$('.progress i', el); if(!i) return; i.style.width=from+'%'; requestAnimationFrame(()=>requestAnimationFrame(()=>i.style.width=to+'%')); }
function success(title, sub='Taking you to the next step...'){
  return sheet({cls:'mint', html:`<div class="success">${badge()}<div class="sheet-title">${title}</div><div class="sheet-sub">${sub}</div></div>`});
}

/* ---------------- PAN / bank / ID card art ---------------- */
/* decorative QR (not scannable) — deterministic from the PAN so it doesn't change between renders */
function qrSvg(seed){
  const N=25; let h=2166136261; for(const ch of String(seed||'PAN')) h=Math.imul(h^ch.charCodeAt(0),16777619);
  const rnd=()=>{ h^=h<<13; h^=h>>>17; h^=h<<5; return ((h>>>0)%1000)/1000; };
  const finder=(x,y)=>(r,c)=>{ const dr=r-y, dc=c-x; if(dr<0||dc<0||dr>6||dc>6) return null; return (dr===0||dr===6||dc===0||dc===6||(dr>=2&&dr<=4&&dc>=2&&dc<=4)); };
  const fs=[finder(0,0),finder(N-7,0),finder(0,N-7)];
  let rects='';
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    let on=null; for(const f of fs){ const v=f(r,c); if(v!==null){ on=v; break; } }
    const nearFinder = (r<8&&c<8)||(r<8&&c>N-9)||(r>N-9&&c<8);
    if(on===null) on = nearFinder ? false : rnd()>0.52;
    if(on) rects+=`<rect x="${c}" y="${r}" width="1.02" height="1.02"/>`;
  }
  return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" fill="#1f2a44">${rects}</svg>`;
}
/* PAN card — Figma reference (Account-opening-3.0 › 10195:30358). Sizes in cqw against a 320px card. */
function panArt(d, {typing=false}={}){
  return `<div class="pan pan3 ${typing?'typing-card':''}">
    <img class="p3-noise" src="${A}noise-ref.png" alt="">
    <div class="p3-l"><span class="dv">आयकर विभाग</span><span class="en">Income Tax Department</span></div>
    <img class="p3-emb" src="${A}emblem.svg" alt=""><span class="p3-sj">सत्यमेव जयते</span>
    <div class="p3-r"><span class="dv">भारत सरकार</span><span class="en">GOVERNMENT OF INDIA</span></div>
    <div class="p3-v pv" data-f="name" style="top:17.29cqw">${d.name}</div>
    <div class="p3-v pv" data-f="father" style="top:24.17cqw">${d.father}</div>
    <div class="p3-v pv" data-f="dob" style="top:30.97cqw">${d.dob}</div>
    <div class="p3-pan"><span>Permanent account number</span><b class="p3-v pv" data-f="pan">${d.pan}</b></div>
    <div class="p3-holo"><i></i><img src="${A}hologram-subtract.svg" class="hs" alt=""><span class="ht">भारत सरकार</span><span class="hb">आयकर विभाग</span><img src="${A}hologram-layer.svg" class="hl" alt=""><img src="${A}holo.png" class="hg" alt=""></div>
    <img class="p3-light" src="${A}light-source.svg" alt="">
  </div>`;
}
const BANKS = {
  axis:{name:'AXIS BANK', color:'#95144C', logo:`<img src="${A}axis-logo.svg" width="28" height="28" alt="">`},
  hdfc:{name:'HDFC BANK', color:'#004C8F', logo:`<svg width="26" height="26" viewBox="0 0 26 26"><rect width="26" height="26" fill="#fff"/><rect x="3" y="3" width="20" height="20" fill="#ED232A"/><rect x="8" y="8" width="10" height="10" fill="#fff"/><rect x="10.5" y="10.5" width="5" height="5" fill="#004C8F"/></svg>`},
  icici:{name:'ICICI BANK', color:'#9E2A2B', logo:`<span style="width:26px;height:26px;border-radius:50%;background:#fff;display:grid;place-items:center"><img src="${A}icici.svg" width="16" height="16" alt=""></span>`},
  sbi:{name:'STATE BANK OF INDIA', color:'#250970', logo:`<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill="#29B6F6"/><circle cx="13" cy="13" r="4" fill="#250970"/><rect x="11.6" y="13" width="2.8" height="12" fill="#250970"/></svg>`},
  kotak:{name:'KOTAK MAHINDRA', color:'#003874', logo:`<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill="#fff"/><path d="M5 13c3-6 13-6 16 0-3 6-13 6-16 0Z" fill="#ED1C24"/></svg>`},
  generic:{name:'YOUR BANK', color:'#3b2a63', logo:I.bank('#fff')}
};
function bankArt(b){
  const B = BANKS[b.logo] || BANKS.generic;
  return `<div class="bank">
    <div class="bhd"><svg viewBox="0 0 300.8 53.58" preserveAspectRatio="none"><path d="M0 0H300.8V17.39L199.914 19.162C191.749 19.3054 184.047 22.9812 178.8 29.2387L166.843 43.4989C161.485 49.889 153.573 53.58 145.234 53.58H0V0Z" fill="${B.color}"/></svg></div>
    <div class="blogo">${B.logo}</div>
    <div class="bname">${b.name}</div>
    <div class="bloc"><img src="${A}location.svg" width="15" height="15" alt="">${b.branch}</div>
    ${b.pending?'<span class="bpend">Under review</span>':''}<div class="rows"><span class="k1">ACCOUNT NO.</span><span class="v1">${b.acct}</span><span class="k1">ACCOUNT HOLDER</span><span class="v1">${b.holder}</span><span class="k1">IFSC CODE</span><span class="v1">${b.ifsc}</span></div>
  </div>`;
}
function idArt(p, name){
  const ini = name.split(' ').map(x=>x[0]).join('').slice(0,2);
  return `<div class="idc"><div class="band"></div><div class="inner">
    <div class="avt">${ini}</div>
    <div class="grid3">
      <div><div class="k2">Gender</div><div class="v2">${p.gender}</div></div>
      <div><div class="k2">Marital status</div><div class="v2">${p.marital}</div></div>
      <div><div class="k2">Annual income</div><div class="v2">${p.income}</div></div>
    </div>
    <div class="addr"><div class="k2">Correspondence address</div><div class="v2">${p.addr}</div></div>
  </div></div>`;
}
function emptyArt(kind){
  if(kind==='bank') return `<div class="empty-art"><div class="ea-ic">${I.bank()}</div><b>No bank account found</b><small>We couldn't find a bank account linked to your PAN. Add one in under a minute.</small><button class="ea-btn" data-add="bank">Add bank account</button></div>`;
  return `<div class="empty-art"><div class="ea-ic">${I.user()}</div><b>A few details missing</b><small>4 quick questions about you and your address. Takes about 30 seconds.</small><button class="ea-btn" data-add="personal">Add personal details</button></div>`;
}

/* =====================================================================
   SCREENS
   ===================================================================== */
const SCREENS = {};

/* ---------- Welcome ---------- */
SCREENS.welcome = (el)=>{
  el.classList.add('welcome');
  el.innerHTML = `<div class="bg-lav"></div>${brandbar()}
    <div class="coin z"><img id="coinv" src="${A}coin/00.webp" alt=""></div>
    <div class="z" style="position:absolute;left:0;right:0;top:520px">
      <div class="stg">
        <div class="trusted"><span class="avs"><img src="${A}av1.jpg" alt=""><img src="${A}av2.jpg" alt=""><img src="${A}av3.jpg" alt=""></span>Trusted by 2 Crore+ Indians</div>
        <div class="tagline">Trade with precision.<br>Execute faster.</div>
        <div class="bullets"><span>Advanced tools</span>•<span>F&amp;O</span>•<span>Real-time charts</span></div>
        <div class="pills"><span><b>₹0</b> Account opening fee</span><span><img src="${A}star.svg" width="10" height="10" alt=""><b>4.3</b> App rating</span></div>
      </div>
    </div>
    <div class="tap-hint z">Tap anywhere to begin</div>`;
  el.addEventListener('click', ()=>go('phone'), {once:true});
  // coin: Sal's Lottie as a flipbook. Spins once on arrival and again whenever it comes back into view
  const v = $('#coinv', el), N = 20, MS = 1000 * 0.9554 / 8;
  const files = Array.from({length:N}, (_,i)=>`${A}coin/${String(i).padStart(2,'0')}.webp`);
  files.forEach(f=>{ new Image().src = f; });
  let raf = 0, played = false;
  const spin = ()=>{
    cancelAnimationFrame(raf); played = true;
    const t0 = performance.now();
    const tick = (t)=>{
      if(!v.isConnected) return;
      const i = Math.min(N-1, Math.floor((t-t0)/MS));
      v.src = files[i];
      if(i < N-1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  later(spin, 250);
  if('IntersectionObserver' in window){ const io = new IntersectionObserver(es=>{ if(!v.isConnected){ io.disconnect(); return; } if(es[0].isIntersecting){ if(played) spin(); } }, {threshold:.4}); io.observe(v); }
};

/* ---------- Phone ---------- */
SCREENS.phone = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${brandbar()}
    <div class="hero z stg" style="margin-top:56px"><div class="h1">Hello</div><div class="sub">Let's start with your mobile number</div></div>
    <div class="z" style="padding:28px 24px 0">
      <div class="field" id="pf"><span class="pre"><img src="${A}flag.png" width="22" height="15" style="border-radius:2px" alt="">${I.chev}</span><div class="fi" id="pfi"></div><span class="suffix" id="psfx"></span></div>
      <div class="helper" id="ph"></div>
      <div class="nri">Non-Resident Indian? <a class="link-u">Enter as NRI</a></div>
    </div>
    <div class="legal z">By continuing, I accept Upstox's <a class="link-u">Terms &amp; Conditions</a> and <a class="link-u">Privacy Policy</a>.</div>`;
  const fi = FI.create($('#pfi', el), {
    kb:'num', max:10, placeholder:'Enter Phone number',
    allow:(c,v)=>/\d/.test(c) && !(v.length===0 && /[0-5]/.test(c)),
    format:v=>v.length>5? v.slice(0,5)+' '+v.slice(5) : v,
    suggest:{words:['98527 11450']},
    onChange:(v)=>{
      $('#ph',el).textContent=''; $('#ph',el).className='helper';
      if(v.length===10){
        S.d.phone = v;
        KB.setSuggestion(null);
        $('#psfx',el).innerHTML='<span class="mini-spin"></span>';
        later(()=>go('otp'), 650);
      }
    }
  });
  // fix suggestion insert: strip space
  const _sv = fi.setValue.bind(fi); fi.setValue = (v,t)=>_sv(v.replace(/\s/g,''), t);
  later(()=>fi.focus(), 420);
};

/* ---------- OTP (signup) ---------- */
function otpBoxes(n=6){ return `<div class="otp" id="otp">${Array.from({length:n},()=>`<div class="box"></div>`).join('')}</div>`; }
function bindOtp(el, {code='149136', n=6, onDone, autoMs=1300, metaEl}){
  const boxes = $$('.otp .box', el);
  const render = (v)=>{ boxes.forEach((b,i)=>{ b.textContent = v[i]||''; b.classList.toggle('cur', i===v.length && FI.active===fi); }); };
  let last = '';
  const fi = FI.create(h('<div></div>'), {
    kb:'num', max:n, allow:c=>/\d/.test(c),
    onChange:(v)=>{
      render(v);
      if(v.length>last.length){ const b=boxes[v.length-1]; b.classList.remove('fill'); void b.offsetWidth; b.classList.add('fill'); }
      last = v;
      if(v.length===n){ KB.setSuggestion(null); onDone(v, fi); }
    },
    onFocus:()=>render(fi.value)
  });
  $('#otp', el).addEventListener('click', ()=>fi.focus());
  render('');
  later(()=>{ fi.focus(); render(''); }, 380);
  later(()=>{ if(fi.value.length<n){ KB.setSuggestion({otp:code}); } }, autoMs);
  return fi;
}
SCREENS.otp = (el)=>{
  const ph = S.d.phone || '9852711450';
  el.innerHTML = `<div class="bg-lav"></div>${brandbar()}
    <div class="hero z stg" style="margin-top:56px"><div class="h1">Alright</div><div class="sub">Enter the OTP we sent to <b>${ph}</b> <span data-act="edit" style="cursor:pointer;display:inline-block;vertical-align:-1px">${I.pencil}</span></div></div>
    <div class="z" style="padding:28px 24px 0">${otpBoxes()}
      <div class="otp-meta"><span id="om" class="dots">Looking for OTP</span><a class="link" id="resend" style="color:#b9b9b9">Resend OTP (0:30)</a></div>
    </div>`;
  $('[data-act="edit"]', el).addEventListener('click', ()=>go('phone','pop'));
  let s = 30; const tick = ()=>{ s--; const r=$('#resend',el); if(!r) return; if(s<=0){ r.textContent='Resend OTP'; r.style.color=''; } else { r.textContent=`Resend OTP (0:${String(s).padStart(2,'0')})`; later(tick,1000);} }; later(tick,1000);
  bindOtp(el, { onDone:(v, fi)=>{
    $('#om',el).className='okt'; $('#om',el).innerHTML=`OTP fetched ${I.check('#008858',12)}`;
    $('#otp',el).classList.add('ok');
    later(()=>go('email'), 1100);
  }});
};

/* ---------- Email ---------- */
SCREENS.email = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${brandbar()}
    <div class="hero z stg" style="margin-top:50px"><div class="h1">What's your email<br>address?</div><div class="sub">Your email keeps your account safe and<br>SEBI-compliant</div></div>
    <div class="z" style="padding:48px 40px 0">
      <button class="gbtn" id="g">${I.google}Continue with Google</button>
      <div class="or">or</div>
      <div class="field" id="ef"><div class="fi" id="efi"></div></div>
      <div class="helper" id="eh"></div>
    </div>`;
  const fi = FI.create($('#efi', el), {
    kb:'email', placeholder:'abc1234@gmail.com', lower:true, returnKey:'continue',
    suggest:{words:['nidhi.patel@gmail.com']},
    onChange:(v)=>{ const ok=/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(v); KB.setReturn('continue', ok); $('#eh',el).textContent=''; $('#ef',el).classList.remove('err'); },
    onSubmit:(v)=>{ if(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(v)){ S.d.email=v; fi.blur(); later(()=>startFetch(),250); } else { $('#ef',el).classList.add('err'); $('#eh',el).className='helper err'; $('#eh',el).textContent='Enter a valid email address'; } }
  });
  $('#g', el).addEventListener('click', ()=>{
    if(FI.active) FI.blur();
    const acc = [['Nidhi Patel','nidhi.patel@gmail.com','#7b4bc4','N'],['Nidhi Patel','nidhi.work@gmail.com','#0e8f6c','N'],['N. Patel','npatel.design@gmail.com','#c8551c','N']];
    const sh = sheet({html:`<div class="gpick"><div class="ghead"><span class="gl">${I.google}</span><b>Choose an account</b><small>to continue to Upstox</small></div>
      ${acc.map((a,i)=>`<div class="gacct" data-i="${i}"><span class="av" style="background:${a[2]}">${a[3]}</span><div><b>${a[0]}</b><small>${a[1]}</small></div></div>`).join('')}
      <div class="gfoot">To continue, Google will share your name, email address and profile picture with Upstox.</div></div>`, onScrim:()=>sh.close()});
    sh.el.addEventListener('click', e=>{ const r=e.target.closest('.gacct'); if(!r) return; r.classList.add('picked'); S.d.email = acc[+r.dataset.i][1];
      setTimeout(()=>{ sh.close(); fi.setValue(S.d.email); $('#ef',el).classList.add('ok'); later(()=>startFetch(), 650); }, 380); });
  });
};

/* ---------- Fetching (sheet over a blurred review) ---------- */
function startFetch(){ go('review', 'dissolve', {intro:'fetch'}); }

/* ---------- Review / card stack ---------- */
SCREENS.review = (el, p)=>{
  const d = S.d;
  const first = d.name.split(' ')[0]; const First = first[0]+first.slice(1).toLowerCase();
  el.classList.add('review');
  el.innerHTML = `<div class="bg-blue"></div>
    ${topnav(6)}
    <div class="rv-head z">
      <div class="h1">Hi ${d.panReady?First:'there'}! <img class="wave" src="${A}wave.gif" alt=""></div>
      <div class="sub">Take a quick look at your details</div>
    </div>
    <div class="stack-clip"><div class="stack" id="stack">
      <div class="card" data-k="pan">
        <div class="c-head"><span class="c-title">PAN details</span><span class="edit edit-brand" data-edit="pan">Edit</span></div>
        <div class="c-body" id="panBody">${panArt(d)}</div>
        <div class="c-tab"><div>PAN DETAILS</div></div>
        <div class="c-done"><div><span>Pan details</span><span class="pill">${I.check('#008858',11)} Done</span></div></div>
      </div>
      <div class="card" data-k="bank">
        <div class="c-head"><span class="c-title">Bank details</span><span class="edit" data-edit="bank">${d.bank?'Edit':''}</span></div>
        <div class="c-body" id="bankBody">${d.bank?bankArt(d.bank):emptyArt('bank')}</div>
        <div class="c-tab"><div>BANK DETAILS</div></div>
        <div class="c-done"><div><span>Bank</span><span class="pill">${I.check('#008858',11)} Done</span></div></div>
      </div>
      <div class="card" data-k="personal">
        <div class="c-head"><span class="c-title">Personal details</span><span class="edit" data-edit="personal">${d.personal?'Edit':''}</span></div>
        <div class="c-body" id="perBody">${d.personal?idArt(d.personal,d.name):emptyArt('personal')}</div>
        <div class="c-tab"><div>PERSONAL DETAILS</div></div>
        <div class="c-done"><div><span>Personal details</span><span class="pill">${I.check('#008858',11)} Done</span></div></div>
      </div>
    </div></div>
    <div class="arrows" id="arrows"><button id="prev"><img src="${A}arrow-left.svg" width="16" height="16" alt="">Previous</button><button id="next">Next<img src="${A}arrow-left.svg" width="16" height="16" style="transform:rotate(180deg)" alt=""></button></div>
    ${cta('Confirm')}`;

  wireNav(el, ()=>go('email','pop'));
  const stack = $('#stack', el);
  const cards = $$('.card', stack);
  const rows = (c)=>({ tab:$('.c-tab',c), done:$('.c-done',c) });
  const measure = ()=>cards.forEach(c=>{
    const r=rows(c); c._tabH = r.tab.firstElementChild.offsetHeight; c._doneH = r.done.firstElementChild.offsetHeight;
    c._headH = $('.c-head',c).offsetHeight; c._bodyH = $('.c-body',c).offsetHeight;
  });

  // "✓ Done" strips — separate layers that fade in where a confirmed card used to be (Figma smart-animate)
  const strips = ['PAN details','Bank'].map((label,i)=>{
    const st = h(`<div class="done-strip" data-i="${i}"><span>${label}</span><span class="pill">${I.check('#008858',11)} Done</span></div>`);
    st.addEventListener('click', ()=>{ if(S.stage>i) toStage(i); });
    stack.appendChild(st); return st;
  });

  function layout(stage, instant){
    const all = [...cards, ...strips];
    if(instant) all.forEach(c=>c.style.transition='none');
    const top0 = stage>0 ? 40 : 0;           // front card drops a little to make room for the strip
    let bottomPrev = 0;
    cards.forEach((c,i)=>{
      const r = rows(c);
      const front = i===stage, behind = i>stage, done = i<stage;
      c.classList.toggle('is-front', front); c.classList.toggle('is-done', done); c.classList.toggle('is-behind', behind);
      r.tab.style.maxHeight = behind ? c._tabH+'px' : '0px';
      c._h = c._headH + c._bodyH + (behind?c._tabH:0);
    });
    const f = cards[stage];
    f.style.transform = `translateY(${top0}px) scale(1)`; f.style.zIndex = 10; f.style.opacity = 1;
    bottomPrev = top0 + f._h;
    for(let i=stage+1;i<cards.length;i++){
      const k=i-stage, sc=1-0.06*k, c=cards[i];
      const ty = bottomPrev + 34 - c._h*sc;
      c.style.transform = `translateY(${ty}px) scale(${sc})`; c.style.zIndex = 10-k; c.style.opacity = 1;
      bottomPrev = ty + c._h*sc;
    }
    // confirmed cards keep their full size and slide up over the header while fading out
    for(let i=stage-1;i>=0;i--){
      const k=stage-i, c=cards[i];
      c.style.transform = `translateY(${-(top0 + 232) - (k-1)*30}px) scale(0.96)`; c.style.zIndex = 12; c.style.opacity = 0;
    }
    // only the most recently confirmed card shows its strip
    strips.forEach((st,i)=>{
      const on = i===stage-1;
      st.classList.toggle('on', on);
      st.style.transform = on ? `translateY(${top0-34}px) scale(0.94)` : `translateY(${top0 - (i<stage-1 ? 50 : 6)}px) scale(0.94)`;
    });
    if(instant){ void stack.offsetWidth; all.forEach(c=>c.style.transition=''); }
    // UI
    const arrows = $('#arrows', el); arrows.classList.toggle('on', stage>0);
    arrows.style.top = (232 + 20 + Math.max(top0 + f._h, bottomPrev) + 26) + 'px';
    $('#prev', el).disabled = stage===0;
    $('#next', el).disabled = stage===2;
    const k = ['pan','bank','personal'][stage];
    const missing = (k==='bank' && !d.bank) || (k==='personal' && !d.personal);
    setCta(el, true, missing ? (k==='bank'?'Add bank account':'Add personal details') : stage===2 ? 'Confirm details' : 'Confirm');
    $('.progress i', el).style.width = (6 + stage*4) + '%';
  }

  const toStage = (s)=>{ S.stage = s; S.maxStage = Math.max(S.maxStage, s); layout(s); };
  $('#prev', el).addEventListener('click', ()=>{ if(S.stage>0) toStage(S.stage-1); });
  $('#next', el).addEventListener('click', ()=>{ if(S.stage<2) $('#cta', el).click(); });
  cards.forEach((c,i)=>c.addEventListener('click', (e)=>{
    if(e.target.closest('[data-edit],[data-add]')) return;
    if(i>S.stage && i<=S.maxStage) toStage(i);
  }));
  el.addEventListener('click', (e)=>{
    const ed = e.target.closest('[data-edit]'); const ad = e.target.closest('[data-add]');
    const k = ed ? ed.dataset.edit : ad ? ad.dataset.add : null;
    if(!k || (ed && !ed.textContent)) return;
    if(k==='pan') go('panManual','push',{edit:true});
    if(k==='bank') go('bankVerify','push');
    if(k==='personal') go('pq','push',{i:0});
  });
  $('#cta', el).addEventListener('click', ()=>{
    const s = S.stage, k = ['pan','bank','personal'][s];
    if(k==='bank' && !d.bank) return go('bankVerify','push');
    if(k==='personal' && !d.personal) return go('pq','push',{i:0});
    if(s<2){ toStage(s+1); return; }
    celebrateCta(el, 'Confirmed!', ()=>go('signature'));
  });

  // initial placement
  requestAnimationFrame(()=>{
    measure();
    if(p.intro==='fetch'){
      layout(0, true);
      cards.forEach((c,i)=>{ c.style.transition='none'; c.style.opacity=0; c.style.transform += ` translateY(${70+i*30}px)`; });
      $('.rv-head',el).style.opacity = 0;
      el.classList.add('fetching');
      runFetch(el, ()=>{
        el.classList.remove('fetching');
        $('.rv-head',el).style.transition='opacity .6s ease'; $('.rv-head',el).style.opacity=1;
        cards.forEach((c,i)=>{ setTimeout(()=>{ c.style.transition=''; c.style.opacity=1; layout(0); }, 120+i*90); });
        setTimeout(()=>{ const pc=$('.pan',el); pc && pc.insertAdjacentHTML('beforeend','<div class="sheen"></div>'); }, 700);
      });
    } else {
      const st = p.stage!=null ? p.stage : S.stage;
      S.stage = st; S.maxStage = Math.max(S.maxStage, st);
      const from = p.revealFrom;
      layout(st, true);
      if(p.justAdded){
        const c = cards[st]; const body = $('.c-body', c);
        body.classList.add('just-added');
        body.insertAdjacentHTML('beforeend', '<div class="sheen-ov"></div>');
        setTimeout(()=>{ toast(`${I.check('#7be0b3',14)} ${p.justAdded}`); }, 450);
      }
    }
  });
};

function runFetch(el, done){
  const panOk = S.scn.panAuto || S.d.panReady, bankOk = !!S.d.bank;
  const items = [
    ['Searching linked PAN', panOk ? null : 'No PAN linked to this number'],
    ['Fetching details from your PAN', null],
    ['Verifying Bank Account', bankOk ? null : 'No bank account found — add it next'],
  ];
  const sh = sheet({cls:'lav fetch-sheet', blur:true, html:`
    <div class="box-anim" id="boxAnim"></div>
    <div class="sheet-title" id="ft">Securely fetching details</div>
    <ul class="checklist"><div class="div"></div>${items.map(it=>`<li><span class="ck"><svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 4.5 8.5 2 6"/></svg></span><span class="tx">${it[0]}</span></li>`).join('')}</ul>`});
  // folder animation (Lottie from Claude motion); falls back to the static render
  const holder = $('#boxAnim', sh.el); let anim = null;
  if(window.lottie && window.FOLDER_ANIM){
    anim = lottie.loadAnimation({ name:'folder', container:holder, renderer:'svg', loop:true, autoplay:true, animationData:window.FOLDER_ANIM, rendererSettings:{preserveAspectRatio:'xMidYMid meet'} });
  } else holder.innerHTML = `<img src="${A}box.png" alt="" style="width:78%;margin:11%">`;
  const _close = sh.close; sh.close = ()=>{ _close(); setTimeout(()=>anim && anim.destroy(), 600); };
  const lis = $$('li', sh.el);
  const step = (i)=>{
    if(i>=lis.length){ later(()=>{ sh.close(); later(done, 260); }, 650); return; }
    lis[i].classList.add('run');
    later(()=>{
      lis[i].classList.remove('run');
      if(items[i][1] && i===0){       // PAN not found -> no error; go straight to manual PAN entry
        go('panManual','push');
        return;
      }
      if(items[i][1]){
        lis[i].classList.add('fail'); $('.tx',lis[i]).textContent = items[i][1];
        $('.ck',lis[i]).innerHTML = I.warn;
      } else lis[i].classList.add('done');
      step(i+1);
    }, 950);
  };
  later(()=>step(0), 700);
}

/* ---------- MANUAL: PAN entry ---------- */
SCREENS.panManual = (el, p)=>{
  const edit = !!p.edit;
  el.innerHTML = `<div class="bg-lav"></div>${topnav(6)}
    <div class="hero z" style="margin-top:6px"><div class="h1">PAN Details</div>${edit?'':'<div class="sub">We\'ll use this to fetch your KYC records</div>'}</div>
    <div class="mform z" style="margin-top:30px">
      <div><div class="flabel"><span>PAN number</span><span id="pfmt" class="fmt"></span></div>
        <div class="field" id="pf"><div class="fi" id="pfi"></div><span class="suffix" id="psfx"></span></div>
        <div class="helper" id="ph"><span style="display:inline-flex;gap:4px;align-items:center">${I.shield} This will help us verify your identity</span></div></div>
      <div><div class="flabel"><span>Date of birth</span></div>
        <div class="field" id="df"><div class="fi" id="dfi"><span class="ph">DD/MM/YYYY</span></div><span class="suffix">${I.cal}</span></div>
        <div class="helper" id="dh"></div></div>
    </div>
    ${cta('Update details',{disabled:true})}`;
  wireNav(el, ()=>{ if(edit) go('review','pop',{stage:0}); else go('email','pop'); });
  let dob = edit ? S.d.dob : '';
  const panRe = /^[A-Z]{5}\d{4}[A-Z]$/;
  const fmtHint = (v)=>{ const n=v.length; return n<5?'Letters':n<9?'Numbers':n<10?'Letter':''; };
  const validate = ()=>{ const ok = panRe.test(pan.value) && !!dob; setCta(el, ok); return ok; };
  const pan = FI.create($('#pfi', el), {
    kb:'alpha', caps:true, max:10, upper:true, placeholder:'ABCDE1234F', value: edit ? S.d.pan : '',
    allow:(c,v)=>{ const n=v.length; return n<5||n===9 ? /[A-Za-z]/.test(c) : /\d/.test(c); },
    onChange:(v)=>{
      const n=v.length;
      // smart keyboard: letters → numbers → letter (PAN format)
      if(KB.el){ const want = (n>=5 && n<9) ? 'num' : 'alpha'; if(KB.page!==want){ KB.page=want; KB.caps=true; KB.renderRows(); } }
      $('#pfmt',el).textContent = n<10 ? `Next: ${fmtHint(v).toLowerCase()}` : '';
      $('#pf',el).classList.remove('err');
      const ph=$('#ph',el);
      if(n===10 && panRe.test(v)){ $('#psfx',el).innerHTML=`<span class="okdot">${I.check('#fff',10)}</span>`; ph.className='helper ok'; ph.textContent='Valid PAN format'; later(()=>{ if(!dob) openDob(); else pan.blur(); }, 450); }
      else { $('#psfx',el).innerHTML=''; ph.className='helper'; ph.innerHTML=`<span style="display:inline-flex;gap:4px;align-items:center">${I.shield} This will help us verify your identity</span>`; }
      validate();
    },
    onSubmit:()=>{ if(panRe.test(pan.value)) openDob(); }
  });
  const showDob = ()=>{ if(dob){ $('#dh',el).textContent=''; } $('#dfi',el).innerHTML = dob ? dob : '<span class="ph">DD/MM/YYYY</span>'; $('#df',el).classList.toggle('ok', !!dob); };
  showDob();
  const panError = ()=>{
    const ph=$('#ph',el); $('#pf',el).classList.remove('err'); void $('#pf',el).offsetWidth; $('#pf',el).classList.add('err');
    ph.className='helper err';
    const n=pan.value.length;
    ph.textContent = n===0 ? 'Enter your PAN number' : n<10 ? `PAN has 10 characters — ${10-n} more to go (e.g. ABCDE1234F)` : 'Enter a valid PAN, e.g. ABCDE1234F';
  };
  el._invalid = ()=>{
    if(!panRe.test(pan.value)){ panError(); pan.focus(); }
    else if(!dob){ $('#dh',el).className='helper err'; $('#dh',el).textContent='Select your date of birth'; openDob(); }
  };
  function openDob(){
    if(pan.value && !panRe.test(pan.value)) panError();
    if(FI.active) FI.blur();
    $('#df',el).classList.add('focus');
    const init = dob ? dob.split('/').map(Number) : [19,8,1994];
    wheelPicker(init, (val)=>{ $('#df',el).classList.remove('focus'); if(val){ dob=val; showDob(); validate(); } else showDob(); });
  }
  $('#df', el).addEventListener('click', openDob);
  // demo shortcut: tapping the empty PAN field types a sample PAN in (then the DOB picker opens on its own)
  $('#pf', el).addEventListener('click', ()=>{ if(!pan.value) later(()=>pan.setValue('ABCDE1234F', true), 180); });
  validate();
  $('#cta', el).addEventListener('click', ()=>{
    if(!validate()) return;
    if(FI.active) FI.blur();
    S.d.pan = pan.value; S.d.dob = dob;
    verifyPan(el, edit);
  });
};
function verifyPan(el, edit){
  const sh = sheet({cls:'lav', blur:true, html:`<div class="vpan">
      <div class="vpan-card">${panArt({name:'',father:'',dob:'',pan:S.d.pan})}</div>
      <div class="sheet-title" id="vt">Verifying your PAN</div><div class="sheet-sub dots" id="vs">Checking with Income Tax records</div></div>`});
  const card = $('.pan', sh.el);
  const typeInto = (f, text, cb)=>{ const n=$(`[data-f="${f}"]`, card); n.classList.add('typing'); let i=0; const t=()=>{ n.textContent=text.slice(0,++i); if(i<text.length) later(t, 45); else { n.classList.remove('typing'); cb&&cb(); } }; t(); };
  later(()=>typeInto('name', S.d.name, ()=>typeInto('father', S.d.father, ()=>typeInto('dob', S.d.dob, ()=>{
    card.insertAdjacentHTML('beforeend','<div class="sheen"></div>');
    $('#vt',sh.el).textContent='PAN verified'; $('#vs',sh.el).className='sheet-sub'; $('#vs',sh.el).textContent=`Welcome, ${S.d.name.split(' ')[0][0]+S.d.name.split(' ')[0].slice(1).toLowerCase()}!`;
    S.d.panReady = true;
    later(()=>{ if(edit) go('review','dissolve',{stage:0, justAdded:'PAN details updated'}); else go('review','dissolve',{intro:'fetch'}); }, 1200);
  }))), 900);
}

/* iOS wheel date picker (UIDatePicker .wheels) */
function wheelPicker([dd,mm,yy], cb){
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = []; for(let y=1940;y<=2008;y++) years.push(y);
  const days = Array.from({length:31},(_,i)=>i+1);
  const IH = 34;
  const col = (cls, arr, fmt=x=>x)=>`<div class="wcol ${cls}"><div class="wpad"></div>${arr.map(v=>`<div class="wi" data-v="${v}">${fmt(v)}</div>`).join('')}<div class="wpad"></div></div>`;
  const sh = sheet({cls:'wheel-sheet', grab:false, html:`<div class="wbar"><button id="wc">Cancel</button><button id="wd" class="bold">Done</button></div>
    <div class="wheel"><div class="wsel"></div>${col('d',days)}${col('m',months.map((m,i)=>i+1), v=>months[v-1])}${col('y',years)}</div>`, onScrim:()=>{ sh.close(); cb(null); }});
  const cols = $$('.wcol', sh.el);
  const arrs = [days, months.map((m,i)=>i+1), years];
  const vals = [dd, mm, yy];
  const daysIn = (m,y)=>new Date(y, m, 0).getDate();
  function paint(c){
    const center = c.scrollTop;
    $$('.wi', c).forEach((w,i)=>{
      const off = (i*IH - center)/IH;
      const a = Math.max(-4, Math.min(4, off));
      const ang = a*19;
      const y = Math.sin(ang*Math.PI/180)*(IH/(19*Math.PI/180)) - a*IH;
      w.style.transform = `perspective(520px) translateY(${y}px) rotateX(${-ang}deg)`;
      w.style.color = Math.abs(off) < 0.5 ? '#000' : 'rgba(60,60,67,.6)';
    });
  }
  function fixDays(){ const max = daysIn(vals[1], vals[2]); $$('.wi', cols[0]).forEach((w,k)=>w.style.opacity = k+1 > max ? .3 : 1); return max; }
  function settle(ci){
    const c = cols[ci]; let i = Math.round(c.scrollTop/IH);
    if(ci===0) i = Math.min(i, daysIn(vals[1], vals[2])-1);
    i = Math.max(0, Math.min(arrs[ci].length-1, i));
    vals[ci] = arrs[ci][i];
    if(Math.abs(c.scrollTop - i*IH) > 0.5) c.scrollTo({top:i*IH, behavior:'smooth'});
    const max = fixDays();
    if(vals[0] > max){ vals[0]=max; cols[0].scrollTo({top:(max-1)*IH, behavior:'smooth'}); }
  }
  cols.forEach((c,ci)=>{
    requestAnimationFrame(()=>{ c.scrollTop = arrs[ci].indexOf(vals[ci])*IH; paint(c); fixDays(); });
    let to;
    c.addEventListener('scroll', ()=>{ paint(c); clearTimeout(to); to = setTimeout(()=>settle(ci), 110); }, {passive:true});
    c.addEventListener('click', e=>{ const w=e.target.closest('.wi'); if(!w || c._dragged) return; c.scrollTo({top:arrs[ci].indexOf(+w.dataset.v)*IH, behavior:'smooth'}); });
    let dragY=null, startTop=0, vel=0, lastY=0, lastT=0;
    c.addEventListener('pointerdown', e=>{ if(e.pointerType!=='mouse') return; dragY=e.clientY; startTop=c.scrollTop; lastY=e.clientY; lastT=performance.now(); vel=0; c._dragged=false; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', e=>{ if(dragY===null) return; const now=performance.now(); vel=(lastY-e.clientY)/Math.max(1,now-lastT); lastY=e.clientY; lastT=now; if(Math.abs(dragY-e.clientY)>3) c._dragged=true; c.scrollTop = startTop + (dragY - e.clientY); });
    c.addEventListener('pointerup', ()=>{ if(dragY===null) return; dragY=null; if(c._dragged) c.scrollBy({top: vel*240, behavior:'smooth'}); setTimeout(()=>c._dragged=false, 50); });
  });
  $('#wc', sh.el).addEventListener('click', ()=>{ sh.close(); cb(null); });
  $('#wd', sh.el).addEventListener('click', ()=>{ sh.close(); cb(`${String(vals[0]).padStart(2,'0')}/${String(vals[1]).padStart(2,'0')}/${vals[2]}`); });
}

/* ---------- MANUAL: Bank — choose UPI / manual ---------- */
SCREENS.bankVerify = (el)=>{
  const apps = [['Google Pay','gpay'],['PhonePe','phonepe'],['Paytm','paytm'],['CRED','cred'],['Other UPI apps','other']];
  el.innerHTML = `<div class="bg-lav"></div>${topnav(14)}
    <div class="hero z" style="margin-top:6px"><div class="h1" style="font-size:28px">Verify your bank</div><div class="sub">We'll hold ₹1 for verification, then refund it.</div></div>
    <div class="z upi-list" style="margin:28px 20px 0">${apps.map(([n,k],i)=>`<label class="upi ${i===0?'on':''}" data-k="${k}"><span class="upi-ic ${k}">${upiIcon(k)}</span><span>${n}</span>${i===0?'<em class="rec">Recommended</em>':''}<i class="radio"></i></label>`).join('')}</div>
    <div class="z or" style="margin:22px 60px 12px">or</div>
    <div class="z" style="text-align:center"><a class="link-u" id="man" style="font-size:13px;cursor:pointer">Enter bank details manually</a></div>
    ${cta('Verify with Google Pay')}`;
  wireNav(el, ()=>go('review','pop',{stage:1}));
  let sel = 'gpay';
  $$('.upi', el).forEach(l=>l.addEventListener('click', ()=>{ $$('.upi',el).forEach(x=>x.classList.remove('on')); l.classList.add('on'); sel=l.dataset.k; setCta(el, true, sel==='other'?'Pay with UPI app':`Verify with ${$('span:nth-child(2)',l).textContent}`); }));
  $('#man', el).addEventListener('click', ()=>go('bankManual','push'));
  $('#cta', el).addEventListener('click', ()=>{ $('#cta',el).classList.add('loading'); later(()=>go('gpay','rise'), 600); });
};
function upiIcon(k){
  if(k==='gpay') return `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 4 4 12l4 4 8-8Z" fill="#EA4335"/><path d="M16 8 8 16l4 4 8-8Z" fill="#4285F4"/><path d="M4 12l4 4 4-4-4-4Z" fill="#FBBC04"/><path d="M12 12l4 4 4-4-4-4Z" fill="#34A853"/></svg>`;
  if(k==='phonepe') return `<span style="color:#fff;font-weight:700;font-size:12px">पे</span>`;
  if(k==='paytm') return `<span style="color:#00baf2;font-weight:800;font-size:9px;letter-spacing:-.3px">pay<b style="color:#012b72">tm</b></span>`;
  if(k==='cred') return `<span style="color:#fff;font-weight:700;font-size:9px;letter-spacing:.5px">CRED</span>`;
  return `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 4h5l-3 8h4l-6 9 2-7H4Z" fill="#097939"/><path d="M14 4h5l-3 8h4l-6 9 2-7h-4Z" fill="#ed752e"/></svg>`;
}

/* GPay hand-off (simulated app switch) */
SCREENS.gpay = (el)=>{
  statusLight(true);
  el.classList.add('gpay');
  el.innerHTML = `<div class="gp-top"><div class="gp-back">◀ Upstox</div><div class="gp-logo">${upiIcon('gpay').replace(/20/g,'34')}</div></div>
    <div class="gp-sheet"><div class="gp-amt">₹1</div><div class="gp-to">Paying UPSTOX SECURITIES</div>
      <div class="gp-acct"><span class="gp-bl" style="background:#95144C">${BANKS.axis.logo.replace('width="28" height="28"','width="20" height="20"')}</span><div><b>Axis Bank Ltd. ••••1943</b><small>Savings account</small></div>${I.chev}</div>
      <button class="gp-btn" id="pay">Proceed to pay</button></div>`;
  $('#pay', el).addEventListener('click', ()=>upiPin(el));
  $('.gp-back', el).addEventListener('click', ()=>go('bankVerify','pop'));
};
function upiPin(el){
  statusLight(false);
  const sh = sheet({cls:'upi-pin', grab:false, scrim:true, html:`<div class="up-head"><div><b>Axis Bank Ltd.</b><small>XX1943</small></div><span class="up-logo">UPI</span></div>
    <div class="up-strip"><span>Sending: ₹1.00</span><span>To: UPSTOX</span></div>
    <div class="up-body"><small>ENTER 4-DIGIT UPI PIN</small><div class="up-dots"><i></i><i></i><i></i><i></i></div></div>`});
  const dots = $$('.up-dots i', sh.el);
  const fi = FI.create(h('<div></div>'), { kb:'num', max:4, allow:c=>/\d/.test(c), onChange:(v)=>{
    dots.forEach((d,i)=>d.classList.toggle('on', i<v.length));
    if(v.length===4){ fi.blur(); later(()=>{ sh.close(); gpaySuccess(el); }, 300); }
  }});
  later(()=>fi.focus(), 380);
}
function gpaySuccess(el){
  el.insertAdjacentHTML('beforeend', `<div class="gp-done"><div class="gp-tick"><svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path class="t" d="M5 12.5 10 17l9-10"/></svg></div><div class="gp-dt">₹1 paid to UPSTOX</div></div>`);
  later(()=>{ go('bankVerifying','dissolve',{via:'upi'}); }, 1700);
}

/* Verifying bank (after UPI or manual) */
SCREENS.bankVerifying = (el, p)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(14,{back:false})}<div class="hero z" style="margin-top:6px;filter:blur(3px);opacity:.5"><div class="h1" style="font-size:28px">Verify your bank</div></div>`;
  const via = p.via;
  // Figma 8168:39756 (loading) → 8168:39798 (verified)
  const sh = sheet({cls:'vb-sheet', blur:true, html:`<div class="vb">
      <div class="vb-art"><img class="vb-bank" src="${A}bank3d.png" alt=""><img class="vb-ok" src="${A}bank-ok.png" alt=""></div>
      <div class="vb-t" id="bt">Verifying your bank</div>
      <div class="vb-dots" id="bd"><i></i><i></i><i></i></div>
    </div>`});
  later(()=>{
    if(via==='manual' && S.scn.pennyFail){ sh.close(); later(()=>bankFail(el), 300); return; }
    sh.el.classList.add('done');
    $('#bt', sh.el).textContent = 'Verified';
    S.d.bank = via==='upi' ? {...DEF_BANK, acct:'XXXX XXXX XXXX 1943', ifsc:'UTIB0000123'} : S.d.pendingBank;
    later(()=>go('review','dissolve',{stage:1, justAdded:'Bank account added'}), 1500);
  }, 2700);
};
function bankFail(el){
  const sh = sheet({cls:'lav', html:`<div class="success" style="padding-top:22px"><div class="fail-ic">${I.bank('#8a8a8a').replace('width="22" height="22"','width="60" height="60"')}<span>!</span></div>
    <div class="sheet-title">Unable to verify</div><div class="sheet-sub">We couldn't deposit ₹1 to this account. Upload a bank proof instead — it takes a minute.</div></div>
    <div style="padding:0 20px;display:flex;flex-direction:column;gap:10px"><button class="cta" id="up"><span>Upload bank proof</span></button><button class="cta ghost" id="tr"><span>Try another bank</span></button></div>`});
  $('#up', sh.el).addEventListener('click', ()=>go('bankProof','push'));
  $('#tr', sh.el).addEventListener('click', ()=>go('bankManual','pop'));
}

/* Manual bank entry */
const IFSC_DB = { HDFC:['hdfc','HDFC BANK','HDFC Bank'], ICIC:['icici','ICICI BANK','ICICI Bank'], SBIN:['sbi','STATE BANK OF INDIA','State Bank of India'], UTIB:['axis','AXIS BANK','Axis Bank'], KKBK:['kotak','KOTAK MAHINDRA','Kotak Mahindra Bank'] };
const BRANCHES = ['Bhairav Enclave, Delhi - 110031','Andheri West, Mumbai - 400053','Koramangala, Bengaluru - 560034','Anna Nagar, Chennai - 600040'];
SCREENS.bankManual = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(14)}
    <div class="hero z" style="margin-top:6px"><div class="h1" style="font-size:28px">Enter bank details</div><div class="sub">We'll hold ₹1 for verification, then refund it.</div></div>
    <div class="mform z" style="margin-top:26px">
      <div><div class="flabel">Account type</div><div class="chips" id="atype"><button class="chip-o on">Savings</button><button class="chip-o">Current</button></div></div>
      <div><div class="flabel"><span>IFSC code</span><a class="link" id="noifsc" style="font-weight:500">Don't know IFSC?</a></div><div class="field" id="if"><div class="fi" id="ifi"></div><span class="suffix" id="isfx"></span></div><div class="helper" id="ih">e.g. HDFC0001234</div></div>
      <div><div class="flabel">Account number</div><div class="field" id="af"><div class="fi" id="afi"></div></div><div class="helper" id="ah"></div></div>
    </div>
    ${cta('Verify bank account',{disabled:true})}`;
  wireNav(el, ()=>go('bankVerify','pop'));
  $$('#atype .chip-o', el).forEach(b=>b.addEventListener('click', ()=>{ $$('#atype .chip-o',el).forEach(x=>x.classList.remove('on')); b.classList.add('on'); }));
  let bankInfo = null;
  const check = ()=>{ setCta(el, !!bankInfo && acct.value.length>=9); };
  const ifsc = FI.create($('#ifi', el), {
    kb:'alpha', caps:true, upper:true, max:11, placeholder:'HDFC0001234',
    allow:(c,v)=>{ const n=v.length; return n<4 ? /[A-Za-z]/.test(c) : n===4 ? c==='0' : /[A-Za-z0-9]/.test(c); },
    onChange:(v)=>{
      const n=v.length;
      if(KB.el){ const want = n===4 ? 'num' : n<4 ? 'alpha' : KB.page; if(KB.page!==want){ KB.page=want; KB.caps=true; KB.renderRows(); } }
      const ih=$('#ih',el); bankInfo=null; $('#isfx',el).innerHTML=''; $('#if',el).classList.remove('ok');
      if(n===11){
        $('#isfx',el).innerHTML='<span class="mini-spin"></span>';
        later(()=>{
          const db = IFSC_DB[v.slice(0,4)] || ['generic', v.slice(0,4)+' BANK', v.slice(0,4)+' Bank'];
          const br = BRANCHES[v.charCodeAt(10)%BRANCHES.length];
          bankInfo = { logo:db[0], name:db[1], short:db[2], branch:br.split(',')[0], full:br };
          $('#isfx',el).innerHTML = `<span class="blogo-s">${(BANKS[db[0]]||BANKS.generic).logo.replace(/width="2\d" height="2\d"/,'width="18" height="18"')}</span>`;
          $('#if',el).classList.add('ok');
          ih.className='helper'; ih.innerHTML = `<span class="ifsc-ok">🏛 ${db[2]} · ${br}</span>`;
          check(); later(()=>acct.focus(), 500);
        }, 700);
      } else { ih.className='helper'; ih.textContent = 'e.g. HDFC0001234'; }
      check();
    },
    suggest:{words:['HDFC0001234','ICIC0000104','SBIN0001707']}
  });
  const acct = FI.create($('#afi', el), { kb:'num', max:18, allow:c=>/\d/.test(c), placeholder:'Enter account number',
    format:v=>v.replace(/(\d{4})(?=\d)/g,'$1 '),
    onChange:(v)=>{ $('#ah',el).textContent = v.length && v.length<9 ? 'Account numbers are 9–18 digits' : ''; $('#ah',el).className = 'helper'; check(); }, onSubmit:()=>{} });
  $('#noifsc', el).addEventListener('click', ()=>ifscSearch((code)=>{ ifsc.setValue(code); }));
  later(()=>ifsc.focus(), 450);
  $('#cta', el).addEventListener('click', ()=>{
    if(FI.active) FI.blur();
    S.d.pendingBank = { logo:bankInfo.logo, name:bankInfo.name, short:bankInfo.short, branch:bankInfo.branch, acct:acct.value.replace(/(\d{4})(?=\d)/g,'$1 '), holder:S.d.name, ifsc:ifsc.value };
    $('#cta',el).classList.add('loading');
    later(()=>go('bankVerifying','dissolve',{via:'manual'}), 500);
  });
};
function ifscSearch(cb){
  const banks = [['hdfc','HDFC Bank','HDFC0001234'],['icici','ICICI Bank','ICIC0000104'],['sbi','State Bank of India','SBIN0001707'],['axis','Axis Bank','UTIB0000123'],['kotak','Kotak Mahindra','KKBK0000958'],['generic','Other banks','']];
  const sh = sheet({html:`<div class="ifs"><div class="ifs-t">Find your IFSC</div><div class="ifs-s">Pick your bank, then your branch</div>
    <div class="bank-grid">${banks.map(b=>`<button data-c="${b[2]}" data-n="${b[1]}"><span class="bg-ic">${(BANKS[b[0]]||BANKS.generic).logo.replace(/width="2\d" height="2\d"/,'width="24" height="24"')}</span>${b[1]}</button>`).join('')}</div>
    <div class="ifs-branches"></div></div>`, onScrim:()=>sh.close()});
  sh.el.addEventListener('click', e=>{
    const b = e.target.closest('.bank-grid button');
    if(b){ $$('.bank-grid button', sh.el).forEach(x=>x.classList.toggle('on', x===b));
      const base = b.dataset.c || 'HDFC0001234';
      $('.ifs-branches', sh.el).innerHTML = `<div class="search-list" style="margin:16px 0 0">${BRANCHES.map((br,i)=>`<div class="it" style="animation-delay:${i*50}ms" data-code="${base.slice(0,10)}${'4371'[i]}"><div><b>${br.split(',')[0]}</b><small>${br.split(',').slice(1).join(',').trim()} · ${base.slice(0,10)}${'4371'[i]}</small></div>${I.chevR}</div>`).join('')}</div>`;
      return; }
    const it = e.target.closest('.it'); if(it){ sh.close(); setTimeout(()=>cb(it.dataset.code), 300); }
  });
}

/* Bank proof upload */
SCREENS.bankProof = (el)=>{
  const docs = [['Bank statement','Last 6 months, PDF'],['Cancelled cheque','Name must be printed'],['First page of passbook','With account number & IFSC']];
  el.innerHTML = `<div class="bg-lav"></div>${topnav(16)}
    <div class="hero z" style="margin-top:6px"><div class="h1" style="font-size:28px">Upload bank proof</div><div class="sub">Select a document that shows your name,<br>account number and IFSC</div></div>
    <div class="z doc-list" style="margin:26px 20px 0">${docs.map((d,i)=>`<label class="upi doc ${i===1?'on':''}"><span class="upi-ic doc-ic">${I.upload}</span><span><b>${d[0]}</b><small>${d[1]}</small></span><i class="radio"></i></label>`).join('')}</div>
    <div class="z" style="margin:16px 20px 0"><div class="upload" id="upl"><span class="ic">${I.upload}</span><div><b id="ub">Choose file</b><small id="us">JPG, PNG or PDF · up to 5 MB</small></div></div></div>
    ${cta('Submit',{disabled:true})}`;
  wireNav(el, ()=>go('bankManual','pop'));
  $$('.doc', el).forEach(l=>l.addEventListener('click', ()=>{ $$('.doc',el).forEach(x=>x.classList.remove('on')); l.classList.add('on'); }));
  $('#upl', el).addEventListener('click', ()=>{
    const u=$('#upl',el); if(u.classList.contains('busy')) return; u.classList.add('busy');
    $('#ub',el).textContent='cheque_nidhi.jpg'; $('#us',el).innerHTML='<span class="upbar"><i></i></span>';
    requestAnimationFrame(()=>requestAnimationFrame(()=>$('.upbar i',el).style.width='100%'));
    later(()=>{ u.classList.add('done'); $('#us',el).textContent='Uploaded · 1.2 MB'; setCta(el,true); }, 1500);
  });
  $('#cta', el).addEventListener('click', ()=>{
    const sh = success('Bank proof submitted','We\'ll verify it within 24 hours');
    S.d.bank = { ...(S.d.pendingBank||DEF_BANK), pending:true };
    later(()=>go('review','dissolve',{stage:1, justAdded:'Bank proof submitted'}), 2700);
  });
};

/* ---------- MANUAL: personal details (one question per screen) ---------- */
const PQ = [
  { k:'occupation', q:'What do you do?', sub:'Your occupation', opts:['Salaried','Self-employed','Business','Student','Retired','Homemaker'] },
  { k:'income', q:'Your annual income', sub:'This helps us set the right trading limits', opts:['< 1 lakh','1 – 5 lakhs','> 5 lakhs','10 – 25 lakhs','> 25 lakhs'] },
  { k:'marital', q:'Marital status', sub:'Required by SEBI for KYC', opts:['Unmarried','Married','Other'] },
  { k:'addr', q:'Where do you live?', sub:'Your correspondence address', addr:true },
];
SCREENS.pq = (el, p)=>{
  const i = p.i||0, Q = PQ[i];
  S.d.pdraft = S.d.pdraft || { gender:'Female' };
  const pct = 18 + i*4;
  el.innerHTML = `<div class="bg-lav"></div>${topnav(pct)}
    <div class="z pq-count">${i+1} of ${PQ.length}</div>
    <div class="hero z stg" style="margin-top:4px"><div class="h1" style="font-size:28px">${Q.q}</div><div class="sub">${Q.sub}</div></div>
    ${Q.addr ? `<div class="mform z stg" style="margin-top:26px">
        <div class="float"><div class="field" id="pinf"><div class="fi" id="pin"></div><span class="suffix" id="pinsfx"></span></div><span class="fl">Pincode</span></div>
        <div class="row2" id="cityRow" style="opacity:.4"><div class="ro"><small>City</small><b id="city">—</b></div><div class="ro"><small>State</small><b id="state">—</b></div></div>
        <div class="float"><div class="field" id="l1f"><div class="fi" id="l1"></div></div><span class="fl">Flat, house no., building</span></div>
        <div class="float"><div class="field" id="l2f"><div class="fi" id="l2"></div></div><span class="fl">Area, street</span></div>
      </div>${cta('Save address',{disabled:true})}`
    : `<div class="z opts stg" style="margin-top:28px">${Q.opts.map(o=>`<button class="opt-row ${S.d.pdraft[Q.k]===o?'on':''}" data-v="${o}"><span>${o}</span><i class="radio"></i></button>`).join('')}</div>`}`;
  wireNav(el, ()=>{ if(i===0) go('review','pop',{stage:2}); else go('pq','pop',{i:i-1}); });
  if(!Q.addr){
    $$('.opt-row', el).forEach(b=>b.addEventListener('click', ()=>{
      $$('.opt-row',el).forEach(x=>x.classList.remove('on')); b.classList.add('on');
      S.d.pdraft[Q.k] = b.dataset.v;
      later(()=>go('pq','push',{i:i+1}), 380);      // tap auto-advances
    }));
    return;
  }
  const PINS = { '600040':['Chennai','Tamil Nadu'], '400053':['Mumbai','Maharashtra'], '560034':['Bengaluru','Karnataka'], '110031':['Delhi','Delhi'] };
  let place = null;
  const check = ()=>setCta(el, !!place && l1.value.length>2 && l2.value.length>2);
  const pin = FI.create($('#pin', el), { kb:'num', max:6, allow:c=>/\d/.test(c), suggest:{words:['600040','400053','560034']},
    onChange:(v)=>{ place=null; $('#cityRow',el).style.opacity=.4; $('#city',el).textContent='—'; $('#state',el).textContent='—'; $('#pinsfx',el).innerHTML='';
      if(v.length===6){ $('#pinsfx',el).innerHTML='<span class="mini-spin"></span>'; later(()=>{ place = PINS[v] || ['Pune','Maharashtra']; $('#pinsfx',el).innerHTML=`<span class="okdot">${I.check('#fff',10)}</span>`; $('#city',el).textContent=place[0]; $('#state',el).textContent=place[1]; $('#cityRow',el).style.opacity=1; $('#cityRow',el).classList.add('pop-in'); check(); later(()=>l1.focus(), 350); }, 600); }
      check(); } });
  const l1 = FI.create($('#l1', el), { kb:'alpha', autoCap:true, max:40, onChange:check, onSubmit:()=>l2.focus(), returnKey:'next', suggest:{words:['201, Vasundhara Nivas']} });
  const l2 = FI.create($('#l2', el), { kb:'alpha', autoCap:true, max:44, onChange:check, onSubmit:()=>{ if(!$('#cta',el).disabled) $('#cta',el).click(); }, returnKey:'done', suggest:{words:['Shanthi Colony, Anna Nagar West']} });
  later(()=>pin.focus(), 450);
  $('#cta', el).addEventListener('click', ()=>{
    if(FI.active) FI.blur();
    const dr = S.d.pdraft;
    S.d.personal = { gender:dr.gender, marital:dr.marital||'Unmarried', income:dr.income||'> 5 lakhs', occupation:dr.occupation||'Salaried', addr:`${l1.value}, ${l2.value}, ${place[0]}, ${place[1]}, ${pin.value}` };
    $('#cta',el).classList.add('loading');
    later(()=>go('review','dissolve',{stage:2, justAdded:'Personal details saved'}), 600);
  });
};

/* ---------- Signature ---------- */
SCREENS.signature = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(33)}
    <div class="hero z stg" style="margin-top:6px"><div class="h1" style="font-size:28px;line-height:34px">Draw your signature<br>on screen</div></div>
    <div class="sigpad z showdemo" id="pad"><div class="base"></div><span class="knob"></span>
      <img class="sig-gif" id="sgif" src="${A}signature.gif" alt="">
      <svg class="demo" viewBox="0 0 260 110" id="demo"><path d="M10 78c14-30 30-60 40-58 10 2-14 62-6 64 8 2 18-40 28-38 9 2 2 30 10 30 9 0 14-22 22-20 7 2 1 18 8 18 12 0 22-30 34-28 10 2-4 26 6 26 16 0 30-14 48-24 14-8 30-14 40-10"/></svg>
      <div class="ph" id="sph">Sign above the line · or tap to auto-sign</div>
      <canvas id="cv"></canvas></div>
    <button class="reset z" id="reset">Reset ${I.reset}</button>
    ${cta('Submit',{disabled:true})}`;
  wireNav(el, ()=>go('review','pop',{stage:2}));
  animateProgress(el, 8, 33);
  const cv = $('#cv', el), pad = $('#pad', el), ctx = cv.getContext('2d');
  const demo = $('#demo', el); const dp = $('path', demo); const L = dp.getTotalLength ? Math.ceil(dp.getTotalLength())+2 : 460;
  dp.style.strokeDasharray = L; dp.style.strokeDashoffset = L; demo.style.opacity = 0;
  // hint: Figma "sign here" animation (pen drawing a signature on the line), loops until the user signs
  const gif = $('#sgif', el);
  const showDemo = (on)=>{ pad.classList.toggle('showdemo', on); if(on){ gif.src = A+'signature.gif?r='+Date.now(); } };
  let drawn = false, drawing = false, pts = [], len = 0, moved = false;
  const fit = ()=>{ const r = pad.getBoundingClientRect(); const sc = r.width / pad.offsetWidth; cv.width = pad.offsetWidth*2; cv.height = pad.offsetHeight*2; ctx.scale(2,2); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#1d1d1f'; cv._sc = sc; };
  requestAnimationFrame(fit);
  const pos = (e)=>{ const r = cv.getBoundingClientRect(); return [(e.clientX-r.left)/cv._sc, (e.clientY-r.top)/cv._sc]; };
  const markDrawn = ()=>{ if(!drawn){ drawn=true; showDemo(false); $('#sph',el).style.opacity=0; } if(len>140) setCta(el, true); };
  cv.addEventListener('pointerdown', e=>{ drawing=true; moved=false; cv.setPointerCapture(e.pointerId); pts=[pos(e)]; });
  cv.addEventListener('pointermove', e=>{
    if(!drawing) return; const p = pos(e); const l = pts[pts.length-1]; const dx=p[0]-l[0], dy=p[1]-l[1]; const dist=Math.hypot(dx,dy); if(dist<1.2) return;
    moved = true; len += dist; pts.push(p);
    const w = Math.max(1.4, Math.min(3.4, 3.6 - dist*0.12));
    ctx.lineWidth = w; ctx.beginPath();
    if(pts.length>2){ const a=pts[pts.length-3], b=pts[pts.length-2]; ctx.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2); ctx.quadraticCurveTo(b[0],b[1],(b[0]+p[0])/2,(b[1]+p[1])/2); }
    else { ctx.moveTo(l[0],l[1]); ctx.lineTo(p[0],p[1]); }
    ctx.stroke(); markDrawn();
  });
  cv.addEventListener('pointerup', ()=>{ drawing=false; if(!moved && !drawn) autoSign(); });
  function autoSign(){
    drawn = true; showDemo(false); $('#sph',el).style.opacity=0; demo.style.transition='none'; demo.style.opacity=1; dp.style.transition='none'; dp.style.strokeDashoffset=L; void dp.getBoundingClientRect();
    dp.style.transition='stroke-dashoffset 1.8s cubic-bezier(.45,0,.3,1)'; dp.style.strokeDashoffset=0; len=999; later(()=>setCta(el,true), 1500);
  }
  $('#reset', el).addEventListener('click', ()=>{ ctx.clearRect(0,0,cv.width,cv.height); drawn=false; len=0; setCta(el,false); demo.style.opacity=0; $('#sph',el).style.opacity=1; $('#reset',el).classList.add('spin1'); setTimeout(()=>$('#reset',el).classList.remove('spin1'),500); dp.style.transition='none'; dp.style.strokeDashoffset=L; later(()=>showDemo(true), 200); });
  $('#cta', el).addEventListener('click', ()=>{ success('Signature saved!'); later(()=>go('selfieIntro','dissolve'), 2700); });
};

/* ---------- Selfie ---------- */
SCREENS.selfieIntro = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(68)}
    <div class="hero z stg" style="margin-top:6px"><div class="h1" style="font-size:28px;line-height:34px">One quick selfie to<br>confirm it's you</div></div>
    <div class="selfie-ill z" aria-hidden="true">
      <svg viewBox="0 0 260 260" width="260" height="260">
        <defs>
          <linearGradient id="si-ring" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(-130 .5 .5)"><stop offset="0" stop-color="#542087"/><stop offset=".45" stop-color="#975bd4"/><stop offset="1" stop-color="#975bd4" stop-opacity="0"/></linearGradient>
          <linearGradient id="si-head" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfaff"/><stop offset="1" stop-color="#dcd6e6"/></linearGradient>
          <linearGradient id="si-neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc8db"/><stop offset="1" stop-color="#e6e1ee"/></linearGradient>
          <linearGradient id="si-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a3bc4"/><stop offset="1" stop-color="#542087"/></linearGradient>
          <clipPath id="si-clip"><circle cx="130" cy="130" r="100"/></clipPath>
        </defs>
        <circle class="si-ring" cx="130" cy="130" r="118" fill="none" stroke="url(#si-ring)" stroke-width="7" stroke-linecap="round" stroke-dasharray="560 742" transform="rotate(130 130 130)"/>
        <circle cx="130" cy="130" r="100" fill="#f5effb"/>
        <g clip-path="url(#si-clip)">
          <path d="M38 236c8-30 34-46 66-50h52c32 4 58 20 66 50v30H38Z" fill="url(#si-body)"/>
          <path d="M100 186h60c-4 16-16 26-30 26s-26-10-30-26Z" fill="#fff"/>
          <path d="M112 150h36v38c-5 6-11 9-18 9s-13-3-18-9Z" fill="url(#si-neck)"/>
          <ellipse cx="91" cy="118" rx="7" ry="13" fill="#e2dceb"/><ellipse cx="169" cy="118" rx="7" ry="13" fill="#e2dceb"/>
          <path d="M130 52c-24 0-40 18-40 46v20c0 30 18 52 40 52s40-22 40-52V98c0-28-16-46-40-46Z" fill="url(#si-head)"/>
        </g>
      </svg>
    </div>
    <div class="tips z stg"><div>${I.eye} Look directly at camera</div><div>${I.sun} Use natural lighting</div><div>${I.okc} Keep face clearly visible</div></div>
    ${cta('Next')}`;
  wireNav(el, ()=>go('signature','pop'));
  animateProgress(el, 33, 68);
  $('#cta', el).addEventListener('click', async ()=>{
    const r = await iosAlert({title:'“Upstox” Would Like to Access the Camera', msg:'Upstox uses your camera to capture a selfie for KYC verification as required by SEBI.', actions:[{label:"Don't Allow"},{label:'Allow',bold:true}]});
    if(r===1) go('selfieCam','dissolve');
    else toast('Camera access is needed to complete KYC');
  });
};
SCREENS.selfieCam = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(68)}
    <div class="hero z"><div class="h2" id="ct" style="font-size:26px">Hold still</div></div>
    <div class="camwrap z"><div class="cam"><img src="${A}selfie-cam.jpg" alt=""><div class="scanline"></div></div>
    <svg class="cam-ring" viewBox="0 0 312 312"><circle class="track" cx="156" cy="156" r="153"/><circle class="prog" cx="156" cy="156" r="153"/></svg></div>
    <div class="z" style="position:absolute;left:0;right:0;top:560px;text-align:center">
      <div id="cs" style="font-size:14px;color:#262626;font-weight:500">Position your face in the circle</div>
      <button class="shutter" id="sh" disabled><i>${I.cam}</i></button>
      <div style="font-size:11px;color:#8a8a8a;margin-top:18px">Powered by Hyperverge</div>
    </div><div class="cam-flash"></div>`;
  wireNav(el, ()=>go('selfieIntro','pop'));
  const prog = $('.cam-ring .prog', el);
  later(()=>{ prog.style.strokeDashoffset = 0; $('#cs',el).textContent='Detecting face…'; }, 300);
  later(()=>{ $('#ct',el).textContent='Perfect!'; $('#ct',el).classList.add('pop-in'); $('#cs',el).textContent="Looking good. Let's take a photo"; $('#sh',el).disabled=false; $('.scanline',el).remove(); }, 2000);
  $('#sh', el).addEventListener('click', ()=>{
    $('.cam-flash',el).classList.add('go'); $('.cam img',el).style.animation='none';
    later(()=>{ success("Perfect, that's you!"); later(()=>go('questions','dissolve'), 2700); }, 450);
  });
};

/* ---------- Trading questions ---------- */
SCREENS.questions = (el)=>{
  const exp = ['No experience','Less than 1 year','1 to 5 years','5+ years'];
  const segs = ['Equity, Mutual Funds & IPO','Futures and Options','Commodities','Currency Derivatives'];
  el.innerHTML = `<div class="bg-ice"></div>${topnav(68)}
    <div class="hero z stg" style="margin-top:6px"><div class="h1" style="font-size:28px;letter-spacing:-1.12px;line-height:1.1">You’re almost there!</div><div class="sub" style="font-size:16px;line-height:28px;color:#777;margin-top:4px">A few quick questions to get you started</div></div>
    <div class="z" style="padding:40px 16px 0">
      <div class="qh">What is your trading experience?</div><div class="chips" id="q1">${exp.map(x=>`<button class="chip-o" data-v="${x}">${x}</button>`).join('')}</div>
      <div class="qh" style="margin-top:40px">Which trading segment interests you?</div><div class="qs">(You can select more than 1)</div><div class="chips" id="q2">${segs.map(x=>`<button class="chip-o" data-v="${x}">${x}</button>`).join('')}</div>
      <div class="qh" style="margin-top:40px">Do you want to add a nominee?</div><div class="qs">You can add it later from the accounts section</div><div class="chips" id="q3">${['Yes','No'].map(x=>`<button class="chip-o" data-v="${x}">${x}</button>`).join('')}</div>
    </div>${cta('Confirm',{disabled:true})}`;
  wireNav(el, ()=>go('selfieIntro','pop'));
  animateProgress(el, 68, 82);
  const upd = ()=>setCta(el, !!S.d.exp && S.d.segs.size>0 && !!S.d.nominee);
  $$('#q1 .chip-o', el).forEach(b=>b.addEventListener('click', ()=>{ $$('#q1 .chip-o',el).forEach(x=>x.classList.remove('on')); b.classList.add('on'); S.d.exp=b.dataset.v; upd(); }));
  $$('#q2 .chip-o', el).forEach(b=>b.addEventListener('click', ()=>{ b.classList.toggle('on'); b.classList.contains('on')?S.d.segs.add(b.dataset.v):S.d.segs.delete(b.dataset.v); upd(); }));
  $$('#q3 .chip-o', el).forEach(b=>b.addEventListener('click', ()=>{ $$('#q3 .chip-o',el).forEach(x=>x.classList.remove('on')); b.classList.add('on'); S.d.nominee=b.dataset.v; upd(); }));
  $('#cta', el).addEventListener('click', ()=>{
    const sh = sheet({cls:'lav', html:`<div class="success" style="padding-top:16px"><div class="hg-vid"><video src="${A}hourglass.mp4" autoplay muted loop playsinline></video></div><div class="sheet-title">You're almost there!</div><div class="sheet-sub">Just one quick eSign to finish your KYC.<br>Keep your Aadhaar handy.</div></div><div style="padding:0 16px"><button class="cta" id="es"><span>Continue to eSign</span></button></div>`});
    $('#es', sh.el).addEventListener('click', ()=>go('esign','rise'));
  });
};

/* ---------- eSign (in-app browser) ---------- */
SCREENS.esign = (el)=>{
  el.classList.add('safari');
  el.innerHTML = `<div class="sf-bar"><button id="sfd">Done</button><div class="sf-url">${I.lock}<span>upstox.com</span></div><span style="width:44px"></span></div>
    <div class="dg scroll">
      <div class="dg-top"><span class="dg-pill">${I.lock} digilocker.in</span><button class="dg-out">Forgot Aadhaar?</button></div>
      <div class="dg-doc"><div class="dg-logo">digio</div>
        <div class="dg-meta"><div><span>ASP</span><b>Digitech Solutions Private Limited</b></div><div><span>Transaction ID</span><b>ESIGN:24120909303835</b></div></div>
        <p class="dg-p"><b>I hereby authorize <i>CDSL Ventures Limited</i> to:</b><br>1. Use my Aadhaar / Virtual ID details (as applicable) for the purpose of eSign of documents requested using <i>CDSL Ventures Limited</i> eSign to authenticate my identity through the Aadhaar based e-KYC services of UIDAI.<br>2. Authenticate my Aadhaar / Virtual ID through OTP or Biometric for authenticating my identity through the Aadhaar Authentication system.<br>3. I understand that Security and confidentiality of personal identity data provided, for the purpose of Aadhaar based authentication is ensured.</p>
        <label class="dg-chk off" id="dgc"><i>${I.check('#fff',10)}</i><span>I have read all the above conditions and understood the same. I provide consent to authenticate my Aadhaar.</span></label>
        <div class="dg-l">Aadhaar Number/ Virtual ID</div>
        <div class="field dg-f" id="af"><div class="fi" id="afi"></div><span class="suffix">${I.eye}</span></div>
        <a class="dg-link">Generate your Virtual ID</a>
        <div class="dg-otp" id="dgotp" style="display:none"><div class="dg-l">Enter OTP sent to mobile linked with Aadhaar</div>${otpBoxes()}</div>
        <div class="dg-acts"><button class="dg-btn" id="so" disabled>Send OTP</button><a class="dg-cancel">Cancel</a></div>
      </div></div>`;
  $('#sfd', el).addEventListener('click', ()=>go('questions','dissolve'));
  const chk = $('#dgc', el); let ok = false;
  const upd = ()=>{ $('#so',el).disabled = !(ok && !chk.classList.contains('off')); };
  chk.addEventListener('click', e=>{ e.preventDefault(); chk.classList.toggle('off'); upd(); });
  const fi = FI.create($('#afi', el), { kb:'num', max:12, allow:c=>/\d/.test(c), placeholder:'Enter your 12 digit Aadhaar number',
    format:v=>v.replace(/(\d{4})(?=\d)/g,'$1 '), suggest:{words:['4521 8890 1234']},
    onChange:v=>{ ok = v.length===12; upd(); if(ok){ fi.blur(); if(chk.classList.contains('off')){ chk.classList.add('nudge'); setTimeout(()=>chk.classList.remove('nudge'),600);} } } });
  const _sv = fi.setValue.bind(fi); fi.setValue = (v,t)=>_sv(v.replace(/\s/g,''), t);
  $('#so', el).addEventListener('click', ()=>{
    const b=$('#so',el); b.textContent='Sending…'; b.disabled=true;
    later(()=>{ $('#dgotp',el).style.display='block'; b.textContent='Verify OTP';
      // keep OTP boxes + Verify button visible above the keyboard
      later(()=>revealAboveKb($('.dg',el), $('.dg-acts',el)), 480);
      bindOtp(el, {code:'482913', autoMs:1100, onDone:(v,ofi)=>{ ofi.blur(); b.textContent='Signing…';
        later(()=>{ success('Signed and done!'); later(()=>go('segments','dissolve'), 2700); }, 600); }});
    }, 800);
  });
  later(()=>{ fi.focus(); later(()=>revealAboveKb($('.dg',el), $('#af',el)), 450); }, 600);
  $('#af', el).addEventListener('click', ()=>later(()=>revealAboveKb($('.dg',el), $('#af',el)), 450));
};

/* ---------- Segment activation ---------- */
SCREENS.segments = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>
    <div class="z" style="display:flex;justify-content:flex-end;padding:56px 16px 0"><button class="icon-btn" id="x">${I.close}</button></div>
    <div class="hero z stg"><div class="h1" style="font-size:28px">Let's get you trade ready</div></div>
    <div class="z cnd"><video src="${A}candles.mp4" poster="${A}candles-poster.jpg" muted playsinline autoplay loop preload="auto"></video></div>
    <div class="seg-list z stg">
      <div><span class="si"><img src="${A}seg/optionchain.svg" alt=""></span>Trade smarter with Option Chain</div>
      <div><span class="si"><img src="${A}seg/algoverse.svg" alt="" style="width:21.6px;height:22.9px"></span>Start F&amp;O with Algoverse</div>
      <div><span class="si"><img src="${A}seg/scalper.svg" alt="" style="width:25.2px;height:25.2px"></span>Trade Faster with Scalper Mobile</div>
      <div><span class="si"><img src="${A}seg/chart360.svg" alt="" style="width:20.6px;height:15.6px;margin-bottom:4px"></span>Master Markets with Chart 360</div></div>
    <div class="z" style="margin-top:22px;display:flex;flex-direction:column;gap:10px">
      <label class="chk" data-c="fo"><i>${I.check('#fff',10)}</i><span>I want to activate Futures &amp; Options.</span></label>
      <label class="chk" data-c="com"><i>${I.check('#fff',10)}</i><span>I want to activate Commodities. I am not in a business related to commodities.</span></label></div>
    ${cta('Activate Now')}`;
  $$('.chk', el).forEach(c=>c.addEventListener('click', e=>{ e.preventDefault(); c.classList.toggle('off'); setCta(el, $$('.chk:not(.off)', el).length>0); }));
  $('#x', el).addEventListener('click', ()=>go('waiting','dissolve'));
  $('#cta', el).addEventListener('click', ()=>go('aaOtp','dissolve'));
};

/* ---------- F&O income proof via AA ---------- */
SCREENS.aaOtp = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>${topnav(6)}
    <div class="hero z stg" style="margin-top:6px"><div class="h2" style="font-size:24px">Link your bank account</div><div class="sub">Enter the OTP we sent to ${S.d.phone||'9876543210'}</div></div>
    <div class="z" style="padding:28px 16px 0">${otpBoxes()}<div class="otp-meta"><span id="om" class="dots">Looking for OTP</span><a class="link">Resend OTP</a></div></div>
    <div class="powered z" style="position:absolute;left:0;right:0;bottom:44px">Powered by <img src="${A}onemoney.svg" height="14" alt="onemoney"></div>`;
  wireNav(el, ()=>go('segments','pop'));
  bindOtp(el, {code:'149136', onDone:(v,fi)=>{ $('#om',el).className='okt'; $('#om',el).innerHTML=`OTP verified ${I.check('#008858',12)}`; $('#otp',el).classList.add('ok'); later(()=>fi.blur(),300); later(()=>go('aaAccounts','push'), 900); }});
};
SCREENS.aaAccounts = (el)=>{
  const acc = [['hdfc','HDFC Bank','6782','Savings account'],['icici','ICICI Bank','3432','Fixed Deposit'],['sbi','State Bank of India','2312','Savings account']];
  el.innerHTML = `<div class="bg-lav"></div>${topnav(6)}
    <div class="hero z stg" style="margin-top:6px"><div class="h2" style="font-size:24px">Select account with balance<br>above ₹5k</div></div>
    <div class="z stg" style="padding:28px 16px 0;display:flex;flex-direction:column;gap:16px">${acc.map(a=>`<div class="acct" data-n="${a[1]}">${a[0]==='generic' ? `<span class="lg" style="background:${BANKS.generic.color}">${BANKS.generic.logo.replace(/width="2\d" height="2\d"/,'width="20" height="20"')}</span>` : `<span class="lg">${scripLogo(a[0],32)}</span>`}<div><b>${a[1]} <span style="font-weight:500">** ${a[2]}</span></b><small>${a[3]}</small></div></div>`).join('')}</div>
    <div class="z" style="position:absolute;left:16px;right:16px;bottom:44px"><div style="font-size:12px;color:#6e6e6e">By selecting a bank, I consent Upstox to access my</div><a class="link-u" style="font-size:12px;font-weight:600">financial data</a>
    <div class="powered" style="margin-top:28px">Powered by <img src="${A}onemoney.svg" height="14" alt="onemoney"></div></div>`;
  wireNav(el, ()=>go('aaOtp','pop'));
  $$('.acct', el).forEach(a=>a.addEventListener('click', ()=>{ $$('.acct',el).forEach(x=>x.classList.remove('on')); a.classList.add('on'); S.d.aaBank=a.dataset.n; later(()=>go('aaLink','push'), 450); }));
};
SCREENS.aaLink = (el)=>{
  const b = S.d.aaBank || 'ICICI Bank';
  el.innerHTML = `<div class="bg-lav"></div>${topnav(6)}
    <div class="hero z stg" style="margin-top:6px"><div class="h2" style="font-size:24px">Linking ${b}</div><div class="sub">Enter the OTP sent by ${b}</div></div>
    <div class="z" style="padding:28px 16px 0">${otpBoxes()}<div class="otp-meta"><span id="om" class="dots">Looking for OTP</span><a class="link" style="color:#b9b9b9">Resend OTP (1:30)</a></div></div>
    <div class="powered z" style="position:absolute;left:0;right:0;bottom:44px">Powered by <img src="${A}onemoney.svg" height="14" alt="onemoney"></div>`;
  wireNav(el, ()=>go('aaAccounts','pop'));
  bindOtp(el, {code:'730215', onDone:(v,fi)=>{ $('#om',el).className='okt'; $('#om',el).innerHTML=`OTP verified ${I.check('#008858',12)}`; $('#otp',el).classList.add('ok'); later(()=>fi.blur(),300);
    later(()=>{ $('.hero',el).style.filter='blur(4px)'; success('Bank account linked'); later(()=>go('waiting','dissolve'), 2700); }, 700); }});
};

/* ---------- Waiting ---------- */
SCREENS.waiting = (el)=>{
  el.innerHTML = `<div class="bg-lav"></div>
    <div class="z clockwrap"><div class="clock-lottie" id="clockAnim"></div></div>
    <div class="hero z stg" style="margin-top:20px"><div class="h2" style="font-size:24px;line-height:29px">Your account activation<br>is in progress</div></div>
    <div class="steps z stg">
      <div class="st done"><span class="dot">${I.check('#fff',10)}</span><div><b>Application received</b><small>Today, 12:34 PM</small></div></div>
      <div class="st cur"><span class="dot"></span><div><b>Under review by NSE/BSE</b><small>By tomorrow, 12:34 PM</small></div></div>
      <div class="st todo"><span class="dot"></span><div><b>Account activation</b><small>5 Sep</small></div></div>
      <div class="st todo"><span class="dot"></span><div><b>Ready to invest</b><small>5 Sep</small></div></div></div>
    <div class="z wbtns"><button>Application details</button><button>Need help?</button></div>
    ${cta('Pick your first stock')}`;
  // clock "speed burst" (Lottie from Claude motion) — includes its own speed lines + sparks
  const holder = $('#clockAnim', el);
  if(window.lottie && window.CLOCK_ANIM){
    const anim = lottie.loadAnimation({ name:'clock', container:holder, renderer:'svg', loop:true, autoplay:true, animationData:window.CLOCK_ANIM, rendererSettings:{preserveAspectRatio:'xMidYMid meet'} });
    holder._anim = anim;
  } else holder.innerHTML = `<img src="${A}clock.png" class="clock" alt="">`;
  $('#cta', el).addEventListener('click', ()=>go('stocks','push'));
};

/* ---------- Stocks (real NSE scrips; logos from the Upstox Icons library) ---------- */
const SCRIPS = [
  { s:'HDFCBANK',   n:'HDFC Bank',          logo:'hdfc',  px:'1,982.40', ch:'+1.24%', up:1, tag:'Trending 🔥', grp:['private'] },
  { s:'ICICIBANK',  n:'ICICI Bank',         logo:'icici', px:'1,412.60', ch:'+0.86%', up:1, tag:'121k added', grp:['private'] },
  { s:'SBIN',       n:'State Bank of India',logo:'sbi',   px:'856.25',   ch:'+0.42%', up:1, tag:'Most added', grp:['psu'] },
  { s:'AXISBANK',   n:'Axis Bank',          logo:'axis',  px:'1,178.35', ch:'-0.31%', up:0, tag:'',          grp:['private'] },
  { s:'KOTAKBANK',  n:'Kotak Mahindra Bank',logo:'kotak', px:'2,104.90', ch:'+0.58%', up:1, tag:'',          grp:['private'] },
  { s:'YESBANK',    n:'Yes Bank',           logo:'yes',   px:'21.84',    ch:'-1.62%', up:0, tag:'',          grp:['private','u100'] },
  { s:'IDFCFIRSTB', n:'IDFC First Bank',    logo:'idfc',  px:'74.12',    ch:'+2.08%', up:1, tag:'',          grp:['private','u100'] },
];
const scripBy = (sym)=>SCRIPS.find(x=>x.s===sym);
const scripLogo = (k, size=38)=>`<img class="scrip-logo" src="${A}scrips/${k}.png" width="${size}" height="${size}" alt="">`;
SCREENS.stocks = (el)=>{
  const chips = [['all','All'],['private','Private banks'],['psu','PSU banks'],['u100','Under ₹100']];
  el.innerHTML = `<div class="z" style="display:flex;justify-content:space-between;align-items:center;padding:56px 16px 0"><button class="icon-btn" data-act="back">${I.back}</button><a class="link" style="font-size:14px" id="skip">Skip for now</a></div>
    <div class="z" style="padding:10px 16px 0"><span class="mt">↗ Most traded today</span><div class="ps">Pick stocks <span>you love</span></div><div class="pss">Add up to 5 stocks to track price moves</div>
      <div class="srch">${I.search}<span>Search &amp; add stocks</span></div>
      <div class="chips" id="fchips" style="margin-top:16px;flex-wrap:nowrap;overflow-x:auto">${chips.map(([k,l],i)=>`<button class="chip-o ${i===0?'on':''}" data-f="${k}" style="white-space:nowrap">${l}</button>`).join('')}</div></div>
    <div class="stk-scroll z scroll"><div class="stk-grid">${SCRIPS.map(c=>`<div class="stk ${S.d.stocks.has(c.s)?'on':''}" data-s="${c.s}" data-g="${c.grp.join(' ')}">${c.tag?`<span class="tag">${c.tag}</span>`:''}${scripLogo(c.logo)}<div class="nm">${c.s}</div><div class="px"><span>${c.px}</span><span class="add">${S.d.stocks.has(c.s)?I.check('#fff',10):I.plus}</span></div></div>`).join('')}</div></div>
    <div class="z stk-foot"><span>Pick atleast 1 to continue</span><span id="cnt">${S.d.stocks.size}/5 selected</span></div>
    ${cta('Start tracking',{disabled:S.d.stocks.size===0})}`;
  wireNav(el, ()=>go('waiting','pop'));
  $$('#fchips .chip-o', el).forEach(b=>b.addEventListener('click', ()=>{
    $$('#fchips .chip-o', el).forEach(x=>x.classList.toggle('on', x===b));
    const f = b.dataset.f;
    $$('.stk', el).forEach((c,i)=>{ const show = f==='all' || c.dataset.g.split(' ').includes(f); c.classList.toggle('hide', !show); });
  }));
  $$('.stk', el).forEach(c=>c.addEventListener('click', ()=>{
    const s=c.dataset.s; if(S.d.stocks.has(s)){ S.d.stocks.delete(s); c.classList.remove('on'); $('.add',c).innerHTML=I.plus; }
    else { if(S.d.stocks.size>=5){ toast('You can track up to 5 stocks'); return; } S.d.stocks.add(s); c.classList.add('on'); $('.add',c).innerHTML=I.check('#fff',10); }
    $('#cnt',el).textContent=`${S.d.stocks.size}/5 selected`; setCta(el, S.d.stocks.size>0);
  }));
  $('#skip', el).addEventListener('click', ()=>go('home','dissolve'));
  $('#cta', el).addEventListener('click', ()=>go('alerts','dissolve'));
};
SCREENS.alerts = (el)=>{
  // "Graph reveal calm" Lottie (Claude motion) — plays once and holds; falls back to the drawn SVG chart
  const lot = window.lottie && window.GRAPH_ANIM;
  el.innerHTML = `<div class="z alert-chart">${lot ? `<div class="graph-lottie" id="graphAnim"></div>` : `<svg viewBox="0 0 200 140" width="200" height="140"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a77be6" stop-opacity=".35"/><stop offset="1" stop-color="#a77be6" stop-opacity="0"/></linearGradient></defs>
      <path class="area" d="M0 70h55l25 30 18-30 24 8 17-25 16 6L196 0V140H0Z" fill="url(#ag)"/><path class="ln" d="M0 70h55l25 30 18-30 24 8 17-25 16 6L196 0" fill="none" stroke="#8e5bd8" stroke-width="2"/></svg>`}</div>
    <div class="hero z"><div class="h2" style="font-size:24px">Setting up your alerts</div><div class="sub">Turning on alerts for your picks...</div></div>`;
  if(lot) lottie.loadAnimation({ name:'graph', container:$('#graphAnim', el), renderer:'svg', loop:false, autoplay:true, animationData:window.GRAPH_ANIM, rendererSettings:{preserveAspectRatio:'xMidYMid meet'} });
  later(()=>go('allset','dissolve'), 2800);
};
SCREENS.allset = (el)=>{
  const picks = [...S.d.stocks].map(scripBy).filter(Boolean);
  el.innerHTML = `<div class="z" style="margin-top:190px;display:grid;place-items:center">${badge()}</div>
    <div class="hero z"><div class="h2" style="font-size:26px">You're all set</div><div class="sub" style="font-weight:400">Alerts are on for your picks. We'll notify you<br>when there are any movements</div></div>
    <div class="z picks">${picks.map((p,i)=>`<div style="animation-delay:${.5+i*.08}s"><span class="pk-l">${scripLogo(p.logo,24)}<span>${p.s}</span></span><span>${p.px}</span></div>`).join('')}</div>
    ${cta('Go to homepage')}`;
  $('#cta', el).addEventListener('click', ()=>go('home','dissolve'));
};

/* ---------- Home ---------- */
SCREENS.home = (el)=>{
  const tr = ['SBIN','IDFCFIRSTB','HDFCBANK','YESBANK'].map(scripBy);
  const D = A+'home/ds/';
  // Header — DS index-ticker-v2 + topbar (logo, search, icon buttons, Plus product button) + styled underline tabs
  el.innerHTML = `<div class="z hm-head">
      <div class="hm-tick"><span class="it"><b>NIFTY50</b><b>23,577.85</b><i class="pill up">+0.30%</i></span><i class="vd"></i><span class="it"><b>SENSEX</b><b>81,784.10</b><i class="pill">0.00%</i></span></div>
    </div>
    <div class="z hm-bar"><span class="hm-logo"><img src="${D}up-logo.svg" width="24" height="13" alt="up"><i><img src="${D}chev-badge.svg" width="6" height="3" alt=""></i></span>
      <div class="hm-search"><img src="${D}search.svg" width="20" height="20" alt="">Search</div>
      <span class="hm-ibtn"><img src="${D}bell.svg" width="24" height="24" alt="Alerts"></span><span class="hm-ibtn"><img src="${D}wallet.svg" width="24" height="24" alt="Funds"></span>
      <span class="hm-plusbtn"><img src="${D}plus.svg" width="35" height="11" alt="Plus"></span></div>
    <div class="z hm-tabs2">${['Explore','Stocks','Options','Futures','Commodities'].map((x,i)=>`<span class="${i===0?'on':''}">${i===0?`<img class="tab-shape" src="${D}tab-shape.svg" width="861" height="41" alt="">`:''}${x}</span>`).join('')}</div>
    <div class="hw z">
      <div class="hw-bg"></div>
      <div class="hw-rays"><img class="r1" src="${A}home/rays1.svg" alt=""><div class="r2w"><img class="r2" src="${A}home/rays2.svg" alt=""></div><img class="r3" src="${A}home/rays3.svg" alt=""></div>
      <div class="hw-clock"><img src="${A}home/clock.png" alt=""></div>
      <div class="hw-h">Ready to trade by 5 Sep</div>
      <div class="hw-card">
        <div class="hw-steps"><i class="d done">${I.check('#fff',9)}</i><i class="ln"></i><i class="d cur"></i><i class="ln"></i><i class="d todo"></i></div>
        <div class="hw-lbl"><div class="l"><b>Submitted</b><small>Today, 12:34 PM</small></div><div class="m"><b>In review</b><small>Till tomorrow</small></div><div class="r"><b>Ready</b><small>By 5 Sep</small></div></div>
        <div class="hw-div"></div>
        <div class="hw-foot">Your account will be trade-ready in 24–48 hours</div>
      </div>
    </div>
    <div class="z hm-sec">
      <div class="hm-sh"><span class="ic"><img src="${D}timer.svg" width="15" height="18" alt=""></span>Trending Stocks</div>
      <div class="hm-filter"><button class="hm-dd">Stocks<img src="${D}caret.svg" width="16" height="16" alt=""></button><i class="vd"></i>${['Below 100','Most bought','Top gainers','Top losers'].map((x,i)=>`<button class="hm-chip ${i===0?'on':''}">${x}</button>`).join('')}</div>
      ${tr.map(t=>{ const p=parseFloat(t.px.replace(/,/g,'')), pc=parseFloat(t.ch), abs=(p*pc/(100+pc)); return `<div class="hm-li">${scripLogo(t.logo,32)}<div class="l"><b>${t.s}</b><small>NSE</small></div><div class="r"><b class="${t.up?'pos':'neg'}">${t.px}</b><small>${abs>=0?'+':'-'}${Math.abs(abs).toFixed(2)} (${Math.abs(pc).toFixed(2)}%)</small></div></div>`; }).join('')}
    </div>
    <div class="z" style="text-align:center;padding:16px 0 24px"><button class="restart-in" id="again">↺ Replay prototype</button></div>
    <nav class="z hm-nav">${[['home','Home'],['lists','My Lists'],['orders','Orders'],['positions','Positions'],['holdings','Holdings']].map(([k,l],i)=>`<span class="${i===0?'on':''}"><i><img src="${D}nav-${k}.svg" alt=""></i>${l}</span>`).join('')}</nav>`;
  $$('.hm-chip', el).forEach(c=>c.addEventListener('click', ()=>{ $$('.hm-chip',el).forEach(x=>x.classList.remove('on')); c.classList.add('on'); }));
  $$('.hm-tabs2>span', el).forEach(t=>t.addEventListener('click', ()=>{ const sh=$('.tab-shape',el); $$('.hm-tabs2>span',el).forEach(x=>x.classList.remove('on')); t.classList.add('on'); t.prepend(sh); }));
  $('#again', el).addEventListener('click', restart);
};

/* =====================================================================
   PANEL: scenarios + jumps
   ===================================================================== */
const JUMPS = [
  ['welcome','Welcome'],['phone','Mobile'],['otp','OTP'],['email','Email'],['review','Review cards'],
  ['panManual','PAN · manual'],['bankVerify','Bank · UPI'],['bankManual','Bank · manual'],['pq','Address · manual'],
  ['signature','Signature'],['selfieIntro','Selfie'],['questions','Questions'],['esign','eSign'],['segments','F&O activation'],['aaOtp','Bank link (AA)'],['waiting','Status'],['stocks','Stocks'],['home','Home']
];
const jumpsEl = $('#jumps');
jumpsEl.innerHTML = JUMPS.map(([id,l])=>`<button data-j="${id}">${l}</button>`).join('');
jumpsEl.addEventListener('click', e=>{
  const b = e.target.closest('[data-j]'); if(!b) return;
  const id = b.dataset.j;
  if(id==='review'){ S.d.panReady=true; return go('review','dissolve',{stage:0}); }
  if(id==='pq') return go('pq','push',{i:0});
  if(['signature','selfieIntro','questions','esign','segments','aaOtp','waiting','stocks','home'].includes(id)){ S.d.panReady=true; if(!S.d.bank) S.d.bank={...DEF_BANK}; if(!S.d.personal) S.d.personal={...DEF_PERSONAL}; }
  go(id, 'dissolve');
});
function markJump(id){ $$('[data-j]', jumpsEl).forEach(b=>b.classList.toggle('on', b.dataset.j===id || (id==='review' && b.dataset.j==='review'))); }

function syncSwitches(){ $$('[data-scn]').forEach(i=>i.checked = !!S.scn[i.dataset.scn]); }
$$('[data-scn]').forEach(i=>i.addEventListener('change', ()=>{
  S.scn[i.dataset.scn] = i.checked;
  $$('[data-preset]').forEach(b=>b.classList.remove('on'));
  const p = presetName(); if(p) $(`[data-preset="${p}"]`).classList.add('on');
  // live-apply to data so review reflects it
  if(i.dataset.scn==='bankAuto') S.d.bank = i.checked ? {...DEF_BANK} : null;
  if(i.dataset.scn==='personalAuto') S.d.personal = i.checked ? {...DEF_PERSONAL} : null;
  if(i.dataset.scn==='panAuto') S.d.panReady = i.checked;
  if(curId==='review') go('review','dissolve',{stage:S.stage});
}));
function presetName(){ const s=S.scn; if(s.panAuto&&s.bankAuto&&s.personalAuto) return 'happy'; if(!s.panAuto&&!s.bankAuto&&!s.personalAuto) return 'manual'; if(!s.panAuto&&s.bankAuto&&s.personalAuto) return 'pan'; if(s.panAuto&&!s.bankAuto&&s.personalAuto) return 'bank'; return null; }
$$('[data-preset]').forEach(b=>b.addEventListener('click', ()=>{
  const p = b.dataset.preset;
  S.scn = { ...{ happy:{panAuto:true,bankAuto:true,personalAuto:true}, manual:{panAuto:false,bankAuto:false,personalAuto:false}, pan:{panAuto:false,bankAuto:true,personalAuto:true}, bank:{panAuto:true,bankAuto:false,personalAuto:true} }[p], pennyFail:S.scn.pennyFail };
  $$('[data-preset]').forEach(x=>x.classList.toggle('on', x===b)); syncSwitches();
  restart();
}));
function restart(){ resetData(); go('welcome','dissolve'); }
$('#restart').addEventListener('click', restart);

// scale device to viewport
function fitDevice(){
  const d = $('#device'); if(window.innerWidth<=440){ d.style.transform=''; return; }
  const sc = Math.min(1, (window.innerHeight-40)/832); d.style.transform = sc<1 ? `scale(${sc})` : '';
}
window.addEventListener('resize', fitDevice); fitDevice();

// deep link: #screen
const start = (location.hash||'').slice(1);
go(SCREENS[start] ? start : 'welcome', 'none');
window.__S = S; window.__go = go;
})();
