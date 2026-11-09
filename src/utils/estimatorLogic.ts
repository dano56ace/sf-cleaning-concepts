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
    sanitizationTier: 'Fresh & Productive Workplace Clean',
    highlights: [
      'Desks, conference tables & lobbies wiped spotless',
      'Deep-filter vacuuming for cleaner, fresher indoor air',
      'Sparkling, sanitized restrooms & breakrooms',
      'All trash & recycling bins emptied and relined'
    ]
  },
  medical: {
    slug: 'medical-office-cleaning',
    title: 'Specialized Medical Office Cleaning',
    baseRatePerSqft: 0.16,
    sqftPerHourPerTech: 850,
    sanitizationTier: 'Hospital-Grade Patient-Safe Sanitization',
    highlights: [
      'Exam tables, chairs & treatment rooms sanitized',
      'Color-coded cloths so bathroom tools never cross over',
      'Welcoming, germ-free waiting room & front desk',
      '100% compliant with Florida healthcare standards'
    ]
  },
  restaurant: {
    slug: 'bars-and-restaurant-cleaning',
    title: 'Commercial Bar & Restaurant Cleaning',
    baseRatePerSqft: 0.15,
    sqftPerHourPerTech: 800,
    sanitizationTier: 'Kitchen Degreasing & Front-of-House Shine',
    highlights: [
      'Heavy-duty kitchen line & tile floor degreasing',
      'Bar wells, speed rails & beer taps sanitized',
      'Spotless dining booths, windows & guest restrooms',
      'Health-inspection ready every single morning'
    ]
  },
  rental: {
    slug: 'short-term-rentals',
    title: 'Short-Term Rental & Airbnb Turnover',
    baseRatePerSqft: 0.14,
    sqftPerHourPerTech: 750,
    sanitizationTier: '5-Star Hotel-Style Guest Turnover',
    highlights: [
      'Guaranteed same-day 10 AM – 4 PM guest turnaround',
      'Fresh laundry + crisp hotel-style bed & towel staging',
      'Sparkling kitchen appliances, dishes & bathrooms',
      'Photo report texted to you as soon as we finish'
    ]
  },
  residential: {
    slug: 'home-maintenance',
    title: 'Comprehensive Home Maintenance',
    baseRatePerSqft: 0.13,
    sqftPerHourPerTech: 850,
    sanitizationTier: '4-Step Rotation Deep Clean (Kid & Pet Safe)',
    highlights: [
      'Full-home clean + rotating deep scrub every visit',
      'Gentle, non-toxic products safe for kids & pets',
      'Baseboards, blinds, ceiling fans & AC vents dusted',
      'Safe, streak-free care for wood, tile & stone floors'
    ]
  },
  construction: {
    slug: 'post-construction-cleaning',
    title: 'Post-Construction Cleanup',
    baseRatePerSqft: 0.22,
    sqftPerHourPerTech: 550,
    sanitizationTier: 'Move-In Ready Remodel & New-Build Polish',
    highlights: [
      'Every speck of fine drywall & sanding dust removed',
      'Window stickers, tape & paint splatters safely cleared',
      'Inside & outside of all new cabinets & drawers wiped',
      'White-glove final polish so you can unpack right away'
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
