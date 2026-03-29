# Equipment Rental Operations

## Overview

Public rental inventory now mirrors `website/cms/equipment/*.json`. The retired `website/cms/rentals/` lane should not be treated as canonical.

---

## Available Equipment

### Kubota KX040-4 Mini Excavator
| Attribute | Value |
|-----------|-------|
| Category | Excavator |
| Daily Rate | $450 |
| Weekly Rate | $2,250 |
| Deposit | $2,500 |
| Delivery Fee | $250 within 50 miles |
| Status | Available |

**Key Specs:**
- 40.4 HP Kubota diesel
- 9,039 lb operating weight
- 11 ft 2 in max digging depth
- 18 ft 7 in max reach at ground level

### Sony A7R Night Kit
| Attribute | Value |
|-----------|-------|
| Category | Camera |
| Daily Rate | $95 |
| Deposit | $250 |
| Status | Available |

### Portable Star Tracker Kit
| Attribute | Value |
|-----------|-------|
| Category | Telescope / astrophotography support |
| Daily Rate | $70 |
| Deposit | $180 |
| Status | Available |

### Tile Workshop Tool Pack
| Attribute | Value |
|-----------|-------|
| Category | Craft supplies |
| Daily Rate | $35 |
| Deposit | $75 |
| Status | Reserved |

---

## Rental Requirements

- Valid driver's license for heavy equipment
- Prior heavy-equipment experience recommended for Kubota rentals
- Liability insurance or rental insurance for Kubota operation
- Safety orientation completed at delivery for Kubota rentals

---

## Public Flow

1. Guest browses `/rentals` or `/rentals/[slug]`.
2. Guest submits `/rentals/request`.
3. Operator reviews the quote request.
4. Approved bookings move into the rental lifecycle in the operator dashboard.

---

## Steel Buildings

Steel buildings remain a parallel consultation service at `/steel-buildings`. They are related operationally but are not part of the equipment rental inventory.

*Equipment knowledge aligned with CMS on 2026-03-28 post-mortem*
