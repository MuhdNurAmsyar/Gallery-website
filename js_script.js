// ---
// Web Application JavaScript - Gallery Script
// Developer: Amsyar
// ---

// Simple gallery script
// By default this script fetches images.json and builds the gallery.
// Put your image files in the images/ folder and list them in images.json,
// e.g. ["photo1.jpg","photo2.jpg"]

const GALLERY_ID = 'gallery';
const IMAGE_BASE = 'images/'; // folder where images are stored
const LIST_JSON = 'images.json';

let images = [];
let currentIndex = -1;

// DOM refs
const galleryEl = document.getElementById(GALLERY_ID);
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lightboxImage');
const lbCaption = document.getElementById('lightboxCaption');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

async function loadImageList(){
  try {
    const res = await fetch(LIST_JSON, {cache: "no-store"});
    if(!res.ok) throw new Error('No list');
    images = await res.json();
  } catch (e) {
    // Fallback: empty list (user should update images.json)
    images = [];
    console.warn('Could not load images.json — update the file or add filenames to script fallback.');
  }
}

function buildGallery(){
  if(!galleryEl) return;
  galleryEl.innerHTML = '';
  if(images.length === 0){
    galleryEl.innerHTML = `<p style="text-align:center;opacity:.8">No images found. Add images to the <code>images/</code> folder and update <code>images.json</code>.</p>`;
    return;
  }

  function stripExtension(filename){
  return filename.replace(/\.[^/.]+$/i, '');
}

  images.forEach((name, idx) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${name}`);
    card.addEventListener('click', () => openLightbox(idx));

    const img = document.createElement('img');
    img.src = IMAGE_BASE + name;
    img.alt = display;
    img.loading = 'lazy';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<span>${name}</span><span style="opacity:.8">${idx+1}/${images.length}</span>`;

    card.appendChild(img);
    card.appendChild(meta);
    galleryEl.appendChild(card);
  });
}

function openLightbox(index){
  if(index < 0 || index >= images.length) return;
  currentIndex = index;
  const src = IMAGE_BASE + images[index];
  lbImage.src = src;
  lbImage.alt = images[index];
  lbCaption.textContent = images[index];
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true');
  lbImage.src = '';
  document.body.style.overflow = '';
  currentIndex = -1;
}

function showNext(dir = 1){
  if(images.length === 0) return;
  currentIndex = (currentIndex + dir + images.length) % images.length;
  openLightbox(currentIndex);
}

// Event listeners
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', () => showNext(-1));
nextBtn.addEventListener('click', () => showNext(1));

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showNext(-1);
    if(e.key === 'ArrowRight') showNext(1);
  }
});

// Click outside image closes
lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) closeLightbox();
});

// Init
(async function init(){
  await loadImageList();
  buildGallery();
})();