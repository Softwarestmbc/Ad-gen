/**
 * Safely processes a hex color code
 * @param hex Optional hex color code
 * @returns Validated 6-digit hex color with # prefix or #000000 if invalid
 */
export function safeHex(hex?: string): string {
  // Return default black if no hex provided
  if (!hex) return "#000000"

  // Remove # if present
  const cleanHex = hex.startsWith("#") ? hex.substring(1) : hex

  // Check if valid 3 or 6 digit hex
  const hexRegex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (!hexRegex.test(cleanHex)) return "#000000"

  // Convert 3-digit hex to 6-digit
  const normalizedHex =
    cleanHex.length === 3 ? cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] : cleanHex

  return "#" + normalizedHex.toLowerCase()
}

export interface BrandFacts {
  brand_name?: string
  brand_description?: string
  brand_primary?: string
  brand_secondary?: string
  brand_tagline?: string
  brand_usp?: string
  brand_target_audience?: string
  brand_tone?: string
  brand_values?: string
  product_name?: string
  product_description?: string
  product_benefits?: string
  product_features?: string
  product_price?: string
  product_category?: string
}

/**
 * Fills a template string with brand facts
 * @param template The template string with placeholders
 * @param facts The brand facts to insert
 * @returns The filled template
 */
export function fillTemplate(template: string, facts: BrandFacts): string {
  if (!template) return ""

  const f = facts || {}

  // Create a mapping of placeholders to values with empty string defaults
  const map = {
    USER_BRAND_NAME: f.brand_name || "",
    USER_BRAND_DESCRIPTION: f.brand_description || "",
    USER_BACKGROUND_COLOR: safeHex(f.brand_primary),
    USER_ACCENT_COLOR: f.brand_secondary || "",
    USER_TAGLINE: f.brand_tagline || "",
    USER_USP: f.brand_usp || "",
    USER_TARGET_AUDIENCE: f.brand_target_audience || "",
    USER_TONE: f.brand_tone || "",
    USER_VALUES: f.brand_values || "",
    USER_PRODUCT_NAME: f.product_name || "",
    USER_PRODUCT_DESCRIPTION: f.product_description || "",
    USER_PRODUCT_BENEFITS: f.product_benefits || "",
    USER_PRODUCT_FEATURES: f.product_features || "",
    USER_PRODUCT_PRICE: f.product_price || "",
    USER_PRODUCT_CATEGORY: f.product_category || "",
  }

  // Replace all placeholders with their values
  let result = template
  for (const [placeholder, value] of Object.entries(map)) {
    result = result.replaceAll(`{{${placeholder}}}`, value)
  }

  return result
}
