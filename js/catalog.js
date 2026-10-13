/* mypoker.ge — catalog: filters above, Flip-animated grid, quick view */
(() => {
  "use strict";
  const MP = window.MP;
  const { $, $$, reduced, byId, img, money } = MP;
  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const hasFlip = !!(window.gsap && window.Flip);
  if (hasFlip) gsap.registerPlugin(Flip);

  MP.extendT({
    ka: { home: "მთავარი", search: "ძებნა", sortRec: "რეკომენდებული", sortAsc: "ფასი ↑", sortDesc: "ფასი ↓", emptyTitle: "ვერაფერი მოიძებნა.", emptyReset: "ფილტრების გასუფთავება", call: "დარეკვა", qvNote: "მიწოდება თბილისში მეორე დღეს. გადახდა მიღებისას.", ship: "უფასო მიწოდება თბილისში 80 ₾-დან", all: "ყველა", p0: "ნებისმიერი ფასი", p1: "50 ₾-მდე", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "ახალი", badgeBest: "ბესტსელერი", badgePrem: "პრემიუმი" },
    en: { home: "Home", search: "Search", sortRec: "Recommended", sortAsc: "Price ↑", sortDesc: "Price ↓", emptyTitle: "Nothing matches.", emptyReset: "Clear filters", call: "Call", qvNote: "Next-day delivery in Tbilisi. Pay on delivery.", ship: "Free delivery in Tbilisi from 80 ₾", all: "All", p0: "Any price", p1: "Under 50 ₾", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "New", badgeBest: "Bestseller", badgePrem: "Premium" },
  });
  const BADGE = { "ახალი": "badgeNew", "ბესტსელერი": "badgeBest", "პრემიუმი": "badgePrem" };

  const PRICE = [[0, Infinity], [0, 50], [50, 200], [200, 500], [500, Infinity]];
  const params = new URLSearchParams(location.search);
  const state = { cat: params.get("cat") || "all", price: 0, sort: "rec", q: "" };
  const kids = (id) => CATS.find((c) => c.id === id)?.children.map((c) => c.id) || [id];
  const inCat = (p, c) => c === "all" || kids(c).includes(p.cat);
  const cname = (c) => (MP.lang === "en" ? c.en : c.name);
  const order = [...PRODUCTS].sort((a, b) => a.rank - b.rank);
  const fig = (p) => String(order.indexOf(p) + 1).padStart(2, "0");

  /* bar */
  function renderBar() {
    const chip = (id, label, cls = "") => `<button type="button" class="chip ${cls}" data-cat="${id}" aria-pressed="${state.cat === id}">${label}<sup>${PRODUCTS.filter((p) => inCat(p, id)).length}</sup></button>`;
    $("[data-cats]").innerHTML = chip("all", MP.t("all")) + CATS.map((c) => `<span class="chip chip--sep" aria-hidden="true"></span>` + chip(c.id, cname(c), "chip--group") + c.children.map((ch) => chip(ch.id, cname(ch))).join("")).join("");
    $("[data-prices]").innerHTML = PRICE.map((_, i) => `<button type="button" class="chip" role="radio" data-price="${i}" aria-pressed="${state.price === i}" aria-checked="${state.price === i}">${MP.t("p" + i)}</button>`).join("");
    $("[data-search]").placeholder = `(${MP.t("search")})`;
  }

  /* grid: every product is rendered once; filtering toggles visibility so Flip can animate */
  const grid = $("[data-grid]");
  function buildGrid() {
    grid.innerHTML = order.map((p) => {
      const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      const badges = [sale ? `<span class="badge badge--sale">-${sale}%</span>` : "", p.badge ? `<span class="badge${p.badge === "ახალი" ? " badge--new" : ""}">${MP.t(BADGE[p.badge])}</span>` : ""].join("");
      const inCart = MP.cart.has(p.id);
      return `<li class="tile" data-id="${p.id}" tabindex="0" aria-label="${MP.pname(p)}">
        <div class="tile__meta"><span>${fig(p)}.</span><span>FIG. ${fig(p)}</span></div>
        <div class="tile__badges">${badges}</div>
        <div class="tile__img"><img src="${img(p.id)}" alt="${MP.pname(p)}" loading="lazy" width="800" height="800"></div>
        <h2 class="tile__name">${MP.pname(p)}</h2>
        <p class="tile__spec">${p.spec}</p>
        <div class="tile__row"><p class="tile__price${sale ? " is-sale" : ""}">${p.old ? `<s>${money(p.old)}</s>` : ""}${money(p.price)}</p>
        <button type="button" class="tile__add${inCart ? " is-in" : ""}" data-add="${p.id}">+ ${MP.t("add")}</button></div>
      </li>`;
    }).join("");
  }
  function visibleList() {
    const q = state.q.trim().toLowerCase();
    const [lo, hi] = PRICE[state.price];
    let list = order.filter((p) => inCat(p, state.cat) && p.price >= lo && p.price < hi && (!q || `${p.name} ${p.en} ${p.spec}`.toLowerCase().includes(q)));
    if (state.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }
  function applyFilter(animate = true) {
    const tiles = $$(".tile", grid);
    const flipState = hasFlip && animate && !reduced ? Flip.getState(tiles) : null;
    const list = visibleList();
    const ids = new Set(list.map((p) => p.id));
    tiles.forEach((t) => { t.hidden = !ids.has(t.dataset.id); });
    list.forEach((p) => grid.appendChild(grid.querySelector(`[data-id="${p.id}"]`)));
    $("[data-count]").textContent = `(${list.length}/${PRODUCTS.length})`;
    $("[data-total]").textContent = `${list.length}.`;
    $("[data-empty]").hidden = list.length > 0;
    if (flipState) {
      Flip.from(flipState, {
        duration: .6, ease: "expo.out", absolute: true, nested: true, stagger: .02,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: .9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: .5, ease: "expo.out", stagger: .03 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: .9, duration: .25, ease: "power2.in" }),
      });
    }
    const url = new URL(location.href);
    state.cat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", state.cat);
    history.replaceState(null, "", url);
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) { state.cat = c.dataset.cat; renderBar(); applyFilter(); return; }
    const pr = e.target.closest("[data-price]");
    if (pr) { state.price = +pr.dataset.price; renderBar(); applyFilter(); return; }
    if (e.target.closest("[data-reset]")) { Object.assign(state, { cat: "all", price: 0, q: "" }); $("[data-search]").value = ""; renderBar(); applyFilter(); return; }
    const tile = e.target.closest(".tile");
    if (tile && !e.target.closest("[data-add]")) openQV(tile.dataset.id);
  });
  grid.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".tile")) openQV(e.target.dataset.id); });
  $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; applyFilter(); });
  let qt;
  $("[data-search]").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value; applyFilter(); }, 160); });
  document.addEventListener("cart:change", () => $$(".tile__add").forEach((b) => b.classList.toggle("is-in", MP.cart.has(b.dataset.add))));

  /* quick view */
  const qv = $("[data-qv]");
  let qvLast = null;
  function openQV(id) {
    const p = byId[id];
    qvLast = document.activeElement;
    $("[data-qv-img]").src = img(id);
    $("[data-qv-img]").alt = MP.pname(p);
    $("[data-qv-fig]").textContent = `FIG. ${fig(p)}`;
    $("[data-qv-name]").textContent = MP.pname(p);
    $("[data-qv-spec]").textContent = p.spec;
    $("[data-qv-price]").textContent = money(p.price);
    $("[data-qv-add]").dataset.add = id;
    qv.hidden = false;
    requestAnimationFrame(() => qv.classList.add("is-on"));
    MP.lenis?.stop();
    $("[data-qv-close]").focus();
  }
  function closeQV() {
    qv.classList.remove("is-on");
    MP.lenis?.start();
    setTimeout(() => { qv.hidden = true; }, 200);
    qvLast?.focus();
  }
  $("[data-qv-close]").addEventListener("click", closeQV);
  qv.addEventListener("click", (e) => { if (e.target === qv) closeQV(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !qv.hidden) closeQV(); });

  /* entrance + parallax on images */
  function intro() {
    if (!window.gsap || reduced) return;
    gsap.from(".tri span", { yPercent: 100, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .08 });
    gsap.from(".tile:not([hidden])", { y: 60, opacity: 0, duration: .9, ease: "expo.out", stagger: .045, delay: .2 });
    if (window.ScrollTrigger) {
      $$(".tile__img").forEach((im) => gsap.fromTo(im, { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: im, start: "top bottom", end: "bottom top", scrub: true } }));
    }
  }

  let built = false;
  MP.onLang(() => {
    renderBar();
    buildGrid();
    applyFilter(false);
    if (!built) { built = true; intro(); const pid = params.get("p"); if (pid && byId[pid]) { state.cat = byId[pid].cat; renderBar(); applyFilter(false); setTimeout(() => openQV(pid), 500); } }
  });
})();
