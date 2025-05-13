import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Provide empty string as fallback
  dangerouslyAllowBrowser: true,
})

// Update the POST handler to include template reference if available
export async function POST(request: NextRequest) {
  try {
    // Log the request
    console.log("Received request to simple-image API")

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json({
        error: "OpenAI API key is not configured",
        imageUrl: "/api-key-missing.png",
      })
    }

    // Parse the request body
    let requestBody
    try {
      requestBody = await request.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          imageUrl: "/placeholder.svg?key=nwquv",
        },
        { status: 400 },
      )
    }

    // Extract the prompt and templateId if available
    const { prompt = "Generate a professional advertisement", templateId } = requestBody
    console.log("Using prompt:", prompt.substring(0, 100) + "...")

    // If templateId is provided, get the template reference
    let templateReference = ""
    if (templateId) {
      const templateName = getTemplateName(templateId)
      const templateDescription = getTemplateImageReference(templateId)
      templateReference = `Use the "${templateName}" template as a reference. The template has this layout and style: ${templateDescription}\n\n`
      console.log("Using template reference:", templateId)
    }

    try {
      // Call OpenAI's image generation API with the newer approach
      const response = await openai.images.generate({
        model: "gpt-image-1", // Using GPT Image 1 model instead of DALL-E 3
        prompt: `Generate a 4K 1:1 photorealistic ad with the following description:\n${templateReference}${prompt}`,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      })

      // Check if we have images in the response
      if (response.data && response.data.length > 0 && response.data[0].b64_json) {
        // Return the image as a data URL
        return NextResponse.json({
          imageUrl: `data:image/png;base64,${response.data[0].b64_json}`,
        })
      } else {
        throw new Error("No images returned from OpenAI API")
      }
    } catch (error) {
      console.error("Error generating image with OpenAI:", error)

      // Generate a placeholder image URL
      const placeholderUrl = `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(prompt.substring(0, 100))}`

      // Return the placeholder URL
      return NextResponse.json({
        imageUrl: placeholderUrl,
        message: "Using placeholder image - OpenAI API error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  } catch (error) {
    // Log the error
    console.error("Unhandled error in simple-image API:", error)

    // Return a fallback response
    return NextResponse.json(
      {
        error: "Server error",
        message: error instanceof Error ? error.message : "Unknown error",
        imageUrl: "/server-error-screen.png",
      },
      { status: 500 },
    )
  }
}

// Helper functions for template references
function getTemplateName(templateId: string): string {
  const templateNames: Record<string, string> = {
    "skincare-product": "Skincare Solution",
    "hair-product": "Hair Care Product",
    "daily-greens": "Daily Nutrition",
    "health-supplement": "Health Supplement",
    "food-bar": "Food Bar",
    "longevity-supplement": "Longevity Supplement",
    "hydration-product": "Hydration Product",
    "mushroom-coffee": "Mushroom Coffee",
    // Add other template names as needed
  }
  return templateNames[templateId] || "Template"
}

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
    // Add other template descriptions as needed
  }
  return (
    templateDescriptions[templateId] ||
    "a professional product advertisement with clean layout and highlighted benefits"
  )
}
