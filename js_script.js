// ---
// Web Application JavaScript - Gallery Script
// Developer: Amsyar
// ---

// Simple gallery script
// By default this script fetches images.json and builds the gallery.
// Put your image files in the images/ folder and list them in images.json,
// e.g. ["photo1.jpg","photo2.jpg"]

const GALLERY_ID = 'gallery'; // ID of the gallery container element
const IMAGE_BASE = 'images/'; // folder where images are stored
const LIST_JSON = 'images.json'; // JSON file containing list of image filenames

let images = []; // Array to store image filenames (populated from JSON)
let currentIndex = -1; // Index of currently displayed image in lightbox (-1 = none)

// DOM refs
const galleryEl = document.getElementById(GALLERY_ID); // Gets gallery container element by ID
const lightbox = document.getElementById('lightbox'); // Gets lightbox overlay element
const lbImage = document.getElementById('lightboxImage'); // Gets large image element in lightbox
const lbCaption = document.getElementById('lightboxCaption'); // Gets caption element in lightbox
const closeBtn = document.getElementById('closeBtn'); // Gets close button element
const prevBtn = document.getElementById('prevBtn'); // Gets previous navigation button
const nextBtn = document.getElementById('nextBtn'); // Gets next navigation button

async function loadImageList(){ // Async function to fetch image list from JSON file
  try { // Begins try block for error handling
    const res = await fetch(LIST_JSON, {cache: "no-store"}); // Fetches JSON file without caching
    if(!res.ok) throw new Error('No list'); // Throws error if fetch fails
    images = await res.json(); // Parses JSON response and stores in images array
  } catch (e) { // Catches any errors from fetch or JSON parsing
    // Fallback: empty list (user should update images.json)
    images = []; // Sets images to empty array as fallback
    console.warn('Could not load images.json — update the file or add filenames to script fallback.'); // Logs warning to console
  } // Closes catch block
} // Closes loadImageList function

function buildGallery(){ // Function to build gallery DOM from images array
  if(!galleryEl) return; // Exits if gallery element doesn't exist
  galleryEl.innerHTML = ''; // Clears existing gallery content
  if(images.length === 0){ // Checks if images array is empty
    galleryEl.innerHTML = `<p style="text-align:center;opacity:.8">No images found. Add images to the <code>images/</code> folder and update <code>images.json</code>.</p>`; // Displays help message
    return; // Exits function early
  } // Closes if block

  function stripExtension(filename){ // Helper function to remove file extension
  return filename.replace(/\.[^/.]+$/i, ''); // Uses regex to remove extension from filename
} // Closes stripExtension function

  images.forEach((name, idx) => { // Loops through each image filename with index
    const card = document.createElement('button'); // Creates button element for card
    card.className = 'card'; // Assigns 'card' CSS class
    card.type = 'button'; // Sets button type attribute
    card.setAttribute('aria-label', `Open ${name}`); // Sets accessibility label
    card.addEventListener('click', () => openLightbox(idx)); // Adds click event to open lightbox

    const img = document.createElement('img'); // Creates img element
    img.src = IMAGE_BASE + name; // Sets image source URL
    img.alt = display; // Sets alt text (Note: 'display' variable not defined - should be 'name')
    img.loading = 'lazy'; // Enables lazy loading for better performance

    const meta = document.createElement('div'); // Creates div for metadata
    meta.className = 'meta'; // Assigns 'meta' CSS class
    meta.innerHTML = `<span>${name}</span><span style="opacity:.8">${idx+1}/${images.length}</span>`; // Sets inner HTML with filename and position counter

    card.appendChild(img); // Appends image to card
    card.appendChild(meta); // Appends metadata to card
    galleryEl.appendChild(card); // Appends card to gallery container
  }); // Closes forEach loop
} // Closes buildGallery function

function openLightbox(index){ // Function to open lightbox with specified image
  if(index < 0 || index >= images.length) return; // Validates index is within bounds
  currentIndex = index; // Updates current index
  const src = IMAGE_BASE + images[index]; // Constructs full image path
  lbImage.src = src; // Sets lightbox image source
  lbImage.alt = images[index]; // Sets lightbox image alt text
  lbCaption.textContent = images[index]; // Sets caption text to filename
  lightbox.setAttribute('aria-hidden','false'); // Shows lightbox (accessibility)
  document.body.style.overflow = 'hidden'; // Disables body scrolling while lightbox is open
} // Closes openLightbox function

function closeLightbox(){ // Function to close lightbox
  lightbox.setAttribute('aria-hidden','true'); // Hides lightbox (accessibility)
  lbImage.src = ''; // Clears image source
  document.body.style.overflow = ''; // Re-enables body scrolling
  currentIndex = -1; // Resets current index
} // Closes closeLightbox function

function showNext(dir = 1){ // Function to navigate to next/previous image (default direction: 1 = next)
  if(images.length === 0) return; // Exits if no images available
  currentIndex = (currentIndex + dir + images.length) % images.length; // Calculates new index with wraparound using modulo
  openLightbox(currentIndex); // Opens lightbox with new image
} // Closes showNext function

// Event listeners
closeBtn.addEventListener('click', closeLightbox); // Binds close button to closeLightbox function
prevBtn.addEventListener('click', () => showNext(-1)); // Binds previous button to show previous image
nextBtn.addEventListener('click', () => showNext(1)); // Binds next button to show next image

// Keyboard navigation
window.addEventListener('keydown', (e) => { // Adds keyboard event listener to window
  if(lightbox.getAttribute('aria-hidden') === 'false'){ // Checks if lightbox is currently open
    if(e.key === 'Escape') closeLightbox(); // Escape key closes lightbox
    if(e.key === 'ArrowLeft') showNext(-1); // Left arrow shows previous image
    if(e.key === 'ArrowRight') showNext(1); // Right arrow shows next image
  } // Closes if block
}); // Closes event listener

// Click outside image closes
lightbox.addEventListener('click', (e) => { // Adds click event to lightbox overlay
  if(e.target === lightbox) closeLightbox(); // Closes lightbox only if clicking the overlay (not the image)
}); // Closes event listener

// Init
(async function init(){ // Immediately invoked async function expression (IIFE)
  await loadImageList(); // Waits for image list to load from JSON
  buildGallery(); // Builds gallery after images are loaded
})(); // Invokes the async function immediately
