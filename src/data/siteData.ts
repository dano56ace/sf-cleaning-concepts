export interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  iconName: string;
  features: string[];
  checklist: string[];
  benefits: string[];
}

export interface BlogPostItem {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'commercial' | 'residential' | 'rotation';
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
}

export const BUSINESS_NAP = {
  name: 'South Florida Cleaning Concepts',
  legalName: 'South Florida Cleaning Concepts LLC',
  phone: '(561) 704-5303',
  phoneRaw: '5617045303',
  email: 'Sflcleaningco@gmail.com',
  addressLocality: 'Boynton Beach',
  addressRegion: 'FL',
  addressCountry: 'US',
  priceRange: '$$',
  hours: 'Monday – Sunday: 7:00 AM – 8:00 PM (24/7 Emergency Janitorial Available)',
  areasServed: [
    'Palm Beach County',
    'Broward County',
    'Miami-Dade County',
    'West Palm Beach',
    'Boca Raton',
    'Boynton Beach',
    'Delray Beach',
    'Jupiter',
    'Fort Lauderdale'
  ],
  guarantee: '100% Satisfaction Guaranteed: If you are not completely thrilled with our clean, we return to re-clean for free or you do not pay. It is that simple.'
};

export const TRUST_BADGES = [
  {
    title: '100% Satisfaction Guarantee',
    description: 'If you are not thrilled, you do not pay. We stand 100% behind every clean.',
    icon: 'ShieldCheck'
  },
  {
    title: '20+ Years in South Florida',
    description: 'Family-owned and operated with over two decades of cleaning excellence.',
    icon: 'Award'
  },
  {
    title: 'Vetted & Bonded Staff',
    description: 'Every specialist undergoes rigorous background checks and continuous training.',
    icon: 'UserCheck'
  },
  {
    title: 'Hospital-Grade Disinfection',
    description: 'EPA-registered hospital disinfectants and systematic cross-contamination defense.',
    icon: 'Sparkles'
  }
];

export const ROTATION_SYSTEM_STEPS = [
  {
    step: '1',
    title: 'Initial Deep Scrub',
    description: 'A comprehensive, top-to-bottom deep sanitization establishing our pristine baseline across every room and surface.'
  },
  {
    step: '2',
    title: 'Kitchen & Bath Focus',
    description: 'Intensive degreasing, tile grout acid scrub, appliance detailing, and high-touch pathogen disinfection.'
  },
  {
    step: '3',
    title: 'Sleeping & Living Focus',
    description: 'Deep upholstery extraction, under-furniture vacuuming, baseboards, vents, and detailed dusting.'
  },
  {
    step: '4',
    title: 'Continuous Detailing',
    description: 'Every recurring visit rotates the deep-clean focus so your entire property stays perpetually spotless without extra fees.'
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    slug: 'office-cleaning',
    title: 'Office Cleaning Services',
    shortDesc: 'Comprehensive commercial janitorial cleaning for South Florida corporate offices and professional suites.',
    fullDesc: 'Tailored commercial office cleaning across Palm Beach and Broward County. We provide nightly janitorial services, day porter care, sanitized workstations, lobby detailing, conference room maintenance, and green floor care.',
    image: '/assets/images/services/service-img-12.jpg',
    iconName: 'Building2',
    features: [
      'Nightly and daytime flexible janitorial schedules',
      'HEPA-filter particulate vacuuming for superior indoor air quality',
      'High-touch surface sanitization (keyboards, phones, door handles)',
      'Restroom sanitation with odor elimination systems',
      'Trash removal, recycling management, and relining'
    ],
    checklist: [
      'Empty all wastebaskets and replace liners',
      'Dust and wipe desks, monitors, and telephones with microfiber',
      'Sanitize all light switches, conference room tables, and door pulls',
      'Vacuum all carpeted areas and mop hard-surface flooring with neutral cleaner',
      'Scrub and sanitize restrooms including toilets, urinals, mirrors, and sinks'
    ],
    benefits: [
      'Fewer sick days and higher workforce productivity',
      'Impress clients and visitors with immaculate presentation',
      'Consistent service managed by dedicated supervisor inspections'
    ]
  },
  {
    slug: 'medical-office-cleaning',
    title: 'Specialized Medical Office Cleaning',
    shortDesc: 'OSHA and CDC-compliant medical facility terminal sanitization for clinics, surgical centers, and dental offices.',
    fullDesc: 'Hospital-grade medical office cleaning across South Florida. Our certified healthcare cleaners execute terminal sterilization, pathogen defense protocols, and biohazard compliance to ensure zero cross-contamination.',
    image: '/assets/images/services/service-img-13.jpg',
    iconName: 'ShieldAlert',
    features: [
      'EPA List N hospital-grade disinfectant protocols',
      'Color-coded microfiber and mop heads preventing cross-contamination',
      'Strict adherence to OSHA bloodborne pathogen standards',
      'Exam room detailing and waiting area sterilization',
      'Sterile floor care and medical waste disposal handling'
    ],
    checklist: [
      'Disinfect patient exam tables with hospital-grade antimicrobial agents',
      'Sterilize reception desks, waiting room seating, and check-in counters',
      'Apply electrostatic disinfectant misting in clinical procedure zones',
      'Deep clean and sanitize private consultation offices and restrooms',
      'Replace sharps disposal liners according to regulatory guidelines'
    ],
    benefits: [
      'Prevent healthcare-associated infections (HAIs)',
      '100% compliance with Florida Department of Health standards',
      'Peace of mind for patients, physicians, and clinical staff'
    ]
  },
  {
    slug: 'bars-and-restaurant-cleaning',
    title: 'Commercial Bar & Restaurant Cleaning',
    shortDesc: '24/7 commercial kitchen degreasing, dining room detailing, and health inspection prep for South Florida eateries.',
    fullDesc: 'Commercial bar and restaurant cleaning services in South Florida. We eliminate grease buildup, scrub commercial cooking hoods, sanitize bar wells, pressure wash kitchen mats, and prepare your establishment for flawless health inspections.',
    image: '/assets/images/services/service-img-14.jpg',
    iconName: 'Utensils',
    features: [
      'Nightly post-close deep cleaning schedules',
      'Commercial kitchen floor quarry tile scrubbing & degreasing',
      'Bar well, speed rail, and beer tap area sanitization',
      'Front-of-house dining room floor care, booth dusting, and window shine',
      'Odor neutralization and dumpster pad pressure cleaning'
    ],
    checklist: [
      'Degrease cooking line surfaces, stainless steel backsplashes, and fryers',
      'Power scrub kitchen floors with enzyme-based grease cutting formulas',
      'Disinfect bar tops, speed racks, glass wash stations, and bar mats',
      'Vacuum and mop dining rooms, polish entrance glass, and sanitize menus',
      'Sanitize public and employee restrooms thoroughly'
    ],
    benefits: [
      'Consistently pass health code inspections with top grades',
      'Eliminate slip-and-fall hazards from greasy tile floors',
      'Ensure a pristine dining atmosphere that drives repeat customer reviews'
    ]
  },
  {
    slug: 'short-term-rentals',
    title: 'Short-Term Rental & Airbnb Turnover',
    shortDesc: 'Rapid 5-star turnover cleaning, hotel-grade staging, linen laundering, and guest inventory replenishment.',
    fullDesc: 'Rapid short-term rental and Airbnb turnover cleaning across Palm Beach and Broward counties. We guarantee hotel-standard presentation, luxury linen washing, restock reporting, and same-day turnover turnaround between guest check-outs.',
    image: '/assets/images/services/service-img-15.jpg',
    iconName: 'Home',
    features: [
      'Guaranteed same-day turnover windows (10 AM - 4 PM)',
      'Complete linen and towel laundering with fresh luxury staging',
      'Photo inspection reporting sent directly to host dashboard',
      'Restock of toiletries, coffee, paper goods, and welcome amenities',
      'Deep patio, pool deck, and barbecue grill detailing'
    ],
    checklist: [
      'Strip, launder, and stage all bed linens and bathroom towels',
      'Sanitize kitchen appliances, wipe microwave inside/out, empty fridge',
      'Scrub bathroom showers, tubs, sinks, mirrors, and toilets',
      'Wipe down all light switches, remotes, thermostat, and door knobs',
      'Perform detailed staging check and document property condition'
    ],
    benefits: [
      'Achieve and maintain Airbnb Superhost and VRBO Premier Host status',
      'Zero cancellation risk due to cleanliness complaints',
      'Hands-off automated turnover management for busy property owners'
    ]
  },
  {
    slug: 'post-construction-cleaning',
    title: 'Post-Construction Cleanup',
    shortDesc: '3-phase rough, deep, and final polish cleaning for South Florida general contractors and luxury renovations.',
    fullDesc: 'Comprehensive post-construction cleaning for builders, architects, and luxury homeowners in South Florida. We remove construction debris, extract airborne drywall dust, scrape paint and silicone from glass, and deliver move-in ready perfection.',
    image: '/assets/images/services/service-img-16.jpg',
    iconName: 'HardHat',
    features: [
      'Rough clean: Heavy debris removal, initial sweeping, and framing clearance',
      'Deep clean: Drywall dust filtration, fixture polishing, and cabinet interior wipedown',
      'Final polish: Window label removal, glass buffing, and mirror gleam',
      'High-filtration HEPA vacuuming capturing micro-fine silica dust',
      'Fully insured with comprehensive liability coverage for high-end finishes'
    ],
    checklist: [
      'Remove all stickers, protective film, and tape from windows and fixtures',
      'Wipe inside and outside of all custom cabinetry, drawers, and closets',
      'Scrub tile, grout, and marble surfaces with manufacturer-approved agents',
      'Detail all trim, baseboards, door frames, switch plates, and vents',
      'Perform final touch-up dusting immediately prior to owner walkthrough'
    ],
    benefits: [
      'Speed up certificate of occupancy (CO) approvals',
      'Protect delicate marble, hardwood, and custom architectural finishes',
      'Present custom renovations in their absolute best light'
    ]
  },
  {
    slug: 'move-in-out-cleaning',
    title: 'Move In / Move Out Cleaning Services',
    shortDesc: 'Top-to-bottom deep sanitization guaranteeing full security deposit returns and fresh beginnings.',
    fullDesc: 'Detailed move-in and move-out cleaning in Palm Beach and Broward County. We deep-clean every square inch of your home or apartment, including inside ovens, refrigerators, kitchen cabinets, closets, and baseboards.',
    image: '/assets/images/services/service-img-17.jpg',
    iconName: 'Truck',
    features: [
      '100% Security deposit return guarantee for tenants',
      'Interior appliance deep cleaning (oven, refrigerator, dishwasher, microwave)',
      'Cabinet and drawer interiors vacuumed and wiped clean',
      'Baseboard, door casing, and crown molding detailing',
      'Tile and grout deep scrubbing and carpet steam extraction available'
    ],
    checklist: [
      'Clean inside and outside of all kitchen appliances',
      'Scrub kitchen cabinets and pantry shelves',
      'De-scale bathroom shower tile, tubs, glass doors, and fixtures',
      'Dust ceiling fans, light fixtures, blinds, and window sills',
      'Vacuum all closets, corners, edges, and mop all hard flooring'
    ],
    benefits: [
      'Relieve moving stress with professional turnkey cleaning',
      'Move into a completely sanitized, fresh, pathogen-free residence',
      'Landlords can market vacancies faster to prospective tenants'
    ]
  },
  {
    slug: 'home-maintenance',
    title: 'Comprehensive Home Maintenance',
    shortDesc: 'Ongoing residential cleaning and proactive upkeep for South Florida luxury homes and coastal estates.',
    fullDesc: 'Comprehensive home maintenance and recurring residential cleaning across Palm Beach & Broward. We defend your estate against Florida humidity, mold, salt air corrosion, and dust through our systematic Rotation Cleaning System.',
    image: '/assets/images/services/service-img-18.jpg',
    iconName: 'Wrench',
    features: [
      'Weekly, bi-weekly, or monthly recurring maintenance plans',
      'Exclusive Rotation Cleaning System ensuring continuous deep-cleaning',
      'AC vent and filter cleaning reducing allergens and dust circulation',
      'Patio furniture, sliding glass door track, and entryway detailing',
      'Eco-friendly non-toxic green cleaning products safe for kids and pets'
    ],
    checklist: [
      'Rotate deep clean focus between Kitchen, Bathrooms, and Living Areas',
      'Vacuum upholstery, under cushions, and beneath moveable furniture',
      'Dust chandeliers, picture frames, decorative molding, and blinds',
      'Scrub bathroom grout, polish chrome faucets, and sanitize toilets',
      'Mop hard wood, travertine, or tile floors with pH-balanced formulas'
    ],
    benefits: [
      'Preserve the long-term value and beauty of your property',
      'Enjoy pristine, resort-like living every single day without lifting a finger',
      'Tailored schedules that work seamlessly around your family lifestyle'
    ]
  },
  {
    slug: 'school-cleaning',
    title: 'School & Daycare Cleaning Services',
    shortDesc: 'Certified child-safe green disinfection for educational facilities, private academies, and learning centers.',
    fullDesc: 'Certified educational facility and daycare cleaning in South Florida. We use child-safe, non-toxic green disinfectants to eliminate viruses, bacteria, and allergens from classrooms, cafeterias, gymnasiums, and restrooms.',
    image: '/assets/images/services/service-img-19.jpg',
    iconName: 'GraduationCap',
    features: [
      'Non-toxic, fume-free EPA-registered child-safe disinfectants',
      'Daily disinfection of desks, toys, tables, and play mats',
      'Cafeteria table degreasing and food prep sanitization',
      'Gymnasium and locker room mildew and odor control',
      'Strict background checks on all personnel assigned to school grounds'
    ],
    checklist: [
      'Disinfect student desks, chairs, computer keyboards, and tablets',
      'Sanitize all drinking fountains, handrails, and door knobs',
      'Deep scrub and disinfect student restrooms and changing stations',
      'Mop hallways and multi-purpose rooms with disinfectant cleaners',
      'Empty all classroom wastebaskets and sanitize bins'
    ],
    benefits: [
      'Drastically reduce school-wide absenteeism from seasonal viruses',
      'Give parents and educators confidence in child safety',
      'Meet and exceed state child care licensing sanitization mandates'
    ]
  },
  {
    slug: 'home-watching',
    title: 'Professional Home Watching Services',
    shortDesc: 'Vigilant estate oversight, storm preparation, and absentee homeowner monitoring in Palm Beach County.',
    fullDesc: 'Professional home watching and absentee estate oversight in Palm Beach County. Designed for snowbirds and traveling executives, our certified property watchers perform weekly physical inspections, check for AC leaks, test plumbing, and verify home security.',
    image: '/assets/images/services/service-img-20.jpg',
    iconName: 'Eye',
    features: [
      'Weekly or bi-weekly interior and exterior physical inspections',
      'AC temperature, humidity, and condensate drain line monitoring',
      'Plumbing system cycling: flush toilets, run faucets, verify water heaters',
      'Severe weather and hurricane shutter preparation and post-storm inspection',
      'Detailed digital inspection reports with timestamped photos sent to owner'
    ],
    checklist: [
      'Inspect roofline, windows, and perimeter for intrusion or storm damage',
      'Check ceilings and walls for water stains, mold, or moisture intrusion',
      'Verify HVAC settings and replace air filters as needed',
      'Run all faucets, garbage disposals, and flush all toilets to keep seals wet',
      'Retrieve mail, packages, and verify landscaping / pool maintenance quality'
    ],
    benefits: [
      'Prevent catastrophic water damage and silent mold growth while away',
      'Comply with homeowner insurance requirements for unoccupied properties',
      'Complete peace of mind knowing vetted professionals are guarding your home'
    ]
  },
  {
    slug: 'covid-19-disinfection',
    title: 'COVID-19 Disinfection & Electrostatic Spraying',
    shortDesc: 'EPA-registered electrostatic surface misting and broad-spectrum pathogen defense for businesses and homes.',
    fullDesc: 'EPA-registered COVID-19 electrostatic spraying and surface disinfection across South Florida businesses and residences. We utilize hospital-grade electrostatic sprayers that wrap 360 degrees around surfaces, neutralizing 99.99% of airborne and surface pathogens.',
    image: '/assets/images/services/service-img-21.jpg',
    iconName: 'Biohazard',
    features: [
      'Electrostatic fogging technology providing complete 360-degree coverage',
      'EPA List N certified hospital disinfectants with rapid dwell times',
      'Safe on electronics, sensitive fabrics, and office paperwork',
      'Immediate post-exposure emergency response decontamination',
      'Certificate of Disinfection provided for employee and client assurance'
    ],
    checklist: [
      'Pre-clean and degrease all high-touch surfaces prior to application',
      'Apply electrostatic mist across desks, keyboards, chairs, and doors',
      'Allow manufacturer-mandated dwell time for 99.99% viral kill rate',
      'Wipe down contact touchpoints with microfiber finishing cloths',
      'Issue official verification certificate of facility disinfection'
    ],
    benefits: [
      'Safely reopen facilities following confirmed illness exposure',
      'Reassure staff and customers that health and safety is top priority',
      'Fast turnaround with re-entry permitted in as little as 30 minutes'
    ]
  }
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: 'revitalize-your-office-space',
    title: 'Revitalize Your Office Space with South Florida Cleaning Concepts',
    summary: 'Discover how professional commercial office cleaning boosts employee morale, reduces sick leave, and makes an unforgettable first impression on prospective clients.',
    date: 'February 12, 2026',
    readTime: '6 min read',
    category: 'Commercial Cleaning',
    image: '/assets/images/blog/blog-img-1.jpg',
    sections: [
      {
        heading: 'The Direct Link Between Workspace Cleanliness and Team Productivity',
        paragraphs: [
          'A cluttered, dusty office is more than an aesthetic eyesore—it directly degrades cognitive focus, fosters airborne allergens, and facilitates the transmission of seasonal contagions across shared departments.',
          'Studies consistently demonstrate that employees working in professionally sanitized office environments experience up to 40% fewer sick days and report measurably higher daily motivation.'
        ],
        bullets: [
          'Microfiber desk detailing eliminating trapped bacteria from keyboards and mice',
          'HEPA-filtered filtration that captures 99.97% of airborne pollen, dust, and dander',
          'Sanitized conference rooms that convey high professionalism during executive meetings'
        ]
      },
      {
        heading: 'Tailored Cleaning Programs for South Florida Businesses',
        paragraphs: [
          'South Florida Cleaning Concepts partners with professional firms throughout Palm Beach, Broward, and Miami-Dade to create custom janitorial programs that fit each facility’s operational rhythm.',
          'Whether you require nightly deep janitorial passes after business hours or discreet daytime porter maintenance, our bonded and insured staff ensures your facilities always present at their highest standard.'
        ]
      }
    ]
  },
  {
    slug: 'complete-guide-to-home-cleaning',
    title: 'Complete Guide to Home Cleaning Tips and Tricks',
    summary: 'Master residential cleanliness with our comprehensive room-by-room South Florida cleaning checklist, eco-friendly formulas, and decluttering strategies.',
    date: 'February 10, 2026',
    readTime: '8 min read',
    category: 'Residential Cleaning',
    image: '/assets/images/blog/blog-img-2.jpg',
    sections: [
      {
        heading: 'Mastering the Top-to-Bottom, Left-to-Right Method',
        paragraphs: [
          'The golden rule of professional maid service is always working from top to bottom and from left to right. When you dust ceiling fans and crown molding first, fallen particles land on lower surfaces that you have not yet cleaned.',
          'By cleaning systematically around each room in a single fluid rotation, you never duplicate effort or miss forgotten corners.'
        ]
      },
      {
        heading: 'Tackling South Florida Humidity and Tile Grout',
        paragraphs: [
          'Our tropical Florida climate presents unique challenges for homeowners: persistent indoor humidity can quickly foster mildew in tile grout, baseboard corners, and air conditioning return vents.',
          'Use pH-balanced, non-corrosive cleaning agents on tile floors to avoid degrading your sealant while dislodging embedded grime.'
        ],
        bullets: [
          'Inspect bathroom ventilation fans and run them for 20 minutes following every shower',
          'Wipe down sliding patio glass door tracks weekly to prevent sand and moisture buildup',
          'Schedule bi-weekly professional deep cleanings to keep high-traffic living areas flawless'
        ]
      }
    ]
  },
  {
    slug: 'restaurant-and-bar-cleaning-services',
    title: 'Shining a Light on Clean: How Restaurant and Bar Cleaning Services Enhance Your Business',
    summary: 'Learn why commercial kitchen degreasing, spotless bar wells, and pristine dining atmospheres are critical to passing health inspections and winning loyal guests.',
    date: 'February 8, 2026',
    readTime: '7 min read',
    category: 'Commercial Hospitality',
    image: '/assets/images/blog/blog-img-3.jpg',
    sections: [
      {
        heading: 'Passing Health Inspections with Flying Colors',
        paragraphs: [
          'In the hyper-competitive South Florida culinary scene, a single health department violation can cost thousands in fines and permanently tarnish your restaurant’s reputation.',
          'Commercial kitchens accumulate aerosolized cooking grease behind fryers, underneath cooking ranges, and inside floor drain troughs that kitchen line staff simply lack the time and heavy machinery to scrub during nightly closeouts.'
        ]
      },
      {
        heading: 'The Power of Clean Front-of-House Spaces',
        paragraphs: [
          'Before a guest tastes their first appetizer, they have already judged your kitchen by the cleanliness of your front entrance, dining booths, and guest restrooms.',
          'Our commercial sanitation crews clean and polish every touchpoint so your front-of-house gleams with warmth and hospital-grade purity.'
        ],
        bullets: [
          'Deep scrubbing of kitchen quarry tile with grease-dissolving bio-enzymes',
          'Bar speed rack, draft tap line, and ice bin sanitation',
          'Restroom detailing that keeps your Google reviews glowing with 5 stars'
        ]
      }
    ]
  },
  {
    slug: 'office-cleaning-made-easy',
    title: 'Office Cleaning Made Easy with South Florida Cleaning Concepts',
    summary: 'A step-by-step executive guide on delegating office janitorial tasks, setting cleaning standards, and maintaining immaculate corporate workspaces.',
    date: 'February 5, 2026',
    readTime: '5 min read',
    category: 'Commercial Cleaning',
    image: '/assets/images/blog/blog-img-4.jpg',
    sections: [
      {
        heading: 'Why Outsourcing Janitorial Care Saves Money',
        paragraphs: [
          'Asking highly paid office personnel to vacuum carpets, empty trash, or wipe down breakrooms harms employee morale and leads to inconsistent, superficial cleaning.',
          'Partnering with South Florida Cleaning Concepts provides dedicated commercial janitors who bring professional equipment, green disinfectants, and systematic checklists.'
        ]
      },
      {
        heading: 'Daily, Weekly, and Monthly Maintenance Milestones',
        paragraphs: [
          'A balanced commercial office cleaning program breaks janitorial care into daily sanitization passes, weekly deep floor care, and monthly window and upholstery detailing.',
          'This tiered approach keeps operational budgets predictable while maintaining a fresh, professional corporate environment year-round.'
        ]
      }
    ]
  },
  {
    slug: 'short-term-rental-cleaning-guide',
    title: 'Short-Term Rental Cleaning: The Ultimate Host Guide',
    summary: 'Everything Airbnb and VRBO hosts in South Florida need to know about turnaround times, linen laundering, guest inspection checklists, and scoring 5-star reviews.',
    date: 'February 2, 2026',
    readTime: '8 min read',
    category: 'Rental Management',
    image: '/assets/images/blog/blog-img-5.jpg',
    sections: [
      {
        heading: 'The 5-Star Cleanliness Standard on Airbnb',
        paragraphs: [
          'On short-term rental platforms, cleanliness is the number one review category that determines whether a property achieves Superhost status or suffers from dropping booking rates.',
          'Guests expect hotel-caliber presentation: crisp hospital-clean linens, spotless bathroom glass with zero soap scum, and welcoming touches like folded towels and stocked amenities.'
        ]
      },
      {
        heading: 'Automating Your Turnover Pipeline',
        paragraphs: [
          'Our specialized short-term rental cleaners coordinate directly with your reservation calendar. When a guest checks out at 10:00 AM, our team arrives promptly to clean, launder, and restock before the next arrival at 3:00 PM.',
          'We also provide photographic damage inspections, alerting hosts immediately if a departing guest left unauthorized damage or excessive trash.'
        ]
      }
    ]
  },
  {
    slug: 'high-quality-cleaning-services-south-florida',
    title: 'High-Quality Cleaning Services South Florida: What Sets Us Apart',
    summary: 'Explore the core values, training regimens, eco-friendly chemistry, and customer guarantee that define South Florida Cleaning Concepts after 20+ years.',
    date: 'January 28, 2026',
    readTime: '6 min read',
    category: 'Company Insights',
    image: '/assets/images/blog/blog-img-6.jpg',
    sections: [
      {
        heading: 'Two Decades of Family-Owned Integrity',
        paragraphs: [
          'Since our founding, South Florida Cleaning Concepts has remained true to a simple principle: treat every client’s property with the same reverence and meticulous care as our own family home.',
          'We never cut corners, outsource our accounts to untracked subcontractors, or skip difficult areas. Our 100% Satisfaction Guarantee means exactly what it says—if you are not happy, you do not pay.'
        ]
      },
      {
        heading: 'The Rotation Cleaning System Difference',
        paragraphs: [
          'While ordinary cleaning services quickly fall into a pattern of superficial surface wiping, our proprietary Rotation Cleaning System systematically cycles deep-cleaning tasks across every visit.',
          'This guarantees that baseboards, inside cabinets, appliance interiors, and vent covers receive dedicated scrubbing on a predictable schedule.'
        ]
      }
    ]
  },
  {
    slug: 'medical-office-cleaning-guide',
    title: 'Medical Office Cleaning: A Comprehensive Clinical Guide',
    summary: 'A deep dive into infection prevention, terminal cleaning procedures, OSHA compliance, and pathogen defense in healthcare clinics.',
    date: 'January 24, 2026',
    readTime: '7 min read',
    category: 'Healthcare Sanitation',
    image: '/assets/images/blog/blog-img-7.jpg',
    sections: [
      {
        heading: 'Understanding Terminal Disinfection in Outpatient Clinics',
        paragraphs: [
          'Unlike standard commercial offices, medical facilities demand a clinical level of microbial elimination. Pathogens such as MRSA, norovirus, and respiratory viruses can linger on hard surfaces for days if not neutralized by proper disinfectant dwell times.',
          'Our healthcare cleaning specialists utilize color-coded microfiber tools to eliminate the risk of transferring bacteria between exam rooms, restrooms, and administrative areas.'
        ]
      },
      {
        heading: 'Protecting Patients and Medical Personnel',
        paragraphs: [
          'By maintaining strict adherence to CDC guidelines and OSHA standards for bloodborne pathogens, we protect vulnerable patients, visiting families, and clinical medical teams from cross-infection.',
          'Every chemical used is EPA-registered for medical application and paired with HEPA-filter air scrubbers to guarantee pristine air quality.'
        ]
      }
    ]
  },
  {
    slug: 'deep-cleaning-for-homes-and-offices',
    title: 'Deep Cleaning for Homes and Offices: When and Why You Need It',
    summary: 'Understand the critical differences between recurring maintenance cleaning and seasonal deep scrubbing for homes and corporate facilities.',
    date: 'January 20, 2026',
    readTime: '6 min read',
    category: 'Deep Cleaning',
    image: '/assets/images/blog/blog-img-8.jpg',
    sections: [
      {
        heading: 'Maintenance Cleaning vs. Deep Cleaning Explained',
        paragraphs: [
          'Standard recurring cleaning addresses visible daily grime—dusting surfaces, mopping walkways, emptying trash, and cleaning countertops.',
          'A deep cleaning is a comprehensive restorative process. It pulls out heavy appliances, extracts scale from shower tiles, scrubs door frames, wipes light fixtures, and details HVAC intake grilles.'
        ]
      },
      {
        heading: 'Ideal Triggers for Scheduling a Deep Clean',
        paragraphs: [
          'We recommend scheduling a professional deep clean at key moments: prior to hosting holiday gatherings, at the turn of the seasons, after home remodeling, or when moving into a newly acquired property.',
          'Starting with a deep clean resets your property to baseline perfection, making subsequent routine maintenance significantly faster and more cost-effective.'
        ]
      }
    ]
  },
  {
    slug: 'post-construction-cleaning-guide',
    title: 'Post-Construction Cleaning: The 3-Phase Builder Guide',
    summary: 'How architects, builders, and remodelers transition active job sites into immaculate, move-in-ready luxury properties through 3-phase cleanup.',
    date: 'January 16, 2026',
    readTime: '7 min read',
    category: 'Construction Services',
    image: '/assets/images/blog/blog-img-9.jpg',
    sections: [
      {
        heading: 'Phase 1: The Rough Clean',
        paragraphs: [
          'Once framing, drywall installation, and major electrical/plumbing rough-ins are complete, the rough clean clears heavy construction trash, sweeps away framing sawdust, and scrapes sticker residue from freshly installed bathtubs and windows.'
        ]
      },
      {
        heading: 'Phase 2: The Deep Clean',
        paragraphs: [
          'The deep clean occurs after painting, tiling, and cabinetry are completed. Specialized vacuum systems with multi-stage HEPA filtration extract micro-fine drywall particles that settle inside drawer glides, HVAC ductwork, and closet shelves.'
        ]
      },
      {
        heading: 'Phase 3: The Final Polish',
        paragraphs: [
          'The final polish takes place 24 to 48 hours before the owner walkthrough or certificate of occupancy inspection. We polish all chrome hardware, buff shower glass, wash every window pane, and leave the property smelling fresh and looking immaculate.'
        ]
      }
    ]
  },
  {
    slug: 'south-florida-home-maintenance-services',
    title: 'South Florida Home Maintenance: Protecting Your Coastal Investment',
    summary: 'Essential strategies for shielding Florida homes from tropical humidity, salt spray, mold intrusion, and seasonal weather changes.',
    date: 'January 12, 2026',
    readTime: '8 min read',
    category: 'Estate Maintenance',
    image: '/assets/images/blog/blog-img-10.jpg',
    sections: [
      {
        heading: 'The Unique Environmental Threats of Coastal Florida',
        paragraphs: [
          'Living in coastal South Florida offers year-round sunshine, but high humidity and airborne salt require proactive property upkeep. Left unchecked, humidity leads to mildew in air ducts, while salt residue etches glass railings and corrodes exterior fixtures.',
          'A disciplined home maintenance regimen prevents costly structural repairs and preserves the appraisal value of your estate.'
        ]
      },
      {
        heading: 'Integrated Estate Oversight and Cleaning',
        paragraphs: [
          'South Florida Cleaning Concepts provides integrated interior and exterior care. From monitoring HVAC condensate drip lines to washing patio glass and detailing poolside cabanas, we keep your coastal residence operating like a five-star private resort.'
        ]
      }
    ]
  },
  {
    slug: 'residential-cleaning-services-journey',
    title: 'A Journey with South Florida Cleaning Concepts Residential Maid Service',
    summary: 'What to expect when booking recurring maid service: customized walkthroughs, vetted teams, eco-friendly supplies, and the luxury of reclaimed time.',
    date: 'January 8, 2026',
    readTime: '6 min read',
    category: 'Residential Cleaning',
    image: '/assets/images/blog/blog-img-11.jpg',
    sections: [
      {
        heading: 'Reclaiming Your Weekends',
        paragraphs: [
          'Between busy work schedules, family commitments, and enjoying the South Florida lifestyle, spending your Saturday morning scrubbing toilets and vacuuming stairs is a drain on your quality of life.',
          'Our recurring maid service takes residential maintenance entirely off your to-do list. Arrive home to crisp vacuum lines on plush rugs, polished granite counters, and the clean scent of organic botanical disinfectants.'
        ]
      },
      {
        heading: 'Personalized Cleaning Profiles',
        paragraphs: [
          'No two homes are identical. We create an individualized cleaning profile for your residence, recording specific preferences such as delicate heirloom surfaces, pet accommodations, preferred cleaning frequencies, and focus rooms.',
          'Our bonded, background-checked cleaners follow your custom profile on every visit, backed by our 100% Satisfaction Guarantee.'
        ]
      }
    ]
  }
];

export const FAQS_LIST: FaqItem[] = [
  {
    category: 'rotation',
    question: 'What is the South Florida Cleaning Concepts Rotation System?',
    answer: 'Our Rotation System is an exclusive cleaning methodology where every visit covers comprehensive maintenance throughout your entire property, while systematically rotating an intensive deep-scrub across designated zones (Kitchen, Bathrooms, Sleeping Areas, and Living Spaces). This prevents grime accumulation in overlooked corners and keeps your property in perpetual showroom condition without expensive one-off deep-cleaning fees.'
  },
  {
    category: 'general',
    question: 'What is your 100% Satisfaction Guarantee policy?',
    answer: 'We firmly believe that if we fail to make you happy, you should not be expected to pay. If any aspect of our clean does not meet your expectations, notify us within 24 hours and we will return immediately to re-clean the area free of charge. If you are still not completely satisfied, we cancel your invoice.'
  },
  {
    category: 'general',
    question: 'Are your cleaners vetted, insured, and bonded?',
    answer: 'Yes, 100%. Every specialist on our team undergoes rigorous criminal background checks, multi-tiered interview vetting, and ongoing hands-on training. We carry full commercial liability and worker compensation insurance, giving you total security and peace of mind.'
  },
  {
    category: 'general',
    question: 'What cleaning supplies and equipment do you use?',
    answer: 'We provide all commercial-grade equipment and supplies, including high-filtration HEPA vacuums, color-coded microfiber cloths, and EPA-registered hospital disinfectants. We also offer non-toxic, eco-friendly green cleaning solutions upon request for homes with infants and sensitive pets.'
  },
  {
    category: 'commercial',
    question: 'Do you offer after-hours and weekend commercial cleaning?',
    answer: 'Yes. We customize janitorial schedules to ensure zero disruption to your daily operations. The majority of our commercial office, medical facility, and restaurant clients prefer nightly service after 6:00 PM or weekend scheduling.'
  },
  {
    category: 'residential',
    question: 'Do I need to be home when the cleaning team arrives?',
    answer: 'No. Many of our residential and absentee estate clients provide secure lockbox codes, garage keypad entries, or front-desk concierge clearance. Our bonded team arrives, completes the work according to your custom profile, locks up, and texts you a completion confirmation.'
  },
  {
    category: 'commercial',
    question: 'How do you prevent cross-contamination between restrooms and offices?',
    answer: 'We enforce a strict color-coded microfiber and mop system. Red cloths and mops are used strictly in restrooms, blue for general office desks, and green for food prep areas. In clinical and medical settings, tools are sanitized with EPA-registered hospital disinfectants between rooms.'
  },
  {
    category: 'residential',
    question: 'How do I get a free quote for my property?',
    answer: 'Simply fill out our online quote form or call us directly at (561) 704-5303. We provide transparent, no-obligation estimates based on your square footage, room count, and desired service frequency.'
  }
];

export const CLIENT_TESTIMONIALS: TestimonialItem[] = [
  {
    quote: 'I have used South Florida Cleaning Concepts for years for their professionalism and quality. They keep our medical offices spotless and compliant.',
    author: 'Lindsey J. Crowley',
    role: 'Medical Practice Director',
    location: 'West Palm Beach, FL',
    rating: 5
  },
  {
    quote: 'Managing high-volume restaurants means health inspections can make or break us. South Florida Cleaning Concepts has been our secret weapon for 4 years.',
    author: 'Marcus Vance',
    role: 'General Manager, Hospitality Group',
    location: 'Boca Raton, FL',
    rating: 5
  },
  {
    quote: 'Their Rotation Cleaning System is the real deal. Our home has never felt cleaner, and knowing they stand behind their work with a 100% guarantee gives total confidence.',
    author: 'Elena & David Ross',
    role: 'Luxury Homeowners',
    location: 'Boynton Beach, FL',
    rating: 5
  },
  {
    quote: 'As an Airbnb host with multiple units in Delray, their rapid turnover service has earned me consecutive 5-star cleanliness reviews. Truly dependable partners.',
    author: 'Carlos Mendez',
    role: 'Superhost & Real Estate Investor',
    location: 'Delray Beach, FL',
    rating: 5
  }
];
