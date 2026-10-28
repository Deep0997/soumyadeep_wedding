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

  // Keep the couple portrait alongside this script; works on GitHub Pages project paths too.
  const scriptElement = document.currentScript || Array.from(document.scripts).reverse().find(s => s.src && s.src.includes("wedding-animations"));
  const couplePhotoSrc = scriptElement?.src ? new URL("couple-photo.jpg", scriptElement.src).href : "couple-photo.jpg";

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


    /* Playful couple mascot: a tiny running Indian bride and groom */
    #wfx-couple-mascot { position:fixed; right:18px; bottom:18px; z-index:9998; display:flex; align-items:flex-end; gap:8px; max-width:min(320px, calc(100vw - 24px)); pointer-events:none; animation:wfx-mascot-travel 12s ease-in-out infinite; }
    #wfx-couple-mascot .wfx-mascot-art { width:96px; height:104px; flex:0 0 auto; filter:drop-shadow(0 5px 8px rgba(35,12,20,.22)); transform-origin:bottom center; animation:wfx-mascot-run 1.15s ease-in-out infinite; }
    #wfx-couple-mascot .wfx-mascot-bubble { pointer-events:auto; position:relative; margin-bottom:48px; border:1px solid #d2b16d; border-radius:16px 16px 16px 4px; padding:10px 12px; background:#fff8eb; color:#5c2636; box-shadow:0 5px 18px rgba(35,12,20,.18); font:13px/1.35 Georgia,serif; max-width:190px; animation:wfx-mascot-pop .45s cubic-bezier(.2,.8,.2,1) both; }
    #wfx-couple-mascot .wfx-mascot-bubble strong { color:#9b6e27; font-weight:700; }
    #wfx-couple-mascot .wfx-mascot-close { pointer-events:auto; position:absolute; top:-8px; right:-7px; width:22px; height:22px; border:1px solid #d2b16d; border-radius:50%; background:#fff8eb; color:#6d3444; cursor:pointer; font-size:14px; line-height:1; }
    #wfx-couple-mascot.wfx-mascot-jump .wfx-mascot-art { animation:wfx-mascot-jump .55s ease-in-out; }
    @keyframes wfx-mascot-run { 0%,100%{transform:translateY(0) rotate(-5deg)} 25%{transform:translateY(-8px) rotate(5deg)} 50%{transform:translateY(0) rotate(-5deg)} 75%{transform:translateY(-7px) rotate(5deg)} }
    @keyframes wfx-mascot-travel { 0%,12%{transform:translateX(0)} 42%{transform:translateX(calc(-1 * min(58vw, 620px)))} 58%{transform:translateX(calc(-1 * min(58vw, 620px)))} 88%,100%{transform:translateX(0)} }
    @keyframes wfx-mascot-travel-mobile { 0%,12%{transform:translateX(0)} 42%{transform:translateX(calc(-1 * min(42vw, 240px)))} 58%{transform:translateX(calc(-1 * min(42vw, 240px)))} 88%,100%{transform:translateX(0)} }
    @keyframes wfx-mascot-jump { 0%,100%{transform:translateY(0) rotate(0)} 35%{transform:translateY(-20px) rotate(-7deg)} 70%{transform:translateY(-4px) rotate(5deg)} }
    @keyframes wfx-mascot-pop { from{opacity:0;transform:translateY(8px) scale(.92)} to{opacity:1;transform:translateY(0) scale(1)} }
    @media(max-width:640px) { #wfx-couple-mascot {right:8px;bottom:10px;gap:4px; animation-name:wfx-mascot-travel-mobile} #wfx-couple-mascot .wfx-mascot-art{width:72px;height:80px} #wfx-couple-mascot .wfx-mascot-bubble{font-size:11px;max-width:150px;padding:8px 10px;margin-bottom:35px} }
    @media(prefers-reduced-motion:reduce) { #wfx-couple-mascot,#wfx-couple-mascot .wfx-mascot-art,#wfx-couple-mascot .wfx-mascot-bubble{animation:none!important} }
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
      padding: clamp(22px, 4vw, 38px) 22px; border: 1px solid rgba(160,119,55,.55);
      outline: 1px solid rgba(160,119,55,.32); outline-offset: 7px;
      background: rgba(255,250,241,.9); box-shadow: 0 24px 90px rgba(74,37,45,.15);
      max-height: calc(100svh - 44px); overflow-y: auto; overscroll-behavior: contain;
      scrollbar-width: thin; scrollbar-color: rgba(181,138,69,.5) transparent;
    }
    .wfx-couple-photo {
      position: relative; isolation: isolate; width: clamp(84px, 16vh, 128px);
      height: clamp(126px, 24vh, 190px); padding: 5px; margin: 8px auto 14px;
      border: 1px solid rgba(178,139,75,.9); outline: 1px solid rgba(178,139,75,.42);
      outline-offset: 3px; background: #fffaf1; box-shadow: 0 9px 25px rgba(103,37,60,.18);
      animation: wfx-photo-arrive .8s cubic-bezier(.2,.65,.25,1) both;
    }
    .wfx-couple-photo::before, .wfx-couple-photo::after {
      position: absolute; z-index: 2; color: #b58a45; font: 19px/1 Georgia,serif;
      text-shadow: 0 1px 5px rgba(255,250,241,.9); pointer-events:none;
    }
    .wfx-couple-photo::before { content:'❧'; left:-11px; top:-10px; transform:rotate(-28deg); }
    .wfx-couple-photo::after { content:'❧'; right:-11px; bottom:-10px; transform:rotate(152deg); }
    .wfx-couple-photo img {
      display:block; width:100%; height:100%; object-fit:cover; object-position:center;
      border:1px solid rgba(201,168,107,.35); background:#f3e4d4;
    }
    @keyframes wfx-photo-arrive {
      from { opacity:0; transform:translateY(10px) scale(.97); }
      to { opacity:1; transform:translateY(0) scale(1); }
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

    /* Main-page couple portrait: stays on the hero, not the opening overlay. */
    .hero.wfx-has-main-photo { height: auto; min-height: max(710px, 100svh); padding-bottom: 76px; }
    .wfx-main-couple-photo {
      position: relative; isolation: isolate; display: block;
      width: clamp(220px, 25vw, 300px); height: clamp(285px, 32vw, 390px);
      padding: 6px; margin: 4px auto 28px; border: 1px solid #c9a86b;
      outline: 1px solid rgba(201,168,107,.48); outline-offset: 4px;
      background: linear-gradient(135deg,#f4ddb0,#a88045 48%,#f7e8c4);
      box-shadow: 0 16px 38px rgba(0,0,0,.26), 0 0 34px rgba(201,168,107,.12);
      animation: wfx-main-photo-arrive .9s cubic-bezier(.2,.65,.25,1) both;
    }
    .wfx-main-couple-photo::before, .wfx-main-couple-photo::after {
      content: '✧'; position: absolute; z-index: 2; color: #e8ce91;
      font: 19px/1 Georgia,serif; text-shadow: 0 1px 7px rgba(0,0,0,.4);
      pointer-events: none;
    }
    .wfx-main-couple-photo::before { top: -12px; left: -11px; transform: rotate(-18deg); }
    .wfx-main-couple-photo::after { right: -11px; bottom: -12px; transform: rotate(18deg); }
    .wfx-main-couple-photo img {
      display: block; width: 100%; height: 100%; object-fit: cover;
      object-position: 50% 42%; border: 1px solid rgba(255,244,214,.55);
      background: #4b2732;
    }
    @keyframes wfx-main-photo-arrive {
      from { opacity: 0; transform: translateY(12px) scale(.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

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
      .wfx-main-couple-photo { width: min(64vw, 230px); height: min(82vw, 300px); margin: 8px auto 24px; }
      .wfx-intro-card { padding: 18px 15px; max-height: calc(100svh - 32px); }
      .wfx-intro-floral { margin-bottom: 7px; font-size: 27px; }
      .wfx-intro-title { margin: 12px 0 9px; font-size: clamp(36px, 9.6vw, 46px); line-height: 1.2; }
      .wfx-couple-photo { margin: 6px auto 11px; }
      .wfx-intro-copy { font-size:14px; margin-bottom:16px; }
    }
    @media(prefers-reduced-motion:reduce) {
      .wfx-intro,.wfx-intro-door,.wfx-intro-card,.wfx-intro-open,.wfx-timeline-dot { transition:none!important; }
    }
  `;

  function addCoupleMascot() {
    if (document.getElementById("wfx-couple-mascot")) return;
    const mascot = document.createElement("aside");
    mascot.id = "wfx-couple-mascot";
    mascot.setAttribute("aria-label", "A playful wedding greeting from the couple");
    mascot.innerHTML = `
      <svg class="wfx-mascot-art" viewBox="0 0 120 130" role="img" aria-label="Cartoon Indian groom running with his bride" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="wfx-groom-coat" x1="0" x2="1"><stop stop-color="#fff4df"/><stop offset="1" stop-color="#d8b987"/></linearGradient><linearGradient id="wfx-bride-dress" x1="0" x2="1"><stop stop-color="#e9a0b1"/><stop offset="1" stop-color="#a92f52"/></linearGradient></defs>
        <!-- Groom: ivory sherwani, maroon stole, turban -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <path d="M28 57 Q19 60 14 76 L24 80 L38 66" fill="none" stroke="#b87954" stroke-width="7"/><path d="M39 88 L27 107 L17 112" fill="none" stroke="#4c2835" stroke-width="8"/><path d="M49 88 L57 105 L70 108" fill="none" stroke="#4c2835" stroke-width="8"/>
          <path d="M27 48 Q27 35 40 34 Q54 36 54 51 L51 83 Q40 91 28 82Z" fill="url(#wfx-groom-coat)" stroke="#b88a51" stroke-width="1.5"/><path d="M38 39 L44 60 L50 42" fill="#7e2c45"/><path d="M42 43 L42 78" stroke="#c7a15a" stroke-width="2"/>
          <circle cx="41" cy="26" r="12" fill="#b87954"/><path d="M29 25 Q25 13 39 10 Q51 7 55 18 L50 22 L36 20Z" fill="#8d304b" stroke="#c7a15a" stroke-width="1.5"/><path d="M32 15 Q41 5 51 14" fill="none" stroke="#e2c477" stroke-width="3"/>
          <path d="M51 50 Q60 43 67 52 L75 63" fill="none" stroke="#b87954" stroke-width="6"/>
          <!-- Bride running alongside, pink lehenga and dupatta -->
          <path d="M72 85 L62 104 L53 112" fill="none" stroke="#b87954" stroke-width="6"/><path d="M87 85 L99 101 L110 103" fill="none" stroke="#b87954" stroke-width="6"/>
          <path d="M69 54 Q81 49 91 56 L101 87 Q85 99 64 88Z" fill="url(#wfx-bride-dress)" stroke="#c7a15a" stroke-width="1.5"/><path d="M70 60 Q60 56 58 66 L68 73" fill="none" stroke="#b87954" stroke-width="6"/><path d="M83 58 L94 82" stroke="#f2d28b" stroke-width="2" stroke-dasharray="2 4"/>
          <circle cx="81" cy="39" r="11" fill="#c98562"/><path d="M69 38 Q67 24 81 23 Q95 25 94 40 L89 34 L76 33Z" fill="#2e1b20"/><path d="M70 34 Q61 40 66 56 L73 60 L76 44Z" fill="#6b2a3d"/><path d="M68 29 Q80 18 92 29" fill="none" stroke="#c7a15a" stroke-width="3"/><circle cx="88" cy="39" r="1.2" fill="#3a2027"/><path d="M82 45 Q86 48 89 44" fill="none" stroke="#7c3446" stroke-width="1.5"/>
          <path d="M53 64 Q61 49 72 58" fill="none" stroke="#b87954" stroke-width="5"/><path d="M53 64 L68 70" stroke="#c7a15a" stroke-width="2"/>
          <path d="M18 25 l3 -6 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3Z" fill="#c7a15a"/><path d="M104 48 l2 -4 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2Z" fill="#d88b9b"/>
        </g>
      </svg>
      <div class="wfx-mascot-bubble" aria-live="polite"><button class="wfx-mascot-close" type="button" aria-label="Hide wedding mascot">×</button><strong>Hi! 👋</strong><br>We ran away with the wedding sweets! 🍬</div>
    `;
    document.body.appendChild(mascot);
    const bubble = mascot.querySelector(".wfx-mascot-bubble");
    const jokes = [
      ["Hi! 👋", "We ran away with the wedding sweets! 🍬"],
      ["Breaking news! 💃", "The bride is faster than the groom."],
      ["Groom update 🤵", "I said ‘just one photo’… 247 photos ago."],
      ["Bride says 👰", "First the puchka, then the pheras! 😋"],
      ["Important! 🌸", "Please RSVP. We need to count the laddoos."],
      ["Caught running! 🏃", "We're escaping to the dance floor! 🎶"]
    ];
    let jokeIndex = 0;
    const showJoke = () => {
      jokeIndex = (jokeIndex + 1) % jokes.length;
      bubble.querySelector("strong").textContent = jokes[jokeIndex][0];
      const textNode = bubble.lastChild;
      if (textNode) textNode.textContent = "\n" + jokes[jokeIndex][1];
      mascot.classList.remove("wfx-mascot-jump");
      void mascot.offsetWidth;
      mascot.classList.add("wfx-mascot-jump");
    };
    mascot.querySelector(".wfx-mascot-art").addEventListener("click", showJoke);
    bubble.addEventListener("click", (event) => { if (!event.target.closest("button")) showJoke(); });
    mascot.querySelector(".wfx-mascot-close").addEventListener("click", () => mascot.remove());
    window.setInterval(() => { if (document.body.contains(mascot)) showJoke(); }, 6500);
  }

  function init() {
    if (!document.body) return;
    addCoupleMascot();

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
    function buildMainHeroPhoto() {
      const hero = document.querySelector(".hero");
      const content = hero?.querySelector(".hero-content");
      const copy = content?.querySelector(".hero-copy");
      if (!hero || !content || !copy || content.querySelector(".wfx-main-couple-photo")) return;
      hero.classList.add("wfx-has-main-photo");

      const figure = document.createElement("figure");
      figure.className = "wfx-main-couple-photo";
      const image = document.createElement("img");
      image.src = couplePhotoSrc;
      image.alt = "Soumyadeep and Rica together";
      image.loading = "eager";
      image.decoding = "async";
      image.fetchPriority = "high";
      figure.appendChild(image);
      copy.insertAdjacentElement("afterend", figure);
    }

    function buildRoyalIntro() {
      if (reduceMotion) return;
      try { if (sessionStorage.getItem("wfx-intro-opened-photo-v1") === "1") return; } catch (_) {}
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
        try { sessionStorage.setItem("wfx-intro-opened-photo-v1", "1"); } catch (_) {}
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

    buildMainHeroPhoto();
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
