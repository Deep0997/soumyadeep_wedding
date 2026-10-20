/*
  Soumyadeep & Rica — optional frontend experience enhancements
  -------------------------------------------------
  No libraries or external assets required. Adds a royal invitation opening, richer florals,
  an interactive three-day timeline, and the original animations while preserving the site's
  original heading fonts and couple-name styling.
  It does not modify RSVP, countdown logic, Google Sheets, or photo-sharing behavior.

  To enable, add this one line to index.html just before </body>:
  <script src="wedding-animations.js" defer></script>
*/
(() => {
  "use strict";

  if (window.__weddingAnimationsLoaded) return;
  window.__weddingAnimationsLoaded = true;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const css = `
    :root {
      --wfx-gold: #c7a15a;
      --wfx-burgundy: #842b40;
      --wfx-blush: #e8b6bd;
      --wfx-cream: #fff5e6;
    }

    /* The floating layer never captures clicks or covers form controls. */
    #wfx-petal-layer,
    #wfx-burst-layer {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 20;
      contain: layout paint;
    }

    .wfx-falling-petal {
      position: absolute;
      top: -12vh;
      left: var(--wfx-left, 50%);
      color: var(--wfx-color, var(--wfx-blush));
      font-family: Georgia, serif;
      font-size: var(--wfx-size, 20px);
      line-height: 1;
      opacity: 0;
      text-shadow: 0 1px 8px rgba(132, 43, 64, .12);
      will-change: transform, opacity;
      animation: wfx-petal-fall var(--wfx-duration, 14s) linear var(--wfx-delay, 0s) forwards;
    }

    @keyframes wfx-petal-fall {
      0% { opacity: 0; transform: translate3d(0, -5vh, 0) rotate(0deg); }
      8% { opacity: .72; }
      82% { opacity: .62; }
      100% { opacity: 0; transform: translate3d(var(--wfx-drift, 70px), 115vh, 0) rotate(var(--wfx-rotate, 480deg)); }
    }

    .wfx-flower-burst {
      position: fixed;
      left: var(--wfx-x);
      top: var(--wfx-y);
      color: var(--wfx-color, var(--wfx-gold));
      font-family: Georgia, serif;
      font-size: var(--wfx-size, 18px);
      line-height: 1;
      text-shadow: 0 1px 7px rgba(199, 161, 90, .3);
      animation: wfx-bloom .9s cubic-bezier(.12,.7,.22,1) forwards;
      will-change: transform, opacity;
    }

    @keyframes wfx-bloom {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(.25) rotate(0deg); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: translate(calc(-50% + var(--wfx-dx)), calc(-50% + var(--wfx-dy))) scale(1.25) rotate(var(--wfx-spin, 100deg)); }
    }

    /* Scroll reveals are enabled only when JavaScript is running. */
    .wfx-reveal {
      opacity: 0;
      transform: translate3d(0, 22px, 0);
      transition: opacity .8s ease, transform .8s cubic-bezier(.2,.65,.25,1);
      transition-delay: var(--wfx-reveal-delay, 0ms);
    }
    .wfx-reveal.wfx-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .hero-content.wfx-reveal { transform: translate3d(0, 14px, 0); }
    .event-card.wfx-reveal { transform: translate3d(0, 24px, 0) scale(.985); }
    .event-card.wfx-reveal.wfx-visible { transform: translate3d(0, 0, 0) scale(1); }

    /* Soft, optional polish that follows the site's existing styling. */
    .hero-art { animation: wfx-art-float 7s ease-in-out infinite alternate; }
    .hero-art.art-right { animation-delay: -3.5s; }
    @keyframes wfx-art-float {
      from { translate: 0 0; }
      to { translate: 0 -9px; }
    }

    .event-card {
      transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
    }
    .event-card:hover,
    .event-card:focus-within {
      transform: translateY(-5px);
      box-shadow: 0 16px 36px rgba(87, 43, 44, .10);
    }
    .event-flower {
      transform-origin: center;
      transition: transform .65s cubic-bezier(.2,.7,.2,1), color .35s ease;
    }
    .event-card:hover .event-flower,
    .event-card:focus-within .event-flower {
      transform: rotate(24deg) scale(1.13);
      color: var(--wfx-gold);
    }

    .button, .nav-cta, .text-button, .back-top {
      transition: transform .25s ease, filter .25s ease, box-shadow .25s ease;
    }
    .button:hover, .nav-cta:hover, .text-button:hover, .back-top:hover {
      filter: brightness(1.04);
    }
    .button:hover { transform: translateY(-2px); }
    .button:active, .nav-cta:active, .text-button:active, .back-top:active {
      transform: scale(.98);
    }

    #active-event-title { animation: wfx-title-glow 5.5s ease-in-out infinite; }
    @keyframes wfx-title-glow {
      0%, 100% { text-shadow: 0 0 0 rgba(199,161,90,0); }
      50% { text-shadow: 0 0 16px rgba(199,161,90,.2); }
    }

    @media (max-width: 640px) {
      .hero-art { animation-duration: 9s; }
      .event-card:hover, .event-card:focus-within { transform: translateY(-2px); }
    }

    @media (prefers-reduced-motion: reduce) {
      #wfx-petal-layer, #wfx-burst-layer { display: none !important; }
      .wfx-reveal, .wfx-reveal.wfx-visible {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .hero-art, #active-event-title { animation: none !important; }
      .event-card, .event-flower, .button, .nav-cta, .text-button, .back-top {
        transition: none !important;
      }
    }
  `;

  const premiumCss = `
    /* Royal invitation opening */
    #wfx-burst-layer.wfx-intro-burst-open { z-index: 10001; }
    .wfx-intro {
      position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center;
      overflow: hidden; padding: 22px; background: radial-gradient(ellipse at center, #fff9ef 0%, #f2e4ce 60%, #d9c39d 100%);
      color: #542536; opacity: 1; transition: opacity .7s ease, visibility .7s ease;
    }
    .wfx-intro[hidden] { display: none; }
    .wfx-intro.is-opening { opacity: 0; visibility: hidden; pointer-events: none; }
    .wfx-intro-card {
      position: relative; z-index: 2; width: min(520px, 100%); text-align: center;
      padding: clamp(30px, 6vw, 58px) 22px; border: 1px solid rgba(160,119,55,.55);
      outline: 1px solid rgba(160,119,55,.32); outline-offset: 7px;
      background: rgba(255,250,241,.86); box-shadow: 0 24px 90px rgba(74,37,45,.15);
    }
    .wfx-intro-floral { color: #b58a45; font-size: 31px; letter-spacing: .2em; margin-bottom: 12px; }
    .wfx-intro-kicker { font-size: 10px; letter-spacing: .25em; text-transform: uppercase; color: #8b6840; }
    .wfx-intro-title {
      margin: 22px 0 14px;
      font: 400 clamp(38px, 5.8vw, 58px)/1.18 "Great Vibes", "Brush Script MT", "Segoe Script", cursive;
      letter-spacing: .005em;
      color: var(--wine, #2a121b);
      text-wrap: balance;
    }
    .wfx-intro-title em {
      color: var(--gold, #c9a86b);
      font-family: "Great Vibes", "Brush Script MT", "Segoe Script", cursive;
      font-size: 1.12em;
      font-style: normal;
      font-weight: 400;
      white-space: nowrap;
    }
    .wfx-intro-copy { color: #76605b; font: 15px/1.7 Georgia, serif; margin: 0 auto 27px; }
    .wfx-intro-open {
      border: 1px solid #b28b4b; background: linear-gradient(135deg,#8a3448,#67253c); color: #fff8e9;
      padding: 14px 24px; min-height: 48px; font: 11px/1.2 Georgia,serif; letter-spacing: .16em; text-transform: uppercase;
      cursor: pointer; box-shadow: 0 9px 24px rgba(103,37,60,.18); transition: transform .25s ease, box-shadow .25s ease;
    }
    .wfx-intro-open:hover { transform: translateY(-2px); box-shadow: 0 13px 29px rgba(103,37,60,.25); }
    .wfx-intro-door { position: absolute; z-index: 1; top: 0; bottom: 0; width: 50.1%; pointer-events: none;
      background: repeating-linear-gradient(90deg,rgba(168,128,59,.06) 0 1px,transparent 1px 42px), linear-gradient(135deg,#ead9b8,#fff6e6 55%,#e4d0a8);
      box-shadow: inset 0 0 0 1px rgba(153,113,50,.24); transition: transform 1.1s cubic-bezier(.68,0,.24,1);
    }
    .wfx-intro-door::after { content:'✦'; position:absolute; top:50%; color:#b58a45; font-size:24px; }
    .wfx-intro-door.left { left:0; transform-origin:left center; border-right:1px solid #c7a15a; }
    .wfx-intro-door.right { right:0; transform-origin:right center; border-left:1px solid #c7a15a; }
    .wfx-intro-door.left::after { right:20px; } .wfx-intro-door.right::after { left:20px; }
    .wfx-intro.is-opening .wfx-intro-door.left { transform: perspective(1200px) rotateY(-105deg); }
    .wfx-intro.is-opening .wfx-intro-door.right { transform: perspective(1200px) rotateY(105deg); }
    .wfx-intro.is-opening .wfx-intro-card { opacity: 0; transform: translateY(-12px) scale(.97); transition: opacity .35s ease, transform .45s ease; }
    .wfx-intro-skip { position:absolute; top:18px; right:20px; border:0; background:transparent; color:#705641; text-decoration:underline; cursor:pointer; font:12px Georgia,serif; z-index:4; }

    /* Intentionally do not override the original hero heading or couple-name styles. */

    /* Interactive three-day timeline inserted above the existing event cards */
    .wfx-timeline { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:0; position:relative; max-width:840px; margin: 0 auto 30px; padding: 0 8px; }
    .wfx-timeline::before { content:''; position:absolute; left:16.5%; right:16.5%; top:17px; height:1px; background:linear-gradient(90deg,#c7a15a,#e7cfa2,#c7a15a); }
    .wfx-timeline-step { position:relative; z-index:1; display:flex; align-items:center; flex-direction:column; gap:8px; border:0; padding:0 8px 8px; color:#71404a; background:transparent; cursor:pointer; text-align:center; font:inherit; }
    .wfx-timeline-dot { display:grid; place-items:center; width:35px; height:35px; border-radius:50%; border:1px solid #c8a66b; background:#fff9ef; color:#98733a; box-shadow:0 0 0 5px rgba(255,249,239,.85); transition:background .25s ease, transform .25s ease, box-shadow .25s ease; }
    .wfx-timeline-step:hover .wfx-timeline-dot,.wfx-timeline-step:focus-visible .wfx-timeline-dot { transform:scale(1.1); background:#f4e4c6; }
    .wfx-timeline-step.is-today .wfx-timeline-dot { background:#7d2d43; border-color:#c7a15a; color:#fff4d8; box-shadow:0 0 0 5px rgba(199,161,90,.15),0 0 20px rgba(199,161,90,.25); }
    .wfx-timeline-step.is-past { opacity:.63; }
    .wfx-timeline-name { font: 15px/1.3 Georgia,'Times New Roman',serif; }
    .wfx-timeline-date { color:#9a7a55; font-size:9px; letter-spacing:.12em; }
    .wfx-timeline-status { text-transform:uppercase; letter-spacing:.12em; font-size:8px; color:#94794e; min-height:10px; }
    @media(max-width:560px) {
      .wfx-timeline { margin-bottom:24px; padding:0; }
      .wfx-timeline::before { left:16%; right:16%; }
      .wfx-timeline-step { padding-inline:2px; gap:7px; }
      .wfx-timeline-name { font-size:12px; }
      .wfx-timeline-date { font-size:8px; letter-spacing:.06em; }
      .wfx-timeline-status { font-size:7px; letter-spacing:.05em; }
      .wfx-intro-copy { font-size:14px; }
      .wfx-intro-title { font-size: clamp(36px, 9.6vw, 46px); line-height: 1.2; }
    }
    @media(prefers-reduced-motion:reduce) {
      .wfx-intro,.wfx-intro-door,.wfx-intro-card,.wfx-intro-open,.wfx-timeline-dot { transition:none!important; }
    }
  `;

  function init() {
    if (!document.body) return;

    // Load an elegant calligraphy face for the invitation overlay only. If the
    // external font cannot load, the CSS falls back to local cursive fonts.
    if (!document.querySelector('link[data-wfx-calligraphy="true"]')) {
      const fontPreconnect = document.createElement("link");
      fontPreconnect.rel = "preconnect";
      fontPreconnect.href = "https://fonts.googleapis.com";
      document.head.appendChild(fontPreconnect);
      const fontPreconnectStatic = document.createElement("link");
      fontPreconnectStatic.rel = "preconnect";
      fontPreconnectStatic.href = "https://fonts.gstatic.com";
      fontPreconnectStatic.crossOrigin = "anonymous";
      document.head.appendChild(fontPreconnectStatic);
      const calligraphyFont = document.createElement("link");
      calligraphyFont.rel = "stylesheet";
      calligraphyFont.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
      calligraphyFont.dataset.wfxCalligraphy = "true";
      document.head.appendChild(calligraphyFont);
    }

    const style = document.createElement("style");
    style.id = "wfx-animations-style";
    style.textContent = css + premiumCss;
    document.head.appendChild(style);

    const petalLayer = document.createElement("div");
    petalLayer.id = "wfx-petal-layer";
    petalLayer.setAttribute("aria-hidden", "true");
    const burstLayer = document.createElement("div");
    burstLayer.id = "wfx-burst-layer";
    burstLayer.setAttribute("aria-hidden", "true");
    document.body.append(petalLayer, burstLayer);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    // Add an interactive event timeline above the existing event cards.
    function buildTimeline() {
      const section = document.querySelector(".events");
      const grid = section?.querySelector(".event-grid");
      const cards = grid ? [...grid.querySelectorAll(".event-card")] : [];
      if (!section || !grid || !cards.length || section.querySelector(".wfx-timeline")) return;
      const configured = [...((window.WEDDING_CONFIG || {}).events || [])].sort((a, b) => a.date.localeCompare(b.date));
      const defaults = [
        { title: "The Wedding", date: "2026-11-24" },
        { title: "The Party", date: "2026-11-25" },
        { title: "The Reception", date: "2026-11-26" }
      ];
      const events = configured.length ? configured : defaults;
      const parts = new Intl.DateTimeFormat("en-CA", { timeZone: (window.WEDDING_CONFIG || {}).timezone || "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      const p = Object.fromEntries(parts.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
      const today = `${p.year}-${p.month}-${p.day}`;
      const timeline = document.createElement("nav");
      timeline.className = "wfx-timeline";
      timeline.setAttribute("aria-label", "Explore the three wedding celebrations");
      events.slice(0, 3).forEach((event, index) => {
        const card = cards[index];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "wfx-timeline-step";
        const status = event.date === today ? "is-today" : event.date < today ? "is-past" : "is-upcoming";
        button.classList.add(status);
        button.dataset.eventDate = event.date;
        button.setAttribute("aria-label", `View ${event.title || defaults[index]?.title || "celebration"} details`);
        const parsedDate = new Date(`${event.date}T12:00:00+05:30`);
        const dateLabel = Number.isNaN(parsedDate.getTime()) ? "" : new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short" }).format(parsedDate).toUpperCase();
        const label = document.createElement("span"); label.className = "wfx-timeline-dot"; label.textContent = String(index + 1).padStart(2, "0");
        const name = document.createElement("span"); name.className = "wfx-timeline-name"; name.textContent = event.title || defaults[index]?.title || `Celebration ${index + 1}`;
        const date = document.createElement("span"); date.className = "wfx-timeline-date"; date.textContent = dateLabel;
        const statusText = document.createElement("span"); statusText.className = "wfx-timeline-status"; statusText.textContent = status === "is-today" ? "Today" : status === "is-past" ? "Celebrated" : "Coming up";
        button.append(label, name, date, statusText);
        button.addEventListener("click", () => {
          if (card) card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          if (card) { card.setAttribute("tabindex", "-1"); card.focus({ preventScroll: true }); }
        });
        timeline.appendChild(button);
      });
      grid.parentNode.insertBefore(timeline, grid);
      const refreshTimelineStatus = () => {
        const nowParts = new Intl.DateTimeFormat("en-CA", { timeZone: (window.WEDDING_CONFIG || {}).timezone || "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
        const nowObj = Object.fromEntries(nowParts.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
        const currentDate = `${nowObj.year}-${nowObj.month}-${nowObj.day}`;
        timeline.querySelectorAll(".wfx-timeline-step").forEach(button => {
          button.classList.remove("is-today", "is-past", "is-upcoming");
          const currentStatus = button.dataset.eventDate === currentDate ? "is-today" : button.dataset.eventDate < currentDate ? "is-past" : "is-upcoming";
          button.classList.add(currentStatus);
          const statusEl = button.querySelector(".wfx-timeline-status");
          if (statusEl) statusEl.textContent = currentStatus === "is-today" ? "Today" : currentStatus === "is-past" ? "Celebrated" : "Coming up";
        });
      };
      window.setInterval(refreshTimelineStatus, 60000);
    }

    // Show the invitation-opening moment once per browser tab session.
    function buildRoyalIntro() {
      if (reduceMotion) return;
      try { if (sessionStorage.getItem("wfx-intro-opened") === "1") return; } catch (_) {}
      const intro = document.createElement("div");
      intro.className = "wfx-intro";
      intro.setAttribute("role", "dialog");
      intro.setAttribute("aria-modal", "true");
      intro.setAttribute("aria-label", "Wedding invitation");
      intro.innerHTML = `
        <div class="wfx-intro-door left" aria-hidden="true"></div>
        <div class="wfx-intro-door right" aria-hidden="true"></div>
        <button type="button" class="wfx-intro-skip">Skip intro</button>
        <div class="wfx-intro-card">
          <div class="wfx-intro-floral" aria-hidden="true">❧ ❋ ❧</div>
          <div class="wfx-intro-kicker">Together with our families</div>
          <h2 class="wfx-intro-title">Soumyadeep <em>&amp;</em> Rica</h2>
          <p class="wfx-intro-copy">Invite you to celebrate the beginning<br>of our forever<br><strong>24 — 26 November 2026</strong></p>
          <button type="button" class="wfx-intro-open">Open the invitation <span aria-hidden="true">✦</span></button>
        </div>`;
      document.body.appendChild(intro);
      const close = () => {
        if (intro.classList.contains("is-opening")) return;
        try { sessionStorage.setItem("wfx-intro-opened", "1"); } catch (_) {}
        // Brief floral welcome burst at the centre when the invitation opens.
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches !== true) {
          const symbols = ["✿", "❀", "✧", "❁", "✽", "✦"];
          const colors = ["#c7a15a", "#e8b6bd", "#d9a0a8", "#f1d9ac", "#a75b6b"];
          for (let i = 0; i < 22; i += 1) {
            const bloom = document.createElement("span");
            bloom.className = "wfx-flower-burst"; bloom.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            bloom.style.setProperty("--wfx-x", `${window.innerWidth / 2}px`);
            bloom.style.setProperty("--wfx-y", `${window.innerHeight / 2}px`);
            bloom.style.setProperty("--wfx-dx", `${Math.round(Math.random() * 440 - 220)}px`);
            bloom.style.setProperty("--wfx-dy", `${Math.round(Math.random() * 300 - 150)}px`);
            bloom.style.setProperty("--wfx-spin", `${Math.round(Math.random() * 360 - 180)}deg`);
            bloom.style.setProperty("--wfx-size", `${13 + Math.random() * 17}px`);
            bloom.style.setProperty("--wfx-color", colors[Math.floor(Math.random() * colors.length)]);
            burstLayer.appendChild(bloom); bloom.addEventListener("animationend", () => bloom.remove(), { once: true });
          }
        }
        burstLayer.classList.add("wfx-intro-burst-open");
        window.setTimeout(() => burstLayer.classList.remove("wfx-intro-burst-open"), 1300);
        intro.classList.add("is-opening");
        window.setTimeout(() => intro.remove(), 1150);
      };
      intro.querySelector(".wfx-intro-open").addEventListener("click", close);
      intro.querySelector(".wfx-intro-skip").addEventListener("click", close);
      intro.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
      intro.querySelector(".wfx-intro-open").focus({ preventScroll: true });
    }

    buildTimeline();
    buildRoyalIntro();
    if (reduceMotion) return;

    const petalSymbols = ["✿", "❀", "✽", "❋", "✧", "❁"];
    const petalColors = ["#c7a15a", "#e8b6bd", "#d9a0a8", "#f1d9ac", "#a75b6b"];

    function addFallingPetal(initial = false) {
      // Keep a small cap on particles to stay light on mobile devices.
      if (petalLayer.childElementCount >= (isMobile ? 18 : 32)) return;
      const petal = document.createElement("span");
      petal.className = "wfx-falling-petal";
      petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
      petal.style.setProperty("--wfx-left", `${Math.random() * 100}%`);
      petal.style.setProperty("--wfx-color", petalColors[Math.floor(Math.random() * petalColors.length)]);
      petal.style.setProperty("--wfx-size", `${(isMobile ? 14 : 15) + Math.random() * (isMobile ? 14 : 19)}px`);
      petal.style.setProperty("--wfx-drift", `${Math.round(Math.random() * 170 - 85)}px`);
      petal.style.setProperty("--wfx-rotate", `${Math.round(300 + Math.random() * 540)}deg`);
      petal.style.setProperty("--wfx-duration", `${8 + Math.random() * 5}s`);
      petal.style.setProperty("--wfx-delay", initial ? `${-Math.random() * 9}s` : "0s");
      petalLayer.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    }

    // Start with a fuller shower, then keep a steady stream of falling petals.
    for (let i = 0; i < (isMobile ? 8 : 14); i += 1) addFallingPetal(true);
    window.setInterval(() => addFallingPetal(false), isMobile ? 650 : 350);

    // Reveal major page sections and event cards as visitors scroll.
    const revealTargets = document.querySelectorAll(
      ".hero-content, .countdown-section, .section-heading, .event-card, .quote-band, .rsvp-intro, #rsvp-form, .memories-content, .memory-art, .site-footer"
    );
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("wfx-visible");
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

      revealTargets.forEach((element, index) => {
        element.classList.add("wfx-reveal");
        if (element.classList.contains("event-card")) {
          element.style.setProperty("--wfx-reveal-delay", `${(index % 3) * 100}ms`);
        }
        observer.observe(element);
      });
    } else {
      revealTargets.forEach((element) => element.classList.add("wfx-visible"));
    }

    // Tiny floral bursts on buttons/links/cards; this never prevents navigation.
    let lastBurstAt = 0;
    document.addEventListener("pointerdown", (event) => {
      const interactive = event.target.closest("a, button, .event-card");
      if (!interactive || interactive.matches(":disabled")) return;
      const now = Date.now();
      if (now - lastBurstAt < 120) return;
      lastBurstAt = now;
      const x = event.clientX;
      const y = event.clientY;
      const count = isMobile ? 3 : 5;
      for (let i = 0; i < count; i += 1) {
        const flower = document.createElement("span");
        flower.className = "wfx-flower-burst";
        flower.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
        flower.style.setProperty("--wfx-x", `${x}px`);
        flower.style.setProperty("--wfx-y", `${y}px`);
        flower.style.setProperty("--wfx-dx", `${Math.round(Math.random() * 100 - 50)}px`);
        flower.style.setProperty("--wfx-dy", `${Math.round(Math.random() * -85 - 10)}px`);
        flower.style.setProperty("--wfx-spin", `${Math.round(Math.random() * 220 - 110)}deg`);
        flower.style.setProperty("--wfx-size", `${12 + Math.random() * 12}px`);
        flower.style.setProperty("--wfx-color", petalColors[Math.floor(Math.random() * petalColors.length)]);
        burstLayer.appendChild(flower);
        flower.addEventListener("animationend", () => flower.remove(), { once: true });
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
