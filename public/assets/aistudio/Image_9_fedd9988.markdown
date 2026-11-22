---
name: Celestial Obsidian
colors:
  surface: '#0f1418'
  surface-dim: '#0f1418'
  surface-bright: '#353a3e'
  surface-container-lowest: '#0a0f13'
  surface-container-low: '#171c20'
  surface-container: '#1b2024'
  surface-container-high: '#262b2f'
  surface-container-highest: '#30353a'
  on-surface: '#dfe3e9'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe3e9'
  inverse-on-surface: '#2c3135'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#0f1418'
  on-background: '#dfe3e9'
  surface-variant: '#30353a'
typography:
  headline-xl:
    fontFamily: Cairo
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 50px
  headline-xl-mobile:
    fontFamily: Cairo
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Cairo
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Cairo
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Cairo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Cairo
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Cairo
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system embodies a luxurious, mystical, and contemplative sanctuary tailored for a premier Arabic horoscope and cosmic navigation experience on modern mobile devices. The visual atmosphere marries deep nocturnal voids with luminous astral talismans. 

- **Audience:** Arabic-speaking astrology seekers, spiritual explorers, and design-conscious mobile users seeking daily clarity, deep natal chart interpretations, and reflective ritual guides.
- **Emotional Resonance:** Quiet luxury, divine tranquility, celestial awe, and reassuring introspection.
- **Design Movement:** Cosmic Glassmorphism blended with Deep Obsidian Minimalism. Interfaces leverage translucent smoked glass, layered deep slate slabs, fine emerald auroras, and delicate starlight accents without visual noise or kitsch.
- **Directionality:** Native right-to-left (RTL) reading architecture where motion paths, balance vectors, and glyph progressions originate seamlessly from right to left.

## Colors
The palette evokes the silence of cosmic depths lit by veiled nebulae and distant stellar fires.

- **Obsidian Dark Foundation:**
  - Base Cosmic Canvas: `#0B1014`
  - Elevated Glass Slab: `#121A1F`
  - Floating Card / Surface: `#18232A`
  - Border Sheen / Astro Wireframe: `rgba(255, 255, 255, 0.08)` to `rgba(16, 185, 129, 0.22)`
- **Mystical Emerald Tiers (Primary Spectrum):**
  - Radiant Pulse (Active / Highlights): `#34D399`
  - Primary Astral Tone: `#10B981`
  - Deep Botanical Matrix (Containers / Badges): `#059669`
  - Shadowed Emerald (Pressed / Muted states): `#047857`
- **Celestial Gold & Champagne (Starlight Accents):**
  - Cosmic Amber (Planetary glyphs, critical transits): `#F59E0B`
  - Champagne Shimmer (Constellation nodes, delicate spark badges): `#FDE68A`
- **Text & Visual Clarity:**
  - High Emphasis / Star White: `#F8FAFC`
  - Medium Emphasis / Moon Silver: `#94A3B8`
  - Muted Inscriptions / Twilight Ash: `#64748B`

## Typography
Typographic rhythm is executed using the contemporary Arabic geometric sans-serif **Cairo**. Cairo balances architectural clarity with classical calligraphic poise, offering open counters and crisp terminal strokes that remain legible against dark, luminous layers.

- **RTL Baseline Alignment:** Text layout strictly adheres to Arabic reading order with line-height ratios calibrated at 1.5x–1.75x font size to accommodate Arabic ascenders, descenders, and optional vocalization marks (*tashkeel*).
- **Hierarchy Rules:** 
  - Celestial headings (`headline-xl`, `headline-lg`) command presence with Bold (700) weight in pristine white (`#F8FAFC`).
  - Natal interpretations and reading passages use `body-lg` and `body-md` in regular weight with deliberate leading to support tranquil, long-form contemplation.
  - Astrological taglines and planetary degrees employ `label-sm` or `label-md` with semi-bold weights for rapid scanning.

## Layout & Spacing
The layout system is tailored for Android mobile form factors, establishing an immersive, full-bleed canvas that prioritizes comfortable thumb-reach zones.

- **Grid Architecture:** A responsive 4-column fluid mobile grid anchored by `margin` (20px on standard handheld displays, shrinking to 16px on compact viewports) with 16px gutters between modular tiles.
- **RTL Spatial Flipping:** Margins, paddings, and alignment mirror automatically. Leading spaces align to the visual right; trailing indicators (e.g., chevron disclosures or astral transit icons) rest on the far left.
- **Rhythm & Safe Areas:** Vertical spacing flows in multiples of 4px and 8px. Top headers accommodate Android status bars and dynamic punch-holes with an extra `space-lg` buffer; bottom navigation floats above system gesture bars with a glass pill container.

## Elevation & Depth
Depth mimics peering through telescope optics into cosmic space:

- **Smoked Glass Translucency:** Primary elevated cards utilize 60%–75% alpha over `#121A1F` combined with a `20px` background blur (`backdrop-filter: blur(20px)`), allowing ethereal planetary graphics or ambient gradients to drift softly beneath.
- **Ethereal Auroral Lighting:** Cards, buttons, and transit selectors feature an ultra-subtle, directional outer glow: `0px 10px 30px -10px rgba(16, 185, 129, 0.15)`. Critical celestial moments (such as New Moon alerts) amplify this aura with a secondary champagne bloom: `0px 0px 24px rgba(245, 158, 11, 0.18)`.
- **Cosmic Filament Outlines:** Elevated surfaces reject flat, heavy solid borders in favor of hairline strokes: `1px solid rgba(255, 255, 255, 0.09)`. On interactive or high-focus containers, this gradient transitions smoothly into an emerald edge: `linear-gradient(135deg, rgba(52, 211, 153, 0.4) 0%, rgba(11, 16, 20, 0.1) 100%)`.

## Shapes
Shapes take inspiration from celestial geometry, planetary orbits, and polished lunar talismans. 

- Pill silhouettes (`roundedness: 3`) dominate interactive elements, floating tabs, and daily astral mood indicators.
- Feature cards, horoscope panels, and zodiac wheel enclosures maintain expansive radii (`rounded-lg` at 32px; `rounded-xl` at 48px) to soften technical astronomical charts into welcoming mystical sanctuaries.
- Small indicators, avatar backplates, and zodiac sigils reside within perfect circles (`rounded-full`).

## Components
- **Pill Buttons:**
  - *Primary:* Filled with vibrant emerald gradient (`#10B981` to `#059669`), text styled in bold Arabic `label-lg` (`#0B1014` or high-contrast white), enclosed in a 9999px pill border with a soft ambient emerald drop shadow.
  - *Secondary / Astral Glass:* Frosted dark slate fill (`rgba(24, 35, 42, 0.7)`), 1px subtle celestial stroke (`rgba(52, 211, 153, 0.3)`), glowing slightly on tap.
- **Horoscope & Natal Cards:**
  - Layered over `#121A1F` with backdrop blur. Top-right accommodates the constellation name and sign in Arabic script, while the top-left houses the champagne gold astronomical symbol. Inner dividers are luminous hairline rules (`rgba(255, 255, 255, 0.06)`).
- **Zodiac Sign Carousel & Chips:**
  - Circular and capsule-shaped glass chips. Selected state triggers a breathing emerald perimeter halo and a subtle champagne gold node highlight. Inactive state rests at low-opacity slate with soft gray Arabic text.
- **RTL Celestial Tabs & Navigation:**
  - Floating bottom navigation pill crafted from blurred obsidian (`rgba(11, 16, 20, 0.85)`). Active tab glows via a soft radial emerald backdrop underneath the golden astral icon, with label transitions moving fluidly right-to-left.
- **Input Fields & Date Selectors:**
  - Birth chart inputs (date, time, birthplace) feature deep slate pill fields with embedded right-aligned celestial icons. Focus states shift borders from muted slate to a distinct `#34D399` halo.
- **Zodiac Wheel & Planetary Orbit Dials:**
  - Bespoke circular dial components displaying Arabic zodiac signs (*Al-Hamal*, *Ath-Thawr*, etc.) arranged in a counter-clockwise cosmological ring, with intersecting golden orbit rings and emerald degree tags.