import { Account } from './Account';

export function StudioHeader() {
  return (
    <header className="h-14 border-b px-5 flex items-center justify-between shrink-0 z-30 transition-colors duration-150">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-500/30 flex items-center justify-center text-current text-sm shadow-sm shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
        </div>
        <h1 className="text-base sm:text-lg font-bold tracking-wider font-hud text-zinc-900 dark:text-white flex items-center gap-2.5">
          Airwaylink Banner Studio
        </h1>
      </div>

      {/* Actions & Single Primary Download Banner Button */}
      <div className="flex items-center gap-2.5">
        <Account />

        {/* Light / Dark Mode Toggle Button */}
        <button id="btnThemeToggle" type="button" title="Toggle Light/Dark Theme" className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm">
          <span id="themeIconContainer" className="flex items-center justify-center"></span>
        </button>

        {/* Refresh Page Button */}
        <button id="btnRefreshPage" type="button" title="Refresh Studio" className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Add / Manage Custom Airlines Button */}
        <button id="btnOpenAirlineModal" type="button" title="Add / Manage Airline Profiles" className="p-2 rounded-lg border tool-btn flex items-center justify-center text-xs font-mono-avionics transition active:scale-95 shadow-sm group">
          <span className="airplane-add-icon"></span>
        </button>

        {/* The Single Primary Download Banner Action */}
        <button id="btnTopExport" disabled className="px-4 py-2 font-bold text-xs tracking-wider uppercase rounded-lg shadow-md flex items-center gap-2 transition active:scale-95 disabled:cursor-not-allowed">
          <span id="exportBtnIcon">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
          <span id="exportBtnLabel">Download Banner</span>
        </button>
      </div>
    </header>
  );
}
