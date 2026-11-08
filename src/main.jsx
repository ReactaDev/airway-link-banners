import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { StudioAccess, AccessScreen } from './StudioAccess';
import { authConfig } from './authConfig';
import './studio.css';

const Studio = lazy(() => import('./Studio'));

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    authorizationParams={authConfig.authorizationParams}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <StudioAccess>
      <Suspense fallback={<AccessScreen message="Loading the editor…" />}>
        <Studio />
      </Suspense>
    </StudioAccess>
  </Auth0Provider>,
);
