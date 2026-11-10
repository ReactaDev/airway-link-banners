import { Component, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { StudioAccess, AccessScreen } from './StudioAccess';
import { authConfig } from './authConfig';
import './studio.css';

const Studio = lazy(() => import('./Studio'));

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('Airwaylink Banner Studio caught an error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <AccessScreen
          message={`An unexpected error occurred: ${this.state.error?.message || this.state.error}`}
          action={() => window.location.reload()}
          actionLabel="Reload Studio"
        />
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
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
    </Auth0Provider>
  </ErrorBoundary>,
);
