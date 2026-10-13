/* MyPoker — interactions */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => matchMedia("(max-width: 760px)").matches;

  /* ── Playing cards ──────────────────────────────── */
  const SUITS = { "♠": "spade", "♥": "heart", "♦": "diamond", "♣": "club" };
  const isRed = (s) => s === "♥" || s === "♦";
  const parse = (code) => ({ rank: code.slice(0, -1), suit: code.slice(-1) });
  const suitSvg = (s) => `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#s-${SUITS[s]}"/></svg>`;
  const cardInner = (code) => {
    const { rank, suit } = parse(code);
    return `<span class="pc__r">${rank}${suitSvg(suit)}</span><span class="pc__c">${suitSvg(suit)}</span>`;
  };
  const cardEl = (code, cls = "pc") => {
    const el = document.createElement("div");
    el.className = cls;
    if (isRed(parse(code).suit)) el.dataset.red = "";
    el.innerHTML = cardInner(code);
    return el;
  };

  // fans inside hero cards
  $$("[data-fan]").forEach((fan) => {
    const codes = fan.dataset.fan.split(" ");
    const n = codes.length;
    codes.forEach((c, i) => {
      const el = cardEl(c);
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      el.style.left = `${27 + t * 40}%`;
      el.style.top = `${10 + Math.abs(t) * 10}%`;
      el.style.transform = `rotate(${t * (n > 2 ? 36 : 22)}deg)`;
      fan.appendChild(el);
    });
  });

  // single tiles
  $$("[data-card]").forEach((t) => t.appendChild(cardEl(t.dataset.card)));

  /* ── Chip stacks (SVG) ──────────────────────────── */
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const f = (x) => clamp(Math.round(x + amt * 255), 0, 255);
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  function chipStack(g, colors, rx = 44, ry = 14, h = 9) {
    g.appendChild(svgEl("ellipse", { cx: 0, cy: 6, rx: rx + 8, ry: ry + 4, fill: "#0b0b0c", opacity: ".22", filter: "url(#soft)" }));
    colors.forEach((c, i) => {
      const y = -i * h;
      const light = c.toLowerCase() === "#0b0b0c" ? "#3a3c40" : shade(c, .12);
      g.appendChild(svgEl("path", {
        d: `M${-rx} ${y} v${-h + 1} a${rx} ${ry} 0 0 0 ${rx * 2} 0 v${h - 1} a${rx} ${ry} 0 0 1 ${-rx * 2} 0Z`,
        fill: shade(c, -.12),
      }));
      // edge stripes
      for (let k = -2; k <= 2; k++) {
        g.appendChild(svgEl("rect", { x: k * rx * 0.42 - 3, y: y - h + 1 + ry * (1 - Math.cos(k * 0.42)) * .9, width: 6, height: h - 1, fill: "#f6f5f0", opacity: ".85" }));
      }
      g.appendChild(svgEl("ellipse", { cx: 0, cy: y - h + 1, rx, ry, fill: light }));
    });
    const top = -(colors.length - 1) * h - h + 1;
    g.appendChild(svgEl("ellipse", { cx: 0, cy: top, rx: rx * .62, ry: ry * .62, fill: "none", stroke: "#f6f5f0", "stroke-width": 2, "stroke-dasharray": "4 5", opacity: ".8" }));
  }

  // hero card 04: four stacks
  const palette = ["#ff3d2e", "#0b0b0c", "#c6ff3d", "#f6f5f0"];
  $$(".chipstack").forEach((g, i) => {
    const n = [7, 10, 5, 8][i];
    const cols = Array.from({ length: n }, (_, k) => palette[(i + (k % 3 === 2 ? 1 : 0)) % 4]);
    const [, x, y] = g.getAttribute("transform").match(/translate\((\S+) (\S+)\)/);
    g.setAttribute("transform", `translate(${+x + 40} ${+y + 110})`);
    chipStack(g, cols, 38, 12, 8);
  });
  // table art
  $$(".art-chips").forEach((g) => chipStack(g, g.dataset.colors.split(","), 50, 16, 9));
  // floating chip tile
  $$(".tile--chips").forEach((t) => {
    const svg = svgEl("svg", { viewBox: "0 0 200 200" });
    const defs = svgEl("defs", {});
    defs.innerHTML = '<filter id="soft2"><feGaussianBlur stdDeviation="6"/></filter>';
    svg.appendChild(defs);
    [[70, 170, ["#c6ff3d", "#c6ff3d", "#c6ff3d", "#c6ff3d", "#c6ff3d", "#c6ff3d", "#c6ff3d", "#c6ff3d"]], [140, 185, ["#ff3d2e", "#ff3d2e", "#ff3d2e", "#ff3d2e"]]].forEach(([x, y, c]) => {
      const g = svgEl("g", { transform: `translate(${x} ${y})` });
      chipStack(g, c, 44, 14, 10);
      svg.appendChild(g);
    });
    svg.querySelectorAll('[filter="url(#soft)"]').forEach((e) => e.setAttribute("filter", "url(#soft2)"));
    t.appendChild(svg);
  });

  /* ── Draggable hero cards ───────────────────────── */
  let zTop = 10;
  $$("[data-drag]").forEach((card) => {
    let sx, sy, ox = 0, oy = 0, dragging = false;
    card.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.button !== 0) return;
      dragging = true;
      card.setPointerCapture(e.pointerId);
      card.classList.add("is-drag");
      card.style.zIndex = ++zTop;
      sx = e.clientX - ox;
      sy = e.clientY - oy;
    });
    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      ox = e.clientX - sx;
      oy = e.clientY - sy;
      card.style.setProperty("--dx", `${ox}px`);
      card.style.setProperty("--dy", `${oy}px`);
    });
    const end = () => { dragging = false; card.classList.remove("is-drag"); };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  });

  // gentle intro: cards drop in
  if (!reduced) {
    $$("[data-drag]").forEach((c, i) => {
      c.animate(
        [{ opacity: 0, translate: "0 60px", rotate: `${(i % 2 ? 1 : -1) * 8}deg` }, { opacity: 1, translate: "0 0", rotate: "0deg" }],
        { duration: 1100, delay: 150 + i * 110, easing: "cubic-bezier(.2,.7,.1,1)", fill: "backwards" }
      );
    });
  }

  /* ── Scramble / typewriter text ─────────────────── */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♠♥♦♣#/";
  function scramble(el, text) {
    if (reduced) { el.textContent = text; return; }
    const id = (el._sid = (el._sid || 0) + 1);
    let i = 0;
    const tick = () => {
      if (id !== el._sid) return;
      i += 0.5;
      const done = Math.floor(i);
      let out = text.slice(0, done);
      if (done < text.length) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (done < text.length) requestAnimationFrame(tick);
    };
    tick();
  }

  /* ── Hand anatomy (sticky, 4 phases) ────────────── */
  const hand = $("#hand");
  const HAND = {
    hole: ["A♥", "K♥"],
    board: ["Q♥", "J♥", "4♣", "9♠", "10♥"],
    titles: ["PRE-FLOP", "FLOP", "TURN", "RIVER"],
    texts: [
      "ორი დახურული კარტი. პირველი ფსონი და პირველი გადაწყვეტილება: Fold, Call თუ Raise.",
      "მაგიდაზე სამი საერთო კარტი იხსნება. ახლა ჩანს, ვინ რისკავს და ვინ ბლეფობს.",
      "მეოთხე კარტი. ფსონები იზრდება, შეცდომის ფასიც.",
      "ბოლო კარტი, ვაჭრობის ბოლო რაუნდი და Showdown. ხუთი გულის კარტი ზედიზედ.",
    ],
    pot: [120, 480, 960, 2400],
    result: ["", "Flush draw · Straight draw", "Broadway draw", "Royal Flush ♥"],
  };
  const slotsHole = $$(".slot--hole", hand);
  const slotsBoard = $$(".board__row--community .slot", hand);
  const fill = (slot, code) => {
    const { suit } = parse(code);
    slot.innerHTML = `<div class="flip"><div class="face"${isRed(suit) ? " data-red" : ""}>${cardInner(code)}</div><div class="back"></div></div>`;
  };
  slotsHole.forEach((s, i) => fill(s, HAND.hole[i]));
  slotsBoard.forEach((s, i) => fill(s, HAND.board[i]));

  const asciiCard = (codes) => {
    const top = codes.map(() => "┌───┐").join("");
    const mid = codes.map((c) => `│${c.padEnd(3, " ")}│`).join("");
    const bot = codes.map(() => "└───┘").join("");
    return `${top}\n${mid}\n${bot}`;
  };
  const potEl = $("[data-pot]", hand);
  let potVal = 120;
  function animatePot(to) {
    const from = potVal;
    potVal = to;
    if (reduced) { potEl.textContent = `₾ ${to.toLocaleString("en-US")}`; return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = clamp((t - t0) / 700, 0, 1);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      potEl.textContent = `₾ ${v.toLocaleString("en-US")}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  let handPhase = -1;
  function setHandPhase(p) {
    if (p === handPhase) return;
    handPhase = p;
    $$(".phases li", hand).forEach((li, i) => li.classList.toggle("is-on", i === p));
    $$(".slot", hand).forEach((s) => {
      const on = +s.dataset.phase <= p;
      s.classList.toggle("is-dealt", on);
    });
    const winSet = new Set(["A♥", "K♥", "Q♥", "J♥", "10♥"]);
    [...slotsHole.map((s, i) => [s, HAND.hole[i]]), ...slotsBoard.map((s, i) => [s, HAND.board[i]])].forEach(([s, c]) => {
      s.classList.toggle("is-win", p === 3 && winSet.has(c));
    });
    scramble($("[data-type]", hand), HAND.titles[p]);
    $("[data-phase-text]", hand).textContent = HAND.texts[p];
    const visible = [...HAND.hole, ...HAND.board.slice(0, [0, 3, 4, 5][p])];
    $("[data-ascii]", hand).textContent = asciiCard(visible.slice(0, 4)) + (visible.length > 4 ? "\n" + asciiCard(visible.slice(4)) : "");
    const r = $("[data-result]", hand);
    r.textContent = HAND.result[p] || " ";
    r.classList.toggle("is-on", !!HAND.result[p]);
    animatePot(HAND.pot[p]);
  }

  /* ── Tournaments ────────────────────────────────── */
  const TOURS = [
    { date: "24.10", name: "Friday Turbo", type: "NLH · Turbo", buy: "₾ 150", gtd: "₾ 10,000", start: "20:00", stack: "20,000", tone: "lime", suit: "♠" },
    { date: "02.11", name: "Omaha Night", type: "PLO · 6-Max", buy: "₾ 300", gtd: "₾ 20,000", start: "19:00", stack: "30,000", tone: "ink", suit: "♦" },
    { date: "15.11", name: "Deepstack Sunday", type: "NLH · Deepstack", buy: "₾ 500", gtd: "₾ 30,000", start: "15:00", stack: "50,000", tone: "steel", suit: "♣" },
    { date: "29.11", name: "High Roller", type: "NLH · High Roller", buy: "₾ 2,000", gtd: "₾ 100,000", start: "18:00", stack: "100,000", tone: "red", suit: "♥" },
    { date: "12.12", name: "MyPoker Open", type: "Main Event · 3 დღე", buy: "₾ 1,000", gtd: "₾ 250,000", start: "14:00", stack: "60,000", tone: "lime", suit: "♠" },
  ];
  const tourList = $(".tour__list");
  const poster = $("[data-poster]");
  let tourIdx = 0;
  let tourAuto = true;
  TOURS.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<button role="tab" aria-selected="false" id="tour-${i}"><span>${t.date}</span><b>${t.name}</b><span>${t.buy}</span></button>`;
    li.firstChild.addEventListener("click", () => { tourAuto = false; setTour(i); });
    tourList.appendChild(li);
  });
  function setTour(i) {
    tourIdx = i;
    const t = TOURS[i];
    $$("button", tourList).forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    poster.dataset.tone = t.tone;
    poster.classList.remove("is-swap");
    void poster.offsetWidth;
    poster.classList.add("is-swap");
    poster.innerHTML = `
      <div class="poster__bg">${suitSvg(t.suit)}</div>
      <div class="poster__top"><span>MYPOKER — LIVE</span><span>(${String(i + 1).padStart(2, "0")})</span></div>
      <p class="poster__name">${t.name.replace(" ", "<br>")}</p>
      <div class="poster__gtd"><b>${t.gtd}</b><span>GUARANTEED<br>${t.date}.2026</span></div>`;
    $("[data-count]").textContent = `(${String(i + 1).padStart(2, "0")}/${String(TOURS.length).padStart(2, "0")})`;
    scramble($("[data-tour-type]"), t.type.toUpperCase());
    $("[data-tour-dl]").innerHTML = [
      ["თარიღი", `${t.date}.2026`], ["დაწყება", t.start], ["Buy-in", t.buy], ["სტეკი", t.stack], ["GTD", t.gtd],
    ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  }
  setTour(0);

  /* ── Table inventory hotspots ───────────────────── */
  const ITEMS = [
    { k: "Chips", ka: "ჩიპები", x: 16.7, y: 41, d: "კერამიკული 10-გრამიანი ჩიპები. ყოველ ფერს თავისი ნომინალი აქვს." },
    { k: "Tournament chip", ka: "ტურნირის ჩიპი", x: 36.7, y: 56.5, d: "ლაიმისფერი ჩიპი, მხოლოდ ტურნირებისთვის. ფულად არ იცვლება." },
    { k: "Deck", ka: "დასტა", x: 63.3, y: 28.5, d: "100% პლასტიკური კარტები. ყოველ 4 საათში ახალი დასტა." },
    { k: "Card protector", ka: "მარკერი", x: 80, y: 36, d: "დებს მოთამაშე კარტებზე, რომ შემთხვევით არ გაიფოლდოს." },
    { k: "Hole cards", ka: "შენი კარტები", x: 47, y: 64, d: "ორი დახურული კარტი. მხოლოდ შენ ხედავ." },
    { k: "Dealer button", ka: "დილერის ღილაკი", x: 83.3, y: 62, d: "განსაზღვრავს დარიგების რიგს და ბლაინდებს. ყოველ ხელზე გადაინაცვლებს." },
    { k: "Cut card", ka: "ჭრის ბარათი", x: 27.5, y: 83, d: "ფარავს დასტის ქვედა კარტს შაფლის შემდეგ." },
  ];
  const labels = $(".table__labels");
  const tList = $(".table__list");
  const tags = [];
  const listBtns = [];
  const setItem = (i) => {
    tags.forEach((t, k) => t.classList.toggle("is-on", k === i));
    listBtns.forEach((b, k) => b.classList.toggle("is-on", k === i));
  };
  ITEMS.forEach((it, i) => {
    const n = String(i + 1).padStart(2, "0");
    const tag = document.createElement("button");
    tag.className = "tag";
    tag.type = "button";
    tag.style.setProperty("--lx", `${it.x}%`);
    tag.style.setProperty("--ly", `${it.y}%`);
    tag.setAttribute("aria-label", `${it.ka}: ${it.d}`);
    tag.innerHTML = `<span>${n}</span><span>${it.k}</span><span class="tag__pop" aria-hidden="true"><b>${it.ka}</b>${it.d}</span>`;
    tag.addEventListener("mouseenter", () => setItem(i));
    tag.addEventListener("focus", () => setItem(i));
    tag.addEventListener("click", () => setItem(tag.classList.contains("is-on") && isMobile() ? -1 : i));
    labels.appendChild(tag);
    tags.push(tag);

    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${n}. ${it.k}`;
    b.addEventListener("mouseenter", () => setItem(i));
    b.addEventListener("focus", () => setItem(i));
    b.addEventListener("click", () => setItem(i));
    li.appendChild(b);
    tList.appendChild(li);
    listBtns.push(b);
  });
  $(".table__stage").addEventListener("mouseleave", () => setItem(-1));

  // keep labels aligned with the SVG (meet-scaled, centred)
  const stage = $(".table__stage");
  const art = $(".table__art");
  function alignLabels() {
    const r = art.getBoundingClientRect();
    const scale = Math.min(r.width / 1200, r.height / 660);
    const w = 1200 * scale, h = 660 * scale;
    const s = stage.getBoundingClientRect();
    Object.assign(labels.style, { left: `${r.left - s.left + (r.width - w) / 2}px`, top: `${r.top - s.top + (r.height - h) / 2}px`, width: `${w}px`, height: `${h}px`, right: "auto", bottom: "auto" });
  }
  art.setAttribute("preserveAspectRatio", "xMidYMid meet");

  /* ── Join: flashlight + steps ───────────────────── */
  const join = $("#join");
  const flash = $("[data-flash]");
  const visual = $(".join__visual");
  const ROYAL = ["10♠", "J♠", "Q♠", "K♠", "A♠"];
  const fans = $$(".fan", join);
  fans.forEach((f) => ROYAL.forEach((c) => f.appendChild(cardEl(c))));
  const STEPS = [
    { t: "რეგისტრაცია", d: "დაგვირეკე ან შეავსე ფორმა. შეგირჩევთ სასურველ თამაშს და ლიმიტს." },
    { t: "ვერიფიკაცია", d: "მოიტანე პირადობის დამადასტურებელი დოკუმენტი. კლუბი მხოლოდ 18+ სტუმრებისთვისაა." },
    { t: "დაჯექი მაგიდასთან", d: "აიღე ჩიპები, გაიცანი დილერი და ითამაშე. დანარჩენზე ჩვენ ვზრუნავთ." },
  ];
  let joinStep = -1;
  function setJoinStep(s) {
    if (s === joinStep) return;
    joinStep = s;
    const spread = [6, 16, 26][s];
    const lift = [0, 4, 10][s];
    fans.forEach((f) => $$(".pc", f).forEach((c, i) => {
      const t = i - 2;
      c.style.transform = `translateX(${t * spread * 1.6}%) translateY(${Math.abs(t) * lift * 0.6 - (s === 2 && i === 4 ? 10 : 0)}%) rotate(${t * spread * 0.55}deg)`;
      c.style.boxShadow = s === 2 ? "0 0 0 2px #c6ff3d, 0 30px 60px -20px rgba(198,255,61,.5)" : "";
    }));
    const box = $(".join__step", join);
    box.classList.remove("is-swap");
    void box.offsetWidth;
    box.classList.add("is-swap");
    $("[data-step-n]", join).textContent = `STEP ${String(s + 1).padStart(2, "0")}`;
    $("[data-step-t]", join).textContent = STEPS[s].t;
    $("[data-step-d]", join).textContent = STEPS[s].d;
  }
  let pointerSeen = false;
  flash.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointerSeen = true;
    const v = visual.getBoundingClientRect();
    const f = flash.getBoundingClientRect();
    flash.style.setProperty("--mx", `${e.clientX - v.left}px`);
    flash.style.setProperty("--my", `${e.clientY - v.top}px`);
    flash.style.setProperty("--fx", `${e.clientX - f.left}px`);
    flash.style.setProperty("--fy", `${e.clientY - f.top}px`);
  });
  // automatic sweep when there is no mouse
  let joinVisible = false;
  function sweep(t) {
    if (joinVisible && !pointerSeen) {
      const v = visual.getBoundingClientRect();
      const f = flash.getBoundingClientRect();
      const x = v.width * (0.5 + 0.38 * Math.sin(t / 1300));
      const y = v.height * (0.45 + 0.25 * Math.sin(t / 900));
      flash.style.setProperty("--mx", `${x}px`);
      flash.style.setProperty("--my", `${y}px`);
      flash.style.setProperty("--fx", `${x + v.left - f.left}px`);
      flash.style.setProperty("--fy", `${y + v.top - f.top}px`);
    }
    requestAnimationFrame(sweep);
  }
  if (!reduced) requestAnimationFrame(sweep);
  else flash.style.setProperty("--mx", "50%");

  /* ── All-in shuffle ─────────────────────────────── */
  const shuffle = $(".shuffle");
  const SHUF = ["A♠", "K♥", "Q♦", "J♣", "10♠", "A♦"];
  const shufCards = SHUF.map((c, i) => {
    const el = cardEl(c);
    el.style.zIndex = SHUF.length - i;
    shuffle.appendChild(el);
    return el;
  });
  let shufTop = 0;
  if (!reduced) {
    setInterval(() => {
      if (!allinVisible) return;
      const el = shufCards[shufTop];
      el.style.transform = "translate(120%, -10%) rotate(18deg)";
      el.style.opacity = "0";
      setTimeout(() => {
        shufCards.forEach((c) => { c.style.zIndex = +c.style.zIndex + 1; });
        el.style.zIndex = 1;
        el.style.transition = "none";
        el.style.transform = "translate(-6%, 4%) rotate(-4deg)";
        void el.offsetWidth;
        el.style.transition = "";
        el.style.opacity = "1";
        el.style.transform = "";
      }, 700);
      shufTop = (shufTop + 1) % shufCards.length;
    }, 1600);
  }

  /* ── Rail + nav theme ───────────────────────────── */
  const sections = $$("[data-rail]");
  const rail = $(".rail");
  sections.forEach(() => rail.appendChild(document.createElement("li")));
  const railItems = $$("li", rail);
  const nav = $(".nav");
  const LIGHT = new Set(["hand", "why", "book"]);

  /* ── Scroll loop ────────────────────────────────── */
  const tiles = $$(".tile");
  const allin = $("#allin");
  const tour = $("#tournaments");
  let allinVisible = false;
  let tourVisible = false;
  const stickyProgress = (el) => {
    const r = el.getBoundingClientRect();
    const range = r.height - innerHeight;
    return clamp(-r.top / range, 0, 0.9999);
  };

  function onScroll() {
    const vh = innerHeight;
    // rail
    let current = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= vh * 0.5) current = i; });
    railItems.forEach((li, i) => { li.classList.toggle("is-on", i === current); li.classList.toggle("is-past", i < current); });

    // nav theme: which section is under the nav bar (sample at the logo's x)
    const probe = document.elementsFromPoint(30, 28).find((el) => el.closest && el.closest("section, footer") && !el.closest(".nav"));
    const sec = probe && probe.closest("section, footer");
    nav.classList.toggle("is-light", !!sec && (LIGHT.has(sec.id) || sec.id === "table"));
    nav.classList.toggle("is-lime", !!sec && sec.id === "why");
    nav.classList.toggle("is-solid", scrollY > 40 && !!sec && !["why", "hand"].includes(sec.id));

    // hand phases
    setHandPhase(Math.floor(stickyProgress(hand) * 4));
    setJoinStep(Math.floor(stickyProgress(join) * 3));

    // parallax
    const ar = allin.getBoundingClientRect();
    allinVisible = ar.bottom > 0 && ar.top < vh;
    if (allinVisible && !reduced) {
      const p = (vh - ar.top) / (vh + ar.height) - 0.5; // -0.5..0.5
      tiles.forEach((t) => t.style.setProperty("--py", `${p * parseFloat(t.style.getPropertyValue("--s")) * 900}px`));
    }
    const jr = join.getBoundingClientRect();
    joinVisible = jr.bottom > 0 && jr.top < vh;
    const tr = tour.getBoundingClientRect();
    tourVisible = tr.top < vh * 0.6 && tr.bottom > vh * 0.4;
  }
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  addEventListener("resize", () => { alignLabels(); onScroll(); });
  alignLabels();
  onScroll();

  // auto-advance tournaments while in view
  setInterval(() => {
    if (tourAuto && tourVisible && !reduced) setTour((tourIdx + 1) % TOURS.length);
  }, 5000);

  /* ── Reveal on view ─────────────────────────────── */
  const revealEls = $$(".why__cols article, .tri:not(.tri--grey) span, .book__title, .book__form, .foot > *, .tour__title, .allin__note");
  revealEls.forEach((el, i) => { el.dataset.reveal = ""; el.style.transitionDelay = `${(i % 3) * 90}ms`; });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));

  /* ── Booking form (front-end only) ──────────────── */
  const form = $(".book__form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const okName = name.value.trim().length > 1;
    const okPhone = phone.value.replace(/\D/g, "").length >= 9;
    name.setAttribute("aria-invalid", String(!okName));
    phone.setAttribute("aria-invalid", String(!okPhone));
    const msg = $(".book__msg", form);
    if (!okName || !okPhone) {
      msg.textContent = "გთხოვ, მიუთითე სახელი და სწორი ტელეფონის ნომერი.";
      (okName ? phone : name).focus();
      return;
    }
    msg.textContent = `გმადლობთ, ${name.value.trim()}! მალე დაგიკავშირდებით ადგილის დასადასტურებლად.`;
    form.reset();
  });

  if (isMobile()) $(".hint--top").textContent = "(გადაფურცლე →)";

  $("[data-year]").textContent = new Date().getFullYear();
})();
