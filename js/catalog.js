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

  /* category tabs: short label + line icon (24 grid, stroke) */
  const TAB = {
    all: ["ყველა", "All", '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'],
    poker: ["პოკერი", "Poker", '<path d="M12 3c3 3.6 7 6.2 7 9.7A3.6 3.6 0 0 1 12.8 15c.3 2.2 1.3 4 2.7 5H8.5c1.4-1 2.4-2.8 2.7-5A3.6 3.6 0 0 1 5 12.7C5 9.2 9 6.6 12 3Z"/>'],
    cards: ["კარტები", "Cards", '<rect x="8" y="3.5" width="11" height="15" rx="2" transform="rotate(10 13.5 11)"/><rect x="4.5" y="5.5" width="11" height="15" rx="2"/><path d="M10 10.5c.8 1 2 1.7 2 2.7a1.1 1.1 0 0 1-2 .5 1.1 1.1 0 0 1-2-.5c0-1 1.2-1.7 2-2.7Z"/>'],
    chips: ["ჩიპები", "Chips", '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18"/>'],
    tables: ["მაგიდები", "Tables", '<ellipse cx="12" cy="9.5" rx="9" ry="4"/><ellipse cx="12" cy="9.5" rx="6" ry="2.2"/><path d="M6 12.8 5 20M18 12.8l1 7.2"/>'],
    accessories: ["აქსესუარები", "Accessories", '<circle cx="12" cy="12" r="8.5"/><path d="M10 8.5h1.8a3.5 3.5 0 0 1 0 7H10z"/>'],
    games: ["სამაგიდო", "Tabletop", '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="15.5" cy="8.5" r="1"/><circle cx="8.5" cy="15.5" r="1"/>'],
    nardi: ["ნარდი", "Backgammon", '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M12 4v16M5 4l1.7 6L8.4 4M15.6 4l1.7 6L19 4M5 20l1.7-6 1.7 6M15.6 20l1.7-6 1.7 6"/>'],
    domino: ["დომინო", "Domino", '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M7 12h10"/><circle cx="12" cy="7.2" r=".9"/><circle cx="10" cy="15" r=".9"/><circle cx="14" cy="18.4" r=".9"/>'],
    chess: ["ჭადრაკი", "Chess", '<circle cx="12" cy="6" r="2.5"/><path d="M10 8.5c-.4 2.5-1.6 4.4-2.5 5.5h9c-.9-1.1-2.1-3-2.5-5.5M7 17h10M6 20.5h12l-1-3.5H7z"/>'],
    boardgames: ["Board Games", "Board Games", '<circle cx="12" cy="6.5" r="3"/><path d="M8 20.5c0-4 1.6-7.2 4-8 2.4.8 4 4 4 8zM6 20.5h12"/>'],
    other: ["სხვა", "Other", '<path d="M12 3.5 13.8 9l5.7.2-4.5 3.5 1.6 5.5L12 15l-4.6 3.2L9 12.7 4.5 9.2l5.7-.2z"/>'],
  };
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
    const tab = (id) => `<button type="button" class="tab" data-cat="${id}" aria-pressed="${state.cat === id}"><svg viewBox="0 0 24 24" aria-hidden="true">${TAB[id]?.[2] || TAB.other[2]}</svg>${tabLabel(id)}</button>`;
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
  const cartIcon = `<svg class="i-add" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1"/><path d="M15 3.5v5M12.5 6h5"/><circle cx="9.5" cy="20" r=".6"/><circle cx="17" cy="20" r=".6"/></svg><svg class="i-in" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;
  function buildGrid() {
    grid.innerHTML = order.map((p) => {
      const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      const badges = [p.badge ? `<span class="badge">${MP.t(BADGE[p.badge])}</span>` : "", sale ? `<span class="badge badge--sale">-${sale}%</span>` : ""].join("");
      const tags = [`<span class="tag tag--cat">${MP.cname(p.cat)}</span>`, ...p.spec.split(",").slice(0, 2).map((t) => `<span class="tag">${t.trim()}</span>`)].join("");
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
    let list = order.filter((p) => inCat(p, state.cat) && p.price >= lo && p.price < hi && [...state.flags].every((f) => FLAGS[f].test(p)) && (!q || `${p.name} ${p.en} ${p.short} ${p.shortEn} ${p.spec}`.toLowerCase().includes(q)));
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
