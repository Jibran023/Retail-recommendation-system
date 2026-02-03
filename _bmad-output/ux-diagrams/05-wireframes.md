# Wireframes - Retail Recommendation System

**Document Version:** 1.0
**Last Updated:** 2026-02-03
**Author:** Jibran

---

## Table of Contents

1. [Desktop Wireframes](#desktop-wireframes)
2. [Mobile Wireframes](#mobile-wireframes)
3. [Component Wireframes](#component-wireframes)
4. [State Wireframes](#state-wireframes)

---

## Desktop Wireframes

### Homepage Wireframe (Desktop)

```mermaid
graph TB
    subgraph HEADER[" "]
        H1["[🏠 Retail Comparison]    [Home] [Stores] [About]    [EN | اردو]"]
    end

    subgraph HERO[" "]
        H2["    See all store prices in one place    "]
        H3["Compare prices across Imtiaz Supermarket, Chase Plus, Bin Hashim"]
    end

    subgraph SEARCH[" "]
        S1["  🔍   Search for products...  "]
        S2["            Suggested: cooking oil, basmati rice, dairy            "]
    end

    subgraph CATEGORIES[" "]
        C1["  [Cooking Oil]  [Rice & Grains]  [Dairy]  [Beverages]  [Household]  [+]  "]
    end

    subgraph STORES[" "]
        ST1["Comparing prices from:"]
        ST2["  [Imtiaz Supermarket]  [Chase Plus]  [Bin Hashim]  "]
    end

    subgraph RECENT[" "]
        R1["Recent Searches:"]
        R2["  • cooking oil 5kg  • basmati rice  • dairy products  [+ Clear]  "]
    end

    subgraph FOOTER[" "]
        F1["  About  |  Help  |  Contact  |  © 2026  "]
    end

    style HEADER fill:#e3f2fd
    style HERO fill:#c8e6c9
    style SEARCH fill:#fff9c4
    style CATEGORIES fill:#ffe0b2
    style STORES fill:#f3e5f5
    style FOOTER fill:#e0e0e0
```

### Desktop Layout Specifications

**Dimensions:**
- **Breakpoint:** 769px and above
- **Max width:** 1200px (centered)
- **Padding:** 24px左右
- **Header height:** 64px
- **Search bar height:** 56px

**Spacing:**
- **Section spacing:** 48px vertical
- **Card spacing:** 16px gaps
- **Button padding:** 12px 24px

**Typography:**
- **Headline:** 48px, Bold
- **Subhead:** 20px, Regular
- **Body:** 16px, Regular (minimum per WCAG AA)
- **Captions:** 14px, Regular

### Search Results Page (Desktop)

```mermaid
graph TB
    subgraph HEADER[" "]
        H1["[🏠] [Search] [Stores] [About]    [EN | اردو]"]
    end

    subgraph SEARCH_BAR[" "]
        SB["  🔍   cooking oil 5kg                      [X]  "]
    end

    subgraph MAIN_CONTENT[" "]
        subgraph FILTERS[" "]
            F1["FILTERS"]
            F2["Price Range"]
            F3["├─────┬─────┬─────┤"]
            F4["  0  2.5K  5K  "]
            F5["Stores"]
            F6["☑ Imtiaz (23)"]
            F7["☑ Chase Plus (18)"]
            F8["☐ Bin Hashim (15)"]
            F9["Availability"]
            F10["☑ In Stock Only"]
            F11["[Clear All]"]
        end

        subgraph RESULTS[" "]
            R1["56 products found  Sorted: Price (Low-High) ↓"]
            R2["═════════════════════════════════════════════════════════"]
            R3["  PRODUCT: Cooking Oil 5kg - Habib Oil  "]
            R4["  ┌─────────────────────────────────────────────────┐  "]
            R5["  │ 💚 BEST VALUE                                   │  "]
            R6["  │ Chase Plus - PKR 2,650  •  In Stock  •  3.2km  │  "]
            R7["  │ Imtiaz - PKR 2,800        •  In Stock  •  2.5km  │  "]
            R8["  │ Bin Hashim - PKR 2,700    •  In Stock  •  4.1km  │  "]
            R9["  │ [View on Chase Plus] [View on Imtiaz] [View on Bin Hashim] │  "]
            R10[" └─────────────────────────────────────────────────┘  "]
            R11["Updated: 2 hours ago"]
            R12["═════════════════════════════════════════════════════════"]
            R13["  PRODUCT: Basmati Rice 5kg - Guard Rice  "]
            R14["  ┌─────────────────────────────────────────────────┐  "]
            R15["  │ 💚 BEST VALUE                                   │  "]
            R16["  │ Bin Hashim - PKR 1,800   •  In Stock  •  4.1km  │  "]
            R17["  │ Imtiaz - PKR 1,950       •  In Stock  •  2.5km  │  "]
            R18["  │ [View on Bin Hashim] [View on Imtiaz]           │  "]
            R19[" └─────────────────────────────────────────────────┘  "]
        end
    end

    subgraph PAGINATION[" "]
        P1["  ← Previous  [1] [2] [3] ... [10]  Next →  "]
    end

    style HEADER fill:#e3f2fd
    style SEARCH_BAR fill:#fff9c4
    style FILTERS fill:#f5f5f5
    style RESULTS fill:#ffffff
    style R5 fill:#c8e6c9
    style R15 fill:#c8e6c9
```

### Desktop Search Results Layout

**Grid System:**
- **Total columns:** 12
- **Sidebar (filters):** 3 columns (25%)
- **Main content:** 9 columns (75%)
- **Gutter:** 24px

**Filter Panel:**
- **Width:** 280px fixed
- **Position:** Sticky (stays visible while scrolling)
- **Height:** Up to viewport height
- **Overflow:** Auto scrollable

**Results Grid:**
- **Product cards:** Full width (not grid)
- **Card height:** Variable (auto based on content)
- **Spacing:** 16px vertical between cards

---

## Mobile Wireframes

### Homepage Wireframe (Mobile)

```mermaid
graph TB
    subgraph TOP_BAR[" "]
        T1["[🏠]                    Search...        [EN|ur]"]
    end

    subgraph HERO[" "]
        H1["        See all store prices        "]
        H2["      in one place      "]
    end

    subgraph SEARCH[" "]
        S1["   🔍   Search for products...   "]
    end

    subgraph CATEGORIES[" "]
        C1["→ [Cooking Oil] [Rice] [Dairy] →"]
    end

    subgraph STORES[" "]
        ST1["Comparing prices from:"]
        ST2["[Imtiaz] [Chase Plus] [Bin Hashim]"]
    end

    subgraph RECENT[" "]
        R1["Recent Searches:"]
        R2["• cooking oil 5kg"]
        R3["• basmati rice"]
        R4["[Clear History]"]
    end

    subgraph BOTTOM_NAV[" "]
        B1[" [🏠]  [🕐]  [🏪]  [⋮] "]
        B2[" Home  Recent  Stores  More "]
    end

    style TOP_BAR fill:#e3f2fd
    style HERO fill:#c8e6c9
    style SEARCH fill:#fff9c4
    style CATEGORIES fill:#ffe0b2
    style BOTTOM_NAV fill:#424242,,#ffffff
```

### Mobile Layout Specifications

**Dimensions:**
- **Breakpoint:** 320px - 480px
- **Width:** 100% viewport
- **Padding:** 16px左右
- **Top bar height:** 56px
- **Bottom nav height:** 56px

**Touch Targets:**
- **Minimum size:** 44x44px (WCAG AA)
- **Spacing:** 8px between targets
- **Thumb zone:** Bottom nav for primary actions

**Typography:**
- **Headline:** 32px, Bold
- **Subhead:** 18px, Regular
- **Body:** 16px, Regular
- **Buttons:** 16px, Medium

### Search Results Page (Mobile)

```mermaid
graph TB
    subgraph TOP_BAR[" "]
        T1["[←]    🔍 cooking oil 5kg    [✕] [☰]"]
    end

    subgraph SORT_FILTER[" "]
        SF1["[Filters]  Sorted: Price ↓ [Map]"]
    end

    subgraph RESULTS[" "]
        R1["────────────────────────────────────"]
        R2["💚 BEST VALUE"]
        R3["Chase Plus - PKR 2,650"]
        R4["In Stock • 3.2km away"]
        R5["[View on Chase Plus →]"]
        R6[""]
        R7["Imtiaz - PKR 2,800"]
        R8["In Stock • 2.5km away"]
        R9["[View on Imtiaz →]"]
        R10["────────────────────────────────────"]
        R11["[↓ Show more stores]"]
        R12["────────────────────────────────────"]
        R13["💚 BEST VALUE"]
        R14["Bin Hashim - PKR 1,800"]
        R15["In Stock • 4.1km away"]
        R16["[View on Bin Hashim →]"]
        R17["────────────────────────────────────"]
    end

    subgraph BOTTOM_NAV[" "]
        B1[" [🏠]  [🕐]  [🏪]  [⋮] "]
    end

    style TOP_BAR fill:#e3f2fd
    style SORT_FILTER fill:#fff9c4
    style R2 fill:#c8e6c9
    style R13 fill:#c8e6c9
    style BOTTOM_NAV fill:#424242,,#ffffff
```

### Mobile Filter Modal

```mermaid
graph TB
    subgraph HEADER[" "]
        H1["[←] Filters"]
    end

    subgraph CONTENT[" "]
        P1["Price Range"]
        P2["├──────────┬──────────┤"]
        P3["PKR 0     PKR 5,000"]

        P4["Stores"]
        P5["☑ Imtiaz Supermarket (23)"]
        P6["☑ Chase Plus (18)"]
        P7["☐ Bin Hashim (15)"]

        P8["Availability"]
        P9["☑ In Stock Only"]
    end

    subgraph ACTIONS[" "]
        A1["[Clear All]"]
        A2["[Apply 3 filters →]"]
    end

    style HEADER fill:#e3f2fd
    style ACTIONS fill:#c8e6c9
```

---

## Component Wireframes

### Search Bar Component

```mermaid
graph LR
    subgraph DEFAULT["Default State"]
        D1["🔍   Search for products..."]
    end

    subgraph FOCUSED["Focused State"]
        F1["🔍   cooking oil          [✕]"]
        F2["┌─────────────────────────────┐"]
        F3["│ cooking oil 5kg      Habib  │"]
        F4["│ cooking oil 1kg      Habib  │"]
        F5["│ olive oil           Ts      │"]
        F6["└─────────────────────────────┘"]
    end

    subgraph LOADING["Loading State"]
        L1["🔍   cooking oil...     [⏳]"]
    end

    subgraph RESULTS["With Results"]
        R1["🔍   cooking oil          [✕]"]
        R2["56 products found"]
    end

    style DEFAULT fill:#f5f5f5
    style FOCUSED fill:#e3f2fd
    style LOADING fill:#fff9c4
    style RESULTS fill:#c8e6c9
```

### Product Card Component

```mermaid
graph TB
    subgraph CARD["Product Card"]
        P1["═══════════════════════════════════════════"]
        P2["PRODUCT: Cooking Oil 5kg - Habib Oil"]
        P3["─────────────────────────────────────────"]
        P4["💚 BEST VALUE"]
        P5["┌─────────────────────────────────────┐"]
        P6["│ Chase Plus                          │"]
        P7["│ PKR 2,650  •  In Stock  •  3.2km    │"]
        P8["│ [View on Chase Plus Website →]      │"]
        P9["└─────────────────────────────────────┘"]
        P10["Imtiaz - PKR 2,800  •  In Stock  •  2.5km"]
        P11["Bin Hashim - PKR 2,700  •  In Stock  •  4.1km"]
        P12["[↓ Show 3 stores]"]
        P13["─────────────────────────────────────────"]
        P14["Updated: 2 hours ago"]
        P15("═══════════════════════════════════════════")
    end

    subgraph EXPANDED["Expanded State"]
        E1["═══════════════════════════════════════════"]
        E2["PRODUCT: Cooking Oil 5kg - Habib Oil"]
        E3["─────────────────────────────────────────"]
        E4["💚 BEST VALUE"]
        E5["┌─────────────────────────────────────┐"]
        E6["│ Chase Plus                          │"]
        E7["│ PKR 2,650  •  In Stock  •  3.2km    │"]
        E8["│ [View on Chase Plus Website →]      │"]
        E9["│ [ℹ Store Info]                      │"]
        E10["└─────────────────────────────────────┘"]
        E11["┌─────────────────────────────────────┐"]
        E12["│ Imtiaz Supermarket                  │"]
        E13["│ PKR 2,800  •  In Stock  •  2.5km    │"]
        E14["│ [View on Imtiaz Website →]          │"]
        E15["│ [ℹ Store Info]                      │"]
        E16["└─────────────────────────────────────┘"]
        E17["┌─────────────────────────────────────┐"]
        E18["│ Bin Hashim                          │"]
        E19["│ PKR 2,700  •  In Stock  •  4.1km    │"]
        E20["│ [View on Bin Hashim Website →]      │"]
        E21["│ [ℹ Store Info]                      │"]
        E22["└─────────────────────────────────────┘"]
        E23["[↑ Show less]"]
        E24["─────────────────────────────────────────"]
        E25["Updated: 2 hours ago")
        E26("═══════════════════════════════════════════")
    end

    style P4 fill:#c8e6c9
    style E4 fill:#c8e6c9
```

### Filter Pills Component

```mermaid
graph LR
    subgraph FILTER_PILLS["Active Filters"]
        F1["[Price: 1K-5K ✕]"]
        F2["[Stores: Imtiaz, Chase Plus ✕]"]
        F3["[In Stock Only ✕]"]
        F4["[Clear All]"]
    end

    subgraph CATEGORY_PILLS["Categories"]
        C1["[Cooking Oil]"]
        C2["[Rice & Grains]"]
        C3["[Dairy]"]
        C4["[Beverages]"]
        C5["[+]"]
    end

    style F1 fill:#e3f2fd
    style F2 fill:#e3f2fd
    style F3 fill:#e3f2fd
    style F4 fill:#ffebee
```

### Store Card Component

```mermaid
graph TB
    subgraph STORE["Store Card"]
        S1["┌─────────────────────────────────┐"]
        S2["│  [Imtiaz Logo]                  │"]
        S3["│                                  │"]
        S4["│  Imtiaz Supermarket             │"]
        S5["│  📍 2.5km away                  │"]
        S6["│  15 products available          │"]
        S7["│  [View Products →]              │"]
        S8["│  [ℹ More Info]                  │"]
        S9["└─────────────────────────────────┘"]
    end

    subgraph STORE_MODAL["Store Info Modal"]
        M1["┌─────────────────────────────────┐"]
        M2["│  [Imtiaz Logo]          [✕]     │"]
        M3["│                                  │"]
        M4["│  Imtiaz Supermarket             │"]
        M5["│  ─────────────────────────────  │"]
        M6["│  📍 Address:                    │"]
        M7["│     Block 9, Clifton, Karachi   │"]
        M8["│  📞 Phone:                      │"]
        M9["│     021-111-2222                │"]
        M10["│  🕐 Hours:                      │"]
        M11["│     9AM - 10PM (Daily)          │"]
        M12["│                                  │"]
        M13["│  [🗺 Open in Google Maps]       │"]
        M14["│  [✕ Close]                     │"]
        M15["└─────────────────────────────────┘"]
    end
```

---

## State Wireframes

### Loading States

```mermaid
graph TB
    subgraph SEARCH_LOADING["Search Loading"]
        L1["🔍   cooking oil...     "]
        L2["┌─────────────────────────────────┐"]
        L3["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │"]
        L4["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │"]
        L5["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │"]
        L6["└─────────────────────────────────┘"]
        L7["Searching..."]
    end

    subgraph PRODUCT_LOADING["Product Card Loading"]
        P1["┌─────────────────────────────────┐"]
        P2["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │"]
        P3["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                 │"]
        P4["│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                 │"]
        P5["└─────────────────────────────────┘"]
    end

    style L3 fill:#e0e0e0
    style L4 fill:#e0e0e0
    style L5 fill:#e0e0e0
    style P2 fill:#e0e0e0
    style P3 fill:#e0e0e0
    style P4 fill:#e0e0e0
```

### Error States

```mermaid
graph TB
    subgraph NETWORK_ERROR["Network Error"]
        N1["┌─────────────────────────────────┐"]
        N2["│  ⚠️  Connection Error            │"]
        N3["│                                  │"]
        N4["│  You appear to be offline.      │"]
        N5["│  Please check your internet     │"]
        N6["│  connection and try again.      │"]
        N7["│                                  │"]
        N8["│  [🔄 Retry]  [✕] Cancel          │"]
        N9["└─────────────────────────────────┘"]
    end

    subgraph NO_RESULTS["No Results"]
        R1["┌─────────────────────────────────┐"]
        R2["│  🔍  No products found          │"]
        R3["│                                  │"]
        R4["│  We couldn't find any products  │"]
        R5["│  matching 'xyz product name'    │"]
        R6["│                                  │"]
        R7["│  Suggestions:                    │"]
        R8["│  • Check your spelling           │"]
        R9["│  • Try different keywords        │"]
        R10["│  • Browse categories below      │"]
        R11["│                                  │"]
        R12["│  [🔄 Clear Search]              │"]
        R13["└─────────────────────────────────┘"]
    end

    subgraph PARTIAL_FAILURE["Partial Scraping Failure"]
        F1["┌─────────────────────────────────┐"]
        F2["│  ⚠️  Some stores unavailable     │"]
        F3["│                                  │"]
        F4["│  We're having trouble fetching   │"]
        F5["│  prices from Chase Plus.        │"]
        F6["│                                  │"]
        F7["│  Showing prices from:            │"]
        F8["│  ✅ Imtiaz Supermarket           │"]
        F9["│  ✅ Bin Hashim                   │"]
        F10["│  ⚠️  Chase Plus (unavailable)    │"]
        F11["│                                  │"]
        F12["│  [OK, Got It]                   │"]
        F13["└─────────────────────────────────┘"]
    end

    style N1 fill:#ffebee
    style R1 fill:#fff9c4
    style F1 fill:#ffe0b2
```

### Success States

```mermaid
graph TB
    subgraph SEARCH_SUCCESS["Search Success"]
        S1["🔍   cooking oil          [✕]"]
        S2["23 products found  Sorted: Price ↓"]
        S3["─────────────────────────────────────────"]
        S4["💚 BEST VALUE"]
        S5["Chase Plus - PKR 2,650  In Stock  3.2km"]
        S6["[View →]")
        S7["Imtiaz - PKR 2,800  In Stock  2.5km"]
        S8["[View →]"]
    end

    subgraph FILTER_SUCCESS["Filter Applied"]
        F1["56 products found  [Price: 1K-5K ✕] [Stores: 2 ✕]"]
        F2["─────────────────────────────────────────"]
        F3["💚 BEST VALUE"]
        F4["Chase Plus - PKR 2,650  In Stock  3.2km"]
        F5["[View →]"]
    end

    style S4 fill:#c8e6c9
    style F3 fill:#c8e6c9
```

---

## Accessibility Wireframes

### Keyboard Navigation Flow

```mermaid
graph TB
    subgraph TAB_ORDER["Tab Order (Desktop)"]
        T1["[Skip to main content ←]"]
        T2["[Home] [Search] [Stores] [About]"]
        T3["[Language Toggle EN|Urdu]"]
        T4["[Search Input Field]"]
        T5["[Cooking Oil] [Rice] [Dairy] ..."]
        T6["[Imtiaz] [Chase Plus] [Bin Hashim]"]
        T7["[Product Card 1 →]"]
        T8["[View on Store Website 1 →]"]
        T9["[Product Card 2 →]"]
        T10["[← Previous] [1] [2] [3] [Next →]"]
    end

    subgraph FOCUS_INDICATORS["Focus States"]
        F1["Input Field [╳══════════════] ← Focused"]
        F2["Button ╳══════════════════ ← Focused"]
        F3["Link ╳══════════════════ ← Focused"]
    end
```

### Screen Reader Structure

```mermaid
graph TB
    subgraph ARIA["ARIA Labels & Structure"]
        A1["<nav role='navigation' aria-label='Main'>"]
        A2["  <a href='/' aria-label='Home page'>"]
        A3["<main role='main' id='main-content'>"]
        A4["  <h1>Cooking Oil 5kg - Search Results</h1>"]
        A5["  <section aria-label='Product results'>"]
        A6["    <article aria-label='Product 1 of 23'>"]
        A7["      <h2>Cooking Oil 5kg - Habib Oil</h2>"]
        A8["      <ul aria-label='Price comparison'>"]
        A9["        <li>"]
        A10["          Chase Plus: PKR 2,650, In Stock, 3.2km away"]
        A11["          Best Value, View on Chase Plus Website, button"]
        A12["        </li>"]
        A13["      </ul>"]
        A14["    </article>"]
        A15["  </section>"]
        A16["</main>"]
    end
```

---

## Color & Typography Specifications

### Color Palette (MUI Theme)

```mermaid
graph LR
    subgraph PRIMARY["Primary Colors"]
        P1["Primary: #1976d2 - Blue"]
        P2["Light: #42a5f5 - Light Blue"]
        P3["Dark: #1565c0 - Dark Blue"]
        P4["Contrast: #ffffff - White Text"]
    end

    subgraph SECONDARY["Secondary Colors"]
        S1["Best Value: #4caf50 - Green"]
        S2["Warning: #ff9800 - Orange"]
        S3["Error: #f44336 - Red"]
        S4["Background: #ffffff - White"]
    end

    subgraph NEUTRAL["Neutral Colors"]
        N1["Text Primary: #212121 - Almost Black"]
        N2["Text Secondary: #757575 - Gray"]
        N3["Divider: #e0e0e0 - Light Gray"]
        N4["Background: #f5f5f5 - Off White"]
    end
```

### Typography Scale

```mermaid
graph TB
    subgraph TYPOGRAPHY["Typography System"]
        T1["H1: 48px / 56px line-height - Bold"]
        T2["H2: 36px / 44px line-height - Bold"]
        T3["H3: 28px / 36px line-height - Bold"]
        T4["H4: 24px / 32px line-height - Medium"]
        T5["H5: 20px / 28px line-height - Medium"]
        T6["H6: 18px / 24px line-height - Medium"]
        T7["Body 1: 16px / 24px line-height - Regular"]
        T8["Body 2: 14px / 20px line-height - Regular"]
        T9["Caption: 12px / 16px line-height - Regular"]
    end

    T1 -->|Headlines| T2
    T2 --> T3
    T3 -->|Subheadings| T4
    T4 --> T5
    T5 -->|Small headings| T6
    T6 -->|Body text| T7
    T7 --> T8
    T8 -->|Supporting| T9
```

---

## Wireframe Summary

**Responsive Breakpoints:**

| Breakpoint | Width | Device Type | Layout |
|------------|-------|-------------|--------|
| **XS** | 0-359px | Small phones | Single column, stacked |
| **SM** | 360-480px | Phones | Single column, optimized |
| **MD** | 481-768px | Tablets | Two columns possible |
| **LG** | 769px+ | Desktop | Multi-column, sidebar |

**Component Library:**
- **Framework:** MUI v6
- **Styling:** Emotion (CSS-in-JS)
- **Icons:** Material Icons
- **Font:** Roboto (via @fontsource/roboto)

---

## Next Steps

- Convert wireframes to actual React components
- Test on real devices (multiple screen sizes)
- Validate with accessibility tools (axe-core, Lighthouse)
- Test with real users (all 3 personas)

