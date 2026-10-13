/* mypoker.ge — shared: language, cart, smooth scroll, rail, helpers. Exposes window.MP. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => matchMedia("(max-width: 760px)").matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
  };
  const PRODUCTS = window.PRODUCTS;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const img = (id) => `assets/img/p/${id}.webp`;
  const money = (n) => `${n.toLocaleString("en-US")} ₾`;
  const FREE_FROM = 80;

  /* ── language ─────────────────────────────── */
  let lang = store.get("mp-lang", "ka");
  const T = {
    ka: {
      catalog: "კატალოგი", cart: "კალათა", scroll: "(scroll down)", add: "კალათაში", added: "დამატებულია",
      cartEmpty: "კალათა ცარიელია.", toCatalog: "კატალოგის ნახვა", total: "ჯამი", checkout: "შეკვეთის გაფორმება", confirm: "შეკვეთის დადასტურება",
      fName: "სახელი", fPhone: "ტელეფონი", fAddr: "მისამართი", formErr: "შეავსე სახელი, სწორი ნომერი და მისამართი.",
      doneTitle: "შეკვეთა მიღებულია.", doneText: "15 წუთში დაგირეკავთ დასადასტურებლად.",
      freeLeft: (n) => `კიდევ ${n} ₾ და მიწოდება თბილისში უფასოა.`, freeOk: "მიწოდება თბილისში უფასოა.",
      inCart: (n) => `${n} კალათაშია`,
    },
    en: {
      catalog: "Catalog", cart: "Cart", scroll: "(scroll down)", add: "Add to cart", added: "Added",
      cartEmpty: "Your cart is empty.", toCatalog: "Browse the catalog", total: "Total", checkout: "Checkout", confirm: "Confirm order",
      fName: "Name", fPhone: "Phone", fAddr: "Address", formErr: "Enter your name, a valid number and an address.",
      doneTitle: "Order received.", doneText: "We will call within 15 minutes to confirm.",
      freeLeft: (n) => `${n} ₾ more for free delivery in Tbilisi.`, freeOk: "Delivery in Tbilisi is free.",
      inCart: (n) => `${n} is in your cart`,
    },
  };
  const listeners = [];
  const MP = {
    $, $$, reduced, isMobile, store, byId, img, money,
    get lang() { return lang; },
    t(k, ...a) { const v = (T[lang][k] ?? k); return typeof v === "function" ? v(...a) : v; },
    tr(o) { return o && typeof o === "object" ? (o[lang] ?? o.ka) : o; },
    pname(p) { return lang === "en" ? p.en : p.name; },
    onLang(fn) { listeners.push(fn); },
    extendT(dict) { for (const l in dict) Object.assign(T[l], dict[l]); },
  };
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-t]").forEach((el) => { const v = T[lang][el.dataset.t]; if (typeof v === "string") el.textContent = v; });
    $$("[data-lang]").forEach((b) => b.classList.toggle("is-on", b.dataset.lang === lang));
    listeners.forEach((fn) => fn(lang));
    renderCart();
  }
  MP.setLang = (l) => { lang = l; store.set("mp-lang", l); applyLang(); };
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => MP.setLang(b.dataset.lang)));

  /* ── text scramble (typewriter in the reference) ─────────────────────────────── */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#♠♦";
  MP.scramble = (el, text) => {
    if (!el) return;
    if (reduced) { el.textContent = text; return; }
    const id = (el._sid = (el._sid || 0) + 1);
    let i = 0;
    const tick = () => {
      if (id !== el._sid) return;
      i += .45;
      const n = Math.floor(i);
      el.textContent = text.slice(0, n) + (n < text.length ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : "");
      if (n < text.length) requestAnimationFrame(tick);
    };
    tick();
  };

  /* ── smooth scroll + ScrollTrigger ─────────────────────────────── */
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!reduced && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    MP.lenis = lenis;
    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  MP.scrollTo = (target) => { if (MP.lenis) MP.lenis.scrollTo(target, { offset: 0 }); else $(target)?.scrollIntoView(); };

  /* ── rail ─────────────────────────────── */
  const rail = $(".rail");
  if (rail) {
    const secs = $$("[data-rail]");
    secs.forEach(() => rail.appendChild(document.createElement("li")));
    const items = $$("li", rail);
    const update = () => {
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * .5) cur = i; });
      items.forEach((li, i) => { li.classList.toggle("is-on", i === cur); li.classList.toggle("is-past", i < cur); });
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ── cart ─────────────────────────────── */
  const cart = new Map(Object.entries(store.get("mp-cart", {})).filter(([id]) => byId[id]));
  const drawer = $("[data-cart]");
  const scrim = $("[data-scrim]");
  let checkoutOpen = false;
  let lastFocus = null;
  const save = () => store.set("mp-cart", Object.fromEntries(cart));
  MP.cart = cart;
  MP.add = (id, n = 1, silent) => {
    cart.set(id, (cart.get(id) || 0) + n);
    save(); renderCart();
    if (!silent) MP.toast(MP.t("inCart", MP.pname(byId[id])));
    document.dispatchEvent(new CustomEvent("cart:change"));
  };
  function renderCart() {
    const ids = [...cart.keys()];
    const n = ids.reduce((s, id) => s + cart.get(id), 0);
    const total = ids.reduce((s, id) => s + cart.get(id) * byId[id].price, 0);
    $$("[data-cart-n]").forEach((el) => { el.textContent = n; });
    if (!drawer) return;
    $("[data-cart-items]", drawer).innerHTML = ids.map((id) => `<li class="line"><img src="${img(id)}" alt="" width="58" height="58">
      <div><p class="line__n">${MP.pname(byId[id])}</p><p class="line__p">${money(byId[id].price)}</p></div>
      <div class="qty"><button type="button" data-dec="${id}" aria-label="−">−</button><span>${cart.get(id)}</span><button type="button" data-inc="${id}" aria-label="+">+</button></div></li>`).join("");
    const empty = n === 0;
    $("[data-cart-empty]", drawer).hidden = !empty || !$("[data-done]", drawer).hidden;
    $("[data-cart-foot]", drawer).hidden = empty;
    if (empty) { checkoutOpen = false; $("[data-checkout]", drawer).hidden = true; }
    $("[data-cart-total]", drawer).textContent = money(total);
    $("[data-free-text]", drawer).textContent = total >= FREE_FROM ? MP.t("freeOk") : MP.t("freeLeft", FREE_FROM - total);
    $("[data-free-bar]", drawer).style.transform = `scaleX(${Math.min(1, total / FREE_FROM)})`;
    $("[data-checkout-btn]", drawer).textContent = checkoutOpen ? MP.t("confirm") : MP.t("checkout");
  }
  MP.renderCart = renderCart;
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
      if (inc) cart.set(inc.dataset.inc, cart.get(inc.dataset.inc) + 1);
      else if (dec) { const id = dec.dataset.dec, v = cart.get(id) - 1; v > 0 ? cart.set(id, v) : cart.delete(id); }
      else return;
      save(); renderCart(); document.dispatchEvent(new CustomEvent("cart:change"));
    });
    const open = () => {
      lastFocus = document.activeElement;
      $("[data-done]", drawer).hidden = true;
      renderCart();
      scrim.hidden = false;
      requestAnimationFrame(() => { scrim.classList.add("is-on"); drawer.classList.add("is-open"); });
      drawer.setAttribute("aria-hidden", "false");
      MP.lenis?.stop();
      drawer.focus();
    };
    const close = () => {
      scrim.classList.remove("is-on"); drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      MP.lenis?.start();
      setTimeout(() => { scrim.hidden = true; }, 300);
      lastFocus?.focus();
    };
    MP.openCart = open;
    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", open));
    $$("[data-close-cart]").forEach((b) => b.addEventListener("click", close));
    scrim.addEventListener("click", close);
    addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) close(); });
    $("[data-checkout-btn]", drawer).addEventListener("click", () => {
      const form = $("[data-checkout]", drawer);
      if (!checkoutOpen) { checkoutOpen = true; form.hidden = false; renderCart(); form.elements.name.focus(); return; }
      const { name, phone, addr } = form.elements;
      const ok = [name.value.trim().length > 1, phone.value.replace(/\D/g, "").length >= 9, addr.value.trim().length > 3];
      [name, phone, addr].forEach((el, i) => el.setAttribute("aria-invalid", String(!ok[i])));
      if (ok.includes(false)) { $("[data-err]", drawer).textContent = MP.t("formErr"); [name, phone, addr][ok.indexOf(false)].focus(); return; }
      $("[data-err]", drawer).textContent = "";
      cart.clear(); save(); form.reset(); checkoutOpen = false; form.hidden = true;
      $("[data-done]", drawer).hidden = false;
      renderCart();
      document.dispatchEvent(new CustomEvent("cart:change"));
    });
  }

  let toastT;
  MP.toast = (msg) => {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("is-on"), 2000);
  };

  // any [data-add] anywhere adds to cart
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]");
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    MP.add(a.dataset.add);
  });

  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  window.MP = MP;
  document.addEventListener("DOMContentLoaded", applyLang);
})();
