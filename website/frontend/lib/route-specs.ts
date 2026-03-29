export const routeSpecs = {
  '/': { purpose: 'hero and project overview', blueprintIndex: 0 },
  '/stay': { purpose: 'lodging catalog and booking funnel', blueprintIndex: 1 },
  '/experiences': { purpose: 'all excursions and curated itineraries', blueprintIndex: 2 },
  '/workshops': { purpose: 'craft, photography, retreat, and special event booking', blueprintIndex: 3 },
  '/rentals': { purpose: 'equipment rental catalog and booking rules', blueprintIndex: 4 },
  '/shop': { purpose: 'artisan tiles, pottery, prints, small merch', blueprintIndex: 5 },
  '/dark-sky': { purpose: 'stargazing information, livestreams, astronomy calendar', blueprintIndex: 6 },
  '/activism': { purpose: 'border wall updates, scripts, donations, local coalition links', blueprintIndex: 7 },
  '/about': { purpose: 'Chuck and Susan story, mission, stewardship', blueprintIndex: 8 },
  '/blog': { purpose: 'updates, field notes, construction journal, workshop recaps', blueprintIndex: 9 },
  '/plan': { purpose: 'weekend-cruise-style itinerary builder', blueprintIndex: 10 },
  '/assistant': { purpose: 'Burro concierge ui', blueprintIndex: 11 },
  '/steel-buildings': { purpose: 'commercial steel building sales and consultation for ranches and businesses', blueprintIndex: 12 },
} as const;

export type RouteKey = keyof typeof routeSpecs;
