/* Android (Gboard-style) keyboards + keyboard-driven fake inputs
   num   — dark numeric pad (order form units) — Figma "keyboards/numeric/dark"
   alpha — light QWERTY (UPI ID sheets) */
(function(){
  const A = 'assets/';
  const layer = () => document.getElementById('kbLayer');
  const screenEl = () => document.getElementById('screen');

  const ROWS = {
    alpha:[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m']],
    sym:[['1','2','3','4','5','6','7','8','9','0'],['@','#','₹','_','&','-','+','(',')','/'],['*','"',"'",':',';','!','?']]
  };
  const HINT = ['1','2','3','4','5','6','7','8','9','0'];

  const KB = {
    el:null, mode:null, page:'alpha', shift:false, height:205,
    show(mode, opts={}){
      this.opts = opts;
      const changed = mode !== this.mode || !this.el;
      this.mode = mode;
      if(changed){ this.page='alpha'; this.shift=false; this.build(); }
      const kbEl = this.el;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ if(this.el===kbEl) kbEl.classList.add('on'); }));
      screenEl().style.setProperty('--kbh', this.height+'px');
      screenEl().classList.add('kb-up');
      document.dispatchEvent(new CustomEvent('kb', {detail:{open:true, h:this.height}}));
    },
    hide(){
      if(!this.el) return;
      const el = this.el; el.classList.remove('on');
      this.mode=null; this.el=null;
      setTimeout(()=>el.remove(), 320);
      screenEl().style.setProperty('--kbh', '0px');
      screenEl().classList.remove('kb-up');
      document.dispatchEvent(new CustomEvent('kb', {detail:{open:false, h:0}}));
    },
    build(){
      const old = layer().querySelector('.kb'); if(old) old.remove();
      const kb = document.createElement('div');
      if(this.mode==='num'){
        kb.className = 'kb kb-num';
        const D = ['1','2','3','4','5','6','7','8','9'];
        const side = [
          `<div class="k side" data-k="-"><img src="${A}kbd-mdash.svg" width="12" height="2" alt=""></div>`,
          `<div class="k side" data-k=" "><img src="${A}kbd-space.svg" width="22" height="6" alt=""></div>`,
          `<div class="k side" data-k="del"><img src="${A}kbd-backspace.svg" width="25" height="20" alt=""></div>`,
          `<div class="k side" data-k="ret"><img src="${A}kbd-enter.svg" width="34" height="34" alt=""></div>`
        ];
        let html = '';
        for(let r=0;r<3;r++){ html += D.slice(r*3,r*3+3).map(d=>`<div class="k" data-k="${d}">${d}</div>`).join('') + side[r]; }
        html += `<div class="k dim" data-k=",">,</div><div class="k" data-k="0">0</div><div class="k dim" data-k=".">.</div>${side[3]}`;
        kb.innerHTML = `<div class="np">${html}</div>`;
      } else {
        kb.className = 'kb kb-alpha';
        kb.innerHTML = `<div class="kb-rows"></div>`;
      }
      layer().appendChild(kb);
      this.el = kb;
      if(this.mode!=='num') this.renderRows();
      this.wire(kb);
    },
    renderRows(){
      const rowsEl = this.el.querySelector('.kb-rows');
      const alpha = this.page==='alpha';
      const R = alpha ? ROWS.alpha : ROWS.sym;
      const lab = c => alpha && this.shift ? c.toUpperCase() : c;
      const key = (c,i,hint) => `<div class="k" data-k="${c}">${hint && alpha ? `<sup>${HINT[i]}</sup>` : ''}<span>${lab(c)}</span><span class="pop">${lab(c)}</span></div>`;
      const go = (this.opts && this.opts.go) !== false;
      rowsEl.innerHTML =
        `<div class="kb-row">${R[0].map((c,i)=>key(c,i,true)).join('')}</div>`+
        `<div class="kb-row ${alpha?'r2':''}">${R[1].map(c=>key(c)).join('')}</div>`+
        `<div class="kb-row r3">`+
          (alpha ? `<div class="k fn shift ${this.shift?'on':''}" data-k="shift"><img src="${A}kbd-shift.svg" width="22" height="21" alt=""></div>` : `<div class="k fn" data-k="page" style="font-size:14px">=\\&lt;</div>`)+
          `<div class="r3-mid">${R[2].map(c=>key(c)).join('')}</div>`+
          `<div class="k fn" data-k="del"><img src="${A}kbd-backspace-light.svg" width="25" height="20" alt=""></div>`+
        `</div>`+
        `<div class="kb-row r4">`+
          `<div class="k fn n123" data-k="page">${alpha?'?123':'ABC'}</div>`+
          `<div class="k fn comma" data-k=",">,</div>`+
          `<div class="k fn emoji"><img src="${A}kbd-emoji.svg" width="24" height="24" alt=""></div>`+
          `<div class="k space" data-k=" "></div>`+
          `<div class="k fn dot" data-k=".">.</div>`+
          `<div class="k fn go" data-k="ret">${go?`<img src="${A}kbd-go.svg" width="34" height="34" alt="">`:`<img src="${A}kbd-enter.svg" width="34" height="34" alt="">`}</div>`+
        `</div>`;
    },
    wire(kb){
      let downEl = null, delTimer = null;
      const fire = (k) => {
        const fi = FI.active;
        if(k==='shift'){ this.shift = !this.shift; this.renderRows(); return; }
        if(k==='page'){ this.page = this.page==='alpha' ? 'sym' : 'alpha'; this.renderRows(); return; }
        if(k==='del'){ fi && fi.backspace(); return; }
        if(k==='ret'){ fi && fi.submit(); return; }
        let ch = k;
        if(this.page==='alpha' && this.shift) ch = k.toUpperCase();
        fi && fi.insert(ch);
        if(this.shift && this.page==='alpha'){ this.shift=false; this.renderRows(); }
      };
      kb.addEventListener('pointerdown', (e)=>{
        const t = e.target.closest('[data-k]'); if(!t) return;
        e.preventDefault();
        downEl = t; t.classList.add('down');
        if(t.dataset.k==='del'){ fire('del'); delTimer = setTimeout(function rep(){ fire('del'); delTimer = setTimeout(rep, 70); }, 420); }
      });
      kb.addEventListener('pointerup', ()=>{
        clearTimeout(delTimer);
        if(!downEl) return;
        const t = downEl; downEl = null;
        setTimeout(()=>t.classList.remove('down'), 90);
        if(t.dataset.k!=='del') fire(t.dataset.k);
      });
      kb.addEventListener('pointerleave', ()=>{ clearTimeout(delTimer); if(downEl){ downEl.classList.remove('down'); downEl=null; } });
    }
  };

  /* ---------- Fake inputs ---------- */
  const FI = {
    active:null,
    create(el, o={}){
      const fi = {
        el, o, value: o.value || '', justAdded:false, locked:false,
        render(){
          const focused = FI.active === this;
          let html = '';
          const v = this.value;
          if(this.justAdded && v.length) html = esc(v.slice(0,-1)) + `<span class="ch">${esc(v.slice(-1))}</span>`;
          else html = esc(v);
          if(focused) html += '<span class="caret"></span>';
          if(!v && o.placeholder) html += `<span class="ph">${esc(o.placeholder)}</span>`;
          el.innerHTML = html;
          this.justAdded = false;
          const f = el.closest('[data-field]'); if(f) f.classList.toggle('focus', focused);
        },
        insert(ch){
          if(this.locked) return;
          if(o.lower) ch = ch.toLowerCase();
          if(o.allow && !o.allow(ch, this.value)) { this.nudge(); return; }
          if(o.max && this.value.length >= o.max) { this.nudge(); return; }
          this.value += ch; this.justAdded = true; this.changed();
        },
        backspace(){ if(this.locked || !this.value) return; this.value = this.value.slice(0,-1); this.changed(); },
        setValue(v){ this.value = v; this.changed(); },
        changed(){ this.render(); o.onChange && o.onChange(this.value, this); },
        submit(){ o.onSubmit && o.onSubmit(this.value, this); },
        nudge(){ const f = el.closest('[data-field]'); if(f) f.animate([{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}],{duration:180}); },
        focus(){ FI.focus(this); },
        blur(){ if(FI.active===this) FI.blur(); }
      };
      const target = el.closest('[data-field]') || el;
      target.addEventListener('click', (e)=>{ e.stopPropagation(); if(!fi.locked) fi.focus(); });
      fi.render();
      return fi;
    },
    focus(fi){
      const prev = this.active; this.active = fi;
      if(prev && prev!==fi) prev.render();
      fi.render();
      KB.show(fi.o.kb || 'alpha', {go: fi.o.go});
      fi.o.onFocus && fi.o.onFocus(fi);
    },
    /* drop focus but leave the keyboard up (used for the "validated" lock state) */
    release(){ const p = this.active; this.active = null; if(p) p.render(); },
    blur(){
      const p = this.active; this.active = null;
      if(p){ p.render(); p.o.onBlur && p.o.onBlur(p); }
      KB.hide();
    }
  };

  function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // physical keyboard → active fake input
  document.addEventListener('keydown', (e)=>{
    const fi = FI.active; if(!fi) return;
    if(e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    const flash = (sel) => { const n = KB.el && KB.el.querySelector(sel); if(n){ n.classList.add('down'); setTimeout(()=>n.classList.remove('down'), 110);} };
    if(k==='Backspace'){ e.preventDefault(); fi.backspace(); flash('[data-k="del"]'); }
    else if(k==='Enter'){ e.preventDefault(); fi.submit(); flash('[data-k="ret"]'); }
    else if(k==='Escape'){ FI.blur(); }
    else if(k.length===1){ e.preventDefault(); fi.insert(k); flash(`[data-k="${CSS.escape(k.toLowerCase())}"]`); }
  });

  window.KB = KB; window.FI = FI;
})();
