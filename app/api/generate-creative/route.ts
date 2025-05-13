import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { generateMockImage } from "@/lib/mock-image-generator"
import { adTemplates } from "@/lib/ad-templates"

// Initialize the OpenAI client with the API key from environment variables
// Add proper null checking for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
})

// Create a detailed prompt from the template
function createPromptFromTemplate(
  template: any,
  additionalPrompt = "",
  websiteData?: any,
  uploadedImages?: string[],
  templateId?: string,
): string {
  let prompt = "Create a professional advertisement with the following specifications:\n\n"

  try {
    // Add reference to the template image if templateId is provided
    if (templateId) {
      const templateImage = getTemplateImageReference(templateId)
      prompt += `REFERENCE IMAGE: Use the layout, style, and design elements of the "${getTemplateName(templateId)}" template which features: ${templateImage}\n\n`
    }

    // Add style information - Add null checks
    const style = template?.style || template?.ad_config?.image_specs?.style || "professional"
    prompt += `Style: ${style}\n`

    // Add format/aspect ratio - Add null checks
    if (template?.ad_config?.image_specs?.aspect_ratio) {
      prompt += `Format: ${template.ad_config.image_specs.aspect_ratio}\n`
    }

    // Add background information - Add null checks
    const backgroundColor = template?.colors?.primary || template?.ad_config?.background?.color || "#FFFFFF"
    const backgroundSetting = template?.ad_config?.background?.setting || "solid"
    prompt += `Background: ${backgroundSetting} color ${backgroundColor}\n`

    // Add product information - Add null checks
    if (template?.ad_config?.subject) {
      const productDescription = template.ad_config.subject.description || "Product"
      prompt += `Product: ${productDescription}\n`

      if (template.ad_config.subject.position) {
        prompt += `Position: ${template.ad_config.subject.position}\n`
      }

      if (template.ad_config.subject.details?.branding) {
        prompt += `Brand: ${template.ad_config.subject.details.branding}\n`
      }
    }

    // Add headline - Add null checks
    const headline = template?.elements?.headline || template?.ad_config?.text_overlay?.headline?.text || "Headline"
    prompt += `Headline: "${headline}"\n`

    // Add benefits/features - Add null checks with safe array handling
    if (template?.ad_config?.text_overlay?.benefits && Array.isArray(template.ad_config.text_overlay.benefits)) {
      prompt += "Benefits:\n"
      template.ad_config.text_overlay.benefits.forEach((benefit: any) => {
        if (benefit && typeof benefit === "object") {
          const benefitText = benefit.text || "Benefit"
          const benefitDescription = benefit.description ? `: ${benefit.description}` : ""
          prompt += `- ${benefitText}${benefitDescription}\n`
        }
      })
    } else if (template?.elements?.features && Array.isArray(template.elements.features)) {
      prompt += "Features:\n"
      template.elements.features.forEach((feature: any) => {
        if (feature) {
          const featureText = typeof feature === "string" ? feature : feature.feature || "Feature"
          prompt += `- ${featureText}\n`
        }
      })
    }

    // Add CTA - Add null checks
    const cta = template?.elements?.cta || template?.ad_config?.text_overlay?.cta?.text || "Shop Now"
    prompt += `Call to Action: "${cta}"\n`

    // Add disclaimer if present - Add null checks
    if (template?.ad_config?.text_overlay?.disclaimer?.text) {
      prompt += `Disclaimer: "${template.ad_config.text_overlay.disclaimer.text}"\n`
    }

    // Add reference to uploaded images
    if (uploadedImages && uploadedImages.length > 0) {
      prompt +=
        "\nProduct Image Reference: The ad should feature the product shown in the uploaded images. Use these images as reference for the product appearance, style, and presentation.\n"
    }

    // Add additional instructions
    if (additionalPrompt) {
      prompt += `\nAdditional Instructions: ${additionalPrompt}\n`
    }

    // Add website data guidance if available - Add null checks
    if (websiteData && typeof websiteData === "object") {
      if (websiteData.brandInfo) {
        prompt += "\nBrand Information:\n"
        prompt += `Brand Name: ${websiteData.brandInfo.name || "Brand"}\n`

        if (websiteData.brandInfo.industry) {
          prompt += `Industry: ${websiteData.brandInfo.industry}\n`
        }

        if (websiteData.brandInfo.brandVoice) {
          prompt += `Brand Voice: ${websiteData.brandInfo.brandVoice}\n`
        }
      }

      if (websiteData.adCreationGuidance) {
        prompt += "\nAd Guidance:\n"

        if (websiteData.adCreationGuidance.suggestedHeadline) {
          prompt += `Suggested Headline: ${websiteData.adCreationGuidance.suggestedHeadline}\n`
        }

        if (websiteData.adCreationGuidance.keyMessage) {
          prompt += `Key Message: ${websiteData.adCreationGuidance.keyMessage}\n`
        }

        if (websiteData.adCreationGuidance.visualStyle) {
          prompt += `Visual Style: ${websiteData.adCreationGuidance.visualStyle}\n`
        }

        if (websiteData.adCreationGuidance.toneRecommendation) {
          prompt += `Tone: ${websiteData.adCreationGuidance.toneRecommendation}\n`
        }
      }
    }
  } catch (error) {
    console.error("Error creating prompt from template:", error)
    // Provide a fallback prompt in case of errors
    return "Create a professional advertisement with a clean design, featuring the product prominently. Make it visually appealing and suitable for marketing purposes."
  }

  // Add final instructions for high-quality output
  prompt +=
    "\nCreate a photorealistic, professional advertisement suitable for marketing purposes. The image should be high-resolution, visually appealing, and optimized for commercial use."

  return prompt
}

// Helper function to get template name by ID
function getTemplateName(templateId: string): string {
  const template = adTemplates.find((t) => t.id === templateId)
  return template ? template.name : "Template"
}

// Helper function to get detailed template image reference
function getTemplateImageReference(templateId: string): string {
  const templateDescriptions: Record<string, string> = {
    "skincare-product":
      "a professional skincare product ad with a blue background, featuring a product on the left side and ingredient highlights with white text on the right side. The layout emphasizes key ingredients and benefits with a clean, premium aesthetic.",
    "hair-product":
      "a clean design with a centered product on a pastel background, benefit boxes with rounded edges on the left and right sides, and a star rating in the top corner. The layout is symmetrical with the product as the focal point.",
    "daily-greens":
      "a minimalist design with a product on the right side and benefit icons with text on the left side in a vertical arrangement. The background is light green with a clean, health-focused aesthetic.",
    "health-supplement":
      "a vibrant green background with a centered product and multiple benefit callouts arranged in a circular pattern around the product. The design emphasizes health benefits with a dynamic layout.",
    "food-bar":
      "an eco-friendly food product with a yellow/orange background and three key features listed with simple icons. The design has a warm, natural feel with sustainability messaging.",
    "longevity-supplement":
      "an elegant supplement with a light purple background, minimal text, and a clean, premium aesthetic. The design conveys luxury and scientific credibility.",
    "hydration-product":
      "a comparison-style ad with a light green background showing nutritional information in a structured format. The design emphasizes data and product benefits.",
    "mushroom-coffee":
      "a black and white design with a central product image and five benefits arranged in a circular pattern. The monochromatic design creates a sophisticated, premium feel.",
    "barcelona-travel-ad":
      "a travel advertisement featuring vibrant imagery of Barcelona with key attractions highlighted and a compelling call-to-action.",
    "blue-real-estate-ad":
      "a professional real estate advertisement with a blue color scheme, property images, and key selling points highlighted.",
    "blue-sleep-ad-mouthguard":
      "a calming blue-themed advertisement for a sleep mouthguard with benefits clearly displayed and a product image.",
    "orange-pet-boots-ad":
      "a warm orange-themed pet product advertisement featuring dog boots with key features and benefits highlighted.",
    "yellow-cookie-ad":
      "a bright yellow advertisement for cookies with appetizing product imagery and key selling points.",
    "coffee-ad": "a rich, warm-toned coffee advertisement with product imagery and flavor notes highlighted.",
  }

  return (
    templateDescriptions[templateId] ||
    "a professional product advertisement with clean layout and highlighted benefits"
  )
}

// Add a helper function to generate a fallback image
function generateFallbackImage(template: any): string {
  // Create a placeholder image URL with template details
  const style = template?.style || template?.ad_config?.image_specs?.style || "professional"
  const headline = template?.elements?.headline || template?.ad_config?.text_overlay?.headline?.text || "Advertisement"

  return `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(`${style} ad for ${headline}`)}`
}

export async function POST(request: NextRequest) {
  try {
    const { jsonTemplate, prompt, websiteData, uploadedImages, templateId } = await request.json()

    if (!jsonTemplate) {
      return NextResponse.json({ error: "JSON template is required" }, { status: 400 })
    }

    console.log("Received template for image generation:", JSON.stringify(jsonTemplate).substring(0, 200) + "...")
    console.log("Using template ID:", templateId || "No template ID provided")

    if (uploadedImages && uploadedImages.length > 0) {
      console.log(`Received ${uploadedImages.length} uploaded images for reference`)
    }

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      const fallbackImageUrl = generateFallbackImage(jsonTemplate)
      return NextResponse.json({
        imageUrl: fallbackImageUrl,
        warning: "OpenAI API key is not configured. Using fallback image.",
      })
    }

    try {
      // Create a detailed prompt for the image generation API
      const detailedPrompt = createPromptFromTemplate(jsonTemplate, prompt, websiteData, uploadedImages, templateId)

      console.log("Generating image with OpenAI using prompt:", detailedPrompt.substring(0, 200) + "...")

      // Add guard to check if prompt is empty
      if (!detailedPrompt?.trim()) {
        throw new Error("Empty prompt")
      }

      // Call OpenAI's image generation API with GPT-image-1 model
      const response = await openai.images.generate({
        model: "gpt-image-1", // Using GPT Image 1 model
        prompt: detailedPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      })

      // Check if we have images in the response
      if (response.data && response.data.length > 0 && response.data[0].b64_json) {
        // Return the first image as a data URL
        return NextResponse.json({
          imageUrl: `data:image/png;base64,${response.data[0].b64_json}`,
        })
      } else {
        throw new Error("No images returned from OpenAI API")
      }
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError)

      // Generate a fallback image
      const fallbackImageUrl = generateFallbackImage(jsonTemplate)

      return NextResponse.json({
        imageUrl: fallbackImageUrl,
        warning: apiError instanceof Error ? apiError.message : "Failed to generate image with OpenAI API",
      })
    }
  } catch (error) {
    console.error("Error in generate-creative API route:", error)

    // Create a detailed error message
    let errorDetails = "Unknown error"
    if (error instanceof Error) {
      errorDetails = error.message
      if (error.stack) {
        console.error("Stack trace:", error.stack)
      }
    } else {
      errorDetails = String(error)
    }

    // Always use the fallback image generator in case of errors
    try {
      const systemPrompt = "Fallback image due to server error"
      const mockImageUrl = generateMockImage(systemPrompt)

      return NextResponse.json({
        imageUrl: mockImageUrl,
        error: "Failed to generate creative",
        details: errorDetails,
        warning: "Using fallback image due to server error. Please try again later.",
      })
    } catch (fallbackError) {
      // If even the fallback fails, return a clear error
      console.error("Fallback image generation failed:", fallbackError)
      return NextResponse.json(
        {
          error: "Failed to generate creative",
          details: errorDetails,
        },
        { status: 500 },
      )
    }
  }
}
