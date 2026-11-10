import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function Account() {
  const { user: profile, logout } = useAuth0();
  const [open, setOpen] = useState(false);
  const [actionError, setActionError] = useState(null);
  const container = useRef(null);

  useEffect(() => {
    if (!open) return;
    function closeOutside(event) {
      if (!container.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('click', closeOutside);
    return () => document.removeEventListener('click', closeOutside);
  }, [open]);

  async function performAction() {
    setOpen(false);
    setActionError(null);
    try {
      await logout({ logoutParams: { returnTo: window.location.origin + window.location.pathname } });
    } catch (failure) {
      setActionError(failure);
      setOpen(true);
    }
  }

  return (
    <div className="relative" id="auth0Container" ref={container}>
      <button id="btnAuth0" type="button" title="Auth0 Authentication" aria-expanded={open}
        aria-controls="auth0Dropdown" onClick={() => setOpen(!open)}
        className="px-2.5 py-1.5 rounded-lg border tool-btn flex items-center gap-2 text-xs font-mono-avionics transition active:scale-95 shadow-sm">
        <span id="auth0Avatar" className="w-5 h-5 rounded-full bg-zinc-600/30 flex items-center justify-center text-[10px] overflow-hidden font-bold">
          {profile?.picture ? (
            <img src={profile.picture} className="w-full h-full object-cover" alt="User" />
          ) : profile ? (
            (profile.name || 'P')[0].toUpperCase()
          ) : (
            <svg className="w-3.5 h-3.5 fill-current opacity-80" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          )}
        </span>
        <span id="auth0StatusLabel" className="font-semibold max-w-[110px] truncate">
          {profile?.name || profile?.nickname || 'Pilot'}
        </span>
      </button>

      <div id="auth0Dropdown" className={`${open ? '' : 'hidden '}absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border shadow-2xl p-4 z-50 transition-all font-sans text-xs`}>
        {profile && (
          <div id="auth0UserInfo" className="flex flex-col gap-2 pb-3 border-b mb-3">
            <div className="flex items-center gap-3">
              <img id="auth0UserPic" className="w-10 h-10 rounded-full border shadow-sm object-cover" src={profile.picture} alt="Avatar" />
              <div className="overflow-hidden">
                <div id="auth0UserName" className="font-bold text-sm truncate">{profile.name || profile.nickname || 'Authenticated Pilot'}</div>
                <div id="auth0UserEmail" className="text-xs text-zinc-400 truncate">{profile.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-500 font-mono-avionics mt-1">
              <span>● Authenticated via Auth0</span>
            </div>
          </div>
        )}
        {actionError && <p role="alert" className="mb-2 break-words text-red-500">{actionError.message}</p>}
        <div className="flex flex-col gap-2">
          <button id="btnAuth0Action" type="button" onClick={performAction}
            className="w-full py-2 px-3 rounded-lg font-bold text-center transition flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white shadow">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
