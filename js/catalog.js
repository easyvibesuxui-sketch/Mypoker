/* mypoker.ge — catalog: icon category tabs, Filters dialog + quick pills, Flip-animated grid, quick view */
(() => {
  "use strict";
  const MP = window.MP;
  const { $, $$, reduced, byId, img, money } = MP;
  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const hasFlip = !!(window.gsap && window.Flip);
  if (hasFlip) gsap.registerPlugin(Flip);

  MP.extendT({
    ka: { home: "მთავარი", search: "ძებნა", searchPh: "მოძებნე პროდუქტი", catLead: "პოკერის აღჭურვილობა და სამაგიდო თამაშები. მიწოდება თბილისში მეორე დღეს.", filters: "ფილტრები", fPrice: "ფასი", fSpecial: "შეთავაზებები", sortBy: "დალაგება", sortRec: "რეკომენდებული", sortAsc: "ჯერ იაფი", sortDesc: "ჯერ ძვირი", emptyTitle: "ვერაფერი მოიძებნა.", emptyReset: "ფილტრების გასუფთავება", call: "დარეკვა", qvNote: "მიწოდება თბილისში მეორე დღეს. გადახდა მიღებისას.", ship: "უფასო მიწოდება თბილისში 80 ₾-დან", all: "ყველა", p0: "ნებისმიერი", p1: "50 ₾-მდე", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "ახალი", badgeBest: "ბესტსელერი", badgePrem: "პრემიუმი", qSale: "ფასდაკლებით", qFree: "უფასო მიწოდებით", nProducts: (n) => `${n} პროდუქტი`, nAll: (n) => `ყველა ${n} პროდუქტი`, showN: (n) => `ნახე ${n} პროდუქტი`, shown: (a, b) => `ნაჩვენებია ${a} / ${b}`, clearAll: "ყველაფრის გასუფთავება", clear: "გასუფთავება", addTo: (n) => `კალათაში დამატება: ${n}` },
    en: { home: "Home", search: "Search", searchPh: "Search products", catLead: "Poker equipment and board games. Next-day delivery in Tbilisi.", filters: "Filters", fPrice: "Price", fSpecial: "Offers", sortBy: "Sort by", sortRec: "Recommended", sortAsc: "Lowest price", sortDesc: "Highest price", emptyTitle: "Nothing matches.", emptyReset: "Clear filters", call: "Call", qvNote: "Next-day delivery in Tbilisi. Pay on delivery.", ship: "Free delivery in Tbilisi from 80 ₾", all: "All", p0: "Any", p1: "Under 50 ₾", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "New", badgeBest: "Bestseller", badgePrem: "Premium", qSale: "On sale", qFree: "Free delivery", nProducts: (n) => `${n} ${n === 1 ? "product" : "products"}`, nAll: (n) => `All ${n} products`, showN: (n) => `Show ${n} ${n === 1 ? "product" : "products"}`, shown: (a, b) => `Showing ${a} of ${b}`, clearAll: "Clear all", clear: "Clear all", addTo: (n) => `Add to cart: ${n}` },
  });
  const BADGE = { "ახალი": "badgeNew", "ბესტსელერი": "badgeBest", "პრემიუმი": "badgePrem" };

  /* category tabs: short label + Tabler icon (MIT, tabler.io/icons, 24 grid, stroke) */
  const TAB = {
    all: ["ყველა", "All", "<path d=\"M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\"/><path d=\"M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\"/><path d=\"M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\"/><path d=\"M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\"/>"],
    poker: ["პოკერი", "Poker", "<path d=\"M12 3l4.919 4.5c.61 .587 1.177 1.177 1.703 1.771a5.527 5.527 0 0 1 .264 6.979c-1.18 1.56 -3.338 1.92 -4.886 .75v1l1 3h-6l1 -3v-1c-1.54 1.07 -3.735 .772 -4.886 -.75a5.527 5.527 0 0 1 .264 -6.979a30.883 30.883 0 0 1 1.703 -1.771a1541.72 1541.72 0 0 1 4.919 -4.5z\"/>"],
    cards: ["კარტები", "Cards", "<path d=\"M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z\"/><path d=\"M15 4h1a1 1 0 0 1 1 1v3.5\"/><path d=\"M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374\"/>"],
    chips: ["ჩიპები", "Chips", "<path d=\"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\"/><path d=\"M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0\"/><path d=\"M12 3v4\"/><path d=\"M12 17v4\"/><path d=\"M3 12h4\"/><path d=\"M17 12h4\"/><path d=\"M18.364 5.636l-2.828 2.828\"/><path d=\"M8.464 15.536l-2.828 2.828\"/><path d=\"M5.636 5.636l2.828 2.828\"/><path d=\"M15.536 15.536l2.828 2.828\"/>"],
    tables: ["მაგიდები", "Tables", "<path d=\"M16 7l2 9m-10 -9l-2 9m-1 -9h14m2 5h-18\"/>"],
    accessories: ["აქსესუარები", "Accessories", "<path d=\"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\"/><path d=\"M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z\"/>"],
    games: ["სამაგიდო", "Tabletop", "<path d=\"M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z\"/><circle cx=\"8.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"15.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"15.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\".5\" fill=\"currentColor\"/>"],
    nardi: ["ნარდი", "Backgammon", "<path d=\"M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z\"/><circle cx=\"8.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"15.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"15.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\"/>"],
    domino: ["დომინო", "Domino", "<path d=\"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z\"/><path d=\"M4 12h8\"/><path d=\"M12 15h8\"/><path d=\"M12 9h8\"/><path d=\"M12 4v16\"/>"],
    chess: ["ჭადრაკი", "Chess", "<path d=\"M8 16l-1.447 .724a1 1 0 0 0 -.553 .894v2.382h12v-2.382a1 1 0 0 0 -.553 -.894l-1.447 -.724h-8z\"/><path d=\"M9 3l1 3l-3.491 2.148a1 1 0 0 0 .524 1.852h2.967l-2.073 6h7.961l.112 -5c0 -3 -1.09 -5.983 -4 -7c-1.94 -.678 -2.94 -1.011 -3 -1z\"/>"],
    boardgames: ["Board Games", "Board Games", "<path d=\"M9 20h-5a1 1 0 0 1 -1 -1c0 -2 3.378 -4.907 4 -6c-1 0 -4 -.5 -4 -2c0 -2 4 -3.5 6 -4c0 -1.5 .5 -4 3 -4s3 2.5 3 4c2 .5 6 2 6 4c0 1.5 -3 2 -4 2c.622 1.093 4 4 4 6a1 1 0 0 1 -1 1h-5c-1 0 -2 -4 -3 -4s-2 4 -3 4z\"/>"],
    other: ["სხვა", "Other", "<path d=\"M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z\"/>"],
  };
  const ICON = {
    cartAdd: "<path d=\"M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\"/><path d=\"M12.5 17h-6.5v-14h-2\"/><path d=\"M6 5l14 1l-.86 6.017m-2.64 .983h-10.5\"/><path d=\"M16 19h6\"/><path d=\"M19 16v6\"/>",
    cartIn: "<path d=\"M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\"/><path d=\"M11.5 17h-5.5v-14h-2\"/><path d=\"M6 5l14 1l-1 7h-13\"/><path d=\"M15 19l2 2l4 -4\"/>",
    filter: "<path d=\"M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\"/><path d=\"M4 6l8 0\"/><path d=\"M16 6l4 0\"/><path d=\"M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\"/><path d=\"M4 12l2 0\"/><path d=\"M10 12l10 0\"/><path d=\"M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\"/><path d=\"M4 18l11 0\"/><path d=\"M19 18l1 0\"/>",
    search: "<path d=\"M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\"/><path d=\"M21 21l-6 -6\"/>",
    truck: "<path d=\"M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\"/><path d=\"M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\"/><path d=\"M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5\"/><path d=\"M3 9l4 0\"/>",
    x: "<path d=\"M18 6l-12 12\"/><path d=\"M6 6l12 12\"/>",
  };
  const svg = (body, cls = "") => `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  /* simple use tags on cards: which game or occasion a product is for */
  const TAGS = { poker: ["პოკერი", "Poker"], joker: ["ჯოკერი", "Joker"], blackjack: ["ბლექჯეკი", "Blackjack"], casino: ["კაზინო", "Casino"], players8: ["8 მოთამაშე", "8 players"], foldable: ["დასაკეცი", "Foldable"], gift: ["საჩუქარი", "Gift"], nardi: ["ნარდი", "Backgammon"], domino: ["დომინო", "Domino"], chess: ["ჭადრაკი", "Chess"], family: ["ოჯახი", "Family"], friends: ["მეგობრები", "Friends"] };
  const tagLabel = (k) => (TAGS[k] ? TAGS[k][MP.lang === "en" ? 1 : 0] : k);
  const tabLabel = (id) => (TAB[id] ? TAB[id][MP.lang === "en" ? 1 : 0] : id);

  const PRICE = [[0, Infinity], [0, 50], [50, 200], [200, 500], [500, Infinity]];
  const FLAGS = {
    sale: { t: "qSale", test: (p) => !!p.old },
    free: { t: "qFree", test: (p) => p.price >= 80 },
    best: { t: "badgeBest", test: (p) => p.badge === "ბესტსელერი" },
    new: { t: "badgeNew", test: (p) => p.badge === "ახალი" },
    prem: { t: "badgePrem", test: (p) => p.badge === "პრემიუმი" },
  };
  const QUICK = ["sale", "free", "best", "new"];
  const SORTS = ["rec", "asc", "desc"];
  const params = new URLSearchParams(location.search);
  const state = { cat: params.get("cat") || "all", price: 0, sort: "rec", q: "", flags: new Set() };
  const kids = (id) => CATS.find((c) => c.id === id)?.children.map((c) => c.id) || [id];
  const inCat = (p, c) => c === "all" || kids(c).includes(p.cat);
  const order = [...PRODUCTS].sort((a, b) => a.rank - b.rank);

  /* toolbar */
  function renderBar() {
    const tab = (id) => `<button type="button" class="tab" data-cat="${id}" aria-pressed="${state.cat === id}">${svg(TAB[id]?.[2] || TAB.other[2])}${tabLabel(id)}</button>`;
    $("[data-cats]").innerHTML = tab("all") + CATS.map((c) => `<span class="tab tab--sep" aria-hidden="true"></span>` + tab(c.id) + c.children.map((ch) => tab(ch.id)).join("")).join("");
    $("[data-quick]").innerHTML = QUICK.map((f) => `<button type="button" class="pill" data-flag="${f}" aria-pressed="${state.flags.has(f)}">${MP.t(FLAGS[f].t)}</button>`).join("");
    $("[data-search]").placeholder = MP.t("searchPh");
    renderDialog();
    const n = (state.price ? 1 : 0) + state.flags.size + (state.sort !== "rec" ? 1 : 0);
    $("[data-filter-n]").textContent = n || "";
  }
  function renderDialog() {
    $("[data-prices]").innerHTML = PRICE.map((_, i) => `<button type="button" role="radio" data-price="${i}" aria-checked="${state.price === i}">${MP.t("p" + i)}</button>`).join("");
    $("[data-flags]").innerHTML = Object.keys(FLAGS).map((f) => `<label><input type="checkbox" data-flag-box="${f}" ${state.flags.has(f) ? "checked" : ""}> ${MP.t(FLAGS[f].t)} <small>${PRODUCTS.filter(FLAGS[f].test).length}</small></label>`).join("");
    $("[data-sorts]").innerHTML = SORTS.map((s) => `<button type="button" role="radio" data-sortv="${s}" aria-checked="${state.sort === s}">${MP.t("sort" + s[0].toUpperCase() + s.slice(1))}</button>`).join("");
    $("[data-show]").textContent = MP.t("showN", visibleList().length);
  }

  /* grid: every product is rendered once; filtering toggles visibility so Flip can animate */
  const grid = $("[data-grid]");
  const cartIcon = svg(ICON.cartAdd, "i-add") + svg(ICON.cartIn, "i-in");
  function buildGrid() {
    grid.innerHTML = order.map((p) => {
      const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      const badges = [p.badge ? `<span class="badge">${MP.t(BADGE[p.badge])}</span>` : "", sale ? `<span class="badge badge--sale">-${sale}%</span>` : ""].join("");
      const tags = (p.tags || []).slice(0, 3).map((k) => `<span class="tag">${tagLabel(k)}</span>`).join("");
      const inCart = MP.cart.has(p.id);
      return `<li class="tile" data-id="${p.id}" tabindex="0" aria-label="${MP.pname(p)}">
        <div class="tile__img"><div class="tile__badges">${badges}</div><img src="${img(p.id)}" alt="${MP.pname(p)}" loading="lazy" width="800" height="800">
          <button type="button" class="tile__add${inCart ? " is-in" : ""}" data-add="${p.id}" aria-label="${MP.t("addTo", MP.pname(p))}" title="${MP.t("add")}">${cartIcon}</button></div>
        <div class="tile__body">
          <h2 class="tile__name">${MP.sname(p)}</h2>
          <p class="tile__meta">${MP.pname(p)}</p>
          <div class="tile__tags">${tags}</div>
          <p class="tile__price${sale ? " is-sale" : ""}">${p.old ? `<s>${money(p.old)}</s>` : ""}<b>${money(p.price)}</b></p>
        </div>
      </li>`;
    }).join("");
  }
  function visibleList() {
    const q = state.q.trim().toLowerCase();
    const [lo, hi] = PRICE[state.price];
    let list = order.filter((p) => inCat(p, state.cat) && p.price >= lo && p.price < hi && [...state.flags].every((f) => FLAGS[f].test(p)) && (!q || `${p.name} ${p.en} ${p.short} ${p.shortEn} ${p.spec} ${(p.tags || []).map((k) => TAGS[k]?.join(" ")).join(" ")}`.toLowerCase().includes(q)));
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
    const filtered = list.length !== PRODUCTS.length;
    $("[data-count]").textContent = filtered ? MP.t("nProducts", list.length) : MP.t("nAll", list.length);
    $("[data-foot]").textContent = list.length ? MP.t("shown", list.length, PRODUCTS.length) : "";
    $("[data-empty]").hidden = list.length > 0;
    $("[data-show]").textContent = MP.t("showN", list.length);
    if (flipState) {
      Flip.from(flipState, {
        duration: .6, ease: "expo.out", absolute: true, nested: true, stagger: .02,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: .94, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: .5, ease: "expo.out", stagger: .03 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: .94, duration: .25, ease: "power2.in" }),
      });
    }
    const url = new URL(location.href);
    state.cat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", state.cat);
    history.replaceState(null, "", url);
  }
  const update = (animate = true) => { renderBar(); applyFilter(animate); };

  /* filters dialog */
  const dlg = $("[data-fdlg]");
  let dlgLast = null;
  function openDlg() {
    dlgLast = document.activeElement;
    renderDialog();
    dlg.hidden = false;
    requestAnimationFrame(() => dlg.classList.add("is-on"));
    MP.lenis?.stop();
    $(".fdlg__x", dlg).focus();
  }
  function closeDlg() {
    dlg.classList.remove("is-on");
    MP.lenis?.start();
    setTimeout(() => { dlg.hidden = true; }, 200);
    dlgLast?.focus();
  }
  dlg.addEventListener("click", (e) => { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener("change", (e) => {
    const f = e.target.dataset.flagBox;
    if (!f) return;
    e.target.checked ? state.flags.add(f) : state.flags.delete(f);
    update();
  });

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) { state.cat = c.dataset.cat; update(); return; }
    const fl = e.target.closest("[data-flag]");
    if (fl) { const f = fl.dataset.flag; state.flags.has(f) ? state.flags.delete(f) : state.flags.add(f); update(); return; }
    const pr = e.target.closest("[data-price]");
    if (pr) { state.price = +pr.dataset.price; update(); return; }
    const so = e.target.closest("[data-sortv]");
    if (so) { state.sort = so.dataset.sortv; update(); return; }
    if (e.target.closest("[data-filters-open]")) { openDlg(); return; }
    if (e.target.closest("[data-filters-close]")) { closeDlg(); return; }
    if (e.target.closest("[data-reset]")) { Object.assign(state, { cat: "all", price: 0, sort: "rec", q: "" }); state.flags.clear(); $("[data-search]").value = ""; update(); return; }
    const tile = e.target.closest(".tile");
    if (tile && !e.target.closest("[data-add]")) openQV(tile.dataset.id);
  });
  grid.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".tile")) openQV(e.target.dataset.id); });
  let qt;
  $("[data-search]").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value; applyFilter(); }, 160); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dlg.hidden) closeDlg();
    if (e.key === "/" && !e.target.closest("input, textarea, select")) { e.preventDefault(); $("[data-search]").focus(); }
  });
  document.addEventListener("cart:change", () => $$(".tile__add").forEach((b) => b.classList.toggle("is-in", MP.cart.has(b.dataset.add))));

  /* quick view */
  const qv = $("[data-qv]");
  let qvLast = null;
  function openQV(id) {
    const p = byId[id];
    qvLast = document.activeElement;
    $("[data-qv-img]").src = img(id);
    $("[data-qv-img]").alt = MP.pname(p);
    $("[data-qv-fig]").textContent = MP.cname(p.cat);
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

  /* entrance */
  function intro() {
    if (!window.gsap || reduced) return;
    gsap.from(".chead__txt > *", { y: 24, opacity: 0, duration: .9, ease: "expo.out", stagger: .08 });
    gsap.from(".tile:not([hidden])", { y: 40, opacity: 0, duration: .8, ease: "expo.out", stagger: .04, delay: .15 });
  }

  let built = false;
  MP.onLang(() => {
    renderBar();
    buildGrid();
    applyFilter(false);
    if (!built) { built = true; intro(); const pid = params.get("p"); if (pid && byId[pid]) { state.cat = byId[pid].cat; renderBar(); applyFilter(false); setTimeout(() => openQV(pid), 500); } }
  });
})();
