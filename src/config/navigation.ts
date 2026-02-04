// ========================================
// NAVIGATION CONFIGURATIONS
// Menu structure and navigation settings
// ========================================

// ----------------------------------------
// TYPES
// ----------------------------------------

export interface NavItem {
  label: string
  href: string
  icon?: string
  external?: boolean
  children?: NavItem[]
  highlight?: boolean
  badge?: string
}

export interface NavigationConfig {
  // Main navigation
  mainNav: NavItem[]

  // Footer navigation (grouped by column)
  footerNav: {
    title: string
    items: NavItem[]
  }[]

  // Legal links (footer bottom)
  legalNav: NavItem[]

  // Mobile-specific items (if different from main)
  mobileNav?: NavItem[]

  // CTA button in header
  headerCTA?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'outline'
  }
}

// ----------------------------------------
// DEFAULT NAVIGATION
// ----------------------------------------

export const navigationConfig: NavigationConfig = {
  // Main navigation (header)
  mainNav: [
    { label: 'Home', href: '/' },
    {
      label: 'Properties',
      href: '/search',
      children: [
        { label: 'For Sale', href: '/search?listing_type=sale' },
        { label: 'To Rent', href: '/search?listing_type=let' },
        { label: 'New Homes', href: '/search?new_build=true' },
      ],
    },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Sales', href: '/services/sales' },
        { label: 'Lettings', href: '/services/lettings' },
        { label: 'Property Management', href: '/services/management' },
        { label: 'Valuations', href: '/valuation' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  // Footer navigation (columns)
  footerNav: [
    {
      title: 'Menu',
      items: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Properties', href: '/search' },
        { label: 'Insights', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Properties',
      items: [
        { label: 'For Sale', href: '/search?listing_type=sale' },
        { label: 'To Rent', href: '/search?listing_type=let' },
        { label: 'New Homes', href: '/search?new_build=true' },
        { label: 'Recently Reduced', href: '/search?recently_reduced=true' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Selling', href: '/services/sales' },
        { label: 'Letting', href: '/services/lettings' },
        { label: 'Valuation', href: '/valuation' },
        { label: 'Property Management', href: '/services/management' },
      ],
    },
  ],

  // Legal links
  legalNav: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Complaints', href: '/complaints' },
  ],

  // Header CTA
  headerCTA: {
    label: 'Book Valuation',
    href: '/valuation',
    variant: 'primary',
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Check if a nav item is active based on current path
 */
export function isNavItemActive(item: NavItem, currentPath: string): boolean {
  if (item.href === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(item.href)
}

/**
 * Check if a nav item or any of its children are active
 */
export function isNavItemOrChildActive(item: NavItem, currentPath: string): boolean {
  if (isNavItemActive(item, currentPath)) return true
  if (item.children) {
    return item.children.some(child => isNavItemActive(child, currentPath))
  }
  return false
}

/**
 * Flatten navigation for search/sitemap
 */
export function flattenNav(items: NavItem[]): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    acc.push(item)
    if (item.children) {
      acc.push(...flattenNav(item.children))
    }
    return acc
  }, [])
}

/**
 * Get breadcrumb items for a given path
 */
export function getBreadcrumbs(
  currentPath: string,
  navItems: NavItem[] = navigationConfig.mainNav
): NavItem[] {
  const breadcrumbs: NavItem[] = [{ label: 'Home', href: '/' }]

  function findPath(items: NavItem[], path: string[]): void {
    for (const item of items) {
      if (isNavItemActive(item, currentPath) && item.href !== '/') {
        path.push(item)
        if (item.children) {
          findPath(item.children, path)
        }
        return
      }
    }
  }

  const path: NavItem[] = []
  findPath(navItems, path)
  breadcrumbs.push(...path)

  return breadcrumbs
}

/**
 * Create custom navigation with defaults
 */
export function createNavigationConfig(
  overrides: Partial<NavigationConfig>
): NavigationConfig {
  return {
    ...navigationConfig,
    ...overrides,
    mainNav: overrides.mainNav || navigationConfig.mainNav,
    footerNav: overrides.footerNav || navigationConfig.footerNav,
    legalNav: overrides.legalNav || navigationConfig.legalNav,
  }
}
