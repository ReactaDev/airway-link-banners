export const requiredPermission = 'use.banner_editor';
export const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim() || 'https://api.airwaylink.org';
const returnUrl = window.location.origin + window.location.pathname;

export const authConfig = {
  domain: (import.meta.env.VITE_AUTH0_DOMAIN?.trim() || 'auth.airwaylink.org')
    .replace(/^https?:\/\//i, '').replace(/\/.*$/, ''),
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID?.trim() || 'vdbVUbIALnMF4mGPcjN7TWCzqgLfneWN',
  authorizationParams: {
    redirect_uri: returnUrl,
    audience,
    scope: `openid profile email ${requiredPermission}`,
  },
};
