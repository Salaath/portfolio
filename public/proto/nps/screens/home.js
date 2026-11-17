/* Home — Figma "Invest home entry" (v2, Invest home entry1.fig) › Home (1:1238)
   NPS is entered from the "Discover more" carousel (1:1293) on Home.
   The body is the rendered Figma frame in three slices: the ticker → "Discover more" heading,
   the carousel (scrolls sideways, every chip tappable) and Instant investing → Quicklinks.
   Tab bar is 1:1408. */
(function(){
const { A, S, SCREENS, go, resetTo, toast, wireCommon, I, jump } = P;

// Discover more chips, left to right, 104px apart (1:1294 … 1:1401)
const CHIPS = ['NPS','Import MF','Import Banks','Invest in Gold','Invest in Fixed Income','Get a Loan','Invest in FDs','Peer-to-Peer investing'];
const TABS = ['Home','Stocks','News','Mutual Funds','More'];

SCREENS.home = (el)=>{
  el.innerHTML = `
    <div class="topbar hm-top"><div class="l"><img src="${A}mo-ic-account.svg" width="24" height="24" alt=""><span class="b1" style="font-weight:500">Home</span></div>
      <div class="r"><button class="icon-btn" data-search aria-label="Search"><img src="${A}mo-ic-search.svg" width="24" height="24" alt=""></button>${I.help}</div></div>
    <div class="scroll hm-body">
      <img class="hm-img" src="${A}hm-home-a.jpg" width="360" height="816" alt="Market ticker, linked wealth and your portfolio">
      <div class="hm-disc" aria-label="Discover more">
        <div class="hm-strip">
          <img src="${A}hm-disc.jpg" width="832" height="132" alt="">
          ${CHIPS.map((c,i)=>`<button class="hm-chip${i===0?' nps':''}" style="left:${i*104}px" data-chip="${c}" aria-label="${c}"></button>`).join('')}
        </div>
      </div>
      <img class="hm-img" src="${A}hm-home-b.jpg" width="360" height="480" alt="Instant investing and quicklinks">
    </div>
    <nav class="hm-tabbar"><img src="${A}hm-nav.jpg" width="360" height="56" alt="">
      ${TABS.map(t=>`<button data-tab="${t}" aria-label="${t}"></button>`).join('')}</nav>`;
  wireCommon(el);
  el.addEventListener('click', e=>{
    const c = e.target.closest('[data-chip]');
    if(c){ if(c.dataset.chip==='NPS') return P.openNps(); return toast(c.dataset.chip+': not part of this prototype'); }
    const tb = e.target.closest('[data-tab]');
    if(tb){ const t = tb.dataset.tab; if(t==='More') return resetTo([], 'more'); if(t!=='Home') toast(t+' tab'); return; }
    if(e.target.closest('[data-search]')) toast('Search');
  });
};

// NPS entry point: already invested → Portfolio; stories seen → Explore; else education stories
P.openNps = function(){
  if(S.scn.holdings) return go('portfolio','push');
  if(S.d.storiesSeen) return go('explore','push');
  go('stories','push',{start:0});
};

jump('home', 'Home', 'home', ()=> resetTo([], 'home'));
})();
