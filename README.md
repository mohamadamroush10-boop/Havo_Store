# Reda Store

A responsive React storefront with English, Turkish, and Arabic interfaces, RTL
support, persistent cart and favorites, and light and dark themes.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build, `npm run preview` to serve
that build locally, `npm run lint` to run Oxlint, and `npm test` to run the
Redux and translation checks. Use Node.js 20.19+ or 22.12+.

## Project structure

- `src/pages` contains route-level storefront pages.
- `src/components` contains shared navigation, layout, and product UI.
- `src/store` contains the Redux Toolkit store, local cart/preferences slices,
  and RTK Query endpoints.
- `src/i18n.js` initializes i18next with the language resources in
  `src/locales/en.json`, `src/locales/tr.json`, and `src/locales/ar.json`.
- `src/utils` contains currency formatting and product-sharing helpers.
- `tests` contains focused checks for local Redux behavior and translation
  consistency.

Redux persists cart items, favorites, language, and theme in browser local
storage. RTK Query owns remote data and its request cache.

## Demo API limitations

Product, category, and article data are read from the public DummyJSON API.
Those endpoints provide demo content, not this store's inventory or order
system. The project has no backend for authentication, checkout, payment,
placing orders, or contact-message delivery. The cart is saved only in the
current browser; the disabled checkout and contact notices are intentional.
Remote product and article text is supplied by the demo API and may remain in
English even when the interface is set to Turkish or Arabic.

## Environment

The storefront does not require environment variables. Remote product and
article requests use the public DummyJSON service in `src/store/api.js`.

## Manual checks

1. Change languages in the header; select Arabic and confirm RTL, then select
   Turkish or English and confirm LTR.
2. Switch themes and reload; confirm the selected theme is retained.
3. Search for a product, filter by category or maximum price, change sorting,
   and use "Load more products" when available.
4. Add a product to the cart and favorites, change its quantity, remove it,
   then reload to confirm local persistence.
5. Try a contact form submission and confirm it clearly explains that no
   message service is configured.
