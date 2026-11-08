# Airwaylink Banner Studio

React and Vite version of Airwaylink Banner Studio v0.08. The original canvas renderer, controls, airline artwork, offline airport lookup, local profile and logo storage, and 5664 × 2500 JPEG export are included.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm start
```

Open [http://localhost:5173/](http://localhost:5173/). Use `npm run build` to produce the static application in `dist/`, or `npm run preview` to serve that build locally on port 4173.

## Auth0

The editor requires an Auth0 session and the `use.banner_editor` permission. The studio loads the editor only after it finds the permission in the access token for the configured API.

1. In **Applications → APIs**, open the API that defines `use.banner_editor`. Enable **RBAC** and **Add Permissions in the Access Token**. Assign the permission to the appropriate role and assign that role to the users who should have access. [Auth0 RBAC setup](https://support.auth0.com/center/s/article/How-to-Add-the-Permissions-Claim-to-an-Access-Token)
2. The default API Identifier is `https://api.airwaylink.org`. The app uses the original Airwaylink Auth0 domain and client ID. For a different deployment, copy `.env.example` to `.env.local` and set the appropriate values, then restart the dev server or rebuild.
3. In the Auth0 SPA settings, add `http://localhost:5173/` to **Allowed Callback URLs** and **Allowed Logout URLs**, and add `http://localhost:5173` to **Allowed Web Origins**. Register the corresponding URLs for preview or production. [Auth0 SPA configuration](https://auth0.com/blog/adding-google-login-to-react-app-with-auth0/)

Deploy the contents of `dist/`. The gate controls access through the React UI. The renderer runs locally in the browser, so enforcing access to the bundle itself requires an authenticated server.

## Existing browser data

The React version retains the original localStorage keys and IndexedDB schema. Existing settings, profiles, and logos are available when the React app is served from the same origin and opened in the same browser profile.
# airway-link-banners
