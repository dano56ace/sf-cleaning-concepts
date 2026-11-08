export type PropertyCategory =
  | 'office'
  | 'medical'
  | 'restaurant'
  | 'rental'
  | 'residential'
  | 'construction';

export type CleaningFrequency =
  | 'nightly'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'onetime';

export interface EstimatorInput {
  category: PropertyCategory;
  sqft: number;
  frequency: CleaningFrequency;
  restrooms: number;
}

export interface EstimatorOutput {
  recommendedServiceSlug: string;
  recommendedServiceTitle: string;
  estimatedCrewSize: number;
  estimatedHoursMin: number;
  estimatedHoursMax: number;
  estimatedVisitRangeMin: number;
  estimatedVisitRangeMax: number;
  frequencyDiscountPercent: number;
  sanitizationTier: string;
  includedHighlights: string[];
}

const CATEGORY_CONFIG: Record<
  PropertyCategory,
  {
    slug: string;
    title: string;
    baseRatePerSqft: number;
    sqftPerHourPerTech: number;
    sanitizationTier: string;
    highlights: string[];
  }
> = {
  office: {
    slug: 'office-cleaning',
    title: 'Office Cleaning Services',
    baseRatePerSqft: 0.11,
    sqftPerHourPerTech: 1200,
    sanitizationTier: 'Corporate HEPA & High-Touch Protocol',
    highlights: [
      'Workstation & conference table microfiber detailing',
      'HEPA-filter particulate vacuuming',
      'Restroom sanitation & odor neutralization',
      'Trash & recycling liner replacement'
    ]
  },
  medical: {
    slug: 'medical-office-cleaning',
    title: 'Specialized Medical Office Cleaning',
    baseRatePerSqft: 0.16,
    sqftPerHourPerTech: 850,
    sanitizationTier: 'OSHA & CDC Terminal Sterilization (EPA List N)',
    highlights: [
      'Exam table & clinical procedure zone sterilization',
      'Color-coded microfiber cross-contamination defense',
      'Waiting area & reception antimicrobial misting',
      'Biohazard & sharps compliance protocol'
    ]
  },
  restaurant: {
    slug: 'bars-and-restaurant-cleaning',
    title: 'Commercial Bar & Restaurant Cleaning',
    baseRatePerSqft: 0.15,
    sqftPerHourPerTech: 800,
    sanitizationTier: 'Food-Safe Enzyme Degreasing & Front-of-House Polish',
    highlights: [
      'Commercial kitchen line & quarry tile enzyme degreasing',
      'Bar well, speed rail & tap sanitization',
      'Dining booth, glass & entry detailing',
      'Health inspection readiness checklist'
    ]
  },
  rental: {
    slug: 'short-term-rentals',
    title: 'Short-Term Rental & Airbnb Turnover',
    baseRatePerSqft: 0.14,
    sqftPerHourPerTech: 750,
    sanitizationTier: '5-Star Hospitality Turnover & Linen Staging',
    highlights: [
      'Same-day 10 AM – 4 PM guaranteed turnover window',
      'Complete linen & towel laundering + hotel staging',
      'Kitchen appliance & glassware sanitization',
      'Timestamped photo verification report for host'
    ]
  },
  residential: {
    slug: 'home-maintenance',
    title: 'Comprehensive Home Maintenance',
    baseRatePerSqft: 0.13,
    sqftPerHourPerTech: 850,
    sanitizationTier: '4-Phase Rotation Cleaning System (Eco-Safe)',
    highlights: [
      '4-Phase deep rotation across kitchen, baths & living areas',
      'Non-toxic child & pet-safe botanical formulas',
      'Baseboard, blind, ceiling fan & AC vent detailing',
      'pH-balanced hardwood, marble & travertine floor care'
    ]
  },
  construction: {
    slug: 'post-construction-cleaning',
    title: 'Post-Construction Cleanup',
    baseRatePerSqft: 0.22,
    sqftPerHourPerTech: 550,
    sanitizationTier: '3-Phase Rough, HEPA Silica Extraction & Final Polish',
    highlights: [
      'Multi-stage HEPA extraction of fine drywall & silica dust',
      'Window sticker, paint & silicone adhesive removal',
      'Custom cabinetry & drawer interior detailing',
      'Final walkthrough buffing for Certificate of Occupancy'
    ]
  }
};

const FREQUENCY_DISCOUNTS: Record<CleaningFrequency, number> = {
  nightly: 25,
  weekly: 20,
  biweekly: 12,
  monthly: 5,
  onetime: 0
};

export function calculateCleaningEstimate(input: EstimatorInput): EstimatorOutput {
  const safeSqft = Math.max(500, Math.min(50000, Math.round(input.sqft || 2500)));
  const safeRestrooms = Math.max(1, Math.min(30, Math.round(input.restrooms || 2)));
  const cfg = CATEGORY_CONFIG[input.category] || CATEGORY_CONFIG.office;
  const discountPercent = FREQUENCY_DISCOUNTS[input.frequency] ?? 0;

  // Determine optimal crew size based on square footage
  let crewSize = 2;
  if (safeSqft >= 12000) {
    crewSize = 5;
  } else if (safeSqft >= 7500) {
    crewSize = 4;
  } else if (safeSqft >= 3500) {
    crewSize = 3;
  }

  // Calculate total person-hours and crew duration
  const restroomPersonHours = safeRestrooms * 0.35;
  const totalPersonHours = safeSqft / cfg.sqftPerHourPerTech + restroomPersonHours;
  const rawCrewHours = totalPersonHours / crewSize;
  const estimatedHoursMin = Math.max(1.5, Math.round(rawCrewHours * 2) / 2);
  const estimatedHoursMax = Math.round((estimatedHoursMin + 1) * 2) / 2;

  // Calculate price range per visit
  const rawBaseCost = safeSqft * cfg.baseRatePerSqft + safeRestrooms * 22;
  const discountedCost = rawBaseCost * (1 - discountPercent / 100);
  const estimatedVisitRangeMin = Math.max(135, Math.round(discountedCost * 0.9 / 5) * 5);
  const estimatedVisitRangeMax = Math.max(
    estimatedVisitRangeMin + 30,
    Math.round(discountedCost * 1.12 / 5) * 5
  );

  return {
    recommendedServiceSlug: cfg.slug,
    recommendedServiceTitle: cfg.title,
    estimatedCrewSize: crewSize,
    estimatedHoursMin,
    estimatedHoursMax,
    estimatedVisitRangeMin,
    estimatedVisitRangeMax,
    frequencyDiscountPercent: discountPercent,
    sanitizationTier: cfg.sanitizationTier,
    includedHighlights: cfg.highlights
  };
}

export function formatPhoneNumberInput(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
