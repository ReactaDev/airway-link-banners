import { useState } from 'react';
import { Account } from './Account';
import { TutorialModal } from './TutorialModal';
import airwaylinkLogo from './assets/airwaylink-logo.png';

export function StudioHeader() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  return (
    <header className="h-14 border-b pr-5 flex items-center justify-between shrink-0 z-30 transition-colors duration-150">
      <div className="w-88 md:w-96 flex items-center justify-center shrink-0 px-4">
        <img
          src={airwaylinkLogo}
          alt="AirwayLink Banner Studio"
          className="h-6 sm:h-7 w-auto object-contain select-none header-logo transition-opacity duration-150"
        />
      </div>

      {/* Actions & Single Primary Download Banner Button */}
      <div className="flex items-center gap-2.5">
        {/* Refresh API Airlines Button & Error Pop-up */}
        <div className="relative" id="refreshApiContainer">
          <button
            id="btnRefreshApiData"
            type="button"
            title="Refresh Airlines API Data"
            className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm group"
          >
            {/* Recycle / Refresh Icon (Rotates on hover, spins when refreshing) */}
            <svg
              id="refreshApiIcon"
              className="w-4 h-4 transition-transform duration-500 ease-in-out group-hover:rotate-180 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span id="refreshApiLabel" className="sr-only">Refresh</span>
          </button>

          {/* Connection Error Pop-up Notice (Centered under button) */}
          <div
            id="apiErrorNotice"
            className="hidden absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border shadow-2xl p-3.5 z-50 text-xs font-sans transition-all animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-500 font-hud tracking-wide text-xs">NO CONNECTION</h4>
                  <button id="btnCloseApiError" type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-0.5 rounded transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p id="apiErrorMessage" className="text-[11px] mt-1 leading-snug">
                  Unable to reach Airlines API server. Please check your network connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button id="btnThemeToggle" type="button" title="Toggle Light/Dark Theme" className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm">
          <span id="themeIconContainer" className="flex items-center justify-center"></span>
        </button>

        {/* Tutorial / Parameter Guide Button (Regular character '?' fitted inside button) */}
        <button
          id="btnOpenTutorial"
          type="button"
          onClick={() => setIsTutorialOpen(true)}
          title="Studio Tutorial & Parameter Guide"
          className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm group"
          aria-label="Studio Tutorial and Parameter Guide"
        >
          <span className="w-4 h-4 flex items-center justify-center text-sm font-sans font-bold leading-none select-none transition-transform duration-200 group-hover:scale-110">
            ?
          </span>
        </button>

        {/* Account / User Profile */}
        <Account />

        {/* The Single Primary Download Banner Action */}
        <button id="btnTopExport" disabled className="px-4 py-2 font-bold text-xs tracking-wider uppercase rounded-lg shadow-md flex items-center gap-2 transition active:scale-95 disabled:cursor-not-allowed">
          <span id="exportBtnIcon">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
          <span id="exportBtnLabel">Download Banner</span>
        </button>
      </div>

      {/* Interactive In-App Tutorial Modal */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </header>
  );
}
