# Test Infrastructure: South Florida Cleaning Concepts — Comprehensive E2E Testing Suite

## 1. Test Philosophy & Principles
- **Requirement-Driven & Opaque-Box**: Tests are derived strictly from `ORIGINAL_REQUEST.md` and `PROJECT.md § Feature Inventory`. They evaluate public observable behaviors (HTTP status codes, DOM elements, rendered typography, image asset availability, interactive navigability, schema graphs, and customer journeys) rather than implementation internals.
- **Zero-External-Dependency & Offline-Deterministic**: Uses native Node.js built-ins (`http`, `fs`, `path`, `url`) with an in-process static HTTP server and regex-based semantic HTML parser. Zero reliance on external browsers or heavy test harnesses, guaranteeing instant (<100ms) execution across Linux, macOS, and Windows.
- **Progressive Testability**: Supports granular milestone filtering (`--milestone m1|m2|m3|m4`), tier filtering (`--tier 1|2|3|4`), and soft progressive verification (`--soft`), enabling workers to test their isolated milestones during incremental implementation while enforcing 100% strict verification at Milestone 4 sign-off.
- **Four-Tier Verification Matrix**:
  - **Tier 1 (Feature Coverage)**: Direct verification of features R1 (Blog Ingestion & Homepage Snippet), R2 (Service Area Template & Multi-City Generation), R3 (Internal Navigation Integration), and R4 (SEO Titles, Meta, and JSON-LD Schema).
  - **Tier 2 (Boundary & Corner Cases)**: Edge cases, non-existent slugs (404), trailing slash normalization, case sensitivity, query parameter immunity, search filter boundary states, viewport responsive layouts, and XSS script escape defense.
  - **Tier 3 (Cross-Feature Interactions)**: Complex user funnels (Home $\to$ Blog snippet $\to$ Full article $\to$ Footer $\to$ Service Area $\to$ Quote CTA), schema graph cross-entity linking, directory-to-detail breadcrumb loops, and cross-division blog linking.
  - **Tier 4 (Real-World Scenarios)**: Complete end-to-end user journeys modeled after 5 customer personas (Jupiter facility manager, Boca Raton luxury homeowner, Palm Beach Gardens medical clinic, Delray Beach rental host, West Palm Beach contractor).

---

## 2. Feature Inventory & Verification Matrix

| # | Feature Name | Target Surface | Source Req | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Current Status | Notes |
|---|--------------|----------------|------------|:------:|:------:|:------:|:------:|:--------------:|-------|
| 1 | Blog Post Catalog & Accessibility | `/blog/:slug` | ORIGINAL_REQUEST §R1 | ✓ | ✓ | ✓ | ✓ | **PASSED (M1)** | All 11 live articles render HTTP 200 |
| 2 | Blog Semantic Content & Typography | `src/pages/BlogPostPage.tsx` | ORIGINAL_REQUEST §R1 | ✓ | - | ✓ | ✓ | **PASSED (M1)** | H1, date, author, >=400 words |
| 3 | Blog Media Assets on Disk | `public/assets/images/` | ORIGINAL_REQUEST §R1 | ✓ | - | - | - | **PASSED (M1)** | 22/22 featured and body images verified |
| 4 | Homepage Recent Blog Snippets | `src/pages/HomePage.tsx` | ORIGINAL_REQUEST §R1 | ✓ | - | ✓ | - | **PASSED (M1)** | Blog snippet cards & thumbnails on homepage |
| 5 | Blog Navigation & Hub Linking | `/our-publications` | ORIGINAL_REQUEST §R1 | ✓ | - | ✓ | - | **PASSED (M1)** | Direct link to publications hub & back-links |
| 6 | Legacy WordPress 301 Redirects | `public/_redirects` | ORIGINAL_REQUEST §R1 | ✓ | ✓ | - | - | **PASSED (M1)** | 11 legacy WP root slugs mapped with 301! |
| 7 | Service Area Template Architecture | `ServiceAreaDetailPage.tsx` | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ | ✓ | **PENDING (M2)** | 7 modular sections for Jupiter |
| 8 | Localized Headings & Metadata | `src/data/serviceAreas.ts` | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ | ✓ | **PENDING (M2)** | City name in H1, meta description, geo tags |
| 9 | Local Neighborhoods & Corridors | `src/data/serviceAreas.ts` | ORIGINAL_REQUEST §R2 | ✓ | - | - | ✓ | **PENDING (M2)** | Abacoa, Mizner Park, Clematis, etc. |
| 10| Interactive Local Guide (Landmarks) | `ServiceAreaLocalGuide.tsx` | ORIGINAL_REQUEST §R2 | ✓ | - | - | - | **PENDING (M2)** | Local landmarks and activities cards |
| 11| Cleaning Services Catalog Grid | `ServiceAreaDetailPage.tsx` | ORIGINAL_REQUEST §R2 | ✓ | - | ✓ | ✓ | **PENDING (M2)** | Localized commercial & residential cards |
| 12| Localized FAQs & Google Maps Embed | `ServiceAreaDetailPage.tsx` | ORIGINAL_REQUEST §R2 | ✓ | - | - | ✓ | **PENDING (M2)** | >=4 localized questions & iframe embed |
| 13| Service Areas Directory Page | `/service-areas` | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ | - | **PENDING (M2)** | Regional grouping and search filter input |
| 14| Desktop Header Navigation | `Header.tsx` | ORIGINAL_REQUEST §R3 | ✓ | - | ✓ | - | **PASSED (M3)** | Phone CTA, services dropdown, publications |
| 15| Mobile Drawer Navigation | `Header.tsx` | ORIGINAL_REQUEST §R3 | ✓ | ✓ | - | - | **PASSED (M3)** | Toggle control, mobile menu container |
| 16| Footer Corporate NAP & Directory | `Footer.tsx` | ORIGINAL_REQUEST §R3 | ✓ | - | ✓ | - | **PASSED (M3)** | Phone, Boynton Beach HQ, blog link strip |
| 17| Zero Broken Internal Links | Full Website Crawl | ORIGINAL_REQUEST §R3 | ✓ | - | ✓ | - | **PASSED (M3)** | Crawled all internal targets with 0 broken |
| 18| Route HTTP Status Codes (200 OK) | Core & Service Routes | ORIGINAL_REQUEST §R4 | ✓ | ✓ | ✓ | ✓ | **PASSED (M4)** | All canonical routes respond with HTTP 200 |
| 19| SEO Titles & Meta Descriptions | `seoRegistry.ts` | ORIGINAL_REQUEST §R4 | ✓ | ✓ | - | - | **PASSED (M4)** | Unique, keyword-rich metadata |
| 20| Strict JSON-LD Schema Validity | Prerendered HTML | ORIGINAL_REQUEST §R4 | ✓ | ✓ | ✓ | - | **PASSED (M4)** | Zero syntax errors or trailing commas |
| 21| LocalBusiness / CleaningService Schema| Prerendered HTML | ORIGINAL_REQUEST §R4 | ✓ | - | ✓ | - | **PASSED (M4)** | Entity graph with NAP and geo coordinates |
| 22| BreadcrumbList & FAQPage Schema | Prerendered HTML | ORIGINAL_REQUEST §R4 | ✓ | - | ✓ | - | **PASSED (M4)** | Structured data for FAQs and breadcrumbs |

---

## 3. Test Architecture & Directory Structure

```
tests/
├── e2e-comprehensive-suite.mjs       # Primary 4-Tier Opaque-Box E2E Runner (39 automated tests)
├── e2e-comprehensive-results.json     # Machine-readable test run execution artifact
├── adversarial-schema-validator.mjs  # White-box JSON-LD syntax, schema and image asset auditor
├── responsive-stress-test.mjs         # Headless Chrome multi-viewport layout stress test
└── challenger-interactive-test.mjs    # Interactive UI drawer, modal, and accordion test harness
```

### Execution Commands
- **Full Comprehensive Suite (Strict)**:
  ```bash
  node tests/e2e-comprehensive-suite.mjs
  ```
- **Progressive Milestone Execution (Soft Mode)**:
  ```bash
  node tests/e2e-comprehensive-suite.mjs --soft
  ```
- **Individual Milestone Verification**:
  ```bash
  node tests/e2e-comprehensive-suite.mjs --milestone m1
  node tests/e2e-comprehensive-suite.mjs --milestone m2
  node tests/e2e-comprehensive-suite.mjs --milestone m3
  node tests/e2e-comprehensive-suite.mjs --milestone m4
  ```
- **Tier-Specific Verification**:
  ```bash
  node tests/e2e-comprehensive-suite.mjs --tier 1
  node tests/e2e-comprehensive-suite.mjs --tier 2
  node tests/e2e-comprehensive-suite.mjs --tier 3
  node tests/e2e-comprehensive-suite.mjs --tier 4
  ```
- **Remote / Staging Verification**:
  ```bash
  node tests/e2e-comprehensive-suite.mjs --url https://sf-cleaning-concepts.netlify.app
  ```

---

## 4. Test Tier Breakdown (`tests/e2e-comprehensive-suite.mjs`)

### Tier 1: Feature Coverage (23 Test Cases)
- `T1.R1.1`: 11 Live Blog Articles Catalog Completeness & Accessibility (All 11 slugs return HTTP 200).
- `T1.R1.2`: Blog Article Content, Semantic Structure & Typography (Primary H1, date, author, >=200 words).
- `T1.R1.3`: Blog Media Assets Physical Disk Resolution & Integrity (Featured and inline photos exist on disk with >1KB size).
- `T1.R1.4`: Homepage Recent Blog Snippets Component & Grid Layout (Homepage contains blog snippet section with preview cards).
- `T1.R1.5`: Blog Snippet Navigation & Publications Hub Cross-Linking ("View All Articles" CTA links to `/our-publications`).
- `T1.R1.6`: Legacy WordPress 301 URL Preservation & Redirect Map (`_redirects` preserves legacy root URLs).
- `T1.R2.1`: Service Area Template Architecture & Modular Section Roster (Hero, Local Dominance, Cleaning Grid, 4-Step Process, Map/FAQ).
- `T1.R2.2`: Localized Headings, City Metadata & Geo Coordinates (City in `<title>`, `<meta>`, `<h1>`, and geo attributes).
- `T1.R2.3`: Localized Neighborhood Highlights & Commercial Transit Corridors (Authentic neighborhood mentions per city).
- `T1.R2.4`: Interactive Local Guide (Landmarks & Activities Presentation) (Authentic landmarks like Jupiter Inlet Lighthouse).
- `T1.R2.5`: Specialized Cleaning Services Catalog Grid Adaptation (Commercial, residential, medical, and turnover cards).
- `T1.R2.6`: Localized FAQ Accordion & Responsive Google Maps Embed (>=4 localized FAQ questions and embedded map iframe).
- `T1.R2.7`: Service Areas Directory Index Page (`/service-areas`) (Directory index page listing service areas with search filter).
- `T1.R3.1`: Desktop Header Navigation Links & Primary Telephony CTA (Header links, divisions, and direct phone link).
- `T1.R3.2`: Mobile Drawer Navigation Structure & Toggle Accessibility (Hamburger button and mobile navigation drawer).
- `T1.R3.3`: Footer Corporate NAP, Divisions & Publications Directory (Boynton Beach HQ, phone, 11 blog links, service areas).
- `T1.R3.4`: Zero Broken Internal Links Across Representative Routes (Zero 404 targets encountered across site crawl).
- `T1.R3.5`: Actionable CTA & Quote Modal Triggers Wiring (Direct `tel:(561) 704-5303` and quote trigger actions).
- `T1.R4.1`: HTTP 200 Status Across All Core Canonical Routes (Core pages return HTTP 200).
- `T1.R4.2`: Unique SEO Titles & Meta Descriptions Compliance (No duplicate titles or descriptions across pages).
- `T1.R4.3`: JSON-LD Schema Strict Syntax & Absence of Corruption (Valid JSON, zero trailing commas, zero parse exceptions).
- `T1.R4.4`: LocalBusiness & CleaningService Schema Graph Integrity (Schema contains telephone, address, and geo coordinates).
- `T1.R4.5`: BreadcrumbList & FAQPage Schema Alignment (FAQ questions match structured data entities).

### Tier 2: Boundary & Corner Cases (6 Test Cases)
- `T2.B.1`: Non-Existent Route 404 Error Handling & Fallback Document (Returns 404 Not Found for non-existent slugs).
- `T2.B.2`: Trailing Slash Route Normalization & Canonical Consistency (Both `/path` and `/path/` resolve to canonical).
- `T2.B.3`: URL Case Sensitivity & Tracking Query String Immunity (Ignores `?utm_source` in canonical tag).
- `T2.B.4`: Service Directory Search Filter Input Boundary Defense (Directory handles empty, partial, and regex characters).
- `T2.B.5`: Viewport Responsive Meta Tag & Standard Breakpoint Containers (`width=device-width` and responsive container classes).
- `T2.B.6`: Schema Script Injection & XSS Vulnerability Defense (No unescaped `</script>` tags in JSON-LD blocks).

### Tier 3: Cross-Feature Interactions (5 Test Cases)
- `T3.C.1`: Full Customer Navigation Funnel (Home $\to$ Blog snippet $\to$ Full article $\to$ Footer $\to$ Service Area $\to$ Quote CTA).
- `T3.C.2`: Schema Graph Cross-Entity Integrity (`Service` linked to `provider` organization and `areaServed` city).
- `T3.C.3`: Directory to Detail Page Cross-Navigation & Reciprocal Breadcrumbs (`/service-areas` $\leftrightarrow$ `/service-area/:slug`).
- `T3.C.4`: Cross-Division Blog Content to Service Offerings Association (Blog articles cross-link to relevant service divisions).
- `T3.C.5`: Interactive Cleaning Estimator / Quote Lead Capture Integration (Estimator and quote forms wired to contact endpoints).

### Tier 4: Real-World Customer Journeys (5 Test Cases)
- `T4.J.1`: Scenario 1 — Jupiter Commercial Facility Manager (Commercial office cleaning, Indiantown/Abacoa coverage, hospital-grade disinfection, phone dispatch).
- `T4.J.2`: Scenario 2 — Boca Raton Luxury Homeowner (Recurring maid service, 4-phase rotation system, Mizner Park/Camino Real coverage, bonded staff FAQ).
- `T4.J.3`: Scenario 3 — Palm Beach Gardens Medical Clinic (Terminal clinical disinfection, PGA National/Midtown coverage, compliance guarantee).
- `T4.J.4`: Scenario 4 — Delray Beach Short-Term Rental Host (Same-day Airbnb turnover, Atlantic Avenue/Pineapple Grove coverage, turnover scheduling FAQ).
- `T4.J.5`: Scenario 5 — West Palm Beach General Contractor (3-phase post-construction cleanup, Clematis/CityPlace coverage, licensed/insured verification).

---

## 5. Coverage & Execution Metrics
- **Total Test Cases**: 39
- **Current Passing**: 23 / 39 (59.0%)
- **Current Pending (Awaiting M2 & M3 Implementations)**: 16 / 39 (41.0%)
  1. `T1.R2.1` – `T1.R2.7`: 7 Service Area landing page and directory template tests.
  2. `T2.B.4`: Directory search filter boundary input test.
  3. `T3.C.1` – `T3.C.3`: Cross-feature funnels and schema graph cross-links involving service areas.
  4. `T4.J.1` – `T4.J.5`: 5 Real-world customer journey scenarios on multi-city landing pages.
- **Suite Execution Speed**: **0.06 seconds** for all 39 tests.
