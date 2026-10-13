/* Catalogue data. Prices in GEL. Images live in assets/img/products/. */
window.CATEGORIES = [
  { id: "poker", name: "პოკერი", en: "Poker", children: [
    { id: "cards", name: "კარტები", en: "Cards" },
    { id: "chips", name: "ჩიპები", en: "Chips" },
    { id: "tables", name: "მაგიდები", en: "Tables" },
    { id: "accessories", name: "პოკერის აქსესუარები", en: "Accessories" },
  ] },
  { id: "games", name: "სამაგიდო თამაშები და აქსესუარები", en: "Board games", children: [
    { id: "nardi", en: "Handmade wooden backgammon", name: "ნარდი", en: "Backgammon" },
    { id: "domino", en: "Domino in leather case", name: "დომინო", en: "Domino" },
    { id: "chess", en: "Magnetic wooden chess", name: "ჭადრაკი", en: "Chess" },
    { id: "boardgames", name: "Board Games", en: "Board games" },
    { id: "other", name: "სხვა გასართობი", en: "Other" },
  ] },
];

window.PRODUCTS = [
  { id: "chips-500", en: "Pro poker chip set (500 pcs)", cat: "chips", name: "პროფესიონალური პოკერის ჩიპების ნაკრები (500ც)", spec: "11.5 გ, თიხის კომპოზიტი, ალუმინის კეისი", price: 389, old: 449, badge: "ბესტსელერი", rank: 1 },
  { id: "bicycle", en: "Bicycle original deck", cat: "cards", name: "Bicycle-ის ორიგინალი დასტა", spec: "სტანდარტული ინდექსი, ქაღალდის ბაზა", price: 19, rank: 4 },
  { id: "ceramic-300", en: "Ceramic casino chips (300 pcs, aluminium case)", cat: "chips", name: "კერამიკული კაზინოს ჩიპები (300ც, ალუმინის კეისით)", spec: "10 გ, სრული კერამიკა, ორმხრივი ბეჭდვა", price: 549, badge: "პრემიუმი", rank: 2 },
  { id: "copag", en: "Copag 100% plastic cards (2 decks)", cat: "cards", name: "Copag-ის 100% პლასტიკის კარტი (2 დასტა)", spec: "100% პლასტიკი, წყალგამძლე", price: 69, rank: 3 },
  { id: "table-oval", en: "Oval Hold'em table (8 players)", cat: "tables", name: "ჰოლდემის ოვალური მაგიდა (8 მოთამაშე)", spec: "213 × 107 სმ, მწვანე მაუდი, მუხის ჩარჩო", price: 1890, badge: "ახალი", rank: 5 },
  { id: "table-top", en: "Folding poker table top (10 players)", cat: "tables", name: "დასაკეცი პოკერის მაგიდის ზედაპირი (10 მოთამაშე)", spec: "180 × 90 სმ, ჩანთით", price: 649, rank: 7 },
  { id: "table-octagon", en: "Octagon table with cup holders", cat: "tables", name: "რვაკუთხა მაგიდა ჭიქის სადგამებით", spec: "Ø 120 სმ, დასაკეცი ფეხები", price: 1290, rank: 8 },
  { id: "dealer-button", en: "Dealer button, handmade acrylic", cat: "accessories", name: "დილერის ღილაკი, ხელნაკეთი აკრილი", spec: "Ø 76 მმ, 12 მმ სისქე", price: 29, rank: 6 },
  { id: "jumbo-12", en: "Jumbo index cards (12 decks)", cat: "cards", name: "ჯამბო ინდექსის კარტი (12 დასტა)", spec: "დიდი ინდექსი, კლუბური ბლოკი", price: 149, rank: 11 },
  { id: "chips-200", en: "Chip set in wooden box (200 pcs)", cat: "chips", name: "ჩიპების ნაკრები ხის ყუთით (200ც)", spec: "13 გ, კაკლის ხის ყუთი", price: 159, rank: 9 },
  { id: "shuffler", en: "Automatic card shuffler", cat: "accessories", name: "ავტომატური კარტის შაფლერი", spec: "1–4 დასტა, ელემენტებზე", price: 119, rank: 10 },
  { id: "card-guard", en: "Steel card guards (2 pcs)", cat: "accessories", name: "კარტის დამცავი, ლითონის (2ც)", spec: "Ø 40 მმ, მძიმე ფოლადი", price: 25, rank: 12 },
  { id: "nardi", cat: "nardi", name: "ხის ნარდი, ხელნაკეთი", spec: "60 × 30 სმ, კაკლის ხე, ინკრუსტაცია", price: 220, rank: 13 },
  { id: "domino", cat: "domino", name: "დომინო ტყავის ქეისში", spec: "28 ქვა, აკრილი", price: 45, rank: 14 },
  { id: "chess", cat: "chess", name: "ხის ჭადრაკი, მაგნიტური", spec: "40 × 40 სმ, დასაკეცი დაფა", price: 95, rank: 15 },
  { id: "boardgame", en: "Strategy board game", cat: "boardgames", name: "სტრატეგიული სამაგიდო თამაში", spec: "2–6 მოთამაშე, 10+", price: 89, rank: 16 },
  { id: "dice", en: "Dice set (25 pcs)", cat: "other", name: "კამათლის ნაკრები (25ც)", spec: "16 მმ, ხუთი ფერი", price: 15, rank: 17 },
];
