# mobw - The Winners Way to Web

`mobw` is a custom, self-hosted TV operating system designed to aggregate your favorite streaming apps (Netflix, Plex, Jellyfin, etc.) into one gorgeous, lightning-fast 10-foot UI. Built to replace sluggish, ad-riddled corporate smart TV interfaces with an entirely open, home-network deployed solution.

## 🎨 Aesthetic & Design Language
The UI is built heavily on modern, ultra-premium design trends to feel like a next-generation OS:
- **Dark Theme First:** Deep navy and pure black backgrounds (`#050b14`, `#0f172a`).
- **Glassmorphism:** App cards and menus use translucent backgrounds (`rgba(11, 17, 33, 0.75)`) with heavily blurred backdrops (`backdrop-filter: blur(10px)`).
- **Dynamic Glows:** Active focus states emit soft neon blue (`#38bdf8`) and pink (`#f472b6`) drop shadows, eliminating the flat look of traditional TV menus.
- **Typography:** Uses Google Fonts `Inter` for clean, readable menus and `Outfit` for bold, impactful headers.

## 🎮 10-Foot UI (Spatial Navigation)
This interface is engineered natively for TV remotes and game controllers (D-pad), completely eliminating the need for a mouse or touch input.
- **Spatial Engine:** A custom vanilla JavaScript spatial navigation engine listens for D-pad inputs (Arrow Keys). It mathematically calculates the distance and angle to all interactive elements on screen and smoothly snaps focus to the closest valid target.
- **No Scrollbars:** Browser scrollbars are completely disabled. If you navigate to an app card that is off-screen, the engine physically scrolls the page to perfectly center it in your viewport.
- **Menu Trapping:** Pressing `Enter` on navigation icons slides out a glassmorphism side menu. The spatial engine detects this context switch and instantly traps your D-pad focus *inside* the menu so you can't accidentally navigate the background apps while the menu is open.
- **Unified Focus States:** The `.focused` CSS class seamlessly drives all interactions. When you navigate with your remote, app cards pop out, scale up, and glow dynamically.

## 🛠️ Tech Stack
- **Backend:** Python / Django (served via `uv` for lightning-fast environment management)
- **Frontend:** Pure Vanilla HTML, CSS, and JavaScript. Zero external UI bloat (no React/Vue overhead) to ensure maximum performance and buttery smooth 60fps animations, even on low-powered TV stick hardware.
