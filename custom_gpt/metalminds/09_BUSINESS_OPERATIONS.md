# Business Operations

## Seasonal Calendar

### Peak Season (November - April)
| Months | Weather | Demand | Pricing |
|--------|---------|--------|---------|
| Nov-Dec | 60-75°F days, 30-50°F nights | HIGH | 1.2x |
| Jan-Feb | 55-70°F days, 30-45°F nights | MEDIUM | 1.0x |
| Mar-Apr | 70-85°F days, 45-60°F nights | HIGHEST | 1.2x |

**Focus:** All experiences available, maximize bookings

### Shoulder Season (May, September-October)
| Months | Weather | Demand | Pricing |
|--------|---------|--------|---------|
| May | 85-95°F days, 55-70°F nights | MEDIUM | 0.9x |
| Sep-Oct | 80-90°F days, 55-65°F nights | MEDIUM-HIGH | 1.0x |

**Focus:** Transition messaging, morning/evening activities

### Low Season (June - August)
| Months | Weather | Demand | Pricing |
|--------|---------|--------|---------|
| Jun-Aug | 95-105°F days, 70-80°F nights | LOW | 0.7x |

**Focus:** Night experiences ONLY - dark sky, stargazing, evening workshops

---

## Key Metrics

### Visitor Benchmarks (Big Bend NP 2024)
| Metric | Value |
|--------|-------|
| Annual visits | 561,458 |
| Peak month (March) | ~100,315 |
| Low months (Jul-Aug) | ~16,000/month |
| Economic impact | $57M to region |

### Pricing Benchmarks
| Category | Range |
|----------|-------|
| Terlingua lodging ADR | $228/night |
| Premium glamping | $250-350/night |
| Dark sky workshops | $700-8,000/person |
| Tile workshops | $350-600/person |
| Equipment rental (excavator) | $350-550/day |

### Revenue Targets (Planning)
| Stream | % of Total | Notes |
|--------|-----------|-------|
| Lodging | 45% | Core revenue |
| Experiences/Workshops | 20% | High-margin |
| Equipment Rental | 15% | Year-round |
| Steel Buildings | 10% | Brokering/consultation |
| Shop | 10% | Supplemental |

---

## Website Workflows

### Current State: Scaffold Mode
All transaction flows work end-to-end but don't process real payments:
- Booking forms capture info → saved to JSON files
- Shop checkout → order saved, manual fulfillment
- Workshop registration → saved, capacity tracked
- Equipment requests → saved, manual confirmation

### After Activation
- Lodgify handles lodging payments
- Stripe handles shop/workshop payments
- Email confirmations send automatically
- Dashboards show real data

### Current Feature Status (March 2026)

| Feature | Status |
|---------|--------|
| Stay Bookings | Active (manual payment handoff via Lodgify) |
| Workshop Registration | Active (manual payment follow-up) |
| Shop Checkout | Coming Soon (order capture only) |
| Equipment Requests | Active (manual confirmation) |
| Steel Buildings | Active (consultation service) |
| Payment Processing | Prepared (Stripe ready, not activated) |

### Coming Soon Features

All checkout forms display "Coming Soon" badges and payment method stubs showing PayPal, Venmo, Zelle, and Credit Card options. These are visual placeholders indicating future payment capabilities. Currently:
- Shop checkout captures order requests for manual follow-up
- Workshop registration captures interest for manual payment
- Stay booking hands off to Lodgify for payment
- Equipment rental uses quote request process

---

## Operational Checklists

### Daily (During Active Season)
- [ ] Check booking dashboard for arrivals/departures
- [ ] Review any new inquiries
- [ ] Check equipment schedule
- [ ] Monitor weather for guest advisories
- [ ] Respond to messages

### Before Guest Arrival
- [ ] Confirm reservation details
- [ ] Send pre-arrival info (3 days prior)
- [ ] Prepare unit (turnover complete)
- [ ] Check consumables and amenities
- [ ] Verify access instructions work

### After Guest Departure
- [ ] Turnover cleaning
- [ ] Check for damage
- [ ] Restock consumables
- [ ] Send thank-you/review request
- [ ] Log any issues

### Weekly
- [ ] Review upcoming week's schedule
- [ ] Check inventory levels (shop, supplies)
- [ ] Equipment inspection
- [ ] Process any outstanding orders
- [ ] Update availability calendars

### Monthly
- [ ] Revenue review
- [ ] Expense tracking
- [ ] Equipment maintenance
- [ ] Seasonal pricing adjustments
- [ ] Content/photo updates

### Seasonal Transitions
- [ ] Update website messaging
- [ ] Adjust pricing tiers
- [ ] Change featured experiences
- [ ] Update operating hours
- [ ] Prepare for weather shift

---

## Partner Network

### Tier System
| Tier | Revenue Share | Features |
|------|---------------|----------|
| Starter | 15% | Basic listing |
| Standard | 12% | Featured placement |
| Premium | 10% | Priority, cross-promotion |

### Current Partners (Examples)
| Partner | Service | Tier |
|---------|---------|------|
| [Local Outfitter] | River trips | Standard |
| [Guide Service] | Hiking tours | Starter |
| [Photography Pro] | Dark sky workshops | Premium |

### Partner Expectations
- Maintain quality standards
- Communicate availability
- Handle their own liability
- Professional guest interaction

---

## Emergency Procedures

### Medical Emergency
1. Call 911 (limited coverage - have address ready)
2. Administer basic first aid if trained
3. Contact property emergency number
4. Document incident
5. Notify RCB

### Property Emergency (Fire, Major Damage)
1. Ensure guest/personal safety
2. Call 911 if needed
3. Document with photos
4. Contact RCB immediately
5. Do not admit liability

### Weather Emergency
1. Monitor NWS alerts
2. Notify guests of conditions
3. Provide shelter options
4. Do not allow risky activities
5. Document any damage

### Contact List
| Contact | Number | When to Call |
|---------|--------|-------------|
| Emergency | 911 | Life-threatening |
| RCB (Ryan) | [number] | Technical, business |
| Kain | [number] | Family backup |
| Local contact | [number] | On-ground assistance |

---

## Financial Basics

### Payment Processing (After Activation)
| Platform | Use |
|----------|-----|
| Lodgify | Lodging bookings |
| Stripe | Shop, workshops, equipment |

### Tax Considerations
- Texas STR (Short-Term Rental) tax applies
- Collect and remit per local requirements
- Equipment rental may have different treatment
- Consult accountant for specifics

### Record Keeping
- All transactions logged
- Receipts saved
- Mileage tracked
- Maintenance documented

---

## Communication Templates

### Booking Confirmation
> Hi [Name],
>
> Your reservation at Big Bend Burro is confirmed!
>
> **Dates:** [dates]
> **Unit:** [unit name]
> **Guests:** [number]
>
> We'll send arrival details 3 days before your check-in. In the meantime, start planning what to bring - remember, we're 16 miles off pavement!
>
> Questions? Just reply to this email.
>
> See you soon,
> Big Bend Burro

### Pre-Arrival (3 Days Before)
> Hi [Name],
>
> You're almost here! A few things for your trip:
>
> **Getting Here:**
> [GPS coordinates and directions]
>
> **What to Bring:**
> - Drinking water (1 gallon/person/day)
> - Groceries (nearest store is 45 min round trip)
> - Flashlight (it's REALLY dark here)
> - Warm layers for evening
>
> **Cell Service:** Limited to none. We have Starlink WiFi.
>
> **Check-in:** 3:00 PM. [Entry instructions]
>
> Safe travels!

### Post-Stay
> Hi [Name],
>
> Thanks for staying with us at Big Bend Burro. We hope the stars were worth the drive!
>
> If you have a moment, we'd appreciate a review - it helps future guests find us.
>
> Come back anytime. The desert will be here.
>
> [Review link]

---

*Operations knowledge for The Burro*
