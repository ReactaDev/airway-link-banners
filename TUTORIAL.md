# AirwayLink Banner Studio — Official User Tutorial & Guide

Welcome to the **AirwayLink Banner Studio**. This guide walks you through the banner creation pipeline, explaining every feature, tool, parameter lock, and the built-in instant airport database.

---

## Quick Overview & Specifications

AirwayLink Banner Studio generates ultra-high-resolution, print-ready community and event banners.

- **Output Resolution:** `5664 × 2500 px` (High-definition JPEG export, 16:7 aspect ratio).
- **Primary Use Cases:** Virtual airline websites, community headers, Discord server banners, VATSIM/IVAO forum signatures, and flight dispatch displays.
- **Access Requirement:** Requires an authenticated Auth0 session with the `use.banner_editor` permission.
- **Theme Support:** Fully responsive dark and light modes with persistent theme toggling.

---

## Accessing the In-App Interactive Tutorial

In addition to this written documentation, the studio features a built-in **interactive walkthrough**:

- **Location:** Click the bold **`?`** icon in the top header bar (positioned directly between the **Light/Dark theme toggle** and the **Pilot Account** button).
- **Navigation:** Features a 5-step equal-tab layout with zero scrolling:
  1. `AirwayLink Banner Studio` — Pipeline overview and tab sequence.
  2. `Parameter Locks` — Live interactive demonstration of the `🔒` and `🔓` system.
  3. `Backdrop` — Scenery upload, framing, and axis locks.
  4. `Airport Database` — Live interactive ICAO lookup connected directly to the global database.
  5. `Export Banner` — Final 5664 × 2500 export specifications.
- **Centering & Controls:** Centered in the middle of the screen with smooth animations, dismissible by clicking the backdrop or pressing `Escape`. Use `ArrowRight` and `ArrowLeft` keys to step through slides.

---

## Understanding the Parameter Locks (🔒 vs. 🔓)

One of the most important concepts in the Banner Studio is the **Parameter Lock System**.

### Why are parameters locked by default?
When an airline profile is selected, the studio automatically applies **mathematically calibrated brand specifications** — including official logo offsets, typography scales, atmospheric gradient colors, and header coordinates.

To safeguard branding standards and prevent accidental shifts while moving around the workspace, these controls are locked (**🔒 Amber Lock icon**):
- Control sliders and inputs appear dimmed at 40% opacity.
- Values cannot be accidentally nudged or misaligned.

### Unlocking for Fine-Tuned Adjustments
Every image has unique composition and lighting. If background details interfere with the default branding placement:
1. Click the **lock button** next to the section heading (e.g. `Header Position`, `Sizes & Offsets`, or `Gradient Options`).
2. The lock icon switches to an **emerald unlocked icon (🔓)** and controls immediately become interactive.
3. Adjust the sliders, numeric fields, or color pickers to your exact preference.
4. **Instant Reset:** Click the inline **Reset button (↺)** next to any control at any time to restore the airline's original calibrated value, or toggle the lock back on.

---

## The 3-Step Banner Workflow

```
[1. AIRLINE] ➔ [2. BACKDROP] ➔ [3. AIRPORT] ➔ [DOWNLOAD BANNER]
```

Selecting an airline in **Tab 1** unlocks **Tab 2 (Backdrop)** and **Tab 3 (Airport)**.

---

### Step 1: Virtual Airline Identity

1. **Select Virtual Airline:**
   - Choose a profile from the **Airline Profile** dropdown. The studio syncs live airline data from the AirwayLink API with local offline caching.
   - *Note on Custom Airlines:* The "Custom" profile dropdown option is temporarily disabled in the UI while official API profiles are active.
2. **Select Header Logo Style:**
   - Choose between the **Dark Version** and **Light Version** logo cards depending on whether your background image is bright or dark.
3. **Parameter Locks in Tab 1:**
   - **Header Position (🔒):** Controls the overall `X` and `Y` anchor coordinates of the branding block. Unlock to nudge the header.
   - **Sizes & Offsets (🔒):** Controls airline title font size, logo `X/Y` offsets, activity suffix size (e.g. *Charter*, *Cargo*, *Scheduled*), and suffix offsets. Unlock to adjust spacing.
   - **Gradient Options (🔒):** Controls the top atmospheric gradient and bottom contrast gradient (colors, hex codes, opacity, and vertical depth). Unlock to customize gradient falloff over sky or terrain.
4. **Branding Effects:**
   - Enable **Drop Shadow** for enhanced readability over complex skies, or toggle **Pure White** text mode.

---

### Step 2: Backdrop & Image

1. **Import Image:**
   - Drag and drop your image directly onto the canvas preview or the Backdrop drop zone, or click **Browse Image**.
   - Supported formats: PNG, JPEG, WebP. Landscape orientation and a minimum resolution of 1080p (1920 × 1080) work best for optimal banner sharpness.
2. **Framing, Zoom & Pan:**
   - Use the **Zoom Slider** or mouse wheel on the canvas to zoom in and out.
   - Click and drag directly on the preview canvas to pan the backdrop image.
   - **Axis Locks (`Lock X` / `Lock Y`):**
     - Click **Lock X** to freeze horizontal movement and only adjust vertical framing.
     - Click **Lock Y** to freeze vertical position and pan horizontally.
     - Click **Reset** to return zoom and pan to the default centered fit.
3. **Photo Grading & Scrim:**
   - **Exposure / Dimming:** Adjust overall background brightness to let foreground branding pop.
   - **Atmospheric Blur:** Soften background scenery depth-of-field.
   - **Saturation & Hue:** Correct terrain colors or adjust golden hour / dusk tones.

---

### Step 3: Airport Callout & Instant Lookup

Tab 3 focuses entirely on the **Focus Airport Callout**:

1. **Instant 4-Letter ICAO Lookup:**
   - Type any standard 4-letter ICAO code (e.g. `KLAS`, `EGLL`, `KJFK`, `KLAX`, `EDDF`, `OMDB`, `YSSY`) into the **ICAO Airport Code** input.
2. **Live City & Country Auto-Fill:**
   - As soon as the 4th letter is entered, the **`Auto-Filled ✓`** status badge appears, and the studio automatically fills in the official **City Name and 2-Letter Country Code** (e.g. `LAS VEGAS, US` or `LONDON, GB`) directly beneath the ICAO code on the banner.
   - If an unlisted code is entered, the input displays `[INVALID AIRPORT]` with an `Invalid ICAO ✗` badge.
3. **100% Offline Airport Database:**
   - The lookup queries a comprehensive bundled airport database (`airports.json`) running locally in the browser. Zero network calls or external API queries are required.
4. **Auto-Fill Checkbox:**
   - The **Auto-Fill** checkbox is enabled by default. Unchecking it allows you to manually edit the city/country text field without automatic database overrides.
5. **Edge Proximity Margin Guard:**
   - If a city name expands to within 20px of the canvas border, the studio displays a safety alert (`⚠ < 20px from edge!`) to ensure typography never clips banner margins.
6. **Feature Scope Note:**
   - *Custom text boxes, custom flight callsigns, and manual typography size sliders are omitted in this release to prioritize instant, automated, brand-accurate banner generation.*

---

## Exporting Your Banner

1. Click the primary **Download Banner** button in the top-right header.
2. The studio renders the composition onto the hardware-accelerated canvas at full **`5664 × 2500` resolution**.
3. The image is exported as a high-quality JPEG and downloaded automatically to your browser's default downloads folder with a clean, timestamped filename.

---

## Troubleshooting & Tips

| Scenario | Solution |
| :--- | :--- |
| **Controls in Tab 1 are disabled / dimmed** | Check if an airline is selected first. For fine-tuning sliders, click the **🔒 Lock icon** on that section to toggle it to **🔓 Unlocked**. |
| **Tabs 2 and 3 are greyed out** | Selecting an airline profile in Tab 1 is required before Backdrop and Airport tabs unlock. |
| **"NO CONNECTION" Notice in Header** | The studio automatically uses locally cached airline data. Click the **Refresh** button once network connectivity is restored. |
| **Testing Different Airports** | Open the in-app tutorial (`?` button in the header) and navigate to **Step 4: Airport Database** to test any global airport code in real time using the live interactive demo. |
| **Text Contrast over Bright Clouds** | In Tab 2, increase the **Dimming** slider slightly or in Tab 1, unlock **Gradient Options** and increase the bottom/top gradient opacity. |
