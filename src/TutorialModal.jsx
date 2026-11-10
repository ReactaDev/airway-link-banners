import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AIRPORT_DATABASE from './assets/airports.json';

export function TutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoLocked, setDemoLocked] = useState(true);
  const [demoSliderVal, setDemoSliderVal] = useState(175);
  const [demoIcao, setDemoIcao] = useState('KLAS');

  const cleanIcao = demoIcao.trim().toUpperCase();
  const matchedCity = AIRPORT_DATABASE[cleanIcao];
  const isFourLetters = cleanIcao.length === 4;

  const quickTestCodes = ['KLAS', 'EGLL', 'KJFK', 'KLAX', 'EDDF', 'OMDB', 'YSSY'];

  // Close on Escape key and navigate with arrow keys
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'PIPELINE OVERVIEW',
      title: 'Welcome to AirwayLink Banner Studio',
      tabLabel: 'AirwayLink Banner Studio',
      subtitle: 'Create High-Resolution (5664 x 2500) Event Banners!',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p className="panel-muted opacity-90">
            The studio uses a simple 3-step sequence to produce clean, professional banners:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-lg border border-inherit tutorial-callout flex flex-col justify-between">
              <div>
                <span className="font-mono-avionics text-[10px] font-bold block mb-1 opacity-60">STEP 1</span>
                <h4 className="font-hud font-bold text-sm mb-1">AIRLINE</h4>
                <p className="text-[11px] panel-muted">Select virtual airline profile, logo badges, and branding options.</p>
              </div>
              <span className="text-[10px] panel-muted font-mono-avionics mt-2">Unlocks subsequent tabs</span>
            </div>
            <div className="p-3 rounded-lg border border-inherit tutorial-callout flex flex-col justify-between">
              <div>
                <span className="font-mono-avionics text-[10px] font-bold block mb-1 opacity-60">STEP 2</span>
                <h4 className="font-hud font-bold text-sm mb-1">BACKDROP</h4>
                <p className="text-[11px] panel-muted">Import images, zoom, pan with axis locks, and color grade.</p>
              </div>
              <span className="text-[10px] panel-muted font-mono-avionics mt-2">Interactive canvas</span>
            </div>
            <div className="p-3 rounded-lg border border-inherit tutorial-callout flex flex-col justify-between">
              <div>
                <span className="font-mono-avionics text-[10px] font-bold block mb-1 opacity-60">STEP 3</span>
                <h4 className="font-hud font-bold text-sm mb-1">AIRPORT</h4>
                <p className="text-[11px] panel-muted">Instant ICAO lookup with auto-filled city and country details.</p>
              </div>
              <span className="text-[10px] panel-muted font-mono-avionics mt-2">Offline database</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-inherit tutorial-callout text-[11px] flex items-center gap-2.5">
            <span className="text-base">💡</span>
            <span>Selecting an airline profile in <strong>Tab 1</strong> unlocks Tabs 2 and 3 and initializes brand parameters.</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'CORE CONCEPT',
      title: 'Parameter Locks (🔒 vs 🔓)',
      tabLabel: 'Parameter Locks',
      subtitle: 'Why parameters are locked by default and how to unlock them for custom fine-tuning.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 space-y-1.5">
            <div className="flex items-center gap-2 font-hud font-bold text-amber-400 text-xs uppercase tracking-wider">
              <span>🔒 Why values start locked:</span>
            </div>
            <p className="text-[11px] leading-normal opacity-90">
              When an airline is selected, its <strong>Header Position</strong>, <strong>Sizes &amp; Offsets</strong>, and <strong>Atmospheric Gradients</strong> are initialized to exact brand-calibrated parameters. They are locked by default to prevent accidental misalignments while moving around the studio.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
            <div className="flex items-center gap-2 font-hud font-bold text-emerald-400 text-xs uppercase tracking-wider">
              <span>🔓 Unlocking for Fine-Tuned Adjustments:</span>
            </div>
            <p className="text-[11px] leading-normal opacity-90">
              Every image is framed differently. You can click the <strong>lock toggle</strong> on any parameter section to unlock it (<span className="text-emerald-400 font-bold">🔓</span>). Once unlocked, you can freely adjust sliders, numeric values, and colors. Click the inline reset icon (<span className="font-bold">↺</span>) anytime to return to the preset default.
            </p>
          </div>

          {/* Interactive Mini-Demo */}
          <div className="p-3 rounded-xl border border-inherit tutorial-callout space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-avionics uppercase panel-muted">Interactive Demo: Try the lock button below</span>
              <span className={`text-[10px] font-mono-avionics font-bold px-2 py-0.5 rounded ${demoLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                {demoLocked ? 'LOCKED (Preset Active)' : 'UNLOCKED (Fine-Tuning)'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg border border-inherit">
              <button
                type="button"
                onClick={() => setDemoLocked(!demoLocked)}
                className={`p-1.5 rounded text-xs flex items-center justify-center transition active:scale-95 shadow-sm ${demoLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}
                title={demoLocked ? 'Click to Unlock parameters' : 'Click to Lock parameters'}
              >
                <span className="text-sm">{demoLocked ? '🔒' : '🔓'}</span>
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-mono-avionics">
                  <span className={demoLocked ? 'opacity-40' : 'opacity-90'}>Header Y Position:</span>
                  <span className={demoLocked ? 'opacity-40' : 'font-bold'}>{demoSliderVal}px</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="350"
                  value={demoSliderVal}
                  disabled={demoLocked}
                  onChange={(e) => setDemoSliderVal(e.target.value)}
                  className="w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="button"
                disabled={demoLocked}
                onClick={() => setDemoSliderVal(175)}
                className="text-[10px] p-1.5 rounded border border-inherit tool-btn disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                title="Reset to calibrated default"
              >
                ↺ Reset
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'SCENERY & FRAMING',
      title: 'Backdrop Controls & Axis Locks',
      tabLabel: 'Backdrop',
      subtitle: 'Importing images, scaling, framing, and locking pan axes.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">1. Adding Images</h4>
            <p className="panel-muted">
              Drag and drop any image (PNG, JPEG, WebP) directly onto the canvas preview or the backdrop drop area, or use the file picker. Landscape orientation and a minimum of 1080p resolution work best for optimal banner sharpness.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">2. Canvas Pan &amp; Zoom</h4>
            <p className="panel-muted">
              Click and drag directly on the preview canvas to position your image. Use the mouse wheel or the Zoom slider to resize the image.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-inherit tutorial-callout space-y-1.5">
            <div className="flex items-center gap-2 font-mono-avionics font-bold text-xs">
              <span>🎯 Axis Locks: Lock X &amp; Lock Y</span>
            </div>
            <p className="text-[11px] panel-muted">
              Need to shift the image vertically without accidentally moving it left or right? Enable <strong>Lock X</strong> to constrain movement to the Y axis only, or <strong>Lock Y</strong> to pan strictly horizontally.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">3. Photo Grading</h4>
            <p className="panel-muted">
              Use <strong>Brightness</strong> and <strong>Contrast</strong> to grade and fine-tune your background photo so the airline branding and airport callout remain clear and legible.
            </p>
          </div>
        </div>
      ),
    },
    {
      badge: 'AIRPORT CALLOUT',
      title: 'Airport Database',
      tabLabel: 'Airport Database',
      subtitle: 'Instant offline airport lookup and automatic city designation.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">1. Instant 4-Letter ICAO Lookup</h4>
            <p className="panel-muted">
              Enter any 4-letter ICAO code into the <strong>ICAO Airport Code</strong> input. The studio queries its built-in global airport database in real time.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">2. Live City &amp; Country Auto-Fill</h4>
            <p className="panel-muted">
              As soon as a valid 4-letter code is recognized, the green <span className="text-emerald-400 font-mono-avionics font-bold">Auto-Filled ✓</span> badge appears, and the corresponding <strong>City Name and 2-Letter Country Code</strong> (e.g. <span className="font-mono-avionics font-bold">LONDON, GB</span>) is automatically placed directly beneath the ICAO code on the banner.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">3. 100% Offline Airport Database</h4>
            <p className="panel-muted">
              The entire lookup operates locally inside your browser using the bundled airport database. No network connection or external API calls are required to identify global airports.
            </p>
          </div>

          {/* Interactive Airport Lookup Mini-Demo (Powered by full offline airports.json database) */}
          <div className="p-3 rounded-xl border border-inherit tutorial-callout space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-avionics uppercase panel-muted">Interactive Demo: Try any global ICAO code</span>
              {isFourLetters ? (
                matchedCity ? (
                  <span className="text-[10px] text-emerald-400 font-mono-avionics font-bold flex items-center gap-1">
                    Auto-Filled ✓
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-mono-avionics font-bold flex items-center gap-1">
                    Invalid ICAO ✗
                  </span>
                )
              ) : (
                <span className="text-[10px] panel-muted font-mono-avionics">
                  Type 4 letters...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-24">
                <input
                  type="text"
                  maxLength={4}
                  value={demoIcao}
                  onChange={(e) => setDemoIcao(e.target.value.toUpperCase())}
                  placeholder="ICAO"
                  className="w-full px-2.5 py-1.5 text-sm font-black uppercase tracking-wider text-center app-input"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  readOnly
                  value={
                    isFourLetters
                      ? (matchedCity || '[INVALID AIRPORT]')
                      : 'Awaiting 4-letter ICAO...'
                  }
                  className={`w-full px-2.5 py-1.5 text-xs tracking-widest uppercase text-center app-input font-bold ${
                    isFourLetters && !matchedCity ? 'text-rose-400 border-rose-500/50' : 'opacity-90'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span className="text-[9px] font-mono-avionics panel-muted">Quick test:</span>
              {quickTestCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setDemoIcao(code)}
                  className={`text-[10px] font-mono-avionics px-2 py-0.5 rounded border border-inherit tool-btn transition ${demoIcao === code ? 'tutorial-btn-primary font-bold' : ''}`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'FINAL STEP',
      title: 'Exporting 5664 × 2500 Ultra-Res Banners',
      tabLabel: 'Export Banner',
      subtitle: 'Download production-ready banners in one click.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-3.5 rounded-xl border border-inherit tutorial-callout space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-hud font-bold text-sm">One-Click Banner Download</span>
              <span className="text-[10px] font-mono-avionics border border-inherit tool-btn font-bold px-2 py-0.5 rounded">
                5664 × 2500 px
              </span>
            </div>
            <p className="text-[11px] panel-muted">
              Whenever you are ready, click the primary <strong>Download Banner</strong> button located in the top-right header.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-hud font-bold text-xs uppercase tracking-wide">Export Specifications</h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px] panel-muted">
              <li>Hardware-accelerated 2D canvas rendering with pixel-perfect font kerning.</li>
              <li>High-quality JPEG compression balanced for rich color gradients and fast web loading.</li>
              <li>Pre-formatted for virtual airline websites, Discord server banners, VATSIM/IVAO forum headers, and flight dispatches.</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-inherit tutorial-callout flex items-center justify-between panel-muted text-[11px]">
            <span>Need to review this guide later?</span>
            <span className="font-mono-avionics font-bold">
              Click the <strong>?</strong> icon in the header anytime
            </span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ mask: 'none', WebkitMask: 'none' }}
        className="w-full max-w-3xl max-h-[88vh] m-auto flex flex-col rounded-2xl panel-card border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="h-14 px-5 border-b border-inherit flex items-center justify-between shrink-0 bg-black/5 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg border border-inherit tool-btn flex items-center justify-center font-bold text-xs font-mono-avionics">
              ?
            </div>
            <div>
              <span className="text-[9px] font-mono-avionics panel-label uppercase tracking-widest font-semibold block">
                {current.badge}
              </span>
              <div className="font-hud font-bold text-sm tracking-wide leading-none">{current.title}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-inherit tool-btn transition active:scale-95"
            title="Close Tutorial (Esc)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator Tabs (5-column equal grid, fits without any scrollbar/slider) */}
        <div className="grid grid-cols-5 border-b border-inherit px-3 py-2 gap-1 shrink-0 bg-black/5 dark:bg-black/10 text-[11px] font-hud">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`py-1.5 px-1 rounded-md transition font-semibold flex items-center justify-center gap-1 min-w-0 ${
                currentStep === idx
                  ? 'tutorial-tab-active font-bold'
                  : 'tutorial-tab-inactive'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  currentStep === idx
                    ? 'tutorial-badge-active'
                    : 'bg-zinc-500/20 panel-muted'
                }`}
              >
                {idx + 1}
              </span>
              <span className="truncate text-center">{s.tabLabel || s.title}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          <p className="panel-muted text-xs">{current.subtitle}</p>
          <div className="pt-2">{current.content}</div>
        </div>

        {/* Modal Footer */}
        <div className="h-14 px-5 border-t border-inherit flex items-center justify-between shrink-0 bg-black/5 dark:bg-black/20">
          <div className="text-[11px] font-mono-avionics panel-muted">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-lg border border-inherit tool-btn text-xs font-semibold transition active:scale-95"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="tutorial-btn-primary px-4 py-1.5 rounded-lg font-bold text-xs transition active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 shadow-md"
              >
                Start Designing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
