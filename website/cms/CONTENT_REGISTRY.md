# Big Bend Burro - Canonical Content Registry

**Version:** 1.1.0
**Last Updated:** 2026-03-28
**Purpose:** Single source of truth for active public content, pricing, and canonical source paths.

---

## Source Rules

- `website/cms/units/*.json` is the source of truth for lodging inventory.
- `website/cms/rates/seasonal.json` is the source of truth for lodging pricing.
- `website/cms/workshops/*.json` is the source of truth for workshop pricing and schedule.
- `website/cms/experiences/*.json` is the source of truth for experience pricing and availability.
- `website/cms/shop/*.json` is the source of truth for shop products.
- `website/cms/equipment/*.json` is the source of truth for the public rental catalog and internal equipment surfaces.
- `website/cms/rentals/` is retired. Do not add new rental assets there.

---

## Status Standards

| Domain | Allowed Values |
|--------|----------------|
| Lodging | `available`, `coming-soon`, `private` |
| Shop | `available`, `sold-out`, `coming-soon`, `private` |
| Experiences | `available`, `seasonal`, `coming-soon`, `private` |
| Equipment | `available`, `reserved`, `maintenance`, `retired` |

**Note:** Sprint 16 normalized lodging soft-launch units to `coming-soon`. Legacy underscore status values should not be used going forward.

---

## Accommodations

**Check-in:** 4:00 PM Central
**Check-out:** 10:00 AM Central

| Unit | Slug | Status | Featured | Pricing Source |
|------|------|--------|----------|----------------|
| Mesa Glow Cabin | `mesa-glow-cabin` | `available` | Yes | seasonal rates |
| Casa de la Luna | `casa-de-la-luna` | `available` | Yes | seasonal rates |
| Cottonwood Lookout Tent | `cottonwood-lookout` | `coming-soon` | No | seasonal rates |
| Ocotillo Lookout | `ocotillo-lookout` | `coming-soon` | No | seasonal rates |
| Private Homestead | `private-homestead` | `private` | No | none |

### Seasonal Rates

| Season | Dates | Mesa Glow | Casa de la Luna | Cottonwood | Ocotillo |
|--------|-------|-----------|-----------------|------------|----------|
| Spring Peak | Feb 15 - May 15 | $285 | $265 | $210 | $195 |
| Summer Reset | May 16 - Sep 15 | $225 | $195 | $175 | $150 |
| Dark Sky Season | Sep 16 - Feb 14 | $265 | $245 | $195 | $175 |

**Default fallback:** $245 nightly, $42 cleaning fee.
**Weekly discount range:** 8% to 12% by season and unit.

---

## Workshops

| Workshop | Slug | Instructor | Format | Base Price | Deposit | Status |
|----------|------|------------|--------|------------|---------|--------|
| Dark Sky Photography Field Session | `dark-sky-photography` | Chuck | 5-hour single session | $240 | $80 | `published` |
| Desert Tile Making Intro | `tile-making-intro` | Susan | 4-hour single session | $185 | none | `published` |

**Package note:** Multi-day retreat and bundle pricing is custom quote only. No fixed public package prices are stored in CMS.

---

## Experiences

| Experience | Slug | Category | Delivery | Price | Duration | Status |
|------------|------|----------|----------|-------|----------|--------|
| Rio Grande Daybreak Float | `rio-grande-daybreak-float` | river | partner-led | $240 | 5 hours | `seasonal` |
| Terlingua Night Sky Drive | `terlingua-night-sky-drive` | stargazing | guide-led | $180 | 3.5 hours | `available` |
| Boquillas Story Route | `boquillas-story-route` | cultural | partner-led | $210 | 4 hours | `coming-soon` |
| Terlingua Tile Fire Circle | `terlingua-tile-fire-circle` | craft | owned | $120 | 2 hours | `available` |

---

## Shop Products

### Prints
| Product | Slug | Price | Status |
|---------|------|-------|--------|
| Road to Chisos Print | `road-to-chisos-print` | $85 | `available` |
| Casa Grande Bloom Print | `casa-grande-bloom-print` | $95 | `available` |
| Santa Elena Canyon Print | `santa-elena-canyon-print` | $125 | `available` |
| Chisos Golden Hour Print | `chisos-golden-hour-print` | $95 | `available` |
| Canyon Passage Print | `canyon-passage-print` | $110 | `available` |
| Into the Slot Print | `into-the-slot-print` | $95 | `available` |
| Rio Grande Bend Print | `rio-grande-bend-print` | $85 | `available` |
| Mesa Glow Print | `mesa-glow-print` | $85 | `available` |
| Desert Threshold Print | `desert-threshold-print` | $95 | `coming-soon` |

### Handmade Tiles
| Product | Slug | Price | Status |
|---------|------|-------|--------|
| Desert Scene Tile | `desert-scene-tile` | $45 base, $65 large variant | `available` |
| Ocotillo Design Tile | `ocotillo-tile` | $55 | `available` |
| Custom Tile Set | `custom-tile-set` | $120 | `coming-soon` |

### Pottery
| Product | Slug | Price | Status |
|---------|------|-------|--------|
| Desert Morning Mug | `desert-mug` | $38 | `available` |
| Succulent Planter | `succulent-planter` | $45 | `available` |

### Apparel
| Product | Slug | Price | Status |
|---------|------|-------|--------|
| Big Bend Burro T-Shirt | `burro-tshirt` | $28 | `coming-soon` |
| Dark Sky Cap | `dark-sky-cap` | $24 | `coming-soon` |

### Giftables and Print-On-Demand
| Product | Slug | Price | Status |
|---------|------|-------|--------|
| Burro Sticker Pack | `burro-sticker-pack` | $12 | `available` |
| Borderlands Story Postcard Set | `borderlands-postcard-set` | $24 | `coming-soon` |
| Burro Field Notes Kit | `burro-field-notes-kit` | $34 | `coming-soon` |
| Night Sky Atlas Poster | `night-sky-atlas-poster` | $68 | `available` |
| Night Sky Poster | `night-sky-poster` | $48 | `available` |
| Private Tile Patron Drop | `private-tile-drop` | $190 | `private` |

**Media note:** Several Sprint 16 products currently use on-site inspiration photography until dedicated product photography is captured.

---

## Equipment Rental

| Asset | Slug | Category | Daily | Weekly | Deposit | Status |
|-------|------|----------|-------|--------|---------|--------|
| Kubota KX040-4 Mini Excavator | `kubota-kx040-excavator` | excavator | $450 | $2,250 | $2,500 | `available` |
| Sony A7R Night Kit | `sony-a7r-kit` | camera | $95 | - | $250 | `available` |
| Portable Star Tracker Kit | `star-tracker-kit` | telescope | $70 | - | $180 | `available` |
| Tile Workshop Tool Pack | `tile-tool-pack` | craft-supplies | $35 | - | $75 | `reserved` |

**Delivery fee:** $250 for Kubota delivery within 50 miles of Terlingua.

---

## Identifier Guidance

- New Sprint 16 shop products now follow `product_[category]_[descriptor]`.
- Legacy product IDs from earlier sprints remain in place until an explicit migration is planned.
- Slugs are the canonical public keys for routes and cross-reference lookups.

---

## Sync Points

These files must stay aligned:
1. `website/cms/` canonical data and framework docs
2. `custom_gpt/metalminds/` operator knowledge files
3. `memory/current_state.md` and sprint handoff summaries

*Canonical Content Registry v1.1.0 - post-mortem aligned after Sprints 15 and 16*
