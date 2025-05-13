import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { generateMockImage } from "@/lib/mock-image-generator"

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// Update the POST handler to use OpenAI's API
export async function POST(request: NextRequest) {
  try {
    const { jsonTemplate, prompt } = await request.json()

    if (!jsonTemplate) {
      return NextResponse.json({ error: "JSON template is required" }, { status: 400 })
    }

    // Create a detailed prompt for the image generation API
    const detailedPrompt = createPromptFromTemplate(jsonTemplate, prompt)

    console.log("Generating image with OpenAI using prompt:", detailedPrompt.substring(0, 200) + "...")

    try {
      // Call OpenAI's image generation API
      const response = await openai.images.generate({
        model: "dall-e-3", // Using DALL-E 3 for high-quality images
        prompt: detailedPrompt,
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

      // Generate a fallback image
      const mockImageUrl = generateMockImage(detailedPrompt)

      return NextResponse.json({
        imageUrl: mockImageUrl,
        warning: error instanceof Error ? error.message : "Failed to generate image with OpenAI API",
      })
    }
  } catch (error) {
    console.error("Error in generate-creative-simple API route:", error)

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

    // Generate a fallback image
    const mockImageUrl = generateMockImage("Fallback image due to server error")

    return NextResponse.json({
      imageUrl: mockImageUrl,
      error: "Failed to generate creative",
      details: errorDetails,
      warning: "Using fallback image due to server error. Please try again later.",
    })
  }
}

// Create a detailed prompt from the template
function createPromptFromTemplate(template: any, additionalPrompt = ""): string {
  let prompt = "Create a professional advertisement with the following specifications:\n\n"

  // Add style information
  if (template.style || template.ad_config?.image_specs?.style) {
    prompt += `Style: ${template.style || template.ad_config?.image_specs?.style}\n`
  }

  // Add format/aspect ratio
  if (template.ad_config?.image_specs?.aspect_ratio) {
    prompt += `Format: ${template.ad_config.image_specs.aspect_ratio}\n`
  }

  // Add background information
  if (template.colors?.primary || template.ad_config?.background?.color) {
    prompt += `Background: ${template.ad_config?.background?.setting || "solid"} color ${template.colors?.primary || template.ad_config?.background?.color || "#FFFFFF"}\n`
  }

  // Add product information
  if (template.ad_config?.subject) {
    prompt += `Product: ${template.ad_config.subject.description || "Product"}\n`
    prompt += `Brand: ${template.ad_config.subject.details.branding || "Brand"}\n`
  }

  // Add headline
  if (template.elements?.headline || template.ad_config?.text_overlay?.headline) {
    prompt += `Headline: "${template.elements?.headline || template.ad_config?.text_overlay?.headline?.text || "Headline"}"\n`
  }

  // Add additional instructions
  if (additionalPrompt) {
    prompt += `\nAdditional Instructions: ${additionalPrompt}\n`
  }

  // Add final instructions for high-quality output
  prompt +=
    "\nCreate a photorealistic, professional advertisement suitable for marketing purposes. The image should be high-resolution, visually appealing, and optimized for commercial use."

  return prompt
}
