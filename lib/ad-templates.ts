export interface AdTemplate {
  id: string
  name: string
  description: string
  previewUrl: string
  type: "static" | "video" | "social"
  jsonTemplate: Record<string, any>
}

export const adTemplates: AdTemplate[] = [
  // First row - 4 templates (unchanged from previous reordering)
  {
    id: "skincare-product",
    name: "Skincare Solution",
    description: "Professional skincare product with ingredient highlights",
    previewUrl: "/skincare-product-ad.png",
    type: "static",
    jsonTemplate: {
      style: "ingredient-focused",
      layout: "vertical",
      colors: {
        primary: "#0047AB",
        secondary: "#FFFFFF",
        text: "#FFFFFF",
      },
      elements: {
        headline: "{{headline}}",
        productName: "{{productName}}",
        ingredients: [
          { name: "Tretinoin", benefit: "Increases collagen production" },
          { name: "Tranexamic Acid", benefit: "Helps lighten dark spots" },
          { name: "Niacinamide", benefit: "Repairs & defends against skin damage" },
        ],
        cta: "{{cta}}",
      },
    },
  },
  {
    id: "hair-product",
    name: "Hair Care Product",
    description: "Highlight your hair product benefits with a clean design",
    previewUrl: "/hair-product-ad.png",
    type: "static",
    jsonTemplate: {
      ad_config: {
        image_specs: {
          style: "photorealistic",
          resolution: "4K",
          aspect_ratio: "1:1",
          orientation: "square",
          file_format: "PNG",
        },
        subject: {
          type: "product",
          description: "[USER_PRODUCT_DESCRIPTION]",
          position: "centered",
          details: {
            size: "[USER_PRODUCT_SIZE]",
            branding: "[USER_BRAND_NAME]",
          },
        },
        background: {
          setting: "solid pastel color",
          color: "[USER_BACKGROUND_COLOR]",
          elements: [
            {
              type: "decorative",
              items: ["subtle wavy lines"],
              position: "top-left and bottom-right corners",
              color: "[USER_ACCENT_COLOR]",
            },
          ],
        },
        text_overlay: {
          headline: {
            text: "[USER_HEADLINE]",
            font: "bold sans-serif",
            size: "36pt",
            color: "[USER_TEXT_COLOR]",
            position: "top-center",
            alignment: "center",
          },
          benefits: [
            {
              text: "[USER_BENEFIT_1]",
              font: "sans-serif",
              size: "18pt",
              color: "[USER_TEXT_COLOR]",
              background: "white box with rounded edges",
              position: "left of the product",
            },
            {
              text: "[USER_BENEFIT_2]",
              font: "sans-serif",
              size: "18pt",
              color: "[USER_TEXT_COLOR]",
              background: "white box with rounded edges",
              position: "right of the product",
            },
            {
              text: "[USER_BENEFIT_3]",
              font: "sans-serif",
              size: "18pt",
              color: "[USER_TEXT_COLOR]",
              background: "white box with rounded edges",
              position: "bottom-left of the product",
            },
          ],
          social_proof: {
            text: "5 Stars",
            icon: "five yellow stars",
            background: "white box",
            position: "top-right, near headline",
            alignment: "center",
          },
          badge: {
            text: "[USER_BADGE_TEXT]",
            font: "sans-serif",
            size: "16pt",
            color: "[USER_TEXT_COLOR]",
            background: "yellow circle",
            position: "bottom-right",
          },
        },
        lighting: {
          primary: "soft natural light from above",
          effects: ["subtle shadows for depth"],
        },
        additional_instructions: {
          mood: "playful, approachable, benefit-focused",
          reference: "use the user-uploaded product images to ensure accuracy",
        },
      },
    },
  },
  {
    id: "daily-greens",
    name: "Daily Nutrition",
    description: "Minimalist design highlighting nutritional benefits",
    previewUrl: "/daily-greens-ad.png",
    type: "static",
    jsonTemplate: {
      ad_config: {
        image_specs: {
          style: "photorealistic",
          resolution: "4K",
          aspect_ratio: "1:1",
          orientation: "square",
          file_format: "PNG",
        },
        subject: {
          type: "product",
          description: "[USER_PRODUCT_DESCRIPTION]",
          position: "center-right",
          details: {
            size: "[USER_PRODUCT_SIZE]",
            branding: "[USER_BRAND_NAME]",
          },
        },
        background: {
          setting: "solid color",
          color: "[USER_BACKGROUND_COLOR]",
        },
        text_overlay: {
          headline: {
            text: "[USER_HEADLINE]",
            font: "bold sans-serif",
            size: "36pt",
            color: "[USER_TEXT_COLOR]",
            position: "top-center",
            alignment: "center",
          },
          benefits: [
            {
              icon: "[USER_BENEFIT_1_ICON]",
              text: "[USER_BENEFIT_1]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "left side, top",
            },
            {
              icon: "[USER_BENEFIT_2_ICON]",
              text: "[USER_BENEFIT_2]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "left side, second from top",
            },
            {
              icon: "[USER_BENEFIT_3_ICON]",
              text: "[USER_BENEFIT_3]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "left side, third from top",
            },
            {
              icon: "[USER_BENEFIT_4_ICON]",
              text: "[USER_BENEFIT_4]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "left side, bottom",
            },
          ],
          cta: {
            text: "[USER_CTA]",
            font: "bold sans-serif",
            size: "24pt",
            color: "[USER_TEXT_COLOR]",
            position: "bottom-left",
          },
        },
        lighting: {
          primary: "soft natural light from above",
          effects: ["subtle shadows for depth"],
        },
        additional_instructions: {
          mood: "clean, minimal, benefit-focused",
          reference: "use the user-uploaded product images to ensure accuracy",
        },
      },
    },
  },
  {
    id: "health-supplement",
    name: "Health Supplement",
    description: "Showcase health benefits with vibrant green background",
    previewUrl: "/health-supplement-ad.png",
    type: "static",
    jsonTemplate: {
      ad_config: {
        image_specs: {
          style: "photorealistic",
          resolution: "4K",
          aspect_ratio: "1:1",
          orientation: "square",
          file_format: "PNG",
        },
        subject: {
          type: "product",
          description: "[USER_PRODUCT_DESCRIPTION]",
          position: "centered, slightly tilted for dynamic effect",
          details: {
            size: "[USER_PRODUCT_SIZE]",
            branding: "[USER_BRAND_NAME]",
          },
        },
        background: {
          setting: "solid color with slight gradient",
          color: "[USER_BACKGROUND_COLOR]",
        },
        text_overlay: {
          headline: {
            text: "[USER_HEADLINE]",
            font: "bold sans-serif",
            size: "36pt",
            color: "[USER_TEXT_COLOR]",
            position: "top-center",
            alignment: "center",
          },
          benefits: [
            {
              text: "[USER_BENEFIT_1]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "top-left of product",
            },
            {
              text: "[USER_BENEFIT_2]",
              font: "sans-serif",
              size: "14pt",
              color: "[USER_TEXT_COLOR]",
              position: "top-right of product",
            },
            {
              text: "[USER_BENEFIT_3]",
              font: "sans-serif",
              size: "18pt",
              color: "[USER_TEXT_COLOR]",
              position: "right of product, middle",
            },
            {
              text: "[USER_BENEFIT_4]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "bottom-right of product",
            },
            {
              text: "[USER_BENEFIT_5]",
              font: "sans-serif",
              size: "14pt",
              color: "[USER_TEXT_COLOR]",
              position: "left of product, middle",
            },
            {
              text: "[USER_BENEFIT_6]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "bottom-left of product",
            },
            {
              text: "[USER_BENEFIT_7]",
              font: "sans-serif",
              size: "14pt",
              color: "[USER_TEXT_COLOR]",
              position: "right of product, bottom",
            },
            {
              text: "[USER_BENEFIT_8]",
              font: "sans-serif",
              size: "16pt",
              color: "[USER_TEXT_COLOR]",
              position: "left of product, top",
            },
          ],
          cta: {
            text: "[USER_CTA]",
            font: "sans-serif",
            size: "18pt",
            color: "[USER_CTA_TEXT_COLOR]",
            background: "[USER_CTA_BACKGROUND_COLOR]",
            position: "bottom-center",
          },
        },
        lighting: {
          primary: "soft natural light from above",
          effects: ["subtle shadows for depth"],
        },
        additional_instructions: {
          mood: "playful, vibrant, benefit-focused",
          reference: "use the user-uploaded product images to ensure accuracy",
        },
      },
    },
  },
  // Second row - 4 templates (unchanged)
  {
    id: "food-bar",
    name: "Food Bar",
    description: "Showcase eco-friendly food products with key benefits",
    previewUrl: "/food-bar-ad.png",
    type: "static",
    jsonTemplate: {
      style: "eco-friendly",
      layout: "vertical",
      colors: {
        primary: "#F9A826",
        secondary: "#FFFFFF",
        text: "#FFFFFF",
      },
      elements: {
        headline: "{{headline}}",
        subheadline: "{{subheadline}}",
        features: [
          { feature: "Home compostable wrapper" },
          { feature: "65% less sugar" },
          { feature: "You buy a bar. We plant a tree." },
        ],
        cta: "{{cta}}",
      },
    },
  },
  {
    id: "longevity-supplement",
    name: "Longevity Supplement",
    description: "Elegant supplement with anti-aging benefits",
    previewUrl: "/longevity-supplement-ad.png",
    type: "static",
    jsonTemplate: {
      style: "elegant-minimal",
      layout: "vertical",
      colors: {
        primary: "#E6E6FA",
        secondary: "#483D8B",
        text: "#191970",
      },
      elements: {
        headline: "{{headline}}",
        subheadline: "{{subheadline}}",
        productName: "{{productName}}",
        description: "{{description}}",
      },
    },
  },
  {
    id: "hydration-product",
    name: "Hydration Product",
    description: "Compare hydration products with nutritional information",
    previewUrl: "/hydration-product-ad.png",
    type: "static",
    jsonTemplate: {
      style: "comparison",
      layout: "vertical",
      colors: {
        primary: "#CCFFCC",
        secondary: "#00CC66",
        text: "#006633",
      },
      elements: {
        headline: "{{headline}}",
        productName: "{{productName}}",
        nutritionalInfo: [
          { label: "Electrolytes", value: "1,899mg" },
          { label: "Sugar", value: "0g" },
          { label: "Calories", value: "10" },
        ],
        cta: "{{cta}}",
      },
    },
  },
  {
    id: "mushroom-coffee",
    name: "Mushroom Coffee",
    description: "Highlight the benefits of alternative coffee products",
    previewUrl: "/mushroom-coffee-ad.png",
    type: "static",
    jsonTemplate: {
      style: "benefit-focused",
      layout: "central",
      colors: {
        primary: "#FFFFFF",
        secondary: "#000000",
        text: "#000000",
      },
      elements: {
        headline: "{{headline}}",
        productName: "{{productName}}",
        benefits: [
          { feature: "Low acidity" },
          { feature: "No jitters" },
          { feature: "Less caffeine" },
          { feature: "Balanced digestion" },
          { feature: "No brain fog" },
        ],
        cta: "{{cta}}",
      },
    },
  },
]
