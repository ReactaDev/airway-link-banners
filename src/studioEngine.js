import AIRPORT_DATABASE from './assets/airports.json';

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

  // Preloaded Image objects for each airline
  const loadedAirlineLogos = {};

  // Standard uniform size and spacing for airline logo lockup (matches font height)
  const UNIFORM_LOGO_SIZE = 140;
  const UNIFORM_SUFFIX_SIZE = 140;
  const BASE_DIVIDER_GAP = 20;
  const DEFAULT_HEADER_X = 150;

  // Known fallback brand colors, default logo heights, and fonts for recognized airlines
  const KNOWN_AIRLINE_DEFAULTS = {
    ANZ: { brandColor: "#002030", defaultLogoHeight: UNIFORM_LOGO_SIZE, defaultLogoOffsetY: 0, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "italic 800 {size}px 'Barlow', sans-serif", letterSpacing: "2px" },
    CPA: { brandColor: "#006564", defaultLogoHeight: 200, defaultLogoOffsetY: -20, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "700 {size}px 'Cinzel', serif", letterSpacing: "3px" },
    FDX: { brandColor: "#4d148c", defaultLogoHeight: UNIFORM_LOGO_SIZE, defaultLogoOffsetY: -20, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "italic 900 {size}px 'Inter', sans-serif", letterSpacing: "-2px" },
    FFT: { brandColor: "#006644", defaultLogoHeight: UNIFORM_LOGO_SIZE, defaultLogoOffsetY: 0, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "italic 900 {size}px 'Montserrat', sans-serif", letterSpacing: "1px" },
    ICE: { brandColor: "#001952", defaultLogoHeight: 200, defaultLogoOffsetY: -20, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "800 {size}px 'Outfit', sans-serif", letterSpacing: "3px" },
    JBU: { brandColor: "#00205b", defaultLogoHeight: 200, defaultLogoOffsetY: -10, defaultSuffixOffsetX: -200, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, defaultHeaderX: -50, fontCss: "700 {size}px 'Prompt', sans-serif", letterSpacing: "1px" },
    QFA: { brandColor: "#e40000", defaultLogoHeight: UNIFORM_LOGO_SIZE, defaultLogoOffsetY: 0, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "italic 800 {size}px 'Montserrat', sans-serif", letterSpacing: "3px" },
    UAL: { brandColor: "#002244", defaultLogoHeight: UNIFORM_LOGO_SIZE, defaultLogoOffsetY: 0, defaultSuffixSize: UNIFORM_SUFFIX_SIZE, fontCss: "900 {size}px 'Montserrat', sans-serif", letterSpacing: "1px" }
  };

  const fallbackAirlineProfile = {
    name: "Airwaylink",
    suffix: "Focus Airport",
    brandColor: "#002b49",
    defaultLogoHeight: UNIFORM_LOGO_SIZE,
    defaultLogoOffsetX: 0,
    defaultLogoOffsetY: 0,
    defaultSuffixOffsetX: 0,
    defaultSuffixOffsetY: 0,
    defaultSuffixSize: UNIFORM_SUFFIX_SIZE,
    defaultHeaderX: DEFAULT_HEADER_X,
    fontCss: "italic 800 {size}px 'Barlow', sans-serif",
    letterSpacing: "2px"
  };

  // Profiles for all virtual airlines (populated dynamically from the API)
  const airlineProfiles = {
    // AUDIT NOTE: "CUSTOM" profile is intentionally kept in the dictionary but temporarily disabled and removed from the dropdown list. Do not prune or delete during audits.
    CUSTOM: {
      name: "Custom Airline",
      suffix: "Focus Airport",
      brandColor: "#003b6f",
      defaultLogoHeight: UNIFORM_LOGO_SIZE,
      defaultLogoOffsetX: 0,
      defaultLogoOffsetY: 0,
      defaultSuffixOffsetX: 0,
      defaultSuffixOffsetY: 0,
      defaultSuffixSize: UNIFORM_SUFFIX_SIZE,
      defaultHeaderX: DEFAULT_HEADER_X,
      fontCss: "800 {size}px 'Montserrat', sans-serif",
      letterSpacing: "2px"
    }
  };

  // App State
  const state = {
    // Selected Airline & Unified Header (Starts unselected)
    selectedAirlineKey: '',
    headerMode: 'logo', // 'logo'
    logoVariant: 'dark', // 'dark' | 'light'
    airlineName: "",
    suffixName: "Focus Airport",
    topBrandColor: "#002030",
    customOverlayImage: null,
    customLogoOverrides: {}, // per-airline user-uploaded logo Image overrides

    // Header Logo / Typography & Placement
    hdrAirlineSize: UNIFORM_LOGO_SIZE, // Controls Logo Height in 'logo' mode, or font size in 'text' mode
    hdrSuffixSize: UNIFORM_SUFFIX_SIZE,
    logoOffsetX: 0,
    logoOffsetY: 0,
    suffixOffsetX: 0,
    suffixOffsetY: 0,
    hdrShadow: true,
    logoForceWhite: false,
    hdrPosX: DEFAULT_HEADER_X,
    hdrPosY: 175,
    lockHeaderPos: true,
    lockSizesOffsets: true,

    // Gradients (Colors, Individual Opacity & Depths)
    botBrandColor: "#000000",
    topGradOpacity: 90, // 0 - 100% (default: 90%)
    botGradOpacity: 90, // 0 - 100% (default: 90%)
    topGradDepth: 450,
    botGradDepth: 450,
    lockGradients: true,

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
    bgZoom: 1.0,
    bgPanX: 0,
    bgPanY: 0,
    lockPanX: false,
    lockPanY: false,
    isForceScaled: false,
    bgBright: 0,
    bgContrast: 0,
    bgSat: 100,

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
    const allCodes = Array.from(new Set([...Object.keys(airlineProfiles), "CUSTOM", ...customCodes]));
    for (const code of allCodes) {
      if (!result[code]) {
        const lsData = localStorage.getItem(`airwaylink_logo_${code}`);
        if (lsData) result[code] = lsData;
      }
    }
    return result;
  }

  // Register API airline items into airlineProfiles and trigger background logo preloading
  function registerApiAirlines(list) {
    if (!Array.isArray(list)) return;

    list.forEach(item => {
      const code = (item.icao || item.short_name || String(item.id || '')).trim().toUpperCase();
      if (!code) return;

      const name = item.long_name || item.short_name || code;
      const known = KNOWN_AIRLINE_DEFAULTS[code] || {};
      const brandColor = item.primary_color || known.brandColor || "#002b49";
      const defaultLogoHeight = known.defaultLogoHeight || UNIFORM_LOGO_SIZE;
      const defaultLogoOffsetX = known.defaultLogoOffsetX !== undefined ? known.defaultLogoOffsetX : 0;
      const defaultLogoOffsetY = known.defaultLogoOffsetY !== undefined ? known.defaultLogoOffsetY : 0;
      const defaultSuffixOffsetX = known.defaultSuffixOffsetX !== undefined ? known.defaultSuffixOffsetX : 0;
      const defaultSuffixOffsetY = known.defaultSuffixOffsetY !== undefined ? known.defaultSuffixOffsetY : 0;
      const defaultHeaderX = known.defaultHeaderX !== undefined ? known.defaultHeaderX : DEFAULT_HEADER_X;
      const fontCss = known.fontCss || "italic 800 {size}px 'Barlow', sans-serif";
      const letterSpacing = known.letterSpacing || "2px";
      const logoLightUrl = item.logo_light_url || item.logo_url || null;
      const logoDarkUrl = item.logo_url || item.logo_light_url || null;

      airlineProfiles[code] = {
        name,
        code,
        suffix: "Focus Airport",
        brandColor,
        defaultLogoHeight,
        defaultLogoOffsetX,
        defaultLogoOffsetY,
        defaultSuffixOffsetX,
        defaultSuffixOffsetY,
        defaultHeaderX,
        defaultSuffixSize: known.defaultSuffixSize || UNIFORM_SUFFIX_SIZE,
        fontCss,
        letterSpacing,
        logoUrl: logoLightUrl || logoDarkUrl,
        logoLightUrl,
        logoDarkUrl,
        enabled: item.enabled !== false,
        id: item.id,
        apiRecord: item
      };

      // Preload active airlines logos
      if (item.enabled !== false) {
        // Preload Light logo image
        if (logoLightUrl && !loadedAirlineLogos[`${code}_light`]) {
          const imgLight = new Image();
          imgLight.crossOrigin = "anonymous";
          loadedAirlineLogos[`${code}_light`] = imgLight;
          loadedAirlineLogos[code] = imgLight;
          imgLight.onload = () => {
            const trimmed = trimTransparentImage(imgLight);
            const finalImg = (trimmed && (trimmed.naturalWidth || trimmed._trimmedCanvas)) ? trimmed : imgLight;
            loadedAirlineLogos[`${code}_light`] = finalImg;
            loadedAirlineLogos[code] = finalImg;
            cacheLogoImage(`${code}_light`, finalImg);
            if (state.selectedAirlineKey === code) {
              updateSidebarLogoPreview();
              renderAll();
            }
          };
          imgLight.src = logoLightUrl;
        }

        // Preload Dark logo image
        if (logoDarkUrl && !loadedAirlineLogos[`${code}_dark`]) {
          const imgDark = new Image();
          imgDark.crossOrigin = "anonymous";
          loadedAirlineLogos[`${code}_dark`] = imgDark;
          imgDark.onload = () => {
            const trimmed = trimTransparentImage(imgDark);
            const finalImg = (trimmed && (trimmed.naturalWidth || trimmed._trimmedCanvas)) ? trimmed : imgDark;
            loadedAirlineLogos[`${code}_dark`] = finalImg;
            cacheLogoImage(`${code}_dark`, finalImg);
            if (state.selectedAirlineKey === code) {
              updateSidebarLogoPreview();
              renderAll();
            }
          };
          imgDark.src = logoDarkUrl;
        }
      }
    });
  }

  // Cache a loaded HTMLImageElement data URL into persistent storage
  function cacheLogoImage(key, img) {
    if (!key || !img) return;
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      if (c.width > 0 && c.height > 0) {
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = c.toDataURL('image/png');
        saveLogoToStorage(key, dataUrl);
      }
    } catch (e) {}
  }

  // Preload logos for a specific airline on demand with high priority
  function preloadAirline(code) {
    if (!code) return;
    const profile = airlineProfiles[code];
    if (!profile) return;

    ['dark', 'light'].forEach(variant => {
      const variantKey = `${code}_${variant}`;
      const existing = loadedAirlineLogos[variantKey];
      if (existing && (existing.complete || (existing.naturalWidth && existing.naturalWidth > 0))) {
        return;
      }

      const targetUrl = variant === 'dark'
        ? (profile.logoDarkUrl || profile.logoLightUrl || profile.logoUrl)
        : (profile.logoLightUrl || profile.logoDarkUrl || profile.logoUrl);

      if (!targetUrl) return;

      if (!loadedAirlineLogos[variantKey]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        loadedAirlineLogos[variantKey] = img;
        img.onload = () => {
          const trimmed = trimTransparentImage(img);
          const finalImg = (trimmed && (trimmed.naturalWidth || trimmed._trimmedCanvas)) ? trimmed : img;
          loadedAirlineLogos[variantKey] = finalImg;
          cacheLogoImage(variantKey, finalImg);
          if (state.selectedAirlineKey === code) {
            updateSidebarLogoPreview();
            renderAll();
          }
        };
        img.src = targetUrl;
      }
    });
  }

  // Load airlines dynamically from API (with local caching and logo prefetching)
  async function loadAirlinesFromAPI() {
    const AIRLINES_API_URL = import.meta.env.VITE_AIRLINES_API_URL || 'https://app.airwaylink.org/api/airlines';
    let apiData = null;

    // Check cached data first to populate immediately if available
    try {
      const cached = localStorage.getItem('airwaylink_api_airlines');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          registerApiAirlines(parsed);
          syncCustomAirlinesToUI();
        }
      }
    } catch (e) {}

    // Fetch fresh airlines data from API
    try {
      const res = await fetch(AIRLINES_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      apiData = await res.json();
      if (Array.isArray(apiData) && apiData.length > 0) {
        try {
          localStorage.setItem('airwaylink_api_airlines', JSON.stringify(apiData));
        } catch (e) {}
        registerApiAirlines(apiData);
      }
    } catch (err) {
      console.warn("Could not fetch airlines from API:", err);
      const loadingOpt = getElement('optAirlineLoading');
      if (loadingOpt && Object.keys(airlineProfiles).filter(k => k !== 'CUSTOM').length === 0) {
        loadingOpt.textContent = "Unable to load airlines (Click to retry)";
        loadingOpt.disabled = false;
        loadingOpt.value = "RETRY";
      }
    }

    // Restore persistent logos (both custom uploaded overrides and cached API logos)
    try {
      const storedLogos = await loadAllStoredLogos();
      const overridePromises = Object.entries(storedLogos).map(([code, dataUrl]) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            if (code.includes('_light') || code.includes('_dark')) {
              loadedAirlineLogos[code] = img;
            } else {
              state.customLogoOverrides[code] = img;
            }
            resolve();
          };
          img.onerror = () => resolve();
          img.src = dataUrl;
        });
      });
      await Promise.all(overridePromises);
    } catch (e) {}

    syncCustomAirlinesToUI();
  }

  // Helper: Auto-trim transparent borders from an image so dimensions reflect actual artwork
  function trimTransparentImage(img) {
    if (!img) return img;
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) return img;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    try {
      ctx.drawImage(img, 0, 0);
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

      // If padding is negligible (<= 3px on all sides), keep original
      if (left <= 3 && top <= 3 && (width - 1 - right) <= 3 && (height - 1 - bottom) <= 3) {
        return img;
      }

      const trimW = right - left + 1;
      const trimH = bottom - top + 1;
      const trimmedCanvas = document.createElement('canvas');
      trimmedCanvas.width = trimW;
      trimmedCanvas.height = trimH;
      trimmedCanvas.getContext('2d').drawImage(tempCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);

      const trimmedImg = new Image();
      trimmedImg.crossOrigin = "anonymous";
      trimmedImg.src = trimmedCanvas.toDataURL('image/png');
      trimmedImg._trimmedCanvas = trimmedCanvas;
      return trimmedImg;
    } catch (e) {
      return img;
    }
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

  function updateViewportCursor() {
    if (!viewportContainer) return;
    const canPan = Boolean(state.selectedAirlineKey) && activeTabId === 'scenery';
    if (canPan) {
      viewportContainer.classList.remove('cursor-default');
      viewportContainer.classList.add('cursor-grab', 'active:cursor-grabbing');
    } else {
      viewportContainer.classList.remove('cursor-grab', 'active:cursor-grabbing');
      viewportContainer.classList.add('cursor-default');
    }
  }

  function updateTabAvailabilityUI() {
    const hasAirline = Boolean(state.selectedAirlineKey);

    [tabBtnScenery, tabBtnText].forEach(btn => {
      if (!btn) return;
      btn.disabled = !hasAirline;
      if (!hasAirline) {
        btn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        btn.title = "Select an airline profile first to unlock";
      } else {
        btn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        btn.removeAttribute('title');
      }
    });

    if (!hasAirline && activeTabId !== 'airline') {
      setActiveTab('airline');
    }
    updateViewportCursor();
  }

  function setActiveTab(tab) {
    if (tab !== 'airline' && !state.selectedAirlineKey) {
      return;
    }
    activeTabId = tab;
    const isDark = document.body.classList.contains('theme-dark');
    const inactiveClass = isDark 
      ? "flex-1 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition font-medium text-xs font-hud"
      : "flex-1 py-1 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition font-medium text-xs font-hud";

    const activeClass = isDark
      ? "flex-1 py-1 rounded-md text-white bg-[#242429] border border-white/10 font-bold transition text-xs font-hud shadow-sm"
      : "flex-1 py-1 rounded-md text-zinc-900 bg-zinc-100 border border-zinc-200 font-bold transition text-xs font-hud shadow-sm";

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

    if (tab !== 'scenery') {
      const overlay = getElement('canvasDropOverlay');
      if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
      }
      const banner = getElement('bannerContainer');
      if (banner) {
        banner.classList.remove('ring-2', 'ring-sky-400', 'shadow-[0_0_30px_rgba(56,189,248,0.35)]');
      }
    }

    updateTabAvailabilityUI();
    updateViewportCursor();
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
      bgBadge.textContent = '';
    }
    renderAll();
  }


  // Helper: Get active airline logo Image object (respecting selected light/dark variant)
  function getActiveAirlineLogo() {
    const key = state.selectedAirlineKey;
    if (!key) return null;
    if (state.customLogoOverrides[key]) {
      return state.customLogoOverrides[key];
    }
    const variant = state.logoVariant || 'dark';
    const variantKey = `${key}_${variant}`;
    if (loadedAirlineLogos[variantKey]) {
      return loadedAirlineLogos[variantKey];
    }
    const profile = airlineProfiles[key];
    if (!profile) return null;

    const targetUrl = variant === 'dark'
      ? (profile.logoDarkUrl || profile.logoLightUrl || profile.logoUrl)
      : (profile.logoLightUrl || profile.logoDarkUrl || profile.logoUrl);

    if (targetUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      loadedAirlineLogos[variantKey] = img;
      img.onload = () => {
        const trimmed = trimTransparentImage(img);
        const finalImg = (trimmed && (trimmed.naturalWidth || trimmed._trimmedCanvas)) ? trimmed : img;
        loadedAirlineLogos[variantKey] = finalImg;
        cacheLogoImage(variantKey, finalImg);
        if (state.selectedAirlineKey === key) {
          updateSidebarLogoPreview();
          renderAll();
        }
      };
      img.src = targetUrl;
      return img;
    }
    return null;
  }

  // Update sidebar logo preview cards
  function updateSidebarLogoPreview() {
    const imgLight = getElement('imgLogoVariantLight');
    const imgDark = getElement('imgLogoVariantDark');
    const noLightLabel = getElement('noLightLogoLabel');
    const noDarkLabel = getElement('noDarkLogoLabel');

    const key = state.selectedAirlineKey;
    const profile = airlineProfiles[key];

    if (!key || !profile) {
      if (imgLight) {
        imgLight.removeAttribute('src');
        imgLight.classList.add('hidden');
      }
      if (imgDark) {
        imgDark.removeAttribute('src');
        imgDark.classList.add('hidden');
      }
      if (noLightLabel) noLightLabel.classList.add('hidden');
      if (noDarkLabel) noDarkLabel.classList.add('hidden');
      return;
    }

    // Light variant thumbnail
    const cachedLight = loadedAirlineLogos[`${key}_light`];
    const lightUrl = (cachedLight && cachedLight.src) || profile.logoLightUrl || profile.logoUrl;
    if (lightUrl && imgLight) {
      if (imgLight.getAttribute('src') !== lightUrl) {
        imgLight.src = lightUrl;
      }
      imgLight.classList.remove('hidden');
      if (noLightLabel) noLightLabel.classList.add('hidden');
    } else {
      if (imgLight) {
        imgLight.removeAttribute('src');
        imgLight.classList.add('hidden');
      }
      if (noLightLabel) noLightLabel.classList.remove('hidden');
    }

    // Dark variant thumbnail
    const cachedDark = loadedAirlineLogos[`${key}_dark`];
    const darkUrl = (cachedDark && cachedDark.src) || profile.logoDarkUrl || profile.logoUrl;
    if (darkUrl && imgDark) {
      if (imgDark.getAttribute('src') !== darkUrl) {
        imgDark.src = darkUrl;
      }
      imgDark.classList.remove('hidden');
      if (noDarkLabel) noDarkLabel.classList.add('hidden');
    } else {
      if (imgDark) {
        imgDark.removeAttribute('src');
        imgDark.classList.add('hidden');
      }
      if (noDarkLabel) noDarkLabel.classList.remove('hidden');
    }

    setLogoVariant(state.logoVariant || 'dark', false);
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
      // Photo Grading: scale is -50 to +50 with 0 as default untouched image (100% CSS filter)
      // Brightness: + increases exposure/brightens, - darkens
      // Contrast: + lifts shadows/brightens, - deepens blacks/darkens
      const effectiveBright = 100 + (Number(state.bgBright) || 0);
      const effectiveContrast = 100 - (Number(state.bgContrast) || 0);
      targetCtx.filter = `brightness(${effectiveBright}%) contrast(${effectiveContrast}%) saturate(${state.bgSat}%)`;

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
      const subNoticeText = "CLICK THE [ ? ] AT THE TOP FOR A BRIEF TUTORIAL";
      const centerY = CANVAS_HEIGHT / 2;
      const titleY = centerY - 38;
      const subtitleY = centerY + 52;

      targetCtx.font = "700 80px 'Chakra Petch', 'JetBrains Mono', monospace";
      targetCtx.fillStyle = "#ffffff";
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = "6px";
        targetCtx.fillText(noticeText, CANVAS_WIDTH / 2, titleY);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(noticeText, CANVAS_WIDTH / 2, titleY);
      }

      targetCtx.font = "600 38px 'Chakra Petch', 'JetBrains Mono', monospace";
      targetCtx.fillStyle = "rgba(255, 255, 255, 0.75)";
      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = "4px";
        targetCtx.fillText(subNoticeText, CANVAS_WIDTH / 2, subtitleY);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(subNoticeText, CANVAS_WIDTH / 2, subtitleY);
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
    const useLogo = Boolean(activeLogo) && (activeLogo.complete || hasDimensions);

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

    // Base optical center line from Header Y (anchors pipe divider and suffix text)
    const headerCenterY = Math.round(curY);

    // Dedicated Logo center line (Logo Y Offset moves the logo independently without moving suffix text)
    const logoCenterY = Math.round(curY + state.logoOffsetY);

    if (renderAirlinePart) {
      if (useLogo && hasDimensions) {
        // A) Draw Official Airline Logo Image (full unclipped logo, preserved dimensions)
        const rawW = activeLogo.naturalWidth || activeLogo.width;
        const rawH = activeLogo.naturalHeight || activeLogo.height;
        const aspect = rawW / rawH;
        const drawH = state.hdrAirlineSize;
        const drawW = Math.round(drawH * aspect);
        const drawY = Math.round(logoCenterY - (drawH / 2));
        const logoDrawX = Math.round(curX + (state.logoOffsetX || 0));

        if (state.logoForceWhite) {
          const whiteLogoCanvas = createWhiteSilhouetteCanvas(activeLogo, drawW, drawH);
          targetCtx.drawImage(whiteLogoCanvas, logoDrawX, drawY, drawW, drawH);
        } else {
          targetCtx.drawImage(activeLogo, logoDrawX, drawY, drawW, drawH);
        }
        curX += drawW + BASE_DIVIDER_GAP;
        drewFirstItem = true;
      } else if (state.airlineName && state.airlineName.trim().length > 0) {
        // Fallback: Airline Name Text
        const profile = airlineProfiles[state.selectedAirlineKey] || Object.values(airlineProfiles).find(p => p.name !== "Custom Airline") || fallbackAirlineProfile;
        const airlineFontStr = profile.fontCss.replace('{size}', state.hdrAirlineSize);
        targetCtx.font = airlineFontStr;
        targetCtx.fillStyle = "#ffffff";
        targetCtx.textBaseline = "middle";
        const airlineDrawX = Math.round(curX + (state.logoOffsetX || 0));

        if (targetCtx.letterSpacing !== undefined && profile.letterSpacing) {
          targetCtx.letterSpacing = profile.letterSpacing;
          targetCtx.fillText(state.airlineName, airlineDrawX, logoCenterY);
          curX += targetCtx.measureText(state.airlineName).width + BASE_DIVIDER_GAP;
          targetCtx.letterSpacing = "0px";
        } else {
          targetCtx.fillText(state.airlineName, airlineDrawX, logoCenterY);
          curX += targetCtx.measureText(state.airlineName).width + BASE_DIVIDER_GAP;
        }
        drewFirstItem = true;
      }
    }

    // Apply Suffix X Offset to shift both the pipe divider "|" and suffix text together
    curX += (state.suffixOffsetX || 0);

    // B) Subtle Vertical Pipe Divider "|"
    if (drewFirstItem && renderSuffixPart && state.suffixName && state.suffixName.trim().length > 0) {
      const refSize = Math.max(state.hdrAirlineSize, state.hdrSuffixSize || UNIFORM_SUFFIX_SIZE);
      const dividerH = Math.round(refSize * 0.72);
      const dividerY = Math.round(headerCenterY - (dividerH / 2));
      targetCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
      targetCtx.fillRect(curX, dividerY, 3, dividerH);
      curX += 3 + BASE_DIVIDER_GAP;
    }

    // Dedicated Suffix center line (Suffix Y Offset moves the suffix independently)
    const suffixCenterY = Math.round(curY + (state.suffixOffsetY || 0));

    // C) "Focus Airport" Suffix (Anchored to Header Y + Suffix Y Offset, moved with Suffix X Offset)
    if (renderSuffixPart && state.suffixName && state.suffixName.trim().length > 0) {
      const suffixScale = state.hdrSuffixSize || UNIFORM_SUFFIX_SIZE;
      targetCtx.font = `500 ${suffixScale}px 'Inter', sans-serif`;
      targetCtx.fillStyle = "#ffffff";
      targetCtx.textBaseline = "middle";
      if (targetCtx.letterSpacing !== undefined) {
        targetCtx.letterSpacing = "2px";
        targetCtx.fillText(state.suffixName, curX, suffixCenterY);
        targetCtx.letterSpacing = "0px";
      } else {
        targetCtx.fillText(state.suffixName, curX, suffixCenterY);
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
    const footerExtra = 28; // Space for bottom center specs badge [ 5664 × 2500 px | Target: < 2.0 MB JPG ]
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
  }

  function updateWorkspaceFlowBreadcrumb() {
    const crumbActivity = getElement('crumbActivity');
    const crumbSepActivity = getElement('crumbSepActivity');
    const crumbAirline = getElement('crumbAirline');
    const crumbSepAirline = getElement('crumbSepAirline');
    const crumbAirport = getElement('crumbAirport');
    const crumbSepAirport = getElement('crumbSepAirport');

    const profile = airlineProfiles[state.selectedAirlineKey];
    const hasAirline = Boolean(profile && profile.name);

    const icaoInput = getElement('icaoInput');
    const cityInput = getElement('cityInput');
    const icaoVal = (icaoInput && icaoInput.value.trim().toUpperCase()) || (state.airport && state.airport.icao) || '';
    let cityVal = (cityInput && cityInput.value.trim()) || (state.airport && state.airport.city) || '';
    if (cityVal === '[INVALID AIRPORT]') {
      cityVal = '';
    }
    const hasAirport = Boolean(icaoVal || cityVal);

    // If neither airline nor airport has been selected, hide all trailing breadcrumbs
    if (!hasAirline && !hasAirport) {
      if (crumbActivity) crumbActivity.classList.add('hidden');
      if (crumbSepActivity) crumbSepActivity.classList.add('hidden');
      if (crumbAirline) crumbAirline.classList.add('hidden');
      if (crumbSepAirline) crumbSepAirline.classList.add('hidden');
      if (crumbAirport) crumbAirport.classList.add('hidden');
      if (crumbSepAirport) crumbSepAirport.classList.add('hidden');
      return;
    }

    // 1. Activity Type
    const suffixInput = getElement('hdrSuffixText');
    const activityText = (suffixInput && suffixInput.value.trim()) || state.suffixName || 'Focus Airport';
    if (crumbActivity) {
      crumbActivity.textContent = activityText;
      crumbActivity.classList.remove('hidden');
    }
    if (crumbSepActivity) crumbSepActivity.classList.remove('hidden');

    // 2. Airline
    if (hasAirline) {
      if (crumbAirline) {
        const airlineCode = profile.code || profile.icao || (state.selectedAirlineKey !== 'CUSTOM' ? state.selectedAirlineKey : '');
        const hasCodeAlready = airlineCode && (profile.name.includes(`(${airlineCode})`) || profile.name.endsWith(` ${airlineCode}`));
        const displayText = (airlineCode && !hasCodeAlready) ? `${profile.name} (${airlineCode})` : profile.name;
        crumbAirline.textContent = displayText;
        crumbAirline.title = displayText;
        crumbAirline.classList.remove('hidden');
      }
      if (crumbSepAirline) crumbSepAirline.classList.remove('hidden');
    } else {
      if (crumbAirline) crumbAirline.classList.add('hidden');
      if (crumbSepAirline) crumbSepAirline.classList.add('hidden');
    }

    // 3. ICAO - City
    if (hasAirport) {
      let airportText = '';
      if (icaoVal && cityVal) {
        airportText = `${icaoVal} - ${cityVal}`;
      } else if (icaoVal) {
        airportText = icaoVal;
      } else if (cityVal) {
        airportText = cityVal;
      }
      if (crumbAirport) {
        crumbAirport.textContent = airportText;
        crumbAirport.classList.remove('hidden');
      }
      if (crumbSepAirport) crumbSepAirport.classList.remove('hidden');
    } else {
      if (crumbAirport) crumbAirport.classList.add('hidden');
      if (crumbSepAirport) crumbSepAirport.classList.add('hidden');
    }
  }

  function renderAll() {
    updateSidebarLogoPreview();
    updatePreviewDimensions();
    updateWorkspaceFlowBreadcrumb();
  }

  // --- LOGO VARIANT SWITCHER (Light Logo vs Dark Logo) ---
  function setLogoVariant(variant, shouldRender = true) {
    state.logoVariant = variant;
    const cardLight = getElement('logoVariantCardLight');
    const cardDark = getElement('logoVariantCardDark');
    const badgeLight = getElement('badgeLightActive');
    const badgeDark = getElement('badgeDarkActive');
    const sizeLabel = getElement('hdrAirlineSizeLabel');

    if (variant === 'light') {
      if (cardLight) {
        cardLight.className = "h-16 rounded-lg border border-sky-500 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-100 ring-2 ring-sky-500 transition select-none group";
      }
      if (cardDark) {
        cardDark.className = "h-16 rounded-lg border border-slate-700/80 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-800 opacity-60 hover:opacity-100 transition select-none group";
      }
      if (badgeLight) badgeLight.classList.remove('hidden');
      if (badgeDark) badgeDark.classList.add('hidden');
    } else {
      if (cardDark) {
        cardDark.className = "h-16 rounded-lg border border-sky-500 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-800 ring-2 ring-sky-500 transition select-none group";
      }
      if (cardLight) {
        cardLight.className = "h-16 rounded-lg border border-slate-300 p-2.5 flex items-center justify-center relative overflow-hidden cursor-pointer shadow-inner bg-slate-100 opacity-70 hover:opacity-100 transition select-none group";
      }
      if (badgeDark) badgeDark.classList.remove('hidden');
      if (badgeLight) badgeLight.classList.add('hidden');
    }

    if (sizeLabel) sizeLabel.textContent = "Logo Scale:";

    if (shouldRender) {
      renderAll();
    }
  }

  function updateExportButtonState(isSaving = false) {
    const btnExport = getElement('btnTopExport');
    if (!btnExport) return;
    const hasAirline = Boolean(state.selectedAirlineKey);
    updateViewportCursor();

    if (isSaving) {
      btnExport.disabled = true;
      btnExport.classList.add('opacity-75', 'cursor-wait');
      btnExport.innerHTML = `
        <span id="exportBtnIcon">
          <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </span>
        <span id="exportBtnLabel">Saving...</span>
      `;
      return;
    }

    btnExport.disabled = !hasAirline;
    btnExport.classList.remove('opacity-75', 'cursor-wait');

    const iconSvg = hasAirline
      ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`
      : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`;

    btnExport.innerHTML = `
      <span id="exportBtnIcon">${iconSvg}</span>
      <span id="exportBtnLabel">Download Banner</span>
    `;
    btnExport.setAttribute('title', hasAirline ? 'Download custom banner' : 'Select an airline profile first');
  }

  // --- AIRLINE PRESET SWITCHER ---
  function setAirline(key) {
    // AUDIT NOTE: "CUSTOM" profile selection is temporarily disabled. Keep logic intact for audits and future re-enablement.
    if (key === 'CUSTOM') {
      return;
    }
    state.selectedAirlineKey = key;
    updateExportButtonState();
    updateTabAvailabilityUI();
    const dependentControls = getElement('airlineDependentControls');

    if (!key) {
      if (dependentControls) {
        dependentControls.classList.add('opacity-40', 'pointer-events-none');
      }
      getElement('airlineBadge').textContent = '';
      getElement('airlineBadge').className = 'text-[10px] text-slate-400 font-mono-avionics font-bold';
      if (typeof updateControlLocksUI === 'function') {
        updateControlLocksUI();
      }
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
    state.hdrAirlineSize = profile.defaultLogoHeight || UNIFORM_LOGO_SIZE;
    state.hdrSuffixSize = profile.defaultSuffixSize || UNIFORM_SUFFIX_SIZE;
    state.logoOffsetX = profile.defaultLogoOffsetX !== undefined ? profile.defaultLogoOffsetX : 0;
    state.logoOffsetY = profile.defaultLogoOffsetY !== undefined ? profile.defaultLogoOffsetY : 0;
    state.suffixOffsetX = profile.defaultSuffixOffsetX !== undefined ? profile.defaultSuffixOffsetX : 0;
    state.suffixOffsetY = profile.defaultSuffixOffsetY !== undefined ? profile.defaultSuffixOffsetY : 0;

    state.suffixName = profile.suffix || "Focus Airport";
    const hdrSuffixInput = getElement('hdrSuffixText');
    if (hdrSuffixInput) hdrSuffixInput.value = state.suffixName;
    getElement('topGradColor').value = profile.brandColor;
    getElement('topGradHex').value = profile.brandColor.toUpperCase();
    getElement('airlineBadge').textContent = profile.name.toUpperCase();
    const logoScaleInput = getElement('hdrAirlineSize');
    if (logoScaleInput) logoScaleInput.value = state.hdrAirlineSize;
    const logoScaleVal = getElement('hdrAirlineSizeVal');
    if (logoScaleVal) logoScaleVal.textContent = `${state.hdrAirlineSize}px`;

    const logoOffsetXInput = getElement('logoOffsetX');
    if (logoOffsetXInput) logoOffsetXInput.value = state.logoOffsetX;
    const logoOffsetXVal = getElement('logoOffsetXVal');
    if (logoOffsetXVal) logoOffsetXVal.textContent = `${state.logoOffsetX}px`;

    const logoOffsetYInput = getElement('logoOffsetY');
    if (logoOffsetYInput) logoOffsetYInput.value = state.logoOffsetY;
    const logoOffsetYVal = getElement('logoOffsetYVal');
    if (logoOffsetYVal) logoOffsetYVal.textContent = `${state.logoOffsetY}px`;

    const suffixScaleInput = getElement('hdrSuffixSize');
    if (suffixScaleInput) suffixScaleInput.value = state.hdrSuffixSize;
    const suffixScaleVal = getElement('hdrSuffixSizeVal');
    if (suffixScaleVal) suffixScaleVal.textContent = `${state.hdrSuffixSize}px`;

    const suffixOffsetXInput = getElement('suffixOffsetX');
    if (suffixOffsetXInput) suffixOffsetXInput.value = state.suffixOffsetX;
    const suffixOffsetXVal = getElement('suffixOffsetXVal');
    if (suffixOffsetXVal) suffixOffsetXVal.textContent = `${state.suffixOffsetX}px`;

    const suffixOffsetYInput = getElement('suffixOffsetY');
    if (suffixOffsetYInput) suffixOffsetYInput.value = state.suffixOffsetY;
    const suffixOffsetYVal = getElement('suffixOffsetYVal');
    if (suffixOffsetYVal) suffixOffsetYVal.textContent = `${state.suffixOffsetY}px`;
    state.hdrPosX = profile.defaultHeaderX !== undefined ? profile.defaultHeaderX : DEFAULT_HEADER_X;
    const hdrPosXInput = getElement('hdrPosX');
    if (hdrPosXInput) hdrPosXInput.value = state.hdrPosX;
    const hdrPosXVal = getElement('hdrPosXVal');
    if (hdrPosXVal) hdrPosXVal.textContent = `${state.hdrPosX}px`;

    if (typeof updateControlLocksUI === 'function') {
      updateControlLocksUI();
    }

    // Reset to dark logo variant by default when selecting an airline
    state.logoVariant = 'dark';
    setLogoVariant('dark', false);

    if (key === 'CUSTOM') {
      // Reveal Custom feature toggles panel
      const togglesPanel = getElement('customTogglesPanel');
      if (togglesPanel) togglesPanel.classList.remove('hidden');
      if (typeof updateCustomTogglesVisibility === 'function') {
        updateCustomTogglesVisibility();
      }
    } else {
      const togglesPanel = getElement('customTogglesPanel');
      const customBoxCard = getElement('customTextBoxCard');
      if (togglesPanel) togglesPanel.classList.add('hidden');
      if (customBoxCard) customBoxCard.classList.add('hidden');
      if (typeof updateCustomTogglesVisibility === 'function') {
        updateCustomTogglesVisibility();
      }
    }

    // Prioritize loading selected airline's logos immediately
    preloadAirline(key);

    // Immediately trigger render & update sidebar preview thumbnails
    renderAll();
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
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob produced an empty image."));
          } else {
            resolve(blob);
          }
        }, 'image/jpeg', quality);
      } catch (err) {
        reject(err);
      }
    });
  }

  // --- SINGLE EXPORT HANDLER ---
  async function handleSingleExport() {
    const btnExport = getElement("btnTopExport");
    if (!btnExport || !state.selectedAirlineKey) return;

    updateExportButtonState(true);

    try {
      // Redraw fresh high-res canvas
      drawFullCanvas(renderCtx);

      const result = await compressToStrictLimit(renderCanvas);
      if (!result || !result.blob) {
        throw new Error("Failed to generate image file from banner canvas.");
      }

      // Filename formula: (3 digit airline code_icao_suffixtext) e.g. FFT_KLAS_FocusAirport.jpg
      const airlineCode = (state.selectedAirlineKey || "AIR").replace(/[^a-zA-Z0-9]/g, "");
      const cleanIcao = (state.airport.icao || "BANNER").replace(/[^a-zA-Z0-9]/g, "");
      const rawSuffix = (state.suffixName || "Focus Airport").trim();
      // Remove spaces and special characters to make suffix text one word with no spaces
      const cleanSuffix = rawSuffix.replace(/[^a-zA-Z0-9]/g, "") || "FocusAirport";
      const fileName = `${airlineCode}_${cleanIcao}_${cleanSuffix}.jpg`;

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
      }, 45000);

    } catch (err) {
      console.error("Compression/download failed:", err);
      alert("Export failed: " + err.message);
    } finally {
      updateExportButtonState(false);
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

    // Only allow dragging the backdrop when in the backdrop tab
    if (activeTabId !== 'scenery') return;

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

      // Only allow dragging the backdrop when in the backdrop tab
      if (activeTabId !== 'scenery') return;

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
  const cardLogoLight = getElement('logoVariantCardLight');
  if (cardLogoLight) {
    cardLogoLight.addEventListener('click', () => setLogoVariant('light'), { signal: listeners.signal });
  }
  const cardLogoDark = getElement('logoVariantCardDark');
  if (cardLogoDark) {
    cardLogoDark.addEventListener('click', () => setLogoVariant('dark'), { signal: listeners.signal });
  }

  const hdrSuffixInput = getElement('hdrSuffixText');
  if (hdrSuffixInput) {
    hdrSuffixInput.addEventListener('input', (e) => {
      state.suffixName = e.target.value;
      renderAll();
    }, { signal: listeners.signal });
  }
  // Top Gradient Color, Opacity & Depth
  getElement('topGradColor').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.topBrandColor = e.target.value;
    getElement('topGradHex').value = e.target.value.toUpperCase();
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradHex').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    let val = e.target.value.trim();
    if (!val.startsWith('#') && val.length === 6) val = '#' + val;
    state.topBrandColor = val;
    getElement('topGradColor').value = val;
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradOpacity').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.topGradOpacity = parseInt(e.target.value, 10);
    getElement('topGradOpacityVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('topGradDepth').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.topGradDepth = parseInt(e.target.value, 10);
    getElement('topGradDepthVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Bottom Gradient Color, Opacity & Depth
  getElement('botGradColor').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.botBrandColor = e.target.value;
    getElement('botGradHex').value = e.target.value.toUpperCase();
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradHex').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    let val = e.target.value.trim();
    if (!val.startsWith('#') && val.length === 6) val = '#' + val;
    state.botBrandColor = val;
    getElement('botGradColor').value = val;
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradOpacity').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.botGradOpacity = parseInt(e.target.value, 10);
    getElement('botGradOpacityVal').textContent = `${e.target.value}%`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('botGradDepth').addEventListener('input', (e) => {
    if (state.lockGradients) return;
    state.botGradDepth = parseInt(e.target.value, 10);
    getElement('botGradDepthVal').textContent = `${e.target.value}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Reset Top Gradient (Opacity -> 90%, Depth -> 450px)
  getElement('btnResetTopGradDepth').addEventListener('click', () => {
    if (state.lockGradients) return;
    state.topGradOpacity = 90;
    state.topGradDepth = 450;
    getElement('topGradOpacity').value = 90;
    getElement('topGradOpacityVal').textContent = '90%';
    getElement('topGradDepth').value = 450;
    getElement('topGradDepthVal').textContent = '450px';
    renderAll();
  }, { signal: listeners.signal });

  // Reset Bottom Gradient (Opacity -> 90%, Depth -> 450px)
  getElement('btnResetBotGradDepth').addEventListener('click', () => {
    if (state.lockGradients) return;
    state.botGradOpacity = 90;
    state.botGradDepth = 450;
    getElement('botGradOpacity').value = 90;
    getElement('botGradOpacityVal').textContent = '90%';
    getElement('botGradDepth').value = 450;
    getElement('botGradDepthVal').textContent = '450px';
    renderAll();
  }, { signal: listeners.signal });
  // Logo Scale (formerly Logo Height)
  const hdrAirlineSizeInput = getElement('hdrAirlineSize');
  if (hdrAirlineSizeInput) {
    hdrAirlineSizeInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      state.hdrAirlineSize = parseInt(e.target.value, 10);
      const valEl = getElement('hdrAirlineSizeVal');
      if (valEl) valEl.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Logo X Offset
  const logoOffsetXInput = getElement('logoOffsetX');
  if (logoOffsetXInput) {
    logoOffsetXInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      state.logoOffsetX = parseInt(e.target.value, 10) || 0;
      const valEl = getElement('logoOffsetXVal');
      if (valEl) valEl.textContent = `${state.logoOffsetX}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Logo Y Offset
  const logoOffsetYInput = getElement('logoOffsetY');
  if (logoOffsetYInput) {
    logoOffsetYInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      state.logoOffsetY = parseInt(e.target.value, 10) || 0;
      const valEl = getElement('logoOffsetYVal');
      if (valEl) valEl.textContent = `${e.target.value}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Logo Reset Button (Resets Logo Scale, Logo X Offset, and Logo Y Offset to defaults)
  const btnResetLogo = getElement('btnResetLogoOffsets');
  if (btnResetLogo) {
    btnResetLogo.addEventListener('click', () => {
      if (state.lockSizesOffsets) return;
      const profile = airlineProfiles[state.selectedAirlineKey] || Object.values(airlineProfiles).find(p => p.name !== "Custom Airline") || fallbackAirlineProfile;
      state.hdrAirlineSize = profile.defaultLogoHeight || UNIFORM_LOGO_SIZE;
      state.logoOffsetX = profile.defaultLogoOffsetX !== undefined ? profile.defaultLogoOffsetX : 0;
      state.logoOffsetY = profile.defaultLogoOffsetY !== undefined ? profile.defaultLogoOffsetY : 0;

      const sizeInput = getElement('hdrAirlineSize');
      if (sizeInput) sizeInput.value = state.hdrAirlineSize;
      const sizeVal = getElement('hdrAirlineSizeVal');
      if (sizeVal) sizeVal.textContent = `${state.hdrAirlineSize}px`;

      const xInput = getElement('logoOffsetX');
      if (xInput) xInput.value = state.logoOffsetX;
      const xVal = getElement('logoOffsetXVal');
      if (xVal) xVal.textContent = `${state.logoOffsetX}px`;

      const yInput = getElement('logoOffsetY');
      if (yInput) yInput.value = state.logoOffsetY;
      const yVal = getElement('logoOffsetYVal');
      if (yVal) yVal.textContent = `${state.logoOffsetY}px`;

      renderAll();
    }, { signal: listeners.signal });
  }

  // Suffix Scale Slider
  const hdrSuffixSizeInput = getElement('hdrSuffixSize');
  if (hdrSuffixSizeInput) {
    hdrSuffixSizeInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      state.hdrSuffixSize = parseInt(e.target.value, 10) || UNIFORM_SUFFIX_SIZE;
      const valEl = getElement('hdrSuffixSizeVal');
      if (valEl) valEl.textContent = `${state.hdrSuffixSize}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Suffix X Offset Slider
  const suffixOffsetXInput = getElement('suffixOffsetX');
  if (suffixOffsetXInput) {
    suffixOffsetXInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      const val = parseInt(e.target.value, 10) || 0;
      state.suffixOffsetX = val;
      const valEl = getElement('suffixOffsetXVal');
      if (valEl) valEl.textContent = `${val}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Suffix Y Offset Slider
  const suffixOffsetYInput = getElement('suffixOffsetY');
  if (suffixOffsetYInput) {
    suffixOffsetYInput.addEventListener('input', (e) => {
      if (state.lockSizesOffsets) return;
      const val = parseInt(e.target.value, 10) || 0;
      state.suffixOffsetY = val;
      const valEl = getElement('suffixOffsetYVal');
      if (valEl) valEl.textContent = `${val}px`;
      renderAll();
    }, { signal: listeners.signal });
  }

  // Suffix Reset Button (Resets Suffix Scale, Suffix X Offset, and Suffix Y Offset to defaults)
  const btnResetSuffix = getElement('btnResetSuffixOffsets');
  if (btnResetSuffix) {
    btnResetSuffix.addEventListener('click', () => {
      if (state.lockSizesOffsets) return;
      const profile = airlineProfiles[state.selectedAirlineKey] || Object.values(airlineProfiles).find(p => p.name !== "Custom Airline") || fallbackAirlineProfile;
      state.hdrSuffixSize = profile.defaultSuffixSize || UNIFORM_SUFFIX_SIZE;
      state.suffixOffsetX = profile.defaultSuffixOffsetX !== undefined ? profile.defaultSuffixOffsetX : 0;
      state.suffixOffsetY = profile.defaultSuffixOffsetY !== undefined ? profile.defaultSuffixOffsetY : 0;

      const sizeInput = getElement('hdrSuffixSize');
      if (sizeInput) sizeInput.value = state.hdrSuffixSize;
      const sizeVal = getElement('hdrSuffixSizeVal');
      if (sizeVal) sizeVal.textContent = `${state.hdrSuffixSize}px`;

      const xInput = getElement('suffixOffsetX');
      if (xInput) xInput.value = state.suffixOffsetX;
      const xVal = getElement('suffixOffsetXVal');
      if (xVal) xVal.textContent = `${state.suffixOffsetX}px`;

      const yInput = getElement('suffixOffsetY');
      if (yInput) yInput.value = state.suffixOffsetY;
      const yVal = getElement('suffixOffsetYVal');
      if (yVal) yVal.textContent = `${state.suffixOffsetY}px`;

      renderAll();
    }, { signal: listeners.signal });
  }

  // Reset Header X
  getElement('btnResetHdrX').addEventListener('click', () => {
    if (state.lockHeaderPos) return;
    const profile = airlineProfiles[state.selectedAirlineKey] || Object.values(airlineProfiles).find(p => p.name !== "Custom Airline") || fallbackAirlineProfile;
    state.hdrPosX = profile && profile.defaultHeaderX !== undefined ? profile.defaultHeaderX : DEFAULT_HEADER_X;
    getElement('hdrPosX').value = state.hdrPosX;
    getElement('hdrPosXVal').textContent = `${state.hdrPosX}px`;
    renderAll();
  }, { signal: listeners.signal });

  // Reset Header Y
  getElement('btnResetHdrY').addEventListener('click', () => {
    if (state.lockHeaderPos) return;
    state.hdrPosY = 175;
    getElement('hdrPosY').value = 175;
    getElement('hdrPosYVal').textContent = '175px';
    renderAll();
  }, { signal: listeners.signal });

  // ==========================================
  // SECTION LOCK CONTROLS: Gradient Options, Header Position, and Sizes & Offsets
  // ==========================================
  // Helper to cleanly lock/unlock form controls and buttons
  function setElementLocked(el, isLocked) {
    if (!el) return;
    el.disabled = isLocked;
    if (isLocked) {
      el.setAttribute('disabled', '');
      el.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
    } else {
      el.removeAttribute('disabled');
      el.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
    }
  }

  function updateGradientLockUI() {
    const hasAirline = Boolean(state.selectedAirlineKey);
    const isLocked = Boolean(state.lockGradients);
    const btn = getElement('btnLockGradients');
    const icon = getElement('lockIconGradients');
    if (icon) icon.textContent = isLocked ? "🔒" : "🔓";
    if (btn) {
      btn.title = !hasAirline
        ? "Select an airline profile first to unlock"
        : (isLocked ? "Gradient controls are locked. Click to toggle unlock." : "Gradient controls are unlocked. Click to toggle lock.");
      const baseClass = isLocked 
        ? "p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm leading-none" 
        : "p-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition shadow-sm leading-none";
      btn.className = !hasAirline 
        ? `${baseClass} cursor-not-allowed opacity-60 pointer-events-none` 
        : `${baseClass} hover:opacity-90 cursor-pointer pointer-events-auto`;
    }

    [
      'topGradColor',
      'topGradHex',
      'topGradOpacity',
      'topGradDepth',
      'btnResetTopGradDepth',
      'botGradColor',
      'botGradHex',
      'botGradOpacity',
      'botGradDepth',
      'btnResetBotGradDepth'
    ].forEach(id => setElementLocked(getElement(id), isLocked || !hasAirline));
  }

  function updateHeaderPosLockUI() {
    const hasAirline = Boolean(state.selectedAirlineKey);
    const isLocked = Boolean(state.lockHeaderPos);
    const btn = getElement('btnLockHeaderPos');
    const icon = getElement('lockIconHeaderPos');
    if (icon) icon.textContent = isLocked ? "🔒" : "🔓";
    if (btn) {
      btn.title = !hasAirline
        ? "Select an airline profile first to unlock"
        : (isLocked ? "Header position controls are locked. Click to toggle unlock." : "Header position controls are unlocked. Click to toggle lock.");
      const baseClass = isLocked 
        ? "p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm leading-none" 
        : "p-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition shadow-sm leading-none";
      btn.className = !hasAirline 
        ? `${baseClass} cursor-not-allowed opacity-60 pointer-events-none` 
        : `${baseClass} hover:opacity-90 cursor-pointer pointer-events-auto`;
    }

    [
      'hdrPosX',
      'hdrPosY',
      'btnResetHdrX',
      'btnResetHdrY'
    ].forEach(id => setElementLocked(getElement(id), isLocked || !hasAirline));
  }

  function updateSizesOffsetsLockUI() {
    const hasAirline = Boolean(state.selectedAirlineKey);
    const isLocked = Boolean(state.lockSizesOffsets);
    const btn = getElement('btnLockSizesOffsets');
    const icon = getElement('lockIconSizesOffsets');
    if (icon) icon.textContent = isLocked ? "🔒" : "🔓";
    if (btn) {
      btn.title = !hasAirline
        ? "Select an airline profile first to unlock"
        : (isLocked ? "Sizes & offsets controls are locked. Click to toggle unlock." : "Sizes & offsets controls are unlocked. Click to toggle lock.");
      const baseClass = isLocked 
        ? "p-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition shadow-sm leading-none" 
        : "p-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition shadow-sm leading-none";
      btn.className = !hasAirline 
        ? `${baseClass} cursor-not-allowed opacity-60 pointer-events-none` 
        : `${baseClass} hover:opacity-90 cursor-pointer pointer-events-auto`;
    }

    [
      'hdrAirlineSize',
      'logoOffsetX',
      'logoOffsetY',
      'btnResetLogoOffsets',
      'hdrSuffixSize',
      'suffixOffsetX',
      'suffixOffsetY',
      'btnResetSuffixOffsets'
    ].forEach(id => {
      const el = getElement(id);
      if (el) setElementLocked(el, isLocked || !hasAirline);
    });
  }

  function updateControlLocksUI() {
    updateGradientLockUI();
    updateHeaderPosLockUI();
    updateSizesOffsetsLockUI();
  }

  const btnLockGradients = getElement('btnLockGradients');
  if (btnLockGradients) {
    btnLockGradients.addEventListener('click', () => {
      if (!state.selectedAirlineKey) return;
      state.lockGradients = !state.lockGradients;
      updateGradientLockUI();
    }, { signal: listeners.signal });
  }

  const btnLockHeaderPos = getElement('btnLockHeaderPos');
  if (btnLockHeaderPos) {
    btnLockHeaderPos.addEventListener('click', () => {
      if (!state.selectedAirlineKey) return;
      state.lockHeaderPos = !state.lockHeaderPos;
      updateHeaderPosLockUI();
    }, { signal: listeners.signal });
  }

  const btnLockSizesOffsets = getElement('btnLockSizesOffsets');
  if (btnLockSizesOffsets) {
    btnLockSizesOffsets.addEventListener('click', () => {
      if (!state.selectedAirlineKey) return;
      state.lockSizesOffsets = !state.lockSizesOffsets;
      updateSizesOffsetsLockUI();
    }, { signal: listeners.signal });
  }

  // Initial call to sync locks on attach
  updateControlLocksUI();

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
  updateHdrButtonsUI();

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
    if (state.lockHeaderPos) return;
    state.hdrPosX = parseInt(e.target.value, 10) || 0;
    getElement('hdrPosXVal').textContent = `${state.hdrPosX}px`;
    renderAll();
  }, { signal: listeners.signal });
  getElement('hdrPosY').addEventListener('input', (e) => {
    if (state.lockHeaderPos) return;
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
    const airlineSizeCol = getElement('hdrAirlineSizeCol');
    const logoOffsetYCol = getElement('logoOffsetYCol');
    const suffixSec = getElement('suffixTextInputSection');
    const suffixSizeCol = getElement('hdrSuffixSizeCol');
    const dividerGapCol = getElement('hdrDividerGapCol');
    const suffixOffsetYCol = getElement('suffixOffsetYCol');
    const sizesOffsetsSec = getElement('sizesOffsetsSection');
    const headerPosSec = getElement('headerPositionSection');
    const effectsSec = getElement('headerEffectsSection');

    if (isCustom) {
      // Sub-toggles container visibility
      if (headerBrandSubToggles) {
        headerBrandSubToggles.style.display = state.showHeaderBrand ? '' : 'none';
      }

      if (!state.showHeaderBrand) {
        if (brandModeSec) brandModeSec.style.display = 'none';
        if (sizesOffsetsSec) sizesOffsetsSec.style.display = 'none';
        if (headerPosSec) headerPosSec.style.display = 'none';
        if (effectsSec) effectsSec.style.display = 'none';
      } else {
        // Header Brand is ON: show options according to individual sub-toggles
        const hasAnyHeaderItem = state.showAirlineName || state.showSuffixText;
        if (brandModeSec) brandModeSec.style.display = hasAnyHeaderItem ? '' : 'none';
        if (sizesOffsetsSec) sizesOffsetsSec.style.display = hasAnyHeaderItem ? '' : 'none';
        if (headerPosSec) headerPosSec.style.display = hasAnyHeaderItem ? '' : 'none';
        if (effectsSec) effectsSec.style.display = hasAnyHeaderItem ? '' : 'none';

        if (airlineSizeCol) airlineSizeCol.style.display = state.showAirlineName ? '' : 'none';
        if (logoOffsetYCol) logoOffsetYCol.style.display = state.showAirlineName ? '' : 'none';

        if (suffixSec) suffixSec.style.display = state.showSuffixText ? '' : 'none';
        if (suffixSizeCol) suffixSizeCol.style.display = state.showSuffixText ? '' : 'none';
        if (suffixOffsetYCol) suffixOffsetYCol.style.display = state.showSuffixText ? '' : 'none';

        if (dividerGapCol) {
          dividerGapCol.style.display = (state.showAirlineName && state.showSuffixText) ? '' : 'none';
        }
      }
    } else {
      if (headerBrandSubToggles) headerBrandSubToggles.style.display = '';
      if (brandModeSec) brandModeSec.style.display = '';
      if (airlineSizeCol) airlineSizeCol.style.display = '';
      if (logoOffsetYCol) logoOffsetYCol.style.display = '';
      if (suffixSec) suffixSec.style.display = '';
      if (suffixSizeCol) suffixSizeCol.style.display = '';
      if (suffixOffsetYCol) suffixOffsetYCol.style.display = '';
      if (dividerGapCol) dividerGapCol.style.display = '';
      if (sizesOffsetsSec) sizesOffsetsSec.style.display = '';
      if (headerPosSec) headerPosSec.style.display = '';
      if (effectsSec) effectsSec.style.display = '';
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

  // 2. Background Photo Upload & Drag-and-Drop (DropZone + Canvas Preview)
  const dropZone = getElement('dropZone');
  const filePicker = getElement('filePicker');
  const canvasDropOverlay = getElement('canvasDropOverlay');
  let canvasDragCounter = 0;

  function isCanvasDropAllowed() {
    return Boolean(state.selectedAirlineKey) && activeTabId === 'scenery';
  }

  function isImageDragEvent(e) {
    if (!e.dataTransfer) return false;
    const types = Array.from(e.dataTransfer.types || []);
    return types.includes('Files') || types.includes('text/uri-list') || types.includes('text/html') || types.includes('text/plain');
  }

  function showCanvasDropOverlay() {
    if (canvasDropOverlay) {
      canvasDropOverlay.classList.remove('opacity-0');
      canvasDropOverlay.classList.add('opacity-100');
    }
    if (bannerContainer) {
      bannerContainer.classList.add('ring-2', 'ring-sky-400', 'shadow-[0_0_30px_rgba(56,189,248,0.35)]');
    }
  }

  function hideCanvasDropOverlay() {
    if (canvasDropOverlay) {
      canvasDropOverlay.classList.remove('opacity-100');
      canvasDropOverlay.classList.add('opacity-0');
    }
    if (bannerContainer) {
      bannerContainer.classList.remove('ring-2', 'ring-sky-400', 'shadow-[0_0_30px_rgba(56,189,248,0.35)]');
    }
  }

  function handleImageDrop(e) {
    if (!e.dataTransfer) return;

    // 1. Files dropped directly from disk
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = Array.from(e.dataTransfer.files).find(f =>
        f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(f.name)
      );
      if (file) {
        loadLocalImageFile(file);
        return;
      }
    }

    // 2. Dragged image from another webpage or browser window
    const uriList = e.dataTransfer.getData('text/uri-list');
    const html = e.dataTransfer.getData('text/html');
    const text = e.dataTransfer.getData('text/plain');

    let imageUrl = null;

    if (uriList) {
      const firstUri = uriList.split(/[\r\n]+/)[0].trim();
      if (/^https?:\/\//i.test(firstUri) || firstUri.startsWith('data:image/')) {
        imageUrl = firstUri;
      }
    }

    if (!imageUrl && html) {
      const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        imageUrl = match[1];
      }
    }

    if (!imageUrl && text) {
      const trimmed = text.trim();
      if (/^https?:\/\/.*\.(jpe?g|png|webp|avif|gif|bmp)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:image/')) {
        imageUrl = trimmed;
      }
    }

    if (imageUrl) {
      loadSceneryFromUrl(imageUrl);
    }
  }

  // Viewport Container & Banner Canvas Drag-and-Drop
  // Only active when an airline profile is selected AND currently in the BACKDROP tab
  if (viewportContainer) {
    viewportContainer.addEventListener('dragenter', (e) => {
      if (!isCanvasDropAllowed() || !isImageDragEvent(e)) return;
      e.preventDefault();
      canvasDragCounter++;
      showCanvasDropOverlay();
    }, { signal: listeners.signal });

    viewportContainer.addEventListener('dragover', (e) => {
      if (!isCanvasDropAllowed() || !isImageDragEvent(e)) return;
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    }, { signal: listeners.signal });

    viewportContainer.addEventListener('dragleave', (e) => {
      if (!isCanvasDropAllowed()) {
        canvasDragCounter = 0;
        hideCanvasDropOverlay();
        return;
      }
      e.preventDefault();
      canvasDragCounter--;
      if (canvasDragCounter <= 0) {
        canvasDragCounter = 0;
        hideCanvasDropOverlay();
      }
    }, { signal: listeners.signal });

    viewportContainer.addEventListener('drop', (e) => {
      if (!isCanvasDropAllowed()) {
        canvasDragCounter = 0;
        hideCanvasDropOverlay();
        return;
      }
      e.preventDefault();
      canvasDragCounter = 0;
      hideCanvasDropOverlay();
      handleImageDrop(e);
    }, { signal: listeners.signal });
  }

  // Prevent browser window from opening image file if dropped outside canvas targets
  window.addEventListener('dragover', (e) => {
    if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
      e.preventDefault();
    }
  }, { signal: listeners.signal });

  window.addEventListener('drop', (e) => {
    if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {
      e.preventDefault();
    }
    canvasDragCounter = 0;
    hideCanvasDropOverlay();
  }, { signal: listeners.signal });

  window.addEventListener('dragend', () => {
    canvasDragCounter = 0;
    hideCanvasDropOverlay();
  }, { signal: listeners.signal });

  // Sidebar Drop Zone Drag-and-Drop
  if (dropZone) {
    dropZone.addEventListener('click', () => filePicker && filePicker.click(), { signal: listeners.signal });
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-zinc-400');
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    }, { signal: listeners.signal });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-zinc-400');
    }, { signal: listeners.signal });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-zinc-400');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadLocalImageFile(e.dataTransfer.files[0]);
      } else {
        handleImageDrop(e);
      }
    }, { signal: listeners.signal });
  }

  if (filePicker) {
    filePicker.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadLocalImageFile(e.target.files[0]);
        e.target.value = '';
      }
    }, { signal: listeners.signal });
  }

  function loadLocalImageFile(file) {
    if (!file) return;
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(file.name);
    if (!isImage) {
      alert("Please drop a valid image file (JPG, PNG, WebP, AVIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        state.bgImage = img;
        state.isForceScaled = false;
        const bgStatusBadge = getElement('bgStatusBadge');
        if (bgStatusBadge) {
          bgStatusBadge.textContent = 'Custom Photo Loaded';
          bgStatusBadge.className = 'text-[10px] text-emerald-500 font-mono-avionics font-bold';
        }
        if (state.selectedAirlineKey) {
          setActiveTab('scenery');
        }
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
    const bgStatusBadge = getElement('bgStatusBadge');
    if (bgStatusBadge) {
      bgStatusBadge.textContent = badgeText;
      bgStatusBadge.className = 'text-[10px] text-emerald-500 font-mono-avionics font-bold';
    }
    urlImportStatus.textContent = "Loaded ✓";
    urlImportStatus.className = "text-[9px] text-emerald-400";
    if (state.selectedAirlineKey) {
      setActiveTab('scenery');
    }
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



  // Reset Function: Resets Pan/Zoom, unlocks axes, and centers backdrop back to default values without removing the image
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
    renderAll();
  }

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

  const formatGradingVal = (val) => {
    const num = Number(val) || 0;
    if (num > 0) return `+${num}`;
    return `${num}`;
  };

  // 4. Photo Grading
  getElement('bgBright').addEventListener('input', (e) => {
    state.bgBright = parseInt(e.target.value, 10) || 0;
    getElement('brightVal').textContent = formatGradingVal(state.bgBright);
    renderAll();
  }, { signal: listeners.signal });
  getElement('bgContrast').addEventListener('input', (e) => {
    state.bgContrast = parseInt(e.target.value, 10) || 0;
    getElement('contrastVal').textContent = formatGradingVal(state.bgContrast);
    renderAll();
  }, { signal: listeners.signal });

  // Individual & Full Reset Buttons for Photo Grading
  getElement('btnResetBright').addEventListener('click', () => {
    state.bgBright = 0;
    getElement('bgBright').value = 0;
    getElement('brightVal').textContent = '0';
    renderAll();
  }, { signal: listeners.signal });

  getElement('btnResetContrast').addEventListener('click', () => {
    state.bgContrast = 0;
    getElement('bgContrast').value = 0;
    getElement('contrastVal').textContent = '0';
    renderAll();
  }, { signal: listeners.signal });

  function resetAllGrading() {
    state.bgBright = 0;
    state.bgContrast = 0;

    getElement('bgBright').value = 0;
    getElement('bgContrast').value = 0;

    getElement('brightVal').textContent = '0';
    getElement('contrastVal').textContent = '0';

    renderAll();
  }

  getElement('btnResetGradingAll').addEventListener('click', resetAllGrading, { signal: listeners.signal });

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

    const toggleBtn = getElement('btnToggleLegibilityEffect');
    const toggleLabel = getElement('legibilityToggleLabel');
    if (toggleBtn) {
      const toggleActiveClass = isDark
        ? "py-1 px-2 rounded-md bg-white/20 text-white border border-white/40 text-center font-bold transition shadow-sm"
        : "py-1 px-2 rounded-md bg-black/10 text-black border border-black/30 text-center font-bold transition shadow-sm";
      toggleBtn.className = isEffectOn ? toggleActiveClass : "py-1 px-2 tool-btn text-center font-medium transition text-slate-400";
    }
    if (toggleLabel) {
      toggleLabel.textContent = isEffectOn ? "Effect Enabled" : "Effect Disabled";
    }

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

  // Initial call to sync legibility controls on attach
  updateLegibilityButtonsUI();

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
    if (typeof setLogoVariant === 'function') {
      setLogoVariant(state.logoVariant || 'dark', false);
    }
    if (typeof updateControlLocksUI === 'function') {
      updateControlLocksUI();
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
        code: rec.code,
        suffix: rec.suffix || "Focus Airport",
        brandColor: rec.brandColor || "#002b49",
        defaultLogoHeight: rec.defaultLogoHeight || UNIFORM_HEADER_SIZE,
        defaultLogoOffsetX: rec.defaultLogoOffsetX || 0,
        defaultLogoOffsetY: rec.defaultLogoOffsetY || 0,
        defaultSuffixOffsetX: rec.defaultSuffixOffsetX || 0,
        defaultSuffixSize: rec.defaultSuffixSize || rec.defaultLogoHeight || UNIFORM_HEADER_SIZE,
        defaultHeaderX: rec.defaultHeaderX || DEFAULT_HEADER_X,
        fontCss: "italic 800 {size}px 'Barlow', sans-serif",
        letterSpacing: "2px",
        isCustomUserAirline: true
      };
    });

    // Preserve currently selected key
    const currentSelected = state.selectedAirlineKey;

    // 2. Gather all airline entries to populate in the dropdown.
    // Profiles loaded from API + custom user added profiles from storage.
    // "CUSTOM" (generic custom blank slate) is kept at the very end of the list.
    const allEntries = [];

    Object.keys(airlineProfiles).forEach(k => {
      if (k !== 'CUSTOM' && !records.some(r => r.code === k)) {
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

    if (allEntries.length === 0) {
      const loadingOpt = document.createElement('option');
      loadingOpt.id = 'optAirlineLoading';
      loadingOpt.value = "";
      loadingOpt.textContent = "Loading airlines from API...";
      loadingOpt.disabled = true;
      dropdown.appendChild(loadingOpt);
    }

    // Append all airlines in a single unified alphabetical list with code in parentheses: Name (CODE)
    allEntries.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = `${item.name} (${item.key})`;
      dropdown.appendChild(opt);
    });

    // AUDIT NOTE: The "Custom" airline profile ("CUSTOM") is intentionally kept in the codebase
    // but is temporarily disabled and removed from the active dropdown list.
    // Retain this feature and its supporting logic during code audits for future re-enablement.
    // (Name retained: "Custom", state: disabled/hidden).

    // Restore dropdown selection if valid
    if (currentSelected && currentSelected !== 'CUSTOM' && (airlineProfiles[currentSelected])) {
      dropdown.value = currentSelected;
    }
  }


  // --- REFRESH AIRLINES API DATA HANDLER ---
  let apiErrorNoticeTimeout = null;

  async function refreshApiAirlinesData() {
    const btn = getElement('btnRefreshApiData');
    const icon = getElement('refreshApiIcon');
    const label = getElement('refreshApiLabel');
    const errorNotice = getElement('apiErrorNotice');
    const errorMsg = getElement('apiErrorMessage');

    if (errorNotice) errorNotice.classList.add('hidden');
    if (btn) {
      btn.classList.remove('flash-success-3', 'flash-error-3');
      btn.disabled = true;
    }
    if (icon) icon.classList.add('animate-spin');
    if (label) label.textContent = 'Refreshing...';

    try {
      const AIRLINES_API_URL = import.meta.env.VITE_AIRLINES_API_URL || 'https://app.airwaylink.org/api/airlines';
      const res = await fetch(`${AIRLINES_API_URL}?t=${Date.now()}`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const apiData = await res.json();

      if (Array.isArray(apiData) && apiData.length > 0) {
        try {
          localStorage.setItem('airwaylink_api_airlines', JSON.stringify(apiData));
        } catch (e) {}

        registerApiAirlines(apiData);
        syncCustomAirlinesToUI();

        if (state.selectedAirlineKey) {
          preloadAirline(state.selectedAirlineKey);
          updateSidebarLogoPreview();
          renderAll();
        }

        // Good connection: Flash button green 3 times
        if (btn) {
          btn.classList.remove('flash-success-3', 'flash-error-3');
          void btn.offsetWidth; // Force CSS reflow to re-trigger keyframe animation
          btn.classList.add('flash-success-3');
          setTimeout(() => {
            if (btn) btn.classList.remove('flash-success-3');
          }, 1300);
        }

        if (label) {
          label.textContent = 'Updated!';
          setTimeout(() => {
            if (label) label.textContent = 'Refresh';
          }, 1800);
        }
      } else {
        throw new Error('API returned empty or invalid airline list');
      }
    } catch (err) {
      console.warn("Could not refresh airlines from API:", err);

      // No connection / error: Flash button red 3 times and display pop-up notice
      if (btn) {
        btn.classList.remove('flash-success-3', 'flash-error-3');
        void btn.offsetWidth; // Force CSS reflow to re-trigger keyframe animation
        btn.classList.add('flash-error-3');
        setTimeout(() => {
          if (btn) btn.classList.remove('flash-error-3');
        }, 1300);
      }

      if (errorNotice) {
        if (errorMsg) {
          errorMsg.textContent = !navigator.onLine
            ? 'No internet connection detected. Please verify your network and try again.'
            : `Unable to reach Airlines API server (${err.message || 'Connection failed'}). Please try again shortly.`;
        }
        errorNotice.classList.remove('hidden');

        clearTimeout(apiErrorNoticeTimeout);
        apiErrorNoticeTimeout = setTimeout(() => {
          if (errorNotice) errorNotice.classList.add('hidden');
        }, 6000);
      }

      if (label) {
        label.textContent = 'Failed';
        setTimeout(() => {
          if (label) label.textContent = 'Refresh';
        }, 1800);
      }
    } finally {
      if (icon) icon.classList.remove('animate-spin');
      if (btn) btn.disabled = false;
    }
  }

  const btnRefreshApiData = getElement('btnRefreshApiData');
  if (btnRefreshApiData) {
    btnRefreshApiData.addEventListener('click', () => {
      refreshApiAirlinesData();
    }, { signal: listeners.signal });
  }

  const btnCloseApiError = getElement('btnCloseApiError');
  if (btnCloseApiError) {
    btnCloseApiError.addEventListener('click', () => {
      const errorNotice = getElement('apiErrorNotice');
      if (errorNotice) errorNotice.classList.add('hidden');
    }, { signal: listeners.signal });
  }

  document.addEventListener('click', (e) => {
    const errorNotice = getElement('apiErrorNotice');
    const container = getElement('refreshApiContainer');
    if (errorNotice && !errorNotice.classList.contains('hidden')) {
      if (container && !container.contains(e.target)) {
        errorNotice.classList.add('hidden');
      }
    }
  }, { signal: listeners.signal });

  applyTheme(localStorage.getItem('airwaylink_theme') || 'dark');
  updateControlLocksUI();
  updateExportButtonState();
  updateTabAvailabilityUI();
  cycleTagline();
  syncCustomAirlinesToUI();
  renderStandbyCanvas();
  renderAll();

  loadAirlinesFromAPI().then(() => {
    if (!listeners.signal.aborted) {
      syncCustomAirlinesToUI();
      renderAll();
    }
  });

  return () => listeners.abort();
}
