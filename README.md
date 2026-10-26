# SnapStudio

**A customizable, browser-based photobooth for personal moments and events.**

SnapStudio lets you design a photo strip, take pictures with your device's camera, edit individual shots, and download the finished result—all in your browser. The interface is available in **English and Chinese (中文)**.

## Features

### Photobooth experience
- **Personal & Event modes** for everyday memories, parties, and gatherings.
- **3, 4, or 6-photo layouts** with a live frame preview.
- **Four frame themes:** Ivory, Noir, Sage, and Dusty Rose.
- **Custom frames:** edit the title, date, font, text size, and text color.
- **Event logo upload** (PNG, JPG, or WebP; maximum 5 MB).
- **Reusable frame templates** saved locally in the browser.

### Camera & editing
- **Camera capture** with configurable 3-, 5-, or 10-second countdowns.
- **Retake individual photos**, restart a session, toggle mirroring, and switch cameras where supported.
- **Edit each photo** with repositioning, zoom, rotation, brightness, contrast, horizontal flip, replacement, and reordering.
- **Customize the layout** by adjusting spacing, padding, photo height, frame color, and title/logo placement.
- **Add draggable text and decorative stickers** to the photo strip.
- **Export as PNG** in standard or high-resolution (3×) quality.

## Tech Stack

- **React 18** — user interface
- **Vite 6** — development server and production build
- **JavaScript (JSX)** and **CSS** — application logic and styling
- **Lucide React** — interface icons
- **Canvas API** — image editing and PNG export
- **MediaDevices API** — camera access
- **localStorage** — saved design templates

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- npm (included with Node.js)
- A modern browser (such as Chrome, Edge, or Safari)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub details.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

The production-ready files are generated in the `dist/` directory.

## How to Use

1. **Choose a mode:** Personal Studio or Event Studio.
2. **Design your frame:** Pick a photo count and theme; customize the title, date, and optional logo. You can save the design as a template.
3. **Take photos:** Allow camera access, choose a countdown, and capture your shots. Retake any photo if needed.
4. **Edit:** Adjust the layout and individual photos; add text or stickers and drag them into place.
5. **Download:** Save your photo strip as a standard or HD PNG.

## Project Structure

```text
SnapStudio/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── src/
    ├── App.jsx              # Main app and setup flow
    ├── CameraStudio.jsx     # Camera, countdown, and capture
    ├── FramePreview.jsx     # Frame themes and live preview
    ├── PhotoEditor.jsx      # Photo editing and PNG export
    ├── templateStorage.js   # Browser-based template storage
    ├── main.jsx             # React entry point
    └── style.css            # Application styling
```

> `node_modules/` and `dist/` are generated locally and should not be committed to GitHub.

## Privacy & Browser Notes

- SnapStudio runs **client-side**: this project does not include a server, account system, or cloud photo storage.
- Photos are processed in the browser; this application does not send captured images to a backend.
- Saved design templates are stored in your browser's **localStorage** (up to 20 templates), so they do not automatically sync across devices or browsers.
- **Camera access requires permission** and normally works only on **HTTPS** websites or **localhost**. Camera switching depends on device support.

## Project Status

**Functional prototype.** Core photobooth, customization, capture, editing, template saving, and PNG export features are implemented. Further improvements and testing may be added over time.
