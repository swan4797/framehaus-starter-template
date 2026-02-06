// ========================================
// STATIC PAGE COMPONENTS - CONFIGURATION
// Default configurations for static page components
// ========================================

import type {
  HeroProps,
  ShowcaseCardProps,
  ContentRowProps,
  CtaSectionProps,
  PartnersCarouselProps,
  TestimonialProps,
} from './types'

// ========================================
// HERO DEFAULTS
// ========================================

export const defaultHeroConfig: HeroProps = {
  label: '',
  titleLines: [],
  tagline: '',
  ctaLabel: 'Learn More',
  ctaUrl: '/contact',
}

// ========================================
// SHOWCASE DEFAULTS
// ========================================

export const defaultShowcaseCardConfig: ShowcaseCardProps = {
  variant: 'primary',
  title: '',
  description: '',
  features: [],
}

// ========================================
// CONTENT SECTION DEFAULTS
// ========================================

export const defaultContentRowConfig: ContentRowProps = {
  label: '',
  title: '',
  content: '',
  listItems: [],
  actions: [],
}

// ========================================
// CTA SECTION DEFAULTS
// ========================================

export const defaultCtaConfig: CtaSectionProps = {
  title: 'Ready to get started?',
  description: 'Get in touch with our team today.',
  actions: [
    { label: 'Contact Us', url: '/contact', variant: 'primary' },
    { label: 'Learn More', url: '/about', variant: 'secondary' },
  ],
}

// ========================================
// PARTNERS DEFAULTS
// ========================================

export const defaultPartnersConfig: PartnersCarouselProps = {
  label: 'Proudly affiliated with',
  partners: [
    'Rightmove',
    'Zoopla',
    'OnTheMarket',
    'Propertymark',
    'RICS',
    'TPO',
    'TDS',
  ],
}

// ========================================
// TESTIMONIAL DEFAULTS
// ========================================

export const defaultTestimonialConfig: TestimonialProps = {
  quote: '',
  author: {
    name: '',
    role: '',
  },
  avatars: [],
}

// ========================================
// PAGE-SPECIFIC CONFIGURATIONS
// ========================================

export const buyersPageConfig = {
  hero: {
    label: 'For Buyers',
    titleLines: [
      { text: 'Find your perfect' },
      { text: 'with us', accent: 'home' },
    ],
    tagline: "Whether you're a first-time buyer or looking to move up the property ladder, we're here to help you find your dream home.",
    ctaLabel: 'Browse Properties',
    ctaUrl: '/search?listing_type=sale',
  },
  showcase: {
    primaryCard: {
      variant: 'blue' as const,
      title: 'Expert Property Search',
      description: 'Our experienced team will help you find properties that match your exact requirements.',
      features: [
        { text: 'Personalised property matching' },
        { text: 'Early access to new listings' },
        { text: 'Accompanied viewings' },
      ],
    },
    secondaryCard: {
      variant: 'amber' as const,
      subtitle: 'Mortgage Support',
      description: 'We work with trusted mortgage advisors to help you secure the best financing options.',
    },
  },
  cta: {
    title: 'Ready to find your new home?',
    description: "Start your property search today and let us help you find the perfect place to call home.",
    actions: [
      { label: 'Browse Properties', url: '/search?listing_type=sale', variant: 'primary' as const },
      { label: 'Book a Consultation', url: '/contact', variant: 'secondary' as const },
    ],
  },
}

export const sellersPageConfig = {
  hero: {
    label: 'For Sellers',
    titleLines: [
      { text: 'Sell your property' },
      { text: 'for the best', accent: 'price' },
    ],
    tagline: 'With expert local knowledge and a proven track record, we help you achieve the best possible price for your property.',
    ctaLabel: 'Get a Free Valuation',
    ctaUrl: '/valuation',
  },
  showcase: {
    primaryCard: {
      variant: 'primary' as const,
      title: 'Maximum Exposure',
      description: 'Your property will be marketed across all major portals and our extensive buyer network.',
      features: [
        { text: 'Professional photography' },
        { text: 'Virtual tours available' },
        { text: 'Featured on Rightmove & Zoopla' },
      ],
    },
    secondaryCard: {
      variant: 'secondary' as const,
      subtitle: 'Expert Negotiation',
      description: 'Our skilled negotiators work to secure the best possible price and terms for your sale.',
    },
  },
  cta: {
    title: 'Ready to sell your property?',
    description: 'Book a free valuation and discover what your property could be worth.',
    actions: [
      { label: 'Get a Free Valuation', url: '/valuation', variant: 'primary' as const },
      { label: 'Contact Us', url: '/contact', variant: 'secondary' as const },
    ],
  },
}

export const landlordsPageConfig = {
  hero: {
    label: 'For Landlords',
    titleLines: [
      { text: 'Hassle-free' },
      { text: 'services', accent: 'letting' },
    ],
    tagline: 'From finding quality tenants to full property management, we take the stress out of being a landlord.',
    ctaLabel: 'Get a Rental Valuation',
    ctaUrl: '/contact',
  },
  showcase: {
    primaryCard: {
      variant: 'primary' as const,
      title: 'Full Management Service',
      description: 'Let us handle everything from tenant finding to maintenance and rent collection.',
      features: [
        { text: 'Comprehensive tenant vetting' },
        { text: '24/7 maintenance support' },
        { text: 'Guaranteed rent options' },
      ],
    },
    secondaryCard: {
      variant: 'secondary' as const,
      subtitle: 'Compliance Guaranteed',
      description: 'Stay compliant with all landlord regulations and safety requirements.',
    },
  },
  cta: {
    title: 'Ready to let your property?',
    description: 'Discover how much rental income your property could generate.',
    actions: [
      { label: 'Get a Rental Valuation', url: '/contact', variant: 'primary' as const },
      { label: 'Our Services', url: '/landlords#services', variant: 'secondary' as const },
    ],
  },
}

export const tenantsPageConfig = {
  hero: {
    label: 'For Tenants',
    titleLines: [
      { text: 'Find your next' },
      { text: 'home', accent: 'rental' },
    ],
    tagline: 'Discover quality rental properties in your preferred area. We make renting simple and stress-free.',
    ctaLabel: 'Browse Rentals',
    ctaUrl: '/search?listing_type=let',
  },
  showcase: {
    primaryCard: {
      variant: 'blue' as const,
      title: 'Quality Properties',
      description: 'All our rental properties are carefully vetted to ensure they meet high standards.',
      features: [
        { text: 'Verified landlords' },
        { text: 'Property condition reports' },
        { text: 'Fair tenancy terms' },
      ],
    },
    secondaryCard: {
      variant: 'amber' as const,
      subtitle: 'Tenant Support',
      description: "From move-in to move-out, we're here to help with any questions or issues.",
    },
  },
  cta: {
    title: 'Ready to find your new rental home?',
    description: 'Browse our available properties and book a viewing today.',
    actions: [
      { label: 'Browse Rentals', url: '/search?listing_type=let', variant: 'primary' as const },
      { label: 'Contact Us', url: '/contact', variant: 'secondary' as const },
    ],
  },
}

export const aboutPageConfig = {
  partners: defaultPartnersConfig,
  testimonial: {
    quote: "Working with this team has been an absolute pleasure. They found us our dream home within weeks and made the whole process stress-free.",
    author: {
      name: 'Sarah & James Thompson',
      role: 'Happy Homeowners',
    },
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    ],
  },
  cta: {
    title: 'Ready to work with us?',
    description: "Whether you're buying, selling, or renting, we're here to help.",
    actions: [
      { label: 'Get in Touch', url: '/contact', variant: 'primary' as const },
      { label: 'Our Services', url: '/services', variant: 'secondary' as const },
    ],
  },
}
