// ========================================
// FORM PAGE CONFIGURATIONS
// ========================================

import type { FormPageConfig, FaqItem } from './types'

// ========================================
// DEFAULT FAQ ITEMS
// ========================================

export const contactFaqs: FaqItem[] = [
  {
    question: 'What are your office hours?',
    answer: 'Our offices are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 4:00 PM. We\'re closed on Sundays, but you can contact us anytime via our online form.'
  },
  {
    question: 'How quickly will you respond to my enquiry?',
    answer: 'We aim to respond to all enquiries within 24 hours during business days. Urgent viewing requests and high-priority enquiries are typically handled the same day.'
  },
  {
    question: 'Can I book a property viewing online?',
    answer: 'Yes! You can request a viewing through our website by visiting any property page and using the "Request a Viewing" form. We\'ll confirm your appointment within hours.'
  },
  {
    question: 'Do you offer free property valuations?',
    answer: 'Absolutely! We provide complimentary property valuations with no obligation. Simply fill out our valuation request form, and one of our experts will be in touch within 24 hours.'
  },
  {
    question: 'Which areas do you cover?',
    answer: 'We have offices across London covering North, South, and Central areas. Our experienced team handles properties throughout Greater London and surrounding areas.'
  },
  {
    question: 'How can I speak to someone directly?',
    answer: 'You can call any of our offices directly, or use the contact form above and we\'ll call you back at your preferred time.'
  }
]

export const valuationFaqs: FaqItem[] = [
  {
    question: 'Is the valuation really free?',
    answer: 'Yes, absolutely. We provide free, no-obligation property valuations with no hidden costs. Whether you\'re thinking of selling now or in the future, there\'s no charge and no pressure to proceed.'
  },
  {
    question: 'How accurate are your valuations?',
    answer: 'Our valuations are based on real, up-to-date market data including recent sales, current listings, and local demand. We combine this with our agents\' local expertise to provide realistic figures you can trust.'
  },
  {
    question: 'Do I have to sell with you?',
    answer: 'Not at all. This is a completely free service with no obligation. Many people request valuations for financial planning, curiosity, or to understand their options. If and when you do decide to sell, we\'d love to help—but there\'s no pressure.'
  },
  {
    question: 'How long does it take?',
    answer: 'The form takes about 2 minutes to complete. You\'ll receive your detailed valuation report within 24 hours. If you\'d prefer a more in-depth assessment with a home visit, we can arrange that too.'
  },
  {
    question: 'What information do you need?',
    answer: 'Just basic details: your property address, type, number of bedrooms, and an optional estimate of what you think it\'s worth. This helps us prepare an accurate valuation tailored to your property.'
  },
  {
    question: 'Will you contact me afterwards?',
    answer: 'We\'ll send your valuation report and may follow up once to see if you have questions. We won\'t bombard you with calls or emails. You can opt out of marketing communications anytime.'
  }
]

// ========================================
// PAGE CONFIGURATIONS
// ========================================

export const contactPageConfig: FormPageConfig = {
  hero: {
    title: 'Get In Touch',
    subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    blockKey: 'contact_details'
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions',
    items: contactFaqs
  }
}

export const valuationPageConfig: FormPageConfig = {
  hero: {
    title: 'Free Property Valuation',
    subtitle: 'Discover what your property is worth with a free, no-obligation market valuation from our local experts.'
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our valuation service',
    items: valuationFaqs
  }
}

// ========================================
// FORM SUBJECT OPTIONS (Contact Form)
// ========================================

export const contactSubjectOptions = [
  { value: '', label: 'Please select...' },
  { value: 'general_enquiry', label: 'General Question' },
  { value: 'property_enquiry', label: 'Property Enquiry' },
  { value: 'viewing_request', label: 'Request a Viewing' },
  { value: 'valuation_request', label: 'Property Valuation' },
  { value: 'selling_enquiry', label: 'Selling a Property' },
  { value: 'buying_enquiry', label: 'Buying a Property' },
  { value: 'lettings_enquiry', label: 'Lettings Enquiry' },
  { value: 'other', label: 'Other' }
]

// ========================================
// PROPERTY TYPE OPTIONS (Valuation Form)
// ========================================

export const propertyTypeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'terraced', label: 'Terraced House' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'detached', label: 'Detached House' },
  { value: 'other', label: 'Other' }
]

export const bedroomOptions = [
  { value: '', label: 'Select...' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6+', label: '6+' }
]

export const valuationReasonOptions = [
  { value: '', label: 'Select reason...' },
  { value: 'selling', label: 'Planning to sell' },
  { value: 'curious', label: 'Just curious' },
  { value: 'remortgage', label: 'Remortgage' },
  { value: 'inheritance', label: 'Inheritance/Tax' },
  { value: 'other', label: 'Other' }
]
