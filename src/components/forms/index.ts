// ========================================
// FORMS INDEX
// Re-exports for all form components
// ========================================

// Core components
export { FormField, FormBuilder } from './core'

// Pre-built templates
export {
  ContactForm,
  PropertyEnquiryForm,
  ValuationForm,
  ViewingForm,
  NewsletterForm,
} from './templates'

// Legacy form exports (backwards compatibility)
export { default as EnquiryForm } from './EnquiryForm.astro'
export { default as GeneralEnquiryForm } from './GeneralEnquiryForm.astro'
export { default as ViewingRequestForm } from './ViewingRequestForm.astro'
export { default as ValuationRequestForm } from './ValuationRequestForm.astro'
