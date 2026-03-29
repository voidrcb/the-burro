# Event Launch Checklist

**Purpose:** Verify readiness before opening registration for an annual/seasonal event.

---

## Planning Phase (8+ weeks before)

- [ ] **(blocking)** Event dates confirmed and venue secured - Operator
  - Verify: EventOperation.dateRange and venue fields populated

- [ ] **(blocking)** Budget approved - Operator
  - Verify: Financial plan in event documentation

- [ ] **(blocking)** Partner roles assigned - Operator
  - Verify: EventOperation.partners array populated

- [ ] **(advisory)** Marketing timeline drafted - Operator
  - Verify: Communication schedule planned

---

## Content Preparation (4-6 weeks before)

- [ ] **(blocking)** Event description finalized - Operator
  - Verify: name, tagline, description fields complete

- [ ] **(blocking)** Session schedule complete - Operator
  - Verify: EventOperation.sessions array populated

- [ ] **(blocking)** Pricing tiers configured - Operator
  - Verify: EventOperation.pricingTiers defined

- [ ] **(blocking)** Hero image and gallery uploaded - Operator
  - Verify: heroImageUrl populated

- [ ] **(advisory)** Speaker/presenter bios collected - Operator
  - Verify: sessions[].speakers populated

---

## Registration Setup (2-4 weeks before)

- [ ] **(blocking)** Registration dates set - Operator
  - Verify: registrationOpen and registrationClose configured

- [ ] **(blocking)** Payment integration tested - Operator
  - Verify: Test transaction successful

- [ ] **(blocking)** Confirmation email template reviewed - Operator
  - Verify: Template renders correctly

- [ ] **(blocking)** Capacity limits verified - Operator
  - Verify: capacityTotal matches venue capacity

- [ ] **(advisory)** Waitlist enabled if appropriate - Operator
  - Verify: waitlistEnabled = true

---

## Go-Live (Registration Opens)

- [ ] **(blocking)** Event status transitioned to registration_open - Operator
  - Verify: status = 'registration_open'

- [ ] **(blocking)** Event page accessible - Operator
  - Verify: Public URL loads correctly

- [ ] **(advisory)** Announcement emails sent - System
  - Verify: Postmark delivery confirmed

- [ ] **(advisory)** Social media posts published - Operator
  - Verify: Posts live on all channels

---

## Pre-Event (1 week before)

- [ ] **(blocking)** Attendee list exported - Operator
  - Verify: Registration count matches expected

- [ ] **(blocking)** 7-day reminder scheduled - System
  - Verify: Communication status = 'scheduled'

- [ ] **(blocking)** Partner briefing completed - Operator
  - Verify: All partners confirmed participation

- [ ] **(advisory)** On-site logistics confirmed - Operator
  - Verify: Venue setup, catering, signage ready

- [ ] **(advisory)** Weather contingency reviewed - Operator
  - Verify: Backup plan documented

---

## Event Day

- [ ] **(blocking)** Check-in system ready - Operator
  - Verify: Registration lookup functional

- [ ] **(advisory)** Emergency contacts posted - Operator
  - Verify: Contact sheet visible at venue

- [ ] **(advisory)** Schedule adjustments communicated - Operator
  - Verify: Any last-minute changes announced

---

## Post-Event

- [ ] **(blocking)** Event status set to completed - Operator
  - Verify: status = 'completed'

- [ ] **(advisory)** Post-event survey sent - System
  - Verify: Survey email delivered

- [ ] **(advisory)** Partner payments processed - Operator
  - Verify: Commission payouts completed

- [ ] **(advisory)** Photo gallery published - Operator
  - Verify: galleryUrls populated

---

*Template Version: 1.0*
*Last Updated: 2026-03-19*
