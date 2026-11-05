/* iOS keyboard + keyboard-driven fake inputs */
(function(){
  const layer = () => document.getElementById('kbLayer');
  const screenEl = () => document.getElementById('screen');

  const ICON = {
    shift:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5 3.5 12.5H8v7h8v-7h4.5Z"/></svg>',
    shiftOn:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#000" stroke="#000" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5 3.5 12.5H8v7h8v-7h4.5Z"/></svg>',
    caps:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#000" stroke="#000" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5 3.5 11.5H8v5h8v-5h4.5Z"/><path d="M8 19.5h8" stroke-linecap="round"/></svg>',
    del:'<svg width="26" height="20" viewBox="0 0 28 20" fill="none" stroke="#000" stroke-width="1.6" stroke-linejoin="round"><path d="M9 2h15a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-7-8Z"/><path d="m13 7 6 6m0-6-6 6" stroke-linecap="round"/></svg>',
    globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    emoji:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="15" cy="10" r=".6" fill="currentColor"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/></svg>'
  };

  const ROWS = {
    alpha:[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m']],
    num:[['1','2','3','4','5','6','7','8','9','0'],['-','/',':',';','(',')','₹','&','@','"'],['.',',','?','!',"'"]]
  };

  const KB = {
    el:null, mode:null, page:'alpha', shift:false, caps:false, height:0, sug:null,
    show(mode, opts={}){
      this.opts = opts;
      const changed = mode !== this.mode || !this.el;
      this.mode = mode;
      if(opts.caps){ this.caps = true; this.shift = true; } else if(changed){ this.caps=false; this.shift = !!opts.autoCap; }
      if(changed){ this.page='alpha'; this.build(); }
      else this.renderQT();
      const kbEl = this.el;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ if(this.el===kbEl) kbEl.classList.add('on'); }));
      this.height = mode==='num' ? 291 : 336;
      screenEl().style.setProperty('--kb', this.height+'px');
      document.dispatchEvent(new CustomEvent('kb', {detail:{open:true, h:this.height}}));
    },
    hide(){
      if(!this.el) return;
      const el = this.el; el.classList.remove('on');
      this.mode=null; this.el=null;
      setTimeout(()=>el.remove(), 450);
      document.dispatchEvent(new CustomEvent('kb', {detail:{open:false, h:0}}));
    },
    setSuggestion(s){ this.sug = s; this.renderQT(); },
    renderQT(){
      if(!this.el) return;
      const qt = this.el.querySelector('.kb-qt'); if(!qt) return;
      const s = this.sug;
      if(s && s.otp){
        qt.innerHTML = `<div class="otp-sug" data-otp="${s.otp}"><small>${s.from || 'From Messages'}</small><b>${s.otp}</b></div>`;
      } else if(s && s.words){
        qt.innerHTML = s.words.map(w=>`<div class="sug" data-word="${w}">${w}</div>`).join('');
      } else if(this.mode==='num'){
        qt.innerHTML = '';
      } else {
        qt.innerHTML = `<div class="sug"></div><div class="sug"></div><div class="sug"></div>`;
      }
    },
    build(){
      const old = layer().querySelector('.kb');
      if(old){ old.remove(); }
      const kb = document.createElement('div');
      kb.className = 'kb' + (this.mode==='num' ? ' np-kb' : '');
      if(this.mode==='num'){
        const L = [['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ']];
        kb.innerHTML = `<div class="kb-qt"></div><div class="np">${L.map(([n,l])=>`<div class="n" data-k="${n}"><b>${n}</b><small>${l}</small></div>`).join('')}<div class="n blank"></div><div class="n" data-k="0"><b>0</b></div><div class="n del" data-k="del">${ICON.del}</div></div>`;
      } else {
        kb.innerHTML = `<div class="kb-qt"></div><div class="kb-rows"></div><div class="kb-foot"><span>${ICON.emoji}</span><span>${ICON.mic}</span></div>`;
      }
      layer().appendChild(kb);
      this.el = kb;
      if(this.mode!=='num') this.renderRows();
      this.renderQT();
      this.wire(kb);
    },
    renderRows(){
      const rowsEl = this.el.querySelector('.kb-rows');
      const R = this.page==='alpha' ? ROWS.alpha : ROWS.num;
      const up = this.shift || this.caps;
      const cap = c => this.page==='alpha' && up ? c.toUpperCase() : c;
      const key = c => `<div class="k" data-k="${c}"><span class="lab">${cap(c)}</span><span class="pop"><i>${cap(c)}</i></span></div>`;
      const ret = (this.opts && this.opts.returnKey) || 'return';
      const retBlue = this.opts && this.opts.retBlue;
      const shiftIcon = this.caps ? ICON.caps : (this.shift ? ICON.shiftOn : ICON.shift);
      const leftR3 = this.page==='alpha'
        ? `<div class="k sp shift ${up?'on':''}" data-k="shift" style="${up?'background:#fff':''}">${shiftIcon}</div>`
        : `<div class="k sp shift" data-k="sym" style="font-size:15px">#+=</div>`;
      const pad = this.page==='alpha' ? '<div style="flex:.5"></div>' : '';
      const email = this.mode==='email';
      rowsEl.innerHTML =
        `<div class="kb-row">${R[0].map(key).join('')}</div>`+
        `<div class="kb-row">${pad}${R[1].map(key).join('')}${pad}</div>`+
        `<div class="kb-row r3">${leftR3}<div style="width:4px"></div>${R[2].map(c=>key(c).replace('class="k"', this.page==='num'?'class="k" style="max-width:46px"':'class="k"')).join('')}<div style="width:4px"></div><div class="k sp del" data-k="del">${ICON.del}</div></div>`+
        `<div class="kb-row"><div class="k sp n123" data-k="page">${this.page==='alpha'?'123':'ABC'}</div>`+
        (email ? `<div class="k sp" data-k="@" style="max-width:44px;font-size:17px">@</div>` : '')+
        `<div class="k space noPop" data-k=" ">space</div>`+
        (email ? `<div class="k sp" data-k="." style="max-width:44px;font-size:20px">.</div>` : '')+
        `<div class="k sp ret ${retBlue?'blue':''}" data-k="ret">${ret}</div></div>`;
    },
    setReturn(label, blue){
      if(!this.opts) return; this.opts.returnKey = label; this.opts.retBlue = blue;
      const r = this.el && this.el.querySelector('[data-k="ret"]');
      if(r){ r.textContent = label; r.classList.toggle('blue', !!blue); }
    },
    wire(kb){
      let downEl = null, delTimer = null;
      const fire = (k) => {
        const fi = FI.active;
        if(k==='shift'){
          const now = Date.now();
          if(this.caps){ this.caps=false; this.shift=false; }
          else if(this.shift && now - (this._lastShift||0) < 350){ this.caps = true; }
          else this.shift = !this.shift;
          this._lastShift = now; this.renderRows(); return;
        }
        if(k==='page'){ this.page = this.page==='alpha' ? 'num' : 'alpha'; this.renderRows(); return; }
        if(k==='sym'){ return; }
        if(k==='del'){ fi && fi.backspace(); return; }
        if(k==='ret'){ fi && fi.submit(); return; }
        let ch = k;
        if(this.page==='alpha' && (this.shift||this.caps)) ch = k.toUpperCase();
        fi && fi.insert(ch);
        if(this.shift && !this.caps && this.page==='alpha'){ this.shift=false; this.renderRows(); }
        if(k===' ' && this.page==='num'){ this.page='alpha'; this.renderRows(); }
      };
      const start = (e) => {
        const t = e.target.closest('[data-k],[data-otp],[data-word]');
        if(!t) return;
        e.preventDefault();
        if(t.dataset.otp){ FI.active && FI.active.setValue(t.dataset.otp, true); this.setSuggestion(null); return; }
        if(t.dataset.word){ FI.active && FI.active.setValue(t.dataset.word, true); return; }
        downEl = t; t.classList.add('down');
        if(t.dataset.k==='del'){
          fire('del');
          delTimer = setTimeout(function rep(){ fire('del'); delTimer = setTimeout(rep, 70); }, 420);
        }
      };
      const end = (e) => {
        clearTimeout(delTimer);
        if(!downEl) return;
        const t = downEl; downEl = null;
        setTimeout(()=>t.classList.remove('down'), t.classList.contains('sp') ? 60 : 90);
        if(t.dataset.k!=='del') fire(t.dataset.k);
      };
      kb.addEventListener('pointerdown', start);
      kb.addEventListener('pointerup', end);
      kb.addEventListener('pointerleave', ()=>{ clearTimeout(delTimer); if(downEl){ downEl.classList.remove('down'); downEl=null; } });
    }
  };

  /* ---------- Fake inputs ---------- */
  const FI = {
    active:null,
    create(el, o={}){
      const fi = {
        el, o, value: o.value || '', justAdded:false,
        render(){
          const shown = o.format ? o.format(this.value) : this.value;
          const field = el.closest('.field');
          const focused = FI.active === this;
          let html = '';
          if(o.secure) html = '•'.repeat(this.value.length);
          else if(this.justAdded && shown.length){ html = esc(shown.slice(0,-1)) + `<span class="ch">${esc(shown.slice(-1))}</span>`; }
          else html = esc(shown);
          if(focused) html += '<span class="caret"></span>';
          if(!this.value && o.placeholder) html += `<span class="ph">${esc(o.placeholder)}</span>`;
          el.innerHTML = html;
          this.justAdded = false;
          if(field){ field.classList.toggle('focus', focused); }
          const fl = el.closest('.float'); if(fl) fl.classList.toggle('has', !!this.value);
        },
        insert(ch){
          if(o.upper) ch = ch.toUpperCase();
          if(o.lower) ch = ch.toLowerCase();
          if(o.allow && !o.allow(ch, this.value)) { this.nudge(); return; }
          if(o.max && this.value.length >= o.max) { this.nudge(); return; }
          this.value += ch; this.justAdded = true; this.changed();
        },
        backspace(){ if(!this.value) return; this.value = this.value.slice(0,-1); this.changed(); },
        setValue(v, typed){
          if(typed){
            // type it out for realism
            this.value=''; const chars = v.split(''); let i=0;
            const step = () => { if(i>=chars.length) return; this.value += chars[i++]; this.justAdded=true; this.changed(); setTimeout(step, 45); };
            step();
          } else { this.value = v; this.changed(); }
        },
        changed(){ this.render(); o.onChange && o.onChange(this.value, this); },
        submit(){ o.onSubmit && o.onSubmit(this.value, this); },
        nudge(){ const f = el.closest('.field'); if(f){ f.animate([{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}],{duration:180}); } },
        focus(){ FI.focus(this); },
        blur(){ if(FI.active===this) FI.blur(); }
      };
      const target = el.closest('.field') || el;
      target.addEventListener('click', (e)=>{ e.stopPropagation(); fi.focus(); });
      fi.render();
      return fi;
    },
    focus(fi){
      const prev = this.active; this.active = fi;
      if(prev && prev!==fi) prev.render();
      fi.render();
      KB.sug = fi.o.suggest || null;
      KB.show(fi.o.kb || 'alpha', {caps: fi.o.caps, autoCap: fi.o.autoCap, returnKey: fi.o.returnKey || 'return', retBlue: fi.o.retBlue});
      fi.o.onFocus && fi.o.onFocus(fi);
    },
    blur(){
      const p = this.active; this.active = null;
      if(p) p.render();
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
