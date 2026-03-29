# The Burro - Custom GPT Setup Guide

**Project:** Big Bend Burro
**GPT Name:** The Burro
**Operators:** Chuck and Susan Bell
**Created:** 2026-03-21

---

## Quick Setup Checklist

### Step 1: Create the GPT
1. Go to https://chat.openai.com/gpts/editor
2. Click "Create a GPT"
3. Switch to "Configure" tab

### Step 2: Basic Information
| Field | Value |
|-------|-------|
| **Name** | The Burro |
| **Description** | Your patient guide to Big Bend Burro - eco-tourism lodging, dark sky experiences, artisan workshops, and desert wisdom. Built for Chuck and Susan. |
| **Profile Picture** | Use image from `The Burro/assets/burro_logo.png` (or generate one) |

### Step 3: Instructions
Copy the ENTIRE contents of `metalminds/GPT_INSTRUCTIONS.md` into the Instructions field.

### Step 4: Knowledge Files
Upload these files IN ORDER (order matters for navigation):

| # | File | Purpose |
|---|------|---------|
| 1 | `metalminds/00_NAVIGATION.md` | **READ FIRST** - routing guide |
| 2 | `metalminds/01_BURRO_IDENTITY.md` | Personality and voice |
| 3 | `metalminds/02_OPERATORS_PROFILE.md` | Chuck & Susan specifics |
| 4 | `metalminds/03_BIG_BEND_REGION.md` | Local knowledge |
| 5 | `metalminds/04_LODGING_STAYS.md` | Glamping and accommodations |
| 6 | `metalminds/05_EXPERIENCES.md` | Workshops, tours, activities |
| 7 | `metalminds/06_EQUIPMENT_RENTAL.md` | Equipment operations |
| 8 | `metalminds/07_SHOP_ARTISAN.md` | Products and artisan goods |
| 9 | `metalminds/08_ACTIVISM_CONSERVATION.md` | Conservation advocacy |
| 10 | `metalminds/09_BUSINESS_OPERATIONS.md` | Pricing, seasonality, metrics |
| 11 | `metalminds/10_CONVERSATION_EXAMPLES.md` | Tone calibration |

**Total: 11 files** (well under 20-file limit)

### Step 5: Conversation Starters
Add these exactly:

```
1. What's happening at the property this week?
2. How do I check workshop registrations?
3. Tell me about our lodging options
4. What should I know about dark sky photography?
```

### Step 6: Capabilities
| Capability | Setting | Reason |
|------------|---------|--------|
| Web Browsing | ON | Current weather, market info |
| DALL-E | OFF | Not needed |
| Code Interpreter | OFF | Not needed |

### Step 7: Actions (Future)
When the website has authenticated APIs:
- Add action for checking bookings
- Add action for equipment reservations
- Add action for workshop registrations

**For now:** No actions needed - Burro operates as a knowledge assistant.

---

## Testing the GPT

### Test Prompts
1. "Good morning Burro, what do I need to know today?"
2. "We have guests arriving Friday - what should I prepare?"
3. "Someone asked about dark sky photography workshops, what do we offer?"
4. "The skid steer needs service - what's the schedule?"
5. "Tell me a joke about desert living"

### Expected Behavior
- Patient, warm, family tone
- Uses Chuck/Susan's names
- Dry West Texas wit, not internet humor
- Step-by-step for technical topics
- Offers to clarify, never rushes

---

## Updating Knowledge

When knowledge needs updating:

1. Edit the relevant metalmind file locally
2. Delete the old version from GPT
3. Upload the new version
4. Test to confirm

**Do NOT delete 00_NAVIGATION.md** - always keep the routing guide.

---

## Troubleshooting

### GPT seems confused about routing
→ Re-upload `00_NAVIGATION.md` first

### GPT forgets personality
→ Check that `01_BURRO_IDENTITY.md` is uploaded

### GPT gives wrong pricing/dates
→ Update `09_BUSINESS_OPERATIONS.md` with current info

### GPT too formal/corporate
→ Review `10_CONVERSATION_EXAMPLES.md` for tone calibration

---

## File Locations

All Custom GPT files are in:
```
C:\omega_trader\The Burro\custom_gpt\
├── CUSTOM_GPT_SETUP.md          # This file
├── metalminds/
│   ├── 00_NAVIGATION.md         # Routing guide
│   ├── 01_BURRO_IDENTITY.md     # Personality
│   ├── 02_OPERATORS_PROFILE.md  # Chuck & Susan
│   ├── 03_BIG_BEND_REGION.md    # Local knowledge
│   ├── 04_LODGING_STAYS.md      # Accommodations
│   ├── 05_EXPERIENCES.md        # Activities
│   ├── 06_EQUIPMENT_RENTAL.md   # Equipment
│   ├── 07_SHOP_ARTISAN.md       # Products
│   ├── 08_ACTIVISM_CONSERVATION.md # Conservation
│   ├── 09_BUSINESS_OPERATIONS.md # Business
│   ├── 10_CONVERSATION_EXAMPLES.md # Tone
│   └── GPT_INSTRUCTIONS.md      # Main instructions
```

---

## When to Update

| Trigger | Action |
|---------|--------|
| New lodging unit added | Update 04_LODGING_STAYS.md |
| New workshop created | Update 05_EXPERIENCES.md |
| New equipment added | Update 06_EQUIPMENT_RENTAL.md |
| Pricing changes | Update 09_BUSINESS_OPERATIONS.md |
| Seasonal shift | Update 09_BUSINESS_OPERATIONS.md |
| Website features change | Update relevant metalmind |

---

*Setup guide created: 2026-03-21*
*For help: Contact RCB*
