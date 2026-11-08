export function LogoWarning() {
  return (
    <div id="logoWarningModal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center hidden">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-7 max-w-sm w-full mx-4 shadow-2xl text-center space-y-5">
        {/* Icon badge */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
          ⚠️
        </div>

        {/* Header & Warning Text */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white font-hud tracking-wider uppercase">Replace Airline Logo</h3>

          <p className="text-xs text-slate-300 font-mono-avionics leading-relaxed">
            Are you sure you want to replace this logo? This will overwrite the current logo for:
          </p>

          {/* Airline Name on its own dedicated highlight card */}
          <div className="py-2.5 px-3 bg-slate-950/80 border border-amber-500/30 rounded-lg shadow-sm">
            <span id="warningAirlineName" className="text-amber-400 font-bold text-sm tracking-wide font-hud uppercase">ANZ VIRTUAL</span>
          </div>

          <p className="text-[11px] text-rose-400 font-mono-avionics font-semibold pt-1">
            This action cannot be undone.
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button id="btnCancelLogoUpload" type="button" className="py-2.5 px-4 tool-btn font-mono-avionics text-xs font-semibold rounded-lg hover:border-slate-500 transition">
            Cancel
          </button>
          <button id="btnProceedLogoUpload" type="button" className="py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-mono-avionics text-xs font-bold rounded-lg transition active:scale-95 shadow-md">
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export function AirlineProfiles() {
  return (
    <div id="airlineModal" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div className="modal-container rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">

        {/* Modal Header */}
        <div className="modal-header px-5 py-4 border-b flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-500/30 flex items-center justify-center modal-title">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold modal-title font-hud tracking-wider uppercase">Airline Profile Studio</h3>
              <p className="text-[10px] modal-muted font-mono-avionics">Add new virtual airlines or manage custom presets</p>
            </div>
          </div>
          <button id="btnCloseAirlineModal" type="button" className="modal-muted hover:opacity-100 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">

          {/* FORM: ADD NEW AIRLINE */}
          <div className="modal-subcard space-y-3.5 rounded-xl p-4 shadow-sm transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-hud font-bold modal-title flex items-center gap-1.5">
                <span>+</span> Add New Airline Profile
              </span>
              <span className="text-[9px] modal-muted font-mono-avionics uppercase">Saved to browser storage</span>
            </div>

            {/* Code & Full Name */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label className="text-[10px] uppercase font-mono-avionics panel-label block">Code / ICAO</label>
                <input id="inputNewAirlineCode" type="text" maxLength="6" placeholder="e.g. DLH" className="w-full mt-1 px-2.5 py-1.5 text-xs app-input uppercase font-mono-avionics font-bold tracking-wider" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-mono-avionics panel-label block">Full Display Name</label>
                <input id="inputNewAirlineName" type="text" placeholder="e.g. Lufthansa Virtual" className="w-full mt-1 px-2.5 py-1.5 text-xs app-input font-semibold" />
              </div>
            </div>

            {/* Suffix Text & Brand Color */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] uppercase font-mono-avionics panel-label block">Suffix Text</label>
                <input id="inputNewAirlineSuffix" type="text" defaultValue="Focus Airport" placeholder="Focus Airport" className="w-full mt-1 px-2.5 py-1.5 text-xs app-input font-medium" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono-avionics panel-label block">Brand Gradient Color</label>
                <div className="mt-1 flex items-center gap-1.5">
                  <input id="inputNewAirlineColor" type="color" defaultValue="#002b49" className="w-7 h-7 rounded border border-inherit cursor-pointer shrink-0 p-0 bg-transparent" />
                  <input id="inputNewAirlineColorHex" type="text" maxLength="7" defaultValue="#002B49" className="flex-1 px-2 py-1 text-xs app-input font-mono-avionics uppercase font-semibold" />
                </div>
              </div>
            </div>

            {/* Default Logo Height Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-mono-avionics panel-label">Default Logo Height</label>
                <span id="labelNewAirlineHeight" className="text-[10px] font-mono-avionics modal-title font-bold">160px</span>
              </div>
              <input id="rangeNewAirlineHeight" type="range" min="80" max="280" defaultValue="160" className="w-full mt-1" />
            </div>

            {/* Logo Upload (Optional) */}
            <div>
              <label className="text-[10px] uppercase font-mono-avionics panel-label block">Logo Graphic (PNG / SVG transparent recommended)</label>
              <div className="mt-1 flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-zinc-400/40 hover:border-zinc-500 rounded-lg cursor-pointer bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition group">
                  <svg className="w-4 h-4 modal-muted transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span id="labelNewAirlineLogoFile" className="text-xs font-mono-avionics modal-muted">Choose logo image...</span>
                  <input id="inputNewAirlineLogo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" />
                </label>
                <div id="previewNewAirlineLogoContainer" className="w-12 h-9 rounded border border-inherit bg-black/10 dark:bg-black/40 flex items-center justify-center p-1 shrink-0 overflow-hidden hidden">
                  <img id="imgNewAirlineLogoPreview" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <p className="text-[9px] modal-muted font-mono-avionics mt-1">If no logo is uploaded, Text Style mode will be used by default until a logo is added.</p>
            </div>

            {/* Add Airline Submit Button */}
            <div className="pt-1">
              <button id="btnSaveNewAirline" type="button" className="w-full py-2 px-4 tool-btn font-mono-avionics text-xs font-bold rounded-lg transition active:scale-95 shadow-md flex items-center justify-center gap-2">
                <span>✈</span> Save &amp; Add Airline Profile
              </button>
              <p id="msgNewAirlineError" className="text-[10px] text-rose-400 font-mono-avionics font-semibold mt-1.5 hidden text-center"></p>
            </div>
          </div>

          {/* LIST: EXISTING CUSTOM AIRLINES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono-avionics panel-label font-bold tracking-wider">Your Custom Profiles</span>
              <span id="customAirlinesCount" className="text-[10px] font-mono-avionics modal-muted">0 added</span>
            </div>

            <div id="customAirlinesList" className="space-y-1.5">
              {/* Populated dynamically via JS */}
              <div id="emptyCustomAirlinesMsg" className="py-6 text-center text-xs modal-muted font-mono-avionics border border-inherit rounded-xl modal-subcard">
                No custom airlines added yet. Create one above!
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer px-5 py-3 border-t flex items-center justify-end shrink-0 transition-colors">
          <button id="btnDoneAirlineModal" type="button" className="py-1.5 px-4 tool-btn font-mono-avionics text-xs font-semibold rounded-lg transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
