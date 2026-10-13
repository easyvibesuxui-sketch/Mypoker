# mypoker.ge — redesign

Static shop page (HTML / CSS / vanilla JS), no build step. Deployed to
GitHub Pages by `.github/workflows/pages.yml` on every push.

```
index.html          markup (Georgian, with EN toggle)
css/style.css       design tokens, layout, responsive rules
js/products.js      catalogue: categories and 17 products (names, specs, prices)
js/main.js          catalogue filters/sort/search, cart, hero drag cards,
                    table-set hotspots, flashlight steps, i18n
assets/img/         product photos and scene (generated with Kling AI)
assets/video/       lime-smoke and card-shuffle loops (generated with Kling AI)
```

Run locally: `python3 -m http.server` and open http://localhost:8000.

## Editing
- Products and prices: `js/products.js`. Images are `assets/img/products/<id>.webp`.
- Interface text (KA/EN): the `T` dictionary at the top of `js/main.js`.
- Hero cards: `HERO`; table-set labels: `SET` (positions in % of the image).

## Not wired yet
- Checkout only validates the form and shows a confirmation. Connect it to
  email, a CRM or the existing mypoker.ge backend before going live.
- The 9 products that were not visible in the old page screenshot are
  placeholders; replace them with the real catalogue.
