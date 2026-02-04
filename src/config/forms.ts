// ========================================
// FORM CONFIGURATIONS
// Centralized form field definitions
// ========================================

// ----------------------------------------
// TYPES
// ----------------------------------------

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'hidden'
  | 'number'

export interface FormFieldOption {
  value: string
  label: string
}

export interface FormFieldConfig {
  name: string
  type: FormFieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
  gridColumn?: 'full' | 'half'
  autocomplete?: string
  defaultValue?: string
}

export interface FormSection {
  title?: string
  description?: string
  fields: string[] // Field names to include in this section
}

export interface FormConfig {
  id: string
  name: string
  endpoint: string
  method?: 'POST' | 'GET'
  submitText: string
  submittingText?: string
  successMessage: string
  errorMessage?: string
  redirectUrl?: string
  fields: FormFieldConfig[]
  sections?: FormSection[]
  honeypotField?: string
}

// ----------------------------------------
// SHARED FIELD DEFINITIONS
// Reusable field configurations
// ----------------------------------------

export const SHARED_FIELDS: Record<string, FormFieldConfig> = {
  name: {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Your full name',
    required: true,
    gridColumn: 'half',
    autocomplete: 'name',
  },
  firstName: {
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    placeholder: 'First name',
    required: true,
    gridColumn: 'half',
    autocomplete: 'given-name',
  },
  lastName: {
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Last name',
    required: true,
    gridColumn: 'half',
    autocomplete: 'family-name',
  },
  email: {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
    gridColumn: 'half',
    autocomplete: 'email',
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
  },
  phone: {
    name: 'phone',
    type: 'tel',
    label: 'Phone',
    placeholder: '07xxx xxxxxx',
    gridColumn: 'half',
    autocomplete: 'tel',
  },
  message: {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    placeholder: 'How can we help you?',
    gridColumn: 'full',
    validation: {
      maxLength: 2000,
    },
  },
  propertyAddress: {
    name: 'property_address',
    type: 'text',
    label: 'Property Address',
    placeholder: 'Enter the property address',
    required: true,
    gridColumn: 'full',
  },
  postcode: {
    name: 'postcode',
    type: 'text',
    label: 'Postcode',
    placeholder: 'e.g. SW1A 1AA',
    required: true,
    gridColumn: 'half',
    autocomplete: 'postal-code',
    validation: {
      pattern: '^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$',
    },
  },
  preferredDate: {
    name: 'preferred_date',
    type: 'date',
    label: 'Preferred Date',
    gridColumn: 'half',
  },
  marketingOptIn: {
    name: 'marketing_opt_in',
    type: 'checkbox',
    label: 'I agree to receive marketing communications',
    gridColumn: 'full',
  },
}

// ----------------------------------------
// ENQUIRY TYPE OPTIONS
// ----------------------------------------

export const ENQUIRY_TYPE_OPTIONS: FormFieldOption[] = [
  { value: 'general_enquiry', label: 'General Enquiry' },
  { value: 'viewing_request', label: 'Book a Viewing' },
  { value: 'valuation_request', label: 'Request Valuation' },
  { value: 'property_question', label: 'Property Question' },
  { value: 'callback_request', label: 'Request a Callback' },
]

export const PROPERTY_INTEREST_OPTIONS: FormFieldOption[] = [
  { value: 'buying', label: 'Buying' },
  { value: 'selling', label: 'Selling' },
  { value: 'renting', label: 'Renting' },
  { value: 'letting', label: 'Letting' },
  { value: 'other', label: 'Other' },
]

export const PROPERTY_TYPE_OPTIONS: FormFieldOption[] = [
  { value: 'detached', label: 'Detached House' },
  { value: 'semi-detached', label: 'Semi-Detached House' },
  { value: 'terraced', label: 'Terraced House' },
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'other', label: 'Other' },
]

export const BEDROOMS_OPTIONS: FormFieldOption[] = [
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
]

export const TIME_FRAME_OPTIONS: FormFieldOption[] = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: '6_months', label: 'Within 6 months' },
  { value: 'no_rush', label: 'No rush' },
]

// ----------------------------------------
// FORM CONFIGURATIONS
// ----------------------------------------

export const formConfigs: Record<string, FormConfig> = {
  // Contact/Enquiry Form
  contact: {
    id: 'contact-form',
    name: 'Contact Form',
    endpoint: '/api/enquiry',
    submitText: 'Send Message',
    submittingText: 'Sending...',
    successMessage: 'Thank you! We\'ll be in touch soon.',
    errorMessage: 'Something went wrong. Please try again.',
    honeypotField: 'website',
    fields: [
      SHARED_FIELDS.name,
      SHARED_FIELDS.email,
      SHARED_FIELDS.phone,
      {
        name: 'enquiry_type',
        type: 'select',
        label: 'Subject',
        placeholder: 'Select a subject',
        options: ENQUIRY_TYPE_OPTIONS,
        gridColumn: 'full',
      },
      { ...SHARED_FIELDS.message, required: true },
    ],
  },

  // Property Enquiry (sidebar form)
  propertyEnquiry: {
    id: 'property-enquiry-form',
    name: 'Property Enquiry',
    endpoint: '/api/enquiry',
    submitText: 'Send Enquiry',
    submittingText: 'Sending...',
    successMessage: 'Thank you! We\'ll be in touch soon.',
    redirectUrl: '/thank-you',
    honeypotField: 'website',
    fields: [
      SHARED_FIELDS.name,
      SHARED_FIELDS.email,
      SHARED_FIELDS.phone,
      SHARED_FIELDS.message,
    ],
  },

  // Viewing Request
  viewingRequest: {
    id: 'viewing-request-form',
    name: 'Viewing Request',
    endpoint: '/api/enquiry',
    submitText: 'Request Viewing',
    submittingText: 'Sending...',
    successMessage: 'Your viewing request has been submitted. We\'ll confirm shortly.',
    redirectUrl: '/thank-you',
    honeypotField: 'website',
    fields: [
      SHARED_FIELDS.name,
      SHARED_FIELDS.email,
      SHARED_FIELDS.phone,
      SHARED_FIELDS.preferredDate,
      {
        name: 'preferred_time',
        type: 'select',
        label: 'Preferred Time',
        gridColumn: 'half',
        options: [
          { value: 'morning', label: 'Morning (9am-12pm)' },
          { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
          { value: 'evening', label: 'Evening (5pm-8pm)' },
          { value: 'flexible', label: 'Flexible' },
        ],
      },
      SHARED_FIELDS.message,
    ],
  },

  // Valuation Request
  valuationRequest: {
    id: 'valuation-request-form',
    name: 'Valuation Request',
    endpoint: '/api/enquiry',
    submitText: 'Request Valuation',
    submittingText: 'Sending...',
    successMessage: 'Thank you! We\'ll arrange your free valuation soon.',
    redirectUrl: '/thank-you',
    honeypotField: 'website',
    fields: [
      SHARED_FIELDS.name,
      SHARED_FIELDS.email,
      SHARED_FIELDS.phone,
      SHARED_FIELDS.propertyAddress,
      SHARED_FIELDS.postcode,
      {
        name: 'property_type',
        type: 'select',
        label: 'Property Type',
        options: PROPERTY_TYPE_OPTIONS,
        gridColumn: 'half',
      },
      {
        name: 'bedrooms',
        type: 'select',
        label: 'Bedrooms',
        options: BEDROOMS_OPTIONS,
        gridColumn: 'half',
      },
      {
        name: 'valuation_reason',
        type: 'select',
        label: 'Reason for Valuation',
        gridColumn: 'full',
        options: [
          { value: 'selling', label: 'Looking to sell' },
          { value: 'letting', label: 'Looking to let' },
          { value: 'curious', label: 'Just curious' },
          { value: 'remortgage', label: 'Remortgage' },
          { value: 'other', label: 'Other' },
        ],
      },
      SHARED_FIELDS.message,
    ],
    sections: [
      {
        title: 'Your Details',
        fields: ['name', 'email', 'phone'],
      },
      {
        title: 'Property Details',
        fields: ['property_address', 'postcode', 'property_type', 'bedrooms', 'valuation_reason'],
      },
      {
        title: 'Additional Information',
        fields: ['message'],
      },
    ],
  },

  // Newsletter Signup
  newsletter: {
    id: 'newsletter-form',
    name: 'Newsletter Signup',
    endpoint: '/api/newsletter',
    submitText: 'Subscribe',
    submittingText: 'Subscribing...',
    successMessage: 'You\'re subscribed! Check your inbox to confirm.',
    honeypotField: 'website',
    fields: [
      {
        ...SHARED_FIELDS.email,
        gridColumn: 'full',
        placeholder: 'Enter your email',
      },
    ],
  },

  // Instant Valuation (simplified)
  instantValuation: {
    id: 'instant-valuation-form',
    name: 'Instant Valuation',
    endpoint: '/api/instant-valuation',
    submitText: 'Get Estimate',
    submittingText: 'Calculating...',
    successMessage: 'Check your inbox for your property estimate!',
    honeypotField: 'website',
    fields: [
      {
        ...SHARED_FIELDS.postcode,
        gridColumn: 'full',
        placeholder: 'Enter your postcode',
      },
      {
        ...SHARED_FIELDS.email,
        gridColumn: 'full',
      },
    ],
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Get a form configuration by ID
 */
export function getFormConfig(formId: string): FormConfig | undefined {
  return formConfigs[formId]
}

/**
 * Create a custom form config with defaults
 */
export function createFormConfig(config: Partial<FormConfig> & { id: string; fields: FormFieldConfig[] }): FormConfig {
  return {
    name: config.name || config.id,
    endpoint: config.endpoint || '/api/enquiry',
    submitText: config.submitText || 'Submit',
    submittingText: config.submittingText || 'Submitting...',
    successMessage: config.successMessage || 'Thank you for your submission.',
    errorMessage: config.errorMessage || 'Something went wrong. Please try again.',
    honeypotField: 'website',
    ...config,
  }
}

/**
 * Get field from shared fields by name
 */
export function getSharedField(fieldName: keyof typeof SHARED_FIELDS): FormFieldConfig {
  return { ...SHARED_FIELDS[fieldName] }
}
