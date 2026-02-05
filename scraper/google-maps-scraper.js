// Google Maps List Scraper
//
// HOW TO USE:
// 1. Open your Google Maps list link in Chrome/Firefox
// 2. Scroll down to load ALL places (the list lazy-loads)
// 3. Open Developer Tools (F12 or Cmd+Option+I)
// 4. Go to the Console tab
// 5. Paste this entire script and press Enter
// 6. Wait for it to finish (it will show progress)
// 7. Copy the JSON output or click the download link

(async function scrapeGoogleMapsList() {
  console.log('🗺️ Starting Google Maps List Scraper...');

  // Find all place items in the list
  const placeElements = document.querySelectorAll('[data-index]');

  if (placeElements.length === 0) {
    // Try alternative selector for different list layouts
    const altElements = document.querySelectorAll('div[role="article"]');
    if (altElements.length === 0) {
      console.error('❌ No places found. Make sure you are on a Google Maps list page and have scrolled to load all items.');
      return;
    }
  }

  const places = [];
  const seenIds = new Set();

  // Helper to extract text content safely
  const getText = (el, selector) => {
    const found = el.querySelector(selector);
    return found ? found.textContent.trim() : null;
  };

  // Helper to generate unique ID
  const generateId = (name, index) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    return `place-${slug}-${index}`;
  };

  // Method 1: Try scraping from the feed/list view
  console.log('📍 Scanning for places...');

  // Look for place cards in the list
  const feedItems = document.querySelectorAll('[data-index], div[role="article"], .hfpxzc');

  feedItems.forEach((item, index) => {
    try {
      // Try to find the place name
      let name = null;
      let address = null;
      let rating = null;
      let placeUrl = null;

      // Try different selectors for name
      const nameSelectors = [
        '.fontHeadlineSmall',
        '.qBF1Pd',
        '[aria-label]',
        '.NrDZNb',
        'h3',
        '.fontTitleSmall'
      ];

      for (const sel of nameSelectors) {
        const el = item.querySelector(sel);
        if (el) {
          name = el.textContent?.trim() || el.getAttribute('aria-label');
          if (name && name.length > 1 && name.length < 100) break;
        }
      }

      if (!name) {
        // Try aria-label on the item itself
        name = item.getAttribute('aria-label');
      }

      // Try to find address
      const addressSelectors = [
        '.W4Efsd:last-child',
        '.fontBodyMedium',
        '[data-tooltip]'
      ];

      for (const sel of addressSelectors) {
        const el = item.querySelector(sel);
        if (el) {
          const text = el.textContent?.trim();
          // Address usually contains a street number or common words
          if (text && (text.match(/\d/) || text.includes('str') || text.includes('Str'))) {
            address = text;
            break;
          }
        }
      }

      // Try to find rating
      const ratingEl = item.querySelector('[aria-label*="stars"], [aria-label*="Sterne"], .MW4etd');
      if (ratingEl) {
        const ratingText = ratingEl.textContent || ratingEl.getAttribute('aria-label');
        const ratingMatch = ratingText?.match(/(\d[.,]\d)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1].replace(',', '.'));
        }
      }

      // Try to find the link to the place
      const linkEl = item.querySelector('a[href*="maps/place"], a[href*="maps?"]');
      if (linkEl) {
        placeUrl = linkEl.href;
      }

      if (name && !seenIds.has(name)) {
        seenIds.add(name);
        places.push({
          id: generateId(name, places.length),
          name: name,
          address: address || 'Address not available',
          coordinates: { lat: 52.52, lng: 13.405 }, // Default to Berlin center
          rating: rating,
          reservationUrl: null,
          placeUrl: placeUrl
        });
      }
    } catch (e) {
      console.warn('Error parsing place:', e);
    }
  });

  // Method 2: Try extracting from the page's data layer
  if (places.length === 0) {
    console.log('📍 Trying alternative extraction method...');

    // Look for places in script tags or data attributes
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      const content = script.textContent;
      if (content && content.includes('initEmbed') || content.includes('placeName')) {
        // Try to extract place data from embedded scripts
        const matches = content.matchAll(/"([^"]+)",\s*"([^"]+)",\s*(\d+\.\d+),\s*(\d+\.\d+)/g);
        for (const match of matches) {
          if (!seenIds.has(match[1])) {
            seenIds.add(match[1]);
            places.push({
              id: generateId(match[1], places.length),
              name: match[1],
              address: match[2],
              coordinates: { lat: parseFloat(match[3]), lng: parseFloat(match[4]) },
              rating: null,
              reservationUrl: null,
              placeUrl: null
            });
          }
        }
      }
    });
  }

  if (places.length === 0) {
    console.error('❌ Could not extract any places. The page structure may have changed.');
    console.log('💡 TIP: Try scrolling through the entire list first, then run this script again.');
    console.log('💡 TIP: If this still doesn\'t work, you may need to manually export from Google Maps.');
    return;
  }

  console.log(`✅ Found ${places.length} places!`);

  // Output JSON
  const json = JSON.stringify(places, null, 2);

  // Log to console
  console.log('\n📋 JSON Output (copy this):');
  console.log(json);

  // Create download link
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split('T')[0];

  console.log('\n📥 Or download directly:');
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `google-maps-places-${timestamp}.json`;
  downloadLink.textContent = `Click here to download (${places.length} places)`;
  downloadLink.style.cssText = 'display:block; padding:10px; background:#4285f4; color:white; text-decoration:none; border-radius:4px; margin:10px 0;';

  // Try to append to page for easy clicking
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed; top:10px; right:10px; z-index:99999; background:white; padding:15px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.2);';
  container.innerHTML = `<strong>🗺️ Scraper Results</strong><br>Found ${places.length} places`;
  container.appendChild(downloadLink);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Close';
  closeBtn.style.cssText = 'margin-top:10px; padding:5px 10px; cursor:pointer;';
  closeBtn.onclick = () => container.remove();
  container.appendChild(closeBtn);

  document.body.appendChild(container);

  // Also copy to clipboard if possible
  try {
    await navigator.clipboard.writeText(json);
    console.log('📋 JSON copied to clipboard!');
  } catch (e) {
    console.log('💡 To copy: Select the JSON above, right-click, and choose Copy');
  }

  return places;
})();
