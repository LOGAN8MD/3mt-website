# 3MT Customer Website

Customer-facing React application for browsing 3MT products, viewing product details, managing a cart, and sending WhatsApp enquiries.

## Requirements

- Node.js 18 or newer
- npm
- A running `3mt_Server` instance for local product data

## Environment

The website reads the backend origin from `REACT_APP_API_BASE_URL`.

| Context | File or setting | Value |
| --- | --- | --- |
| Local development | `.env.development` | `http://localhost:8080` |
| Local production-build testing | Ignored `.env.production` | `https://threemt-server.onrender.com` |
| Netlify production | Environment variable | `REACT_APP_API_BASE_URL=https://threemt-server.onrender.com` |

`.env.production` is intentionally excluded from Git. Netlify must provide the production value through Site configuration > Environment variables. Do not include `/api` or a trailing slash. Create React App embeds environment values when the development server or production build starts, so restart or redeploy after changing them.

## Commands

```bash
npm install
npm start
npm run test:ci
npm run build
npm run verify
```

- `npm start` runs the local website at `http://localhost:3000`.
- `npm run test:ci` runs the non-watch utility tests.
- `npm run build` creates the production bundle.
- `npm run verify` runs tests followed by the production build.

## Deployment

The production site is deployed through Netlify from GitHub:

`https://3mt-machine-tools.netlify.app/`

Netlify should use:

- Build command: `npm run build`
- Publish directory: `build`
- Environment variable: `REACT_APP_API_BASE_URL=https://threemt-server.onrender.com`

The backend CORS allowlist must include the exact Netlify origin without a path or trailing slash.

## Main Source Areas

- `src/components/` - Shared navigation, product cards, and request states.
- `src/pages/` - Customer routes and workflows.
- `src/services/productApi.js` - Product API calls.
- `src/redux/` - Cart state.
- `src/utils/` - Axios, currency, and WhatsApp helpers.
