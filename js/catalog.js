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
    ka: { home: "მთავარი", search: "ძებნა", searchPh: "მოძებნე პროდუქტი", catLead: "პოკერის აღჭურვილობა და სამაგიდო თამაშები. მიწოდება თბილისში მეორე დღეს.", fPrice: "ფასი", sortBy: "დალაგება", nProducts: (n) => `<b>${n}</b> პროდუქტი`, shown: (a, b) => `ნაჩვენებია ${a} / ${b}`, clearAll: "ყველაფრის გასუფთავება", addTo: (n) => `კალათაში დამატება: ${n}`, remove: "მოხსნა", sortRec: "რეკომენდებული", sortAsc: "ფასი ↑", sortDesc: "ფასი ↓", emptyTitle: "ვერაფერი მოიძებნა.", emptyReset: "ფილტრების გასუფთავება", call: "დარეკვა", qvNote: "მიწოდება თბილისში მეორე დღეს. გადახდა მიღებისას.", ship: "უფასო მიწოდება თბილისში 80 ₾-დან", all: "ყველა", p0: "ნებისმიერი ფასი", p1: "50 ₾-მდე", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "ახალი", badgeBest: "ბესტსელერი", badgePrem: "პრემიუმი" },
    en: { home: "Home", search: "Search", searchPh: "Search products", catLead: "Poker equipment and board games. Next-day delivery in Tbilisi.", fPrice: "Price", sortBy: "Sort by", nProducts: (n) => `<b>${n}</b> ${n === 1 ? "product" : "products"}`, shown: (a, b) => `Showing ${a} of ${b}`, clearAll: "Clear all", addTo: (n) => `Add to cart: ${n}`, remove: "Remove", sortRec: "Recommended", sortAsc: "Price ↑", sortDesc: "Price ↓", emptyTitle: "Nothing matches.", emptyReset: "Clear filters", call: "Call", qvNote: "Next-day delivery in Tbilisi. Pay on delivery.", ship: "Free delivery in Tbilisi from 80 ₾", all: "All", p0: "Any price", p1: "Under 50 ₾", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾+", badgeNew: "New", badgeBest: "Bestseller", badgePrem: "Premium" },
  });
  const BADGE = { "ახალი": "badgeNew", "ბესტსელერი": "badgeBest", "პრემიუმი": "badgePrem" };

  const PRICE = [[0, Infinity], [0, 50], [50, 200], [200, 500], [500, Infinity]];
  const params = new URLSearchParams(location.search);
  const state = { cat: params.get("cat") || "all", price: 0, sort: "rec", q: "" };
  const kids = (id) => CATS.find((c) => c.id === id)?.children.map((c) => c.id) || [id];
  const inCat = (p, c) => c === "all" || kids(c).includes(p.cat);
  const cname = (c) => (MP.lang === "en" ? c.en : c.name);
  const order = [...PRODUCTS].sort((a, b) => a.rank - b.rank);

  /* toolbar: category pills, search, price popover, sort, count, active-filter chips */
  const priceBtn = $("[data-price-btn]");
  const pricePop = $("[data-prices]");
  function renderBar() {
    const chip = (id, label) => `<button type="button" class="chip" data-cat="${id}" aria-pressed="${state.cat === id}">${label}<sup>${PRODUCTS.filter((p) => inCat(p, id)).length}</sup></button>`;
    $("[data-cats]").innerHTML = chip("all", MP.t("all")) + CATS.map((c) => `<span class="chip chip--sep" aria-hidden="true"></span>` + chip(c.id, cname(c)) + c.children.map((ch) => chip(ch.id, cname(ch))).join("")).join("");
    pricePop.innerHTML = PRICE.map((_, i) => `<button type="button" role="radio" data-price="${i}" aria-checked="${state.price === i}">${MP.t("p" + i)}</button>`).join("");
    $("[data-price-cur]").textContent = state.price ? MP.t("p" + state.price) : "";
    $("[data-search]").placeholder = MP.t("searchPh");
    renderActive();
  }
  function renderActive() {
    const box = $("[data-active]");
    const chips = [];
    if (state.price) chips.push(`<button type="button" class="fchip" data-clear="price" aria-label="${MP.t("remove")}: ${MP.t("p" + state.price)}">${MP.t("fPrice")}: ${MP.t("p" + state.price)} <span aria-hidden="true">×</span></button>`);
    if (state.q.trim()) chips.push(`<button type="button" class="fchip" data-clear="q" aria-label="${MP.t("remove")}: ${state.q}">„${state.q.trim()}“ <span aria-hidden="true">×</span></button>`);
    const any = chips.length || state.cat !== "all";
    box.innerHTML = chips.join("") + (any ? `<button type="button" class="fclear" data-reset>${MP.t("clearAll")}</button>` : "");
    box.hidden = !any;
  }
  function togglePrice(open = pricePop.hidden) {
    pricePop.hidden = !open;
    priceBtn.setAttribute("aria-expanded", open);
    if (open) (pricePop.querySelector('[aria-checked="true"]') || pricePop.firstElementChild)?.focus();
  }

  /* grid: every product is rendered once; filtering toggles visibility so Flip can animate */
  const grid = $("[data-grid]");
  const cartIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1"/><path d="M15 3.5v5M12.5 6h5"/><circle cx="9.5" cy="20" r=".6"/><circle cx="17" cy="20" r=".6"/></svg>`;
  function buildGrid() {
    grid.innerHTML = order.map((p) => {
      const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      const badges = [sale ? `<span class="badge badge--sale">-${sale}%</span>` : "", p.badge ? `<span class="badge${p.badge === "ახალი" ? " badge--new" : ""}">${MP.t(BADGE[p.badge])}</span>` : ""].join("");
      const inCart = MP.cart.has(p.id);
      return `<li class="tile" data-id="${p.id}" tabindex="0" aria-label="${MP.pname(p)}">
        <div class="tile__img"><div class="tile__badges">${badges}</div><img src="${img(p.id)}" alt="${MP.pname(p)}" loading="lazy" width="800" height="800"></div>
        <div class="tile__body">
          <p class="tile__meta">${MP.cname(p.cat)}</p>
          <h2 class="tile__name">${MP.pname(p)}</h2>
          <div class="tile__row"><p class="tile__price${sale ? " is-sale" : ""}">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</p>
          <button type="button" class="tile__add${inCart ? " is-in" : ""}" data-add="${p.id}" aria-label="${MP.t("addTo", MP.pname(p))}" title="${MP.t("add")}">${cartIcon}</button></div>
        </div>
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
    $("[data-count]").innerHTML = MP.t("nProducts", list.length);
    $("[data-foot]").textContent = list.length ? MP.t("shown", list.length, PRODUCTS.length) : "";
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
    if (pr) { state.price = +pr.dataset.price; togglePrice(false); renderBar(); applyFilter(); priceBtn.focus(); return; }
    if (e.target.closest("[data-price-btn]")) { togglePrice(); return; }
    if (!pricePop.hidden && !e.target.closest(".bar__filter")) togglePrice(false);
    const cl = e.target.closest("[data-clear]");
    if (cl) { if (cl.dataset.clear === "price") state.price = 0; else { state.q = ""; $("[data-search]").value = ""; } renderBar(); applyFilter(); return; }
    if (e.target.closest("[data-reset]")) { Object.assign(state, { cat: "all", price: 0, q: "" }); $("[data-search]").value = ""; renderBar(); applyFilter(); return; }
    const tile = e.target.closest(".tile");
    if (tile && !e.target.closest("[data-add]")) openQV(tile.dataset.id);
  });
  grid.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".tile")) openQV(e.target.dataset.id); });
  $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; applyFilter(); });
  let qt;
  $("[data-search]").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value; renderActive(); applyFilter(); }, 160); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pricePop.hidden) { togglePrice(false); priceBtn.focus(); }
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
