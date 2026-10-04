# Black Rose Tattoo — Redesign Plan

Goal: turn the site into a portfolio piece that looks like a premium, custom-built
studio website to a non-technical small-business owner. Keep the existing
images untouched and keep the black + deep-crimson identity, but make
everything sleeker, more modern and more professional.

---

## 1. Where the site stands today

| Area | Current state | Problem |
|---|---|---|
| Home | Only a hero inside a boxed container | Feels empty. Visitors scroll and there's nothing else. Doesn't sell anything. |
| Hero | `hero.png` sits inside the 1200px container with a heavy radial overlay and a big crimson H1 | Not full-bleed, so it looks dated. The overlay darkens the storefront sign, which is the best brand asset, and the H1 repeats the name that's already painted on the wall. |
| Typography | Playfair Display for body text, Cormorant Garamond (bold, 0.85rem) for the nav | Two decorative serifs fight each other. Small Cormorant text is hard to read, and serif body copy at 1.8 line-height feels heavy. |
| Color use | Crimson `#a8182e` used for headings, labels, links and names on near-black | Crimson on black is about 2.6:1 contrast, which fails accessibility for normal text. Too much red also makes it feel less upscale. |
| Gallery | Square cards with `overflow: hidden` and an image at `height: 100%` | **Bug:** the style labels (`<p>Fine Line</p>` etc.) get pushed outside the card and are never visible. |
| Gallery images | `gallery.html` references 9 files (`finelinetattoo.png` … `japanesetattoo.png`) | **These files aren't in the repository.** Only `hero.png` is committed, so the gallery is broken anywhere outside the original Replit. They need to be added (unchanged). |
| Artists | Round headshots, centered text, plain cards | Generic template look. No call to action per artist. |
| Contact | Emoji icons (🕺 📞 🕑), basic 3-field form | Emojis look amateur, and the 🕺 "dancer" emoji is being used for the address. The form doesn't collect what a tattoo shop actually needs. |
| Navigation | Links wrap on mobile, no active-page state, no hamburger | Mobile is the main way customers find a tattoo shop, and the current nav looks broken on phones. |
| Polish | No favicon, meta descriptions, social share image, animations, or focus styles | These are the details that make a site "feel" professional. |

---

## 2. Design direction

**Concept: "Gallery after dark."** Moody, editorial, high contrast. Lots of
black space, big confident type, crimson used sparingly like a neon accent,
and subtle motion. The look should sit between a boutique art gallery and a
luxury barbershop.

### 2.1 Color palette (same identity, refined)

Define everything as CSS custom properties in `:root` so one change re-themes
the whole site. That's also a useful selling point when you reuse this
template for other clients.

```css
:root {
  /* Base: same near-black, now with depth layers */
  --ink:            #0b0809;   /* page background (was #0d0a0a) */
  --surface:        #141011;   /* cards, sections */
  --surface-raised: #1c1517;   /* hover / inputs (was #1a1213) */
  --line:           rgba(239, 230, 225, 0.08);  /* hairline borders (replaces #3a2a2d) */

  /* Text */
  --bone:           #efe6e1;   /* primary text (unchanged) */
  --muted:          #a39597;   /* secondary text: less pink than #c9a0a6, reads more upscale */

  /* Accent: same crimson family */
  --crimson:        #a8182e;   /* buttons, key accents (unchanged) */
  --crimson-bright: #d12a45;   /* hover; small accent text that has to pass contrast */
  --crimson-glow:   rgba(168, 24, 46, 0.35);  /* soft glows behind CTAs/hero */

  /* Optional tiny accent pulled from the warm lights in hero.png */
  --brass:          #c9a46a;   /* stars in reviews, step numbers. Use very sparingly. */
}
```

**Rules for applying it:**
- Headings in **bone white**, not crimson. Crimson goes on one or two words
  per heading at most (for example *"Art that lasts a **lifetime**"*), on
  buttons, active states, small eyebrow labels and thin divider lines.
- Body text in `--bone` and secondary text in `--muted`.
- Every text/background pair should meet WCAG AA (4.5:1).

### 2.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display (H1–H3, logo) | **Cormorant Garamond** 500–600 (kept) | Large sizes only, with tight letter-spacing (-0.01em) at big sizes. Elegant without being heavy. |
| Body, nav, buttons, labels | **Inter** (or Manrope) 400–600 | Replaces Playfair for body text. This one change does more for "modern and professional" than anything else. |
| Optional signature accent | **UnifrakturMaguntia** (blackletter) | Only for the logo wordmark, so it echoes the hand-painted storefront sign. |

- Fluid type scale using `clamp()`. For example, H1 goes from 2.75rem on
  mobile to 6rem on desktop, so it looks right on every screen without
  breakpoint jumps.
- Eyebrow labels (small uppercase text above headings): Inter 600, 0.75rem,
  letter-spacing 0.2em, crimson, for example `— OUR WORK`.
- Load fonts with `<link rel="preconnect">` + `<link>` in the `<head>`
  instead of `@import` in CSS, which is faster.

### 2.3 Layout and spacing system
- 8px spacing scale (`--space-1` to `--space-10`).
- Container max-width 1280px with a fluid gutter (`clamp(1.25rem, 5vw, 3rem)`).
- Generous section padding (`clamp(5rem, 10vw, 9rem)`). White space is what
  makes a site read as expensive.
- Sharper corners: 4–6px radius instead of 12–16px pills and rounded cards.
  Square-ish edges feel more editorial. Buttons become crisp rectangles.

### 2.4 Texture and motion (the "wow" layer)
- **Film-grain overlay:** a very faint SVG noise texture fixed over the page.
  It gives the black a tactile, ink-on-paper feel that suits a tattoo shop.
  Pure CSS, no image file needed.
- **Scroll reveal:** sections and cards fade up and stagger in as you scroll,
  using `IntersectionObserver` (about 20 lines of JS).
- **Hero entrance:** headline lines slide up in sequence on page load, and
  the hero photo does a slow Ken Burns zoom (scale 1.08 → 1 over 8s).
- **Image hovers:** gallery images zoom slightly inside their frame while a
  dark gradient and the label slide up.
- **Animated counters** in the stats strip (0 → 12 years, and so on).
- **Infinite marquee** of tattoo styles: Fine Line ✦ Traditional ✦ Realism ✦ …
- **Header:** transparent over the hero, then turns into a blurred glass bar
  (`backdrop-filter: blur`) with a hairline border once you scroll.
- Everything respects `prefers-reduced-motion`.

---

## 3. Page-by-page plan

### 3.1 Global header
- Logo on the left (optionally blackletter "Black Rose" + small sans "TATTOO
  STUDIO" underneath), nav in the center/right, and a **"Book Now"** button on
  the far right.
- Active-page indicator: thin crimson underline on the current page.
- Animated underline on hover (grows from the center).
- **Mobile:** a hamburger that morphs into an X and opens a full-screen black
  overlay with large staggered serif links and the phone number. This looks
  great in a demo on a client's phone.

### 3.2 Home (`index.html`): becomes a full landing page

1. **Full-bleed hero (100vh)**
   - `hero.png` edge to edge. Replace the radial overlay with a gradient that
     goes dark at the bottom and left, so the painted "Black Rose" sign and the
     neon stay visible.
   - Content anchored bottom-left:
     - Eyebrow: `PORTLAND, OR — CUSTOM TATTOO STUDIO`
     - H1: *"Custom ink, crafted to last a **lifetime**."* (no longer repeats
       the name the photo already shows)
     - Short sub-line from the existing copy
     - Two CTAs: **Book a Consultation** (solid crimson) and **View Our Work**
       (ghost/outline)
   - Bottom-right: small trust badge "★★★★★ 4.9 on Google" (placeholder) and an
     animated scroll indicator.
2. **Style marquee strip:** a thin band with the nine styles scrolling
   endlessly, separated by ✦ (picks up the sparkle motif from the sign).
3. **About / intro (split layout):** left: eyebrow, H2 *"Every piece tells a
   story"*, two short paragraphs. Right: a stats grid with animated numbers
   (Years in business · Resident artists · Tattoos completed · 5★ reviews).
4. **Featured work:** an asymmetric grid of 5–6 gallery images (one large
   tile and several small ones) with hover labels, plus a "View full gallery →"
   link.
5. **The process:** four numbered steps in a row (01 Consult → 02 Custom
   Design → 03 Your Session → 04 Aftercare) with thin connecting lines. This
   tells customers what to expect and is something every client business can
   reuse.
6. **Artists preview:** three portrait cards that link to the Artists page.
7. **Testimonials:** a large serif quote with an auto-advancing slider (3
   placeholder reviews, clearly marked as sample content).
8. **FAQ accordion:** "Do you take walk-ins?", "How much is the deposit?",
   "Minimum age?" (ties into the "Walk-Ins Welcome / No One Under 18" signs in
   the photo), "How do I care for my tattoo?"
9. **Final CTA band:** dark crimson-glow background, *"Ready to start your
   next piece?"* and a booking button.

### 3.3 Gallery (`gallery.html`)
- **Page header banner:** a shorter (40vh) version of the hero treatment with a
  cropped, darkened `hero.png` background, page title, and breadcrumb.
- **Filter chips:** All · Fine Line · Traditional · Realism · Color ·
  Blackwork … Clicking one filters the grid with a smooth fade/scale. Add
  `data-style` attributes to each item.
- **Fix the hidden-label bug:** labels become an overlay positioned inside the
  image (gradient from the bottom) instead of a block below a 100%-height image.
- **Lightbox:** clicking an image opens it full screen with the label, artist
  name, prev/next arrows, keyboard (← → Esc) and swipe support. Vanilla JS,
  no library.
- `loading="lazy"`, plus explicit `width`/`height` so the layout doesn't jump.
- Keep every existing `src`, `alt`, and `object-position`. No image changes.

### 3.4 Artists (`artists.html`)
- Page header banner (same component as Gallery).
- **Editorial cards:** tall 4:5 portrait frames instead of circles, using the
  same Unsplash photos via CSS `object-fit` only. Grayscale by default, fading
  to full color on hover (a classic premium effect).
- Name in large serif, specialties as small outlined "tag" pills, bio, then
  two actions: **Book with Alex** (pre-selects the artist on the contact form
  via `?artist=alex`) and an Instagram icon link.
- Optional: alternating left/right full-width rows instead of a 3-up grid for
  a magazine feel.

### 3.5 Contact / Booking (`contact.html`)
- Page header banner.
- **Two-column layout:**
  - **Left: studio info.** Clean SVG line icons (map pin, phone, clock)
    replace the emojis. The phone number is a `tel:` link. Hours are shown as a
    tidy table with a **live "Open now / Closed" badge** (green or red dot)
    worked out in JS from the visitor's current day and time. Non-technical
    people tend to love this. Embedded dark-styled map (OpenStreetMap or
    Google Maps iframe with a CSS dark filter).
  - **Right: booking form**, upgraded to collect what a real shop needs:
    - Name, Email, Phone
    - Preferred artist (select, pre-filled from `?artist=`)
    - Tattoo style (select), placement, approximate size
    - Description (textarea)
    - Reference images (styled drag-and-drop upload zone, front-end only)
    - "I confirm I am 18+" checkbox
    - Floating labels, crimson focus ring, inline validation messages
  - **Success state:** the form animates out and a check-mark animation and a
    friendly confirmation animate in.
- Optional for a real deployment: wire the form to Formspree or Netlify Forms
  so submissions actually arrive by email. That's a strong selling point for
  clients.

### 3.6 Global footer
- Four columns: brand blurb and social icons · Quick links · Hours · Contact.
- A big faded "BLACK ROSE" wordmark across the bottom as a background flourish.
- Bottom bar: © year, "Demo website — not a real business" (smaller and
  subtler), and **"Designed & built by [Your Business Name]"** linking to your
  site. This turns the demo into lead generation for you.

---

## 4. Professional details clients won't see but will feel

- **SEO:** unique `<title>` and `<meta name="description">` per page, Open
  Graph/Twitter tags using `hero.png` (looks polished when the link is shared
  in a text message), and `LocalBusiness`/`TattooParlor` JSON-LD structured
  data.
- **Favicon:** a small inline SVG rose/✦ mark in crimson. This adds a new file
  and doesn't touch existing images.
- **Accessibility:** skip-to-content link, visible `:focus-visible` rings,
  semantic landmarks, `aria-expanded` on the menu/accordion, AA contrast.
- **Performance:** preconnect fonts, lazy-load below-the-fold images, defer
  JS, and no frameworks. Target 95+ on Lighthouse, which is a concrete number
  to show prospective clients.
- **Selection/scrollbar styling:** crimson text-selection color and a thin dark
  custom scrollbar. These are small touches people notice.
- *(Optional, needs your OK because it changes the image file)*: `hero.png`
  is 2.5 MB. A WebP copy served via `<picture>`, with the original PNG kept as
  the fallback, would make the hero load about 5–10× faster on phones.

---

## 5. File structure (still a plain static site, so Replit setup is unchanged)

```
index.html        # rebuilt landing page
gallery.html      # filters + lightbox
artists.html      # editorial cards
contact.html      # booking form + live hours
style.css         # rewritten: tokens → base → layout → components → pages → utilities
script.js         # NEW: nav/menu, header scroll state, reveal animations,
                  #      counters, marquee, gallery filter + lightbox,
                  #      FAQ accordion, open-now badge, form handling
favicon.svg       # NEW
hero.png          # unchanged
*tattoo.png (x9)  # unchanged; must be committed to the repo
```

---

## 6. Implementation order

1. **Foundation:** design tokens, font swap, base typography, buttons, grain
   overlay, and the new header/footer on all four pages. Fix the mobile nav.
2. **Home page:** hero, marquee, about + stats, featured work, process,
   artists preview, testimonials, FAQ, CTA band.
3. **Gallery:** label bug fix, filter chips, lightbox.
4. **Artists:** editorial cards and per-artist booking links.
5. **Contact:** two-column layout, SVG icons, live hours badge, upgraded
   form, success animation.
6. **Motion and polish:** scroll reveals, counters, hovers, reduced-motion
   support.
7. **SEO, accessibility and performance pass:** meta/OG/JSON-LD, favicon,
   Lighthouse audit, and testing at 375px, 768px, 1280px and 1920px.

---

## 7. Decisions needed before building

1. **Missing gallery images:** the 9 tattoo photos referenced in
   `gallery.html` need to be added to the repo, or the gallery and featured
   work sections will show broken images.
2. **Your business name and URL** for the "Designed & built by" footer credit.
3. **Blackletter logo accent:** yes or no?
4. **Placeholder content** (reviews, stats, FAQ answers): fine to write sample
   copy, clearly marked as demo content?
5. **Hero WebP copy:** OK to add an optimized copy alongside the untouched
   original?
