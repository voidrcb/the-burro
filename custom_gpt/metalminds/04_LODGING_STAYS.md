# Lodging & Stays

## Overview

Big Bend Burro currently presents two featured bookable lodging units and two soft-launch lookouts. All public lodging pricing comes from `website/cms/rates/seasonal.json` and all unit details come from `website/cms/units/*.json`.

---

## Lodging Units

### Mesa Glow Cabin
| Attribute | Value |
|-----------|-------|
| Type | Cabin |
| Sleeps | 2 adults + 1 child |
| Bath | Private bath |
| Key Amenities | Queen bed, porch seating, solar-backed lighting, cooler and water station |
| Rate | $225-$285/night |
| Status | Available |

### Casa de la Luna
| Attribute | Value |
|-----------|-------|
| Type | Desert cabin |
| Sleeps | 2 adults + 1 child |
| Bath | Private bath |
| Key Amenities | Private bath, solar-backed power, covered outdoor seating, dark-sky viewing deck |
| Rate | $195-$265/night |
| Status | Available |

### Cottonwood Lookout Tent
| Attribute | Value |
|-----------|-------|
| Type | Soft-launch canvas tent |
| Sleeps | 2 |
| Bath | Shared rinse station / shared bath concept |
| Key Amenities | Raised deck, shade structure, camp seating, night-sky orientation |
| Rate | $175-$210/night |
| Status | Coming soon |

### Ocotillo Lookout
| Attribute | Value |
|-----------|-------|
| Type | Soft-launch canvas stay |
| Sleeps | 2 |
| Bath | Shared outdoor rinse station / shared bath concept |
| Key Amenities | Queen bed platform, shade canopy, sunrise-facing deck |
| Rate | $150-$195/night |
| Status | Coming soon |

---

## Check-In and Policies

| Policy | Value |
|--------|-------|
| Check-in | 4:00 PM Central |
| Check-out | 10:00 AM Central |
| Cancellation | Full refund with 14 days notice; manual review for weather exceptions |
| Access | Remote roads require planning before sunset |
| Weather | Heat, wind, dust, and rapid temperature swings are normal |

---

## Seasonal Rates

| Season | Mesa Glow | Casa de la Luna | Cottonwood | Ocotillo |
|--------|-----------|-----------------|------------|----------|
| Spring Peak | $285 | $265 | $210 | $195 |
| Summer Reset | $225 | $195 | $175 | $150 |
| Dark Sky Season | $265 | $245 | $195 | $175 |

Cleaning fees vary by unit and season. Weekly discounts currently range from 8% to 12%.

---

## Booking Flow

### Current Flow
1. Guest views a unit on `/stay` or `/stay/[slug]`.
2. Guest starts the handoff from `/stay/[slug]/book`.
3. Lodgify handles the external booking completion.
4. Pre-arrival reminders follow once the booking is confirmed.

### Reminder Cadence
- Immediate confirmation state
- 7-day logistics reminder
- 1-day final reminder

---

## Guest Expectations

- High-clearance vehicle is strongly recommended.
- Cell coverage is limited.
- Guests should stock up before arrival.
- The night sky is a primary part of the stay, not a side feature.

*Lodging knowledge aligned with CMS on 2026-03-28 post-mortem*
