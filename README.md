```markdown
# Simple Gallery Website

This is a minimal static gallery you can add to your repo.

How it works
- index.html shows a responsive grid of thumbnails.
- js/script.js reads `images.json` and builds the gallery using files located in the `images/` folder.
- Click a thumbnail to open the lightbox, use ← → or Esc to navigate/close.

Setup
1. Create an `images/` folder at the repo root.
2. Add your image files (e.g. `photo1.jpg`, `photo2.jpg`) to `images/`.
3. Update `images.json` with the filenames (strings in the array).
4. Serve the folder with a static server (browsers block some file system fetches over file://):

   - Simple Python: `python3 -m http.server 8000` then open `http://localhost:8000/index.html`
   - Or use any static hosting or GitHub Pages.

Optional improvements
- Produce `images.json` programmatically on the server (recommended for many images).
- Add lazy-loading thumbnails generation, pagination, or upload support.
- Integrate with a backend or CI job to auto-generate the images manifest.

If you want, I can:
- Create a script to auto-generate `images.json` from the repository (requires running a script or GitHub Action),
- Or convert the gallery to pull images from a JSON API / cloud storage.

```