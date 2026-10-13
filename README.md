# mypoker.ge — redesign

Static site, no build step. Two pages:

- `index.html`: home, built scene by scene after the reference video
  (draggable "LOG" field, Game Night Chain with particle dissolve, lime-smoke
  Effects, All-in parallax collage, Setup Archives, Table Kit labels,
  flashlight Game Procedures).
- `catalog.html`: full catalogue with a sticky filter bar on top
  (category, price, search, sort), Flip-animated grid, quick view and cart.

```
css/base.css      tokens, HUD, cart drawer (shared)
css/home.css      home scenes
css/catalog.css   catalogue
js/products.js    categories and products (edit prices and names here)
js/common.js      language, cart, smooth scroll (Lenis + GSAP ScrollTrigger)
js/home.js        home interactions
js/catalog.js     filters, grid animation, quick view
assets/img/p/     product cut-outs on white (Kling AI)
assets/img/...    lifestyle, setups, steps, scene (Kling AI)
assets/video/     lime smoke, shuffle, all-in (Kling AI)
assets/vendor/    gsap, ScrollTrigger, Flip, lenis (bundled locally)
```

Deployed to GitHub Pages by `.github/workflows/pages.yml` on pushes to `main`.

## Not wired yet
- Checkout validates the form and shows a confirmation, but does not send the
  order anywhere. Connect it to email, a CRM or the shop backend.
- Products not visible in the old page screenshot are placeholders.
