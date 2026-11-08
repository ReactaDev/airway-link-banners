import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { audience, authConfig, requiredPermission } from './authConfig';

export function AccessScreen({ message, action, actionLabel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function runAction() {
    setBusy(true);
    setError(null);
    try {
      await action();
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
          <button type="button" disabled={busy} onClick={runAction}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50">
            {actionLabel}
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
        const allowed = claims.iss === `https://${authConfig.domain}/` &&
          claims.sub === subject && audiences.includes(audience) &&
          Number.isFinite(expiresIn) && expiresIn > 0 &&
          Array.isArray(claims.permissions) && claims.permissions.includes(requiredPermission);

        window.clearTimeout(expiryTimer);
        setAccess({ subject, allowed });
        if (allowed) {
          expiryTimer = window.setTimeout(() => setAccess(null), expiresIn);
          refreshTimer = window.setTimeout(() => void checkPermission(true), Math.max(expiresIn - 30_000, expiresIn / 2));
        }
      } catch {
        if (!active) return;
        window.clearTimeout(expiryTimer);
        setAccess({ subject, allowed: false, checkFailed: true });
      }
    }
    void checkPermission();

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
      window.clearTimeout(expiryTimer);
    };
  }, [subject, isLoading, error, getAccessTokenSilently]);

  const signOut = () => logout({ logoutParams: { returnTo: authConfig.authorizationParams.redirect_uri } });
  if (isLoading) return <AccessScreen message="Checking your sign-in…" />;
  if (!isAuthenticated) {
    return <AccessScreen message={error?.message || 'Sign in with an authorized Airwaylink account to use the editor.'}
      action={() => loginWithRedirect()} actionLabel="Sign in with Auth0" />;
  }
  if (error || !subject || access?.checkFailed) {
    return <AccessScreen message="Your editor permission could not be verified. Sign out and try again."
      action={signOut} actionLabel="Sign out" />;
  }
  if (access?.subject !== subject) return <AccessScreen message="Checking your editor permission…" />;
  if (!access.allowed) {
    return <AccessScreen message={`Your account needs the ${requiredPermission} permission to use the editor.`}
      action={signOut} actionLabel="Sign out" />;
  }
  return children;
}
