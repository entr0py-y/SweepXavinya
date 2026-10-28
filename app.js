
window.onerror = function(msg, url, lineNo, columnNo, error) {
  alert(msg + " at " + lineNo + ":" + columnNo);
  const errDiv = document.createElement('div');
  errDiv.style.position = 'absolute'; errDiv.style.top = '10%'; errDiv.style.left = '10%'; errDiv.style.right = '10%'; errDiv.style.zIndex = '999999'; errDiv.style.background = 'red'; errDiv.style.color = 'white'; errDiv.style.padding = '20px'; errDiv.style.borderRadius = '10px';
  errDiv.innerHTML = "<b>JS ERROR:</b> " + msg + "<br>Line: " + lineNo + ":" + columnNo;
  document.body.appendChild(errDiv);
};
/* ── SweepX App — UI + State (Supabase backend) ── */
const wait = ms => new Promise(r => setTimeout(r, ms));
function timeAgo(iso) { const d = Date.now() - new Date(iso).getTime(); const s = Math.floor(d / 1000); if (s < 60) return 'Just now'; const m = Math.floor(s / 60); if (m < 60) return m + ' min ago'; const h = Math.floor(m / 60); if (h < 24) return h + ' hr ago'; const dy = Math.floor(h / 24); return dy + ' days ago' }
function ini(n) { return (n || 'U').split(/[\s_]+/).map(w => w[0]).join('').toUpperCase().slice(0, 1) }
function acCol() { return 'rgba(124,255,59,0.15)' }

/* ─── State ─── */
const S = { user: null, screen: 'auth', prev: null, detailId: null };

/* ─── Session (in-memory demo session) ─── */
function getSession() {
  return { userId: null, username: null };
}
function saveSession(profile) {
  S.user = profile;
}
function clearSession() {
  S.user = null;
}

/* ─── SVG icons ─── */
const I = {
  pin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  chk: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  usrs: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  star: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  arr: '<svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  sliders: '<svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="16" y2="18"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  back: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  cam: '<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke-width="2.5"/></svg>',
  xx: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>',
  trphy: '<svg viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 000 4h2M18 9h2a2 2 0 010 4h-2M6 9V5h12v4M6 9c0 5.523 2.686 8 6 8s6-2.477 6-8M9 21h6M12 17v4"/></svg>',
  cog: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  img: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
};

/* ─── Badge ─── */
function badge(st) {
  const m = { open: 'b-open', 'in-progress': 'b-ip', in_progress: 'b-ip', pending: 'b-pend', approved: 'b-ok', rejected: 'b-rej', manual_review: 'b-pend' };
  const l = { open: 'Open', 'in-progress': 'In Progress', in_progress: 'In Progress', pending: 'Verifying…', approved: 'Approved', rejected: 'Rejected', manual_review: 'Under Review' };
  return `<span class="badge ${m[st] || 'b-open'}">${l[st] || st}</span>`;
}

/* ─── Camera Capture & Anti-Cheat ─── */
class CameraCapture {
  constructor() {
    this.stream = null; this.facingMode = 'environment'; this.onCapture = null;
    this.modal = document.getElementById('camera-modal'); this.video = document.getElementById('camera-preview');
    this.canvas = document.getElementById('camera-canvas'); this.shutterBtn = document.getElementById('camera-shutter');
    this.cancelBtn = document.getElementById('camera-cancel'); this.flipBtn = document.getElementById('camera-flip');

    if (this.shutterBtn) {
      this.shutterBtn.addEventListener('click', () => this.capture());
      this.cancelBtn.addEventListener('click', () => this.close());
      this.flipBtn.addEventListener('click', () => this.flipCamera());
      this.shutterBtn.addEventListener('mousedown', () => this.shutterBtn.style.transform = 'scale(0.92)');
      this.shutterBtn.addEventListener('mouseup', () => this.shutterBtn.style.transform = 'scale(1)');
      this.shutterBtn.addEventListener('touchstart', () => this.shutterBtn.style.transform = 'scale(0.92)');
      this.shutterBtn.addEventListener('touchend', () => this.shutterBtn.style.transform = 'scale(1)');
    }
  }

  isMobile() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }

  async open(onCapture, inputId = 'report-image-input', errorElId = 'ie') {
    this.onCapture = onCapture;
    const errEl = document.getElementById(errorElId);
    const showError = msg => { if (errEl) errEl.textContent = msg; else alert(msg); };

    if (this.isMobile()) {
      const input = document.getElementById(inputId);
      input.onchange = async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        if (file.size < 50 * 1024) { showError('Photo quality is too low. Please retake the photo.'); input.value = ''; return; }
        const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
        if (file.lastModified < fiveMinsAgo) { showError('Please take a new live photo. Old photos are not accepted.'); input.value = ''; return; }
        try { const dataUrl = await this.fileToDataUrl(file); onCapture(file, dataUrl); } catch (err) { showError('Could not process photo'); }
        input.value = '';
      };
      input.click();
      return;
    }

    try { await this.startStream(); this.modal.style.display = 'flex'; }
    catch (err) { this.handlePermissionError(err, showError); }
  }

  async startStream() {
    if (this.stream) this.stopStream();
    const constraints = { video: { facingMode: this.facingMode, width: { ideal: 1280 }, height: { ideal: 720 }, aspectRatio: { ideal: 4/3 } }, audio: false };
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (this.video) { this.video.srcObject = this.stream; await this.video.play(); }
  }

  stopStream() {
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.video) this.video.srcObject = null;
  }

  async flipCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    try { await this.startStream(); } catch { this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment'; }
  }

  capture() {
    if (!this.stream) return;
    const { videoWidth: w, videoHeight: h } = this.video;
    this.canvas.width = w; this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    if (this.facingMode === 'user') { ctx.translate(w, 0); ctx.scale(-1, 1); }
    ctx.drawImage(this.video, 0, 0, w, h);

    const flash = document.createElement('div');
    flash.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0.8;pointer-events:none;z-index:10;transition:opacity 200ms ease';
    if (this.modal) this.modal.querySelector('div').appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; }, 50); setTimeout(() => flash.remove(), 300);

    this.canvas.toBlob((blob) => {
      const dataUrl = this.canvas.toDataURL('image/jpeg', 0.85);
      this.close(); this.onCapture(blob, dataUrl);
    }, 'image/jpeg', 0.85);
  }

  close() { this.stopStream(); if (this.modal) this.modal.style.display = 'none'; }

  handlePermissionError(err, showError) {
    const msgs = { NotAllowedError: 'Camera access denied. Please allow it in settings.', NotFoundError: 'No camera found.', NotReadableError: 'Camera is in use by another app.', OverconstrainedError: 'Camera does not meet requirements.' };
    showError(msgs[err.name] || 'Could not access camera. Please try again.');
  }

  fileToDataUrl(file) {
    return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = e => resolve(e.target.result); reader.onerror = () => reject(new Error('Could not read file')); reader.readAsDataURL(file); });
  }
}
const camera = new CameraCapture();

/* ─── Skeletons ─── */
function skelRow() { return `<div class="mr" style="pointer-events:none"><div class="mr-th" style="background:rgba(255,255,255,.06);border-radius:8px"></div><div class="mr-bd"><div style="height:11px;width:65%;background:rgba(255,255,255,.06);border-radius:4px;margin-bottom:6px"></div><div style="height:9px;width:40%;background:rgba(255,255,255,.04);border-radius:4px"></div></div></div>`; }
function skelStat() { return `<div class="sc ft" style="pointer-events:none"><div style="height:36px;background:rgba(255,255,255,.06);border-radius:8px;margin:8px"></div></div>`; }

/* ─── Count-up animation ─── */
function countUp(el, to) { let v = 0; const dur = 600, start = performance.now(); function step(ts) { const p = Math.min((ts - start) / dur, 1); const ease = 1 - Math.pow(1 - p, 3); v = Math.round(ease * to); el.textContent = v; if (p < 1) requestAnimationFrame(step); else el.textContent = to } requestAnimationFrame(step) }

/* ─── Real-time Clock ─── */
function updateClock() {
  const d = new Date(), h = d.getHours() % 12 || 12, m = d.getMinutes().toString().padStart(2, '0');
  const t = `${h}:${m}`;
  const el1 = document.getElementById('sb-time-main'); if (el1) el1.textContent = t;
  const el2 = document.getElementById('sb-time-auth'); if (el2) el2.textContent = t;
}
setInterval(updateClock, 5000); updateClock();

/* ─── Nav ─── */
let _realtimeChannels = [];
function go(s, d) {
  // Tear down any realtime subs from previous screen
  _realtimeChannels.forEach(ch => unsubscribe(ch));
  _realtimeChannels = [];

  S.prev = S.screen; S.screen = s;
  if (d?.id) S.detailId = d.id;
  const phone = document.getElementById('phone') || document.getElementById('phone-frame');
  document.querySelectorAll('.scr, .screen').forEach(e => { e.classList.remove('active', 'screen-enter'); e.style.display = 'none' });
  document.querySelectorAll('.nt,.fab,.nav-item').forEach(e => e.classList.remove('on', 'active'));
  const tab = document.querySelector(`[data-tab="${s}"]`);
  if (tab) tab.classList.add('on', 'active');
  const nav = document.getElementById('bnav') || document.getElementById('bottom-nav');
  if (!S.user || s === 'auth') { if (nav) nav.style.display = 'none'; renderAuth(); return }
  if (phone) phone.classList.remove('auth-mode');
  if (nav) nav.style.display = 'flex';
  const r = { home: renderHome, missions: renderMissions, report: renderReport, 'mission-detail': renderDetail, leaderboard: renderLB, profile: renderProfile };
  (r[s] || renderHome)();
  const screenArea = document.getElementById('screen-area') || document.getElementById('app-root');
  if (screenArea) screenArea.scrollTop = 0;
}

/* ═══════════════════════════════════════════
   AUTH SCREEN  — username-only entry
═══════════════════════════════════════════ */
function renderAuth() {
  const s = document.getElementById('s-auth') || document.getElementById('s-login');
  const phone = document.getElementById('phone') || document.getElementById('phone-frame');
  if (phone) phone.classList.add('auth-mode');
  if (!s) return;
  s.innerHTML = `
  <style>
    /* Break out of desktop phone shell for cinematic full screen */
    body:has(#s-auth.active) .app-shell {
      width: 100vw !important; height: 100vh !important; height: 100dvh !important;
      border-radius: 0 !important; box-shadow: none !important; margin: 0 !important;
      background: #000 !important; /* Force black background behind video */
    }
    body:has(#s-auth.active) .desktop-canvas::before { display: none !important; }
    
    /* Hide the wavy grey global background so it doesn't bleed through or cover the earth */
    body:has(#s-auth.active) .global-bg { display: none !important; }
    
    .cinematic-auth {
      position: absolute; inset: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; overflow: hidden;
      font-family: inherit; z-index: 10;
    }
    .cine-video {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: contain; z-index: -10;
      transform: scale(2.2);
      filter: brightness(0.45);
      /* Bulletproof fallback if /earth.mp4 is missing or blocked */
      background: #000 url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop') center/contain no-repeat;
    }
    .cine-overlay-gradient { 
      position: absolute; inset: 0; 
      background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.9) 100%); 
      z-index: -9; pointer-events: none; 
    }
    .cine-overlay-glow { 
      position: absolute; inset: 0; 
      background: radial-gradient(circle at center 60%, rgba(30,80,255,0.18) 0%, transparent 70%); 
      z-index: -8; pointer-events: none; 
    }

    .cine-content {
      position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;
      justify-content: center;
      padding: 0 32px; 
      animation: cineFadeIn 1.5s ease-out forwards;
    }
    @keyframes cineFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    .cine-mission-lbl { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7CFF3B; font-weight: 600; margin-bottom: 16px; opacity: 0.9; }
    .cine-title { font-size: 42px; font-weight: 800; line-height: 1.05; text-transform: uppercase; letter-spacing: -0.04em; color: #fff; margin-bottom: 16px; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
    .cine-sub { font-size: 14px; font-weight: 300; line-height: 1.5; color: rgba(255,255,255,0.8); }

    .cine-form { margin-top: 60px; display: flex; flex-direction: column; gap: 28px; margin-bottom: 20px; }
    .cine-input-wrap { position: relative; }
    .cine-input { 
      width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.3); 
      color: #ffffff; font-size: 16px; padding: 12px 0; outline: none; transition: all 0.3s ease;
      font-weight: 500; font-family: inherit;
    }
    .cine-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 400; font-size: 14px; }
    .cine-input:focus { border-bottom-color: #7CFF3B; text-shadow: 0 0 12px rgba(124,255,59,0.4); box-shadow: 0 8px 12px -10px rgba(124,255,59,0.5); }
    
    .af-err { position: absolute; bottom: -18px; left: 0; font-size: 10px; color: #FF4D6D; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
    .auth-global-err { margin-top: 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px; border-radius: 8px; text-align: center; color: #FF4D6D; background: transparent; border: 1px solid rgba(255,77,109,0.3); display: none; }
    .auth-global-err.show { display: block; }

    .cine-btn { 
      width: 100%; border-radius: 40px; background: #7CFF3B; color: #000; font-size: 15px; font-weight: 800; 
      padding: 18px 24px; border: none; text-transform: uppercase; letter-spacing: 0.12em;
      box-shadow: 0 0 24px rgba(124, 255, 59, 0.25); cursor: pointer; transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
      display: flex; align-items: center; justify-content: center; margin-top: 10px;
    }
    .cine-btn:active:not(:disabled) { transform: scale(0.96); box-shadow: 0 0 12px rgba(124, 255, 59, 0.5); }
    .cine-btn:disabled { opacity: 0.4; cursor: not-allowed; animation: none; transform: none; box-shadow: none; pointer-events: none; }
  </style>

  <div class="cinematic-auth">
    <video autoplay loop muted playsinline class="cine-video" poster="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop">
      <source src="/earth.mp4" type="video/mp4" />
    </video>
    <div class="cine-overlay-gradient"></div>
    <div class="cine-overlay-glow"></div>

    <div class="cine-content">
      <div class="cine-mission-lbl">01 — GLOBAL MISSION</div>
      <div class="cine-title">RESTORE<br/>THE WORLD</div>
      <div class="cine-sub">Cities are drowning in waste.<br/>Take action. Clean real locations.</div>

      <div class="cine-form">
        <div class="auth-global-err" id="aerr"></div>
        
        <div class="cine-input-wrap" id="af-u">
          <input class="cine-input" id="f-u" placeholder="Designation (Username)" autocomplete="username" maxlength="20" oninput="afClear('af-u','ae-u')"/>
          <div class="af-err" id="ae-u"></div>
        </div>

        <button class="cine-btn" id="abtn" onclick="doEnter()">ENTER THE WORLD</button>
      </div>
    </div>
  </div>`;
  s.style.display = 'block'; s.classList.add('active', 'screen-enter');
}

function _authSBHtml() { return ''; }

function _authEntryBody() { return ''; }

function afClear(wId, eId) {
  const w = document.getElementById(wId), e = document.getElementById(eId);
  if (w) w.classList.remove('err-state'); if (e) e.textContent = '';
  const ge = document.getElementById('aerr'); if (ge) { ge.classList.remove('show'); ge.textContent = '' }
}
function setFErr(wId, eId, msg) { const w = document.getElementById(wId), e = document.getElementById(eId); if (w) w.classList.add('err-state'); if (e) e.textContent = msg }

async function doEnter() {
  const btn = document.getElementById('abtn');
  const errEl = document.getElementById('aerr');
  const uInput = (document.getElementById('f-u')?.value || '').trim();

  // Basic validation
  if (uInput.length < 3) { setFErr('af-u','ae-u','At least 3 characters'); return }
  if (uInput.length > 20) { setFErr('af-u','ae-u','Max 20 characters'); return }
  if (!/^[a-zA-Z0-9_]+$/.test(uInput)) { setFErr('af-u','ae-u','Letters, numbers, _ only'); return }

  btn.disabled = true; btn.innerHTML = `<span class="auth-spin"></span> Loading…`;
  if (errEl) errEl.classList.remove('show');

  try {
    const profile = await getOrCreateProfile(uInput);
    saveSession(profile);
    await wait(300);
    const _phone = document.getElementById('phone') || document.getElementById('phone-frame');
    if (_phone) _phone.classList.remove('auth-mode');
    go('home');
  } catch (e) {
    if (errEl) { errEl.textContent = e.message || 'Something went wrong. Please try again.'; errEl.classList.add('show') }
    btn.disabled = false; btn.innerHTML = 'Start Sweeping';
  }
}

/* ═══════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════ */
function renderHome() {
  const u = S.user || {}, s = document.getElementById('s-home');
  s.innerHTML = `
<div class="hdr"><div class="hdr-l"><div class="avatar" style="width:40px;height:40px;font-size:14px">${ini(u.username)}</div><div class="hdr-g"><span>Hello!</span><span>${u.username || ''}</span></div></div><div class="hdr-r"><button class="icon-btn" onclick="openSweepXChat()" aria-label="Open SweepX Agent" title="Ask SweepX Agent">${I.help}</button><div class="icon-btn" style="position:relative">${I.bell}<span class="notif-dot"></span></div></div></div>
<div class="loc-bar" id="home-loc-bar"><span class="loc-bar-icon">${I.pin}</span><span class="loc-bar-text" id="home-loc-text">Locating…</span></div>
<div class="sg">
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.pin}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Reports</div><div class="sc-val" id="sc-reports">–</div></div></div>
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.chk}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Missions Done</div><div class="sc-val" id="sc-missions">–</div></div></div>
<div class="sc sc-map" id="sc-map-tile" style="cursor:pointer;overflow:hidden;padding:0">
  <div class="home-map-shell" id="home-map-shell" role="button" aria-expanded="false" tabindex="0">
    <div class="sc-top" style="position:absolute;top:12px;left:12px;right:12px;z-index:2;pointer-events:none;padding:0">
      <div class="sc-ico" style="background:rgba(0,0,0,.3);backdrop-filter:blur(4px)">${I.pin}</div>
      <div class="sc-arr" style="background:rgba(0,0,0,.3);backdrop-filter:blur(4px);opacity:1">${I.arr}</div>
    </div>
    <div class="home-map-header">
      <button class="home-map-close" id="home-map-close" aria-label="Close map" title="Close map" style="z-index:10">${I.xx}</button>
    </div>
    <div id="home-map" style="width:100%;height:100%;border-radius:inherit"></div>
    <div class="home-map-click-overlay" id="home-map-click-overlay"></div>
    <div class="home-map-hint" id="home-map-hint">Click to expand</div>
  </div>
</div>
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.star}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Your Rank</div><div class="sc-val" id="sc-rank">–</div></div></div>
</div>
<div class="ss" id="ss-strip"><div class="ss-c"><div class="ss-dr"><div class="ss-dot" style="background:#4D7A58"></div><span class="ss-l">Open</span></div><span class="ss-v" id="ss-open">–</span></div><div class="ss-c"><div class="ss-dr"><div class="ss-dot" style="background:#4D8EFF"></div><span class="ss-l">In Progress</span></div><span class="ss-v" id="ss-ip">–</span></div><div class="ss-c"><div class="ss-dr"><div class="ss-dot" style="background:#B4FF00"></div><span class="ss-l">Completed</span></div><span class="ss-v" id="ss-done">–</span></div></div>
<div class="sh"><span class="sh-t">Recent Missions</span><button class="sh-a" onclick="go('missions')">See all</button></div>
<div class="ml" id="missions-feed">${[1,2,3].map(skelRow).join('')}</div>
<div style="height:24px"></div>`;
  s.style.display = 'block'; s.classList.add('active');

  // Reset map expansion state
  _homeMapExpanded = false;
  document.body.classList.remove('map-expanded-open');

  // Bind map tile interaction BEFORE async load so clicks work immediately
  _bindHomeMapTileInteractions();

  // Async load
  _loadHome();
  _fillLocation();
}

function escapeChatHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
}

let _chatHistory = [];
function openSweepXChat() {
  let modal = document.getElementById('sweepx-chat');
  if (modal) { modal.classList.add('is-open'); document.getElementById('sweepx-chat-input')?.focus(); return; }
  modal = document.createElement('div');
  modal.id = 'sweepx-chat';
  modal.className = 'chat-modal is-open';
  modal.innerHTML = `
    <div class="chat-panel" role="dialog" aria-modal="true" aria-labelledby="sweepx-chat-title">
      <div class="chat-head"><div><div class="chat-kicker">SWEEPX AGENT</div><div id="sweepx-chat-title" class="chat-title">How can I help?</div></div>
        <button class="chat-close" onclick="closeSweepXChat()" aria-label="Close chat">×</button></div>
      <div class="chat-messages" id="sweepx-chat-messages">
        <div class="chat-bubble chat-agent">Hi! I can help with missions, reports, cleanup safety, and using SweepX.</div>
      </div>
      <form class="chat-form" onsubmit="sendSweepXChat(event)">
        <input id="sweepx-chat-input" maxlength="2000" autocomplete="off" placeholder="Ask the SweepX Agent…" aria-label="Message" />
        <button id="sweepx-chat-send" type="submit" aria-label="Send message">↑</button>
      </form>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', event => { if (event.target === modal) closeSweepXChat(); });
  document.getElementById('sweepx-chat-input').focus();
}

function closeSweepXChat() {
  const modal = document.getElementById('sweepx-chat');
  if (modal) modal.classList.remove('is-open');
}

function appendChatMessage(role, content) {
  const messages = document.getElementById('sweepx-chat-messages');
  if (!messages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role === 'user' ? 'chat-user' : 'chat-agent'}`;
  bubble.innerHTML = escapeChatHtml(content).replace(/\n/g, '<br>');
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

async function sendSweepXChat(event) {
  event.preventDefault();
  const input = document.getElementById('sweepx-chat-input');
  const button = document.getElementById('sweepx-chat-send');
  const message = input?.value.trim();
  if (!message || !button) return;
  input.value = '';
  appendChatMessage('user', message);
  _chatHistory.push({ role: 'user', content: message });
  button.disabled = true;
  button.textContent = '…';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        userId: S.user?.id,
        username: S.user?.username,
        history: _chatHistory
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'The agent is unavailable.');
    appendChatMessage('assistant', data.reply);
    _chatHistory.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    appendChatMessage('assistant', `Sorry, I couldn't connect right now. ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = '↑';
    input.focus();
  }
}

function _fillLocation() {
  var el = document.getElementById('home-loc-text');
  if (!el) return;
  if (!navigator.geolocation) { el.textContent = 'Location unavailable'; return; }
  navigator.geolocation.getCurrentPosition(function(pos) {
    fetch('https://nominatim.openstreetmap.org/reverse?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&format=json&addressdetails=1&zoom=18')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var a = d.address || {};
        var parts = [a.road || a.pedestrian || a.neighbourhood || '', a.suburb || a.city_district || '', a.city || a.town || a.village || ''].filter(Boolean);
        el.textContent = 'You are at ' + (parts.slice(0, 2).join(', ') || d.display_name || 'Unknown');
      })
      .catch(function() { el.textContent = 'Location unavailable'; });
  }, function() { el.textContent = 'Location unavailable'; }, { enableHighAccuracy: true, timeout: 8000 });
}


async function _loadHome() {
  try {
    const [missions, lbData, reports] = await Promise.all([
      getMissions(),
      getLeaderboard(),
      _getReportsForMap()
    ]);

    const op = missions.filter(m => m.st === 'open').length;
    const ip = missions.filter(m => m.st === 'in-progress').length;
    const dn = missions.filter(m => m.st === 'approved').length;

    // Find rank by username
    const rank = lbData.findIndex(u => u.username === S.user?.username) + 1 || '—';

    // Update stats
    const statsMap = {
      'sc-reports': S.user?.reports_submitted || 0,
      'sc-missions': S.user?.missions_completed || 0,
    };
    Object.entries(statsMap).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) countUp(el, val);
    });
    const rankEl = document.getElementById('sc-rank');
    if (rankEl) rankEl.textContent = rank ? '#' + rank : '—';

    // Status strip
    const ssOpen = document.getElementById('ss-open'); if (ssOpen) ssOpen.textContent = op;
    const ssIp = document.getElementById('ss-ip'); if (ssIp) ssIp.textContent = ip;
    const ssDone = document.getElementById('ss-done'); if (ssDone) ssDone.textContent = dn;

    // Mission feed
    const feed = document.getElementById('missions-feed');
    if (feed) {
      const recent = missions.filter(m => m.st === 'open' || m.st === 'in-progress').slice(0, 5);
      feed.innerHTML = recent.length
        ? recent.map((m, i) => mRow(m, i)).join('')
        : `<div class="empty">${I.pin}<div class="empty-t">No missions nearby</div><div class="empty-s">Report a garbage location to create one.</div></div>`;
    }

    // Init map
    _initHomeMap(reports);

    // Realtime
    const ch = subscribeReports(() => _loadHome());
    _realtimeChannels.push(ch);

  } catch (e) {
    const feed = document.getElementById('missions-feed');
    if (feed) feed.innerHTML = `<div class="empty">${I.xx}<div class="empty-t">Couldn't load missions</div><button class="btn-s" style="margin-top:8px" onclick="_loadHome()">Retry</button></div>`;
  }
}

async function _getReportsForMap() {
  const missions = await getMissions();
  return missions
    .filter(mission => mission.rpt?.lat != null && mission.rpt?.lng != null)
    .map(mission => ({
      id: mission.rpt.id, lat: mission.rpt.lat, lng: mission.rpt.lng,
      status: mission.st, location: mission.rpt.loc
    }));
}

let _homeMap = null;
let _homeMapExpanded = false;
function _initHomeMap(reports) {
  const mapEl = document.getElementById('home-map');
  if (!mapEl) return;

  _bindHomeMapTileInteractions();

  // Destroy previous instance cleanly
  if (_homeMap) { _homeMap.remove(); _homeMap = null; }

  // Show loading shimmer while we wait for geolocation
  mapEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0E0E0E;border-radius:18px">
    <span style="width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.08);border-top-color:#22FF88;animation:spin .8s linear infinite;display:block"></span>
  </div>`;

  const FALLBACK = [20.5937, 78.9629]; // India centre
  const DEFAULT_ZOOM = 13;

  function buildMap(lat, lng) {
    _setHomeMapMeta(lat, lng);

    // Clear loading state
    mapEl.innerHTML = '';

    const map = L.map('home-map', {
      center: [lat, lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      tap: false,
      touchZoom: false,
      doubleClickZoom: false
    });

    _homeMap = map;

    // Click on map when collapsed => expand
    map.on('click', function() {
      if (!_homeMapExpanded) {
        _expandHomeMap();
      }
    });

    // ── Dark tile: CartoDB DarkMatter, no API key ──
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // ── Status colors per spec ──
    const statusColors = {
      open: '#22FF88',
      'in-progress': '#7EB8FF',
      in_progress: '#7EB8FF',
      completed: '#4D4D4D',
      approved: '#4D4D4D'
    };

    // ── Plot report markers ──
    reports.forEach(r => {
      if (!r.lat || !r.lng) return;
      const color = statusColors[r.status] || '#4D4D4D';
      const label = (r.status || '').replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      const marker = L.circleMarker([r.lat, r.lng], {
        radius: 6,
        fillColor: color,
        color: 'rgba(0,0,0,0.6)',
        weight: 1,
        fillOpacity: 1,
        className: 'sweep-marker'
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:120px">
           <div style="font-weight:600;font-size:13px;color:#fff;margin-bottom:3px">${r.location || 'Report'}</div>
           <div style="font-size:11px;color:${color}">${label}</div>
         </div>`,
        { closeButton: false, className: 'sweep-popup', maxWidth: 200 }
      );
    });

    // ── User location marker (pulsing white dot, via custom HTML) ──
    const userIcon = L.divIcon({
      className: '',
      html: `<div class="user-dot-outer"><div class="user-dot-inner"></div></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

    // Fit to markers if we have several, otherwise stay centered on user
    if (reports.length > 1) {
      const pts = reports.filter(r => r.lat && r.lng).map(r => [r.lat, r.lng]);
      pts.push([lat, lng]);
      try {
        map.fitBounds(L.latLngBounds(pts), { padding: [16, 16], maxZoom: 15 });
      } catch (_) {}
    }

    setTimeout(() => map.invalidateSize(), 150);
  }

  // Request geolocation; fall back silently on deny/error
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => buildMap(pos.coords.latitude, pos.coords.longitude),
      ()  => buildMap(...FALLBACK),
      { timeout: 6000, maximumAge: 60000 }
    );
  } else {
    buildMap(...FALLBACK);
  }
}

function _setHomeMapMeta(lat, lng) {
  const locationEl = document.getElementById('home-map-location');
  if (locationEl && !locationEl.dataset.userUpdated) {
    locationEl.textContent = 'Finding your exact location...';
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const freshLat = pos.coords.latitude;
      const freshLng = pos.coords.longitude;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${freshLat}&lon=${freshLng}`);
        const data = await res.json();
        const address = data?.address || {};
        const road = address.road || address.pedestrian || address.footway || address.path;
        const houseNumber = address.house_number;
        const neighborhood = address.neighbourhood || address.suburb || address.city_district || address.hamlet;
        const city = address.city || address.town || address.village || address.county;

        const streetLine = [houseNumber, road].filter(Boolean).join(' ');
        const areaLine = [neighborhood, city].filter(Boolean).join(', ');
        const preciseLocation = streetLine || areaLine || (data?.display_name ? data.display_name.split(',').slice(0, 3).join(',').trim() : 'Current location');

        if (locationEl) {
          locationEl.textContent = preciseLocation;
          locationEl.dataset.userUpdated = '1';
        }
      } catch (_) {}
    }, () => {
      if (locationEl && !locationEl.dataset.userUpdated) {
        locationEl.textContent = 'Current location';
      }
    });
  }
}

// Global expand/collapse function so Leaflet click can access it
let _expandHomeMap = null;

function _bindHomeMapTileInteractions() {
  const tile = document.getElementById('home-map-shell');
  if (!tile || tile.dataset.bound === '1') return;

  const overlay = document.getElementById('home-map-click-overlay');

  const setExpanded = expanded => {
    _homeMapExpanded = expanded;
    document.body.classList.toggle('map-expanded-open', expanded);
    const tileWrap = document.getElementById('sc-map-tile');
    if (tileWrap) tileWrap.classList.toggle('is-expanded', expanded);
    tile.classList.toggle('is-expanded', expanded);
    tile.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (overlay) overlay.style.display = expanded ? 'none' : 'block';
    const hint = document.getElementById('home-map-hint');
    if (hint) hint.textContent = expanded ? 'Tap × to close' : 'Click to expand';
    // Toggle Leaflet interactivity based on expanded state
    if (_homeMap) {
      const mapEl = document.getElementById('home-map');
      if (expanded) {
        _homeMap.dragging.enable();
        _homeMap.touchZoom.enable();
        _homeMap.scrollWheelZoom.enable();
        if (mapEl) mapEl.style.pointerEvents = 'auto';
      } else {
        _homeMap.dragging.disable();
        _homeMap.touchZoom.disable();
        _homeMap.scrollWheelZoom.disable();
        if (mapEl) mapEl.style.pointerEvents = 'none';
      }
      setTimeout(() => _homeMap.invalidateSize(), expanded ? 260 : 220);
    }
  };

  // Expose expand function for Leaflet click handler
  _expandHomeMap = () => setExpanded(true);

  // Overlay click (for period before Leaflet initializes)
  if (overlay) {
    overlay.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!_homeMapExpanded) setExpanded(true);
    });
  }

  const closeBtn = document.getElementById('home-map-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      setExpanded(false);
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && _homeMapExpanded) {
      setExpanded(false);
    }
  });

  tile.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!_homeMapExpanded) setExpanded(true);
      else setExpanded(false);
    }
  });
  tile.dataset.bound = '1';
}


function mRow(m, i) {
  const meta = [timeAgo(m.at), m.rpt?.dist].filter(Boolean);
  return `<div class="mr" onclick="go('mission-detail',{id:'${m.id}'})" style="animation:slideUp .22s ease-out both;animation-delay:${i * 40}ms"><div class="mr-th">${m.rpt?.img ? `<img src="${m.rpt.img}" loading="lazy"/>` : I.pin}</div><div class="mr-bd"><div class="mr-loc">${m.rpt?.loc || 'Unknown'}</div><div class="mr-meta">${meta.map((t, j) => (j > 0 ? '<span class="dot"></span>' : '') + `<span>${t}</span>`).join('')}</div></div>${badge(m.st)}</div>`;
}

/* ═══════════════════════════════════════════
   MISSIONS SCREEN
═══════════════════════════════════════════ */
let _allMs = [];
function renderMissions() {
  const s = document.getElementById('s-missions');
  s.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 0"><span style="font-size:22px;font-weight:700;color:var(--text-primary)">Missions</span></div>
<div class="fp"><div class="pill on" onclick="filt(this,'all')">All</div><div class="pill" onclick="filt(this,'open')">Open</div><div class="pill" onclick="filt(this,'in-progress')">In Progress</div><div class="pill" onclick="filt(this,'approved')">Completed</div></div>
<div class="ml" id="mlist">${[1,2,3,4].map(skelRow).join('')}</div><div style="height:24px"></div>`;
  s.style.display = 'block'; s.classList.add('active');
  _loadMissions('all');
}

async function _loadMissions(filter) {
  try {
    _allMs = await getMissions(filter === 'all' ? null : filter);
    const l = document.getElementById('mlist');
    if (l) l.innerHTML = _allMs.length ? _allMs.map((m, i) => mCard(m, i)).join('') : '<div class="empty"><div class="empty-t">No missions</div></div>';
  } catch (e) {
    const l = document.getElementById('mlist');
    if (l) l.innerHTML = `<div class="empty">${I.xx}<div class="empty-t">Couldn't load missions</div><button class="btn-s" style="margin-top:8px" onclick="_loadMissions('all')">Retry</button></div>`;
  }
}

function mCard(m, i) {
  const showSplit = m.st === 'approved' && m.after_img && m.rpt?.img;
  const thumbHtml = showSplit
    ? `<div style="position:relative;width:100%;height:100%;overflow:hidden"><img src="${m.rpt.img}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/><img src="${m.after_img}" loading="lazy" style="position:absolute;top:0;right:0;width:50%;height:100%;object-fit:cover;border-left:1px solid rgba(255,255,255,.1)"/></div>`
    : m.rpt?.img ? `<img src="${m.rpt.img}" loading="lazy"/>` : I.trash;
  return `<div class="mcard" onclick="go('mission-detail',{id:'${m.id}'})" style="animation:slideUp .22s ease-out both;animation-delay:${i * 40}ms"><div class="mcard-img">${thumbHtml}</div><div class="mcard-bd"><div class="mcard-top"><span class="mcard-loc">${m.rpt?.loc || 'Unknown'}</span>${badge(m.st)}</div><div class="mcard-meta"><span><span class="avatar mini-av" style="background:${acCol()};display:inline-flex">${ini(m.creator?.username || 'U')}</span> ${m.creator?.username || 'Anon'}</span><span>${timeAgo(m.at)}</span></div><div class="mcard-pts">${I.trphy} +${m.points_reward || 150} pts</div></div></div>`;
}

function filt(el, f) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on')); el.classList.add('on');
  _loadMissions(f);
}

/* ═══════════════════════════════════════════
   REPORT SCREEN
═══════════════════════════════════════════ */
/* ── Report screen state ── */
const _ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const _MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
let _rImg = null, _rImgFile = null, _rLat = null, _rLng = null;

function renderReport() {
  const s = document.getElementById('s-report');
  _rImg = null; _rImgFile = null; _rLat = null; _rLng = null;
  s.innerHTML = `<div class="scr-hd"><button class="back-btn" onclick="go('home')">${I.back}</button><span class="scr-hd-t">New Report</span></div>
<div id="rpt-ct" style="display:flex;flex-direction:column;gap:12px;margin-top:12px">
<div class="rpt-card">
  <div class="rpt-lbl">Photo</div>
  <div class="uzone" id="uz" onclick="camera.open((blob, url) => _handleReportCamera(blob, url), 'report-image-input', 'ie')">${I.cam}<span>Tap to capture garbage</span></div>
  <input type="file" id="report-image-input" accept="image/jpeg,image/png,image/webp" capture="environment" style="display:none" aria-hidden="true"/>
  <div class="ferr" id="ie"></div>
</div>
<div class="rpt-card">
  <div class="rpt-lbl">Location</div>
  <input class="rpt-in" id="f-loc" placeholder="Enter address…" oninput="chkR()"/>
  <div class="ferr" id="le"></div>
  <button class="btn-s" id="loc-btn" style="margin-top:8px" onclick="getLoc()">📍 Use My Location</button>
</div>
<div class="rpt-card">
  <div class="rpt-lbl">Description <span style="font-weight:400;text-transform:none;color:var(--text-muted)">(optional)</span></div>
  <textarea class="rpt-ta" id="f-desc" placeholder="Describe the garbage…" maxlength="120" oninput="cc()"></textarea>
  <div class="char-c" id="dcc">0/120</div>
</div>
<div id="prog-wrap" style="display:none;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden">
  <div id="prog-bar" style="height:100%;width:0%;background:var(--accent);transition:width 100ms ease;border-radius:2px"></div>
</div>
<button class="btn-p" id="rbtn" onclick="subRpt()" disabled>Submit Report</button>
</div>`;
  s.style.display = 'block'; s.classList.add('active');
}

function _handleReportCamera(blob, dataUrl) {
  const errEl = document.getElementById('ie');
  if (errEl) errEl.textContent = '';
  _rImgFile = blob;
  _rImg = dataUrl;
  const uz = document.getElementById('uz');
  if (uz) {
    uz.innerHTML = `<img src="${_rImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1"/><span style="position:relative;z-index:2;font-size:11px;color:#fff;background:rgba(0,0,0,.4);padding:2px 6px;border-radius:4px">Tap to change</span>`;
    // Re-wire click
    uz.onclick = () => camera.open((b, url) => _handleReportCamera(b, url), 'report-image-input', 'ie');
  }

  // Reset any previous analysis state
  const rbtn = document.getElementById('rbtn');
  if (rbtn) { rbtn.textContent = 'Submit Report'; rbtn.disabled = false; }

  chkR();
}

function cc() {
  const d = document.getElementById('f-desc'), c = document.getElementById('dcc');
  if (d && c) c.textContent = d.value.length + '/120';
}

function _validateFile(f) {
  if (!f) return 'No file selected.';
  if (!_ALLOWED_TYPES.includes(f.type.toLowerCase())) return 'Only JPG, PNG, or WebP images are allowed.';
  if (f.size > _MAX_FILE_SIZE) return `Image must be under 10MB. Your file is ${(f.size / 1024 / 1024).toFixed(1)}MB.`;
  return null;
}

// _onImgChange is no longer used directly by the UI, but kept for reference or other potential uses.
function _onImgChange(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  const errEl = document.getElementById('ie');
  const valErr = _validateFile(f);
  if (valErr) {
    if (errEl) errEl.textContent = valErr;
    e.target.value = '';
    return;
  }
  if (errEl) errEl.textContent = '';
  _rImgFile = f;
  const r = new FileReader();
  r.onload = ev => {
    _rImg = ev.target.result;
    const uz = document.getElementById('uz');
    if (uz) uz.innerHTML = `<img src="${_rImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1"/><span style="position:relative;z-index:2;font-size:11px;color:#fff;background:rgba(0,0,0,.4);padding:2px 6px;border-radius:4px">Tap to change</span>`;
    // Re-wire click since innerHTML was replaced
    if (uz) uz.onclick = () => document.getElementById('report-image-input').click();
    chkR();
  };
  r.onerror = () => {
    if (errEl) errEl.textContent = 'Could not read the selected file. Please try another.';
    _rImgFile = null;
  };
  r.readAsDataURL(f);
  e.target.value = ''; // allow reselecting same file
}

// Legacy inline onchange handler kept for backward compat
function hImg(inp) { /* no-op — wired via event listener now */ }

function getLoc() {
  const btn = document.getElementById('loc-btn');
  if (!btn) return;
  const leEl = document.getElementById('le');
  if (!navigator.geolocation) {
    if (leEl) leEl.textContent = 'Geolocation is not supported by your browser.';
    return;
  }
  btn.disabled = true; btn.innerHTML = `<span class="spin" style="border-color:rgba(255,255,255,.2);border-top-color:#fff"></span> Getting…`;
  if (leEl) leEl.textContent = '';
  navigator.geolocation.getCurrentPosition(
    pos => {
      _rLat = pos.coords.latitude; _rLng = pos.coords.longitude;
      // Try to match Delhi-area preset, else show coordinates
      const presets = [
        { lat: 28.6139, lng: 77.2090, name: 'Central Delhi' },
        { lat: 28.5355, lng: 77.3910, name: 'Noida Sector 18' },
        { lat: 28.4595, lng: 77.0266, name: 'Gurugram Sector 29' },
        { lat: 28.6692, lng: 77.4538, name: 'Ghaziabad Raj Nagar' },
        { lat: 28.5700, lng: 77.3210, name: 'Faridabad Sector 12' },
      ];
      const nearest = presets.find(p => Math.abs(p.lat - _rLat) < 0.15 && Math.abs(p.lng - _rLng) < 0.15);
      const display = nearest ? nearest.name : `${_rLat.toFixed(4)}°N, ${_rLng.toFixed(4)}°E`;
      const locInput = document.getElementById('f-loc');
      if (locInput) locInput.value = display;
      btn.innerHTML = '📍 Captured ✓'; btn.style.color = 'var(--accent)';
      chkR();
    },
    err => {
      btn.innerHTML = '📍 Use My Location'; btn.disabled = false;
      const msgs = { 1: 'Location access denied. Please enter your address manually.', 2: 'Could not detect your location. Please enter manually.', 3: 'Location request timed out. Please enter manually.' };
      if (leEl) leEl.textContent = msgs[err.code] || 'Could not get location. Please enter manually.';
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );
}

function chkR() {
  const hasFile = !!_rImgFile;
  const hasLoc = (document.getElementById('f-loc')?.value || '').trim().length >= 3;
  const btn = document.getElementById('rbtn');
  if (btn) btn.disabled = !(hasFile && hasLoc);
}

function _simProgress(setFn) {
  let cur = 0;
  const iv = setInterval(() => {
    if (cur < 60) cur += Math.random() * 12 + 4;
    else if (cur < 85) cur += Math.random() * 4 + 1;
    else if (cur < 92) cur += Math.random() * 1.5;
    else { clearInterval(iv); return; }
    setFn(Math.min(Math.round(cur), 92));
  }, 120);
  return iv;
}

function _setProgress(pct) {
  const bar = document.getElementById('prog-bar'), wrap = document.getElementById('prog-wrap');
  if (!bar || !wrap) return;
  if (pct <= 0) { wrap.style.display = 'none'; bar.style.width = '0%'; return; }
  wrap.style.display = 'block'; bar.style.width = pct + '%';
}

function _resetReportForm() {
  _rImgFile = null; _rImg = null; _rLat = null; _rLng = null;
  const inp = document.getElementById('report-image-input'); if (inp) inp.value = '';
}

async function subRpt() {
  // Validate
  const loc = (document.getElementById('f-loc')?.value || '').trim();
  const desc = document.getElementById('f-desc')?.value || '';
  const ieEl = document.getElementById('ie'), leEl = document.getElementById('le');
  if (!_rImgFile) { if (ieEl) ieEl.textContent = 'Please add a photo of the garbage.'; return; }
  if (loc.length < 3) { if (leEl) leEl.textContent = 'Please enter or capture a location.'; return; }
  // Clear errors
  if (ieEl) ieEl.textContent = ''; if (leEl) leEl.textContent = '';

  const btn = document.getElementById('rbtn');
  btn.disabled = true; btn.innerHTML = `<span class="spin"></span> Uploading…`;
  _setProgress(0);

  let progressIv = _simProgress(_setProgress);
  try {
    // ── 1. Upload Image First ──
    let imageUrl;
    try {
      imageUrl = await uploadImage(_rImgFile, 'report-images');
    } catch(e) {
      throw new Error("Couldn't upload your photo. Check your connection and try again.");
    }

    // ── 2. Pre-Validation via NVIDIA ──
    btn.innerHTML = `<span class="spin"></span> Analyzing…`;
    const validation = await validateBeforeImage(imageUrl);
    
    if (!validation.skipped && validation.has_garbage === false) {
      if (progressIv) clearInterval(progressIv);
      _setProgress(0);
      btn.disabled = false; btn.textContent = 'Submit Report';
      if (ieEl) ieEl.textContent = validation.reason || 'No garbage detected in this photo. Please capture a location with visible garbage.';
      
      const uz = document.getElementById('uz');
      if (uz) {
        uz.innerHTML = `<img src="${_rImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;opacity:0.5"/><span style="position:relative;z-index:2;font-size:12px;color:#FF4D4D;font-weight:600;background:rgba(0,0,0,.6);padding:6px 12px;border-radius:6px;border:1px solid rgba(255,77,77,0.3)">${I.xx} Garbage not detected</span>`;
        uz.onclick = () => camera.open((b, url) => _handleReportCamera(b, url), 'report-image-input', 'ie');
      }

      if (validation.confidence >= 0.60) {
        if (typeof showToast !== 'undefined') showToast({ type: 'error', title: 'Invalid photo', subtitle: 'This photo does not appear to show a garbage location.' });
        else alert('This photo does not appear to show a garbage location.');
      }
      return;
    }

    // ── 3. Upload & DB Insert ──
    btn.innerHTML = `<span class="spin"></span> Saving…`;
    await createReport({ 
      imageUrl: imageUrl, description: desc, location: loc, lat: _rLat, lng: _rLng, userId: S.user?.id
    });

    // Complete progress bar
    clearInterval(progressIv);
    _setProgress(100);
    await new Promise(r => setTimeout(r, 300));
    _setProgress(0);

    // Refresh user profile points
    if (S.user?.id) { try { const updated = await getProfile(S.user.id); S.user = updated; } catch (_) {} }

    _resetReportForm();
    const ct = document.getElementById('rpt-ct');
    if (ct) ct.innerHTML = `<div class="suc"><div class="suc-ring">${I.ok}</div><div class="suc-t">Report Submitted!</div><div style="color:var(--accent);font-weight:700;font-size:20px;font-variant-numeric:tabular-nums">+50 pts</div><div class="suc-s">Your report is now a mission.</div></div>`;
    setTimeout(() => go('home'), 1800);
  } catch (e) {
    if (progressIv) clearInterval(progressIv);
    _setProgress(0);
    btn.disabled = false; btn.textContent = 'Submit Report';
    const msg = e.message || "Couldn't submit your photo. Check your connection and try again.";
    // Route error to the right field
    if (msg.toLowerCase().includes('photo') || msg.toLowerCase().includes('upload') || msg.toLowerCase().includes('image') || msg.toLowerCase().includes('file')) {
      if (ieEl) ieEl.textContent = msg;
    } else if (msg.toLowerCase().includes('location')) {
      if (leEl) leEl.textContent = msg;
    } else {
      if (leEl) leEl.textContent = msg; // generic fallback
    }
  }
}

/* ═══════════════════════════════════════════
   MISSION DETAIL SCREEN
═══════════════════════════════════════════ */
let _pImgFile = null;
function renderDetail() {
  const s = document.getElementById('s-detail'); _pImgFile = null;
  s.innerHTML = `<div class="scr-hd"><button class="back-btn" onclick="go('${S.prev || 'missions'}')">${I.back}</button><span class="scr-hd-t">Mission Detail</span></div><div style="height:200px;background:rgba(255,255,255,.04);border-radius:12px;margin-top:8px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">${I.img}</div><div style="height:12px"></div>${skelRow()}${skelRow()}`;
  s.style.display = 'block'; s.classList.add('active');
  _loadDetail(S.detailId);
}

async function _loadDetail(mId) {
  const s = document.getElementById('s-detail');
  try {
    const m = await getMissionById(mId);
    const img = m.rpt?.img ? `<img src="${m.rpt.img}" loading="lazy"/>` : `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text-muted)">${I.img}<span style="font-size:12px">No image</span></div>`;
    const isMe = S.user && m.ab === S.user.id;
    const isMine = S.user && m.rpt?.by === S.user.id;

    // Before/after comparison HTML
    const afterImg = m.after_img;
    let beforeAfterHtml = '';
    if (afterImg && (m.st === 'approved' || m.st === 'rejected')) {
      const borderColor = m.st === 'approved' ? 'rgba(180,255,0,0.2)' : 'rgba(255,77,77,0.2)';
      beforeAfterHtml = `<div style="display:flex;gap:8px;margin-top:12px">
        <div style="flex:1">
          <div style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px">Before</div>
          <img src="${m.rpt?.img || ''}" style="width:100%;height:100px;border-radius:10px;object-fit:cover;display:block"/>
        </div>
        <div style="flex:1">
          <div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px">After</div>
          <img src="${afterImg}" style="width:100%;height:100px;border-radius:10px;object-fit:cover;display:block;border:1px solid ${borderColor}"/>
        </div>
      </div>`;
    }

    const rejectionHtml = (m.st === 'rejected' && m.rejection_reason)
      ? `<div style="display:flex;gap:8px;align-items:flex-start;background:rgba(255,77,77,0.06);border:1px solid rgba(255,77,77,0.12);border-radius:12px;padding:12px;margin-top:8px">
           <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:#FF4D4D;fill:none;stroke-width:2;flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
           <span style="font-size:13px;color:#FF6B6B">${m.rejection_reason}</span>
         </div>` : '';

    let act = '';
    if (m.st === 'open' && !isMine) {
      act = `
        <div style="font-size:12px;font-weight:600;color:var(--accent);display:flex;align-items:center;gap:6px;margin-bottom:12px">
          ${I.trphy} +${m.points_reward || 150} pts on completion
        </div>
        <button class="btn-accept-pill" id="acbtn" onclick="accM('${m.id}')">
          <div class="chk-circ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          Accept Mission
        </button>
        <div id="acc-err" style="color:#FF4D4D;font-size:12px;margin-top:8px;text-align:center;display:none"></div>
      `;
    }
    else if (m.st === 'open' && isMine) act = '<div style="text-align:center;font-size:13px;color:var(--text-secondary);padding:12px 0">Waiting for a volunteer.</div>';
    else if ((m.st === 'in-progress' || m.st === 'in_progress') && isMe) act = proofHTML(m.id);
    else if (m.st === 'approved') act = `<div class="res-card ok"><div class="res-ico ok">${I.ok}</div><div class="res-t ok">Cleanup Verified!</div><div class="pts-pop">+${m.points_reward || 150} pts</div><div class="res-s">Points awarded.</div></div>`;
    else if (m.st === 'rejected') act = `<div class="res-card fail"><div class="res-ico fail">${I.xx}</div><div class="res-t fail">Proof Rejected</div><div class="res-s">Try clearer photos next time.</div></div>`;
    else if (m.st === 'manual_review') act = `<div class="res-card warn" style="background:var(--surface-2);border:1px dashed rgba(255,185,0,0.4);border-radius:12px;padding:16px;text-align:center"><div style="color:#FFB900;font-size:24px;margin-bottom:8px">⚠️</div><div style="color:#FFB900;font-weight:700;font-size:16px;margin-bottom:4px">Manual Review</div><div style="color:var(--text-muted);font-size:13px">Waiting for human review due to low AI confidence.</div></div>`;
    else if (m.st === 'in-progress' || m.st === 'in_progress') act = `<div style="text-align:center;font-size:13px;color:var(--text-secondary);padding:12px 0">Being cleaned by ${m.acceptor?.username || 'someone'}.</div>`;
    else if (m.st === 'pending') act = `<div class="verify-card"><span class="spin" style="border-color:rgba(255,255,255,.15);border-top-color:#fff"></span><div class="ver-t">Verifying cleanup…</div><div style="font-size:12px;color:var(--text-muted)">AI reviewing your photo</div></div>`;

    const delBtn = isMine ? `<button class="icon-btn" style="margin-right:8px;color:rgba(255,100,100,0.8)" onclick="doDelete('${m.id}')">${I.trash}</button>` : '';
    s.innerHTML = `<div class="scr-hd"><button class="back-btn" onclick="go('${S.prev || 'missions'}')">${I.back}</button><span class="scr-hd-t">Mission Detail</span><div style="margin-left:auto;display:flex;align-items:center">${delBtn}${badge(m.st)}</div></div>
<div class="det-hero">${img}</div>
${beforeAfterHtml}
<div class="det-card"><div class="det-loc">${m.rpt?.loc || 'Unknown'}</div><div class="det-rep"><div class="avatar" style="width:24px;height:24px;font-size:9px;background:${acCol()}">${ini(m.creator?.username || 'U')}</div><span style="font-size:13px;color:var(--text-secondary);flex:1">${m.creator?.username || 'Anon'}</span><span style="font-size:11px;color:var(--text-muted)">${timeAgo(m.at)}</span></div>${m.rpt?.desc ? `<div class="det-desc">${m.rpt.desc}</div>` : ''}</div>
${rejectionHtml}
<div class="det-card" id="parea">${act}</div><div style="height:24px"></div>`;

    // Realtime: watch for status changes (e.g. verification result)
    if (m.st === 'pending' || m.st === 'in-progress' || m.st === 'in_progress') {
      const ch = subscribeMission(m.id, () => _loadDetail(mId));
      _realtimeChannels.push(ch);
    }

  } catch (e) {
    s.innerHTML = `<div class="scr-hd"><button class="back-btn" onclick="go('missions')">${I.back}</button><span class="scr-hd-t">Mission Detail</span></div><div class="empty">${I.xx}<div class="empty-t">Mission not found</div></div>`;
  }
}

function proofHTML(mId) {
  return `<div style="display:flex;flex-direction:column;gap:12px">
  <div style="font-size:12px;font-weight:600;color:var(--accent);display:flex;align-items:center;gap:6px">${I.trphy} +150 pts reward</div>
  <div class="uzone" id="pz" onclick="camera.open((blob, dataUrl) => _handleProofCamera(blob, dataUrl), 'proof-image-input', 'pe')">${I.up}<span>Capture proof photo</span></div>
  <input type="file" id="proof-image-input" accept="image/jpeg,image/png,image/webp" capture="environment" style="display:none" aria-hidden="true"/>
  <div class="ferr" id="pe"></div>
  <div id="pprog-wrap" style="display:none;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden">
    <div id="pprog-bar" style="height:100%;width:0%;background:var(--accent);transition:width 100ms ease;border-radius:2px"></div>
  </div>
  <button class="btn-p" id="pbtn" onclick="subPrf('${mId}')" disabled>Submit Proof</button>
</div>`;
}

function _wirePrfInput(mId) {
  // Real logic now handled directly by CameraCapture and _handleProofCamera
}

function _handleProofCamera(blob, dataUrl) {
  const peEl = document.getElementById('pe');
  if (peEl) peEl.textContent = '';
  
  // Anti-cheat: Identical Before/After Check
  const reportImageDataUrl = document.getElementById('det-hero-img')?.src;
  if (reportImageDataUrl && reportImageDataUrl === dataUrl) {
    if (peEl) peEl.textContent = 'The proof photo appears identical to the report photo. Please take a new photo.';
    return;
  }
  
  _pImgFile = blob;
  const pz = document.getElementById('pz');
  if (pz) {
    pz.innerHTML = `<img src="${dataUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1"/><span style="position:relative;z-index:2;font-size:11px;color:#fff;background:rgba(0,0,0,.4);padding:2px 6px;border-radius:4px">Tap to change</span>`;
    pz.onclick = () => camera.open((b, url) => _handleProofCamera(b, url), 'proof-image-input', 'pe');
  }
  const pbtn = document.getElementById('pbtn');
  if (pbtn) pbtn.disabled = false;
}

// Legacy inline handler kept for compat
function hPrf(inp, mId) { /* no-op — wired via event listener now */ }

async function accM(mId) {
  const btn = document.getElementById('acbtn');
  const errEl = document.getElementById('acc-err');
  if (errEl) errEl.style.display = 'none';

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<span class="spin"></span> Checking proximity…`;

  try {
    const m = await getMissionById(mId);
    if (!m || !m.rpt) throw new Error("Mission not found");

    // Proximity Check (100m)
    const userPos = await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
    });

    const dist = _getDistance(
      userPos.coords.latitude, userPos.coords.longitude,
      m.rpt.lat, m.rpt.lng
    );

    if (dist > 0.1) { // 0.1 km = 100m
      throw new Error(`Too far away! You must be within 100m to accept this mission. (Currently ~${Math.round(dist * 1000)}m away)`);
    }

    btn.innerHTML = `<span class="spin"></span> Accepting…`;
    await acceptMission(mId, S.user.id);
    btn.innerHTML = `<div class="chk-circ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg></div> Accepted ✓`;
    btn.style.background = 'rgba(180, 255, 0, 0.4)';

    setTimeout(() => {
      const area = document.getElementById('parea');
      if (area) {
        area.innerHTML = proofHTML(mId);
        area.style.opacity = '0';
        requestAnimationFrame(() => {
          area.style.transition = 'opacity .2s';
          area.style.opacity = '1'
        });
      }
    }, 400);
  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    if (errEl) {
      errEl.textContent = e.message || 'Failed to accept mission.';
      errEl.style.display = 'block';
    }
  }
}

function _getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function _setPProof(pct) {
  const bar = document.getElementById('pprog-bar'), wrap = document.getElementById('pprog-wrap');
  if (!bar || !wrap) return;
  if (pct <= 0) { wrap.style.display = 'none'; bar.style.width = '0%'; return; }
  wrap.style.display = 'block'; bar.style.width = pct + '%';
}

async function subPrf(mId) {
  if (!_pImgFile) { const pe = document.getElementById('pe'); if (pe) pe.textContent = 'Please upload a photo showing the cleaned area.'; return; }
  const peEl = document.getElementById('pe'); if (peEl) peEl.textContent = '';
  const btn = document.getElementById('pbtn');
  btn.disabled = true; btn.innerHTML = `<span class="spin"></span> Uploading…`;
  _setPProof(0);
  let iv = _simProgress(_setPProof);
  try {
    const result = await submitProof(mId, _pImgFile, S.user.id);
    clearInterval(iv); _setPProof(100);
    await new Promise(r => setTimeout(r, 300)); _setPProof(0);
    _pImgFile = null;
    // submitProof now returns { ok: null, status: 'pending' } — show verifying state
    const area = document.getElementById('parea');
    if (area) area.innerHTML = `<div class="verify-card"><span class="spin" style="border-color:rgba(255,255,255,.15);border-top-color:#fff"></span><div class="ver-t">Verifying cleanup…</div><div style="font-size:12px;color:var(--text-muted)">AI reviewing your photo</div></div>`;
    // Realtime subscription already set up in _loadDetail will pick up approved/rejected
  } catch (e) {
    clearInterval(iv); _setPProof(0);
    btn.disabled = false; btn.textContent = 'Submit Proof';
    const msg = e.message || "Couldn't submit your proof. Please try again.";
    const pe = document.getElementById('pe');
    if (pe) pe.textContent = msg;
  }
}

/* ═══════════════════════════════════════════
   LEADERBOARD SCREEN
═══════════════════════════════════════════ */
function renderLB() {
  const s = document.getElementById('s-leaderboard');
  s.innerHTML = `<div style="padding:8px 0 0"><div style="font-size:22px;font-weight:700;color:var(--text-primary)">Top Cleaners</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Live rankings</div></div>
<div class="pod" id="lb-pods">${[0,1,2].map(() => `<div class="pod-c" style="background:rgba(255,255,255,.04);border-radius:12px;height:100px"></div>`).join('')}</div>
<div class="ml" id="lb-rest" style="margin-top:16px">${[1,2,3,4].map(i => `<div class="lb-row"><span class="lb-rk">${i+3}</span><div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.06)"></div><span class="lb-nm" style="flex:1"><span style="display:inline-block;height:11px;width:80px;background:rgba(255,255,255,.06);border-radius:3px"></span></span></div>`).join('')}</div>
<div style="height:24px"></div>`;
  s.style.display = 'block'; s.classList.add('active');
  _loadLB();
}

async function _loadLB() {
  try {
    const users = await getLeaderboard();
    _renderLBData(users);
    // Realtime: re-fetch on any profile update
    const ch = subscribeLeaderboard(() => getLeaderboard().then(_renderLBData));
    _realtimeChannels.push(ch);
  } catch (e) {
    const pods = document.getElementById('lb-pods');
    if (pods) pods.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px">Couldn't load rankings</div>`;
  }
}

function _renderLBData(users) {
  if (!users || users.length === 0) {
    const pods = document.getElementById('lb-pods');
    if (pods) pods.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;font-size:14px">No rankings yet</div>`;
    const lbRest = document.getElementById('lb-rest');
    if (lbRest) lbRest.innerHTML = '';
    return;
  }
  const t3 = users.slice(0, 3), rest = users.slice(3);
  const rc = ['r1', 'r2', 'r3'], order = [1, 0, 2];
  const pods = document.getElementById('lb-pods');
  if (pods) pods.innerHTML = order.map(idx => {
    const u = t3[idx]; if (!u) return '';
    const me = S.user && u.username === S.user.username;
    return `<div class="pod-c ${rc[idx]}${me ? ' me' : ''}"><div class="pod-rk">${idx + 1}</div><div class="avatar pod-av" style="background:${acCol()}">${ini(u.username)}</div><div class="pod-nm">${u.username}</div><div class="pod-pt">${u.points} pts</div></div>`;
  }).join('');
  const lbRest = document.getElementById('lb-rest');
  if (lbRest) lbRest.innerHTML = rest.map((u, i) => {
    const me = S.user && u.username === S.user.username;
    return `<div class="lb-row${me ? ' me' : ''}" style="animation:slideUp .22s ease-out both;animation-delay:${i * 40}ms"><span class="lb-rk">${i + 4}</span><div class="avatar" style="width:32px;height:32px;font-size:11px;background:${acCol()}">${ini(u.username)}</div><span class="lb-nm">${u.username}${me ? '<span class="you-tag">You</span>' : ''}</span><span class="lb-pt">${u.points}</span></div>`;
  }).join('');
}

/* ═══════════════════════════════════════════
   PROFILE SCREEN
═══════════════════════════════════════════ */
let _profMs = [];
function renderProfile() {
  const u = S.user || {}, s = document.getElementById('s-profile');
  s.innerHTML = `
<div class="hdr"><div class="hdr-l"><div class="avatar" style="width:40px;height:40px;font-size:14px">${ini(u.username)}</div><div class="hdr-g"><span>${u.username || ''}</span><span>@${(u.username || '').toLowerCase()}</span></div></div><div class="hdr-r"><div class="icon-btn">${I.cog}</div><div class="icon-btn" onclick="doLogout()">${I.logout}</div></div></div>
<div class="prof-hd"><div class="avatar" style="width:72px;height:72px;font-size:24px;margin-bottom:12px">${ini(u.username)}</div><div class="prof-nm">${u.username || ''}</div><div class="prof-h">@${(u.username || '').toLowerCase()}</div></div>
<div class="sg">
<div class="sc ft"><div class="sc-top"><div class="sc-ico">${I.star}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Points</div><div class="sc-val" id="pf-pts">–</div></div></div>
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.chk}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Missions</div><div class="sc-val" id="pf-mc">–</div></div></div>
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.pin}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Reports</div><div class="sc-val" id="pf-rs">–</div></div></div>
<div class="sc"><div class="sc-top"><div class="sc-ico">${I.trphy}</div><div class="sc-arr">${I.arr}</div></div><div class="sc-bot"><div class="sc-lbl">Level</div><div class="sc-val" id="pf-lv">–</div></div></div>
</div>
<div class="ss"><div class="ss-c"><div class="ss-dr"><span class="ss-l">Streak</span></div><span class="ss-v" id="pf-streak">–</span></div><div class="ss-c"><div class="ss-dr"><span class="ss-l">Approval</span></div><span class="ss-v" id="pf-apr">–</span></div></div>
<div class="sh" style="margin-top:20px"><span class="sh-t">My Missions</span><button class="sh-a" onclick="go('missions')">See all</button></div>
<div class="fp" id="pfp"><div class="pill on" onclick="pFilt(this,'all')">All</div><div class="pill" onclick="pFilt(this,'approved')">Completed</div><div class="pill" onclick="pFilt(this,'open')">Pending</div></div>
<div class="ml" id="phist">${[1,2].map(skelRow).join('')}</div>
<div style="padding:16px 0;text-align:center"><button onclick="doLogout()" style="background:none;border:none;color:var(--text-muted);font-size:14px;cursor:pointer;font-family:Inter,sans-serif">Log Out</button></div>
<div style="height:24px"></div>`;
  s.style.display = 'block'; s.classList.add('active');
  _loadProfile();
}

async function _loadProfile() {
  try {
    const profile = await getProfile(S.user.id);
    S.user = profile; // refresh state
    const mc = profile.missions_completed || 0, rs = profile.reports_submitted || 0;
    const apr = (mc + rs) > 0 ? Math.round(mc / (mc + rs) * 100) : 0;

    const statsMap = { 'pf-pts': profile.points || 0, 'pf-mc': mc, 'pf-rs': rs };
    Object.entries(statsMap).forEach(([id, val]) => { const el = document.getElementById(id); if (el) countUp(el, val) });
    const pfLv = document.getElementById('pf-lv'); if (pfLv) pfLv.textContent = `Lv ${profile.level || 1}`;
    const pfStr = document.getElementById('pf-streak'); if (pfStr) pfStr.textContent = (profile.streak || 0) + 'd';
    const pfApr = document.getElementById('pf-apr'); if (pfApr) pfApr.textContent = apr + '%';

    // Mission history from joined data
    _profMs = (profile.missions || []).map(m => ({
      id: m.id, st: m.status === 'in_progress' ? 'in-progress' : m.status,
      ab: S.user.id, at: m.created_at,
      rpt: { img: m.report?.image_url, loc: m.report?.location }
    }));
    const hist = document.getElementById('phist');
    if (hist) hist.innerHTML = _profMs.length ? _profMs.slice(0, 6).map((m, i) => mRow(m, i)).join('') : '<div class="empty"><div class="empty-t">No missions yet</div></div>';

  } catch (e) {
    const hist = document.getElementById('phist');
    if (hist) hist.innerHTML = `<div class="empty">${I.xx}<div class="empty-t">Couldn't load profile</div></div>`;
  }
}

function pFilt(el, f) {
  document.querySelectorAll('#pfp .pill').forEach(p => p.classList.remove('on')); el.classList.add('on');
  const ms = f === 'all' ? _profMs : _profMs.filter(m => m.st === f);
  const l = document.getElementById('phist');
  l.innerHTML = ms.length ? ms.slice(0, 6).map((m, i) => mRow(m, i)).join('') : '<div class="empty"><div class="empty-t">None here</div></div>';
}

function doLogout() { clearSession(); go('auth') }

function doDelete(mId) {
  // Build a custom confirmation modal (avoids blocking native dialogs)
  const overlay = document.createElement('div');
  overlay.id = 'del-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#1A1A1A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:24px;max-width:320px;width:100%;text-align:center">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,80,80,0.12);border:1px solid rgba(255,80,80,0.25);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">${I.trash}</div>
      <div style="font-size:17px;font-weight:700;color:var(--text-primary);margin-bottom:8px">Delete Quest?</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:24px">This will permanently remove the quest and its report. This cannot be undone.</div>
      <div style="display:flex;gap:10px">
        <button id="del-cancel" style="flex:1;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);color:var(--text-primary);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
        <button id="del-confirm" style="flex:1;padding:12px;border-radius:12px;border:none;background:#FF4D4D;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">Delete</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('del-cancel').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.getElementById('del-confirm').onclick = async () => {
    const confirmBtn = document.getElementById('del-confirm');
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = 'Deleting…'; }
    try {
      await deleteMission(mId, S.user.id);
      close();
      if (typeof showToast !== 'undefined') showToast({ type: 'success', title: 'Quest Deleted', subtitle: 'Removed from everywhere.' });
      go('home');
    } catch (e) {
      close();
      if (typeof showToast !== 'undefined') showToast({ type: 'error', title: 'Delete Failed', subtitle: e.message });
      else alert(e.message);
    }
  };
}

/* ═══════════════════════════════════════════
   BOOT
═══════════════════════════════════════════ */
async function boot() {
  go('auth');
}

boot();

/* ═══════════════════════════════════════════
   ETHEREAL SHADOW ANIMATION
═══════════════════════════════════════════ */
(function() {
  const hueMatrix = document.getElementById('etheral-hue');
  if (!hueMatrix) return;
  const animDuration = 5850; 
  let start;
  function step(timestamp) {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;
    const progress = (elapsed % animDuration) / animDuration;
    const hue = progress * 360;
    hueMatrix.setAttribute('values', hue.toString());
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
