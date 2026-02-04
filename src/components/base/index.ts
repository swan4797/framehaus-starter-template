// ========================================
// BASE COMPONENTS INDEX
// Re-exports for all base UI components
// ========================================

// Note: In Astro, components are imported directly
// This file provides a centralized reference

export { default as Button } from './Button.astro'
export { default as Input } from './Input.astro'
export { default as Select } from './Select.astro'
export { default as Textarea } from './Textarea.astro'
export { default as Card } from './Card.astro'
export { default as Badge } from './Badge.astro'
export { default as Icon } from './Icon.astro'

// Re-export types
export type { Props as ButtonProps } from './Button.astro'
export type { Props as InputProps } from './Input.astro'
export type { Props as SelectProps, SelectOption } from './Select.astro'
export type { Props as TextareaProps } from './Textarea.astro'
export type { Props as CardProps } from './Card.astro'
export type { Props as BadgeProps } from './Badge.astro'
export type { Props as IconProps, IconName } from './Icon.astro'
