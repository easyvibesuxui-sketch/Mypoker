# MyPoker — redesign

Static site (HTML / CSS / vanilla JS), no build step.

```
index.html      markup + content (Georgian)
css/style.css   design tokens, layout, responsive rules
js/main.js      interactions (drag cards, sticky scroll phases, parallax,
                tournaments, table hotspots, flashlight, booking form)
```

Run locally: `python3 -m http.server` and open http://localhost:8000.

## Where to edit content
- Tournaments: `TOURS` array in `js/main.js`
- Hand-anatomy cards and text: `HAND` in `js/main.js`
- Table inventory labels: `ITEMS` in `js/main.js`
- Join steps: `STEPS` in `js/main.js`
- Address, email, social links: footer in `index.html`

## Not wired yet
- The booking form only validates and shows a thank-you message. Hook it to
  an email service or backend before going live.
- Address, social links and tournament data are placeholders.
