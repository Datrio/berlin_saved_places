# Berlin Places Browser - Design Document

## Overview
A web application to browse, organize, and annotate your Google Maps saved places with filtering, sorting, and map visualization.

## Requirements
- **Places:** 150 saved places from Google Maps
- **Data capture:** Name, coordinates, location, address, Google rating, reservation page URL
- **User annotations:** Notes, labels (tags), personal scores (1-5)
- **Storage:** Local storage initially, extensible to server backend later
- **Scale:** 150 places

## Architecture

### Layers
1. **Frontend:** React/Next.js with client-side state management
2. **Data Layer:** Browser localStorage for persistence, with server-ready design
3. **Backend (future):** API layer to replace localStorage calls

### Data Flow
1. Scrape Google Maps link → JSON file with place data
2. User imports JSON → stored in localStorage
3. User adds annotations → persisted locally
4. Future: Migrate to server without UI changes

## Data Model

### Place Data (from Google Maps - immutable)
```json
{
  "id": "unique_id",
  "name": "Restaurant Name",
  "address": "123 Main St, Berlin",
  "coordinates": { "lat": 52.52, "lng": 13.405 },
  "rating": 4.5,
  "reservationUrl": "https://..."
}
```

### User Annotations (mutable - stored locally)
```json
{
  "placeId": "unique_id",
  "notes": "Great ambiance, try the pasta",
  "labels": ["restaurant", "date-night", "outdoor-seating"],
  "score": 4
}
```

## Features

### 1. Views
- **List/Cards View:** Browse all places in table or grid format with filtering/sorting
- **Map View:** Interactive map showing all places as markers with filtering
- **Detail View:** Full place info + user annotations when clicked

### 2. Filtering
- By labels (multi-select checkboxes)
- By Google rating (slider: 0-5)
- By personal score (slider: 0-5)
- By proximity (optional location-based)

### 3. Sorting
- Name
- Google rating
- Personal score
- Distance
- Date added

### 4. Interaction
- Add/edit notes for each place
- Add/remove labels (tags)
- Set personal score (1-5)
- Search by name/address

### 5. Data Management
- Import scraped JSON file
- Export all data (places + annotations) as JSON backup

### 6. Map
- Use Leaflet (open-source) or Mapbox (upgrade path)
- Show all places as markers
- Click markers to view details
- Apply filters to map view

## Tech Stack

- **Framework:** Next.js
- **Frontend:** React
- **State Management:** React Context or Zustand
- **Storage:** localStorage (browser)
- **Map:** Leaflet (initial) → Mapbox (future)
- **Styling:** Tailwind CSS

## Implementation Approach

### Phase 1: Core App
- Set up Next.js project
- Implement data models and localStorage persistence
- Build list view with places display
- Add filtering and sorting controls

### Phase 2: Annotations
- Add UI for notes, labels, scores
- Implement local persistence of annotations

### Phase 3: Map
- Integrate Leaflet
- Add map view with markers

### Phase 4: Data Import
- Build import UI for scraped Google Maps JSON

### Phase 5: Polish
- Search functionality
- Export/backup
- UI refinements

## Future Extensions
- Server backend (migrate localStorage → API)
- User authentication
- Data sync across devices
- Sharing/collaboration features
- Mobile app
