import { APP_VERSION } from './version';

export function Workspace() {
  return (
    <div className="flex-1 flex overflow-hidden">

      {/* LEFT SIDEBAR: CONTROL TOWER */}
      <aside className="w-88 md:w-96 border-r flex flex-col shrink-0 overflow-hidden transition-colors duration-150">

        {/* NAVIGATION TABS (Fixed at top of sidebar, never shifted by scrollbar) */}
        <div className="h-10 border-b border-inherit text-xs font-hud px-2 flex items-center gap-1.5 shrink-0 z-20" id="tabBar">
          <button id="tabBtnAirline" className="flex-1 py-1 rounded-md text-white bg-[#242429] border border-white/10 font-bold transition text-xs font-hud shadow-sm">1. AIRLINE</button>
          <button id="tabBtnScenery" disabled title="Select an airline profile first to unlock" className="flex-1 py-1 rounded-md text-zinc-400 transition font-medium text-xs font-hud opacity-40 cursor-not-allowed pointer-events-none">2. BACKDROP</button>
          <button id="tabBtnText" disabled title="Select an airline profile first to unlock" className="flex-1 py-1 rounded-md text-zinc-400 transition font-medium text-xs font-hud opacity-40 cursor-not-allowed pointer-events-none">3. AIRPORT</button>
        </div>

        {/* SCROLLABLE TAB CONTENTS AREA */}
        <div className="flex-1 overflow-y-auto">

        {/* TAB 1: AIRLINE SELECTION & UNIFIED TOP HEADER */}
        <div id="tabContentAirline" className="p-4 space-y-3.5">

          <div className="p-3.5 rounded-lg panel-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-hud font-bold flex items-center gap-1.5">
                <span>✈</span> Select Virtual Airline
              </span>
              <span id="airlineBadge" className="text-[10px] text-slate-400 font-mono-avionics font-bold"></span>
            </div>

            {/* Airline Preset Dropdown */}
            <div>
              <label className="text-[10px] uppercase font-mono-avionics panel-label">AIRLINE PROFILE:</label>
              <select id="airlineDropdown" className="w-full mt-1 px-2.5 py-1.5 text-xs app-input font-semibold" defaultValue="">
                <option id="optSelectAirlinePlaceholder" value="" disabled hidden>Select Airline</option>
                <option id="optAirlineLoading" value="" disabled>Loading airlines from API...</option>
                {/* AUDIT NOTE: The "Custom" profile option is temporarily disabled and removed from this dropdown list. Underlying code and controls are retained for future re-enablement. */}
              </select>
            </div>

            {/* Airline Dependent Controls (Disabled until an airline is selected) */}
            <div id="airlineDependentControls" className="space-y-3 opacity-40 pointer-events-none transition-opacity duration-200">

            {/* CUSTOM PROFILE FEATURE TOGGLES (Blank Slate Controls) */}
            <div id="customTogglesPanel" className="pt-2 border-t border-inherit space-y-2 hidden">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Custom Profile Elements:</span>

              {/* Primary Master Toggles: Header Brand, Gradients, Text Box, ICAO & City */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <label className="flex items-center gap-1.5 p-1.5 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics font-bold">
                  <input type="checkbox" id="chkShowHeaderBrand" defaultChecked className="rounded scale-90" />
                  <span>Header Brand</span>
                </label>
                <label className="flex items-center gap-1.5 p-1.5 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics font-bold">
                  <input type="checkbox" id="chkShowGradients" defaultChecked className="rounded scale-90" />
                  <span>Gradients</span>
                </label>
                <label className="flex items-center gap-1.5 p-1.5 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics font-bold">
                  <input type="checkbox" id="chkEnableCustomBox" className="rounded scale-90" />
                  <span>Text Box</span>
                </label>
                <label className="flex items-center gap-1.5 p-1.5 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics font-bold">
                  <input type="checkbox" id="chkShowAirportText" defaultChecked className="rounded scale-90" />
                  <span>ICAO &amp; City</span>
                </label>
              </div>

              {/* Sub-Toggles for Header Brand Elements */}
              <div id="headerBrandSubToggles" className="pl-2 border-l-2 border-sky-500/40 space-y-1">
                <span className="text-[9px] font-mono-avionics uppercase panel-muted block">Header Brand Elements:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <label className="flex items-center gap-1.5 p-1 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics">
                    <input type="checkbox" id="chkShowAirlineName" defaultChecked className="rounded scale-90" />
                    <span>Airline Name</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-1 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics">
                    <input type="checkbox" id="chkShowSuffixText" defaultChecked className="rounded scale-90" />
                    <span>Activity Type</span>
                  </label>
                </div>
              </div>

              {/* Sub-Toggles for Gradient Elements */}
              <div id="gradientsSubToggles" className="pl-2 border-l-2 border-emerald-500/40 space-y-1">
                <span className="text-[9px] font-mono-avionics uppercase panel-muted block">Atmospheric Gradient Elements:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <label className="flex items-center gap-1.5 p-1 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics">
                    <input type="checkbox" id="chkShowTopGrad" defaultChecked className="rounded scale-90" />
                    <span>Top Gradient</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-1 rounded border border-inherit tool-btn cursor-pointer font-mono-avionics">
                    <input type="checkbox" id="chkShowBotGrad" defaultChecked className="rounded scale-90" />
                    <span>Bottom Gradient</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Header Brand Logo & Style Selection (Light vs Dark) */}
            <div id="headerBrandModeSection" className="pt-2 border-t border-inherit space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono-avionics panel-label">Header Logo style:</span>
              </div>

              {/* Vertical Stacked Logo Variant Cards (Click to switch Dark / Light) */}
              <div className="space-y-2">
                {/* Dark Version Card (Top, Default) */}
                <div
                  id="logoVariantCardDark"
                  className="h-16 rounded-lg border border-sky-500 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-800 ring-2 ring-sky-500 transition select-none group"
                  title="Click to select Dark Logo"
                >
                  <span id="labelLogoVariantDark" className="absolute top-1.5 left-2.5 text-[9px] font-mono-avionics uppercase font-bold tracking-wider text-slate-300 group-hover:text-white transition-colors">
                    Dark Version
                  </span>
                  <span id="badgeDarkActive" className="absolute top-1.5 right-2.5 flex items-center gap-1 text-[9px] font-mono-avionics font-bold text-sky-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> ACTIVE
                  </span>
                  <img
                    id="imgLogoVariantDark"
                    crossOrigin="anonymous"
                    className="max-h-11 max-w-[80%] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] hidden"
                    alt="Dark Logo"
                  />
                  <span id="noDarkLogoLabel" className="text-[10px] font-mono-avionics text-zinc-400 hidden">No Dark Logo</span>
                </div>

                {/* Light Version Card (Bottom) */}
                <div
                  id="logoVariantCardLight"
                  className="h-16 rounded-lg border border-slate-300 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-100 opacity-70 hover:opacity-100 transition select-none group"
                  title="Click to select Light Logo"
                >
                  <span id="labelLogoVariantLight" className="absolute top-1.5 left-2.5 text-[9px] font-mono-avionics uppercase font-bold tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
                    Light Version
                  </span>
                  <span id="badgeLightActive" className="absolute top-1.5 right-2.5 flex items-center gap-1 text-[9px] font-mono-avionics font-bold text-sky-600 hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> ACTIVE
                  </span>
                  <img
                    id="imgLogoVariantLight"
                    crossOrigin="anonymous"
                    className="max-h-11 max-w-[80%] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] hidden"
                    alt="Light Logo"
                  />
                  <span id="noLightLogoLabel" className="text-[10px] font-mono-avionics text-slate-500 hidden">No Light Logo</span>
                </div>
              </div>

              {/* Activity Type Input */}
              <div id="suffixTextInputSection">
                <label className="text-[10px] uppercase font-mono-avionics panel-label">ACTIVITY TYPE:</label>
                <input type="text" id="hdrSuffixText" defaultValue="Focus Airport" className="w-full px-2.5 py-1.5 text-xs app-input font-medium mt-1" />
              </div>
            </div>

            {/* Effects Section (Drop Shadow & Pure White) - Unlocked */}
            <div id="headerEffectsSection" className="pt-2 border-t border-inherit space-y-1.5">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Effects:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button id="btnToggleHdrShadow" type="button" className="py-1 px-1 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm" title="Toggle header legibility drop shadow">
                  Drop Shadow
                </button>
                <button id="btnToggleForceWhite" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Force logo to pure white silhouette">
                  Pure White
                </button>
              </div>
            </div>

            {/* Position adjusters with Header Position title */}
            <div id="headerPositionSection" className="pt-2 border-t border-inherit space-y-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  id="btnLockHeaderPos"
                  type="button"
                  className="p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm cursor-not-allowed opacity-60 pointer-events-none leading-none"
                  title="Select an airline profile first to unlock"
                >
                  <span id="lockIconHeaderPos" className="pointer-events-none">🔒</span>
                </button>
                <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Header Position:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label"><span>Header X Offset:</span> <span id="hdrPosXVal" className="text-sky-500 font-mono-avionics font-bold">150px</span></label>
                  <input type="range" id="hdrPosX" min="-100" max="4500" defaultValue="150" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label"><span>Header Y Offset:</span> <span id="hdrPosYVal" className="text-sky-500 font-mono-avionics font-bold">175px</span></label>
                  <input type="range" id="hdrPosY" min="40" max="1000" defaultValue="175" className="w-full mt-1" />
                </div>
              </div>

              {/* Reset Position Buttons: Reset X & Reset Y */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <button id="btnResetHdrX" type="button" className="py-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Header X to 150px">
                  <span>↺</span>
                  <span>Reset X</span>
                </button>
                <button id="btnResetHdrY" type="button" className="py-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Header Y to 175px">
                  <span>↺</span>
                  <span>Reset Y</span>
                </button>
              </div>
            </div>

            {/* Sizes & Offsets Section */}
            <div id="sizesOffsetsSection" className="pt-2 border-t border-inherit space-y-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  id="btnLockSizesOffsets"
                  type="button"
                  className="p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm cursor-not-allowed opacity-60 pointer-events-none leading-none"
                  title="Select an airline profile first to unlock"
                >
                  <span id="lockIconSizesOffsets" className="pointer-events-none">🔒</span>
                </button>
                <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Sizes &amp; Offsets:</span>
              </div>

              {/* 2-Column Parallel Layout (Left: Logo | Right: Suffix) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Left Column: Logo Controls */}
                <div id="hdrAirlineSizeCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span id="hdrAirlineSizeLabel">Logo Scale:</span> <span id="hdrAirlineSizeVal" className="text-sky-500 font-mono-avionics font-bold">140px</span></label>
                    <input type="range" id="hdrAirlineSize" min="60" max="450" defaultValue="140" className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span id="logoOffsetXLabel">Logo X Offset:</span> <span id="logoOffsetXVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                    <input type="range" id="logoOffsetX" min="-250" max="150" defaultValue="0" className="w-full mt-1" />
                  </div>

                  <div id="logoOffsetYCol">
                    <label className="text-[10px] flex justify-between panel-label"><span id="logoOffsetYLabel">Logo Y Offset:</span> <span id="logoOffsetYVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                    <input type="range" id="logoOffsetY" min="-80" max="80" defaultValue="0" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetLogoOffsets" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Logo Scale, Logo X Offset, and Logo Y Offset to default">
                      <span>↺</span>
                      <span>Logo Reset</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Suffix Controls */}
                <div id="hdrSuffixSizeCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span id="hdrSuffixSizeLabel">Suffix Scale:</span> <span id="hdrSuffixSizeVal" className="text-sky-500 font-mono-avionics font-bold">140px</span></label>
                    <input type="range" id="hdrSuffixSize" min="60" max="450" defaultValue="140" className="w-full mt-1" />
                  </div>

                  <div id="hdrDividerGapCol">
                    <label className="text-[10px] flex justify-between panel-label"><span id="suffixOffsetXLabel">Suffix X Offset:</span> <span id="suffixOffsetXVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                    <input type="range" id="suffixOffsetX" min="-250" max="150" defaultValue="0" className="w-full mt-1" />
                  </div>

                  <div id="suffixOffsetYCol">
                    <label className="text-[10px] flex justify-between panel-label"><span id="suffixOffsetYLabel">Suffix Y Offset:</span> <span id="suffixOffsetYVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                    <input type="range" id="suffixOffsetY" min="-80" max="80" defaultValue="0" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetSuffixOffsets" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Suffix Scale, Suffix X Offset, and Suffix Y Offset to default">
                      <span>↺</span>
                      <span>Suffix Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient Options Controls (Left: Top Gradient | Right: Bottom Gradient) */}
            <div id="atmosphericGradientsSection" className="pt-2 border-t border-inherit space-y-2">
              <div className="flex items-center gap-1.5">
                <button
                  id="btnLockGradients"
                  type="button"
                  className="p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm cursor-not-allowed opacity-60 pointer-events-none leading-none"
                  title="Select an airline profile first to unlock"
                >
                  <span id="lockIconGradients" className="pointer-events-none">🔒</span>
                </button>
                <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Gradient Options:</span>
              </div>

              {/* 2-Column Parallel Layout */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Left Column: Top Gradient */}
                <div id="topGradCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">Top Gradient:</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="topGradColor" defaultValue="#002030" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="topGradHex" defaultValue="#002030" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Opacity:</span> <span id="topGradOpacityVal" className="text-sky-500 font-mono-avionics font-bold">90%</span></label>
                    <input type="range" id="topGradOpacity" min="0" max="100" defaultValue="90" className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Depth:</span> <span id="topGradDepthVal" className="text-sky-500 font-mono-avionics font-bold">450px</span></label>
                    <input type="range" id="topGradDepth" min="100" max="800" defaultValue="450" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetTopGradDepth" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Top Gradient Opacity to 90% and Depth to 450px">
                      <span>↺</span>
                      <span>Reset Top</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Bottom Gradient */}
                <div id="botGradCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">Bottom Gradient:</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="botGradColor" defaultValue="#000000" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="botGradHex" defaultValue="#000000" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Opacity:</span> <span id="botGradOpacityVal" className="text-sky-500 font-mono-avionics font-bold">90%</span></label>
                    <input type="range" id="botGradOpacity" min="0" max="100" defaultValue="90" className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Depth:</span> <span id="botGradDepthVal" className="text-sky-500 font-mono-avionics font-bold">450px</span></label>
                    <input type="range" id="botGradDepth" min="100" max="800" defaultValue="450" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetBotGradDepth" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Bottom Gradient Opacity to 90% and Depth to 450px">
                      <span>↺</span>
                      <span>Reset Bottom</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOVEABLE & RESIZABLE CUSTOM TEXT BOX OVERLAY (Exclusive to Custom Mode) */}
            <div id="customTextBoxCard" className="pt-2 border-t border-inherit space-y-2.5 hidden">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Custom Text Box Settings:</span>

              <div id="customBoxSubControls" className="space-y-2.5">
                {/* Text Content Input */}
                <div>
                  <label className="text-[10px] font-mono-avionics panel-label">Box Text Content</label>
                  <input type="text" id="customBoxTextInput" defaultValue="Custom Text" placeholder="Enter text..." className="w-full px-2.5 py-1.5 text-xs app-input font-medium mt-1" />
                </div>

                {/* Colors: Background Color & Text Color */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">BG Color</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="customBoxBgColor" defaultValue="#000000" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="customBoxBgHex" defaultValue="#000000" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">Text Color</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="customBoxTextColor" defaultValue="#ffffff" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="customBoxTextHex" defaultValue="#FFFFFF" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>
                </div>

                {/* Background Opacity Slider */}
                <div>
                  <label className="text-[10px] flex justify-between panel-label">
                    <span>Background Opacity:</span>
                    <span id="customBoxBgOpacityVal" className="font-mono-avionics font-bold">65%</span>
                  </label>
                  <input type="range" id="customBoxBgOpacity" min="0" max="100" defaultValue="65" className="w-full mt-1" />
                </div>

                {/* Font Size & Typography */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] flex justify-between panel-label">
                      <span>Font Size:</span>
                      <span id="customBoxFontSizeVal" className="font-mono-avionics font-bold">110px</span>
                    </label>
                    <input type="range" id="customBoxFontSize" min="40" max="260" defaultValue="110" className="w-full mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-avionics panel-label block">Typography</label>
                    <select id="customBoxFont" className="w-full px-2 py-1 text-xs app-input font-medium mt-1">
                      <option value="font-montserrat">Montserrat</option>
                      <option value="font-plus-jakarta">Plus Jakarta</option>
                      <option value="font-urbanist">Urbanist</option>
                      <option value="font-outfit">Outfit</option>
                      <option value="font-hud">Chakra Petch (HUD)</option>
                      <option value="font-space-grotesk">Space Grotesk</option>
                    </select>
                  </div>
                </div>

                {/* Box Position X / Y & Dimensions W / H */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-inherit">
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Box Pos X:</span> <span id="customBoxXVal" className="font-mono-avionics font-bold">180px</span></label>
                    <input type="range" id="customBoxX" min="0" max="4000" defaultValue="180" className="w-full mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Box Pos Y:</span> <span id="customBoxYVal" className="font-mono-avionics font-bold">1950px</span></label>
                    <input type="range" id="customBoxY" min="0" max="2300" defaultValue="1950" className="w-full mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Box Width:</span> <span id="customBoxWVal" className="font-mono-avionics font-bold">2200px</span></label>
                    <input type="range" id="customBoxW" min="300" max="5200" defaultValue="2200" className="w-full mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Box Height:</span> <span id="customBoxHVal" className="font-mono-avionics font-bold">280px</span></label>
                    <input type="range" id="customBoxH" min="80" max="1000" defaultValue="280" className="w-full mt-1" />
                  </div>
                </div>

                {/* Text Alignment: Horizontal & Vertical */}
                <div className="space-y-1.5 pt-1 border-t border-inherit">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono-avionics panel-label">Horizontal Align:</span>
                    <div className="inline-flex rounded-md p-0.5 bg-zinc-900 border border-zinc-700 font-mono-avionics text-[10px]">
                      <button id="btnCustomBoxAlignLeft" type="button" className="px-2 py-0.5 rounded text-zinc-400 hover:text-white transition">Left</button>
                      <button id="btnCustomBoxAlignCenter" type="button" className="px-2 py-0.5 rounded bg-white text-black font-bold transition">Center</button>
                      <button id="btnCustomBoxAlignRight" type="button" className="px-2 py-0.5 rounded text-zinc-400 hover:text-white transition">Right</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono-avionics panel-label">Vertical Align:</span>
                    <div className="inline-flex rounded-md p-0.5 bg-zinc-900 border border-zinc-700 font-mono-avionics text-[10px]">
                      <button id="btnCustomBoxVAlignTop" type="button" className="px-2 py-0.5 rounded text-zinc-400 hover:text-white transition">Top</button>
                      <button id="btnCustomBoxVAlignMiddle" type="button" className="px-2 py-0.5 rounded bg-white text-black font-bold transition">Middle</button>
                      <button id="btnCustomBoxVAlignBottom" type="button" className="px-2 py-0.5 rounded text-zinc-400 hover:text-white transition">Bottom</button>
                    </div>
                  </div>

                  {/* Box Padding Slider & Reset Button */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex-1">
                      <label className="text-[10px] flex justify-between panel-label">
                        <span>Inner Padding:</span>
                        <span id="customBoxPaddingVal" className="font-mono-avionics font-bold">40px</span>
                      </label>
                      <input type="range" id="customBoxPadding" min="10" max="150" defaultValue="40" className="w-full mt-0.5" />
                    </div>
                    <button id="btnResetCustomBox" type="button" className="mt-3 py-1.5 px-2.5 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition shrink-0" title="Reset custom text box to default size & position">
                      <span>↺</span>
                      <span>Reset Box</span>
                    </button>
                  </div>
                </div>
                <p className="text-[9px] panel-muted font-mono-avionics leading-tight pt-1">
                  💡 Tip: You can also drag the text box directly on the Canvas preview to move it, or drag its corner handle to resize!
                </p>
              </div>
            </div>
            </div>{/* /#airlineDependentControls */}
          </div>



        </div>

        {/* TAB 2: BACKDROP PHOTO (Single Unified Card matching Tab 1) */}
        <div id="tabContentScenery" className="p-4 space-y-3.5 hidden">

          <div className="p-3.5 rounded-lg panel-card space-y-3">
            {/* Section 1: Backdrop Header & File Uploader */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-hud font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>BACKDROP</span>
              </span>
              <span id="bgStatusBadge" className="text-[10px] text-emerald-500 font-mono-avionics font-bold"></span>
            </div>

            {/* Drag and drop zone */}
            <div id="dropZone" className="border-2 border-dashed border-zinc-500/30 hover:border-zinc-500 rounded-lg p-5 text-center cursor-pointer transition group">
              <svg className="w-7 h-7 mx-auto mb-2 opacity-80 group-hover:scale-105 group-hover:text-sky-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-xs font-hud font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                Click or Drag &amp; Drop Photo
              </p>
              <p className="text-[10px] font-mono-avionics text-zinc-500 dark:text-zinc-400 mt-1">
                Supports JPG, PNG, WEBP (4K &amp; 8K)
              </p>
              <p className="text-[10px] font-mono-avionics text-zinc-400 dark:text-zinc-500 mt-1">
                Use landscape images for best results
              </p>
              <input type="file" id="filePicker" accept="image/*" className="hidden" />
            </div>

            {/* Import Scenery Photo from URL & Clear Image Option */}
            <div className="pt-2 border-t border-inherit space-y-1.5">
              <label className="text-[10px] font-mono-avionics uppercase panel-label flex items-center justify-between">
                <span>Import from URL</span>
                <span id="urlImportStatus" className="text-[9px] text-sky-400 hidden">Loading...</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input type="url" id="imageUrlInput" placeholder="https://example.com/scenery.jpg" className="flex-1 px-2.5 py-1.5 text-xs app-input font-medium" />
                <button id="btnLoadImageUrl" type="button" className="px-3 py-1.5 tool-btn font-mono-avionics text-xs font-semibold flex items-center gap-1 shrink-0">
                  <span>Load</span>
                </button>
              </div>

              {/* Clear Image Button */}
              <div className="pt-1">
                <button id="btnClearSceneryPhoto" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-rose-400 hover:text-rose-300 hover:border-rose-500/50 flex items-center justify-center gap-1 transition" title="Clear uploaded/URL photo and revert to procedural scenery">
                  <span>✕</span>
                  <span>Clear Image</span>
                </button>
              </div>
            </div>

            {/* Section 2: Zoom & Pan Controls */}
            <div className="pt-2 border-t border-inherit space-y-2">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Zoom &amp; Pan Controls:</span>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="panel-label">Zoom Scale</span>
                  <span id="zoomVal" className="text-sky-500 font-mono-avionics font-bold">1.00×</span>
                </div>
                <input type="range" id="bgZoom" min="20" max="400" defaultValue="100" className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Pan X <span id="panXVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                  <input type="range" id="bgPanX" min="-3000" max="3000" defaultValue="0" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Pan Y <span id="panYVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                  <input type="range" id="bgPanY" min="-1800" max="1800" defaultValue="0" className="w-full mt-1" />
                </div>
              </div>

              {/* Action & Lock Tool Buttons in 2 Ordered Rows */}
              <div className="pt-1 space-y-1.5 text-[10px]">
                {/* Row 1: Fit Width, Fit Height, Fill Screen, Force Scale */}
                <div className="grid grid-cols-4 gap-1">
                  <button id="btnFitWidth" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Fit photo width to canvas">Fit Width</button>
                  <button id="btnFitHeight" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Fit photo height to canvas">Fit Height</button>
                  <button id="btnCenterCover" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Fill entire canvas">Fill Screen</button>
                  <button id="btnForceScale" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Force scenery photo to exactly 5664×2500 centered">Force Scale</button>
                </div>

                {/* Row 2: Lock X, Lock Y, Reset */}
                <div className="grid grid-cols-3 gap-1">
                  <button id="btnToggleLockX" type="button" className="py-1 px-2 tool-btn flex items-center justify-center gap-1.5 font-medium transition" title="Lock horizontal panning">
                    <span id="lockIconX">🔓</span>
                    <span id="lockLabelX">Lock X</span>
                  </button>
                  <button id="btnToggleLockY" type="button" className="py-1 px-2 tool-btn flex items-center justify-center gap-1.5 font-medium transition" title="Lock vertical panning">
                    <span id="lockIconY">🔓</span>
                    <span id="lockLabelY">Lock Y</span>
                  </button>
                  <button id="btnResetPanZoomInline" type="button" className="py-1 px-2 tool-btn flex items-center justify-center gap-1 text-sky-400 font-bold transition hover:text-sky-300" title="Reset all pan, zoom, and lock states">
                    <span>↺</span>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] panel-muted italic text-center">💡 Tip: Click and drag directly on the preview to pan.</p>
            </div>

            {/* Section 3: Photo Grading */}
            <div className="pt-2 border-t border-inherit space-y-2">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Photo Grading:</span>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Brightness <span id="brightVal" className="text-sky-500 font-mono-avionics font-bold">0</span></label>
                  <input type="range" id="bgBright" min="-50" max="50" defaultValue="0" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Contrast <span id="contrastVal" className="text-sky-500 font-mono-avionics font-bold">0</span></label>
                  <input type="range" id="bgContrast" min="-50" max="50" defaultValue="0" className="w-full mt-1" />
                </div>

                {/* Reset Buttons: 2 for individual values + 1 for Reset All */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px]">
                  <button id="btnResetBright" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-0.5 transition" title="Reset Brightness to 0">
                    <span>↺ Bright</span>
                  </button>
                  <button id="btnResetContrast" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-0.5 transition" title="Reset Contrast to 0">
                    <span>↺ Contrast</span>
                  </button>
                  <button id="btnResetGradingAll" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-bold text-center text-sky-400 hover:text-sky-300 flex items-center justify-center gap-0.5 transition" title="Reset Brightness and Contrast to defaults">
                    <span>↺ All</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* TAB 3: AIRPORT DESTINATION CONTROLS */}
        <div id="tabContentText" className="p-4 space-y-3.5 hidden">

          <div className="p-3.5 rounded-lg panel-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-hud font-bold flex items-center gap-1.5">
                <span>📍</span> Focus Airport Callout
              </span>
            </div>



            {/* ICAO Input with Live Auto-Fill */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] panel-label">ICAO Airport Code</label>
                <div className="flex items-center gap-2">
                  <span id="icaoLookupBadge" className="text-[9px] text-emerald-400 font-mono-avionics font-bold hidden">Auto-Filled ✓</span>
                  <label className="text-[9px] text-slate-400 flex items-center gap-1 cursor-pointer font-mono-avionics" title="Auto-fill City when typing a 4-letter ICAO code">
                    <input type="checkbox" id="autoLookupCity" defaultChecked className="rounded scale-90" />
                    <span>Auto-Fill</span>
                  </label>
                </div>
              </div>
              <input type="text" id="icaoInput" defaultValue="" maxLength="4" placeholder="ICAO" className="w-full px-2.5 py-1.5 text-base font-black uppercase tracking-wider text-center app-input mt-1" />
            </div>

            {/* City Input (Centered directly under ICAO, Auto-fit Width) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] panel-label">City Name, 2-Letter Country Code</label>
                <span id="cityEdgeWarningBadge" className="text-[9px] text-rose-400 font-mono-avionics font-bold hidden">⚠️ &lt; 20px from edge!</span>
              </div>
              <input type="text" id="cityInput" defaultValue="" placeholder="CITY, CC" className="w-full px-2.5 py-1.5 text-xs tracking-widest uppercase text-center app-input font-bold mt-1" />
            </div>

            {/* Font Sizes & Spacing (Hidden per user request) */}
            <div className="hidden">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label">ICAO Size: <span id="icaoSizeVal" className="text-sky-500 font-mono-avionics font-bold">320px</span></label>
                  <input type="range" id="icaoSize" min="140" max="600" defaultValue="320" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label">City Size: <span id="citySizeVal" className="text-sky-500 font-mono-avionics font-bold">105px</span></label>
                  <input type="range" id="citySize" min="40" max="250" defaultValue="105" className="w-full mt-1" />
                </div>
              </div>

              {/* Gap between ICAO and City */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="panel-label">Gap Between ICAO &amp; City</span>
                  <span id="icaoCityGapVal" className="text-sky-500 font-mono-avionics font-bold">40px</span>
                </div>
                <input type="range" id="icaoCityGap" min="10" max="140" defaultValue="40" className="w-full" />
              </div>
            </div>

            {/* Font Family & Weight Controls (Hidden per user preference) */}
            <div className="space-y-2 hidden">
              <div>
                <label className="text-[10px] panel-label">Font Family</label>
                <select id="textFont" className="w-full px-2.5 py-1.5 text-xs app-input font-semibold mt-1" defaultValue="font-urbanist">
                  <optgroup label="Modern Editorial & Clean (Balanced Weights)">
                    <option value="font-urbanist">Urbanist (Geometric & Elegant)</option>
                    <option value="font-plus-jakarta">Plus Jakarta Sans (Ultra-Clean Modern)</option>
                    <option value="font-outfit">Outfit (Refined Contemporary)</option>
                    <option value="font-dm-sans">DM Sans (Crisp & Readable)</option>
                    <option value="font-inter">Inter (Classic Precision)</option>
                    <option value="font-montserrat">Montserrat (Wide Geometric)</option>
                  </optgroup>
                  <optgroup label="Aviation & Technical Tech">
                    <option value="font-rajdhani">Rajdhani (Clean Flight HUD / Avionics)</option>
                    <option value="font-space-grotesk">Space Grotesk (Tech Modern)</option>
                    <option value="font-barlow">Barlow (Clean Aerodynamics)</option>
                    <option value="font-hud">Chakra Petch (Military HUD)</option>
                    <option value="font-mono-avionics">JetBrains Mono (Avionics Code)</option>
                  </optgroup>
                  <optgroup label="Condensed & Tall Display">
                    <option value="font-teko">Teko (Ultra-Tall Airline Boarding)</option>
                    <option value="font-oswald">Oswald (Industrial Condensed)</option>
                    <option value="font-syne">Syne (Bold Architectural)</option>
                  </optgroup>
                </select>
              </div>

              {/* Weight Selectors: ICAO Weight & City Weight */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] panel-label">ICAO Weight</label>
                  <select id="icaoWeight" className="w-full px-2 py-1 text-xs app-input font-medium mt-1" defaultValue="700">
                    <option value="300">300 (Light)</option>
                    <option value="400">400 (Regular)</option>
                    <option value="500">500 (Medium)</option>
                    <option value="600">600 (Semi-Bold)</option>
                    <option value="700">700 (Bold - Balanced)</option>
                    <option value="800">800 (Extra-Bold)</option>
                    <option value="900">900 (Black / Heavy)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] panel-label">City Weight</label>
                  <select id="cityWeight" className="w-full px-2 py-1 text-xs app-input font-medium mt-1" defaultValue="500">
                    <option value="300">300 (Light)</option>
                    <option value="400">400 (Regular)</option>
                    <option value="500">500 (Medium - Clean)</option>
                    <option value="600">600 (Semi-Bold)</option>
                    <option value="700">700 (Bold)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Coordinates on 5664x2500 canvas (Hidden per user request) */}
            <div className="hidden">
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-inherit">
                <div>
                  <label className="text-[10px] panel-label">Center Anchor X (px)</label>
                  <input type="number" id="textPosX" defaultValue="4900" step="20" className="w-full px-2 py-1 text-xs font-mono-avionics app-input mt-1" />
                </div>
                <div>
                  <label className="text-[10px] panel-label">ICAO Baseline Y (px)</label>
                  <input type="number" id="textPosY" defaultValue="2180" step="20" className="w-full px-2 py-1 text-xs font-mono-avionics app-input mt-1" />
                </div>
              </div>
              <button id="btnResetTextPos" className="text-[10px] text-sky-500 hover:underline font-mono-avionics font-bold">Reset Position</button>
            </div>

            {/* Background Adaptability & Legibility Modes */}
            <div className="pt-2 border-t border-inherit space-y-2.5">
              {/* Contrast Mode On/Off Toggle Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Text Legibility &amp; Contrast:</span>
                <div id="legibilityStyleRow" className="grid grid-cols-5 gap-1 text-[10px]">
                  <button id="btnLegibilityDark" type="button" className="py-1 px-0.5 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm" title="Toggle Dark BG shadow mode">
                    Dark BG
                  </button>
                  <button id="btnLegibilityLightBG" type="button" className="py-1 px-0.5 tool-btn text-center font-medium transition" title="Toggle Light BG contrast mode">
                    Light BG
                  </button>
                  <button id="btnLegibilityLight" type="button" className="py-1 px-0.5 tool-btn text-center font-medium transition" title="Toggle Light Glow mode">
                    Light Glow
                  </button>
                  <button id="btnLegibilityOutline" type="button" className="py-1 px-0.5 tool-btn text-center font-medium transition" title="Toggle Outline contour mode">
                    Outline
                  </button>
                  <button id="btnLegibilitySoft" type="button" className="py-1 px-0.5 tool-btn text-center font-medium transition" title="Toggle Soft shadow mode">
                    Soft
                  </button>
                </div>
              </div>

              {/* Intensity Slider */}
              <div id="legibilityIntensityRow" className="pt-1">
                <div className="flex justify-between text-[10px]">
                  <span className="panel-label">Effect Intensity:</span>
                  <span id="legibilityIntensityVal" className="text-sky-500 font-mono-avionics font-bold">100%</span>
                </div>
                <input type="range" id="legibilityIntensity" min="20" max="150" defaultValue="100" className="w-full mt-1" />
              </div>

              {/* Action Buttons: Enable Effect & Reset */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <button id="btnToggleLegibilityEffect" type="button" className="py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm" title="Toggle Legibility Shadow & Glow on or off">
                  <span id="legibilityToggleLabel">Effect Enabled</span>
                </button>
                <button id="btnResetLegibility" type="button" className="py-1 px-2 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset legibility to Dark Back and 100% Intensity">
                  <span>↺</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        </div>{/* /SCROLLABLE TAB CONTENTS AREA */}

      </aside>

      {/* MAIN RIGHT VIEWPORT: LIVE RESPONSIVE PREVIEW & DRAG INTERFACE */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* VIEWPORT TOOLBAR */}
        <div id="viewportToolbar" className="h-10 border-b px-5 flex items-center justify-between text-xs panel-muted shrink-0 transition-colors duration-150 gap-4">
          {/* Top Bar Navigation / Workspace Flow Breadcrumb */}
          <div className="flex items-center gap-2 overflow-hidden text-[11px] font-mono-avionics select-none min-w-0">
            <span className="font-hud font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              {/* Workspace / Frame Icon */}
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15l-5-5L5 21" />
              </svg>
              <span>WORKSPACE</span>
            </span>

            {/* 1. Dynamic Activity Type Crumb Item */}
            <span id="crumbSepActivity" className="text-zinc-400 dark:text-zinc-600 font-semibold shrink-0 hidden">/</span>
            <span id="crumbActivity" className="truncate font-semibold text-zinc-700 dark:text-zinc-200 shrink-0 max-w-[180px] hidden" title="Activity Type"></span>

            {/* 2. Dynamic Airline Crumb Item */}
            <span id="crumbSepAirline" className="text-zinc-400 dark:text-zinc-600 font-semibold shrink-0 hidden">/</span>
            <span id="crumbAirline" className="truncate font-semibold text-zinc-700 dark:text-zinc-200 shrink-0 max-w-[340px] hidden" title="Selected Airline"></span>

            {/* 3. Dynamic Airport Crumb Item (ICAO - City) */}
            <span id="crumbSepAirport" className="text-zinc-400 dark:text-zinc-600 font-semibold shrink-0 hidden">/</span>
            <span id="crumbAirport" className="truncate font-semibold text-zinc-700 dark:text-zinc-200 shrink-0 max-w-[280px] hidden" title="Airport ICAO - City"></span>
          </div>

          {/* Top Right Version Text in [] */}
          <div className="flex items-center gap-1.5 shrink-0 select-none text-[10px] font-mono-avionics font-semibold tracking-wider text-zinc-500 dark:text-zinc-400">
            <span id="appVersionTag" title="Airwaylink Banner Studio Build Version">
              [ {APP_VERSION} ]
            </span>
          </div>
        </div>

        {/* INTERACTIVE PREVIEW WRAPPER */}
        <div id="viewportContainer" className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center relative hud-grid-pattern select-none cursor-default">

          {/* Scaled Banner Container (5664:2500 Aspect Ratio) */}
          <div id="bannerContainer" className="relative shadow-xl border border-zinc-500/20 rounded-md overflow-hidden transition-all duration-150">
            {/* Canvas preview scaled from internal 5664x2500 buffer */}
            <canvas id="previewCanvas" className="block w-full h-full bg-slate-950"></canvas>

            {/* Drag & Drop Canvas Overlay for Backdrop Photo */}
            <div
              id="canvasDropOverlay"
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-[3px] border-2 border-dashed border-sky-400 pointer-events-none opacity-0 transition-opacity duration-150"
            >
              <div className="flex flex-col items-center justify-center p-6 text-center select-none">
                <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-400/60 flex items-center justify-center mb-3 text-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.4)]">
                  <svg className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-hud font-bold text-sm tracking-widest text-sky-300 uppercase">
                  DROP IMAGE TO SET BACKDROP PHOTO
                </span>
                <span className="font-mono-avionics text-[10px] text-sky-200/75 mt-1 tracking-wide">
                  SUPPORTS JPG, PNG, WEBP, AVIF (4K &amp; 8K RESOLUTIONS)
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Specs: Bottom Center in [] */}
          <div id="canvasSpecsBadge" className="mt-2.5 flex items-center justify-center text-[11px] font-mono-avionics text-zinc-500 dark:text-zinc-400 select-none tracking-wide shrink-0">
            <span>[ 5664 × 2500 px | Target: &lt; 2.0 MB JPG ]</span>
          </div>

          {/* Funny Aviation Taglines Footer (Disabled for now) */}
          <div className="hidden mt-3 items-center justify-center gap-2 text-center text-xs font-mono-avionics text-zinc-400 select-none cursor-pointer group" id="taglineContainer" title="Click for another tagline!">
            <span className="text-amber-500 opacity-70 group-hover:scale-110 transition-transform">✈</span>
            <span id="taglineText" className="group-hover:text-zinc-200 transition-colors">"Aviate, Navigate, Communicate, then fiddle with the banner."</span>
            <span className="text-[10px] text-zinc-600 dark:text-zinc-500 group-hover:text-sky-400 transition-colors">↺</span>
          </div>

        </div>

      </main>

    </div>
  );
}
