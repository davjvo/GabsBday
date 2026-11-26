/* ==========================================================
   Gabs' birthday — behaviour (no libraries)
   ========================================================== */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const LANG = document.documentElement.lang === "es" ? "es" : "en";
  const ROOT = document.documentElement.dataset.root || "";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  document.documentElement.classList.add("js");

  /* ---------- text used by scripts ---------- */
  const STR = {
    en: {
      days: "days", hours: "hours", mins: "minutes", secs: "seconds",
      today: "It's party day!",
      sending: "Sending…",
      rsvpOk: "Thank you! Your answer is saved.",
      songOk: "Added to the playlist!",
      songDup: "You already requested a song. One per guest!",
      noteOk: "Your note is on the wall. Thank you!",
      notePending: "Thank you! Your note will appear once it's approved.",
      err: "Something went wrong. Please try again in a moment.",
      required: "Please fill in the required fields.",
      noSongs: "No requests yet. Be the first!",
      noNotes: "No notes yet. Leave the first one!",
      demo: "Demo mode: saved only in this browser.",
      by: "from",
      calTitle: "Gabs' birthday"
    },
    es: {
      days: "días", hours: "horas", mins: "minutos", secs: "segundos",
      today: "¡Hoy es la fiesta!",
      sending: "Enviando…",
      rsvpOk: "¡Gracias! Tu respuesta quedó guardada.",
      songOk: "¡Agregada a la playlist!",
      songDup: "Ya pediste una canción. ¡Una por invitado!",
      noteOk: "Tu mensajito ya está en el muro. ¡Gracias!",
      notePending: "¡Gracias! Tu mensajito aparecerá cuando sea aprobado.",
      err: "Algo salió mal. Intenta de nuevo en un momento.",
      required: "Por favor completa los campos obligatorios.",
      noSongs: "Aún no hay canciones. ¡Sé el primero!",
      noNotes: "Aún no hay mensajitos. ¡Deja el primero!",
      demo: "Modo demo: se guarda solo en este navegador.",
      by: "de",
      calTitle: "Cumpleaños de Gabs"
    }
  }[LANG];

  /* ==========================================================
     Data layer: Google Apps Script, or localStorage demo mode
     ========================================================== */
  const DEMO = !CFG.endpoint;
  const guestCode = new URLSearchParams(location.search).get("g") || "";

  const api = {
    async list(kind) {
      if (DEMO) return demoGet(kind);
      const res = await fetch(`${CFG.endpoint}?action=list&kind=${encodeURIComponent(kind)}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "error");
      return json.items || [];
    },
    async send(kind, data) {
      const payload = Object.assign({ kind, lang: LANG, guest: guestCode }, data);
      if (DEMO) return demoSend(payload);
      // text/plain avoids a CORS preflight, which Apps Script can't answer.
      const res = await fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      return res.json();
    }
  };

  function demoGet(kind) {
    return JSON.parse(localStorage.getItem("gabs-demo-" + kind) || "[]");
  }
  function demoSend(p) {
    const items = demoGet(p.kind);
    const key = (p.guest || p.name || "").trim().toLowerCase();
    if (p.kind === "song" && items.some(i => i.key === key)) return { ok: false, error: "duplicate" };
    items.push(Object.assign({ key, time: new Date().toISOString() }, p));
    localStorage.setItem("gabs-demo-" + p.kind, JSON.stringify(items));
    return { ok: true, approved: true };
  }

  /* ==========================================================
     Splash + music
     ========================================================== */
  const audio = new Audio(ROOT + (CFG.song || "assets/audio/song.mp3"));
  audio.loop = true;
  audio.preload = "auto";
  const musicBtn = $("#music-btn");
  const splash = $("#splash");

  function setMusicUi() {
    if (!musicBtn) return;
    musicBtn.classList.toggle("paused", audio.paused);
    musicBtn.setAttribute("aria-pressed", String(!audio.paused));
  }
  audio.addEventListener("play", setMusicUi);
  audio.addEventListener("pause", setMusicUi);

  function enter(withMusic) {
    if (withMusic) audio.play().catch(() => setMusicUi()); // missing file or blocked: stay silent
    splash.classList.add("gone");
    document.body.classList.remove("locked");
    musicBtn.hidden = false;
    setMusicUi();
    revealHero();
  }
  if (splash) {
    document.body.classList.add("locked");
    $("#enter").addEventListener("click", () => enter(true));
    $("#enter-silent").addEventListener("click", () => enter(false));
  }
  musicBtn && musicBtn.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.resume = "1"; }
    else if (!document.hidden && audio.dataset.resume) { delete audio.dataset.resume; audio.play().catch(() => {}); }
  });

  /* ==========================================================
     Scroll animations
     ========================================================== */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          e.target.dispatchEvent(new CustomEvent("revealed"));
          io.unobserve(e.target);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })
    : null;
  function watch(el) { io ? io.observe(el) : el.classList.add("in"); }
  function revealHero() { $$(".hero .reveal").forEach(el => el.classList.add("in")); }
  $$(".reveal").forEach(el => { if (!el.closest(".hero")) watch(el); });
  if (!splash) revealHero();

  // Top bar turns solid after the portada; light parallax on the portada photo.
  const topbar = $(".topbar");
  const heroBg = $(".hero-bg");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    topbar && topbar.classList.toggle("solid", y > window.innerHeight * 0.8);
    if (heroBg && !reduce && y < window.innerHeight * 1.2) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ==========================================================
     Details from config
     ========================================================== */
  const start = new Date(CFG.start);
  const end = new Date(CFG.end);
  const locale = LANG === "es" ? "es" : "en-US";
  const fmt = (d, o) => isNaN(d) ? "" : new Intl.DateTimeFormat(locale, o).format(d);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fill = {
    date: cap(fmt(start, { day: "numeric", month: "long" })),
    weekday: cap(fmt(start, { weekday: "long" })) + " · " + fmt(start, { year: "numeric" }),
    time: fmt(start, { hour: "numeric", minute: "2-digit" }),
    timeEnd: fmt(end, { hour: "numeric", minute: "2-digit" }),
    dress: (CFG.dressCode || {})[LANG] || "",
    dressNote: (CFG.dressNote || {})[LANG] || "",
    venue: CFG.venueName || "",
    address: CFG.address || "",
    rsvpBy: cap(fmt(new Date(CFG.rsvpBy + "T12:00"), { day: "numeric", month: "long" })),
    fullDate: cap(fmt(start, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
  };
  $$("[data-cfg]").forEach(el => { const v = fill[el.dataset.cfg]; if (v) el.textContent = v; });

  // Map and directions
  const q = encodeURIComponent(CFG.mapQuery || CFG.address || "");
  const map = $("#map");
  if (map) map.src = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  const gmaps = $("#gmaps"); if (gmaps) gmaps.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const waze = $("#waze"); if (waze) waze.href = `https://waze.com/ul?q=${q}&navigate=yes`;

  // Add to calendar (.ics download, works with Apple, Google and Outlook)
  const calBtn = $("#add-cal");
  calBtn && calBtn.addEventListener("click", () => {
    const stamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const esc = s => String(s).replace(/([,;\\])/g, "\\$1");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//gabs-birthday//EN", "BEGIN:VEVENT",
      "UID:gabs-birthday-" + stamp(start) + "@invite",
      "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(start), "DTEND:" + stamp(end),
      "SUMMARY:" + esc(STR.calTitle),
      "LOCATION:" + esc([CFG.venueName, CFG.address].filter(Boolean).join(", ")),
      "URL:" + location.href.split("?")[0],
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "gabs-birthday.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  /* ---------- countdown (counts up from 0 the first time it appears) ---------- */
  const cd = $("#countdown");
  if (cd) {
    const parts = () => {
      let s = Math.max(0, Math.floor((start - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      return [d, Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
    };
    const labels = [STR.days, STR.hours, STR.mins, STR.secs];
    cd.innerHTML = labels.map(l => `<div><b>0</b><span>${l}</span></div>`).join("");
    const nums = $$("b", cd);
    const render = () => {
      if (start - Date.now() <= 0) { cd.innerHTML = `<p class="big">${STR.today}</p>`; return false; }
      parts().forEach((v, i) => { nums[i].textContent = String(v).padStart(2, "0"); });
      return true;
    };
    const tickUp = () => {
      const target = parts(); const t0 = performance.now(); const dur = reduce ? 0 : 1400;
      (function frame(now) {
        const k = Math.min(1, (now - t0) / (dur || 1)); const e = 1 - Math.pow(1 - k, 3);
        target.forEach((v, i) => { nums[i].textContent = String(Math.round(v * e)).padStart(2, "0"); });
        if (k < 1) requestAnimationFrame(frame);
        else if (render()) { const t = setInterval(() => { if (!render()) clearInterval(t); }, 1000); }
      })(t0);
    };
    if (isNaN(start)) cd.remove();
    else { cd.addEventListener("revealed", tickUp, { once: true }); cd.classList.add("reveal"); watch(cd); }
  }

  /* ==========================================================
     Wish list: one button to the external list (config.js)
     ========================================================== */
  const wishlist = $("#wishlist-link");
  if (wishlist) {
    if (CFG.wishlistUrl && CFG.wishlistUrl !== "#") wishlist.href = CFG.wishlistUrl;
    else wishlist.removeAttribute("target");
  }

  /* ==========================================================
     Forms
     ========================================================== */
  function flash(el, text, kind) { if (!el) return; el.textContent = text; el.className = "form-msg " + (kind || ""); }
  function formData(form) {
    const o = {};
    new FormData(form).forEach((v, k) => { o[k] = String(v).trim(); });
    return o;
  }
  function handle(form, kind, onOk) {
    if (!form) return;
    const msg = $(".form-msg", form);
    const btn = $("button[type=submit]", form);
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); flash(msg, STR.required, "err"); return; }
      const data = formData(form);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = STR.sending; flash(msg, "");
      try {
        const r = await api.send(kind, data);
        onOk(r, data, msg);
      } catch (e) {
        flash(msg, STR.err, "err");
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  // RSVP: hide companions when not attending
  const rsvp = $("#rsvp-form");
  if (rsvp) {
    const guests = $("#rsvp-guests-field", rsvp);
    rsvp.addEventListener("change", () => {
      const no = (rsvp.elements.attending.value === "no");
      guests.hidden = no;
    });
  }
  handle(rsvp, "rsvp", (r, data, msg) => {
    if (!r.ok) return flash(msg, STR.err, "err");
    rsvp.closest(".form-box").classList.add("done");
  });

  // Song requests: one per person
  const songForm = $("#song-form");
  const songList = $("#song-list");
  const SONG_KEY = "gabs-song-done";
  if (songForm && localStorage.getItem(SONG_KEY)) songForm.closest(".form-box").classList.add("done");
  handle(songForm, "song", (r, data, msg) => {
    if (!r.ok && r.error === "duplicate") { localStorage.setItem(SONG_KEY, "1"); return flash(msg, STR.songDup, "err"); }
    if (!r.ok) return flash(msg, STR.err, "err");
    localStorage.setItem(SONG_KEY, "1");
    songForm.closest(".form-box").classList.add("done");
    loadSongs();
  });
  async function loadSongs() {
    if (!songList) return;
    try {
      const items = await api.list("song");
      songList.innerHTML = "";
      if (!items.length) { const li = document.createElement("li"); li.textContent = STR.noSongs; songList.appendChild(li); return; }
      items.slice().reverse().forEach((s, i) => {
        const li = document.createElement("li");
        li.className = "reveal"; li.style.setProperty("--i", Math.min(i, 6));
        li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-note"/></svg><span><b></b> · <span></span></span><small></small>`;
        $("b", li).textContent = s.title;
        $("span > span", li).textContent = s.artist;
        $("small", li).textContent = `${STR.by} ${s.name}`;
        songList.appendChild(li);
        watch(li);
      });
    } catch (e) { /* list stays empty */ }
  }

  // Note wall
  const wallForm = $("#wall-form");
  const wall = $("#wall-notes");
  handle(wallForm, "note", (r, data, msg) => {
    if (!r.ok) return flash(msg, STR.err, "err");
    wallForm.reset();
    flash(msg, r.approved === false ? STR.notePending : STR.noteOk, "ok");
    loadWall();
  });
  async function loadWall() {
    if (!wall) return;
    try {
      const items = await api.list("note");
      wall.innerHTML = "";
      if (!items.length) { const p = document.createElement("p"); p.className = "wall-empty"; p.textContent = STR.noNotes; wall.appendChild(p); return; }
      items.slice().reverse().forEach((n, i) => {
        const el = document.createElement("article");
        el.className = `note reveal c${i % 5}`;
        el.style.setProperty("--tilt", (((i * 37) % 7) - 3) * 0.6 + "deg");
        el.style.setProperty("--i", i % 3);
        el.innerHTML = "<p></p><footer></footer>";
        $("p", el).textContent = n.message;
        $("footer", el).textContent = "— " + n.name;
        wall.appendChild(el);
        watch(el);
      });
    } catch (e) { /* wall stays empty */ }
  }

  if (DEMO) $$(".demo-note").forEach(el => { el.textContent = STR.demo; el.hidden = false; });

  loadSongs();
  loadWall();
})();
