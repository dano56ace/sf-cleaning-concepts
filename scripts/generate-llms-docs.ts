import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serviceAreas } from '../src/data/serviceAreas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

interface RegionDefinition {
  region: string;
  slugs: string[];
}

const REGIONAL_GROUPS: RegionDefinition[] = [
  {
    region: 'Northern Palm Beach County',
    slugs: [
      'jupiter', 'tequesta', 'juno-beach', 'jupiter-inlet-colony',
      'palm-beach-gardens', 'palm-beach-gardens-west', 'north-palm-beach',
      'lake-park', 'riviera-beach', 'palm-beach-shores', 'limestone-creek', 'cabana-colony'
    ]
  },
  {
    region: 'Central Palm Beach County',
    slugs: [
      'west-palm-beach', 'palm-beach', 'lake-worth-beach', 'greenacres',
      'palm-springs', 'atlantis', 'haverhill', 'glen-ridge', 'cloud-lake',
      'mangonia-park', 'lake-clarke-shores', 'century-village', 'golden-lakes',
      'pine-jog', 'schall-circle', 'gun-club-estates', 'san-castle'
    ]
  },
  {
    region: 'Southern Palm Beach County',
    slugs: [
      'boynton-beach', 'delray-beach', 'boca-raton', 'highland-beach',
      'lantana', 'hypoluxo', 'manalapan', 'ocean-ridge', 'south-palm-beach',
      'gulf-stream', 'briny-breezes', 'golf', 'kings-point', 'kenwood-estates'
    ]
  },
  {
    region: 'Western Communities',
    slugs: [
      'wellington', 'royal-palm-beach', 'loxahatchee', 'the-acreage',
      'westlake', 'avenir', 'arden'
    ]
  },
  {
    region: 'Regional Counties',
    slugs: [
      'broward-county', 'miami-dade-county', 'martin-county',
      'st-lucie-county', 'okeechobee-county', 'orange-county'
    ]
  }
];

export function generateLlmsManifest(): string {
  const areaBySlug = new Map(serviceAreas.map(a => [a.slug, a]));

  // Ensure every service area in serviceAreas is represented
  const allGroupedSlugs = new Set(REGIONAL_GROUPS.flatMap(g => g.slugs));
  const unrepresented = serviceAreas.filter(a => !allGroupedSlugs.has(a.slug));
  if (unrepresented.length > 0) {
    throw new Error(`Unrepresented service areas in REGIONAL_GROUPS: ${unrepresented.map(a => a.slug).join(', ')}`);
  }

  const regionalLines = REGIONAL_GROUPS.map(group => {
    const links = group.slugs.map(slug => {
      const area = areaBySlug.get(slug);
      if (!area) {
        throw new Error(`Service area slug not found in serviceAreas: ${slug}`);
      }
      const label = area.slug === 'boynton-beach' ? 'Boynton Beach (Headquarters)' : area.name;
      return `[${label}](https://sfcleaningconcepts.com/service-area/${area.slug})`;
    });
    return `- **${group.region}**: ${links.join(', ')}.`;
  }).join('\n');

  return `# South Florida Cleaning Concepts

> South Florida Cleaning Concepts is a premier commercial janitorial, specialized medical facility disinfection, short-term rental turnover, post-construction cleanup, and luxury residential rotation cleaning service provider operating across 56 municipalities in Palm Beach, Broward, and Miami-Dade counties from Jupiter south to Miami.

## Service Divisions

- [Commercial Office Cleaning](https://sfcleaningconcepts.com/service/office-cleaning): Nightly corporate janitorial, day porter service, executive workstation sanitization, restroom deep sanitizing, touchpoint pathogen mitigation, and commercial HEPA floor care.
- [Medical Office & Healthcare Disinfection](https://sfcleaningconcepts.com/service/medical-office-cleaning): Terminal sterilization, OSHA/CDC/HIPAA-compliant protocols, EPA List N hospital-grade virucides, bloodborne pathogen defense, and non-cross-contamination color-coded microfiber care for surgical, dental, and clinical suites.
- [Short-Term Rental & Vacation Rental Turnover](https://sfcleaningconcepts.com/service/short-term-rentals): Guaranteed same-day 10:00 AM - 4:00 PM turnaround windows, 50-point hospitality staging, hotel-grade linen laundering, and automated photographic damage/supply reporting for Airbnb/VRBO hosts.
- [Luxury Residential Maid Service & Rotation Cleaning](https://sfcleaningconcepts.com/service/home-maintenance): Proprietary 4-Phase Rotation Cleaning System (Kitchens, Bathrooms, Living Areas, Sleeping Quarters), Green Seal certified eco-friendly supplies, and specialized defense against Florida humidity, coastal salt air, and mold intrusion.
- [Post-Construction Cleanup](https://sfcleaningconcepts.com/service/post-construction-cleaning): Comprehensive 3-phase builder transition (Rough Clean, Deep Prep, White-Glove Final Polish) removing fine drywall silica dust, adhesives, paint overspray, and debris for architects and general contractors.
- [Bars & Restaurant Cleaning](https://sfcleaningconcepts.com/service/bars-and-restaurant-cleaning): Commercial kitchen degreasing, dining room floor care, bar well sanitization, and health inspection readiness.
- [School & Daycare Cleaning](https://sfcleaningconcepts.com/service/school-cleaning): Child-safe sanitization, non-toxic germ mitigation, and high-touch playground/classroom disinfection.
- [Move-In / Move-Out Cleaning](https://sfcleaningconcepts.com/service/move-in-out-cleaning): Deep sanitization, appliance interior degreasing, cabinet restoration, and deposit-return guarantee for realtors and residents.
- [Home Watching Services](https://sfcleaningconcepts.com/service/home-watching): Hurricane readiness checks, weekly estate wellness inspections, moisture monitoring, and vendor oversight for seasonal residents.
- [COVID-19 & Pathogen Disinfection](https://sfcleaningconcepts.com/service/covid-19-disinfection): Hospital-grade electrostatic spray application, EPA List N broad-spectrum virucides, and bio-fogging for rapid contamination response.

## Geographic Service Areas (56 Municipalities)

Coverage extends across South Florida from Jupiter through Miami, organized into 5 primary regional corridors:

${regionalLines}
- **Full Directory**: [Complete 56 Service Areas Directory](https://sfcleaningconcepts.com/service-areas)

## Company Credentials & Standards

- **Licensing & Insurance**: Fully licensed Florida commercial cleaning contractor with $2,000,000+ general commercial liability policy and comprehensive surety bonding.
- **100% Satisfaction Guarantee**: If a client is not completely satisfied with any area, our mobile team returns within 24 hours to re-clean at no charge, or the service is free.
- **Green Chemistry & Disinfection**: Exclusively utilizing EPA List N registered hospital-grade disinfectants and Green Seal certified non-toxic, bio-safe cleaning agents.
- **Vetted Personnel**: 100% background-checked, W-2 employed, uniformed, and OSHA 1910.1030 bloodborne pathogen trained cleaning specialists.
- **Experience**: Over 20 years of family-owned and operated commercial janitorial leadership in South Florida.

## Contact & Dispatch Information

- **24/7 Dispatch Phone**: [(561) 704-5303](tel:15617045303)
- **Corporate Email**: [Sflcleaningco@gmail.com](mailto:Sflcleaningco@gmail.com)
- **Headquarters**: Boynton Beach, FL 33435
- **Online Quote Request**: [Instant Cleaning Quote Form](https://sfcleaningconcepts.com/contact-us#quote)
- **Hours of Operation**:
  - Administrative Office: Monday – Friday, 8:00 AM – 6:00 PM EST
  - Cleaning Operations & Mobile Janitorial Teams: 24 Hours / 7 Days a Week / 365 Days a Year

## Full Documentation & Structured Data

- [Complete Knowledge Base (llms-full.txt)](https://sfcleaningconcepts.com/llms-full.txt): Comprehensive operational SOPs, detailed protocols for all 5 service divisions, complete demographic and landmark profiles for all 56 municipalities, commercial FAQs, and certification catalog.
- [XML Sitemap](https://sfcleaningconcepts.com/sitemap.xml): Machine-readable XML index of all 85 canonical indexable URLs.
`;
}

export function generateLlmsFullCorpus(): string {
  let doc = `# South Florida Cleaning Concepts — Complete Commercial & Residential Cleaning Knowledge Base

> Comprehensive technical operating procedures, division specifications, demographic community profiles, and compliance standards for South Florida Cleaning Concepts across 56 municipalities in Palm Beach, Broward, and Miami-Dade counties.

---

## 1. Corporate Profile & Operational Philosophy

Founded in Palm Beach County and family-owned for more than two decades, South Florida Cleaning Concepts is built upon hospital-grade sanitization standards, employee accountability, and transparent commercial partnerships. Our operations are governed by three immovable commitments:
1. **$2,000,000+ Commercial General Liability & Bonding**: Protecting commercial property owners, property managers, healthcare facilities, and luxury estate owners from liability.
2. **100% Satisfaction Guarantee**: Any inspection finding that fails our 50-point cleanliness audit is remedied by a mobile supervisory team within 24 hours at zero additional cost.
3. **Bio-Safe Chemistry & EPA List N Compliance**: Elimination of pathogenic reservoirs using hospital-grade disinfectants without VOCs or harsh residues that compromise indoor air quality.

---

## 2. Standard Operating Procedures (SOPs) Across 5 Core Service Divisions

### Division 1: Commercial Office Cleaning
- **Nightly Janitorial Scope**: Emptying and sanitizing waste receptacles, recycling sorting, electrostatic dust suppression on horizontal surfaces, commercial HEPA multi-stage floor vacuuming, and terminal touchpoint sanitization (keyboards, phone handsets, conference table connectivity boxes, elevator call plates, push-bars).
- **Restroom Terminal Sanitation**: High-pressure washdown, virucidal porcelain bowl descaling, touch-free dispenser servicing, and grout scrubbing using quaternary ammonium disinfectants.
- **Color-Coded Microfiber Protocol**: Strict isolation preventing cross-contamination:
  * Red: Restroom commodes, urinals, and biological containment.
  * Yellow: Restroom counters, sinks, and partition walls.
  * Blue: Interior glass, architectural mirrors, and polished chrome.
  * Green: Food preparation areas, breakrooms, and executive kitchenettes.

### Division 2: Medical Office & Healthcare Disinfection
- **Regulatory Framework**: Fully compliant with OSHA 1910.1030 Bloodborne Pathogen standards, CDC Guideline for Disinfection and Sterilization in Healthcare Facilities, and HIPAA physical privacy standards.
- **Surface Dwell-Time Adherence**: Application of EPA List N broad-spectrum virucides, tuberculocides, and bactericides requiring strict 10-minute wet contact time.
- **Clinical Scope**: Reception triage zones, surgical exam tables, phlebotomy chairs, dental treatment bays, sterile supply rooms, and non-porous antimicrobial flooring.

### Division 3: Short-Term Rental & Vacation Rental Turnover (Airbnb / VRBO)
- **Rapid-Response Turnaround**: Guaranteed turnover between guest check-out (10:00 AM) and incoming guest check-in (4:00 PM).
- **Linen & Towel Laundering**: Commercial off-site or high-temperature sanitizing wash (160°F thermal disinfection) with hypoallergenic detergent.
- **50-Point Hospitality Inspection**: Staging toiletries, inventory verification, appliance inspection (refrigerator, oven, dishwasher, microwave), and high-resolution photographic damage logging uploaded directly to host dashboards.

### Division 4: Luxury Residential Rotation Cleaning
- **4-Phase Deep Rotation System**:
  * Phase A: Kitchen deep scrub, range hood degreasing, backsplash restoration, and cabinet face conditioning.
  * Phase B: Master bathroom scale removal, frameless glass shower door descaling, and grout steam sanitization.
  * Phase C: Living & dining rooms, crown molding dust extraction, and fine furniture conditioning.
  * Phase D: Bedrooms, mattress sanitization, under-bed vacuuming, and baseboard detailing.
- **Sub-Tropical Climate Defense**: Specialized treatment inhibiting mold spore colonization caused by high humidity, coastal salt air neutralizers on metal finishes, and moisture meter checks.

### Division 5: Post-Construction Cleanup
- **Phase 1 (Rough Clean)**: Removal of framing off-cuts, construction trash, protective adhesive tape, and bulk paint spatters.
- **Phase 2 (Deep Prep Clean)**: Industrial HEPA vacuum extraction of ultra-fine drywall silica dust from air returns, ceiling fans, cabinet drawers, and window tracks.
- **Phase 3 (White-Glove Final Polish)**: Microfiber buffing of all plumbing fixtures, luxury stone sealing, zero-streak architectural glazing wash, and floor burnishing for developer turnover.

---

## 3. Geographic Community Profiles (56 Municipalities Extending North Through Jupiter)

`;

  for (const area of serviceAreas) {
    const stats = area.stats;
    const landmarks = area.landmarks || [];
    const thingsToDo = area.thingsToDo || [];
    const neighborhoods = area.neighborhoods || [];
    const corridors = area.keyCorridors || [];
    const industries = area.topIndustries || [];

    doc += `### ${area.name}, FL (${area.slug})\n\n`;
    doc += `- **Canonical URL**: https://sfcleaningconcepts.com/service-area/${area.slug}\n`;
    if (area.geo) {
      doc += `- **GeoCoordinates**: Latitude ${area.geo.latitude}, Longitude ${area.geo.longitude}\n`;
    }
    if (stats) {
      doc += `- **Population:** ${stats.population}\n`;
      doc += `- **Households:** ${stats.households}\n`;
      doc += `- **Land Area:** ${stats.landArea}\n`;
      doc += `- **Commercial Profile:** ${stats.commercialGrowth}\n`;
      if (stats.geographyType) {
        doc += `- **Geography:** ${stats.geographyType}\n`;
      }
    }
    doc += `\n**Community Overview**:\n${area.description}\n\n`;

    if (area.localCopy && area.localCopy.length > 0) {
      doc += `**Local Market Dynamics**:\n${area.localCopy.join('\n\n')}\n\n`;
    }

    if (neighborhoods.length > 0) {
      doc += `- **Key Neighborhoods & Enclaves**: ${neighborhoods.join(', ')}\n`;
    }
    if (corridors.length > 0) {
      doc += `- **Primary Transit & Commercial Corridors**: ${corridors.join(', ')}\n`;
    }
    if (industries.length > 0) {
      doc += `- **Leading Local Commercial Sectors**: ${industries.join(', ')}\n`;
    }

    if (landmarks.length > 0) {
      doc += `\n**Prominent Landmarks**:\n`;
      for (const lm of landmarks) {
        doc += `- **${lm.name}** (${lm.category}): ${lm.description}\n`;
      }
    }

    if (thingsToDo.length > 0) {
      doc += `\n**Local Lifestyle & Activities**:\n`;
      for (const act of thingsToDo) {
        doc += `- **${act.title}** (${act.spot}): ${act.description}\n`;
      }
    }

    doc += `\n---\n\n`;
  }

  doc += `## 4. Frequently Asked Questions (Commercial Cleaning Knowledge Base)

### Q: How do you price commercial cleaning contracts?
A: Commercial pricing is customized based on square footage, frequency (daily, 3x/week, weekly), facility type (general office vs. medical vs. post-construction), flooring composition, and specialized requirements such as day porter coverage or cleanroom terminal sterilization. We provide transparent, no-obligation on-site facility assessments.

### Q: What is the difference between sanitizing and disinfecting?
A: Sanitizing reduces bacterial counts by 99.9% on surfaces to public health safety levels. Disinfecting utilizes EPA-registered chemical formulations to destroy or irreversibly inactivate 99.999% of specified target pathogens (viruses, bacteria, fungi) across verified wet dwell times (typically 5 to 10 minutes).

### Q: How do you guarantee building security during night janitorial shifts?
A: Every cleaning technician is a W-2 employee (never unvetted 1099 sub-contractors) who has passed multi-jurisdictional criminal background checks and drug screenings. Facilities are managed via digital key-tracking lockboxes, alarmed access protocols, and GPS-stamped timekeeping.

### Q: What certifications and insurance do you maintain?
A: We carry $2,000,000+ commercial general liability insurance, full statutory Workers' Compensation coverage, comprehensive janitorial fidelity bonding, and compliance with OSHA Bloodborne Pathogens standard 29 CFR 1910.1030.

---

## 5. Contact & Immediate Commercial Dispatch

- **Direct Telephone**: (561) 704-5303
- **Email**: Sflcleaningco@gmail.com
- **Headquarters**: Boynton Beach, FL 33435
- **Web**: https://sfcleaningconcepts.com
`;

  return doc;
}

export function writeLlmsFiles(): void {
  const manifest = generateLlmsManifest();
  const fullCorpus = generateLlmsFullCorpus();

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), manifest, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), fullCorpus, 'utf-8');
  console.log(`[generate-llms-docs] Successfully generated public/llms.txt (${manifest.length} bytes) and public/llms-full.txt (${fullCorpus.length} bytes)`);

  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), manifest, 'utf-8');
    fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), fullCorpus, 'utf-8');
    console.log(`[generate-llms-docs] Synchronized to dist/llms.txt and dist/llms-full.txt`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeLlmsFiles();
}
