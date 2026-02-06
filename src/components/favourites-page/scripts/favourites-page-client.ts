// ========================================
// FAVOURITES PAGE CLIENT
// Client-side functionality for favourites page
// ========================================

import { StratosTracker } from '../../../lib/stratos-tracker'
import { initSession } from '../../../lib/session'
import type { FavouriteItem } from '../types'

// ----------------------------------------
// TRACKER INITIALIZATION
// ----------------------------------------

let tracker: StratosTracker | null = null

function getTracker(): StratosTracker {
  if (!tracker) {
    initSession()
    tracker = new StratosTracker({
      apiUrl: import.meta.env.PUBLIC_SUPABASE_URL,
      apiKey: import.meta.env.PUBLIC_WEBSITE_API_KEY,
      trackingEnabled: true,
      debug: import.meta.env.DEV,
    })
    tracker.init()
  }
  return tracker
}

// ----------------------------------------
// DOM ELEMENTS
// ----------------------------------------

function getElements() {
  return {
    loadingState: document.getElementById('loading-state'),
    emptyState: document.getElementById('empty-state'),
    favouritesHeader: document.getElementById('favourites-header'),
    favouritesGrid: document.getElementById('favourites-grid'),
    favouritesCount: document.getElementById('favourites-count'),
    clearAllBtn: document.getElementById('clear-all-btn'),
  }
}

// ----------------------------------------
// CARD TEMPLATE
// ----------------------------------------

function createPropertyCard(fav: FavouriteItem): string {
  const property = fav.property

  // Format price
  let price = 'POA'
  if (property.asking_price) {
    price = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.asking_price)
  } else if (property.rent_amount) {
    price = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.rent_amount) + ' pcm'
  }

  // Format saved date
  const savedDate = new Date(fav.favourited_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Build property URL - use url_slug if available
  const propertyUrl = property.url_slug
    ? `/properties/${property.url_slug}`
    : `/properties/${property.id}`

  return `
    <article class="favourite-card">
      <div class="favourite-card__image">
        ${property.primary_image
          ? `<img src="${property.primary_image}" alt="${property.display_address}" loading="lazy" />`
          : `<div class="favourite-card__placeholder">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
               </svg>
             </div>`
        }

        <button
          type="button"
          class="favourite-card__remove"
          data-property-id="${property.id}"
          data-action="remove"
          aria-label="Remove from favourites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
          </svg>
        </button>

        <span class="favourite-card__badge favourite-card__badge--${property.listing_type}">
          ${property.listing_type === 'sale' ? 'For Sale' : 'To Let'}
        </span>
      </div>

      <a href="${propertyUrl}" class="favourite-card__content">
        <h3 class="favourite-card__address">${property.display_address}</h3>

        <div class="favourite-card__specs">
          ${property.bedrooms ? `
            <div class="favourite-card__spec">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 4v16"></path>
                <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                <path d="M2 17h20"></path>
                <path d="M6 8v9"></path>
              </svg>
              <span>${property.bedrooms} bed${property.bedrooms > 1 ? 's' : ''}</span>
            </div>
          ` : ''}
          ${property.bathrooms ? `
            <div class="favourite-card__spec">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                <line x1="10" x2="8" y1="5" y2="7"></line>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <line x1="7" x2="7" y1="19" y2="21"></line>
                <line x1="17" x2="17" y1="19" y2="21"></line>
              </svg>
              <span>${property.bathrooms} bath${property.bathrooms > 1 ? 's' : ''}</span>
            </div>
          ` : ''}
          ${property.property_type ? `
            <div class="favourite-card__spec">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span>${property.property_type}</span>
            </div>
          ` : ''}
        </div>

        <div class="favourite-card__footer">
          <p class="favourite-card__price">${price}</p>
          <p class="favourite-card__saved">Saved ${savedDate}</p>
        </div>
      </a>
    </article>
  `
}

// ----------------------------------------
// LOAD FAVOURITES
// ----------------------------------------

async function loadFavourites(): Promise<void> {
  const elements = getElements()
  const trackerInstance = getTracker()

  try {
    const favourites = await trackerInstance.getFavourites()

    // Hide loading
    elements.loadingState?.classList.add('favourites-state--hidden')

    if (favourites.length === 0) {
      // Show empty state
      elements.emptyState?.classList.remove('favourites-state--hidden')
      return
    }

    // Update count
    if (elements.favouritesCount) {
      elements.favouritesCount.textContent = favourites.length.toString()
    }

    // Show header and grid
    elements.favouritesHeader?.classList.remove('favourites-state--hidden')
    elements.favouritesGrid?.classList.remove('favourites-state--hidden')

    // Render properties
    if (elements.favouritesGrid) {
      elements.favouritesGrid.innerHTML = favourites.map(createPropertyCard).join('')
    }

    // Attach handlers
    attachRemoveHandlers()
  } catch (error) {
    console.error('Error loading favourites:', error)
    elements.loadingState?.classList.add('favourites-state--hidden')
    elements.emptyState?.classList.remove('favourites-state--hidden')

    const title = elements.emptyState?.querySelector('.favourites-state__title')
    const message = elements.emptyState?.querySelector('.favourites-state__message')
    if (title) title.textContent = 'Failed to load favourites'
    if (message) message.textContent = 'Please try again later'
  }
}

// ----------------------------------------
// REMOVE HANDLERS
// ----------------------------------------

function attachRemoveHandlers(): void {
  const trackerInstance = getTracker()

  document.querySelectorAll('[data-action="remove"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      e.stopPropagation()

      const button = e.currentTarget as HTMLElement
      const propertyId = button.dataset.propertyId
      if (!propertyId) return

      // Add removing animation
      const card = button.closest('.favourite-card')
      if (card) {
        card.classList.add('favourite-card--removing')
      }

      try {
        await trackerInstance.toggleFavourite(propertyId, 'favourites_page')

        // Wait for animation then reload
        setTimeout(() => loadFavourites(), 300)
      } catch (error) {
        console.error('Error removing favourite:', error)
        card?.classList.remove('favourite-card--removing')
        alert('Failed to remove property. Please try again.')
      }
    })
  })
}

// ----------------------------------------
// CLEAR ALL HANDLER
// ----------------------------------------

function initClearAllHandler(): void {
  const elements = getElements()
  const trackerInstance = getTracker()

  elements.clearAllBtn?.addEventListener('click', async () => {
    if (!confirm('Remove all properties from your favourites?')) {
      return
    }

    try {
      const favourites = await trackerInstance.getFavourites()

      // Remove all favourites
      for (const fav of favourites) {
        await trackerInstance.toggleFavourite(fav.property.id, 'favourites_page')
      }

      loadFavourites()
    } catch (error) {
      console.error('Error clearing favourites:', error)
      alert('Failed to clear favourites. Please try again.')
    }
  })
}

// ----------------------------------------
// INITIALIZATION
// ----------------------------------------

export async function initFavouritesPage(): Promise<void> {
  const trackerInstance = getTracker()

  // Track page view
  trackerInstance.trackPageView({ page_type: 'favourites' })

  // Initialize handlers
  initClearAllHandler()

  // Load favourites
  await loadFavourites()

  console.log('[FavouritesPage] Initialized')
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavouritesPage)
  } else {
    initFavouritesPage()
  }
}
