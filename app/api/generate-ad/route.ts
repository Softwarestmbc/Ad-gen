import { type NextRequest, NextResponse } from "next/server"
import { adTemplates } from "@/lib/ad-templates"

// This would be a real function that scrapes website data
async function scrapeWebsiteData(url: string) {
  // In a real implementation, this would use Gemini API to scrape the website
  // For demo purposes, we'll return mock data
  console.log(`Scraping data from ${url}...`)

  return {
    title: "Amazing Product",
    description: "The best product in its category with incredible features.",
    colors: {
      primary: "#4285F4", // Google blue
      secondary: "#34A853", // Google green
    },
    features: ["High quality materials", "Long-lasting performance", "Eco-friendly design"],
    pricing: "$99.99",
    cta: "Shop Now",
  }
}

// This function fills in the template with website data
function fillTemplateWithData(template: Record<string, any>, websiteData: any) {
  // Deep clone the template to avoid modifying the original
  const filledTemplate = JSON.parse(JSON.stringify(template))

  // Example of filling in some placeholders
  if (filledTemplate.elements.headline) {
    filledTemplate.elements.headline = websiteData.title
  }

  if (filledTemplate.elements.description) {
    filledTemplate.elements.description = websiteData.description
  }

  if (filledTemplate.elements.cta) {
    filledTemplate.elements.cta = websiteData.cta
  }

  return filledTemplate
}

// Generate a prompt based on the template and website data
function generatePrompt(templateData: Record<string, any>, websiteData: any) {
  const style = templateData.style || "professional"
  const colors = templateData.colors?.primary || "#000000"
  const layout = templateData.layout || "vertical"

  // Create a detailed prompt for the image generation API
  let prompt = `Create a professional ${style} advertisement with ${layout} layout.\n`
  prompt += `Title: "${websiteData.title}"\n`
  prompt += `Description: "${websiteData.description}"\n`

  if (websiteData.features && websiteData.features.length > 0) {
    prompt += `Features: ${websiteData.features.join(", ")}\n`
  }

  if (websiteData.pricing) {
    prompt += `Price: ${websiteData.pricing}\n`
  }

  if (websiteData.cta) {
    prompt += `Call to action: "${websiteData.cta}"\n`
  }

  prompt += `Primary color: ${colors}\n`
  prompt += `Make it visually appealing, professional, and optimized for marketing purposes.`

  return prompt
}

// This function generates an image using the external API
async function generateImage(templateData: Record<string, any>, websiteData: any) {
  try {
    const promptText = generatePrompt(templateData, websiteData)
    console.log("Generated prompt:", promptText)

    // First try the external API
    try {
      // The API expects a different format - the prompt needs to be in a field called "text"
      const response = await fetch("https://involved-yelena-ryugon07-6c6a58d7.koyeb.app/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          text: promptText, // Changed from "prompt" to "text"
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error (${response.status}):`, errorText)
        throw new Error(`API responded with status: ${response.status}. Details: ${errorText}`)
      }

      const data = await response.json()
      console.log("API response:", JSON.stringify(data).substring(0, 200) + "...")

      // Check if we have images in the response
      if (data.images && data.images.length > 0) {
        // Return the first image as a data URL
        return `data:image/png;base64,${data.images[0]}`
      } else {
        throw new Error("No images returned from API")
      }
    } catch (externalApiError) {
      console.error("External API error:", externalApiError)
      console.log("Falling back to internal mock API...")

      // If the external API fails, fall back to our internal mock API
      const fallbackResponse = await fetch("/api/fallback-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptText,
        }),
      })

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed with status: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.images && fallbackData.images.length > 0) {
        return `data:image/png;base64,${fallbackData.images[0]}`
      } else {
        throw new Error("No images returned from fallback API")
      }
    }
  } catch (error) {
    console.error("Error generating image:", error)
    // Return a placeholder image in case of error
    return createPlaceholderImageUrl(templateData, websiteData)
  }
}

// Helper function to create a placeholder image URL
function createPlaceholderImageUrl(templateData: Record<string, any>, websiteData: any) {
  const style = templateData.style || "professional"
  const headline = encodeURIComponent(websiteData.title || "Product Ad")
  return `/placeholder.svg?height=800&width=800&query=professional ad for ${headline} with ${style} style`
}

export async function POST(request: NextRequest) {
  try {
    const { templateId, websiteUrl } = await request.json()

    // Find the selected template
    const template = adTemplates.find((t) => t.id === templateId)
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // 1. Scrape website data
    const websiteData = await scrapeWebsiteData(websiteUrl)

    // 2. Fill template with website data
    const filledTemplate = fillTemplateWithData(template.jsonTemplate, websiteData)

    // 3. Generate image using the filled template and website data
    const imageUrl = await generateImage(filledTemplate, websiteData)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      {
        error: "Failed to generate ad",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
