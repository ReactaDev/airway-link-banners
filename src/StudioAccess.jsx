import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { audience, authConfig, requiredPermission } from './authConfig';

export function AccessScreen({ message, action, actionLabel, onSignOut }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function runAction(callback) {
    setBusy(true);
    setError(null);
    try {
      await callback();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-5">
      <section className="modal-container w-full max-w-md rounded-2xl p-6 text-center">
        <h1 className="modal-title font-hud text-xl font-bold">Airwaylink Banner Studio</h1>
        <p className="modal-muted mt-3 text-sm" role="status">{message}</p>
        {action && (
          <button type="button" disabled={busy} onClick={() => void runAction(action)}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50">
            {actionLabel}
          </button>
        )}
        {onSignOut && (
          <button type="button" disabled={busy} onClick={() => void runAction(onSignOut)}
            className="ml-3 mt-5 px-2 py-2 text-sm underline disabled:opacity-50">
            Sign out
          </button>
        )}
        {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
      </section>
    </main>
  );
}

export function StudioAccess({ children }) {
  const { isLoading, isAuthenticated, user, error, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
  const subject = isAuthenticated ? user?.sub : undefined;
  const [access, setAccess] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!subject || isLoading || error) return;

    let active = true;
    let refreshTimer;
    let expiryTimer;
    async function checkPermission(refresh = false) {
      try {
        const token = await getAccessTokenSilently(refresh ? { cacheMode: 'off' } : undefined);
        if (!active) return;

        // The token comes from the Auth0 SDK for the configured API.
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), char => char.charCodeAt(0))));
        const expiresIn = claims.exp * 1000 - Date.now();
        const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
        window.clearTimeout(expiryTimer);

        let reason;
        if (!audiences.includes(audience)) {
          reason = `Auth0 returned an access token for a different API. The editor expects ${audience}.`;
        } else if (claims.iss !== `https://${authConfig.domain}/` || claims.sub !== subject ||
          !Number.isFinite(expiresIn) || expiresIn <= 0) {
          reason = 'The Auth0 access token could not be verified for this session.';
        } else if (!Array.isArray(claims.permissions)) {
          reason = 'Auth0 did not include a permissions list. Enable RBAC and Add Permissions in the Access Token for the editor API.';
        } else if (!claims.permissions.includes(requiredPermission)) {
          reason = `Auth0 did not include ${requiredPermission} for the account you signed in with.`;
        }

        setAccess({ subject, reason });
        if (!reason) {
          expiryTimer = window.setTimeout(() => setAccess({ subject, reason: 'The Auth0 access token expired.' }), expiresIn);
          refreshTimer = window.setTimeout(() => void checkPermission(true), Math.max(expiresIn - 30_000, expiresIn / 2));
        }
      } catch {
        if (!active) return;
        window.clearTimeout(expiryTimer);
        setAccess({ subject, reason: 'Could not get an access token from Auth0. If retrying fails, sign out and sign in again.' });
      }
    }
    void checkPermission(retryCount > 0);

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
      window.clearTimeout(expiryTimer);
    };
  }, [subject, isLoading, error, getAccessTokenSilently, retryCount]);

  const signOut = () => logout({ logoutParams: { returnTo: authConfig.authorizationParams.redirect_uri } });
  if (isLoading) return <AccessScreen message="Checking your sign-in…" />;
  if (!isAuthenticated) {
    return <AccessScreen message={error?.message || 'Sign in with an authorized Airwaylink account to use the editor.'}
      action={() => loginWithRedirect()} actionLabel="Sign in with Auth0" />;
  }
  if (error || !subject) {
    return <AccessScreen message="Your editor permission could not be verified. Sign out and try again."
      action={signOut} actionLabel="Sign out" />;
  }
  if (access?.subject !== subject) return <AccessScreen message="Checking your editor permission…" />;
  if (access.reason) {
    return <AccessScreen message={access.reason} action={() => {
      setAccess(null);
      setRetryCount(count => count + 1);
    }} actionLabel="Recheck access" onSignOut={signOut} />;
  }
  return children;
}
