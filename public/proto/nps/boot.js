/* Panel wiring + start-up. Loaded after every screens/*.js module has registered its screens and jumps. */
(function(){
const { $, $$, S, resetData, go, navBack, startOver, JUMPS, toast } = P;

const jumpsEl = $('#jumps');
jumpsEl.innerHTML = JUMPS.map(j=>`<button data-j="${j.id}">${j.label}</button>`).join('');
jumpsEl.addEventListener('click', e=>{ const b = e.target.closest('[data-j]'); if(b) runJump(b.dataset.j); });
function runJump(id){ const j = JUMPS.find(x=>x.id===id); if(j) j.run(); }

$$('[data-scn]').forEach(i=>{
  i.checked = !!S.scn[i.dataset.scn];
  i.addEventListener('change', ()=>{ S.scn[i.dataset.scn] = i.checked; const c = P.st.cur; c && c.__refresh && c.__refresh(); });
});
function group(attr, key){
  $$(`[data-${attr}]`).forEach(b=>b.addEventListener('click', ()=>{
    S.scn[key] = b.dataset[attr];
    $$(`[data-${attr}]`).forEach(x=>x.classList.toggle('on', x===b));
    const c = P.st.cur; c && c.__refresh && c.__refresh();
  }));
}
group('pay','pay'); group('load','load');

function restart(){ resetData(); startOver('more'); }
$('#restart').addEventListener('click', restart);
$('#navbar').addEventListener('click', e=>{
  const b = e.target.closest('[data-nav]'); if(!b) return;
  if(b.dataset.nav==='back') navBack(); else if(b.dataset.nav==='home') restart(); else toast('Recent apps');
});

function fitDevice(){
  const d = $('#device'); if(window.innerWidth<=420){ d.style.transform=''; return; }
  const sc = Math.min(1, (window.innerHeight-40)/820); d.style.transform = sc<1 ? `scale(${sc})` : '';
}
window.addEventListener('resize', fitDevice); fitDevice();

const start = (location.hash||'').slice(1);
if(start && JUMPS.some(j=>j.id===start)) runJump(start); else go('more', 'none');
})();
