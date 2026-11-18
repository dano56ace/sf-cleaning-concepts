import { BLOG_POSTS } from './siteData';

export interface BlogSchemaMetadata {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
}

export const BLOG_SCHEMA_REGISTRY: Record<string, BlogSchemaMetadata> = {
  'complete-guide-to-home-cleaning': {
    headline: 'Complete South Florida Home Cleaning Tips and Checklist',
    description: "Master home cleaning with SFCC's complete guide. Essential tools, room-by-room strategies, eco-friendly solutions, and mold prevention for South Florida homes.",
    image: 'https://sfcleaningconcepts.com/assets/images/services/young-woman-standing-indoors-at-home-cleaning-win-2022-02-02-04-49-03-utc-Large.jpg',
    datePublished: '2023-09-28T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'deep-cleaning-for-homes-and-offices': {
    headline: 'Deep Cleaning Guide for South Florida Homes and Offices',
    description: 'Understand the difference between standard cleaning and deep cleaning. High-touch surfaces, baseboards, appliances, and seasonal sanitization.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/process-of-deep-furniture-cleaning-removing-dirt-2023-04-21-22-06-54-utc-Large.jpeg',
    datePublished: '2023-06-22T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'high-quality-cleaning-services-south-florida': {
    headline: 'What Defines High-Quality Cleaning in South Florida',
    description: 'Explore high-quality residential and commercial cleaning across Palm Beach and South Florida. Vetted staff, eco-friendly supplies, and 100% guaranteed results.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/cleaning-home-2022-05-10-23-59-07-utc-Large.jpeg',
    datePublished: '2023-07-25T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'medical-office-cleaning-guide': {
    headline: 'Medical Office Cleaning Guide for South Florida Clinics',
    description: 'Comprehensive medical office sanitation guide. Terminal disinfection, OSHA regulations, cross-contamination prevention, and healthcare-grade sterilization.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/medical-office-2022-07-07-00-46-47-utc-Large.jpeg',
    datePublished: '2023-07-10T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'office-cleaning-made-easy': {
    headline: 'Commercial Office Cleaning Made Easy in South Florida',
    description: 'Simplify commercial facility cleaning with South Florida Cleaning Concepts. Custom scheduling, vetted teams, and eco-friendly products for offices.',
    image: 'https://sfcleaningconcepts.com/assets/images/blog/cleaning-dental-office-2022-04-19-01-57-15-utc.jpeg',
    datePublished: '2023-08-30T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'post-construction-cleaning-guide': {
    headline: 'Post-Construction Cleaning Guide for South Florida Builds',
    description: 'Comprehensive post-construction cleaning guide. The three phases of construction cleanup: rough clean, deep clean, and final touch-up polish.',
    image: 'https://sfcleaningconcepts.com/assets/images/blog/Post-Construction-Clean-2.jpeg',
    datePublished: '2023-06-05T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'residential-cleaning-services-journey': {
    headline: 'What to Expect from Recurring Residential Maid Service',
    description: 'Embark on a residential cleaning journey with SFCC. Custom cleaning plans, transparent pricing, vetted cleaners, and our signature Rotation Cleaning System.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/South-Florida-Cleaning-Concepts-Reisdential-Cleaning-1.jpeg',
    datePublished: '2023-05-02T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'restaurant-and-bar-cleaning-services': {
    headline: 'How Restaurant and Bar Cleaning Protects Your Business',
    description: 'Learn how professional restaurant and bar cleaning elevates your brand, satisfies health inspections, boosts employee morale, and drives patron loyalty.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/disinfecting-to-prevent-covid-19-waiter-cleaning-2023-01-21-03-38-39-utc-Large.jpeg',
    datePublished: '2023-09-14T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'revitalize-your-office-space': {
    headline: 'Revitalize Your South Florida Office Workspace',
    description: 'Discover how a spotless office workspace boosts productivity, lowers stress, reduces sick days, and sharpens client impressions across South Florida.',
    image: 'https://sfcleaningconcepts.com/assets/images/blog/woman-cleaning-keyboard-in-the-office-2021-08-27-16-32-49-utc-Large.jpeg',
    datePublished: '2023-10-15T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'short-term-rental-cleaning-guide': {
    headline: 'Short-Term Rental Turnover Guide for South Florida Hosts',
    description: 'The ultimate turnover cleaning guide for South Florida Airbnb & VRBO hosts. Checklists, linen laundering, guest staging, and 5-star cleanliness tips.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/Short-Term-Rental-Cleaning-1.jpeg',
    datePublished: '2023-08-12T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  },
  'south-florida-home-maintenance-services': {
    headline: 'South Florida Home Maintenance for Coastal Property Protection',
    description: 'Maximize curb appeal and protect your Florida home against tropical moisture, mildew, algae, and salt air with SFCC home maintenance services.',
    image: 'https://sfcleaningconcepts.com/assets/images/services/home-cleaning-2.jpg',
    datePublished: '2023-05-18T08:00:00-04:00',
    dateModified: '2026-11-07T12:00:00-05:00'
  }
};

export function getBlogPostSchema(slug: string) {
  const cleanSlug = slug.replace(/\.html$/, '');
  const post = BLOG_POSTS.find((p) => p.slug === cleanSlug);
  if (!post) return null;

  const meta = BLOG_SCHEMA_REGISTRY[cleanSlug];
  const headline = meta ? meta.headline : post.title;
  const description = meta ? meta.description : post.summary;
  const image = meta ? meta.image : (post.image.startsWith('http') ? post.image : `https://sfcleaningconcepts.com${post.image}`);
  const datePublished = meta ? meta.datePublished : '2023-01-01T08:00:00-04:00';
  const dateModified = meta ? meta.dateModified : '2026-11-07T12:00:00-05:00';
  const articleUrl = `https://sfcleaningconcepts.com/blog/${cleanSlug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://sfcleaningconcepts.com/#website',
        url: 'https://sfcleaningconcepts.com/',
        name: 'South Florida Cleaning Concepts',
        publisher: {
          '@id': 'https://sfcleaningconcepts.com/#localbusiness'
        }
      },
      {
        '@type': ['BlogPosting', 'Article'],
        '@id': `${articleUrl}#article`,
        isPartOf: {
          '@id': 'https://sfcleaningconcepts.com/#website'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl
        },
        headline,
        description,
        image,
        datePublished,
        dateModified,
        author: {
          '@type': 'Organization',
          '@id': 'https://sfcleaningconcepts.com/#localbusiness',
          name: 'South Florida Cleaning Concepts',
          url: 'https://sfcleaningconcepts.com/'
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://sfcleaningconcepts.com/#localbusiness',
          name: 'South Florida Cleaning Concepts',
          url: 'https://sfcleaningconcepts.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://sfcleaningconcepts.com/assets/images/logo/logo.svg'
          }
        },
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://sfcleaningconcepts.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Publications',
            item: 'https://sfcleaningconcepts.com/our-publications'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: headline,
            item: articleUrl
          }
        ]
      }
    ]
  };
}
