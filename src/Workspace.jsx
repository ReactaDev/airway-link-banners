export function Workspace() {
  return (
    <div className="flex-1 flex overflow-hidden">

      {/* LEFT SIDEBAR: CONTROL TOWER */}
      <aside className="w-88 md:w-96 border-r flex flex-col shrink-0 overflow-hidden transition-colors duration-150">

        {/* NAVIGATION TABS (Fixed at top of sidebar, never shifted by scrollbar) */}
        <div className="h-10 border-b border-inherit text-xs font-hud px-2 flex items-center gap-1.5 shrink-0 z-20" id="tabBar">
          <button id="tabBtnAirline" className="flex-1 py-1 rounded-md text-sky-500 bg-sky-500/10 border border-sky-500/30 font-bold transition">1. AIRLINE</button>
          <button id="tabBtnScenery" className="flex-1 py-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition font-medium">2. BACKDROP</button>
          <button id="tabBtnText" className="flex-1 py-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition font-medium">3. AIRPORT</button>
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
              <span id="airlineBadge" className="text-[10px] text-slate-400 font-mono-avionics font-bold">NONE SELECTED</span>
            </div>

            {/* Airline Preset Dropdown */}
            <div>
              <label className="text-[10px] uppercase font-mono-avionics panel-label">AIRLINE PROFILE</label>
              <select id="airlineDropdown" className="w-full mt-1 px-2.5 py-1.5 text-xs app-input font-semibold" defaultValue="">
                <option id="optSelectAirlinePlaceholder" value="" disabled hidden>Select Airline</option>
                <option value="ANZ">ANZ Virtual (ANZ)</option>
                <option value="CPA">Cathay Pacific Virtual (CPA)</option>
                <option value="FDX">vFedEx (FDX)</option>
                <option value="FFT">Frontier Virtual (FFT)</option>
                <option value="ICE">Icelandair Virtual (ICE)</option>
                <option value="JBU">JetBlue Virtual (JBU)</option>
                <option value="QFA">Qantas Virtual (QFA)</option>
                <option value="UAL">vUAL (UAL)</option>
                <option value="CUSTOM">Custom</option>
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
                    <span>Suffix Text</span>
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

            {/* Header Render Mode Toggle (Logo vs Text Fallback) */}
            <div id="headerBrandModeSection" className="pt-2 border-t border-inherit space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono-avionics panel-label">Header Brand Mode</span>
                <div className="inline-flex rounded-md p-0.5 bg-zinc-900 border border-zinc-700 text-[10px] font-mono-avionics light:bg-slate-100 light:border-slate-300">
                  <button id="btnModeLogo" type="button" className="px-2.5 py-0.5 rounded bg-sky-500 text-white font-bold transition">Logo Image</button>
                  <button id="btnModeText" type="button" className="px-2.5 py-0.5 rounded text-zinc-400 hover:text-white transition">Text Style</button>
                </div>
              </div>

              {/* Active Airline Logo Preview & Custom Logo Uploader */}
              <div id="logoPreviewSection" className="space-y-2">
                <div id="logoPreviewBox" className="h-16 rounded-lg border border-slate-700/80 flex items-center justify-center p-2.5 relative overflow-hidden shadow-inner bg-slate-900/60">
                  <img id="sidebarLogoPreview" className="max-h-11 max-w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] hidden" />
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <button id="btnTriggerLogoUpload" type="button" className="px-2.5 py-1 tool-btn font-mono-avionics font-semibold flex items-center gap-1">
                    <span id="uploadLogoBtnText">📁 Replace / Upload Logo PNG</span>
                  </button>
                  <input type="file" id="customLogoInput" accept="image/*" className="hidden" />
                  <button id="btnResetAirlineLogo" type="button" className="text-[10px] text-sky-400 hover:underline font-mono-avionics hidden">Reset Default Logo</button>
                </div>
              </div>

              {/* Airline Text Input (Only shown when Text Mode is active) */}
              <div id="textModeInputBox" className="hidden">
                <label className="text-[10px] font-mono-avionics panel-label">Airline Display Name (White)</label>
                <input type="text" id="hdrAirlineText" defaultValue="" placeholder="AIRLINE NAME" className="w-full px-2.5 py-1.5 text-xs app-input font-medium mt-1" />
              </div>

              {/* Suffix Text Input */}
              <div id="suffixTextInputSection">
                <label className="text-[10px] font-mono-avionics panel-label">Suffix Text</label>
                <input type="text" id="hdrSuffixText" defaultValue="Focus Airport" className="w-full px-2.5 py-1.5 text-xs app-input font-medium mt-1" />
              </div>
            </div>

            {/* Atmospheric Gradient Controls (Left: Top Gradient | Right: Bottom Gradient) */}
            <div id="atmosphericGradientsSection" className="pt-2 border-t border-inherit space-y-2">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Atmospheric Gradients:</span>

              {/* 2-Column Parallel Layout */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Left Column: Top Gradient */}
                <div id="topGradCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">Top Gradient</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="topGradColor" defaultValue="#002030" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="topGradHex" defaultValue="#002030" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Opacity:</span> <span id="topGradOpacityVal" className="text-sky-500 font-mono-avionics font-bold">75%</span></label>
                    <input type="range" id="topGradOpacity" min="0" max="100" defaultValue="75" className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Depth:</span> <span id="topGradDepthVal" className="text-sky-500 font-mono-avionics font-bold">500px</span></label>
                    <input type="range" id="topGradDepth" min="100" max="800" defaultValue="500" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetTopGradDepth" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Top Gradient Opacity to 75% and Depth to 500px">
                      <span>↺</span>
                      <span>Reset Top</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Bottom Gradient */}
                <div id="botGradCol" className="space-y-2">
                  <div>
                    <label className="text-[10px] font-mono-avionics uppercase panel-label block mb-1">Bottom Gradient</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" id="botGradColor" defaultValue="#000000" className="w-7 h-7 bg-transparent rounded cursor-pointer border border-slate-400 shrink-0" />
                      <input type="text" id="botGradHex" defaultValue="#000000" className="w-full px-2 py-1 text-xs uppercase font-mono-avionics app-input" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Opacity:</span> <span id="botGradOpacityVal" className="text-sky-500 font-mono-avionics font-bold">75%</span></label>
                    <input type="range" id="botGradOpacity" min="0" max="100" defaultValue="75" className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] flex justify-between panel-label"><span>Depth:</span> <span id="botGradDepthVal" className="text-sky-500 font-mono-avionics font-bold">500px</span></label>
                    <input type="range" id="botGradDepth" min="100" max="800" defaultValue="500" className="w-full mt-1" />
                  </div>

                  <div className="pt-0.5">
                    <button id="btnResetBotGradDepth" type="button" className="w-full py-1 tool-btn font-mono-avionics text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Bottom Gradient Opacity to 75% and Depth to 500px">
                      <span>↺</span>
                      <span>Reset Bottom</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes & Offsets Section */}
            <div id="sizesOffsetsSection" className="pt-2 border-t border-inherit space-y-1.5">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Sizes &amp; Offsets:</span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div id="hdrAirlineSizeCol">
                  <label className="text-[10px] flex justify-between panel-label"><span id="hdrAirlineSizeLabel">Logo Height:</span> <span id="hdrAirlineSizeVal" className="text-sky-500 font-mono-avionics font-bold">145px</span></label>
                  <input type="range" id="hdrAirlineSize" min="60" max="360" defaultValue="145" className="w-full mt-1" />
                </div>
                <div id="hdrSuffixSizeCol">
                  <label className="text-[10px] flex justify-between panel-label">Focus Size: <span id="hdrSuffixSizeVal" className="text-sky-500 font-mono-avionics font-bold">148px</span></label>
                  <input type="range" id="hdrSuffixSize" min="80" max="240" defaultValue="148" className="w-full mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div id="logoOffsetYCol">
                  <label className="text-[10px] flex justify-between panel-label">Logo Y Offset: <span id="logoOffsetYVal" className="text-sky-500 font-mono-avionics font-bold">0px</span></label>
                  <input type="range" id="logoOffsetY" min="-80" max="80" defaultValue="0" className="w-full mt-1" />
                </div>
                <div id="hdrDividerGapCol">
                  <label className="text-[10px] flex justify-between panel-label">Divider Gap: <span id="hdrDividerGapVal" className="text-sky-500 font-mono-avionics font-bold">44px</span></label>
                  <input type="range" id="hdrDividerGap" min="16" max="120" defaultValue="44" className="w-full mt-1" />
                </div>
              </div>

              {/* Row of 3 Tool Buttons: Drop Shadow, Force Pure White, Reset */}
              <div className="grid grid-cols-3 gap-1 pt-1.5 text-[10px]">
                <button id="btnToggleHdrShadow" type="button" className="py-1 px-1 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/40 text-center font-bold transition shadow-sm" title="Toggle header legibility drop shadow">
                  Drop Shadow
                </button>
                <button id="btnToggleForceWhite" type="button" className="py-1 px-1 tool-btn text-center font-medium transition" title="Force logo to pure white silhouette">
                  Pure White
                </button>
                <button id="btnResetHdrDimensions" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 text-sky-400 hover:text-sky-300 transition" title="Reset logo height, focus size, logo Y offset, and divider gap to default">
                  <span>↺</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Position adjusters with Header Position title */}
            <div id="headerPositionSection" className="pt-2 border-t border-inherit space-y-1.5">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Header Position:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label"><span>Header X:</span> <span id="hdrPosXVal" className="text-sky-500 font-mono-avionics font-bold">180px</span></label>
                  <input type="range" id="hdrPosX" min="0" max="3000" defaultValue="180" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label"><span>Header Y:</span> <span id="hdrPosYVal" className="text-sky-500 font-mono-avionics font-bold">175px</span></label>
                  <input type="range" id="hdrPosY" min="40" max="1000" defaultValue="175" className="w-full mt-1" />
                </div>
              </div>

              {/* Reset Position Buttons: Reset X & Reset Y */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <button id="btnResetHdrX" type="button" className="py-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Header X to 180px">
                  <span>↺</span>
                  <span>Reset X</span>
                </button>
                <button id="btnResetHdrY" type="button" className="py-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-1 transition" title="Reset Header Y to 175px">
                  <span>↺</span>
                  <span>Reset Y</span>
                </button>
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
                <span>🖼</span> Scenery &amp; Backdrop Photo
              </span>
              <span id="bgStatusBadge" className="text-[10px] text-emerald-500 font-mono-avionics font-bold">Loaded</span>
            </div>

            {/* Drag and drop zone */}
            <div id="dropZone" className="border-2 border-dashed border-zinc-500/30 hover:border-zinc-500 rounded-lg p-5 text-center cursor-pointer transition">
              <svg className="w-7 h-7 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-xs font-semibold">Click or Drag &amp; Drop Photo</p>
              <p className="text-[10px] panel-muted mt-1">Supports JPG, PNG, WEBP (4K &amp; 8K)</p>
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

            {/* Section 3: Photo Grading & Scrim */}
            <div className="pt-2 border-t border-inherit space-y-2">
              <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Photo Grading &amp; Scrim:</span>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Brightness <span id="brightVal" className="text-sky-500 font-mono-avionics font-bold">100%</span></label>
                  <input type="range" id="bgBright" min="30" max="180" defaultValue="100" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Contrast <span id="contrastVal" className="text-sky-500 font-mono-avionics font-bold">105%</span></label>
                  <input type="range" id="bgContrast" min="60" max="180" defaultValue="105" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-[10px] flex justify-between panel-label">Bottom Scrim Fade <span id="botScrimVal" className="text-sky-500 font-mono-avionics font-bold">45%</span></label>
                  <input type="range" id="botScrim" min="0" max="90" defaultValue="45" className="w-full mt-1" />
                </div>

                {/* 4 Reset Buttons: 3 for individual values + 1 for Reset All */}
                <div className="grid grid-cols-4 gap-1 pt-1 text-[10px]">
                  <button id="btnResetBright" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-0.5 transition" title="Reset Brightness to 100%">
                    <span>↺ Bright</span>
                  </button>
                  <button id="btnResetContrast" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-0.5 transition" title="Reset Contrast to 105%">
                    <span>↺ Contrast</span>
                  </button>
                  <button id="btnResetScrim" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-semibold text-center flex items-center justify-center gap-0.5 transition" title="Reset Bottom Scrim Fade to 45%">
                    <span>↺ Scrim</span>
                  </button>
                  <button id="btnResetGradingAll" type="button" className="py-1 px-1 tool-btn font-mono-avionics font-bold text-center text-sky-400 hover:text-sky-300 flex items-center justify-center gap-0.5 transition" title="Reset Brightness, Contrast, and Bottom Scrim Fade to defaults">
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
              {/* Test Preview Backgrounds */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-avionics uppercase panel-label font-semibold text-slate-300 dark:text-slate-200">Test Background Preview:</span>
                  <span id="previewBgStatus" className="text-[9px] text-sky-400 font-mono-avionics hidden">Preview Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button id="btnPreviewLightBg" type="button" className="py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition" title="Toggle bright daylight snow/cloud backdrop preview">
                    <span>☀️</span>
                    <span>Light Scenery</span>
                  </button>
                  <button id="btnPreviewDarkBg" type="button" className="py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition" title="Toggle deep night/tarmac backdrop preview">
                    <span>🌙</span>
                    <span>Dark Scenery</span>
                  </button>
                </div>
              </div>

              {/* Contrast Mode On/Off Toggle Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono-avionics uppercase panel-label block font-semibold text-slate-300 dark:text-slate-200">Text Legibility &amp; Contrast:</span>
                <div id="legibilityStyleRow" className="grid grid-cols-5 gap-1 text-[10px]">
                  <button id="btnLegibilityDark" type="button" className="py-1 px-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/40 text-center font-bold transition shadow-sm" title="Toggle Dark BG shadow mode">
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
                <button id="btnToggleLegibilityEffect" type="button" className="py-1 px-2 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/40 text-center font-bold transition shadow-sm" title="Toggle Legibility Shadow & Glow on or off">
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
        <div id="viewportToolbar" className="h-10 border-b px-5 flex items-center justify-between text-xs panel-muted shrink-0 transition-colors duration-150">
          <div className="flex items-center gap-3">
            <span className="font-hud font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              {/* Workspace / Frame Icon */}
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15l-5-5L5 21" />
              </svg>
              <span>WORKSPACE</span>
            </span>
            <span className="text-zinc-400 hidden sm:inline">|</span>
            <span className="text-[11px] font-mono-avionics hidden sm:inline">Click &amp; drag canvas to pan background</span>
          </div>

          {/* Canvas Specs (Right-aligned flush with header actions / Download Banner button) */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono-avionics">
            <div className="flex items-center font-medium text-zinc-800 dark:text-white">
              <span>5664 × 2500 px</span>
            </div>
            <span className="text-zinc-400">|</span>
            <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
              <span>Target:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">&lt; 2.0 MB JPG</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PREVIEW WRAPPER */}
        <div id="viewportContainer" className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center relative hud-grid-pattern select-none cursor-grab active:cursor-grabbing">

          {/* Scaled Banner Container (5664:2500 Aspect Ratio) */}
          <div id="bannerContainer" className="relative shadow-xl border border-zinc-500/20 rounded-md overflow-hidden transition-transform duration-75">
            {/* Canvas preview scaled from internal 5664x2500 buffer */}
            <canvas id="previewCanvas" className="block w-full h-full bg-slate-950"></canvas>


          </div>

          {/* Funny Aviation Taglines Footer */}
          <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs font-mono-avionics text-zinc-400 select-none cursor-pointer group" id="taglineContainer" title="Click for another tagline!">
            <span className="text-amber-500 opacity-70 group-hover:scale-110 transition-transform">✈</span>
            <span id="taglineText" className="group-hover:text-zinc-200 transition-colors">"Aviate, Navigate, Communicate, then fiddle with the banner."</span>
            <span className="text-[10px] text-zinc-600 dark:text-zinc-500 group-hover:text-sky-400 transition-colors">↺</span>
          </div>

        </div>

      </main>

    </div>
  );
}
