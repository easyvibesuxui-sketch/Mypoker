/* mypoker.ge — interactions */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => matchMedia("(max-width: 760px)").matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const img = (id) => `assets/img/products/${id}.webp`;
  const FREE_FROM = 80;

  /* ── i18n ─────────────────────────────── */
  const T = {
    ka: {
      skip: "გადადი კატალოგზე", ship: "უფასო მიწოდება თბილისში", shipFrom: "80 ₾-დან", search: "ძებნა", callUs: "დაგვირეკეთ",
      drag: "(გადაათრიე ბარათები)", dragM: "(გადაფურცლე)", kicker: "ყველაფერი პოკერისთვის და სამაგიდო თამაშებისთვის. თბილისი.",
      heroDesc: "კაზინოს ხარისხის ჩიპები, პლასტიკის კარტები და მაგიდები 8–10 მოთამაშისთვის. შეუკვეთე დღეს და მიიღე ხვალ.",
      toShop: "კატალოგის ნახვა", orderCall: "შეკვეთა ზარით", category: "კატეგორია", price: "ფასი", all: "ყველა", allProducts: "ყველა პროდუქტი",
      sortBy: "დალაგება", sortRec: "რეკომენდებული", sortAsc: "ფასი: ზრდადობით", sortDesc: "ფასი: კლებადობით",
      products: (n) => `${n} პროდუქტი`, emptyTitle: "ამ ფილტრით პროდუქტი ვერ მოიძებნა.", emptyReset: "ფილტრების გასუფთავება",
      inStock: "მარაგშია", add: "კალათაში", added: "დამატებულია", call: "დარეკე შესაკვეთად",
      p0: "ნებისმიერი", p1: "50 ₾-მდე", p2: "50–200 ₾", p3: "200–500 ₾", p4: "500 ₾-ზე მეტი",
      scroll: "(scroll down)", allinNote: "17 პროდუქტი, ერთი მისამართი. ყველაფერი, რაც შინაურ ტურნირს სჭირდება.",
      why1: "ჩიპები.", why2: "კარტები.", why3: "მაგიდები.",
      w1t: "მიწოდება 24 საათში", w1d: "თბილისში შეკვეთას მეორე დღეს მოგიტანთ. 80 ₾-ზე მეტი შეკვეთის მიწოდება უფასოა.",
      w2t: "ორიგინალი ბრენდები", w2d: "Bicycle, Copag და კაზინოს ხარისხის ჩიპები. ყოველ პროდუქტს ვამოწმებთ გაგზავნამდე.",
      w3t: "გადახდა მიღებისას", w3d: "გადაიხადე ნაღდით ან ბარათით, როცა კურიერი მოვა. წინასწარი გადახდა საჭირო არ არის.",
      setTitle: "მაგიდის კომპლექტი", setHint: "(დააჭირე ეტიკეტებს)", setSide: "კომპლექტის სია", setTotal: "სულ", setAdd: "მთელი კომპლექტის დამატება",
      orderTitle: "როგორ შევუკვეთო", flash: "(მიიტანე კურსორი, რომ ჩართო ფანარი)",
      s1t: "აირჩიე", s1d: "დაამატე პროდუქტები კალათაში ან დაგვირეკე და დაგეხმარებით არჩევაში.",
      s2t: "შეუკვეთე", s2d: "დატოვე სახელი, ნომერი და მისამართი. 15 წუთში დაგირეკავთ დასადასტურებლად.",
      s3t: "მიიღე", s3d: "კურიერი მოგიტანს მეორე დღეს. გადაიხადე მიღებისას.",
      footWord: "ყველაფერი მაგიდისთვის.", fCats: "კატეგორიები", fContact: "კონტაქტი", fCity: "თბილისი, საქართველო",
      fHours: "სამუშაო საათები", fHours1: "ორშაბათი–შაბათი, 10:00–20:00", fHours2: "კვირა, 11:00–18:00",
      cart: "კალათა", cartEmpty: "კალათა ცარიელია.", total: "ჯამი", checkout: "შეკვეთის გაფორმება", confirm: "შეკვეთის დადასტურება",
      fName: "სახელი", fPhone: "ტელეფონი", fAddr: "მისამართი", formErr: "შეავსე სახელი, სწორი ნომერი და მისამართი.",
      doneTitle: "შეკვეთა მიღებულია.", doneText: "15 წუთში დაგირეკავთ დასადასტურებლად.",
      freeLeft: (n) => `კიდევ ${n} ₾ და მიწოდება უფასოა.`, freeOk: "მიწოდება უფასოა.",
      toastAdd: (n) => `<b>${n}</b> კალათაშია`, toastSet: "კომპლექტი კალათაშია",
    },
    en: {
      skip: "Skip to catalogue", ship: "Free delivery in Tbilisi", shipFrom: "from 80 ₾", search: "Search", callUs: "Call us",
      drag: "(drag the cards)", dragM: "(swipe)", kicker: "Everything for poker and board games. Tbilisi.",
      heroDesc: "Casino-grade chips, plastic cards and tables for 8–10 players. Order today, get it tomorrow.",
      toShop: "Browse catalogue", orderCall: "Order by phone", category: "Category", price: "Price", all: "All", allProducts: "All products",
      sortBy: "Sort", sortRec: "Recommended", sortAsc: "Price: low to high", sortDesc: "Price: high to low",
      products: (n) => `${n} products`, emptyTitle: "No products match these filters.", emptyReset: "Clear filters",
      inStock: "In stock", add: "Add to cart", added: "Added", call: "Call to order",
      p0: "Any", p1: "Under 50 ₾", p2: "50–200 ₾", p3: "200–500 ₾", p4: "Over 500 ₾",
      scroll: "(scroll down)", allinNote: "17 products, one address. Everything a home tournament needs.",
      why1: "Chips.", why2: "Cards.", why3: "Tables.",
      w1t: "Delivery in 24 hours", w1d: "In Tbilisi we deliver the next day. Orders over 80 ₾ ship free.",
      w2t: "Original brands", w2d: "Bicycle, Copag and casino-grade chips. Every item is checked before it ships.",
      w3t: "Pay on delivery", w3d: "Pay cash or card when the courier arrives. No prepayment needed.",
      setTitle: "The table set", setHint: "(tap the labels)", setSide: "Set list", setTotal: "Total", setAdd: "Add the whole set",
      orderTitle: "How to order", flash: "(move the cursor to turn on the flashlight)",
      s1t: "Choose", s1d: "Add products to the cart, or call and we will help you pick.",
      s2t: "Order", s2d: "Leave your name, number and address. We call within 15 minutes to confirm.",
      s3t: "Receive", s3d: "The courier brings it the next day. Pay on delivery.",
      footWord: "Everything for the table.", fCats: "Categories", fContact: "Contact", fCity: "Tbilisi, Georgia",
      fHours: "Opening hours", fHours1: "Mon–Sat, 10:00–20:00", fHours2: "Sun, 11:00–18:00",
      cart: "Cart", cartEmpty: "Your cart is empty.", total: "Total", checkout: "Checkout", confirm: "Confirm order",
      fName: "Name", fPhone: "Phone", fAddr: "Address", formErr: "Enter your name, a valid number and an address.",
      doneTitle: "Order received.", doneText: "We will call within 15 minutes to confirm.",
      freeLeft: (n) => `${n} ₾ more for free delivery.`, freeOk: "Delivery is free.",
      toastAdd: (n) => `<b>${n}</b> is in your cart`, toastSet: "The set is in your cart",
    },
  };
  let lang = store.get("mp-lang", "ka");
  const t = (k, ...a) => { const v = T[lang][k]; return typeof v === "function" ? v(...a) : v; };
  const pname = (p) => (lang === "en" ? p.en : p.name);
  const cname = (c) => (lang === "en" ? c.en : c.name);
  const money = (n) => `${n.toLocaleString("en-US")} ₾`;

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { const v = T[lang][el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (isMobile()) $(".hero__hint").textContent = t("dragM");
  }

  /* ── Catalogue state ─────────────────────────────── */
  const PRICE = [[0, Infinity], [0, 50], [50, 200], [200, 500], [500, Infinity]];
  const state = { cat: "all", price: 0, sort: "rec", q: "" };
  const childIds = (id) => { const c = CATS.find((x) => x.id === id); return c ? c.children.map((x) => x.id) : [id]; };
  const inCat = (p, cat) => cat === "all" || childIds(cat).includes(p.cat);
  const count = (cat) => PRODUCTS.filter((p) => inCat(p, cat)).length;
  const findCat = (id) => { for (const c of CATS) { if (c.id === id) return c; const ch = c.children.find((x) => x.id === id); if (ch) return ch; } return null; };

  function renderCats() {
    const box = $("[data-cats]");
    const btn = (id, label, cls) => `<button type="button" class="cat ${cls}" data-cat="${id}" aria-current="${state.cat === id}"><span>${label}</span><small>${count(id)}</small></button>`;
    box.innerHTML = btn("all", t("all"), "") + CATS.map((c) => btn(c.id, cname(c), "cat--parent") + c.children.map((ch) => btn(ch.id, cname(ch), "cat--child")).join("")).join("");
    $("[data-prices]").innerHTML = PRICE.map((_, i) => `<button type="button" class="cat" role="radio" data-price="${i}" aria-checked="${state.price === i}"><span>${t("p" + i)}</span></button>`).join("");
    $("[data-foot-cats]").innerHTML = CATS.flatMap((c) => c.children).map((c) => `<li><button type="button" data-cat-jump="${c.id}">${cname(c)}</button></li>`).join("");
  }

  const cart = new Map(Object.entries(store.get("mp-cart", {})));

  function renderGrid() {
    const q = state.q.trim().toLowerCase();
    const [lo, hi] = PRICE[state.price];
    let list = PRODUCTS.filter((p) => inCat(p, state.cat) && p.price >= lo && p.price < hi && (!q || (p.name + " " + p.en + " " + p.spec).toLowerCase().includes(q)));
    if (state.sort === "rec") list.sort((a, b) => a.rank - b.rank);
    if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
    if (state.sort === "desc") list.sort((a, b) => b.price - a.price);

    const c = findCat(state.cat);
    $("[data-shop-title]").textContent = q ? `“${state.q.trim()}”` : c ? cname(c) : t("allProducts");
    $("[data-shop-count]").textContent = t("products", list.length);
    $("[data-empty]").hidden = list.length > 0;
    $("[data-grid]").innerHTML = list.map((p) => {
      const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      const badges = [sale ? `<span class="badge badge--sale">-${sale}%</span>` : "", p.badge ? `<span class="badge${p.badge === "ახალი" ? " badge--new" : ""}">${lang === "en" ? ({ "ბესტსელერი": "Bestseller", "პრემიუმი": "Premium", "ახალი": "New" })[p.badge] : p.badge}</span>` : ""].join("");
      const inCart = cart.has(p.id);
      return `<li class="card">
        <div class="card__media"><img src="${img(p.id)}" alt="${pname(p)}" loading="lazy" width="720" height="720"><div class="card__badges">${badges}</div></div>
        <h3 class="card__name">${pname(p)}</h3>
        <p class="card__spec">${p.spec}</p>
        <div class="card__row"><span class="card__price${sale ? " is-sale" : ""}">${money(p.price)}</span>${p.old ? `<span class="card__old">${money(p.old)}</span>` : ""}<span class="card__stock">${t("inStock")}</span></div>
        <div class="card__actions">
          <button type="button" class="btn btn--lime${inCart ? " is-added" : ""}" data-add="${p.id}">${inCart ? t("added") : t("add")}</button>
          <a class="card__call" href="tel:+995555123456" aria-label="${t("call")}"><svg aria-hidden="true"><use href="#i-phone"/></svg></a>
        </div>
      </li>`;
    }).join("");
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) { state.cat = c.dataset.cat; renderCats(); renderGrid(); return; }
    const pr = e.target.closest("[data-price]");
    if (pr) { state.price = +pr.dataset.price; renderCats(); renderGrid(); return; }
    const j = e.target.closest("[data-cat-jump]");
    if (j) { state.cat = j.dataset.catJump; state.q = ""; $("[data-search]").value = ""; renderCats(); renderGrid(); $("#shop").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); return; }
    const a = e.target.closest("[data-add]");
    if (a) { addToCart(a.dataset.add, 1, a); return; }
    if (e.target.closest("[data-reset]")) { Object.assign(state, { cat: "all", price: 0, q: "" }); $("[data-search]").value = ""; renderCats(); renderGrid(); }
  });
  $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  let qTimer;
  $("[data-search]").addEventListener("input", (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = e.target.value;
      if (state.q) state.cat = "all";
      renderCats(); renderGrid();
      const shop = $("#shop");
      if (state.q && shop.getBoundingClientRect().top > innerHeight * 0.5) shop.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }, 180);
  });

  /* ── Cart ─────────────────────────────── */
  const drawer = $("[data-cart]");
  const scrim = $("[data-scrim]");
  let lastFocus = null;
  let checkoutOpen = false;

  function saveCart() { store.set("mp-cart", Object.fromEntries(cart)); }
  function addToCart(id, n = 1, btn) {
    cart.set(id, (cart.get(id) || 0) + n);
    saveCart();
    renderCart();
    if (btn && btn.matches(".btn")) { btn.classList.add("is-added"); btn.textContent = t("added"); }
    const cb = $(".cart-btn");
    cb.classList.remove("is-bump"); void cb.offsetWidth; cb.classList.add("is-bump");
    toast(t("toastAdd", pname(byId[id])));
  }
  function renderCart() {
    const ids = [...cart.keys()];
    const n = ids.reduce((s, id) => s + cart.get(id), 0);
    const total = ids.reduce((s, id) => s + cart.get(id) * byId[id].price, 0);
    const badge = $("[data-cart-count]");
    badge.hidden = n === 0;
    badge.textContent = n;
    $("[data-cart-items]").innerHTML = ids.map((id) => {
      const p = byId[id];
      return `<li class="line"><img src="${img(id)}" alt="" width="64" height="64">
        <div><p class="line__name">${pname(p)}</p><p class="line__price">${money(p.price)}</p></div>
        <div class="qty"><button type="button" data-dec="${id}" aria-label="−"><svg aria-hidden="true"><use href="#i-minus"/></svg></button><span>${cart.get(id)}</span><button type="button" data-inc="${id}" aria-label="+"><svg aria-hidden="true"><use href="#i-plus"/></svg></button></div></li>`;
    }).join("");
    const empty = n === 0;
    $("[data-cart-empty]").hidden = !empty;
    $("[data-cart-foot]").hidden = empty;
    $("[data-cart-items]").hidden = empty;
    if (empty) { checkoutOpen = false; $("[data-checkout]").hidden = true; }
    $("[data-cart-total]").textContent = money(total);
    $("[data-free-text]").textContent = total >= FREE_FROM ? t("freeOk") : t("freeLeft", FREE_FROM - total);
    $("[data-free-bar]").style.width = `${clamp(total / FREE_FROM, 0, 1) * 100}%`;
    $("[data-checkout-btn]").textContent = checkoutOpen ? t("confirm") : t("checkout");
  }
  drawer.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc) { cart.set(inc.dataset.inc, cart.get(inc.dataset.inc) + 1); }
    else if (dec) { const id = dec.dataset.dec; const v = cart.get(id) - 1; v > 0 ? cart.set(id, v) : cart.delete(id); renderGrid(); }
    else return;
    saveCart(); renderCart();
  });
  function openCart() {
    lastFocus = document.activeElement;
    $("[data-done]").hidden = true;
    scrim.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add("is-on"); drawer.classList.add("is-open"); });
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    drawer.focus();
  }
  function closeCart() {
    scrim.classList.remove("is-on");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    setTimeout(() => { scrim.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }
  $("[data-open-cart]").addEventListener("click", openCart);
  $$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));
  scrim.addEventListener("click", closeCart);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

  $("[data-checkout-btn]").addEventListener("click", () => {
    const form = $("[data-checkout]");
    if (!checkoutOpen) { checkoutOpen = true; form.hidden = false; renderCart(); form.elements.name.focus(); return; }
    const { name, phone, addr } = form.elements;
    const ok = { name: name.value.trim().length > 1, phone: phone.value.replace(/\D/g, "").length >= 9, addr: addr.value.trim().length > 3 };
    name.setAttribute("aria-invalid", String(!ok.name));
    phone.setAttribute("aria-invalid", String(!ok.phone));
    addr.setAttribute("aria-invalid", String(!ok.addr));
    if (!ok.name || !ok.phone || !ok.addr) { $("[data-err]").textContent = t("formErr"); (ok.name ? ok.phone ? addr : phone : name).focus(); return; }
    $("[data-err]").textContent = "";
    cart.clear(); saveCart(); form.reset(); checkoutOpen = false; form.hidden = true;
    renderCart(); renderGrid();
    $("[data-cart-empty]").hidden = true;
    $("[data-done]").hidden = false;
  });

  let toastTimer;
  function toast(html) {
    const el = $("[data-toast]");
    el.innerHTML = html;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  /* ── Hero spec cards ─────────────────────────────── */
  const HERO = [
    { id: "chips-500", tone: "lime", x: 3, y: 7, r: -3 },
    { id: "table-oval", tone: "white", x: 23, y: 30, r: 2 },
    { id: "dealer-button", tone: "ink", x: 42, y: 5, r: -1.5 },
    { id: "copag", tone: "steel", x: 61, y: 33, r: 1.5 },
    { id: "ceramic-300", tone: "lime", x: 73, y: 4, r: 2.5 },
  ];
  function renderHero() {
    $("[data-hero-cards]").innerHTML = HERO.map((h, i) => {
      const p = byId[h.id];
      return `<article class="spec spec--${h.tone}" style="--x:${h.x}%;--y:${h.y}%;--r:${h.r}deg" data-drag>
        <div class="spec__head"><b>${String(i + 1).padStart(2, "0")}.</b><span>FIG. ${String(i + 1).padStart(2, "0")}</span></div>
        <h3 class="spec__name">${pname(p)}</h3>
        <div class="spec__img"><img src="${img(p.id)}" alt="" draggable="false"></div>
        <p>${p.spec}</p>
        <div class="spec__foot"><b>${money(p.price)}</b><button type="button" class="spec__add" data-add="${p.id}" aria-label="${t("add")}: ${pname(p)}"><svg aria-hidden="true"><use href="#i-plus"/></svg></button></div>
      </article>`;
    }).join("");
    $("[data-hero-index]").innerHTML = CATS[0].children.concat(CATS[1].children[0]).map((c, i) => `<li><button type="button" data-cat-jump="${c.id}"><i>${String(i + 1).padStart(2, "0")}.</i><span>${cname(c)}</span></button></li>`).join("");
    bindDrag();
  }
  let zTop = 10;
  function bindDrag() {
    $$("[data-drag]").forEach((card) => {
      let sx, sy, ox = 0, oy = 0, on = false, moved = false;
      card.addEventListener("pointerdown", (e) => {
        if (isMobile() || e.button !== 0 || e.target.closest("button")) return;
        on = true; moved = false;
        card.setPointerCapture(e.pointerId);
        card.classList.add("is-drag");
        card.style.zIndex = ++zTop;
        sx = e.clientX - ox; sy = e.clientY - oy;
      });
      card.addEventListener("pointermove", (e) => {
        if (!on) return;
        ox = e.clientX - sx; oy = e.clientY - sy; moved = true;
        card.style.setProperty("--dx", `${ox}px`);
        card.style.setProperty("--dy", `${oy}px`);
      });
      const end = () => { on = false; card.classList.remove("is-drag"); };
      card.addEventListener("pointerup", end);
      card.addEventListener("pointercancel", end);
    });
    if (!reduced && !bindDrag.done) {
      bindDrag.done = true;
      $$("[data-drag]").forEach((c, i) => c.animate(
        [{ opacity: 0, translate: "0 70px" }, { opacity: 1, translate: "0 0" }],
        { duration: 1000, delay: 120 + i * 110, easing: "cubic-bezier(.2,.7,.1,1)", fill: "backwards" }
      ));
    }
  }

  /* ── All-in tiles ─────────────────────────────── */
  const TILES = [
    { id: "table-octagon", l: 5, t: 6, w: "clamp(140px,17vw,280px)", s: -.4 },
    { q: "Royal flush", d: "კარტი, რომელიც 10 000 დარიგებას უძლებს.", l: 68, t: 5, w: "clamp(200px,20vw,300px)", s: .25 },
    { id: "dice", l: 82, t: 30, w: "clamp(110px,12vw,200px)", s: -.55 },
    { id: "chips-200", l: 20, t: 52, w: "clamp(120px,13vw,220px)", s: .45 },
    { id: "nardi", l: 4, t: 76, w: "clamp(130px,15vw,240px)", s: -.2 },
    { id: "shuffler", l: 74, t: 64, w: "clamp(140px,15vw,250px)", s: .35 },
    { q: "11.5 გ", d: "ჩიპის წონა, რომელსაც ხელი იცნობს.", l: 42, t: 84, w: "clamp(180px,18vw,260px)", s: -.3 },
  ];
  $("[data-allin-tiles]").innerHTML = TILES.map((x) => x.id
    ? `<div class="ftile" style="--l:${x.l}%;--t:${x.t}%;--w:${x.w}" data-s="${x.s}"><img src="${img(x.id)}" alt="" loading="lazy"></div>`
    : `<div class="ftile ftile--quote" style="--l:${x.l}%;--t:${x.t}%;--w:${x.w}" data-s="${x.s}"><b>${x.q}</b>${x.d}</div>`).join("");

  /* ── Table set hotspots ─────────────────────────────── */
  const SET = [
    { id: "chips-500", k: "Chip case", x: 16.5, y: 46 },
    { id: "nardi", k: "Backgammon", x: 51, y: 22 },
    { id: "ceramic-300", k: "Ceramic chips", x: 44, y: 47 },
    { id: "copag", k: "Plastic cards", x: 50, y: 74 },
    { id: "dealer-button", k: "Dealer button", x: 72, y: 72 },
    { id: "shuffler", k: "Shuffler", x: 82.5, y: 40 },
  ];
  const canvas = $("[data-set-canvas]");
  const setList = $("[data-set-list]");
  function renderSet() {
    $$(".tag", canvas).forEach((x) => x.remove());
    SET.forEach((s, i) => {
      const p = byId[s.id];
      const tag = document.createElement("button");
      tag.type = "button";
      tag.className = "tag";
      tag.style.setProperty("--lx", `${s.x}%`);
      tag.style.setProperty("--ly", `${s.y}%`);
      tag.setAttribute("aria-label", `${pname(p)}, ${money(p.price)}`);
      tag.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span><span>${s.k}</span><span class="tag__pop" aria-hidden="true"><img src="${img(p.id)}" alt=""><span><b>${pname(p)}</b>${money(p.price)}</span></span>`;
      tag.addEventListener("mouseenter", () => setOn(i));
      tag.addEventListener("focus", () => setOn(i));
      tag.addEventListener("click", () => { if (tag.classList.contains("is-on") && !isMobile()) addToCart(s.id); else setOn(i); });
      canvas.appendChild(tag);
    });
    setList.innerHTML = SET.map((s, i) => `<li><button type="button" data-set-i="${i}"><span>${String(i + 1).padStart(2, "0")}. ${pname(byId[s.id])}</span><span>${money(byId[s.id].price)}</span></button></li>`).join("");
    $("[data-set-total]").textContent = money(SET.reduce((a, s) => a + byId[s.id].price, 0));
  }
  function setOn(i) {
    $$(".tag", canvas).forEach((x, k) => x.classList.toggle("is-on", k === i));
    $$("button", setList).forEach((x, k) => x.classList.toggle("is-on", k === i));
  }
  setList.addEventListener("mouseover", (e) => { const b = e.target.closest("[data-set-i]"); if (b) setOn(+b.dataset.setI); });
  setList.addEventListener("click", (e) => { const b = e.target.closest("[data-set-i]"); if (b) addToCart(SET[+b.dataset.setI].id); });
  canvas.addEventListener("mouseleave", () => setOn(-1));
  $("[data-add-set]").addEventListener("click", () => {
    SET.forEach((s) => cart.set(s.id, (cart.get(s.id) || 0) + 1));
    saveCart(); renderCart(); renderGrid(); toast(t("toastSet"));
  });

  /* ── Flashlight + steps ─────────────────────────────── */
  const order = $("#order");
  const flash = $("[data-flash]");
  const visual = $(".order__visual");
  let pointerSeen = false;
  flash.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointerSeen = true;
    const v = visual.getBoundingClientRect();
    flash.style.setProperty("--mx", `${e.clientX - v.left}px`);
    flash.style.setProperty("--my", `${e.clientY - v.top}px`);
  });
  let orderVisible = false;
  (function sweep(time) {
    if (orderVisible && !pointerSeen && !reduced) {
      const v = visual.getBoundingClientRect();
      flash.style.setProperty("--mx", `${v.width * (0.5 + 0.36 * Math.sin(time / 1400))}px`);
      flash.style.setProperty("--my", `${v.height * (0.5 + 0.28 * Math.sin(time / 950))}px`);
    }
    requestAnimationFrame(sweep);
  })(0);
  let step = -1;
  function setStep(s) {
    if (s === step) return;
    step = s;
    $$(".order__steps li").forEach((li, i) => li.classList.toggle("is-on", i === s));
  }

  /* ── Videos: play only while visible ─────────────────────────────── */
  const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting && !reduced) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { rootMargin: "200px" });
  $$("[data-video]").forEach((v) => vio.observe(v));

  /* ── Rail + scroll effects ─────────────────────────────── */
  const sections = $$("[data-rail]");
  const rail = $(".rail");
  sections.forEach(() => rail.appendChild(document.createElement("li")));
  const railItems = $$("li", rail);
  const allin = $(".allin");
  const sticky = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight), 0, .9999); };

  const top = $("[data-top]");
  let lastY = scrollY;
  function onScroll() {
    const vh = innerHeight;
    const y = scrollY;
    if (Math.abs(y - lastY) > 6) {
      top.classList.toggle("is-hidden", y > lastY && y > 240 && !drawer.classList.contains("is-open") && !top.contains(document.activeElement));
      lastY = y;
    }
    let cur = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= vh * .5) cur = i; });
    railItems.forEach((li, i) => { li.classList.toggle("is-on", i === cur); li.classList.toggle("is-past", i < cur); });

    const ar = allin.getBoundingClientRect();
    if (ar.bottom > 0 && ar.top < vh && !reduced) {
      const p = (vh - ar.top) / (vh + ar.height) - .5;
      $$(".ftile", allin).forEach((el) => el.style.setProperty("--py", `${p * +el.dataset.s * 900}px`));
    }
    const or = order.getBoundingClientRect();
    orderVisible = or.bottom > 0 && or.top < vh;
    setStep(Math.floor(sticky(order) * 3));
  }
  let ticking = false;
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ── Language ─────────────────────────────── */
  function renderAll() { applyLang(); renderCats(); renderGrid(); renderCart(); renderHero(); renderSet(); }
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("mp-lang", lang); renderAll(); }));

  $("[data-year]").textContent = new Date().getFullYear();
  renderAll();
  onScroll();
})();
