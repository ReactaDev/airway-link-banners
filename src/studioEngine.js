import AIRPORT_DATABASE from './assets/airports.json';
import ANZ from './assets/ANZ.png';
import CPA from './assets/CPA.png';
import FDX from './assets/FDX.png';
import FFT from './assets/FFT.png';
import ICE from './assets/ICE.png';
import JBU from './assets/JBU.png';
import QFA from './assets/QFA.png';
import UAL from './assets/UAL.png';

export function mountStudio(root) {
  const listeners = new AbortController();
  const getElement = (id) => root.querySelector(`#${CSS.escape(id)}`);

  const CANVAS_WIDTH = 5664;
  const CANVAS_HEIGHT = 2500;
  const STRICT_MAX_BYTES = 2000000; // 2.0 MB hard ceiling
  const BINARY_SEARCH_STEPS = 8;


  const fontFamilies = {
    "font-plus-jakarta": "'Plus Jakarta Sans', sans-serif",
    "font-urbanist": "'Urbanist', sans-serif",
    "font-outfit": "'Outfit', sans-serif",
    "font-dm-sans": "'DM Sans', sans-serif",
    "font-inter": "'Inter', sans-serif",
    "font-montserrat": "'Montserrat', sans-serif",
    "font-rajdhani": "'Rajdhani', sans-serif",
    "font-space-grotesk": "'Space Grotesk', sans-serif",
    "font-barlow": "'Barlow', sans-serif",
    "font-hud": "'Chakra Petch', sans-serif",
    "font-mono-avionics": "'JetBrains Mono', monospace",
    "font-teko": "'Teko', sans-serif",
    "font-oswald": "'Oswald', sans-serif",
    "font-syne": "'Syne', sans-serif",
    "Arial": "'Arial Black', 'Impact', sans-serif",
    "Roboto": "'Roboto', sans-serif"
  };

  // Embedded Official Cropped Virtual Airline Logos (Lossless PNG Data URLs)
  const embeddedLogoDataUrls = { ANZ, CPA, FDX, FFT, ICE, JBU, QFA, UAL };

  // Preloaded Image objects for each airline
  const loadedAirlineLogos = {};

  // Profiles for all virtual airlines with authentic brand colors, default logo heights, and fallback fonts
  const airlineProfiles = {
    ANZ: {
      name: "ANZ Virtual",
      suffix: "Focus Airport",
      brandColor: "#002030", // Deep New Zealand Pacific Teal
      defaultLogoHeight: 145,
      fontCss: "italic 800 {size}px 'Barlow', sans-serif",
      letterSpacing: "2px"
    },
    CPA: {
      name: "Cathay Pacific Virtual",
      suffix: "Focus Airport",
      brandColor: "#006564", // Cathay Brushwing Jade Green
      defaultLogoHeight: 175,
      fontCss: "700 {size}px 'Cinzel', serif",
      letterSpacing: "3px"
    },
    FDX: {
      name: "vFedEx",
      suffix: "Focus Airport",
      brandColor: "#4d148c", // FedEx Deep Purple
      defaultLogoHeight: 135,
      fontCss: "italic 900 {size}px 'Inter', sans-serif",
      letterSpacing: "-2px"
    },
    FFT: {
      name: "Frontier Virtual",
      suffix: "Focus Airport",
      brandColor: "#006644", // Frontier Spruce Green
      defaultLogoHeight: 165,
      fontCss: "italic 900 {size}px 'Montserrat', sans-serif",
      letterSpacing: "1px"
    },
    ICE: {
      name: "Icelandair Virtual",
      suffix: "Focus Airport",
      brandColor: "#001952", // Icelandair Deep Nordic Blue
      defaultLogoHeight: 175,
      fontCss: "800 {size}px 'Outfit', sans-serif",
      letterSpacing: "3px"
    },
    JBU: {
      name: "JetBlue Virtual",
      suffix: "Focus Airport",
      brandColor: "#00205b", // JetBlue True Blue
      defaultLogoHeight: 170,
      fontCss: "700 {size}px 'Prompt', sans-serif",
      letterSpacing: "1px"
    },
    QFA: {
      name: "Qantas Virtual",
      suffix: "Focus Airport",
      brandColor: "#e40000", // Qantas Flying Kangaroo Red
      defaultLogoHeight: 165,
      fontCss: "italic 800 {size}px 'Montserrat', sans-serif",
      letterSpacing: "3px"
    },
    UAL: {
      name: "vUAL",
      suffix: "Focus Airport",
      brandColor: "#002244", // United Deep Navy
      defaultLogoHeight: 165,
      fontCss: "900 {size}px 'Montserrat', sans-serif",
      letterSpacing: "1px"
    },
    CUSTOM: {
      name: "Custom Airline",
      suffix: "Focus Airport",
      brandColor: "#003b6f",
      defaultLogoHeight: 160,
      fontCss: "800 {size}px 'Montserrat', sans-serif",
      letterSpacing: "2px"
    }
  };

  // App State
  const state = {
    // Selected Airline & Unified Header (Starts unselected)
    selectedAirlineKey: '',
    headerMode: 'logo', // 'logo' | 'text'
    airlineName: "",
    suffixName: "Focus Airport",
    topBrandColor: "#002030",
    customOverlayImage: null,
    customLogoOverrides: {}, // per-airline user-uploaded logo Image overrides

    // Header Logo / Typography & Placement
    hdrAirlineSize: 145, // Controls Logo Height in 'logo' mode, or font size in 'text' mode
    hdrSuffixSize: 148,
    logoOffsetY: 0,
    hdrDividerGap: 44,
    hdrShadow: true,
    logoForceWhite: false,
    hdrPosX: 180,
    hdrPosY: 175,

    // Gradients (Colors, Individual Opacity & Depths)
    botBrandColor: "#000000",
    topGradOpacity: 75, // 0 - 100% (default: 75%)
    botGradOpacity: 75, // 0 - 100% (default: 75%)
    topGradDepth: 500,
    botGradDepth: 500,

    // Custom Profile Feature Toggles
    showHeaderBrand: true,
    showAirlineName: true,
    showSuffixText: true,
    showGradients: true,
    showTopGradient: true,
    showBottomGradient: true,
    showAirportText: true,

    // Moveable / Resizable Custom Text Box Overlay
    customBox: {
      enabled: false,
      text: "Custom Text",
      x: 180,
      y: 1950,
      width: 2200,
      height: 280,
      bgColor: "#000000",
      bgOpacity: 65, // 0 - 100%
      textColor: "#ffffff",
      fontSize: 110,
      font: "font-montserrat",
      align: "center", // "left" | "center" | "right"
      vAlign: "middle", // "top" | "middle" | "bottom"
      paddingX: 40,
      paddingY: 30,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.25)"
    },

    // Viewport Drag/Resize target for Custom Box
    activeDragHandle: null, // null | 'box' | 'resize-se'
    boxDragStartX: 0,
    boxDragStartY: 0,
    boxOrigX: 0,
    boxOrigY: 0,
    boxOrigW: 0,
    boxOrigH: 0,

    // Background Image & Adjustments
    bgImage: null,
    cachedUserImage: null, // Preserves user uploaded / URL photo when previewing synthetic light/dark scenery
    activePreviewBg: null, // null | 'light' | 'dark' 
    bgZoom: 1.0,
    bgPanX: 0,
    bgPanY: 0,
    lockPanX: false,
    lockPanY: false,
    isForceScaled: false,
    bgBright: 100,
    bgContrast: 105,
    bgSat: 100,
    botScrim: 45,

    // Airport Text Details: defaults to empty in inputs, fallbacks to "ICAO" and "CITY" on canvas
    airport: {
      icao: "",
      city: "",
      font: "font-urbanist",
      icaoWeight: "700",
      cityWeight: "500",
      icaoSize: 320,
      citySize: 105,
      gap: 40,
      posX: 4900,
      posY: 2180,
      shadow: true,
      legibilityMode: "dark", // "dark" | "light" | "outline" | "soft"
      legibilityIntensity: 100 // 20 - 150%
    },

    // Viewport Interactive Zoom & Pan
    viewportZoom: 1.0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartPanX: 0,
    dragStartPanY: 0
  };

  // DOM References
  const renderCanvas = getElement('renderCanvas');
  const renderCtx = renderCanvas.getContext('2d');
  const previewCanvas = getElement('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d');
  const bannerContainer = getElement('bannerContainer');
  const viewportContainer = getElement('viewportContainer');


  // ==========================================
  // PERSISTENCE ENGINE: IndexedDB with localStorage fallback
  // Automatically persists custom uploaded logos across refreshes & sessions
  // ==========================================
  const DB_NAME = "AirwaylinkBannerCreatorDB";
  const DB_VERSION = 1;
  const LOGO_STORE = "airline_logos";
  const CUSTOM_AIRLINES_KEY = "airwaylink_custom_airlines";

  // Persistence helper: Read list of user-created custom airline profiles
  function loadCustomAirlineRecords() {
    try {
      const raw = localStorage.getItem(CUSTOM_AIRLINES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("Failed to parse custom airlines:", err);
      return [];
    }
  }

  // Persistence helper: Save list of user-created custom airline profiles
  function saveCustomAirlineRecords(records) {
    try {
      localStorage.setItem(CUSTOM_AIRLINES_KEY, JSON.stringify(records));
    } catch (err) {
      console.error("Failed to save custom airlines:", err);
    }
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(LOGO_STORE)) {
          db.createObjectStore(LOGO_STORE, { keyPath: "code" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null); // graceful fallback
    });
  }

  async function saveLogoToStorage(airlineCode, dataUrl) {
    try {
      const db = await openDatabase();
      if (db) {
        await new Promise((resolve, reject) => {
          const tx = db.transaction([LOGO_STORE], "readwrite");
          const store = tx.objectStore(LOGO_STORE);
          store.put({ code: airlineCode, dataUrl: dataUrl, updatedAt: Date.now() });
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      }
    } catch (err) {
      console.warn("IndexedDB save failed, trying localStorage:", err);
    }
    try {
      localStorage.setItem(`airwaylink_logo_${airlineCode}`, dataUrl);
    } catch (e) {
      // LocalStorage quota might be tight if image is large, IndexedDB takes care of it
    }
  }

  async function loadAllStoredLogos() {
    const result = {};
    try {
      const db = await openDatabase();
      if (db) {
        const records = await new Promise((resolve) => {
          const tx = db.transaction([LOGO_STORE], "readonly");
          const store = tx.objectStore(LOGO_STORE);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        for (const item of records) {
          if (item && item.code && item.dataUrl) {
            result[item.code] = item.dataUrl;
          }
        }
      }
    } catch (err) {
      console.warn("IndexedDB load failed:", err);
    }

    // Check localStorage for any codes not in IndexedDB
    const storedCustomList = loadCustomAirlineRecords();
    const customCodes = storedCustomList.map(item => item.code);
    const allCodes = ["ANZ", "CPA", "FDX", "FFT", "ICE", "JBU", "QFA", "UAL", "CUSTOM", ...customCodes];
    for (const code of allCodes) {
      if (!result[code]) {
        const lsData = localStorage.getItem(`airwaylink_logo_${code}`);
        if (lsData) result[code] = lsData;
      }
    }
    return result;
  }

  async function removeLogoFromStorage(airlineCode) {
    try {
      const db = await openDatabase();
      if (db) {
        await new Promise((resolve) => {
          const tx = db.transaction([LOGO_STORE], "readwrite");
          const store = tx.objectStore(LOGO_STORE);
          store.delete(airlineCode);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        });
      }
    } catch (err) {}
    try {
      localStorage.removeItem(`airwaylink_logo_${airlineCode}`);
    } catch (err) {}
  }

  // Preload all embedded airline logos
  async function preloadEmbeddedLogos() {
    const defaultPromises = Object.entries(embeddedLogoDataUrls).map(([code, dataUrl]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loadedAirlineLogos[code] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    });
    await Promise.all(defaultPromises);

    // Now restore any user-uploaded logos saved in persistent storage
    const storedLogos = await loadAllStoredLogos();
    const overridePromises = Object.entries(storedLogos).map(([code, dataUrl]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          state.customLogoOverrides[code] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    });
    await Promise.all(overridePromises);
  }

  // Helper: Auto-trim transparent borders from an uploaded logo image
  function trimTransparentImage(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth || img.width;
    tempCanvas.height = img.naturalHeight || img.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const { width, height } = tempCanvas;
    const imgData = ctx.getImageData(0, 0, width, height).data;
    let top = height, left = width, right = 0, bottom = 0;
    let foundPixel = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = imgData[(y * width + x) * 4 + 3];
        if (alpha > 8) {
          foundPixel = true;
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }

    if (!foundPixel) return img;

    const trimW = right - left + 1;
    const trimH = bottom - top + 1;
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimW;
    trimmedCanvas.height = trimH;
    trimmedCanvas.getContext('2d').drawImage(tempCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);

    const trimmedImg = new Image();
    trimmedImg.crossOrigin = "anonymous";
    trimmedImg.src = trimmedCanvas.toDataURL('image/png');
    return trimmedImg;
  }

  // Helper: Create pure-white silhouette canvas from logo image
  function createWhiteSilhouetteCanvas(img, targetW, targetH) {
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round(targetW));
    off.height = Math.max(1, Math.round(targetH));
    const octx = off.getContext('2d');
    octx.drawImage(img, 0, 0, off.width, off.height);
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = '#ffffff';
    octx.fillRect(0, 0, off.width, off.height);
    return off;
  }

  // Tab Navigation
  const tabBtnAirline = getElement('tabBtnAirline');
  const tabBtnScenery = getElement('tabBtnScenery');
  const tabBtnText = getElement('tabBtnText');
  const tabContentAirline = getElement('tabContentAirline');
  const tabContentScenery = getElement('tabContentScenery');
  const tabContentText = getElement('tabContentText');

  let activeTabId = 'airline';
  function setActiveTab(tab) {
    activeTabId = tab;
    const isDark = document.body.classList.contains('theme-dark');
    const inactiveClass = isDark 
      ? "flex-1 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition font-medium text-xs font-hud"
      : "flex-1 py-1 rounded-md text-zinc-600 hover:text-black hover:bg-black/[0.04] transition font-medium text-xs font-hud";

    const activeClass = isDark
      ? "flex-1 py-1 rounded-md text-white bg-[#383838] border border-white/10 font-bold transition text-xs font-hud shadow-sm"
      : "flex-1 py-1 rounded-md text-black bg-white border border-black/10 font-bold transition text-xs font-hud shadow-sm";

    [tabBtnAirline, tabBtnScenery, tabBtnText].forEach(b => {
      b.className = inactiveClass;
    });
    [tabContentAirline, tabContentScenery, tabContentText].forEach(c => c.classList.add('hidden'));

    if (tab === 'airline') {
      tabBtnAirline.className = activeClass;
      tabContentAirline.classList.remove('hidden');
    } else if (tab === 'scenery') {
      tabBtnScenery.className = activeClass;
      tabContentScenery.classList.remove('hidden');
    } else if (tab === 'text') {
      tabBtnText.className = activeClass;
      tabContentText.classList.remove('hidden');
    }
  }

  tabBtnAirline.addEventListener('click', () => setActiveTab('airline'), { signal: listeners.signal });
  tabBtnScenery.addEventListener('click', () => setActiveTab('scenery'), { signal: listeners.signal });
  tabBtnText.addEventListener('click', () => setActiveTab('text'), { signal: listeners.signal });

  // --- PROCEDURAL DEFAULT SCENERY (Denver Mountains Atmosphere) ---
  function renderStandbyCanvas() {
    const temp = document.createElement('canvas');
    temp.width = CANVAS_WIDTH;
    temp.height = CANVAS_HEIGHT;
    const ctx = temp.getContext('2d');

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    sky.addColorStop(0, '#0f2b48');
    sky.addColorStop(0.35, '#255d83');
    sky.addColorStop(0.65, '#4082a6');
    sky.addColorStop(0.95, '#76abc5');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Cloud strata
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 450, 400 + (i % 3) * 120, 600, 140, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mountain ranges
    ctx.fillStyle = "#1e3c54";
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT * 0.7);
    ctx.lineTo(CANVAS_WIDTH * 0.2, CANVAS_HEIGHT * 0.52);
    ctx.lineTo(CANVAS_WIDTH * 0.45, CANVAS_HEIGHT * 0.45);
    ctx.lineTo(CANVAS_WIDTH * 0.7, CANVAS_HEIGHT * 0.56);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.48);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(0, CANVAS_HEIGHT);
    ctx.fill();

    // Foreground skyline silhouettes
    ctx.fillStyle = "#102231";
    for (let x = 100; x < CANVAS_WIDTH; x += 180) {
      const h = 400 + (Math.sin(x) + 1) * 350;
      ctx.fillRect(x, CANVAS_HEIGHT - h, 140, h);
    }

    state.bgImage = temp;
    const bgBadge = getElement('bgStatusBadge');
    if (bgBadge) {
      bgBadge.textContent = 'Default Scenery Ready';
      bgBadge.className = 'text-[10px] text-emerald-500 font-mono-avionics font-bold';
    }
    renderAll();
  }


  // Procedural Generator: Bright Daylight Snowy Mountain Scenery
  function createSyntheticLightBgImage() {
    const temp = document.createElement('canvas');
    temp.width = CANVAS_WIDTH;
    temp.height = CANVAS_HEIGHT;
    const ctx = temp.getContext('2d');

    // Bright sunlit azure sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    sky.addColorStop(0, '#7ecbf7');
    sky.addColorStop(0.35, '#bce5fc');
    sky.addColorStop(0.7, '#e4f5fd');
    sky.addColorStop(1, '#ffffff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Bright fluffy cumulus clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 350, 450 + (i % 4) * 90, 500, 160, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snow-capped sunlit mountain range
    ctx.fillStyle = "#dbeafe";
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT * 0.75);
    ctx.lineTo(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.48);
    ctx.lineTo(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.42);
    ctx.lineTo(CANVAS_WIDTH * 0.78, CANVAS_HEIGHT * 0.52);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.44);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(0, CANVAS_HEIGHT);
    ctx.fill();

    // Pure white snow ridges
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH * 0.4, CANVAS_HEIGHT * 0.45);
    ctx.lineTo(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.42);
    ctx.lineTo(CANVAS_WIDTH * 0.62, CANVAS_HEIGHT * 0.47);
    ctx.lineTo(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.55);
    ctx.closePath();
    ctx.fill();

    return temp;
  }

  // Procedural Generator: Deep Night Atmosphere Scenery
  function createSyntheticDarkBgImage() {
    const temp = document.createElement('canvas');
    temp.width = CANVAS_WIDTH;
    temp.height = CANVAS_HEIGHT;
    const ctx = temp.getContext('2d');

    // Deep dark night sky
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    sky.addColorStop(0, '#030712');
    sky.addColorStop(0.4, '#090d16');
    sky.addColorStop(0.8, '#0b1120');
    sky.addColorStop(1, '#020617');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Night runway tarmac silhouette
    ctx.fillStyle = "#02040a";
    ctx.fillRect(0, CANVAS_HEIGHT * 0.65, CANVAS_WIDTH, CANVAS_HEIGHT * 0.35);

    // Distant amber & cyan airport runway lights
    for (let x = 80; x < CANVAS_WIDTH; x += 120) {
      ctx.fillStyle = (x % 240 === 0) ? "rgba(56, 189, 248, 0.85)" : "rgba(251, 191, 36, 0.85)";
      ctx.beginPath();
      ctx.arc(x, CANVAS_HEIGHT * 0.68 + (Math.sin(x) * 15), 4, 0, Math.PI * 2);
      ctx.fill();
    }

    return temp;
  }

  // Helper: Get active airline logo Image object (with immediate on-demand fallback)
  function getActiveAirlineLogo() {
    const key = state.selectedAirlineKey;
    if (!key) return null;
    if (state.customLogoOverrides[key]) {
      return state.customLogoOverrides[key];
    }
    if (loadedAirlineLogos[key]) {
      return loadedAirlineLogos[key];
    }
    // Immediate fallback if preloading was in progress or delayed
    if (embeddedLogoDataUrls[key]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => renderAll();
      img.src = embeddedLogoDataUrls[key];
      loadedAirlineLogos[key] = img;
      return img;
    }
    return null;
  }

  // Update sidebar logo preview card
  function updateSidebarLogoPreview() {
    const previewBox = getElement('logoPreviewBox');
    const previewImg = getElement('sidebarLogoPreview');
    const resetBtn = getElement('btnResetAirlineLogo');

    if (!state.selectedAirlineKey) {
      // Nothing selected: completely blank box
      previewBox.style.background = '#090e18';
      previewImg.removeAttribute('src');
      previewImg.classList.add('hidden');
      if (resetBtn) resetBtn.classList.add('hidden');
      return;
    }

    previewBox.style.background = `linear-gradient(180deg, ${state.topBrandColor} 0%, #090d16 100%)`;

    const activeLogo = getActiveAirlineLogo();
    if (activeLogo && activeLogo.src) {
      previewImg.src = activeLogo.src;
      previewImg.classList.remove('hidden');
      previewImg.style.filter = state.logoForceWhite ? 'brightness(0) invert(1) drop-shadow(0 2px 6px rgba(0,0,0,0.85))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.85))';
    } else {
      previewImg.removeAttribute('src');
      previewImg.classList.add('hidden');
    }

    const uploadBtnText = getElement('uploadLogoBtnText');
    if (uploadBtnText) {
      uploadBtnText.textContent = state.selectedAirlineKey === 'CUSTOM' ? '📁 Upload Logo PNG' : '📁 Replace / Upload Logo PNG';
    }

    if (state.customLogoOverrides[state.selectedAirlineKey] && embeddedLogoDataUrls[state.selectedAirlineKey]) {
      if (resetBtn) resetBtn.classList.remove('hidden');
    } else {
      if (resetBtn) resetBtn.classList.add('hidden');
    }
  }

  // --- FULL RESOLUTION (5664 x 2500) RENDER ENGINE ---
  function drawFullCanvas(targetCtx) {
    targetCtx.save();
    targetCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Scenic Background Photo with Zoom, Pan and Grading
    if (!state.bgImage) {
      renderStandbyCanvas();
    }

    if (state.bgImage) {
      targetCtx.save();
      targetCtx.filter = `brightness(${state.bgBright}%) contrast(${state.bgContrast}%) saturate(${state.bgSat}%)`;

      if (state.isForceScaled) {
        // Force image to exactly 5664 × 2500 centered
        const drawW = CANVAS_WIDTH * state.bgZoom;
        const drawH = CANVAS_HEIGHT * state.bgZoom;
        const drawX = (CANVAS_WIDTH - drawW) / 2 + (state.lockPanX ? 0 : state.bgPanX);
        const drawY = (CANVAS_HEIGHT - drawH) / 2 + (state.lockPanY ? 0 : state.bgPanY);
        targetCtx.drawImage(state.bgImage, drawX, drawY, drawW, drawH);
      } else {
        // Normal aspect ratio preserving fit
        const imgRatio = state.bgImage.width / state.bgImage.height;
        const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
        let drawW, drawH;

        if (imgRatio > canvasRatio) {
          drawH = CANVAS_HEIGHT * state.bgZoom;
          drawW = drawH * imgRatio;
        } else {
          drawW = CANVAS_WIDTH * state.bgZoom;
          drawH = drawW / imgRatio;
        }

        const drawX = (CANVAS_WIDTH - drawW) / 2 + (state.lockPanX ? 0 : state.bgPanX);
        const drawY = (CANVAS_HEIGHT - drawH) / 2 + (state.lockPanY ? 0 : state.bgPanY);

        targetCtx.drawImage(state.bgImage, drawX, drawY, drawW, drawH);
      }
      targetCtx.restore();
    } else {
      const grad = targetCtx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#09131f');
      grad.addColorStop(1, '#02060b');
      targetCtx.fillStyle = grad;
      targetCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 1b. Optional Bottom Scrim Vignette (from Photo Grading & Scrim panel)
    if (state.botScrim > 0) {
      targetCtx.save();
      const scrimHeight = Math.round(CANVAS_HEIGHT * 0.45);
      const scrimY = CANVAS_HEIGHT - scrimHeight;
      const scrimGrad = targetCtx.createLinearGradient(0, CANVAS_HEIGHT, 0, scrimY);
      scrimGrad.addColorStop(0, `rgba(0, 0, 0, ${(state.botScrim / 100) * 0.7})`);
      scrimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      targetCtx.fillStyle = scrimGrad;
      targetCtx.fillRect(0, scrimY, CANVAS_WIDTH, scrimHeight);
      targetCtx.restore();
    }

    // 2. TOP GRADIENT (Top color to transparent with individual opacity control)
    const allowTopGrad = state.selectedAirlineKey === 'CUSTOM' ? (state.showGradients && state.showTopGradient) : true;
    if (allowTopGrad && state.topGradDepth > 0 && state.topGradOpacity > 0) {
      targetCtx.save();
      const topAlpha = state.topGradOpacity / 100;
      const topGrad = targetCtx.createLinearGradient(0, 0, 0, state.topGradDepth);
      topGrad.addColorStop(0, hexToRgba(state.topBrandColor, topAlpha));
      topGrad.addColorStop(0.65, hexToRgba(state.topBrandColor, topAlpha * 0.75));
      topGrad.addColorStop(1, hexToRgba(state.topBrandColor, 0.0));
      targetCtx.fillStyle = topGrad;
      targetCtx.fillRect(0, 0, CANVAS_WIDTH, state.topGradDepth);
      targetCtx.restore();
    }

    // 3. BOTTOM GRADIENT (Bottom color to transparent with individual opacity control)
    const allowBotGrad = state.selectedAirlineKey === 'CUSTOM' ? (state.showGradients && state.showBottomGradient) : true;
    if (allowBotGrad && state.botGradDepth > 0 && state.botGradOpacity > 0) {
      targetCtx.save();
      const botAlpha = state.botGradOpacity / 100;
      const botGradY = CANVAS_HEIGHT - state.botGradDepth;
      const botGrad = targetCtx.createLinearGradient(0, CANVAS_HEIGHT, 0, botGradY);
      botGrad.addColorStop(0, hexToRgba(state.botBrandColor, botAlpha));
      botGrad.addColorStop(0.65, hexToRgba(state.botBrandColor, botAlpha * 0.75));
      botGrad.addColorStop(1, hexToRgba(state.botBrandColor, 0.0));
      targetCtx.fillStyle = botGrad;
      targetCtx.fillRect(0, botGradY, CANVAS_WIDTH, state.botGradDepth);
      targetCtx.restore();
    }

    // 4. UNIFIED TOP HEADER: [OFFICIAL AIRLINE LOGO or TEXT] | [FOCUS AIRPORT]
    if (!state.selectedAirlineKey) {
      // Notice displayed on canvas while no airline is selected (centered on canvas)
      targetCtx.save();
      targetCtx.shadowColor = "rgba(0, 0, 0, 0.95)";
      targetCtx.shadowOffsetX = 4;
      targetCtx.shadowOffsetY = 6;
      targetCtx.shadowBlur = 20;

      const noticeText = "PLEASE SELECT A PROFILE TO BEGIN";
      targetCtx.font = "700 80px 'Chakra Petch', 'JetBrains Mono', monospace";
      targetCtx.fillStyle = "#ffffff";
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = "6px";
        targetCtx.fillText(noticeText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(noticeText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }
      targetCtx.restore();
    } else {
    targetCtx.save();
    if (state.hdrShadow) {
      targetCtx.shadowColor = "rgba(0, 0, 0, 0.92)";
      targetCtx.shadowOffsetX = 3;
      targetCtx.shadowOffsetY = 6;
      targetCtx.shadowBlur = 18;
    }

    let curX = state.hdrPosX;
    const curY = state.hdrPosY;
    const activeLogo = getActiveAirlineLogo();
    const hasDimensions = activeLogo && ((activeLogo.naturalWidth && activeLogo.naturalWidth > 0) || (activeLogo.width && activeLogo.width > 0));
    const useLogo = state.headerMode === 'logo' && activeLogo && (activeLogo.complete || hasDimensions);

    if (activeLogo && !activeLogo.complete && !activeLogo._hasRenderHook) {
      activeLogo._hasRenderHook = true;
      activeLogo.addEventListener('load', () => renderAll(), { signal: listeners.signal, once: true });
    }

    // Feature toggles for Custom profile (or default on for presets)
    const isCustomProfile = state.selectedAirlineKey === 'CUSTOM';
    const allowHeaderBrand = isCustomProfile ? state.showHeaderBrand : true;
    const renderAirlinePart = allowHeaderBrand && (isCustomProfile ? state.showAirlineName : true);
    const renderSuffixPart = allowHeaderBrand && (isCustomProfile ? state.showSuffixText : Boolean(state.suffixName));

    let drewFirstItem = false;

    if (renderAirlinePart) {
      if (useLogo && hasDimensions) {
        // A) Draw Official Airline Logo Image
        const imgW = activeLogo.naturalWidth || activeLogo.width;
        const imgH = activeLogo.naturalHeight || activeLogo.height;
        const aspect = imgW / imgH;
        const drawH = state.hdrAirlineSize;
        const drawW = Math.round(drawH * aspect);
        const drawY = Math.round(curY - (drawH / 2) + state.logoOffsetY);

        if (state.logoForceWhite) {
          const whiteLogoCanvas = createWhiteSilhouetteCanvas(activeLogo, drawW, drawH);
          targetCtx.drawImage(whiteLogoCanvas, curX, drawY, drawW, drawH);
        } else {
          targetCtx.drawImage(activeLogo, curX, drawY, drawW, drawH);
        }
        curX += drawW + state.hdrDividerGap;
        drewFirstItem = true;
      } else if (state.airlineName && state.airlineName.trim().length > 0) {
        // Fallback: Airline Name Text
        const profile = airlineProfiles[state.selectedAirlineKey] || airlineProfiles.ANZ;
        const airlineFontStr = profile.fontCss.replace('{size}', state.hdrAirlineSize);
        targetCtx.font = airlineFontStr;
        targetCtx.fillStyle = "#ffffff";
        targetCtx.textBaseline = "middle";

        if (targetCtx.letterSpacing !== undefined && profile.letterSpacing) {
          targetCtx.letterSpacing = profile.letterSpacing;
          targetCtx.fillText(state.airlineName, curX, curY);
          curX += targetCtx.measureText(state.airlineName).width + state.hdrDividerGap;
          targetCtx.letterSpacing = "0px";
        } else {
          targetCtx.fillText(state.airlineName, curX, curY);
          curX += targetCtx.measureText(state.airlineName).width + state.hdrDividerGap;
        }
        drewFirstItem = true;
      }
    }

    // B) Subtle Vertical Pipe Divider "|" (Render only if both airline/logo and suffix are visible)
    if (drewFirstItem && renderSuffixPart && state.suffixName && state.suffixName.trim().length > 0) {
      targetCtx.font = `300 ${Math.round(state.hdrSuffixSize * 0.85)}px 'Inter', sans-serif`;
      targetCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
      targetCtx.textBaseline = "middle";
      targetCtx.fillText("|", curX, curY - 2);
      curX += targetCtx.measureText("|").width + state.hdrDividerGap;
    }

    // C) "Focus Airport" Suffix
    if (renderSuffixPart && state.suffixName && state.suffixName.trim().length > 0) {
      targetCtx.font = `500 ${state.hdrSuffixSize}px 'Inter', sans-serif`;
      targetCtx.fillStyle = "#ffffff";
      targetCtx.textBaseline = "middle";
      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = "3px";
        targetCtx.fillText(state.suffixName, curX, curY);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(state.suffixName, curX, curY);
      }
    }
    targetCtx.restore();
    } // end else for selectedAirlineKey

    // Custom full-canvas overlay image fallback/override if user uploaded one
    if (state.customOverlayImage) {
      targetCtx.save();
      targetCtx.drawImage(state.customOverlayImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      targetCtx.restore();
    }

    // 5. BOTTOM-RIGHT AIRPORT TITLE GROUP (ICAO + CENTERED CITY, NO SEPARATOR LINE)
    // Displays ICAO and CITY when an airline is selected or when user enters text
    const allowAirportGroup = state.selectedAirlineKey === 'CUSTOM' ? state.showAirportText : true;
    const hasCustomText = Boolean((state.airport.icao && state.airport.icao.trim().length > 0) || (state.airport.city && state.airport.city.trim().length > 0));
    const shouldRenderAirportText = allowAirportGroup && (Boolean(state.selectedAirlineKey) || hasCustomText);

    const icaoStr = (state.airport.icao && state.airport.icao.trim().length > 0) 
      ? state.airport.icao.trim() 
      : (state.selectedAirlineKey ? "ICAO" : "");
    const cityStr = (state.airport.city && state.airport.city.trim().length > 0) 
      ? state.airport.city.trim() 
      : (state.selectedAirlineKey ? "CITY" : "");

    if (shouldRenderAirportText && (icaoStr || cityStr)) {
      targetCtx.save();
      const aFont = fontFamilies[state.airport.font] || "'Montserrat', sans-serif";

      const intensityFactor = (state.airport.legibilityIntensity || 100) / 100;
      const mode = state.airport.legibilityMode || "dark";

      if (state.airport.shadow) {
        if (mode === "dark") {
          // Dark BG: Optimized for dark/medium backgrounds (subtle deep shadow + soft ambient blur)
          targetCtx.shadowColor = `rgba(0, 0, 0, ${Math.min(1.0, 0.85 * intensityFactor)})`;
          targetCtx.shadowOffsetX = Math.round(4 * intensityFactor);
          targetCtx.shadowOffsetY = Math.round(8 * intensityFactor);
          targetCtx.shadowBlur = Math.round(22 * intensityFactor);
        } else if (mode === "lightbg") {
          // Light BG: Maximum dark contrast for bright daylight, white clouds, or snow scenes
          targetCtx.shadowColor = `rgba(0, 0, 0, ${Math.min(1.0, 1.0 * intensityFactor)})`;
          targetCtx.shadowOffsetX = Math.round(6 * intensityFactor);
          targetCtx.shadowOffsetY = Math.round(12 * intensityFactor);
          targetCtx.shadowBlur = Math.round(36 * intensityFactor);
        } else if (mode === "light") {
          // Luminous halo glow for dark night scenes or deep tarmac
          targetCtx.shadowColor = `rgba(255, 255, 255, ${Math.min(0.9, 0.75 * intensityFactor)})`;
          targetCtx.shadowOffsetX = 0;
          targetCtx.shadowOffsetY = 0;
          targetCtx.shadowBlur = Math.round(34 * intensityFactor);
        } else if (mode === "outline") {
          // Tight high-contrast stroke silhouette
          targetCtx.shadowColor = `rgba(0, 0, 0, ${Math.min(1.0, 1.0 * intensityFactor)})`;
          targetCtx.shadowOffsetX = 0;
          targetCtx.shadowOffsetY = 0;
          targetCtx.shadowBlur = Math.round(14 * intensityFactor);
        } else if (mode === "soft") {
          // Subtle cinematic diffused shadow
          targetCtx.shadowColor = `rgba(0, 0, 0, ${Math.min(0.8, 0.65 * intensityFactor)})`;
          targetCtx.shadowOffsetX = Math.round(3 * intensityFactor);
          targetCtx.shadowOffsetY = Math.round(5 * intensityFactor);
          targetCtx.shadowBlur = Math.round(16 * intensityFactor);
        }
      }

      const anchorX = state.airport.posX; // Center anchor in bottom right
      const icaoY = state.airport.posY;

      // Measure & Draw ICAO (Anchor stays fixed in plane)
      const iWeight = state.airport.icaoWeight || "700";
      targetCtx.font = `${iWeight} ${state.airport.icaoSize}px ${aFont}`;
      targetCtx.fillStyle = "#ffffff";
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "alphabetic";
      targetCtx.fillText(icaoStr, anchorX, icaoY);

      const icaoMeasuredWidth = targetCtx.measureText(icaoStr).width;

      // City Name Centered Below ICAO:
      // City can freely extend past ICAO width centered under it.
      // Once it approaches the right edge (within 20px boundary), dynamically shrink font size down to readable floor (52px).
      // If it still exceeds the 20px edge limit at readable size, turn text red and trigger character limit warning.
      const cWeight = state.airport.cityWeight || "500";
      let effectiveCitySize = state.airport.citySize;
      const letterSpacingPx = 6;
      const MIN_READABLE_CITY_SIZE = 52; // Prevents city from shrinking into unreadable microtext
      const EDGE_MARGIN_LIMIT = 20; // 20px safety buffer from right edge

      // Maximum available half-width from anchorX to right edge
      const maxAllowedHalfWidth = (CANVAS_WIDTH - EDGE_MARGIN_LIMIT) - anchorX;

      // Helper to measure city text width at a given font size
      const measureCity = (text, size) => {
        targetCtx.font = `${cWeight} ${size}px ${aFont}`;
        const rawW = targetCtx.measureText(text).width;
        const trackingExtra = (targetCtx.letterSpacing !== undefined) ? (text.length * letterSpacingPx) : 0;
        return rawW + trackingExtra;
      };

      let displayCityText = cityStr;
      let currentCityWidth = measureCity(displayCityText, effectiveCitySize);

      // If the right half of the centered text reaches within 20px of the edge, shrink font down to readable floor
      if ((currentCityWidth / 2) > maxAllowedHalfWidth) {
        while (effectiveCitySize > MIN_READABLE_CITY_SIZE && (currentCityWidth / 2) > maxAllowedHalfWidth) {
          effectiveCitySize -= 2;
          currentCityWidth = measureCity(displayCityText, effectiveCitySize);
        }
      }

      // If even at minimum readable size (52px) it still crosses into the 20px edge zone,
      // it means the name has too many characters: flag warning and turn red
      const cityRightEdgeX = anchorX + (currentCityWidth / 2);
      const marginFromRightEdge = CANVAS_WIDTH - cityRightEdgeX;
      const isTooCloseToEdge = marginFromRightEdge <= EDGE_MARGIN_LIMIT;

      // Turn red if invalid airport code OR if too close to right edge (< 20px)
      const isInvalidAirport = displayCityText === "[INVALID AIRPORT]";
      const cityTextColor = (isInvalidAirport || isTooCloseToEdge) ? "#ef4444" : "#ffffff";

      // Update UI warning badge with character count guidance
      const warningBadge = getElement('cityEdgeWarningBadge');
      const cityInputElem = getElement('cityInput');
      if (warningBadge) {
        if (isTooCloseToEdge) {
          warningBadge.textContent = `⚠️ Too Long — Character limit reached (${Math.round(marginFromRightEdge)}px to edge)`;
          warningBadge.classList.remove('hidden');
          if (cityInputElem) cityInputElem.classList.add('border-rose-500', 'text-rose-400');
        } else {
          warningBadge.classList.add('hidden');
          if (cityInputElem) cityInputElem.classList.remove('border-rose-500', 'text-rose-400');
        }
      }

      // Draw City directly CENTERED below ICAO (NO Separator Line)
      const cityY = icaoY + effectiveCitySize + state.airport.gap;
      targetCtx.font = `${cWeight} ${effectiveCitySize}px ${aFont}`;
      targetCtx.fillStyle = cityTextColor;
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "alphabetic";

      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = `${letterSpacingPx}px`;
        targetCtx.fillText(displayCityText, anchorX, cityY);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(displayCityText, anchorX, cityY);
      }

      targetCtx.restore();
    }

    // 6. CUSTOM RESIZABLE & MOVEABLE TEXT BOX OVERLAY
    if (state.selectedAirlineKey === 'CUSTOM' && state.customBox.enabled && state.customBox.text) {
      targetCtx.save();
      const box = state.customBox;
      const boxAlpha = (box.bgOpacity || 0) / 100;

      // Draw Box Background (with rounded corners)
      if (boxAlpha > 0) {
        targetCtx.save();
        targetCtx.fillStyle = hexToRgba(box.bgColor || "#000000", boxAlpha);
        targetCtx.beginPath();
        const r = Math.min(box.borderRadius || 0, box.width / 2, box.height / 2);
        targetCtx.roundRect(box.x, box.y, box.width, box.height, r);
        targetCtx.fill();

        if (box.borderWidth > 0 && box.borderColor) {
          targetCtx.strokeStyle = box.borderColor;
          targetCtx.lineWidth = box.borderWidth;
          targetCtx.stroke();
        }
        targetCtx.restore();
      }

      // Draw Box Text (with padding and clipping to ensure text remains cleanly inside the box)
      targetCtx.save();
      const padX = Math.min(box.paddingX !== undefined ? box.paddingX : 40, box.width / 4);
      const padY = Math.min(box.paddingY !== undefined ? box.paddingY : 30, box.height / 4);

      // Clip to inner rounded rect bounds so text never spills outside
      targetCtx.beginPath();
      const innerR = Math.max(0, Math.min(box.borderRadius || 0, box.width / 2, box.height / 2) - 2);
      targetCtx.roundRect(box.x, box.y, box.width, box.height, innerR);
      targetCtx.clip();

      const boxFont = fontFamilies[box.font] || "'Montserrat', sans-serif";
      const maxTextW = Math.max(50, box.width - (padX * 2));
      const maxTextH = Math.max(30, box.height - (padY * 2));

      // Auto-scale font size down if text exceeds maximum inner width or height
      let effectiveFontSize = box.fontSize;
      targetCtx.font = `700 ${effectiveFontSize}px ${boxFont}`;
      let measuredW = targetCtx.measureText(box.text).width;
      if (measuredW > maxTextW || effectiveFontSize > maxTextH) {
        const scaleW = maxTextW / measuredW;
        const scaleH = maxTextH / effectiveFontSize;
        const fitScale = Math.min(scaleW, scaleH);
        effectiveFontSize = Math.max(20, Math.floor(effectiveFontSize * fitScale));
        targetCtx.font = `700 ${effectiveFontSize}px ${boxFont}`;
      }

      targetCtx.fillStyle = box.textColor || "#ffffff";

      // Horizontal Alignment Calculation
      let textX = box.x + box.width / 2;
      targetCtx.textAlign = "center";
      if (box.align === "left") {
        targetCtx.textAlign = "left";
        textX = box.x + padX;
      } else if (box.align === "right") {
        targetCtx.textAlign = "right";
        textX = box.x + box.width - padX;
      }

      // Vertical Alignment Calculation
      let textY = box.y + box.height / 2;
      targetCtx.textBaseline = "middle";
      if (box.vAlign === "top") {
        targetCtx.textBaseline = "top";
        textY = box.y + padY;
      } else if (box.vAlign === "bottom") {
        targetCtx.textBaseline = "bottom";
        textY = box.y + box.height - padY;
      }

      targetCtx.fillText(box.text, textX, textY);
      targetCtx.restore();

      // If dragging/resizing, render subtle selection & resize handle on canvas
      if (state.activeDragHandle) {
        targetCtx.save();
        targetCtx.strokeStyle = "#4cc2ff";
        targetCtx.lineWidth = 4;
        targetCtx.setLineDash([16, 12]);
        targetCtx.strokeRect(box.x, box.y, box.width, box.height);
        targetCtx.setLineDash([]);
        // Draw bottom-right resize grip handle
        targetCtx.fillStyle = "#ffffff";
        targetCtx.strokeStyle = "#000000";
        targetCtx.lineWidth = 3;
        targetCtx.beginPath();
        targetCtx.arc(box.x + box.width, box.y + box.height, 20, 0, Math.PI * 2);
        targetCtx.fill();
        targetCtx.stroke();
        targetCtx.restore();
      }

      targetCtx.restore();
    }

    targetCtx.restore();
  }

  // Helper: Hex color to rgba string
  function hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // --- RESPONSIVE PREVIEW SCALER (Auto Fit & Custom Zoom Scale) ---
  function updatePreviewDimensions() {
    const containerRect = viewportContainer.getBoundingClientRect();
    const padding = 32;
    const footerExtra = 34; // headroom for bottom tagline
    const availW = Math.max(280, containerRect.width - padding);
    const availH = Math.max(180, containerRect.height - padding - footerExtra);

    const targetAspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    let displayW, displayH;

    // Locked to Fit Window (Auto)
    if (availW / availH > targetAspect) {
      displayH = availH;
      displayW = displayH * targetAspect;
    } else {
      displayW = availW;
      displayH = displayW / targetAspect;
    }

    bannerContainer.style.width = `${Math.round(displayW)}px`;
    bannerContainer.style.height = `${Math.round(displayH)}px`;

    const dpr = window.devicePixelRatio || 1;
    previewCanvas.width = Math.round(displayW * dpr);
    previewCanvas.height = Math.round(displayH * dpr);

    // Render 5664x2500 buffer and project to preview canvas
    drawFullCanvas(renderCtx);

    previewCtx.save();
    previewCtx.scale(previewCanvas.width / CANVAS_WIDTH, previewCanvas.height / CANVAS_HEIGHT);
    previewCtx.drawImage(renderCanvas, 0, 0);
    previewCtx.restore();

    const pct = Math.round((displayW / CANVAS_WIDTH) * 100);
    const badge = getElement('viewportScaleBadge');
    if (badge) {
      badge.textContent = `${pct}% View`;
    }
  }

  function renderAll() {
    updateSidebarLogoPreview();
    updatePreviewDimensions();
  }

  // --- HEADER MODE SWITCHER (Logo Image vs Text Style) ---
  function setHeaderMode(mode) {
    state.headerMode = mode;
    const btnLogo = getElement('btnModeLogo');
    const btnText = getElement('btnModeText');
    const logoSection = getElement('logoPreviewSection');
    const textBox = getElement('textModeInputBox');
    const sizeLabel = getElement('hdrAirlineSizeLabel');
    const isDark = document.body.classList.contains('theme-dark');

    const activeBtn = isDark
      ? "px-2.5 py-0.5 rounded bg-white text-black font-bold transition shadow-sm"
      : "px-2.5 py-0.5 rounded bg-black text-white font-bold transition shadow-sm";
    const inactiveBtn = isDark
      ? "px-2.5 py-0.5 rounded text-zinc-400 hover:text-white transition"
      : "px-2.5 py-0.5 rounded text-zinc-600 hover:text-black transition";

    if (mode === 'logo') {
      btnLogo.className = activeBtn;
      btnText.className = inactiveBtn;
      logoSection.classList.remove('hidden');
      textBox.classList.add('hidden');
      sizeLabel.textContent = "Logo Height:";
    } else {
      btnText.className = activeBtn;
      btnLogo.className = inactiveBtn;
      logoSection.classList.add('hidden');
      textBox.classList.remove('hidden');
      sizeLabel.textContent = "Airline Size:";
    }
    if (typeof updateCustomTogglesVisibility === 'function') {
      updateCustomTogglesVisibility();
    }
    renderAll();
  }

  function updateExportButtonState() {
    const btnExport = getElement('btnTopExport');
    const iconSpan = getElement('exportBtnIcon');
    if (!btnExport) return;
    const hasAirline = Boolean(state.selectedAirlineKey);
    btnExport.disabled = !hasAirline;

    if (viewportContainer) {
      if (hasAirline) {
        viewportContainer.classList.remove('cursor-default');
        viewportContainer.classList.add('cursor-grab', 'active:cursor-grabbing');
      } else {
        viewportContainer.classList.remove('cursor-grab', 'active:cursor-grabbing');
        viewportContainer.classList.add('cursor-default');
      }
    }

    if (iconSpan) {
      if (hasAirline) {
        // Download icon (arrow pointing down into tray)
        iconSpan.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
        `;
        btnExport.setAttribute('title', 'Download custom banner');
      } else {
        // X icon when unavailable
        iconSpan.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        `;
        btnExport.setAttribute('title', 'Select an airline profile first');
      }
    }
  }

  // --- AIRLINE PRESET SWITCHER ---
  function setAirline(key) {
    state.selectedAirlineKey = key;
    updateExportButtonState();
    const dependentControls = getElement('airlineDependentControls');

    if (!key) {
      if (dependentControls) {
        dependentControls.classList.add('opacity-40', 'pointer-events-none');
      }
      getElement('airlineBadge').textContent = 'NONE SELECTED';
      getElement('airlineBadge').className = 'text-[10px] text-slate-400 font-mono-avionics font-bold';
      renderAll();
      return;
    }

    // Enable controls when an airline is selected
    if (dependentControls) {
      dependentControls.classList.remove('opacity-40', 'pointer-events-none');
    }

    // Remove "Select Airline" from the dropdown list once an airline has been chosen
    const placeholderOpt = getElement('optSelectAirlinePlaceholder');
    if (placeholderOpt) {
      placeholderOpt.remove();
    }

    const profile = airlineProfiles[key];
    if (!profile) return;

    state.airlineName = profile.name;
    state.suffixName = profile.suffix;
    state.topBrandColor = profile.brandColor;
    state.hdrAirlineSize = profile.defaultLogoHeight || 160;

    getElement('hdrAirlineText').value = profile.name;
    getElement('hdrSuffixText').value = profile.suffix;
    getElement('topGradColor').value = profile.brandColor;
    getElement('topGradHex').value = profile.brandColor.toUpperCase();
    getElement('airlineBadge').textContent = profile.name.toUpperCase();
    getElement('hdrAirlineSize').value = state.hdrAirlineSize;
    getElement('hdrAirlineSizeVal').textContent = `${state.hdrAirlineSize}px`;

    if (key === 'CUSTOM') {
      setHeaderMode('text');
      // Reveal Custom feature toggles panel
      const togglesPanel = getElement('customTogglesPanel');
      if (togglesPanel) togglesPanel.classList.remove('hidden');
      if (typeof updateCustomTogglesVisibility === 'function') {
        updateCustomTogglesVisibility();
      }
    } else {
      const hasLogo = getActiveAirlineLogo() !== null;
      setHeaderMode(hasLogo ? 'logo' : 'text');
      const togglesPanel = getElement('customTogglesPanel');
      const customBoxCard = getElement('customTextBoxCard');
      if (togglesPanel) togglesPanel.classList.add('hidden');
      if (customBoxCard) customBoxCard.classList.add('hidden');
      if (typeof updateCustomTogglesVisibility === 'function') {
        updateCustomTogglesVisibility();
      }
    }
  }

  // --- STRICT BINARY SEARCH JPEG COMPRESSOR (< 2,000,000 Bytes) ---
  async function compressToStrictLimit(canvas, onProgress = null) {
    let low = 0.05;
    let high = 0.95;
    let bestBlob = null;
    let bestQuality = 0.05;
    let bestBytes = 0;

    // 1. Initial test at high quality (0.95)
    const topBlob = await getCanvasBlob(canvas, high);
    if (onProgress) onProgress(1, high, topBlob.size);

    if (topBlob.size <= STRICT_MAX_BYTES) {
      return { blob: topBlob, quality: high, bytes: topBlob.size, steps: 1 };
    }

    // 2. Binary search convergence
    for (let step = 1; step <= BINARY_SEARCH_STEPS; step++) {
      const mid = Number(((low + high) / 2).toFixed(3));
      const blob = await getCanvasBlob(canvas, mid);
      const bytes = blob.size;

      if (onProgress) onProgress(step + 1, mid, bytes);

      if (bytes <= STRICT_MAX_BYTES) {
        bestBlob = blob;
        bestQuality = mid;
        bestBytes = bytes;
        low = mid;
      } else {
        high = mid;
      }
    }

    // Failsafe fallback
    if (!bestBlob) {
      bestBlob = await getCanvasBlob(canvas, 0.15);
      bestQuality = 0.15;
      bestBytes = bestBlob.size;
    }

    return { blob: bestBlob, quality: bestQuality, bytes: bestBytes, steps: BINARY_SEARCH_STEPS };
  }

  function getCanvasBlob(canvas, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const mb = (bytes / (k * k)).toFixed(2);
    const kb = (bytes / k).toFixed(0);
    return `${mb} MB (${kb} KB)`;
  }

  // --- SINGLE EXPORT HANDLER ---
  async function handleSingleExport() {
    const btnExport = getElement("btnTopExport");
    const originalText = btnExport ? btnExport.innerHTML : "";

    if (btnExport) {
      btnExport.disabled = true;
      btnExport.classList.add("opacity-75", "cursor-wait");
      btnExport.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Saving...</span>
      `;
    }

    // Redraw fresh high-res canvas
    drawFullCanvas(renderCtx);

    try {
      const result = await compressToStrictLimit(renderCanvas);

      // Filename formula: (3 digit airline code_icao_suffixtext) e.g. FFT_KLAS_FocusAirport.jpg
      const airlineCode = (state.selectedAirlineKey || "AIR").replace(/[^a-zA-Z0-9]/g, "");
      const cleanIcao = (state.airport.icao || "BANNER").replace(/[^a-zA-Z0-9]/g, "");
      const rawSuffix = (state.suffixName || "Focus Airport").trim();
      // Remove spaces and special characters to make suffix text one word with no spaces
      const cleanSuffix = rawSuffix.replace(/[^a-zA-Z0-9]/g, "") || "FocusAirport";
      const fileName = `${airlineCode}_${cleanIcao}_${cleanSuffix}.jpg`;

      const finalBadge = `${(result.bytes / (1024 * 1024)).toFixed(2)} MB / 2.00 MB`;
      const footerBadge = getElement("footerSizeBadge");
      if (footerBadge) footerBadge.textContent = finalBadge;

      // Trigger direct file download
      const blobUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 1500);

    } catch (err) {
      console.error("Compression/download failed:", err);
      alert("Export failed: " + err.message);
    } finally {
      if (btnExport) {
        btnExport.classList.remove("opacity-75", "cursor-wait");
        updateExportButtonState();
      }
    }
  }

  // Helper to get Canvas pointer coordinates relative to 5664x2500 canvas
  function getCanvasCoordinates(e) {
    const bannerRect = bannerContainer.getBoundingClientRect();
    const scale = CANVAS_WIDTH / bannerRect.width;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      canvasX: (clientX - bannerRect.left) * scale,
      canvasY: (clientY - bannerRect.top) * scale,
      clientX,
      clientY,
      scale
    };
  }

  // Check hit on Custom Text Box or its resize handle
  function hitTestCustomBox(cx, cy) {
    if (state.selectedAirlineKey !== 'CUSTOM' || !state.customBox.enabled) return null;
    const box = state.customBox;
    const handleRadius = 45; // touch-friendly hit radius around SE corner
    const cornerX = box.x + box.width;
    const cornerY = box.y + box.height;
    const distToCorner = Math.hypot(cx - cornerX, cy - cornerY);
    if (distToCorner <= handleRadius) {
      return 'resize-se';
    }
    if (cx >= box.x && cx <= box.x + box.width && cy >= box.y && cy <= box.y + box.height) {
      return 'box';
    }
    return null;
  }

  // --- INTERACTIVE DRAGGING ON PREVIEW (Custom Box Move/Resize or Background Pan) ---
  viewportContainer.addEventListener('mousedown', (e) => {
    // Don't trigger canvas pan when clicking the tagline
    if (e.target.closest('#taglineContainer')) return;

    // Disable interaction when no airline profile is selected
    if (!state.selectedAirlineKey) return;

    const { canvasX, canvasY } = getCanvasCoordinates(e);
    const hit = hitTestCustomBox(canvasX, canvasY);

    if (hit) {
      state.activeDragHandle = hit;
      state.boxDragStartX = canvasX;
      state.boxDragStartY = canvasY;
      state.boxOrigX = state.customBox.x;
      state.boxOrigY = state.customBox.y;
      state.boxOrigW = state.customBox.width;
      state.boxOrigH = state.customBox.height;
      renderAll();
      return;
    }

    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    state.dragStartPanX = state.bgPanX;
    state.dragStartPanY = state.bgPanY;
  }, { signal: listeners.signal });

  window.addEventListener('mousemove', (e) => {
    // 1. Custom Box Drag / Resize Handling
    if (state.activeDragHandle) {
      const { canvasX, canvasY } = getCanvasCoordinates(e);
      const deltaX = Math.round(canvasX - state.boxDragStartX);
      const deltaY = Math.round(canvasY - state.boxDragStartY);

      if (state.activeDragHandle === 'box') {
        state.customBox.x = Math.max(0, Math.min(CANVAS_WIDTH - state.customBox.width, state.boxOrigX + deltaX));
        state.customBox.y = Math.max(0, Math.min(CANVAS_HEIGHT - state.customBox.height, state.boxOrigY + deltaY));
        syncCustomBoxInputs();
      } else if (state.activeDragHandle === 'resize-se') {
        state.customBox.width = Math.max(300, Math.min(CANVAS_WIDTH - state.customBox.x, state.boxOrigW + deltaX));
        state.customBox.height = Math.max(80, Math.min(CANVAS_HEIGHT - state.customBox.y, state.boxOrigH + deltaY));
        syncCustomBoxInputs();
      }

      renderAll();
      return;
    }

    // 2. Background Panorama Pan Handling
    if (!state.isDragging) return;
    const bannerRect = bannerContainer.getBoundingClientRect();
    const scale = CANVAS_WIDTH / bannerRect.width;

    const deltaX = (e.clientX - state.dragStartX) * scale;
    const deltaY = (e.clientY - state.dragStartY) * scale;

    if (!state.lockPanX) {
      state.bgPanX = Math.round(state.dragStartPanX + deltaX);
      state.bgPanX = Math.max(-3000, Math.min(3000, state.bgPanX));
      getElement('bgPanX').value = state.bgPanX;
      getElement('panXVal').textContent = `${state.bgPanX}px`;
    }

    if (!state.lockPanY) {
      state.bgPanY = Math.round(state.dragStartPanY + deltaY);
      state.bgPanY = Math.max(-1800, Math.min(1800, state.bgPanY));
      getElement('bgPanY').value = state.bgPanY;
      getElement('panYVal').textContent = `${state.bgPanY}px`;
    }

    renderAll();
  }, { signal: listeners.signal });

  window.addEventListener('mouseup', () => {
    if (state.activeDragHandle) {
      state.activeDragHandle = null;
      renderAll();
    }
    state.isDragging = false;
  }, { signal: listeners.signal });

  // Touch support for drag-to-pan & custom box
  viewportContainer.addEventListener('touchstart', (e) => {
    // Don't trigger canvas pan when clicking the tagline
    if (e.target.closest('#taglineContainer')) return;

    // Disable dragging when no airline profile is selected
    if (!state.selectedAirlineKey) return;
    if (e.touches.length === 1) {
      const { canvasX, canvasY } = getCanvasCoordinates(e);
      const hit = hitTestCustomBox(canvasX, canvasY);

      if (hit) {
        state.activeDragHandle = hit;
        state.boxDragStartX = canvasX;
        state.boxDragStartY = canvasY;
        state.boxOrigX = state.customBox.x;
        state.boxOrigY = state.customBox.y;
        state.boxOrigW = state.customBox.width;
        state.boxOrigH = state.customBox.height;
        renderAll();
        return;
      }

      state.isDragging = true;
      state.dragStartX = e.touches[0].clientX;
      state.dragStartY = e.touches[0].clientY;
      state.dragStartPanX = state.bgPanX;
      state.dragStartPanY = state.bgPanY;
    }
  }, { signal: listeners.signal, passive: true });

  window.addEventListener('touchmove', (e) => {
    if (state.activeDragHandle && e.touches.length === 1) {
      const { canvasX, canvasY } = getCanvasCoordinates(e);
      const deltaX = Math.round(canvasX - state.boxDragStartX);
      const deltaY = Math.round(canvasY - state.boxDragStartY);

      if (state.activeDragHandle === 'box') {
        state.customBox.x = Math.max(0, Math.min(CANVAS_WIDTH - state.customBox.width, state.boxOrigX + deltaX));
        state.customBox.y = Math.max(0, Math.min(CANVAS_HEIGHT - state.customBox.height, state.boxOrigY + deltaY));
        syncCustomBoxInputs();
      } else if (state.activeDragHandle === 'resize-se') {
        state.customBox.width = Math.max(300, Math.min(CANVAS_WIDTH - state.customBox.x, state.boxOrigW + deltaX));
        state.customBox.height = Math.max(80, Math.min(CANVAS_HEIGHT - state.customBox.y, state.boxOrigH + deltaY));
        syncCustomBoxInputs();
      }

      renderAll();
      return;
    }

    if (!state.isDragging || e.touches.length !== 1) return;
    const bannerRect = bannerContainer.getBoundingClientRect();
    const scale = CANVAS_WIDTH / bannerRect.width;

    const deltaX = (e.touches[0].clientX - state.dragStartX) * scale;
    const deltaY = (e.touches[0].clientY - state.dragStartY) * scale;

    if (!state.lockPanX) {
      state.bgPanX = Math.round(state.dragStartPanX + deltaX);
      state.bgPanX = Math.max(-3000, Math.min(3000, state.bgPanX));
      getElement('bgPanX').value = state.bgPanX;
      getElement('panXVal').textContent = `${state.bgPanX}px`;
    }

    if (!state.lockPanY) {
      state.bgPanY = Math.round(state.dragStartPanY + deltaY);
      state.bgPanY = Math.max(-1800, Math.min(1800, state.bgPanY));
      getElement('bgPanY').value = state.bgPanY;
      getElement('panYVal').textContent = `${state.bgPanY}px`;
    }

    renderAll();
  }, { signal: listeners.signal, passive: true });

  window.addEventListener('touchend', () => {
    if (state.activeDragHandle) {
      state.activeDragHandle = null;
      renderAll();
    }
    state.isDragging = false;
  }, { signal: listeners.signal });

  // Helper: Sync Custom Box state into UI input sliders and labels
  function syncCustomBoxInputs() {
    const box = state.customBox;
    const xInput = getElement('customBoxX');
    const yInput = getElement('customBoxY');
    const wInput = getElement('customBoxW');
    const hInput = getElement('customBoxH');
    if (xInput) xInput.value = box.x;
    if (yInput) yInput.value = box.y;
    if (wInput) wInput.value = box.width;
    if (hInput) hInput.value = box.height;
    const xVal = getElement('customBoxXVal');
    const yVal = getElement('customBoxYVal');
    const wVal = getElement('customBoxWVal');
    const hVal = getElement('customBoxHVal');
    if (xVal) xVal.textContent = `${box.x}px`;
    if (yVal) yVal.textContent = `${box.y}px`;
    if (wVal) wVal.textContent = `${box.width}px`;
    if (hVal) hVal.textContent = `${box.height}px`;
  }

  // Helper: Update alignment button styles in Custom Text Box Card
  function updateCustomBoxAlignUI() {
    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "px-2 py-0.5 rounded bg-white text-black font-bold transition"
      : "px-2 py-0.5 rounded bg-black text-white font-bold transition";
    const inactiveClass = "px-2 py-0.5 rounded text-zinc-400 hover:text-white transition";

    // Horizontal Alignment Buttons
    const btnL = getElement('btnCustomBoxAlignLeft');
    const btnC = getElement('btnCustomBoxAlignCenter');
    const btnR = getElement('btnCustomBoxAlignRight');

    if (btnL && btnC && btnR) {
      btnL.className = state.customBox.align === 'left' ? activeClass : inactiveClass;
      btnC.className = state.customBox.align === 'center' ? activeClass : inactiveClass;
      btnR.className = state.customBox.align === 'right' ? activeClass : inactiveClass;
    }

    // Vertical Alignment Buttons
    const btnVT = getElement('btnCustomBoxVAlignTop');
    const btnVM = getElement('btnCustomBoxVAlignMiddle');
    const btnVB = getElement('btnCustomBoxVAlignBottom');

    if (btnVT && btnVM && btnVB) {
      btnVT.className = state.customBox.vAlign === 'top' ? activeClass : inactiveClass;
      btnVM.className = state.customBox.vAlign === 'middle' ? activeClass : inactiveClass;
      btnVB.className = state.customBox.vAlign === 'bottom' ? activeClass : inactiveClass;
    }
  }

  // --- CONTROLS & EVENT LISTENERS ---

  // 1. Airline Header & Logo Controls
  getElement('airlineDropdown').addEventListener('change', (e) => {
    setAirline(e.target.value);
  }, { signal: listeners.signal });
  getElement('btnModeLogo').addEventListener('click', () => setHeaderMode('logo'), { signal: listeners.signal });
  getElement('btnModeText').addEventListener('click', () => setHeaderMode('text'), { signal: listeners.signal });

  // Custom Logo Upload Warning Dialog Logic
  const btnTriggerLogoUpload = getElement('btnTriggerLogoUpload');
  const logoWarningModal = getElement('logoWarningModal');
  const btnCancelLogoUpload = getElement('btnCancelLogoUpload');
  const btnProceedLogoUpload = getElement('btnProceedLogoUpload');
  const warningAirlineName = getElement('warningAirlineName');
  const customLogoInput = getElement('customLogoInput');

  btnTriggerLogoUpload.addEventListener('click', () => {
    if (state.selectedAirlineKey === 'CUSTOM') {
      // Direct upload without warning dialog for Custom
      customLogoInput.click();
      return;
    }
    const profile = airlineProfiles[state.selectedAirlineKey];
    warningAirlineName.textContent = profile ? profile.name : state.selectedAirlineKey;
    logoWarningModal.classList.remove('hidden');
  }, { signal: listeners.signal });

  btnCancelLogoUpload.addEventListener('click', () => {
    logoWarningModal.classList.add('hidden');
    customLogoInput.value = "";
  }, { signal: listeners.signal });

  btnProceedLogoUpload.addEventListener('click', () => {
    logoWarningModal.classList.add('hidden');
    customLogoInput.click();
  }, { signal: listeners.signal });

  // Custom Logo Upload / Override for active airline with persistent storage
  customLogoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const activeKey = state.selectedAirlineKey;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const rawImg = new Image();
        rawImg.crossOrigin = "anonymous";
        rawImg.onload = async () => {
          const trimmedImg = trimTransparentImage(rawImg);
          trimmedImg.onload = async () => {
            state.customLogoOverrides[activeKey] = trimmedImg;
            // Persist trimmed image dataUrl so it survives page reloads
            await saveLogoToStorage(activeKey, trimmedImg.src);
            setHeaderMode('logo');
            renderAll();
          };
        };
        rawImg.src = evt.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, { signal: listeners.signal });

  getElement('btnResetAirlineLogo').addEventListener('click', async () => {
    const activeKey = state.selectedAirlineKey;
    delete state.customLogoOverrides[activeKey];
    await removeLogoFromStorage(activeKey);
    customLogoInput.value = "";
    renderAll();
  }, { signal: listeners.signal });

  getElement('hdrAirlineText').addEventListener('input', (e) => {
    state.airlineName = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrSuffixText').addEventListener('input', (e) => {
    state.suffixName = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  // Top Gradient Color, Opacity & Depth
  getElement('topGradColor').addEventListener('input', (e) => {
    state.topBrandColor = e.target.value;
    getElement('topGradHex').value = e.target.value.toUpperCase();
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradHex').addEventListener('input', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#') && val.length === 6) val = '#' + val;
    state.topBrandColor = val;
    getElement('topGradColor').value = val;
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradOpacity').addEventListener('input', (e) => {
    state.topGradOpacity = parseInt(e.target.value, 10);
    getElement('topGradOpacityVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradDepth').addEventListener('input', (e) => {
    state.topGradDepth = parseInt(e.target.value, 10);
    getElement('topGradDepthVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Bottom Gradient Color, Opacity & Depth
  getElement('botGradColor').addEventListener('input', (e) => {
    state.botBrandColor = e.target.value;
    getElement('botGradHex').value = e.target.value.toUpperCase();
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradHex').addEventListener('input', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#') && val.length === 6) val = '#' + val;
    state.botBrandColor = val;
    getElement('botGradColor').value = val;
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradOpacity').addEventListener('input', (e) => {
    state.botGradOpacity = parseInt(e.target.value, 10);
    getElement('botGradOpacityVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradDepth').addEventListener('input', (e) => {
    state.botGradDepth = parseInt(e.target.value, 10);
    getElement('botGradDepthVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Reset Top Gradient (Opacity -> 75%, Depth -> 500px)
  getElement('btnResetTopGradDepth').addEventListener('click', () => {
    state.topGradOpacity = 75;
    state.topGradDepth = 500;
    getElement('topGradOpacity').value = 75;
    getElement('topGradOpacityVal').textContent = '75%';
    getElement('topGradDepth').value = 500;
    getElement('topGradDepthVal').textContent = '500px';
    renderAll();
  }, { signal: listeners.signal });

  // Reset Bottom Gradient (Opacity -> 75%, Depth -> 500px)
  getElement('btnResetBotGradDepth').addEventListener('click', () => {
    state.botGradOpacity = 75;
    state.botGradDepth = 500;
    getElement('botGradOpacity').value = 75;
    getElement('botGradOpacityVal').textContent = '75%';
    getElement('botGradDepth').value = 500;
    getElement('botGradDepthVal').textContent = '500px';
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrAirlineSize').addEventListener('input', (e) => {
    state.hdrAirlineSize = parseInt(e.target.value, 10);
    getElement('hdrAirlineSizeVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrSuffixSize').addEventListener('input', (e) => {
    state.hdrSuffixSize = parseInt(e.target.value, 10);
    getElement('hdrSuffixSizeVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('logoOffsetY').addEventListener('input', (e) => {
    state.logoOffsetY = parseInt(e.target.value, 10) || 0;
    getElement('logoOffsetYVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrDividerGap').addEventListener('input', (e) => {
    state.hdrDividerGap = parseInt(e.target.value, 10) || 44;
    getElement('hdrDividerGapVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Reset Logo Height, Focus Size, Logo Y Offset, and Divider Gap
  getElement('btnResetHdrDimensions').addEventListener('click', () => {
    const profile = airlineProfiles[state.selectedAirlineKey] || airlineProfiles.ANZ;
    state.hdrAirlineSize = profile.defaultLogoHeight || 160;
    state.hdrSuffixSize = 148;
    state.logoOffsetY = 0;
    state.hdrDividerGap = 44;

    getElement('hdrAirlineSize').value = state.hdrAirlineSize;
    getElement('hdrAirlineSizeVal').textContent = `${state.hdrAirlineSize}px`;
    getElement('hdrSuffixSize').value = 148;
    getElement('hdrSuffixSizeVal').textContent = '148px';
    getElement('logoOffsetY').value = 0;
    getElement('logoOffsetYVal').textContent = '0px';
    getElement('hdrDividerGap').value = 44;
    getElement('hdrDividerGapVal').textContent = '44px';

    renderAll();
  }, { signal: listeners.signal });

  // Reset Header X
  getElement('btnResetHdrX').addEventListener('click', () => {
    state.hdrPosX = 180;
    getElement('hdrPosX').value = 180;
    getElement('hdrPosXVal').textContent = '180px';
    renderAll();
  }, { signal: listeners.signal });

  // Reset Header Y
  getElement('btnResetHdrY').addEventListener('click', () => {
    state.hdrPosY = 175;
    getElement('hdrPosY').value = 175;
    getElement('hdrPosYVal').textContent = '175px';
    renderAll();
  }, { signal: listeners.signal });
  // Button toggles for Header Drop Shadow and Force Pure White
  const btnToggleHdrShadow = getElement('btnToggleHdrShadow');
  const btnToggleForceWhite = getElement('btnToggleForceWhite');

  function updateHdrButtonsUI() {
    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "py-1 px-1 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
      : "py-1 px-1 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";
    const inactiveClass = "py-1 px-1 tool-btn text-center font-medium transition text-slate-400";

    btnToggleHdrShadow.className = state.hdrShadow ? activeClass : inactiveClass;
    btnToggleForceWhite.className = state.logoForceWhite ? activeClass : inactiveClass;
  }

  btnToggleHdrShadow.addEventListener('click', () => {
    state.hdrShadow = !state.hdrShadow;
    updateHdrButtonsUI();
    renderAll();
  }, { signal: listeners.signal });

  btnToggleForceWhite.addEventListener('click', () => {
    state.logoForceWhite = !state.logoForceWhite;
    updateHdrButtonsUI();
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrPosX').addEventListener('input', (e) => {
    state.hdrPosX = parseInt(e.target.value, 10) || 0;
    getElement('hdrPosXVal').textContent = `${state.hdrPosX}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrPosY').addEventListener('input', (e) => {
    state.hdrPosY = parseInt(e.target.value, 10) || 0;
    getElement('hdrPosYVal').textContent = `${state.hdrPosY}px`;
    renderAll();
  }, { signal: listeners.signal });

  // --- CUSTOM PROFILE BLANK SLATE TOGGLES & CUSTOM TEXT BOX EVENT LISTENERS ---
  const chkShowHeaderBrand = getElement('chkShowHeaderBrand');
  const chkShowGradients = getElement('chkShowGradients');
  const chkShowAirlineName = getElement('chkShowAirlineName');
  const chkShowSuffixText = getElement('chkShowSuffixText');
  const chkShowTopGrad = getElement('chkShowTopGrad');
  const chkShowBotGrad = getElement('chkShowBotGrad');
  const chkShowAirportText = getElement('chkShowAirportText');
  const headerBrandSubToggles = getElement('headerBrandSubToggles');
  const gradientsSubToggles = getElement('gradientsSubToggles');

  // Update Visibility of Controls based on Custom Element Toggles
  function updateCustomTogglesVisibility() {
    const isCustom = state.selectedAirlineKey === 'CUSTOM';

    // 1. Header Brand Master Toggle & Sub-Controls
    const brandModeSec = getElement('headerBrandModeSection');
    const logoPreviewSec = getElement('logoPreviewSection');
    const textModeBox = getElement('textModeInputBox');
    const airlineSizeCol = getElement('hdrAirlineSizeCol');
    const logoOffsetYCol = getElement('logoOffsetYCol');
    const suffixSec = getElement('suffixTextInputSection');
    const suffixSizeCol = getElement('hdrSuffixSizeCol');
    const dividerGapCol = getElement('hdrDividerGapCol');
    const sizesOffsetsSec = getElement('sizesOffsetsSection');
    const headerPosSec = getElement('headerPositionSection');

    if (isCustom) {
      // Sub-toggles container visibility
      if (headerBrandSubToggles) {
        headerBrandSubToggles.style.display = state.showHeaderBrand ? '' : 'none';
      }

      if (!state.showHeaderBrand) {
        if (brandModeSec) brandModeSec.style.display = 'none';
        if (sizesOffsetsSec) sizesOffsetsSec.style.display = 'none';
        if (headerPosSec) headerPosSec.style.display = 'none';
      } else {
        // Header Brand is ON: show options according to individual sub-toggles
        const hasAnyHeaderItem = state.showAirlineName || state.showSuffixText;
        if (brandModeSec) brandModeSec.style.display = hasAnyHeaderItem ? '' : 'none';
        if (sizesOffsetsSec) sizesOffsetsSec.style.display = hasAnyHeaderItem ? '' : 'none';
        if (headerPosSec) headerPosSec.style.display = hasAnyHeaderItem ? '' : 'none';

        if (textModeBox) textModeBox.style.display = state.showAirlineName ? '' : 'none';
        if (logoPreviewSec) logoPreviewSec.style.display = state.showAirlineName ? '' : 'none';
        if (airlineSizeCol) airlineSizeCol.style.display = state.showAirlineName ? '' : 'none';
        if (logoOffsetYCol) logoOffsetYCol.style.display = state.showAirlineName ? '' : 'none';

        if (suffixSec) suffixSec.style.display = state.showSuffixText ? '' : 'none';
        if (suffixSizeCol) suffixSizeCol.style.display = state.showSuffixText ? '' : 'none';

        if (dividerGapCol) {
          dividerGapCol.style.display = (state.showAirlineName && state.showSuffixText) ? '' : 'none';
        }
      }
    } else {
      if (headerBrandSubToggles) headerBrandSubToggles.style.display = '';
      if (brandModeSec) brandModeSec.style.display = '';
      if (textModeBox) textModeBox.style.display = '';
      if (logoPreviewSec) logoPreviewSec.style.display = '';
      if (airlineSizeCol) airlineSizeCol.style.display = '';
      if (logoOffsetYCol) logoOffsetYCol.style.display = '';
      if (suffixSec) suffixSec.style.display = '';
      if (suffixSizeCol) suffixSizeCol.style.display = '';
      if (dividerGapCol) dividerGapCol.style.display = '';
      if (sizesOffsetsSec) sizesOffsetsSec.style.display = '';
      if (headerPosSec) headerPosSec.style.display = '';
    }

    // 2. Gradients Master Toggle & Sub-Controls
    const gradientsSec = getElement('atmosphericGradientsSection');
    const topGradCol = getElement('topGradCol');
    const botGradCol = getElement('botGradCol');

    if (isCustom) {
      if (gradientsSubToggles) {
        gradientsSubToggles.style.display = state.showGradients ? '' : 'none';
      }

      if (!state.showGradients) {
        if (gradientsSec) gradientsSec.style.display = 'none';
      } else {
        const hasAnyGrad = state.showTopGradient || state.showBottomGradient;
        if (gradientsSec) gradientsSec.style.display = hasAnyGrad ? '' : 'none';
        if (topGradCol) topGradCol.style.display = state.showTopGradient ? '' : 'none';
        if (botGradCol) botGradCol.style.display = state.showBottomGradient ? '' : 'none';
      }
    } else {
      if (gradientsSubToggles) gradientsSubToggles.style.display = '';
      if (gradientsSec) gradientsSec.style.display = '';
      if (topGradCol) topGradCol.style.display = '';
      if (botGradCol) botGradCol.style.display = '';
    }

    // 3. Custom Text Box Card Visibility (controlled directly by the top toggle)
    const customBoxCard = getElement('customTextBoxCard');
    if (customBoxCard) {
      if (isCustom) {
        customBoxCard.style.display = state.customBox.enabled ? '' : 'none';
      } else {
        customBoxCard.style.display = 'none';
      }
    }
  }

  if (chkShowHeaderBrand) {
    chkShowHeaderBrand.addEventListener('change', (e) => {
      state.showHeaderBrand = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }

  if (chkShowGradients) {
    chkShowGradients.addEventListener('change', (e) => {
      state.showGradients = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }

  if (chkShowAirlineName) {
    chkShowAirlineName.addEventListener('change', (e) => {
      state.showAirlineName = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (chkShowSuffixText) {
    chkShowSuffixText.addEventListener('change', (e) => {
      state.showSuffixText = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (chkShowTopGrad) {
    chkShowTopGrad.addEventListener('change', (e) => {
      state.showTopGradient = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (chkShowBotGrad) {
    chkShowBotGrad.addEventListener('change', (e) => {
      state.showBottomGradient = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }

  if (chkShowAirportText) {
    chkShowAirportText.addEventListener('change', (e) => {
      state.showAirportText = e.target.checked;
      updateCustomTogglesVisibility();
      renderAll();
    }, { signal: listeners.signal });
  }

  // Custom Text Box Card Listeners
  const chkEnableCustomBox = getElement('chkEnableCustomBox');
  const customBoxStatusLabel = getElement('customBoxStatusLabel');
  const customBoxSubControls = getElement('customBoxSubControls');
  const customBoxTextInput = getElement('customBoxTextInput');
  const customBoxBgColor = getElement('customBoxBgColor');
  const customBoxBgHex = getElement('customBoxBgHex');
  const customBoxTextColor = getElement('customBoxTextColor');
  const customBoxTextHex = getElement('customBoxTextHex');
  const customBoxBgOpacity = getElement('customBoxBgOpacity');
  const customBoxBgOpacityVal = getElement('customBoxBgOpacityVal');
  const customBoxFontSize = getElement('customBoxFontSize');
  const customBoxFontSizeVal = getElement('customBoxFontSizeVal');
  const customBoxFont = getElement('customBoxFont');
  const customBoxX = getElement('customBoxX');
  const customBoxY = getElement('customBoxY');
  const customBoxW = getElement('customBoxW');
  const customBoxH = getElement('customBoxH');
  const btnCustomBoxAlignLeft = getElement('btnCustomBoxAlignLeft');
  const btnCustomBoxAlignCenter = getElement('btnCustomBoxAlignCenter');
  const btnCustomBoxAlignRight = getElement('btnCustomBoxAlignRight');
  const btnResetCustomBox = getElement('btnResetCustomBox');

  if (chkEnableCustomBox) {
    chkEnableCustomBox.addEventListener('change', (e) => {
      state.customBox.enabled = e.target.checked;
      if (typeof updateCustomTogglesVisibility === 'function') {
        updateCustomTogglesVisibility();
      }
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxTextInput) {
    customBoxTextInput.addEventListener('input', (e) => {
      state.customBox.text = e.target.value;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxBgColor && customBoxBgHex) {
    customBoxBgColor.addEventListener('input', (e) => {
      state.customBox.bgColor = e.target.value;
      customBoxBgHex.value = e.target.value.toUpperCase();
      renderAll();
    }, { signal: listeners.signal });
    customBoxBgHex.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#') && val.length === 6) val = '#' + val;
      state.customBox.bgColor = val;
      customBoxBgColor.value = val;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxTextColor && customBoxTextHex) {
    customBoxTextColor.addEventListener('input', (e) => {
      state.customBox.textColor = e.target.value;
      customBoxTextHex.value = e.target.value.toUpperCase();
      renderAll();
    }, { signal: listeners.signal });
    customBoxTextHex.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#') && val.length === 6) val = '#' + val;
      state.customBox.textColor = val;
      customBoxTextColor.value = val;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxBgOpacity) {
    customBoxBgOpacity.addEventListener('input', (e) => {
      state.customBox.bgOpacity = parseInt(e.target.value, 10);
      if (customBoxBgOpacityVal) customBoxBgOpacityVal.textContent = `${e.target.value}%`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxFontSize) {
    customBoxFontSize.addEventListener('input', (e) => {
      state.customBox.fontSize = parseInt(e.target.value, 10);
      if (customBoxFontSizeVal) customBoxFontSizeVal.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxFont) {
    customBoxFont.addEventListener('change', (e) => {
      state.customBox.font = e.target.value;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxX) {
    customBoxX.addEventListener('input', (e) => {
      state.customBox.x = parseInt(e.target.value, 10);
      const xVal = getElement('customBoxXVal');
      if (xVal) xVal.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxY) {
    customBoxY.addEventListener('input', (e) => {
      state.customBox.y = parseInt(e.target.value, 10);
      const yVal = getElement('customBoxYVal');
      if (yVal) yVal.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxW) {
    customBoxW.addEventListener('input', (e) => {
      state.customBox.width = parseInt(e.target.value, 10);
      const wVal = getElement('customBoxWVal');
      if (wVal) wVal.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxH) {
    customBoxH.addEventListener('input', (e) => {
      state.customBox.height = parseInt(e.target.value, 10);
      const hVal = getElement('customBoxHVal');
      if (hVal) hVal.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (btnCustomBoxAlignLeft) {
    btnCustomBoxAlignLeft.addEventListener('click', () => {
      state.customBox.align = 'left';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (btnCustomBoxAlignCenter) {
    btnCustomBoxAlignCenter.addEventListener('click', () => {
      state.customBox.align = 'center';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (btnCustomBoxAlignRight) {
    btnCustomBoxAlignRight.addEventListener('click', () => {
      state.customBox.align = 'right';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }

  // Vertical Alignment Button Listeners
  const btnCustomBoxVAlignTop = getElement('btnCustomBoxVAlignTop');
  const btnCustomBoxVAlignMiddle = getElement('btnCustomBoxVAlignMiddle');
  const btnCustomBoxVAlignBottom = getElement('btnCustomBoxVAlignBottom');
  const customBoxPadding = getElement('customBoxPadding');
  const customBoxPaddingVal = getElement('customBoxPaddingVal');

  if (btnCustomBoxVAlignTop) {
    btnCustomBoxVAlignTop.addEventListener('click', () => {
      state.customBox.vAlign = 'top';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (btnCustomBoxVAlignMiddle) {
    btnCustomBoxVAlignMiddle.addEventListener('click', () => {
      state.customBox.vAlign = 'middle';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }
  if (btnCustomBoxVAlignBottom) {
    btnCustomBoxVAlignBottom.addEventListener('click', () => {
      state.customBox.vAlign = 'bottom';
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }

  if (customBoxPadding) {
    customBoxPadding.addEventListener('input', (e) => {
      const p = parseInt(e.target.value, 10);
      state.customBox.paddingX = p;
      state.customBox.paddingY = Math.round(p * 0.75);
      if (customBoxPaddingVal) customBoxPaddingVal.textContent = `${p}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  if (btnResetCustomBox) {
    btnResetCustomBox.addEventListener('click', () => {
      state.customBox.text = "Custom Text";
      state.customBox.x = 180;
      state.customBox.y = 1950;
      state.customBox.width = 2200;
      state.customBox.height = 280;
      state.customBox.fontSize = 110;
      state.customBox.bgOpacity = 65;
      state.customBox.bgColor = "#000000";
      state.customBox.textColor = "#ffffff";
      state.customBox.align = "center";
      state.customBox.vAlign = "middle";
      state.customBox.paddingX = 40;
      state.customBox.paddingY = 30;
      state.customBox.font = "font-montserrat";

      if (customBoxTextInput) customBoxTextInput.value = "Custom Text";
      if (customBoxX) customBoxX.value = 180;
      if (customBoxY) customBoxY.value = 1950;
      if (customBoxW) customBoxW.value = 2200;
      if (customBoxH) customBoxH.value = 280;
      if (customBoxFontSize) customBoxFontSize.value = 110;
      if (customBoxBgOpacity) customBoxBgOpacity.value = 65;
      if (customBoxBgColor) customBoxBgColor.value = "#000000";
      if (customBoxBgHex) customBoxBgHex.value = "#000000";
      if (customBoxTextColor) customBoxTextColor.value = "#ffffff";
      if (customBoxTextHex) customBoxTextHex.value = "#FFFFFF";
      if (customBoxFont) customBoxFont.value = "font-montserrat";
      if (customBoxPadding) customBoxPadding.value = 40;

      syncCustomBoxInputs();
      if (customBoxFontSizeVal) customBoxFontSizeVal.textContent = "110px";
      if (customBoxBgOpacityVal) customBoxBgOpacityVal.textContent = "65%";
      if (customBoxPaddingVal) customBoxPaddingVal.textContent = "40px";
      updateCustomBoxAlignUI();
      renderAll();
    }, { signal: listeners.signal });
  }

  // 2. Background Photo Upload & Drag-and-Drop
  const dropZone = getElement('dropZone');
  const filePicker = getElement('filePicker');

  dropZone.addEventListener('click', () => filePicker.click(), { signal: listeners.signal });
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-zinc-400');
  }, { signal: listeners.signal });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-zinc-400');
  }, { signal: listeners.signal });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-zinc-400');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadLocalImageFile(e.dataTransfer.files[0]);
    }
  }, { signal: listeners.signal });
  filePicker.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadLocalImageFile(e.target.files[0]);
    }
  }, { signal: listeners.signal });

  function loadLocalImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        state.bgImage = img;
        state.cachedUserImage = img;
        state.activePreviewBg = null;
        if (typeof updatePreviewBgButtonsUI === 'function') updatePreviewBgButtonsUI();
        getElement('bgStatusBadge').textContent = 'Custom Photo Loaded';
        getElement('bgStatusBadge').className = 'text-[10px] text-emerald-500 font-mono-avionics font-bold';
        renderAll();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Load Scenery Photo from URL (Converts to Data URL to avoid CORS tainted canvas)
  const imageUrlInput = getElement('imageUrlInput');
  const btnLoadImageUrl = getElement('btnLoadImageUrl');
  const urlImportStatus = getElement('urlImportStatus');

  // Robust Multi-Stage Scenery URL Loader
  // 1. Direct fetch (best if server sends CORS headers)
  // 2. High-speed public CORS proxies (allorigins, corsproxy.io)
  // 3. Fallback direct HTMLImageElement
  async function loadSceneryFromUrl(url) {
    if (!url || !url.trim()) return;
    let cleanUrl = url.trim();

    // If user pasted without protocol, default to https://
    if (!/^https?:\/\//i.test(cleanUrl) && !cleanUrl.startsWith('data:')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    urlImportStatus.textContent = "Loading...";
    urlImportStatus.className = "text-[9px] text-zinc-500 font-mono-avionics";
    urlImportStatus.classList.remove('hidden');

    // Helper to convert Blob to DataURL
    const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Helper to load HTMLImageElement from DataURL or URL
    const loadImageObj = (src, isCrossorigin = false) => new Promise((resolve, reject) => {
      const img = new Image();
      if (isCrossorigin) img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    // Strategy 1: Direct fetch
    try {
      const resp = await fetch(cleanUrl, { mode: 'cors' });
      if (resp.ok) {
        const blob = await resp.blob();
        if (blob && blob.type.startsWith('image/')) {
          const dataUrl = await blobToDataUrl(blob);
          const img = await loadImageObj(dataUrl);
          applyLoadedSceneryImage(img, "URL Photo Loaded");
          return;
        }
      }
    } catch (e1) {
      // Direct fetch blocked by CORS, proceed to proxy
    }

    // Strategy 2: High-reliability CORS Proxies
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(cleanUrl)}`
    ];

    for (const proxyUrl of proxies) {
      try {
        urlImportStatus.textContent = "Fetching via Proxy...";
        const resp = await fetch(proxyUrl);
        if (resp.ok) {
          const blob = await resp.blob();
          if (blob && (blob.type.startsWith('image/') || blob.size > 1000)) {
            const dataUrl = await blobToDataUrl(blob);
            const img = await loadImageObj(dataUrl);
            applyLoadedSceneryImage(img, "URL Photo Loaded (Proxy)");
            return;
          }
        }
      } catch (e2) {
        // Try next proxy
      }
    }

    // Strategy 3: Direct Image element (with crossOrigin)
    try {
      urlImportStatus.textContent = "Loading Direct...";
      const img = await loadImageObj(cleanUrl, true);
      applyLoadedSceneryImage(img, "URL Photo Loaded");
      return;
    } catch (e3) {
      // Continue to no-cors fallback
    }

    // Error reporting: never load untrusted cross-origin image directly without CORS because it taints canvas
    urlImportStatus.textContent = "CORS blocked: Use Scenery Upload button or CORS-enabled URL";
    urlImportStatus.className = "text-[9px] text-rose-400";
  }

  function applyLoadedSceneryImage(img, badgeText) {
    state.bgImage = img;
    state.isForceScaled = false;
    getElement('bgStatusBadge').textContent = badgeText;
    getElement('bgStatusBadge').className = 'text-[10px] text-emerald-500 font-mono-avionics font-bold';
    urlImportStatus.textContent = "Loaded ✓";
    urlImportStatus.className = "text-[9px] text-emerald-400";
    renderAll();
    setTimeout(() => urlImportStatus.classList.add('hidden'), 2500);
  }

  btnLoadImageUrl.addEventListener('click', () => {
    loadSceneryFromUrl(imageUrlInput.value);
  }, { signal: listeners.signal });

  // Clear Uploaded / URL Image and restore default scenery photo
  getElement('btnClearSceneryPhoto').addEventListener('click', () => {
    const filePicker = getElement('filePicker');
    if (filePicker) filePicker.value = "";
    imageUrlInput.value = "";
    urlImportStatus.classList.add('hidden');
    renderStandbyCanvas();
  }, { signal: listeners.signal });

  imageUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadSceneryFromUrl(imageUrlInput.value);
    }
  }, { signal: listeners.signal });

  // 3. Zoom and Pan Controls
  getElement('bgZoom').addEventListener('input', (e) => {
    state.bgZoom = e.target.value / 100;
    getElement('zoomVal').textContent = `${(state.bgZoom).toFixed(2)}×`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('bgPanX').addEventListener('input', (e) => {
    if (state.lockPanX) {
      e.target.value = state.bgPanX;
      return;
    }
    state.bgPanX = parseInt(e.target.value, 10);
    getElement('panXVal').textContent = `${state.bgPanX}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('bgPanY').addEventListener('input', (e) => {
    if (state.lockPanY) {
      e.target.value = state.bgPanY;
      return;
    }
    state.bgPanY = parseInt(e.target.value, 10);
    getElement('panYVal').textContent = `${state.bgPanY}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Lock X & Lock Y button toggle functions and listeners
  const btnToggleLockX = getElement('btnToggleLockX');
  const lockIconX = getElement('lockIconX');
  const lockLabelX = getElement('lockLabelX');
  const btnToggleLockY = getElement('btnToggleLockY');
  const lockIconY = getElement('lockIconY');
  const lockLabelY = getElement('lockLabelY');

  function updateLockUI() {
    // Update Lock X button styling
    if (state.lockPanX) {
      btnToggleLockX.className = "py-1 px-2 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center gap-1.5 font-bold transition shadow-sm";
      lockIconX.textContent = "🔒";
      lockLabelX.textContent = "Locked X";
      getElement('bgPanX').disabled = true;
      getElement('bgPanX').classList.add('opacity-40');
    } else {
      btnToggleLockX.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1.5 font-medium transition";
      lockIconX.textContent = "🔓";
      lockLabelX.textContent = "Lock X";
      getElement('bgPanX').disabled = false;
      getElement('bgPanX').classList.remove('opacity-40');
    }

    // Update Lock Y button styling
    if (state.lockPanY) {
      btnToggleLockY.className = "py-1 px-2 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center gap-1.5 font-bold transition shadow-sm";
      lockIconY.textContent = "🔒";
      lockLabelY.textContent = "Locked Y";
      getElement('bgPanY').disabled = true;
      getElement('bgPanY').classList.add('opacity-40');
    } else {
      btnToggleLockY.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1.5 font-medium transition";
      lockIconY.textContent = "🔓";
      lockLabelY.textContent = "Lock Y";
      getElement('bgPanY').disabled = false;
      getElement('bgPanY').classList.remove('opacity-40');
    }
  }

  btnToggleLockX.addEventListener('click', () => {
    state.lockPanX = !state.lockPanX;
    updateLockUI();
  }, { signal: listeners.signal });

  btnToggleLockY.addEventListener('click', () => {
    state.lockPanY = !state.lockPanY;
    updateLockUI();
  }, { signal: listeners.signal });



  // Reset Function: Resets Pan/Zoom, unlocks axes, and restores scenery to default scenery
  function resetPanAndZoom() {
    state.bgZoom = 1.0;
    state.bgPanX = 0;
    state.bgPanY = 0;
    state.lockPanX = false;
    state.lockPanY = false;
    state.isForceScaled = false;

    getElement('bgZoom').value = 100;
    getElement('bgPanX').value = 0;
    getElement('bgPanY').value = 0;
    getElement('zoomVal').textContent = '1.00×';
    getElement('panXVal').textContent = '0px';
    getElement('panYVal').textContent = '0px';

    updateLockUI();

    // Reset uploaded image back to default scenery photo
    const filePicker = getElement('filePicker');
    if (filePicker) filePicker.value = "";
    renderStandbyCanvas();
  }

  const btnResetPanZoom = getElement('btnResetPanZoom');
  if (btnResetPanZoom) btnResetPanZoom.addEventListener('click', resetPanAndZoom, { signal: listeners.signal });
  getElement('btnResetPanZoomInline').addEventListener('click', resetPanAndZoom, { signal: listeners.signal });

  getElement('btnFitWidth').addEventListener('click', () => {
    state.isForceScaled = false;
    state.bgZoom = 1.0;
    if (!state.lockPanX) {
      state.bgPanX = 0;
      getElement('bgPanX').value = 0;
      getElement('panXVal').textContent = '0px';
    }
    getElement('bgZoom').value = 100;
    getElement('zoomVal').textContent = '1.00×';
    renderAll();
  }, { signal: listeners.signal });

  getElement('btnFitHeight').addEventListener('click', () => {
    state.isForceScaled = false;
    state.bgZoom = 1.25;
    getElement('bgZoom').value = 125;
    getElement('zoomVal').textContent = '1.25×';
    renderAll();
  }, { signal: listeners.signal });

  getElement('btnCenterCover').addEventListener('click', () => {
    state.isForceScaled = false;
    state.bgZoom = 1.15;
    if (!state.lockPanX) {
      state.bgPanX = 0;
      getElement('bgPanX').value = 0;
      getElement('panXVal').textContent = '0px';
    }
    if (!state.lockPanY) {
      state.bgPanY = 0;
      getElement('bgPanY').value = 0;
      getElement('panYVal').textContent = '0px';
    }
    getElement('bgZoom').value = 115;
    getElement('zoomVal').textContent = '1.15×';
    renderAll();
  }, { signal: listeners.signal });

  // One-click action: Force image to exactly 5664×2500 and center it
  getElement('btnForceScale').addEventListener('click', () => {
    state.isForceScaled = true;
    state.bgZoom = 1.0;
    state.bgPanX = 0;
    state.bgPanY = 0;
    getElement('bgZoom').value = 100;
    getElement('bgPanX').value = 0;
    getElement('bgPanY').value = 0;
    getElement('zoomVal').textContent = '1.00×';
    getElement('panXVal').textContent = '0px';
    getElement('panYVal').textContent = '0px';
    renderAll();
  }, { signal: listeners.signal });

  // 4. Scrims & Grading
  getElement('bgBright').addEventListener('input', (e) => {
    state.bgBright = e.target.value;
    getElement('brightVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('bgContrast').addEventListener('input', (e) => {
    state.bgContrast = e.target.value;
    getElement('contrastVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('botScrim').addEventListener('input', (e) => {
    state.botScrim = parseInt(e.target.value, 10) || 0;
    getElement('botScrimVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });

  // Individual & Full Reset Buttons for Photo Grading & Scrim
  getElement('btnResetBright').addEventListener('click', () => {
    state.bgBright = 100;
    getElement('bgBright').value = 100;
    getElement('brightVal').textContent = '100%';
    renderAll();
  }, { signal: listeners.signal });

  getElement('btnResetContrast').addEventListener('click', () => {
    state.bgContrast = 105;
    getElement('bgContrast').value = 105;
    getElement('contrastVal').textContent = '105%';
    renderAll();
  }, { signal: listeners.signal });

  getElement('btnResetScrim').addEventListener('click', () => {
    state.botScrim = 45;
    getElement('botScrim').value = 45;
    getElement('botScrimVal').textContent = '45%';
    renderAll();
  }, { signal: listeners.signal });

  function resetAllGrading() {
    state.bgBright = 100;
    state.bgContrast = 105;
    state.botScrim = 45;

    getElement('bgBright').value = 100;
    getElement('bgContrast').value = 105;
    getElement('botScrim').value = 45;

    getElement('brightVal').textContent = '100%';
    getElement('contrastVal').textContent = '105%';
    getElement('botScrimVal').textContent = '45%';

    renderAll();
  }

  getElement('btnResetGradingAll').addEventListener('click', resetAllGrading, { signal: listeners.signal });
  const btnResetGradingHeaderLink = getElement('btnResetGradingHeaderLink');
  if (btnResetGradingHeaderLink) btnResetGradingHeaderLink.addEventListener('click', resetAllGrading, { signal: listeners.signal });

  // 5. Text Bindings (Centered City Under ICAO, No Separator Line)
  // ICAO Airport Input & Instant 4-Letter Auto-Fill
  const icaoInput = getElement('icaoInput');
  const cityInput = getElement('cityInput');
  const autoLookupCity = getElement('autoLookupCity');
  const icaoLookupBadge = getElement('icaoLookupBadge');

  icaoInput.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    state.airport.icao = val;
    e.target.value = val;

    // Auto-lookup after exactly 4 letters
    if (val.length === 4 && autoLookupCity.checked) {
      const matchedCity = AIRPORT_DATABASE[val];
      if (matchedCity) {
        state.airport.city = matchedCity;
        cityInput.value = matchedCity;
        cityInput.classList.remove('text-rose-500', 'border-rose-500');
        icaoLookupBadge.textContent = "Auto-Filled ✓";
        icaoLookupBadge.className = "text-[9px] text-emerald-400 font-mono-avionics font-bold";
        icaoLookupBadge.classList.remove('hidden');
        setTimeout(() => icaoLookupBadge.classList.add('hidden'), 2500);
      } else {
        // Invalid ICAO entered: display red [INVALID AIRPORT] in city name field and on canvas
        const invalidMsg = "[INVALID AIRPORT]";
        state.airport.city = invalidMsg;
        cityInput.value = invalidMsg;
        cityInput.classList.add('text-rose-500', 'border-rose-500');
        icaoLookupBadge.textContent = "Invalid ICAO ✗";
        icaoLookupBadge.className = "text-[9px] text-rose-400 font-mono-avionics font-bold";
        icaoLookupBadge.classList.remove('hidden');
      }
    } else if (val.length < 4) {
      // Clear invalid warning styling when editing
      cityInput.classList.remove('text-rose-500', 'border-rose-500');
      icaoLookupBadge.classList.add('hidden');
    }

    renderAll();
  }, { signal: listeners.signal });

  // Also clear invalid red text when user manually focuses or types into city field
  cityInput.addEventListener('focus', () => {
    if (cityInput.value === "[INVALID AIRPORT]") {
      cityInput.value = "";
      state.airport.city = "";
      cityInput.classList.remove('text-rose-500', 'border-rose-500');
      icaoLookupBadge.classList.add('hidden');
      renderAll();
    }
  }, { signal: listeners.signal });
  getElement('cityInput').addEventListener('input', (e) => {
    state.airport.city = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  getElement('textFont').addEventListener('change', (e) => {
    state.airport.font = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  getElement('icaoWeight').addEventListener('change', (e) => {
    state.airport.icaoWeight = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  getElement('cityWeight').addEventListener('change', (e) => {
    state.airport.cityWeight = e.target.value;
    renderAll();
  }, { signal: listeners.signal });
  getElement('icaoSize').addEventListener('input', (e) => {
    state.airport.icaoSize = parseInt(e.target.value, 10);
    getElement('icaoSizeVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('citySize').addEventListener('input', (e) => {
    state.airport.citySize = parseInt(e.target.value, 10);
    getElement('citySizeVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('icaoCityGap').addEventListener('input', (e) => {
    state.airport.gap = parseInt(e.target.value, 10);
    getElement('icaoCityGapVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('textPosX').addEventListener('input', (e) => {
    state.airport.posX = parseInt(e.target.value, 10) || 0;
    renderAll();
  }, { signal: listeners.signal });
  getElement('textPosY').addEventListener('input', (e) => {
    state.airport.posY = parseInt(e.target.value, 10) || 0;
    renderAll();
  }, { signal: listeners.signal });
  // Legibility & Contrast Modes (Dark BG, Light BG, Light Glow, Outline, Soft)
  const btnLegibilityDark = getElement('btnLegibilityDark');
  const btnLegibilityLightBG = getElement('btnLegibilityLightBG');
  const btnLegibilityLight = getElement('btnLegibilityLight');
  const btnLegibilityOutline = getElement('btnLegibilityOutline');
  const btnLegibilitySoft = getElement('btnLegibilitySoft');
  const legibilityIntensity = getElement('legibilityIntensity');
  const legibilityIntensityVal = getElement('legibilityIntensityVal');
  const legibilityStyleRow = getElement('legibilityStyleRow');
  const legibilityIntensityRow = getElement('legibilityIntensityRow');

  // Toggleable Legibility Modes (Clicking an active mode turns it off)
  function toggleLegibilityMode(targetMode) {
    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
      : "py-1 px-2 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";

    if (state.airport.shadow && state.airport.legibilityMode === targetMode) {
      // If clicking already active mode, turn effect OFF
      state.airport.shadow = false;
      btnToggleLegibilityEffect.className = "py-1 px-2 tool-btn text-center font-medium transition text-slate-400";
      legibilityToggleLabel.textContent = "Effect Disabled";
    } else {
      // Turn ON with selected mode
      state.airport.shadow = true;
      state.airport.legibilityMode = targetMode;
      btnToggleLegibilityEffect.className = activeClass;
      legibilityToggleLabel.textContent = "Effect Enabled";
    }
    updateLegibilityButtonsUI();
    renderAll();
  }

  function updateLegibilityButtonsUI() {
    const mode = state.airport.legibilityMode;
    const isEffectOn = state.airport.shadow;
    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "py-1 px-0.5 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
      : "py-1 px-0.5 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";

    const buttons = [
      { btn: btnLegibilityDark, key: 'dark' },
      { btn: btnLegibilityLightBG, key: 'lightbg' },
      { btn: btnLegibilityLight, key: 'light' },
      { btn: btnLegibilityOutline, key: 'outline' },
      { btn: btnLegibilitySoft, key: 'soft' }
    ];

    buttons.forEach(({ btn, key }) => {
      if (isEffectOn && mode === key) {
        btn.className = activeClass;
      } else {
        btn.className = "py-1 px-0.5 tool-btn text-center font-medium transition text-slate-400";
      }
    });

    if (isEffectOn) {
      legibilityIntensityRow.classList.remove('opacity-40', 'pointer-events-none');
    } else {
      legibilityIntensityRow.classList.add('opacity-40', 'pointer-events-none');
    }
  }

  btnLegibilityDark.addEventListener('click', () => toggleLegibilityMode('dark'), { signal: listeners.signal });
  btnLegibilityLightBG.addEventListener('click', () => toggleLegibilityMode('lightbg'), { signal: listeners.signal });
  btnLegibilityLight.addEventListener('click', () => toggleLegibilityMode('light'), { signal: listeners.signal });
  btnLegibilityOutline.addEventListener('click', () => toggleLegibilityMode('outline'), { signal: listeners.signal });
  btnLegibilitySoft.addEventListener('click', () => toggleLegibilityMode('soft'), { signal: listeners.signal });

  // --- TEST BACKGROUND PREVIEW CONTROLS (LIGHT SCENERY & DARK SCENERY) ---
  const btnPreviewLightBg = getElement('btnPreviewLightBg');
  const btnPreviewDarkBg = getElement('btnPreviewDarkBg');
  const previewBgStatus = getElement('previewBgStatus');

  let syntheticLightImg = null;
  let syntheticDarkImg = null;

  function updatePreviewBgButtonsUI() {
    const isDark = document.body.classList.contains('theme-dark');
    if (state.activePreviewBg === 'light') {
      btnPreviewLightBg.className = "py-1 px-2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1 font-bold transition shadow-sm";
      btnPreviewDarkBg.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition";
      previewBgStatus.textContent = "Light Preview ON";
      previewBgStatus.className = "text-[9px] text-amber-400 font-mono-avionics font-bold";
      previewBgStatus.classList.remove('hidden');
    } else if (state.activePreviewBg === 'dark') {
      const darkActiveBtnClass = isDark
        ? "py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 flex items-center justify-center gap-1 font-bold transition shadow-sm"
        : "py-1 px-2 rounded-md bg-black/10 text-black border border-black/30 flex items-center justify-center gap-1 font-bold transition shadow-sm";
      btnPreviewDarkBg.className = darkActiveBtnClass;
      btnPreviewLightBg.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition";
      previewBgStatus.textContent = "Dark Preview ON";
      previewBgStatus.className = isDark ? "text-[9px] text-white font-mono-avionics font-bold" : "text-[9px] text-black font-mono-avionics font-bold";
      previewBgStatus.classList.remove('hidden');
    } else {
      btnPreviewLightBg.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition";
      btnPreviewDarkBg.className = "py-1 px-2 tool-btn flex items-center justify-center gap-1 font-medium transition";
      previewBgStatus.classList.add('hidden');
    }
  }

  btnPreviewLightBg.addEventListener('click', () => {
    if (state.activePreviewBg === 'light') {
      // Toggle OFF: Restore previous user/default image
      state.activePreviewBg = null;
      if (state.cachedUserImage) {
        state.bgImage = state.cachedUserImage;
      } else {
        renderStandbyCanvas();
      }
    } else {
      // Toggle ON: Cache current image if not previewing, then set light image
      if (!state.activePreviewBg && state.bgImage) {
        state.cachedUserImage = state.bgImage;
      }
      state.activePreviewBg = 'light';
      if (!syntheticLightImg) {
        syntheticLightImg = createSyntheticLightBgImage();
      }
      state.bgImage = syntheticLightImg;
    }
    updatePreviewBgButtonsUI();
    renderAll();
  }, { signal: listeners.signal });

  btnPreviewDarkBg.addEventListener('click', () => {
    if (state.activePreviewBg === 'dark') {
      // Toggle OFF: Restore previous user/default image
      state.activePreviewBg = null;
      if (state.cachedUserImage) {
        state.bgImage = state.cachedUserImage;
      } else {
        renderStandbyCanvas();
      }
    } else {
      // Toggle ON: Cache current image if not previewing, then set dark image
      if (!state.activePreviewBg && state.bgImage) {
        state.cachedUserImage = state.bgImage;
      }
      state.activePreviewBg = 'dark';
      if (!syntheticDarkImg) {
        syntheticDarkImg = createSyntheticDarkBgImage();
      }
      state.bgImage = syntheticDarkImg;
    }
    updatePreviewBgButtonsUI();
    renderAll();
  }, { signal: listeners.signal });

  legibilityIntensity.addEventListener('input', (e) => {
    state.airport.legibilityIntensity = parseInt(e.target.value, 10);
    legibilityIntensityVal.textContent = `${state.airport.legibilityIntensity}%`;
    renderAll();
  }, { signal: listeners.signal });

  // Enable/Disable Effect Button Toggle
  const btnToggleLegibilityEffect = getElement('btnToggleLegibilityEffect');
  const legibilityToggleLabel = getElement('legibilityToggleLabel');

  btnToggleLegibilityEffect.addEventListener('click', () => {
    state.airport.shadow = !state.airport.shadow;
    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
      : "py-1 px-2 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";

    if (state.airport.shadow) {
      btnToggleLegibilityEffect.className = activeClass;
      legibilityToggleLabel.textContent = "Effect Enabled";
    } else {
      btnToggleLegibilityEffect.className = "py-1 px-2 tool-btn text-center font-medium transition text-slate-400";
      legibilityToggleLabel.textContent = "Effect Disabled";
    }
    updateLegibilityButtonsUI();
    renderAll();
  }, { signal: listeners.signal });

  // Reset Legibility to defaults (Dark Back, 100% Intensity, Enabled)
  getElement('btnResetLegibility').addEventListener('click', () => {
    state.airport.shadow = true;
    state.airport.legibilityMode = 'dark';
    state.airport.legibilityIntensity = 100;

    getElement('legibilityIntensity').value = 100;
    getElement('legibilityIntensityVal').textContent = '100%';

    const isDark = document.body.classList.contains('theme-dark');
    const activeClass = isDark
      ? "py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
      : "py-1 px-2 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";

    btnToggleLegibilityEffect.className = activeClass;
    legibilityToggleLabel.textContent = "Effect Enabled";

    updateLegibilityButtonsUI();
    renderAll();
  }, { signal: listeners.signal });

  // Preset buttons
  root.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const icao = btn.getAttribute('data-icao');
      const city = btn.getAttribute('data-city');
      state.airport.icao = icao;
      state.airport.city = city;
      getElement('icaoInput').value = icao;
      getElement('cityInput').value = city;
      renderAll();
    }, { signal: listeners.signal });
  });

  getElement('btnResetTextPos').addEventListener('click', () => {
    state.airport.posX = 4900;
    state.airport.posY = 2180;
    getElement('textPosX').value = 4900;
    getElement('textPosY').value = 2180;
    renderAll();
  }, { signal: listeners.signal });

  // Theme Toggle Logic (Light / Dark Mode with localStorage persistence)
  const btnThemeToggle = getElement('btnThemeToggle');
  const themeIconContainer = getElement('themeIconContainer');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (themeIconContainer) {
        // Light Mode: Exact sun symbol from reference image (center ring + 8 rounded radiating tick lines) in solid black
        themeIconContainer.innerHTML = `
          <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <!-- Center circle ring -->
            <circle cx="12" cy="12" r="5" stroke-width="2.5"/>
            <!-- 8 rounded radiating tick lines -->
            <path stroke-linecap="round" d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5.28 5.28l1.77 1.77M16.95 16.95l1.77 1.77M5.28 18.72l1.77-1.77M16.95 7.05l1.77-1.77"/>
          </svg>
        `;
      }
      localStorage.setItem('airwaylink_theme', 'light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      if (themeIconContainer) {
        // Dark Mode: Clean, classic Crescent Moon in pure white
        themeIconContainer.innerHTML = `
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73A8.15 8.15 0 019.08 5.49a8.59 8.59 0 01.25-2 1 1 0 00-1.28-1.15A10.15 10.15 0 002.5 12.15 10.22 10.22 0 0012.72 22a10.08 10.08 0 009.07-5.85 1 1 0 00-.15-1.15z"/>
          </svg>
        `;
      }
      localStorage.setItem('airwaylink_theme', 'dark');
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab(activeTabId);
    }
    if (typeof setHeaderMode === 'function') {
      setHeaderMode(state.headerMode || 'logo');
    }
    if (typeof updateHdrButtonsUI === 'function') {
      updateHdrButtonsUI();
    }
    if (typeof updateLegibilityButtonsUI === 'function') {
      updateLegibilityButtonsUI();
    }
    if (typeof updatePreviewBgButtonsUI === 'function') {
      updatePreviewBgButtonsUI();
    }
    if (typeof updateCustomBoxAlignUI === 'function') {
      updateCustomBoxAlignUI();
    }
  }

  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark');
  }, { signal: listeners.signal });

  // 7. Viewport Zoom Buttons (guarded)
  const btnZoomIn = getElement('btnZoomIn');
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      state.viewportZoom = Math.min(2.5, state.viewportZoom + 0.15);
      renderAll();
    }, { signal: listeners.signal });
  }
  const btnZoomOut = getElement('btnZoomOut');
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      state.viewportZoom = Math.max(0.4, state.viewportZoom - 0.15);
      renderAll();
    }, { signal: listeners.signal });
  }
  const btnResetView = getElement('btnResetView');
  if (btnResetView) {
    btnResetView.addEventListener('click', () => {
      state.viewportZoom = 1.0;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Header Refresh Page Button
  const btnRefreshPage = getElement('btnRefreshPage');
  if (btnRefreshPage) {
    btnRefreshPage.addEventListener('click', () => {
      window.location.reload();
    }, { signal: listeners.signal });
  }

  // --- FUNNY AVIATION TAGLINES ---
  const AVIATION_TAGLINES = [
    // Flight Ops & Simulator Wisdom
    "Aviate, Navigate, Communicate, then fiddle with the banner.",
    "A good landing is one you can walk away from. A great landing means we can reuse the banner.",
    "Altitude is like money in the bank: you only have too much when your banner is falling off.",
    "Clearance delivery: 'Airwaylink 42, cleared to look magnificent on finals.'",
    "Trim the rudder, calibrate the HUD, and align the logo by 2 pixels.",
    "The only thing more expensive than aviation is aviation graphic design.",
    "Never let an airplane take you somewhere your banner hasn't arrived 5 minutes earlier.",
    "Wind check: 270 at 12 gusting 25. Banner status: Crisp & stable.",
    "May contain traces of 4K cloud textures and virtual jet fuel.",
    "V1... Rotate... Banner looking sharp.",
    "Squawk 7700 for emergency, 7600 for lost comms, squawk 7000 for top-tier livery aesthetics.",
    "ATC: 'Say intentions.' Pilot: 'Exporting this banner under 2.0 MB.'",
    "Autopilot disconnected, artistic freedom engaged.",
    "Flaps full, gear down, high-resolution scenery locked in.",
    "According to all known laws of aviation, there is no reason this banner shouldn't look great.",

    // Airplane! (1980)
    "Surely you can't be serious? I am serious, and don't call me Shirley.",
    "Looks like I picked the wrong week to quit designing virtual airline banners.",
    "Roger, Roger. What's our vector, Victor? Tower's on 118.7, over.",
    "There's no reason to become alarmed, and we hope you'll enjoy the rest of your flight.",
    "We have clearance, Clarence. Vector, Victor. Banner rendered, Roger.",
    "By the way, is there anyone on board who knows how to fly a plane... or export a JPEG?",
    "Joey, have you ever been in a cockpit before? Have you ever seen a banner this crisp?",
    "Nervous? Yes. First time? No, I've been nervous lots of times.",

    // Top Gun & Top Gun: Maverick
    "I feel the need... the need for speed (and banners under 2.0 MB).",
    "Tower, this is Ghost Rider requesting a flyby. Negative, Ghost Rider, the banner is full.",
    "Son, your ego is writing checks your graphics card can't cash.",
    "You don't have time to think up there. If you think, you're dead. Just tweak the gradient.",
    "It's not the plane, it's the pilot... and whoever framed this screenshot.",
    "Talk to me, Goose. Does this font look centered to you?",
    "You're not sending him to the penalty box, you're sending him to Photoshop.",

    // Pushing Tin & Air Traffic Control Classic Lore
    "Pushing tin, stacking metal, and designing banners on the break.",
    "Tower to aircraft: 'To avoid another runway incursion, please stop admiring your banner and cross 28R.'",
    "Pilot: 'Tower, what's our traffic?' Tower: 'Right behind you and he says your banner looks clean.'",
    "You want altitude, you want vectors, or you want me to critique your typography?",
    "Center: 'Airwaylink 777, turn right heading 090, maintain 3,000, looking good on the scope.'",

    // Catch Me If You Can & The Aviator
    "Two little mice fell in a bucket of cream... and one of them became an airline captain.",
    "Skywayman on frequency: Frank Abagnale approved this jumpseat credentials.",
    "Show me the blueprints. Show me the banner. Way of the future, way of the future.",

    // Additional Pilot & Flight Sim Culture
    "Remember: Runway behind you and altitude above you are the two most useless things in aviation.",
    "There are old pilots and there are bold pilots, but there are no old bold pilots with blurry banners.",
    "FMC initialized, cost index 45, banner quality 99.8%.",
    "ILS Category III approach armed: zero visibility outside, 100% visibility on this banner.",
    "SimBrief dispatch generated: 42,000 lbs fuel, 168 pax, 1 flawless virtual banner."
  ];

  let currentTaglineIdx = -1;
  function cycleTagline() {
    const taglineText = getElement('taglineText');
    if (!taglineText) return;
    let nextIdx = Math.floor(Math.random() * AVIATION_TAGLINES.length);
    if (nextIdx === currentTaglineIdx) {
      nextIdx = (nextIdx + 1) % AVIATION_TAGLINES.length;
    }
    currentTaglineIdx = nextIdx;
    taglineText.textContent = `"${AVIATION_TAGLINES[currentTaglineIdx]}"`;
  }

  const taglineContainer = getElement('taglineContainer');
  if (taglineContainer) {
    taglineContainer.addEventListener('click', cycleTagline, { signal: listeners.signal });
  }

  // Single Primary Export Button in Header
  getElement('btnTopExport').addEventListener('click', handleSingleExport, { signal: listeners.signal });
  const btnBottomExport = getElement('btnBottomExport');
  if (btnBottomExport) btnBottomExport.addEventListener('click', handleSingleExport, { signal: listeners.signal });

  window.addEventListener('resize', renderAll, { signal: listeners.signal });

  // ==========================================
  // CUSTOM AIRLINE PROFILE SYSTEM
  // Add, store, and manage user-created virtual airline profiles
  // ==========================================

  // Helper: Compute alphabetical sort key for an airline name.
  // If an airline name starts with 'v' or 'V' (e.g. "vFedEx", "vUAL", "V-Airline", "Virtual Air"),
  // skip past the leading 'v' to alphabetize by the core name (e.g. "FedEx", "UAL").
  function getAirlineSortKey(name) {
    if (!name) return "";
    let clean = name.trim();
    // If starts with 'v' followed immediately by an uppercase letter or hyphen or space (e.g. "vFedEx", "vUAL", "v-Air", "v Air")
    // or starts with "virtual " (case-insensitive), normalize for sorting:
    const vMatch = clean.match(/^v[\s\-_]?([a-z0-9].*)$/i);
    if (vMatch && vMatch[1]) {
      return vMatch[1].toLowerCase();
    }
    return clean.toLowerCase();
  }

  function syncCustomAirlinesToUI() {
    const records = loadCustomAirlineRecords();
    const dropdown = getElement('airlineDropdown');
    if (!dropdown) return;

    // 1. Register records in airlineProfiles dictionary
    records.forEach(rec => {
      airlineProfiles[rec.code] = {
        name: rec.name,
        suffix: rec.suffix || "Focus Airport",
        brandColor: rec.brandColor || "#002b49",
        defaultLogoHeight: rec.defaultLogoHeight || 160,
        fontCss: "italic 800 {size}px 'Barlow', sans-serif",
        letterSpacing: "2px",
        isCustomUserAirline: true
      };
    });

    // Preserve currently selected key
    const currentSelected = state.selectedAirlineKey;

    // 2. Remove any previously created custom optgroup or custom options
    const oldGroup = getElement('customAirlinesOptGroup');
    if (oldGroup) oldGroup.remove();

    // 3. Gather all airline entries to populate in the dropdown.
    // Built-in profiles: ANZ, CPA, FDX, FFT, ICE, JBU, QFA, UAL.
    // Custom user added profiles from storage.
    // "CUSTOM" (generic custom blank slate) is kept at the very end of the list.
    const standardKeys = ["ANZ", "CPA", "FDX", "FFT", "ICE", "JBU", "QFA", "UAL"];
    const allEntries = [];

    standardKeys.forEach(k => {
      if (airlineProfiles[k]) {
        allEntries.push({ key: k, name: airlineProfiles[k].name });
      }
    });

    records.forEach(rec => {
      allEntries.push({ key: rec.code, name: rec.name });
    });

    // Sort in ABC order, skipping leading 'v'
    allEntries.sort((a, b) => {
      const keyA = getAirlineSortKey(a.name);
      const keyB = getAirlineSortKey(b.name);
      return keyA.localeCompare(keyB);
    });

    // Rebuild dropdown options cleanly
    dropdown.innerHTML = "";

    // If nothing has been chosen yet, keep the placeholder
    if (!currentSelected) {
      const placeholderOpt = document.createElement('option');
      placeholderOpt.id = 'optSelectAirlinePlaceholder';
      placeholderOpt.value = "";
      placeholderOpt.textContent = "Select Airline";
      placeholderOpt.disabled = true;
      placeholderOpt.hidden = true;
      placeholderOpt.selected = true;
      dropdown.appendChild(placeholderOpt);
    }

    // Append all airlines in a single unified alphabetical list with code in parentheses: Name (CODE)
    allEntries.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = `${item.name} (${item.key})`;
      dropdown.appendChild(opt);
    });

    // Append generic "Custom" blank slate profile at bottom
    const genericCustomOpt = document.createElement('option');
    genericCustomOpt.value = "CUSTOM";
    genericCustomOpt.textContent = "Custom";
    dropdown.appendChild(genericCustomOpt);

    // Restore dropdown selection if valid
    if (currentSelected && (airlineProfiles[currentSelected] || currentSelected === 'CUSTOM')) {
      dropdown.value = currentSelected;
    }

    // 4. Update the management list inside modal
    renderCustomAirlinesModalList();
  }

  function renderCustomAirlinesModalList() {
    const records = loadCustomAirlineRecords();
    const listContainer = getElement('customAirlinesList');
    const countLabel = getElement('customAirlinesCount');
    if (!listContainer || !countLabel) return;

    countLabel.textContent = `${records.length} added`;

    if (records.length === 0) {
      listContainer.innerHTML = `
        <div id="emptyCustomAirlinesMsg" class="py-6 text-center text-xs text-zinc-500 font-mono-avionics border border-zinc-800/60 rounded-xl bg-slate-950/40">
          No custom airlines added yet. Create one above!
        </div>
      `;
      return;
    }

    listContainer.innerHTML = "";
    // Sort custom airline records alphabetically by name (skipping leading 'v')
    const sortedRecords = [...records].sort((a, b) => {
      return getAirlineSortKey(a.name).localeCompare(getAirlineSortKey(b.name));
    });

    sortedRecords.forEach(rec => {
      const item = document.createElement('div');
      item.className = "modal-item p-2.5 rounded-lg border flex items-center justify-between gap-3 transition shadow-sm";

      const hasLogo = !!state.customLogoOverrides[rec.code];
      const logoPreviewHtml = hasLogo 
        ? `<img src="${state.customLogoOverrides[rec.code].src}" class="max-h-full max-w-full object-contain">`
        : `<span class="text-[9px] font-mono-avionics font-bold modal-muted">${rec.code}</span>`;

      item.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded border border-inherit bg-black/10 dark:bg-black/40 flex items-center justify-center p-0.5 shrink-0 overflow-hidden" style="border-top: 2px solid ${rec.brandColor}">
            ${logoPreviewHtml}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold modal-title font-hud truncate">${rec.name}</span>
              <span class="text-[9px] font-mono-avionics px-1.5 py-0.5 rounded modal-badge font-bold shrink-0">${rec.code}</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] modal-muted font-mono-avionics">
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full inline-block" style="background-color: ${rec.brandColor}"></span>
                ${rec.brandColor.toUpperCase()}
              </span>
              <span>•</span>
              <span>${rec.suffix}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" data-select-airline="${rec.code}" title="Apply to Workspace" class="py-1 px-2.5 text-[10px] font-mono-avionics font-bold rounded tool-btn transition">
            Use
          </button>
          <button type="button" data-delete-airline="${rec.code}" title="Delete Airline Profile" class="p-1 modal-muted hover:text-rose-500 rounded transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      `;

      // Event: "Use" button immediately selects and applies airline
      item.querySelector(`[data-select-airline="${rec.code}"]`).addEventListener('click', () => {
        getElement('airlineDropdown').value = rec.code;
        setAirline(rec.code);
        renderAll();
        getElement('airlineModal').classList.add('hidden');
      }, { signal: listeners.signal });

      // Event: Delete button removes profile and persistence
      item.querySelector(`[data-delete-airline="${rec.code}"]`).addEventListener('click', async () => {
        if (!confirm(`Delete custom airline profile "${rec.name}" (${rec.code})?`)) return;

        let currentRecords = loadCustomAirlineRecords();
        currentRecords = currentRecords.filter(r => r.code !== rec.code);
        saveCustomAirlineRecords(currentRecords);

        delete airlineProfiles[rec.code];
        delete state.customLogoOverrides[rec.code];
        await removeLogoFromStorage(rec.code);

        // If currently selected, clear selection or switch to NONE
        if (state.selectedAirlineKey === rec.code) {
          setAirline('');
          const dd = getElement('airlineDropdown');
          if (dd) dd.value = '';
        }

        syncCustomAirlinesToUI();
        renderAll();
      }, { signal: listeners.signal });

      listContainer.appendChild(item);
    });
  }

  // Modal Opening & Closing Events
  const btnOpenAirlineModal = getElement('btnOpenAirlineModal');
  const airlineModal = getElement('airlineModal');
  const btnCloseAirlineModal = getElement('btnCloseAirlineModal');
  const btnDoneAirlineModal = getElement('btnDoneAirlineModal');

  if (btnOpenAirlineModal && airlineModal) {
    btnOpenAirlineModal.addEventListener('click', () => {
      renderCustomAirlinesModalList();
      airlineModal.classList.remove('hidden');
    }, { signal: listeners.signal });
  }

  [btnCloseAirlineModal, btnDoneAirlineModal].forEach(btn => {
    if (btn && airlineModal) {
      btn.addEventListener('click', () => {
        airlineModal.classList.add('hidden');
      }, { signal: listeners.signal });
    }
  });

  // Color picker synchronization for Add Airline Form
  const inputNewAirlineColor = getElement('inputNewAirlineColor');
  const inputNewAirlineColorHex = getElement('inputNewAirlineColorHex');
  if (inputNewAirlineColor && inputNewAirlineColorHex) {
    inputNewAirlineColor.addEventListener('input', (e) => {
      inputNewAirlineColorHex.value = e.target.value.toUpperCase();
    }, { signal: listeners.signal });
    inputNewAirlineColorHex.addEventListener('input', (e) => {
      let val = e.target.value;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        inputNewAirlineColor.value = val;
      }
    }, { signal: listeners.signal });
  }

  // Height slider sync for Add Airline Form
  const rangeNewAirlineHeight = getElement('rangeNewAirlineHeight');
  const labelNewAirlineHeight = getElement('labelNewAirlineHeight');
  if (rangeNewAirlineHeight && labelNewAirlineHeight) {
    rangeNewAirlineHeight.addEventListener('input', (e) => {
      labelNewAirlineHeight.textContent = `${e.target.value}px`;
    }, { signal: listeners.signal });
  }

  // Logo image picker & preview for Add Airline Form
  let pendingNewAirlineLogoDataUrl = null;
  const inputNewAirlineLogo = getElement('inputNewAirlineLogo');
  const labelNewAirlineLogoFile = getElement('labelNewAirlineLogoFile');
  const previewNewAirlineLogoContainer = getElement('previewNewAirlineLogoContainer');
  const imgNewAirlineLogoPreview = getElement('imgNewAirlineLogoPreview');

  if (inputNewAirlineLogo) {
    inputNewAirlineLogo.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      labelNewAirlineLogoFile.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const rawDataUrl = loadEvt.target.result;
        const tempImg = new Image();
        tempImg.onload = () => {
          const trimmed = trimTransparentImage(tempImg);
          pendingNewAirlineLogoDataUrl = trimmed.src;
          imgNewAirlineLogoPreview.src = trimmed.src;
          previewNewAirlineLogoContainer.classList.remove('hidden');
        };
        tempImg.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }, { signal: listeners.signal });
  }

  // Save New Airline Button Handler
  const btnSaveNewAirline = getElement('btnSaveNewAirline');
  const msgNewAirlineError = getElement('msgNewAirlineError');

  if (btnSaveNewAirline) {
    btnSaveNewAirline.addEventListener('click', async () => {
      msgNewAirlineError.classList.add('hidden');
      msgNewAirlineError.textContent = "";

      const rawCode = (getElement('inputNewAirlineCode').value || "").trim().toUpperCase();
      const rawName = (getElement('inputNewAirlineName').value || "").trim();
      const rawSuffix = (getElement('inputNewAirlineSuffix').value || "Focus Airport").trim();
      let rawColor = (getElement('inputNewAirlineColorHex').value || "#002B49").trim();
      if (!rawColor.startsWith('#')) rawColor = '#' + rawColor;
      const rawHeight = parseInt(getElement('rangeNewAirlineHeight').value, 10) || 160;

      // Validation
      if (!rawCode || rawCode.length < 2) {
        msgNewAirlineError.textContent = "Please provide an airline code (e.g. DLH, BAW, SWA).";
        msgNewAirlineError.classList.remove('hidden');
        return;
      }
      if (!rawName) {
        msgNewAirlineError.textContent = "Please provide the full airline display name.";
        msgNewAirlineError.classList.remove('hidden');
        return;
      }

      // Avoid duplicate codes with built-ins or existing
      const existingBuiltIns = ["ANZ", "CPA", "FDX", "FFT", "ICE", "JBU", "QFA", "UAL", "CUSTOM"];
      const existingRecords = loadCustomAirlineRecords();
      if (existingBuiltIns.includes(rawCode) || existingRecords.some(r => r.code === rawCode)) {
        msgNewAirlineError.textContent = `Airline code "${rawCode}" already exists. Please choose a different code.`;
        msgNewAirlineError.classList.remove('hidden');
        return;
      }

      const newRecord = {
        code: rawCode,
        name: rawName,
        suffix: rawSuffix || "Focus Airport",
        brandColor: rawColor,
        defaultLogoHeight: rawHeight
      };

      // Save logo if provided
      if (pendingNewAirlineLogoDataUrl) {
        await saveLogoToStorage(rawCode, pendingNewAirlineLogoDataUrl);
        const img = new Image();
        img.src = pendingNewAirlineLogoDataUrl;
        state.customLogoOverrides[rawCode] = img;
      }

      existingRecords.push(newRecord);
      saveCustomAirlineRecords(existingRecords);

      // Reset form fields
      getElement('inputNewAirlineCode').value = "";
      getElement('inputNewAirlineName').value = "";
      getElement('inputNewAirlineSuffix').value = "Focus Airport";
      getElement('inputNewAirlineLogo').value = "";
      labelNewAirlineLogoFile.textContent = "Choose logo image...";
      previewNewAirlineLogoContainer.classList.add('hidden');
      imgNewAirlineLogoPreview.removeAttribute('src');
      pendingNewAirlineLogoDataUrl = null;

      // Update UI and immediately switch to newly created airline
      syncCustomAirlinesToUI();
      getElement('airlineDropdown').value = rawCode;
      setAirline(rawCode);
      renderAll();

      // Close modal
      airlineModal.classList.add('hidden');
    }, { signal: listeners.signal });
  }

  applyTheme(localStorage.getItem('airwaylink_theme') || 'dark');
  updateExportButtonState();
  cycleTagline();
  syncCustomAirlinesToUI();
  renderStandbyCanvas();
  renderAll();

  preloadEmbeddedLogos().then(() => {
    if (!listeners.signal.aborted) renderAll();
  });

  return () => listeners.abort();
}
