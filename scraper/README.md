# Google Maps List Scraper

## Quick Start

1. Open your Google Maps list link (e.g., `https://maps.app.goo.gl/n2iLM2F6Up666knP8`)
2. **Important:** Scroll down to load ALL places in the list (Google lazy-loads them)
3. Open Developer Tools:
   - Chrome/Edge: `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
4. Click the **Console** tab
5. Copy the entire contents of `google-maps-scraper.js`
6. Paste into the console and press `Enter`
7. Wait for it to finish
8. Either:
   - Click the download link that appears
   - Or copy the JSON from the console

## Troubleshooting

If the scraper doesn't find places:

1. **Scroll more** - Make sure you've scrolled to the bottom of the list to load all places
2. **Wait longer** - Some lists take time to fully load
3. **Try refreshing** - Then scroll and try again

If it still doesn't work, Google may have changed their page structure. As an alternative, you can:

1. Use Google Takeout to export your saved places
2. Manually copy place names into a JSON file

## Import into Berlin Places

Once you have the JSON file:

1. Run the app: `npm run dev`
2. Open http://localhost:3000
3. Click **Import** in the header
4. Select your JSON file
5. Your places will appear!

## JSON Format

The scraper outputs JSON in this format:

```json
[
  {
    "id": "place-restaurant-name-0",
    "name": "Restaurant Name",
    "address": "Street 123, 10115 Berlin",
    "coordinates": { "lat": 52.52, "lng": 13.405 },
    "rating": 4.5,
    "reservationUrl": null,
    "placeUrl": "https://maps.google.com/..."
  }
]
```

Note: Coordinates default to Berlin center. To get real coordinates, you'd need to click into each place, which is a more complex scraping operation.
