import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serviceAreas } from '../src/data/serviceAreas';
import { BUSINESS_NAP, SERVICES_CATALOG, FAQS_LIST } from '../src/data/siteData';

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

  const serviceBySlug = new Map(SERVICES_CATALOG.map((svc) => [svc.slug, svc]));
  const divisionOrder: { slug: string; label: string }[] = [
    { slug: 'office-cleaning', label: 'Commercial Office Cleaning' },
    { slug: 'medical-office-cleaning', label: 'Medical Office & Healthcare Disinfection' },
    { slug: 'short-term-rentals', label: 'Short-Term Rental & Vacation Rental Turnover' },
    { slug: 'home-maintenance', label: 'Luxury Residential & Home Maintenance (4-Step Rotation System)' },
    { slug: 'post-construction-cleaning', label: 'Post-Construction Cleanup' },
    { slug: 'bars-and-restaurant-cleaning', label: 'Commercial Bar & Restaurant Cleaning' },
    { slug: 'school-cleaning', label: 'School & Daycare Cleaning Services' },
    { slug: 'move-in-out-cleaning', label: 'Move In / Move Out Cleaning Services' },
    { slug: 'home-watching', label: 'Professional Home Watching Services' },
    { slug: 'covid-19-disinfection', label: 'COVID-19 Disinfection & Electrostatic Spraying' }
  ];

  const divisionLines = divisionOrder
    .map(({ slug, label }) => {
      const svc = serviceBySlug.get(slug);
      if (!svc) {
        throw new Error(`Service slug not found in SERVICES_CATALOG: ${slug}`);
      }
      return `- [${label}](https://sfcleaningconcepts.com/service/${svc.slug}): ${svc.fullDesc}`;
    })
    .join('\n');

  return `# ${BUSINESS_NAP.name}

> ${BUSINESS_NAP.name} is a premier commercial janitorial, specialized medical facility disinfection, short-term rental turnover, post-construction cleanup, and luxury residential cleaning service provider operating across 56 communities in Palm Beach, Broward, Miami-Dade, and neighboring Florida counties from Jupiter south to Miami.

## Service Divisions

${divisionLines}

## Geographic Service Areas (56 Municipalities)

Coverage extends across South Florida from Jupiter through Miami, organized into 5 primary regional corridors:

${regionalLines}
- **Full Directory**: [Complete 56 Service Areas Directory](https://sfcleaningconcepts.com/service-areas)

## Company Credentials & Standards

- **Licensing & Insurance**: Fully licensed, insured, and bonded residential and commercial cleaning specialists (${BUSINESS_NAP.legalName}).
- **Love Your Clean or Don’t Pay Guarantee**: ${BUSINESS_NAP.guarantee}
- **Local Reputation**: Rated ${BUSINESS_NAP.ratingScore} stars (${BUSINESS_NAP.reviewCountLabel}) with over 20 years of family-owned care since 2004.
- **Online Booking Offer**: ${BUSINESS_NAP.websiteDiscountHeadline} — ${BUSINESS_NAP.websiteDiscountDetail}
- **Eco-Safe & Color-Coded Supplies**: EPA-registered hospital-grade disinfectants, eco-friendly products safe for kids and pets, and strict color-coded microfiber isolation.
- **Vetted Personnel & Careers**: Background-checked, supervisor-trained local crews. ${BUSINESS_NAP.careersHeadline} ${BUSINESS_NAP.careersDescription}

## Contact & Booking Information

- **Direct Phone**: [${BUSINESS_NAP.phone}](tel:${BUSINESS_NAP.phoneRaw})
- **Email**: [${BUSINESS_NAP.email}](mailto:${BUSINESS_NAP.email})
- **Headquarters**: ${BUSINESS_NAP.addressLocality}, ${BUSINESS_NAP.addressRegion} 33435
- **Online Quote Request**: [Instant Cleaning Quote Form](https://sfcleaningconcepts.com/contact-us#quote)
- **Hours of Operation**: ${BUSINESS_NAP.hours}

## Full Documentation & Structured Data

- [Complete Knowledge Base (llms-full.txt)](https://sfcleaningconcepts.com/llms-full.txt): Comprehensive operational SOPs, detailed protocols for all 10 service divisions, complete demographic and landmark profiles for all 56 municipalities, and FAQs.
- [XML Sitemap](https://sfcleaningconcepts.com/sitemap.xml): Machine-readable XML index of all 85 canonical indexable URLs.
`;
}

export function generateLlmsFullCorpus(): string {
  const serviceBySlug = new Map(SERVICES_CATALOG.map((svc) => [svc.slug, svc]));
  const divisionSpecs: { slug: string; heading: string }[] = [
    { slug: 'office-cleaning', heading: 'Division 1: Commercial Office Cleaning' },
    { slug: 'medical-office-cleaning', heading: 'Division 2: Medical Office & Healthcare Disinfection' },
    { slug: 'short-term-rentals', heading: 'Division 3: Short-Term Rental & Vacation Rental Turnover (Airbnb / VRBO)' },
    { slug: 'home-maintenance', heading: 'Division 4: Luxury Residential & Home Maintenance (4-Step Rotation System)' },
    { slug: 'post-construction-cleaning', heading: 'Division 5: Post-Construction Cleanup' },
    { slug: 'bars-and-restaurant-cleaning', heading: 'Division 6: Commercial Bar & Restaurant Cleaning' },
    { slug: 'school-cleaning', heading: 'Division 7: School & Daycare Cleaning Services' },
    { slug: 'move-in-out-cleaning', heading: 'Division 8: Move In / Move Out Cleaning Services' },
    { slug: 'home-watching', heading: 'Division 9: Professional Home Watching Services' },
    { slug: 'covid-19-disinfection', heading: 'Division 10: COVID-19 Disinfection & Electrostatic Spraying' }
  ];

  const divisionsCorpus = divisionSpecs
    .map(({ slug, heading }) => {
      const svc = serviceBySlug.get(slug);
      if (!svc) {
        throw new Error(`Service slug not found in SERVICES_CATALOG: ${slug}`);
      }
      return `### ${heading}
- **URL**: https://sfcleaningconcepts.com/service/${svc.slug}
- **Overview**: ${svc.fullDesc}
- **Key Features**:
${svc.features.map((f) => `  * ${f}`).join('\n')}
- **Inspection Checklist**:
${svc.checklist.map((c) => `  * ${c}`).join('\n')}
- **Client Benefits**:
${svc.benefits.map((b) => `  * ${b}`).join('\n')}`;
    })
    .join('\n\n');

  let doc = `# ${BUSINESS_NAP.name} — Complete Commercial & Residential Cleaning Knowledge Base

> Comprehensive standard operating procedures, service division specifications, community profiles, and quality standards for ${BUSINESS_NAP.name} across 56 communities in Palm Beach, Broward, Miami-Dade, and neighboring Florida counties.

---

## 1. Corporate Profile & Operational Philosophy

Founded in Boynton Beach in 2004 and family-owned for over 20 years, ${BUSINESS_NAP.name} (${BUSINESS_NAP.legalName}) delivers residential, hospitality, and commercial cleaning across South Florida. Our operations are governed by three core commitments:
1. **Licensed, Insured & Bonded Care**: Every technician is background-checked, insured, bonded, and supervisor-trained—never random gig-app contractors.
2. **Love Your Clean or Don’t Pay Guarantee**: ${BUSINESS_NAP.guarantee} Backed by our 50-point quality inspection checklist.
3. **Eco-Safe Supplies & Color-Coded Microfiber**: EPA-registered hospital-grade disinfectants, kid- and pet-safe solutions, and strict color-coded cloth isolation between restrooms, kitchens, and workstations.

---

## 2. Standard Operating Procedures (SOPs) Across All 10 Service Divisions

${divisionsCorpus}

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

  doc += `## 4. Frequently Asked Questions

${FAQS_LIST.map((faq) => `### Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

---

## 5. Contact & Immediate Dispatch

- **Direct Telephone**: ${BUSINESS_NAP.phone}
- **Email**: ${BUSINESS_NAP.email}
- **Headquarters**: ${BUSINESS_NAP.addressLocality}, ${BUSINESS_NAP.addressRegion} 33435
- **Hours**: ${BUSINESS_NAP.hours}
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
