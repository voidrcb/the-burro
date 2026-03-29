# Site Completion Sprint: From Scaffold to Working House

**Date:** 2026-03-21
**Author:** Burro Dev Agent
**Priority:** CRITICAL
**Status:** ANALYSIS COMPLETE - READY FOR IMPLEMENTATION

---

## Executive Summary

The site at bigbendburro.vcetexas.com is displaying FLAT TEXT instead of the dynamic styled site because **components exist but lack visual integration**. The scaffolding is complete, but the house has no walls.

### Critical Gap Analysis

| What Exists | What's Missing |
|-------------|----------------|
| 14 completed sprints (0.1-3.3) | Images NOT rendered in components |
| Full design token system | Gradient placeholders instead of photos |
| CMS with all content JSON | No Next/Image integration |
| 17+ real images in /public | Components ignore image URLs |
| Tailwind properly configured | No site footer |
| All navigation routes working | Sprint/scaffold copy in production pages |

**Root Cause:** Every sprint focused on contract/API correctness but used gradient placeholders for "proof" validation. No sprint ever wired the actual images.

---

## Part 1: Findings

### 1.1 Image Integration Gap (CRITICAL)

**Evidence:**

Components use hardcoded gradient backgrounds instead of images:

```typescript
// UnitCard.tsx line 25 - PLACEHOLDER
<div className="mt-5 h-48 rounded-[24px] bg-[radial-gradient(...)]" />

// HeroMedia.tsx line 5 - PLACEHOLDER
<div className="mt-4 h-48 rounded-[22px] bg-[radial-gradient(...)]" />

// ShopCatalogClient.tsx line 53 - TEXT PLACEHOLDER
<div className="rounded-[22px] bg-[#f1ebdd] px-5 py-10 text-center">
  {product.images[0]?.alt ?? product.title}
</div>
```

**But images exist:**

| Location | Count | Used? |
|----------|-------|-------|
| `/public/images/stay/` | 4 images | NO |
| `/public/images/workshops/` | 2 images | NO |
| `/public/images/experiences/` | 4 images | NO |
| `/public/images/rentals/` | 2 images | NO |
| `/public/shop/` | 5 images | NO |

**CMS references correct paths:**
```json
// cms/units/casa-de-la-luna.json
"photos": [{ "url": "/images/stay/casa-de-la-luna-01.jpg" }]

// cms/shop/desert-threshold-print.json
"images": [{ "url": "/shop/desert-threshold-print-1.jpg" }]
```

### 1.2 Missing Site Footer

No footer component exists. The site ends abruptly. Missing:
- Copyright notice
- Contact/social links
- Legal links (privacy, terms)
- Newsletter signup persistence
- "Built by Burro" branding

### 1.3 Production Copy Still Contains Sprint Language

Pages contain scaffold-mode messaging that should not be public:

```typescript
// shop/page.tsx line 17
body="Sprint 1.4 launches a first shop surface..."

// stay/page.tsx line 22
body="Sprint 1.2 ships a booking handoff, not a fantasy checkout..."

// workshops/page.tsx line 16
body="Sprint 1.3 launches the public workshop layer..."

// experiences/page.tsx line 21
body="Sprint 2.1 upgrades the old route stub..."
```

### 1.4 Navigation Missing Shop Link

PrimaryNav routes:
- Home, About, Journal, Activism, Stay, Experiences, Workshops, Contact

**Missing: Shop** (exists at /shop but not in nav)

### 1.5 Assistant Links Exposed Publicly

Experience page links to `/assistant/itinerary` - an internal operator route. Public visitors should not see assistant routes.

### 1.6 Image Optimization Disabled

`next.config.mjs` has `images: { unoptimized: true }` - acceptable for scaffold but should consider optimization for production performance.

---

## Part 2: Site Inventory

### Pages That Work (Navigation)
- `/` - Home
- `/about` - About
- `/blog` - Blog index
- `/blog/[slug]` - Blog posts (4 posts)
- `/activism` - Activism hub
- `/activism/updates/[slug]` - Update details
- `/stay` - Stay catalog
- `/stay/[slug]` - Unit details
- `/stay/[slug]/book` - Booking handoff
- `/experiences` - Experience catalog
- `/experiences/[slug]` - Experience details
- `/workshops` - Workshop catalog
- `/workshops/[slug]` - Workshop details
- `/workshops/[slug]/register` - Registration
- `/shop` - Shop catalog
- `/shop/[slug]` - Product details
- `/shop/checkout` - Cart/checkout
- `/contact` - Contact
- `/dark-sky` - Dark sky info
- `/rentals` - Equipment rentals
- `/plan` - Trip planning

### Content Files (CMS)
- 4 blog posts (.mdx)
- 4 lodging units (.json)
- 2 workshops (.json)
- 4 experiences (.json)
- 7 shop products (.json)
- 1 rental item (.json)
- 3 equipment items (.json)

### Design System
- Tailwind configured with custom tokens
- 6 palette sets (desert gold, night sky, sage stone, etc.)
- Semantic colors (surface, text, accent, status, nightSafe)
- Custom spacing, radii, shadows
- Typography: Georgia display, Trebuchet body

---

## Part 3: Sprint Plan

### Sprint SC.1: Image Integration (Day 1)

**Scope:** Wire all existing images into components

**Tasks:**

1. **Create ImageWithFallback component**
   - Use Next/Image with fallback gradient
   - Accept src, alt, sizes props
   - Handle loading states elegantly

2. **Update UnitCard.tsx**
   - Pass `unit.photos[0]` to new image component
   - Replace gradient div with actual image

3. **Update HeroMedia.tsx**
   - Accept `imageSrc` and `imageAlt` props
   - Render Susan's photos instead of gradient

4. **Update ShopCatalogClient.tsx**
   - Render actual product images
   - Keep alt text as fallback

5. **Update WorkshopCard.tsx**
   - Add image rendering for workshop photos
   - Use workshop thumbnail from CMS

6. **Update ExperienceCatalog.tsx**
   - Add image slot for experience photos
   - Wire to experience.images[0]

7. **Home page HeroMedia**
   - Select a signature Susan photo for hero
   - Update home page to use real image

**Acceptance:**
- Every catalog card shows an actual image
- No gradient placeholders visible on public pages
- Images lazy-load properly

---

### Sprint SC.2: Site Footer & Navigation (Day 1-2)

**Scope:** Complete site shell

**Tasks:**

1. **Create SiteFooter component**
   ```
   - Big Bend Burro branding
   - Contact email
   - Social links placeholder
   - Newsletter signup
   - Copyright (dynamic year)
   - Legal links placeholder
   ```

2. **Add Footer to SiteShell.tsx**
   - Place after main content
   - Consistent styling with header

3. **Update PrimaryNav**
   - Add Shop link
   - Remove or hide assistant routes from public view
   - Consider mobile hamburger menu (deferred)

4. **Add meta tags**
   - OG image (select from Susan's photos)
   - Description updates
   - Favicon if missing

**Acceptance:**
- Footer visible on all pages
- Shop appears in navigation
- No internal routes exposed

---

### Sprint SC.3: Content Cleanup (Day 2)

**Scope:** Remove scaffold language from production pages

**Tasks:**

1. **Home page (page.tsx)**
   - Remove "Public launch" eyebrow or make permanent
   - Review all copy for temporary language

2. **Shop page (shop/page.tsx)**
   - Replace "Sprint 1.4 launches..." with proper commerce copy
   - Remove "scaffold checkout" references

3. **Stay page (stay/page.tsx)**
   - Replace "Sprint 1.2 ships..." with hospitality copy
   - Clean booking handoff language

4. **Workshops page (workshops/page.tsx)**
   - Replace "Sprint 1.3 launches..." with workshop copy
   - Focus on guest value, not technical status

5. **Experiences page (experiences/page.tsx)**
   - Replace "Sprint 2.1 upgrades..." with experience copy
   - Remove internal composer link

6. **Contact page (contact/page.tsx)**
   - Replace "Sprint 1.1 keeps contact..." with simple contact copy

7. **All pages**
   - Grep for "Sprint" and "scaffold"
   - Review each instance for public appropriateness

**Acceptance:**
- No sprint numbers in public-facing copy
- No "scaffold-mode" language visible
- Copy reads like a real business, not a tech demo

---

### Sprint SC.4: Visual Polish (Day 2-3)

**Scope:** Ensure professional appearance

**Tasks:**

1. **Review all image sizing**
   - Consistent aspect ratios
   - Proper responsive behavior
   - Check on mobile viewport

2. **Verify Tailwind styles rendering**
   - All custom colors working
   - Shadows and radii applied
   - Typography correct

3. **Check card consistency**
   - Same shadow/border treatment
   - Consistent padding
   - Uniform eyebrow/title hierarchy

4. **Test all routes**
   - No 404s from navigation
   - All detail pages render
   - Dynamic routes work

5. **Verify CTA buttons**
   - All "Book now" / "Register" buttons work
   - Correct destinations
   - Disabled states for unavailable

**Acceptance:**
- Visual consistency across all pages
- No broken styles or layouts
- Professional appearance matching design tokens

---

### Sprint SC.5: Build Verification (Day 3)

**Scope:** Production readiness

**Tasks:**

1. **Run quality gates**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

2. **Test production build**
   ```bash
   pnpm build && pnpm start
   ```

3. **Verify all static pages generated**
   - Check build output
   - Confirm page count matches routes

4. **Browser testing**
   - Chrome, Firefox, Safari (if available)
   - Mobile responsive check

5. **Performance baseline**
   - Note load times
   - Identify obvious bottlenecks

**Acceptance:**
- Clean build with no errors
- All pages render in production mode
- No console errors in browser

---

## Part 4: Implementation Priority

| Priority | Sprint | Est. Effort | Impact |
|----------|--------|-------------|--------|
| P0 | SC.1 Image Integration | 4h | Fixes "flat text" appearance |
| P0 | SC.2 Footer & Nav | 2h | Completes site shell |
| P1 | SC.3 Content Cleanup | 2h | Makes site look professional |
| P2 | SC.4 Visual Polish | 3h | Ensures consistency |
| P2 | SC.5 Build Verify | 1h | Confirms deployability |

**Total estimated effort:** 12 hours

---

## Part 5: Files to Modify

### Core Components
- `components/shared/HeroMedia.tsx` - Add image support
- `components/shared/ImageWithFallback.tsx` - NEW
- `components/stay/UnitCard.tsx` - Wire images
- `components/shop/ShopCatalogClient.tsx` - Wire images
- `components/workshop/WorkshopCard.tsx` - Wire images
- `components/experience/ExperienceCatalog.tsx` - Wire images
- `components/SiteShell.tsx` - Add footer
- `components/SiteFooter.tsx` - NEW
- `components/nav/PrimaryNav.tsx` - Add Shop link

### Pages
- `app/page.tsx` - Update HeroMedia
- `app/shop/page.tsx` - Remove scaffold copy
- `app/stay/page.tsx` - Remove scaffold copy
- `app/workshops/page.tsx` - Remove scaffold copy
- `app/experiences/page.tsx` - Remove scaffold copy, hide assistant link
- `app/contact/page.tsx` - Remove scaffold copy
- `app/layout.tsx` - Add meta tags if needed

---

## Part 6: Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Images don't load due to path issues | HIGH | Test each path in browser dev tools |
| Tailwind classes not compiling | MEDIUM | Clear .next cache, rebuild |
| Breaking existing functionality | MEDIUM | Run all quality gates after changes |
| Missing images for some content | LOW | Fallback gradient already exists |

---

## Part 7: Success Criteria

When this sprint is complete:

1. **Visitor lands on bigbendburro.vcetexas.com and sees:**
   - A styled, professional website
   - Susan's photographs in hero and cards
   - Complete navigation including Shop
   - Footer with contact/copyright

2. **Visitor browses and finds:**
   - Stay catalog with real cabin photos
   - Workshop listings with relevant images
   - Shop products with actual product photos
   - Experience catalog with activity photos

3. **Quality gates pass:**
   - `pnpm lint` - PASS
   - `pnpm typecheck` - PASS
   - `pnpm build` - PASS

4. **No scaffold artifacts:**
   - No "Sprint X.Y" language in public copy
   - No "scaffold-mode" references
   - No internal assistant links exposed

---

## Appendix A: Image Inventory

### Stay Images (4)
| File | Path | For Unit |
|------|------|----------|
| casa-de-la-luna-01.jpg | /images/stay/ | Casa de la Luna |
| mesa-glow-cabin-01.jpg | /images/stay/ | Mesa Glow Cabin |
| ocotillo-lookout-01.jpg | /images/stay/ | Ocotillo Lookout |
| cottonwood-lookout-01.jpg | /images/stay/ | Cottonwood Lookout |

### Workshop Images (2)
| File | Path | For Workshop |
|------|------|--------------|
| dark-sky.jpg | /images/workshops/ | Dark Sky Photography |
| tile-making.jpg | /images/workshops/ | Tile Making Intro |

### Experience Images (4)
| File | Path | For Experience |
|------|------|----------------|
| rio-grande-float-1.jpg | /images/experiences/ | Rio Grande Daybreak Float |
| night-sky-drive-1.jpg | /images/experiences/ | Terlingua Night Sky Drive |
| tile-fire-circle-1.jpg | /images/experiences/ | Terlingua Tile Fire Circle |
| boquillas-story-route-1.jpg | /images/experiences/ | Boquillas Story Route |

### Shop Images (5)
| File | Path | For Product |
|------|------|-------------|
| desert-threshold-print-1.jpg | /shop/ | Desert Threshold Print |
| burro-field-notes-kit-1.jpg | /shop/ | Burro Field Notes Kit |
| night-sky-atlas-poster-1.jpg | /shop/ | Night Sky Atlas Poster |
| mesa-glow-print.jpg | /shop/ | Mesa Glow Print |
| borderlands-postcard-set.jpg | /shop/ | Borderlands Postcard Set |

### Rental Images (2)
| File | Path | For Item |
|------|------|----------|
| kubota-kx040-hero.jpg | /images/rentals/ | Kubota Excavator |
| kubota-kx040-side.jpg | /images/rentals/ | Kubota Excavator (alt) |

---

## Appendix B: CMS Content Files

```
website/cms/
├── activism/updates.json        # Activism feed
├── blog/*.mdx                   # 4 blog posts
├── units/*.json                 # 4 lodging units
├── workshops/*.json             # 2 workshops
├── experiences/*.json           # 4 experiences
├── shop/*.json                  # 7 products (5 with images)
├── rentals/*.json              # 1 rental item
├── equipment/*.json            # 3 equipment items
├── rates/seasonal.json         # Pricing rules
└── pricing/package-rules.json  # Package pricing
```

---

## Appendix C: Quality Gate Commands

```bash
cd "C:\omega_trader\The Burro\website\frontend"

# Lint check
pnpm lint

# Type check
pnpm typecheck

# Build
pnpm build

# Development server
pnpm dev

# Production server (after build)
pnpm start
```

---

**End of Sprint Plan**

*This sprint transforms the Big Bend Burro site from a technically-complete scaffold into a visually-complete, professionally-presented website ready for public visitors.*
