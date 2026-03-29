# Big Bend Burro Enhancement Backlog

**Created:** 2026-03-21
**Purpose:** Prioritized improvements for production deployment, focused on Chuck & Susan (50s-age operators who are NOT tech-savvy)
**Review By:** Minerva (comprehensive review for family deployment)

---

## Priority Tiers

- **P0 - BLOCKING:** Cannot deploy to real operators without these
- **P1 - Launch Critical:** Should be in place for first real guests
- **P2 - Early Operation:** Address in first month of operation
- **P3 - Enhancement:** Nice-to-have improvements
- **P4 - Future Vision:** Long-term roadmap items

---

## P0 - BLOCKING (Must Fix Before Family Use)

### ENH-001: Authentication for Operator Routes
**Status:** NOT STARTED
**Effort:** 1-2 days
**Risk if Skipped:** Anyone on the internet can see booking records, customer data, follow-up drafts

**Description:**
Currently, all `/assistant/*` routes are publicly accessible. This includes:
- `/assistant` - Main dashboard with booking and workshop panels
- `/assistant/equipment` - Equipment scheduler
- `/assistant/itinerary` - Itinerary composer
- `/assistant/rentals` - Rental dashboard
- `/assistant/analytics` - Business analytics
- `/assistant/partners` - Partner management
- `/assistant/events` - Event operations
- `/assistant/tasks` - Task management
- `/assistant/translations` - Translation interface

**Acceptance Criteria:**
- [ ] NextAuth.js installed and configured
- [ ] Login page for operators (Chuck & Susan)
- [ ] Session-based authentication for all `/assistant/*` routes
- [ ] Logout functionality
- [ ] Password reset capability (email-based)
- [ ] Session timeout with warning

**Technical Notes:**
- Recommended: NextAuth.js with CredentialsProvider initially
- Store hashed passwords securely (bcrypt)
- Consider magic link login for simplicity (less password management)

---

### ENH-002: Payment Provider Activation
**Status:** SCAFFOLD-ONLY
**Effort:** 2-3 days
**Risk if Skipped:** Cannot accept real payments

**Description:**
All payment flows are currently scaffold-mode (local capture only):
- Shop checkout captures order locally but does not charge cards
- Lodging booking redirects to Lodgify but no real integration
- Workshop registration confirms but does not collect payment
- Rental deposits not collected

**Acceptance Criteria:**
- [ ] Stripe account configured with production keys
- [ ] Lodgify API credentials for availability sync
- [ ] Test transactions successful on all flows
- [ ] Webhook handlers for payment confirmations
- [ ] Refund handling for cancellations
- [ ] Tax collection where required

**Technical Notes:**
- Stripe: Use Stripe Checkout for simplicity (hosted payment page)
- Lodgify: Use booking widget integration
- Texas STR tax requirements may apply

---

### ENH-003: Real Property Photos
**Status:** PLACEHOLDER IMAGES
**Effort:** 1 day (pending photo collection)
**Risk if Skipped:** Site looks fake/demo, not trustworthy

**Description:**
Current images are Susan's palette photos repurposed as placeholders. The site needs:
- Actual lodging unit photos
- Property grounds and views
- Workshop space images
- Experience/activity photos
- Equipment photos

**Acceptance Criteria:**
- [ ] Each lodging unit has 5+ quality photos
- [ ] Homepage hero uses real property image
- [ ] Experience pages show actual activities
- [ ] All placeholder images replaced
- [ ] Images optimized for web (compressed, responsive sizes)

**Photo Integration Plan for Susan's 7 Photos:**
1. `2865254852305039943.JPG` (Jeep to mountains) - Use for "Getting Here" or experiences
2. `563351913455552699.JPG` (Cholla cactus) - Homepage accent, workshops background
3. `619714753442070768.JPG` (Santa Elena Canyon) - River experiences section
4. `6402042159658353253.JPG` (Winding road) - About page, arrival section
5. `6567172662815848629.JPG` (Kayaker) - River float experience hero
6. `7285160637428274289.JPG` (Slot canyon hiker) - Hiking experiences
7. `7343761061173119617.JPG` (Rio Grande vista) - Homepage hero candidate, footer

---

## P1 - Launch Critical

### ENH-004: Email Notification Integration
**Status:** NOT CONNECTED
**Effort:** 1-2 days
**Risk if Skipped:** Guests don't receive confirmations, Chuck & Susan don't get alerts

**Description:**
All email templates exist but no actual sending occurs:
- Post-stay thank you
- Workshop reminders
- Booking confirmations
- Follow-up drafts
- Activism announcements

**Acceptance Criteria:**
- [ ] Postmark account configured
- [ ] Transactional email templates live
- [ ] Booking confirmation emails sending
- [ ] Workshop reminder emails sending
- [ ] Operator notification for new bookings
- [ ] Bounce/complaint handling

---

### ENH-005: Emergency Contacts Page
**Status:** NOT EXISTS
**Effort:** 0.5 day
**Risk if Skipped:** No quick access to help in emergencies

**Description:**
Chuck & Susan need a simple page with one-click access to:
- Local emergency services (911, nearest hospital)
- Family contacts (RCB for tech support)
- Utility contacts (water delivery, propane)
- Neighbor contacts
- Insurance information

**Acceptance Criteria:**
- [ ] Dedicated `/assistant/emergency` page
- [ ] Large, high-contrast buttons for phone calls
- [ ] Click-to-call functionality
- [ ] Printable version
- [ ] Works offline (service worker cache)

---

### ENH-006: Daily Task Checklist
**Status:** NOT EXISTS
**Effort:** 1 day
**Risk if Skipped:** Operators overwhelmed by dashboard complexity

**Description:**
Simple view showing:
- Arrivals today
- Departures today
- Pending bookings to confirm
- Follow-up drafts to approve
- Workshop sessions happening
- Equipment reservations
- Weather alert summary

**Acceptance Criteria:**
- [ ] `/assistant/today` shows daily summary
- [ ] Large, clear task list format
- [ ] Check-off functionality for completed items
- [ ] Persistent across sessions
- [ ] Email digest option (morning summary)

---

### ENH-007: Accessibility Improvements
**Status:** NOT AUDITED
**Effort:** 1-2 days
**Risk if Skipped:** Chuck & Susan may struggle to read/use the site

**Description:**
Current design optimized for aesthetics, not 70s-age users:
- Font sizes may be too small
- Touch targets may be too small on mobile
- Color contrast not verified
- No large-text mode option

**Acceptance Criteria:**
- [ ] WCAG 2.1 AA compliance verified
- [ ] Minimum 18px body font size
- [ ] Minimum 44px touch targets
- [ ] 4.5:1 color contrast ratio on all text
- [ ] Large text mode toggle in header
- [ ] Skip-to-content links
- [ ] Screen reader testing passed

**Specific Fixes Needed:**
- Increase base font size in `globals.css`
- Add `text-lg` or `text-xl` classes to body content
- Add accessibility toggle button in site header
- Store preference in localStorage

---

## P2 - Early Operation

### ENH-008: Spanish Vocabulary Reference
**Status:** BILINGUAL SYSTEM EXISTS BUT NO PHRASEBOOK
**Effort:** 0.5 day
**Risk if Skipped:** Chuck & Susan cannot communicate basic phrases

**Description:**
The site has bilingual support for guest-facing content, but operators need:
- Common Spanish phrases for greeting guests
- Emergency phrases
- Directional vocabulary
- Numbers and prices
- Food/dietary terms

**Acceptance Criteria:**
- [ ] `/assistant/spanish` reference page
- [ ] Pronunciation guides
- [ ] Audio playback for phrases
- [ ] Printable pocket guide
- [ ] Context categories (greetings, directions, emergencies)

---

### ENH-009: Weather Alerts Integration
**Status:** NOT EXISTS
**Effort:** 1 day
**Risk if Skipped:** Safety risk in desert environment

**Description:**
Big Bend has extreme weather conditions:
- Summer heat warnings (100F+ by late morning)
- Flash flood risks in canyons
- Storm warnings
- Fire danger days

**Acceptance Criteria:**
- [ ] Weather API integration (NWS or similar)
- [ ] Dashboard widget showing current conditions
- [ ] Alert banner for warnings
- [ ] Push notification option
- [ ] Guest-facing weather advisory

---

### ENH-010: Mobile Device Testing
**Status:** NOT VALIDATED
**Effort:** 1 day
**Risk if Skipped:** Site may be unusable on Chuck & Susan's actual devices

**Description:**
Site needs testing on:
- Older iPhones (SE, older models)
- Older iPads
- Low-spec Android tablets
- Slow 3G/LTE connections (Big Bend has poor coverage)

**Acceptance Criteria:**
- [ ] Tested on iPhone SE and similar
- [ ] Tested on older iPad
- [ ] Performance acceptable on 3G connection
- [ ] Offline functionality for critical pages
- [ ] Touch interactions verified

---

### ENH-011: Burro Knowledge Base
**Status:** NO CUSTOM GPT KNOWLEDGE FILES
**Effort:** 2-3 days
**Risk if Skipped:** Burro assistant cannot answer operator questions

**Description:**
The `memory/Burro Knowledge/` folder was created but remains empty. Burro needs:
- Local permit and regulation guides
- Tax guidance for rental income
- Equipment maintenance schedules
- Wildlife safety protocols
- Emergency procedures
- Local vendor/service contacts
- Astronomy basics for dark sky guests

**Acceptance Criteria:**
- [ ] Permit requirements document
- [ ] Texas STR tax guide summary
- [ ] Emergency procedures manual
- [ ] Equipment maintenance checklist
- [ ] Wildlife safety guide
- [ ] Local services directory
- [ ] Dark sky astronomy primer

---

## P3 - Enhancement

### ENH-012: Help Hotline to Family
**Status:** NOT EXISTS
**Effort:** 0.5 day
**Risk if Skipped:** Chuck & Susan stuck when things break

**Description:**
Simple one-click contact to RCB (tech support family member):
- Text message option
- Phone call option
- Pre-formatted problem report
- Screenshot capture

**Acceptance Criteria:**
- [ ] "Get Help" button in header
- [ ] Click-to-text with context
- [ ] Click-to-call option
- [ ] Basic problem categorization

---

### ENH-013: Print-Friendly Booking Summaries
**Status:** NOT EXISTS
**Effort:** 0.5 day
**Risk if Skipped:** Cannot give guests printed confirmation

**Description:**
Chuck & Susan may want to print:
- Booking confirmations
- Workshop schedules
- Guest arrival information
- Emergency contacts
- Daily task lists

**Acceptance Criteria:**
- [ ] Print stylesheet for key pages
- [ ] "Print" button on booking detail
- [ ] Clean formatting without navigation
- [ ] QR code for digital access

---

### ENH-014: Simplified Booking View
**Status:** COMPLEX DASHBOARD
**Effort:** 1 day
**Risk if Skipped:** Operators confused by full CRM complexity

**Description:**
Current assistant dashboard is powerful but complex. Need simplified view:
- "You have 2 guests arriving Friday"
- "3 guests departing Saturday"
- "1 workshop registration pending"
- Large, clear visual format

**Acceptance Criteria:**
- [ ] "Simple view" toggle
- [ ] Card-based upcoming events
- [ ] No technical jargon
- [ ] Color-coded status (green = good, yellow = attention, red = action)

---

### ENH-015: Offline Mode
**Status:** NOT IMPLEMENTED
**Effort:** 2-3 days
**Risk if Skipped:** Site unusable when internet goes down (common in Big Bend)

**Description:**
Big Bend has unreliable connectivity. Critical pages should work offline:
- Today's task list
- Current bookings
- Emergency contacts
- Equipment checklist

**Acceptance Criteria:**
- [ ] Service worker installed
- [ ] Critical pages cached
- [ ] Offline indicator in UI
- [ ] Sync when connection restored
- [ ] Background sync for form submissions

---

## P4 - Future Vision

### ENH-016: Voice Assistant Integration
**Status:** NOT EXISTS
**Effort:** 5+ days
**Risk if Skipped:** None - nice-to-have

**Description:**
Integration with Siri/Google Assistant:
- "Hey Siri, check Burro bookings"
- "What's the weather at the property?"
- "Add milk to shopping list"

**Acceptance Criteria:**
- [ ] Siri Shortcuts support
- [ ] Google Assistant action
- [ ] Voice command documentation

---

### ENH-017: Health/Wellness Reminders
**Status:** NOT EXISTS
**Effort:** 2-3 days
**Risk if Skipped:** None - nice-to-have

**Description:**
Personal wellness tracking for operators:
- Medication reminders
- Hydration alerts (desert heat)
- Activity reminders
- Appointment tracking

**Acceptance Criteria:**
- [ ] Optional wellness module
- [ ] Privacy-first design
- [ ] Push notification support
- [ ] Not visible to guests

---

### ENH-018: Guest Self-Service Portal
**Status:** NOT EXISTS
**Effort:** 3-5 days
**Risk if Skipped:** None - operators can manage manually

**Description:**
Allow guests to:
- View their upcoming bookings
- Download itineraries
- Sign waivers digitally
- Message operators

**Acceptance Criteria:**
- [ ] Guest login system
- [ ] Booking history view
- [ ] Document download
- [ ] Secure messaging

---

## Design Asset Integration Plan

### Susan's 7 Photos - Detailed Integration

**Photo 1: Jeep to Mountains (2865254852305039943.JPG)**
- Primary colors: Purple-blue mountains, tan desert, dark road
- Best for: "night_sky_blue" palette contexts
- Suggested uses:
  - `/experiences` page hero
  - "Getting Here" section background
  - Blog post headers for driving/arrival content

**Photo 2: Cholla Cactus (563351913455552699.JPG)**
- Primary colors: Green cacti, yellow flowers, purple mesa
- Best for: "ocotillo_olive" palette contexts
- Suggested uses:
  - Homepage section accent
  - Workshops page background (craft/nature theme)
  - Shop category headers

**Photo 3: Santa Elena Canyon (619714753442070768.JPG)**
- Primary colors: Purple-gray cliffs, green vegetation, olive water
- Best for: "sage_stone" palette contexts
- Suggested uses:
  - River experiences hero
  - About page (landscape section)
  - Footer background option

**Photo 4: Winding Desert Road (6402042159658353253.JPG)**
- Primary colors: Blue sky, tan desert, golden hour tones
- Best for: "desert_gold" palette contexts
- Suggested uses:
  - Homepage hero candidate
  - Contact/directions page
  - Email header images

**Photo 5: Kayaker in Canyon (6567172662815848629.JPG)**
- Primary colors: Orange canyon walls, blue-green water, orange kayak
- Best for: "canyon_ember" palette contexts
- Suggested uses:
  - Rio Grande float experience hero
  - Activities page accent
  - Summer night experiences promo

**Photo 6: Slot Canyon Hiker (7285160637428274289.JPG)**
- Primary colors: Red-orange canyon walls, golden light, green accent
- Best for: "canyon_ember" palette contexts
- Suggested uses:
  - Hiking experiences section
  - Adventure/exploration theme
  - Blog post headers

**Photo 7: Rio Grande Vista (7343761061173119617.JPG)**
- Primary colors: Stormy purple sky, green vegetation, brown river
- Best for: "storm_sage" palette contexts
- Suggested uses:
  - Homepage hero (dramatic option)
  - Footer background
  - Activism/conservation section

---

## Implementation Timeline Recommendation

### Week 1 (Before ANY Family Use)
- ENH-001: Authentication
- ENH-002: Payment Activation
- ENH-003: Real Photos

### Week 2 (Before Guest Launch)
- ENH-004: Email Integration
- ENH-005: Emergency Contacts
- ENH-006: Daily Task Checklist
- ENH-007: Accessibility Improvements

### Week 3-4 (Early Operation)
- ENH-008: Spanish Vocabulary
- ENH-009: Weather Alerts
- ENH-010: Mobile Testing
- ENH-011: Knowledge Base

### Month 2+
- ENH-012 through ENH-015 based on operator feedback

---

## Technical Debt Notes

1. **Scaffold-mode patterns** - All transaction flows need activation sprint
2. **Design tokens** - Consider adding accessibility variants
3. **CMS structure** - May need simplification for operator editing
4. **Data persistence** - File-based stores fine for MVP, may need DB migration
5. **Build time** - 80 pages generated, monitor as content grows

---

## Family Presentation Notes

**For Chuck & Susan Demo:**
1. Show live site with authentication mock
2. Walk through daily task view
3. Demonstrate booking flow (explain scaffold mode)
4. Show emergency contacts concept
5. Explain photo integration plan
6. Gather feedback on font sizes, touch targets
7. Ask about missing features

**Questions to Ask:**
- What devices will you primarily use?
- How comfortable are you with passwords vs magic links?
- What time of day do you typically check business things?
- Who is your emergency contact for the property?
- Do you have reliable internet at the property?

---

*Backlog Maintained By: Minerva Review*
*Next Review: After P0 items complete*
