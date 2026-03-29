# Shop & Artisan Products

## Overview

Big Bend Burro features a curated shop of locally-made and regionally-inspired artisan products. Focus is on items that connect guests to the Big Bend experience and support local makers.

---

## Product Categories

### Handmade Tiles
Susan's signature artisan product.

| Product | Description | Price |
|---------|-------------|-------|
| Desert Scene Tile (4x4) | Hand-painted desert landscape | $35 |
| Ocotillo Design (6x6) | Ocotillo silhouette pattern | $55 |
| Custom Tile Set (4 pcs) | Coordinated design set | $120 |
| Workshop Tile | Made by guest in workshop | Included in workshop |

**Production:**
- Made on-site by Susan
- Each tile unique
- 2-3 week production time for custom orders
- Firing done locally

### Pottery
Hand-thrown and decorated ceramics.

| Product | Description | Price |
|---------|-------------|-------|
| Desert Mug | Big Bend-inspired glaze | $28 |
| Small Planter | Desert plant ready | $45 |
| Serving Bowl | Southwestern design | $65 |

### Photography Prints
Big Bend landscape and dark sky images.

| Product | Description | Price |
|---------|-------------|-------|
| 8x10 Print | Signed photograph | $45 |
| 11x14 Print | Signed, matted | $85 |
| 16x20 Canvas | Gallery wrap | $175 |
| Milky Way Series | 3-print set | $120 |

### Big Bend Merchandise
| Product | Description | Price |
|---------|-------------|-------|
| Burro T-Shirt | Logo design | $28 |
| Dark Sky Cap | Embroidered | $24 |
| Tote Bag | Canvas, logo | $18 |
| Sticker Pack | 5 designs | $8 |

---

## Shipping

### Policy
| Destination | Standard | Expedited |
|-------------|----------|-----------|
| US Domestic | $8.95 | $18.95 |
| Texas (local) | $6.95 | $14.95 |
| International | Quote | Quote |

### Packaging
- Tiles: Bubble wrap + rigid mailer
- Pottery: Double-boxed with padding
- Prints: Flat or rolled tube
- Apparel: Poly mailer

### Handling Time
- Ready items: 1-3 business days
- Custom tiles: 2-3 weeks
- Custom pottery: 3-4 weeks

---

## Guest Pickup

### Option: In-Store Pickup
- Available for all items
- Hold for 7 days after notification
- No shipping cost
- Combine with lodging stay

### Workshop Takeaway
- Tiles from workshop: Take home or ship
- If shipping needed: $15 flat rate

---

## Pricing Strategy

### Markup Guidelines
| Category | Margin |
|----------|--------|
| Handmade (Susan) | 3x materials |
| Partner consignment | 40% commission |
| Merchandise | 2.5x cost |

### Market Context
- Premium artisan market accepts higher prices
- "Made in Big Bend" has value
- Quality over quantity approach

---

## Inventory Management

### Current Tracking
- File-based inventory in `data/shop/`
- Update after each sale
- Low-stock alerts at 3 items

### Reorder Points
| Item Type | Reorder When |
|-----------|-------------|
| Tiles (popular) | < 5 |
| Pottery | < 3 |
| Prints | < 10 |
| Merchandise | < 10 per size |

---

## Checkout Process

### Current Flow (Scaffold Mode)
1. Guest adds items to cart
2. Cart stored locally
3. Checkout form captures info
4. Order saved to `data/shop/orders.json`
5. Manual fulfillment notification
6. Payment processed manually (for now)

### Future Flow (After Stripe Activation)
1. Guest adds items to cart
2. Checkout with Stripe payment
3. Automatic order confirmation email
4. Fulfillment dashboard notification
5. Shipping label generation

---

## Common Questions

**Q: Do you ship internationally?**
A: Yes, but please contact us for a shipping quote first.

**Q: Can I commission a custom tile design?**
A: Absolutely. Contact Susan to discuss your vision.

**Q: Are the prints limited edition?**
A: Each print run is limited to 50. Certificate of authenticity included.

**Q: What if something breaks in shipping?**
A: We'll replace it or refund you. Just send us a photo of the damage.

**Q: Can I see items before buying?**
A: Yes - visit during a stay or schedule a time to browse.

---

*Shop knowledge for The Burro operations*
