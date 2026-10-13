/* mypoker.ge — home scenes */
(() => {
  "use strict";
  const MP = window.MP;
  const { $, $$, reduced, isMobile, byId, img, money } = MP;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ── page copy ─────────────────────────────── */
  const TT = {
    ka: {
      dragHint: "(drag around to view)", logKicker: "SHOP", toCatalog: "კატალოგის ნახვა",
      logMid: "აღჭურვილობა<br>იდეალური<br>თამაშის ღამისთვის",
      logDesc: "ჩიპები, კარტები, მაგიდები და სამაგიდო თამაშები. ყველაფერი ერთ მისამართზე, მიწოდებით მეორე დღეს.",
      fx1a: "მეორე დღეს, თბილისის მასშტაბით.", fx1b: "80 ₾-ზე მეტი შეკვეთის მიწოდება უფასოა. რეგიონებში 2–3 დღე.",
      fx2a: "ორიგინალი ბრენდები, შემოწმებული.", fx2b: "Bicycle, Copag და კაზინოს ხარისხის ჩიპები. ყოველ ნივთს ვამოწმებთ გაგზავნამდე.",
      fx3a: "გადაიხადე, როცა მიიღებ.", fx3b: "ნაღდით ან ბარათით კურიერთან. წინასწარი გადახდა საჭირო არ არის.",
      archLede: "ხუთი მაგიდა, ხუთი კომპლექტი. აირჩიე შენი ღამის ფორმატი.",
      kitNote: "დააჭირე ეტიკეტს ან სიის ჩანაწერს, რომ კალათაში დაამატო.",
      flash: "(move here to turn on flashlight)",
      oContact: "კონტაქტი", oShip: "მიწოდება", oShip1: "თბილისი: მეორე დღეს", oShip2: "უფასო 80 ₾-დან",
      oHours: "სამუშაო საათები", oHours1: "ორშ–შაბ 10:00–20:00", oHours2: "კვირა 11:00–18:00",
      products: (n) => `${n} პროდუქტი`, addKit: (s) => `მთელი კომპლექტის დამატება, ${s}`, kitAdded: "კომპლექტი კალათაშია",
      loc: "LOCATION", players: "PLAYERS", total: "TOTAL",
    },
    en: {
      dragHint: "(drag around to view)", logKicker: "SHOP", toCatalog: "Browse the catalog",
      logMid: "Equipment<br>for the perfect<br>game night",
      logDesc: "Chips, cards, tables and board games. Everything at one address, delivered the next day.",
      fx1a: "Next day, anywhere in Tbilisi.", fx1b: "Orders over 80 ₾ ship free. Regions in 2–3 days.",
      fx2a: "Original brands, checked.", fx2b: "Bicycle, Copag and casino-grade chips. Every item is inspected before it ships.",
      fx3a: "Pay when it arrives.", fx3b: "Cash or card to the courier. No prepayment needed.",
      archLede: "Five tables, five kits. Pick the format of your night.",
      kitNote: "Tap a label or a list item to add it to the cart.",
      flash: "(move here to turn on flashlight)",
      oContact: "Contact", oShip: "Delivery", oShip1: "Tbilisi: next day", oShip2: "Free from 80 ₾",
      oHours: "Opening hours", oHours1: "Mon–Sat 10:00–20:00", oHours2: "Sun 11:00–18:00",
      products: (n) => `${n} products`, addKit: (s) => `Add the whole kit, ${s}`, kitAdded: "The kit is in your cart",
      loc: "LOCATION", players: "PLAYERS", total: "TOTAL",
    },
  };
  const tt = (k, ...a) => { const v = TT[MP.lang][k]; return typeof v === "function" ? v(...a) : v; };
  function applyTT() { $$("[data-tt]").forEach((el) => { const v = TT[MP.lang][el.dataset.tt]; if (typeof v === "string") el.innerHTML = v; }); }

  /* ── 0. HERO: texture grid + glitching wordmark ─────────────────────────────── */
  const TEX = [
    ["t01", "table-oval", "LOT-01-FELT"], ["t02", "chips-500", "LOT-02-CLAY"], ["t03", "bicycle", "LOT-03-BACK"], ["t04", "ceramic-300", "LOT-04-CERAMIC"], ["t05", "dice", "LOT-05-DICE"],
    ["t06", "nardi", "LOT-06-WALNUT"], ["t07", "table-oval", "LOT-07-RAIL"], ["t08", "chips-500", "LOT-08-ALU"], ["t09", "dealer-button", "LOT-09-ACRYLIC"], ["t10", "copag", "LOT-10-ACE"],
    ["t11", "jumbo-12", "LOT-11-DECK"], ["t12", "table-octagon", "LOT-12-FELT-RD"], ["t13", "chess", "LOT-13-CHESS"], ["t14", "domino", "LOT-14-DOMINO"], ["t15", "chips-200", "LOT-15-STACK"],
  ];
  const HTXT = {
    ka: ["თამაშის ღამის ყველაზე სასურველი აღჭურვილობა.", "შერჩეული. შემოწმებული. მიწოდებული. რაც თამაშს ჰგავს, რიტუალივით მოძრაობს."],
    en: ["The game night's most wanted gear.", "Shuffled. Stacked. Delivered. What looks like a game moves like a ritual."],
  };
  const hgrid = $("[data-hgrid]");
  function renderHero() {
    const cells = [];
    TEX.forEach(([t, id, code], i) => {
      const p = byId[id];
      cells.push(`<a class="hc" href="catalog.html?p=${id}" style="grid-row:${Math.floor(i / 5) + 1};grid-column:${(i % 5) + 1}" aria-label="${MP.pname(p)}, ${money(p.price)}">
        <span class="hc__n" data-n="(${String(i + 1).padStart(2, "0")})">(${String(i + 1).padStart(2, "0")})</span>
        <figure class="hc__fig"><img class="hc__img" src="assets/img/tex/${t}.webp" alt="" loading="${i < 10 ? "eager" : "lazy"}"><i></i><i></i><i></i><i></i></figure>
        <span class="hc__cap"><span>${code}</span><b>${money(p.price)}</b></span></a>`);
    });
    const tx = HTXT[MP.lang];
    cells.push(`<div class="hc hc--txt hc--last" style="grid-row:1;grid-column:6"><p>${tx[0]}</p></div>`);
    cells.push(`<div class="hc hc--txt" style="grid-row:2;grid-column:6"></div>`);
    cells.push(`<div class="hc hc--txt" style="grid-row:3;grid-column:6"><p>${tx[1]}</p></div>`);
    hgrid.innerHTML = cells.join("");
    if (hasGsap && !reduced && !renderHero.done) {
      renderHero.done = true;
      gsap.from(".hc__fig", { opacity: 0, scale: .6, duration: .9, ease: "expo.out", stagger: { each: .04, from: "random" }, delay: .1 });
      gsap.from(".hero__word", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", delay: .2 });
    }
  }
  // number labels flicker like the reference
  if (!reduced) setInterval(() => {
    const ns = $$(".hc__n");
    if (!ns.length) return;
    const el = ns[(Math.random() * ns.length) | 0];
    MP.scramble(el, el.dataset.n);
  }, 420);
  // wordmark glitches between Latin and Georgian script
  const word = $("[data-word]");
  const WORDS = ["MyPoker.ge", "მაიპოკერი"];
  let wi = 0;
  function glitchTo(text) {
    if (reduced) { word.textContent = text; return; }
    const pool = "MYPOKERGEმაიპოკერი";
    let f = 0;
    const tick = () => {
      f++;
      const n = Math.floor(f / 2);
      word.textContent = text.split("").map((c, k) => (k < n ? c : pool[(Math.random() * pool.length) | 0])).join("").slice(0, Math.max(text.length, 1));
      if (n < text.length) requestAnimationFrame(tick); else word.textContent = text;
    };
    tick();
  }
  setInterval(() => { if (document.hidden) return; wi = 1 - wi; glitchTo(WORDS[wi]); if (wi === 1) setTimeout(() => { wi = 0; glitchTo(WORDS[0]); }, 1600); }, 6000);
  // touch screens have no hover: highlight one cell at a time
  if (matchMedia("(hover: none)").matches && !reduced) {
    let k = 0;
    setInterval(() => { const c = $$(".hc:not(.hc--txt)"); c.forEach((x) => x.classList.remove("is-on")); c[k++ % c.length]?.classList.add("is-on"); }, 2200);
  }
  if (hasGsap && !reduced) {
    gsap.to(".hero__word", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ── 1. LOG: draggable field ─────────────────────────────── */
  // positions in % of the field, measured from the reference frame; z = stacking order
  const CARDS = [
    { n: 3, cat: "accessories", layout: "sq", tone: "paper", x: 9, y: 9, w: 25.7, ar: "1 / 1", z: 1, img: "dealer-button", title: "ACCESSORIES", sub: { ka: "დილერი, შაფლერი, დამცავი", en: "Dealer, shuffler, guard" }, cap: "DEALER<br>BUTTON" },
    { n: 2, cat: "chips", layout: "port", tone: "lime", x: 12.2, y: 35, w: 23, ar: "0.8 / 1", z: 2, img: "stack", title: "CHIPS", sub: { ka: "11.5 გ, თიხა, კერამიკა", en: "11.5 g, clay, ceramic" }, body: [{ ka: "კაზინოს წონის ჩიპები ალუმინის ან ხის ყუთში.", en: "Casino-weight chips in aluminium or wood cases." }, { ka: "200-დან 500 ცალამდე ნაკრები. ორმხრივი ბეჭდვა.", en: "Sets from 200 to 500 pieces. Printed both sides." }], cap: "CLAY<br>CHIP STACK" },
    { n: 5, cat: "games", layout: "tall", tone: "lime", x: 68.6, y: 11, w: 23.1, ar: "0.667 / 1", z: 3, img: "nardi", title: "BOARD<br>GAMES", sub: null, cols: [{ ka: "ნარდი, ჭადრაკი, დომინო", en: "Backgammon, chess, domino" }, [{ ka: "ხელნაკეთი ნარდი კაკლის ხისგან.", en: "Handmade walnut backgammon." }, { ka: "კლასიკური თამაშები ოჯახისთვის.", en: "Classics for the whole family." }, { ka: "5 პროდუქტი.", en: "5 products." }]], cap: "WALNUT<br>BACKGAMMON" },
    { n: 4, cat: "tables", layout: "wide", tone: "steel", x: 45.5, y: 47, w: 38.4, ar: "1.88 / 1", z: 4, img: "table-oval", title: "TABLES", sub: null, cols: [{ ka: "8–10 მოთამაშე", en: "8–10 players" }, [{ ka: "ოვალური, რვაკუთხა და დასაკეცი ზედაპირი. მწვანე და წითელი მაუდი.", en: "Oval, octagon and folding tops. Green and red felt." }]], cap: "OVAL TABLE (8 PLAYERS)" },
    { n: 1, cat: "cards", layout: "land", tone: "olive", x: 34.9, y: 23, w: 30.8, ar: "1.5 / 1", z: 5, img: "bicycle", title: "PLAYING CARDS", sub: { ka: "Bicycle, Copag, Jumbo", en: "Bicycle, Copag, Jumbo" }, body: [{ ka: "ქაღალდის და 100% პლასტიკის დასტები.", en: "Paper and 100% plastic decks." }, { ka: "პლასტიკის კარტი წყალგამძლეა და არ იკეცება.", en: "Plastic cards are waterproof and never crease." }, { ka: "ორიგინალი, დალუქული.", en: "Original, sealed." }], cap: "SEALED<br>DECK" },
  ];
  const INDEX = [
    { cat: "cards", t: { ka: "კარტები", en: "Playing cards" } },
    { cat: "chips", t: { ka: "ჩიპები", en: "Chips" } },
    { cat: "accessories", t: { ka: "აქსესუარები", en: "Accessories" } },
    { cat: "tables", t: { ka: "მაგიდები", en: "Tables" } },
    { cat: "games", t: { ka: "სამაგიდო თამაშები", en: "Board games" } },
  ];
  const field = $("[data-field]");
  const stage = $("[data-field-stage]");
  const countCat = (c) => PRODUCTS_IN(c).length;
  function PRODUCTS_IN(c) {
    const kids = window.CATEGORIES.find((x) => x.id === c)?.children.map((x) => x.id) || [c];
    return window.PRODUCTS.filter((p) => kids.includes(p.cat));
  }
  function renderLog() {
    const nn = (n) => String(n).padStart(2, "0");
    field.innerHTML = CARDS.map((c) => {
      const fig = `FIG. ${nn(c.n)}`;
      const head = `<header class="fc__head"><b>${nn(c.n)}.</b><h3>${c.title}</h3>${c.layout === "land" ? `<span class="fc__fig">${fig}</span>` : ""}</header>`;
      const sub = c.sub ? `<p class="fc__sub">${MP.tr(c.sub)}</p>` : "";
      let cols = "";
      if (c.body) cols = `<div class="fc__cols"><div>${c.body.map((b) => `<p>${MP.tr(b)}</p>`).join("")}</div></div>`;
      if (c.cols) cols = `<div class="fc__cols"><p>${MP.tr(c.cols[0])}</p><div>${c.cols[1].map((b) => `<p>${MP.tr(b)}</p>`).join("")}</div></div>`;
      const foot = `<footer class="fc__foot">${c.layout === "land" ? "<span></span>" : `<span>${fig}</span>`}<span>${c.cap}</span></footer>`;
      return `<article class="fc fc--${c.tone} fc--${c.layout}" style="--x:${c.x}%;--y:${c.y}%;--w:${c.w}%;--ar:${c.ar};--z:${c.z}" data-depth="${1 + (c.z - 3) * .04}" data-href="catalog.html?cat=${c.cat}">
        ${head}${sub}${cols}<img class="fc__img" src="${img(c.img)}" alt="" draggable="false">${foot}</article>`;
    }).join("");
    $("[data-log-index]").innerHTML = INDEX.map((c, i) => `<li><a href="catalog.html?cat=${c.cat}">${nn(i + 1)}.<br>${MP.tr(c.t)}</a></li>`).join("");
    cardEls = $$(".fc", field);
    if (hasGsap && !reduced && !renderLog.done) {
      renderLog.done = true;
      gsap.from(cardEls, { y: () => 160 + Math.random() * 160, x: () => (Math.random() - .5) * 200, rotation: () => (Math.random() - .5) * 16, opacity: 0, duration: 1.4, ease: "expo.out", stagger: { each: .08, from: "random" }, delay: .1 });
    }
    applyPan();
  }
  let cardEls = [];
  const pan = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 };
  let dragging = false, moved = 0, sx = 0, sy = 0, lx = 0, ly = 0;
  const bounds = () => ({ x: Math.max(0, (field.offsetWidth - stage.clientWidth) / 2) + stage.clientWidth * .18, y: stage.clientHeight * .2 });
  function applyPan() {
    field.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0)`;
    cardEls.forEach((c) => { const d = +c.dataset.depth - 1; c.style.transform = `translate3d(${pan.x * d}px, ${pan.y * d}px, 0)`; });
  }
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = 0;
    sx = lx = e.clientX; sy = ly = e.clientY;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("is-drag");
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (e.pointerType === "touch" && Math.abs(e.clientY - sy) > Math.abs(e.clientX - sx) * 1.2 && moved < 30) return; // let vertical swipes scroll
    pan.tx += dx; pan.ty += dy; pan.vx = dx; pan.vy = dy;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-drag");
    if (moved < 6) {
      const card = document.elementFromPoint(e.clientX, e.clientY)?.closest(".fc");
      if (card) location.href = card.dataset.href;
    }
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  (function loop() {
    if (!dragging) { pan.tx += pan.vx; pan.ty += pan.vy; pan.vx *= .92; pan.vy *= .92; }
    const b = bounds();
    pan.tx = Math.max(-b.x, Math.min(b.x, pan.tx));
    pan.ty = Math.max(-b.y, Math.min(b.y, pan.ty));
    pan.x += (pan.tx - pan.x) * (reduced ? 1 : .14);
    pan.y += (pan.ty - pan.y) * (reduced ? 1 : .14);
    applyPan();
    requestAnimationFrame(loop);
  })();

  /* ── 2. CHAIN: phases with particle dissolve ─────────────────────────────── */
  const PHASES = [
    { id: "bicycle", img: "bicycle", t: "THE DECK", d: { ka: "ორიგინალი Bicycle. სტანდარტული ინდექსი, ბალანსი ხელში და საფარი, რომელიც ასობით დარიგებას უძლებს.", en: "Original Bicycle. Standard index, balanced in the hand, a finish that lasts hundreds of deals." } },
    { id: "chips-500", img: "stack", t: "THE CHIPS", d: { ka: "11.5 გრამიანი თიხის კომპოზიტი. ხმა და წონა, რომელსაც მაგიდასთან იცნობ. 500 ცალი ალუმინის კეისში.", en: "11.5 g clay composite. The sound and weight you know at the table. 500 pieces in an aluminium case." } },
    { id: "table-oval", img: "table-oval", t: "THE TABLE", d: { ka: "ოვალური მაგიდა 8 მოთამაშისთვის. მწვანე მაუდი, მუხის ჩარჩო და ტყავის რბილი სახელური.", en: "Oval table for 8. Green felt, oak frame and a padded leather rail." } },
    { id: "dealer-button", img: "dealer-button", t: "THE BUTTON", d: { ka: "ხელნაკეთი აკრილის დილერის ღილაკი. განსაზღვრავს რიგს და ბლაინდებს. პატარა დეტალი, დიდი მნიშვნელობა.", en: "Handmade acrylic dealer button. It sets the order and the blinds. A small detail that matters." } },
  ];
  const chainImg = $("[data-chain-img]");
  const fx = $("[data-fx]");
  const ctx = fx.getContext("2d");
  let phase = -1;
  $("[data-phases]").innerHTML = PHASES.map((_, i) => `<li>PHASE 0${i + 1}</li>`).join("");
  let particles = [], fxRunning = false;
  function burst(fromImg) {
    if (reduced) return;
    const r = fx.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    fx.width = r.width * dpr; fx.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const S = r.width / 1.8, ox = r.width * (.4 / 1.8), oy = r.height * (.4 / 1.8);
    const off = document.createElement("canvas");
    const size = Math.round(S);
    off.width = size; off.height = size;
    const octx = off.getContext("2d", { willReadFrequently: true });
    try {
      octx.drawImage(fromImg, 0, 0, size, size);
      const data = octx.getImageData(0, 0, size, size).data;
      const step = Math.max(3, Math.round(size / 110));
      for (let y = 0; y < size; y += step) for (let x = 0; x < size; x += step) {
        const k = (y * size + x) * 4, R = data[k], G = data[k + 1], B = data[k + 2];
        if (R + G + B > 690) continue;
        particles.push({ x: ox + x, y: oy + y, c: `rgb(${R},${G},${B})`, vx: (Math.random() - .3) * 2.2 + (x / size - .5) * 2, vy: (Math.random() - .8) * 2.4, life: 1, s: step * .7 });
      }
    } catch { return; }
    if (!fxRunning) { fxRunning = true; requestAnimationFrame(stepFx); }
  }
  function stepFx() {
    const r = fx.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += .05; p.vx *= .99; p.life -= .016 + Math.random() * .01;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    ctx.globalAlpha = 1;
    if (particles.length) requestAnimationFrame(stepFx); else fxRunning = false;
  }
  function setPhase(i) {
    if (i === phase) return;
    const first = phase === -1;
    phase = i;
    const P = PHASES[i], prod = byId[P.id];
    $$("[data-phases] li").forEach((li, k) => li.classList.toggle("is-on", k === i));
    MP.scramble($("[data-chain-t]"), P.t);
    $("[data-chain-d]").textContent = MP.tr(P.d);
    $("[data-chain-thumb]").src = img(P.img);
    $("[data-chain-price]").textContent = money(prod.price);
    $("[data-chain-add]").dataset.add = prod.id;
    if (first) { chainImg.src = img(P.img); return; }
    if (chainImg.complete) burst(chainImg);
    const next = new Image();
    next.src = img(P.img);
    if (hasGsap) {
      gsap.set(chainImg, { opacity: 0 });
      next.decode().catch(() => {}).then(() => {
        chainImg.src = next.src;
        gsap.fromTo(chainImg, { opacity: 0, scale: .7, rotation: -12, filter: "blur(10px)" }, { opacity: 1, scale: 1, rotation: 0, filter: "blur(0px)", duration: 1, ease: "expo.out", delay: .25 });
      });
    } else chainImg.src = next.src;
  }
  setPhase(0);
  if (hasGsap) {
    ScrollTrigger.create({
      trigger: ".chain", start: "top top", end: "bottom bottom",
      onUpdate: (st) => {
        const p = st.progress;
        setPhase(Math.min(3, Math.floor(p * 4)));
        if (!reduced) {
          const local = (p * 4) % 1;
          gsap.set(".chain__obj", { rotation: (local - .5) * 14, y: (local - .5) * -30 });
        }
      },
    });
  }

  /* ── 3. FX ─────────────────────────────── */
  if (hasGsap && !reduced) {
    gsap.fromTo(".fx__video", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".fx", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".tri--w span", { yPercent: 110, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: ".fx", start: "top 60%" } });
    gsap.from(".fx__cols article", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: ".fx__cols", start: "top 90%" } });
  }

  /* ── 4. ALL-IN parallax collage ─────────────────────────────── */
  const TILES = [
    { src: "life/night", l: 2, t: 8, w: 21, d: 1.4 },
    { src: "life/allin", l: 26, t: 14, w: 12, d: .7 },
    { src: "life/aces", l: 70, t: 4, w: 13, d: 1.1 },
    { src: "life/overhead", l: 78, t: 40, w: 22, d: 1.6 },
    { src: "life/still", l: 6, t: 60, w: 18, d: .9 },
    { src: "life/shuffle-bw", l: 60, t: 66, w: 11, d: 1.3 },
    { src: "setup/garage", l: 40, t: 74, w: 8, d: .6 },
    { src: "step/3", l: 88, t: 78, w: 10, d: 1.2 },
  ];
  const tilesBox = $("[data-tiles]");
  tilesBox.innerHTML = TILES.map((x) => `<div class="tile" style="--l:${x.l}%;--t:${x.t}%;--w:${x.w}vw" data-d="${x.d}"><img src="assets/img/${x.src}.webp" alt="" loading="lazy"></div>`).join("");
  if (hasGsap && !reduced) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".allin", start: "top top", end: "bottom bottom", scrub: .6 } });
    $$(".tile", tilesBox).forEach((t) => {
      const d = +t.dataset.d;
      tl.fromTo(t, { y: innerHeight * .55 * d }, { y: -innerHeight * .75 * d, ease: "none" }, 0);
    });
    tl.fromTo("[data-allin-video]", { scale: .85 }, { scale: 2.2, ease: "none" }, 0);
    tl.fromTo(".allin__word", { scale: .92 }, { scale: 1.06, ease: "none" }, 0);
  }

  /* ── 5. SETUP ARCHIVES ─────────────────────────────── */
  const SETUPS = [
    { img: "kitchen", name: "KITCHEN TABLE NIGHT", coord: "41.7095° N, 44.7660° E", loc: { ka: "ვაკე, თბილისი", en: "Vake, Tbilisi" }, players: "4–6", kit: ["chips-500", "copag", "dealer-button"] },
    { img: "lounge", name: "THE LOUNGE", coord: "41.6946° N, 44.7888° E", loc: { ka: "მთაწმინდა, თბილისი", en: "Mtatsminda, Tbilisi" }, players: "8", kit: ["table-oval", "ceramic-300", "jumbo-12", "card-guard"] },
    { img: "garage", name: "GARAGE TOURNAMENT", coord: "41.7258° N, 44.7531° E", loc: { ka: "საბურთალო, თბილისი", en: "Saburtalo, Tbilisi" }, players: "8–10", kit: ["table-octagon", "chips-200", "shuffler", "bicycle"] },
    { img: "rooftop", name: "ROOFTOP SUNSET", coord: "41.6894° N, 44.8013° E", loc: { ka: "სოლოლაკი, თბილისი", en: "Sololaki, Tbilisi" }, players: "4–6", kit: ["table-top", "chips-200", "nardi", "dice"] },
    { img: "office", name: "OFFICE LEAGUE", coord: "41.7066° N, 44.7836° E", loc: { ka: "ვერა, თბილისი", en: "Vera, Tbilisi" }, players: "10–20", kit: ["table-top", "ceramic-300", "shuffler", "dealer-button"] },
  ];
  const strip = $("[data-arch-strip]");
  strip.innerHTML = SETUPS.map((s) => `<img src="assets/img/setup/${s.img}.webp" alt="${s.name}" loading="lazy">`).join("");
  $("[data-arch-thumbs]").innerHTML = SETUPS.map((s, i) => `<li><button type="button" data-arch-i="${i}" aria-label="${s.name}"><img src="assets/img/setup/${s.img}.webp" alt="" loading="lazy"></button></li>`).join("");
  let archIdx = -1;
  function setArch(i, force) {
    if (i === archIdx && !force) return;
    archIdx = i;
    const s = SETUPS[i];
    const sum = s.kit.reduce((a, id) => a + byId[id].price, 0);
    $("[data-arch-count]").textContent = `(0${i + 1}/0${SETUPS.length})`;
    MP.scramble($("[data-arch-coord]"), s.coord);
    MP.scramble($("[data-arch-name]"), s.name);
    $("[data-arch-dl]").innerHTML = `<dt>${tt("loc")}</dt><dd>${MP.tr(s.loc)}</dd><dt>${tt("players")}</dt><dd>${s.players}</dd><dt>${tt("total")}</dt><dd>${money(sum)}</dd>`;
    $("[data-arch-kit]").innerHTML = s.kit.map((id) => `<li><button type="button" data-add="${id}"><span>${MP.pname(byId[id])}</span><span>${money(byId[id].price)}</span></button></li>`).join("");
    $("[data-arch-add]").textContent = tt("addKit", money(sum));
    $$("[data-arch-thumbs] button").forEach((b, k) => b.classList.toggle("is-on", k === i));
  }
  $("[data-arch-add]").addEventListener("click", () => {
    SETUPS[archIdx].kit.forEach((id) => MP.add(id, 1, true));
    MP.toast(tt("kitAdded"));
  });
  let archST;
  if (hasGsap) {
    archST = ScrollTrigger.create({
      trigger: ".arch", start: "top top", end: "bottom bottom",
      onUpdate: (st) => {
        const p = st.progress, n = SETUPS.length;
        const h = strip.firstElementChild?.offsetHeight || innerHeight;
        gsap.set(strip, { y: -p * (n - 1) * h });
        setArch(Math.min(n - 1, Math.round(p * (n - 1))));
      },
    });
  }
  $("[data-arch-thumbs]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-arch-i]");
    if (!b || !archST) return;
    const y = archST.start + (archST.end - archST.start) * (+b.dataset.archI / (SETUPS.length - 1));
    MP.lenis ? MP.lenis.scrollTo(y) : scrollTo({ top: y });
  });
  setArch(0);

  /* ── 6. KIT labels ─────────────────────────────── */
  const KIT = [
    { id: "ceramic-300", k: "CERAMIC CHIPS", x: 12.5, y: 41 },
    { id: "chips-500", k: "CHIP CASE", x: 39, y: 56 },
    { id: "shuffler", k: "SHUFFLER", x: 66, y: 30 },
    { id: "copag", k: "PLASTIC CARDS", x: 66, y: 81 },
    { id: "dealer-button", k: "DEALER BUTTON", x: 80.5, y: 72 },
    { id: "card-guard", k: "CARD GUARD", x: 86.5, y: 50 },
    { id: "dice", k: "DICE", x: 92, y: 83 },
  ];
  const canvasKit = $("[data-kit-canvas]");
  const kitList = $("[data-kit-list]");
  function renderKit() {
    $$(".tag", canvasKit).forEach((t) => t.remove());
    KIT.forEach((k, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "tag"; b.dataset.add = k.id;
      b.style.setProperty("--lx", `${k.x}%`); b.style.setProperty("--ly", `${k.y}%`);
      b.setAttribute("aria-label", `${MP.pname(byId[k.id])}, ${money(byId[k.id].price)}`);
      b.innerHTML = `<span>0${i + 1}</span><span>${k.k}</span><span class="tag__pop" aria-hidden="true"><img src="${img(k.id)}" alt=""><em>${money(byId[k.id].price)}</em></span>`;
      b.addEventListener("mouseenter", () => kitOn(i));
      b.addEventListener("focus", () => kitOn(i));
      canvasKit.appendChild(b);
    });
    kitList.innerHTML = KIT.map((k, i) => `<li><button type="button" data-add="${k.id}" data-kit-i="${i}"><span>0${i + 1}. ${k.k}</span><span>${money(byId[k.id].price)}</span></button></li>`).join("");
  }
  function kitOn(i) {
    $$(".tag", canvasKit).forEach((t, k) => t.classList.toggle("is-on", k === i));
    $$("button", kitList).forEach((t, k) => t.classList.toggle("is-on", k === i));
  }
  kitList.addEventListener("mouseover", (e) => { const b = e.target.closest("[data-kit-i]"); if (b) kitOn(+b.dataset.kitI); });
  canvasKit.addEventListener("mouseleave", () => kitOn(-1));
  if (hasGsap && !reduced) {
    gsap.fromTo(".kit__canvas > img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".kit", start: "top bottom", end: "center center", scrub: true } });
  }

  /* ── 7. PROCEDURES ─────────────────────────────── */
  const STEPS = [
    { img: 1, name: "SHUFFLE", d: { ka: "აურიე დასტა. პლასტიკის კარტი არ იკეცება და ხელში სრიალებს.", en: "Shuffle the deck. Plastic cards never crease and glide in the hand." }, id: "copag" },
    { img: 2, name: "DEAL", d: { ka: "დაარიგე ორი კარტი. დილერის ღილაკი აჩვენებს, ვინ იწყებს.", en: "Deal two cards. The dealer button shows who goes first." }, id: "dealer-button" },
    { img: 3, name: "BET", d: { ka: "დადე ფსონი. კერამიკული ჩიპები სუფთად ეწყობა და არ იშლება.", en: "Place your bet. Ceramic chips stack cleanly and stay put." }, id: "ceramic-300" },
    { img: 4, name: "SHOWDOWN", d: { ka: "გახსენი კარტები. ერთი ხელი შეიძლება მთელ ღამეს ღირდეს.", en: "Show your cards. One hand can be worth the whole night." }, id: "jumbo-12" },
  ];
  const vis = $("[data-proc-visual]");
  vis.innerHTML = STEPS.map((s) => `<img class="dim" src="assets/img/step/${s.img}.webp" alt="" loading="lazy">`).join("") + STEPS.map((s) => `<img class="lit" src="assets/img/step/${s.img}.webp" alt="" loading="lazy">`).join("");
  let stepIdx = -1;
  function setStep(i) {
    if (i === stepIdx) return;
    stepIdx = i;
    const s = STEPS[i];
    $$(".dim", vis).forEach((im, k) => im.classList.toggle("is-on", k === i));
    $$(".lit", vis).forEach((im, k) => im.classList.toggle("is-on", k === i));
    $("[data-proc-n]").textContent = `STEP 0${i + 1}`;
    MP.scramble($("[data-proc-name]"), s.name);
    $("[data-proc-d]").textContent = MP.tr(s.d);
    const b = $("[data-proc-buy]");
    b.dataset.add = s.id;
    b.textContent = `${MP.pname(byId[s.id])}, ${money(byId[s.id].price)}`;
  }
  setStep(0);
  if (hasGsap) ScrollTrigger.create({ trigger: ".proc", start: "top top", end: "bottom bottom", onUpdate: (st) => setStep(Math.min(3, Math.floor(st.progress * 4))) });
  const flash = $("[data-flash]");
  let pointerSeen = false, procVisible = false;
  flash.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointerSeen = true;
    const r = vis.getBoundingClientRect();
    flash.style.setProperty("--mx", `${e.clientX - r.left}px`);
    flash.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
  new IntersectionObserver(([e]) => { procVisible = e.isIntersecting; }).observe(flash);
  (function sweep(t) {
    if (procVisible && !pointerSeen) {
      const r = vis.getBoundingClientRect();
      flash.style.setProperty("--mx", `${r.width * (.5 + .3 * Math.sin(t / 1300))}px`);
      flash.style.setProperty("--my", `${r.height * (.5 + .25 * Math.sin(t / 900))}px`);
    }
    requestAnimationFrame(sweep);
  })(0);

  /* ── 8. outro ─────────────────────────────── */
  if (hasGsap && !reduced) {
    gsap.from(".outro__word", { xPercent: -12, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".outro", start: "top 75%" } });
  }

  /* ── videos: play only in view ─────────────────────────────── */
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting && !reduced) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { rootMargin: "150px" });
  $$("[data-video]").forEach((v) => vio.observe(v));

  /* ── language ─────────────────────────────── */
  MP.onLang(() => {
    applyTT();
    renderHero();
    renderLog();
    renderKit();
    const p = phase; phase = -1; setPhase(Math.max(0, p));
    setArch(Math.max(0, archIdx), true);
    const s = stepIdx; stepIdx = -1; setStep(Math.max(0, s));
  });
  addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
})();
