import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { safeHex } from "@/lib/fillTemplate"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Define the interface for brand facts
interface BrandFacts {
  brand_name: string
  brand_description: string
  brand_primary?: string
  brand_secondary?: string
  brand_accent?: string
  brand_tagline?: string
  brand_tone?: string
  brand_unique_selling_point?: string
  brand_target_audience?: string
  brand_product_category?: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log(`Analyzing website: ${url}`)

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key is not configured")
      return NextResponse.json(
        {
          error: "Gemini API key is not configured",
          brandFacts: {
            brand_name: "Example Brand",
            brand_description: "A sample brand description",
            brand_primary: "#4F46E5",
            brand_tagline: "Innovation for everyone",
          },
        },
        { status: 200 },
      )
    }

    try {
      // Create a model instance - UPDATED TO USE gemini-2.0-flash
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      // Prepare the prompt for Gemini
      const prompt = `
      Analyze this website URL: ${url}
      
      Extract the following brand information in JSON format:
      
      1. brand_name: The name of the brand or company
      2. brand_description: A brief description of what the brand does or offers
      3. brand_primary: The primary brand color in hex format (e.g., #FF5733)
      4. brand_secondary: The secondary brand color in hex format (optional)
      5. brand_accent: An accent color in hex format (optional)
      6. brand_tagline: The brand's tagline or slogan (optional)
      7. brand_tone: The tone of voice used in brand communications (e.g., professional, friendly, technical) (optional)
      8. brand_unique_selling_point: What makes this brand unique (optional)
      9. brand_target_audience: Who the brand is targeting (optional)
      10. brand_product_category: The category of products or services offered (optional)
      
      Return ONLY valid JSON with these fields, nothing else. If you cannot determine a value, omit the field.
      `

      // Generate content with Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      console.log("Gemini response:", text.substring(0, 200) + "...")

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*?}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

      // Parse the JSON
      let facts: BrandFacts
      try {
        facts = JSON.parse(jsonString.trim())

        // Add guard to validate brand_primary
        if (!facts.brand_primary) {
          facts.brand_primary = "#000000"
        } else {
          facts.brand_primary = safeHex(facts.brand_primary)
        }

        // Apply safeHex to other color fields as well
        if (facts.brand_secondary) {
          facts.brand_secondary = safeHex(facts.brand_secondary)
        }

        if (facts.brand_accent) {
          facts.brand_accent = safeHex(facts.brand_accent)
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response as JSON:", parseError)
        throw new Error("Failed to parse brand information from Gemini response")
      }

      // Return the extracted brand facts
      return NextResponse.json({ brandFacts: facts })
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError)
      throw new Error(`Failed to analyze website with Gemini: ${geminiError.message}`)
    }
  } catch (error) {
    console.error("Error in analyze-website API route:", error)

    // Create a detailed error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Return a fallback response with default brand facts
    return NextResponse.json(
      {
        error: `Failed to analyze website: ${errorMessage}`,
        brandFacts: {
          brand_name: "Example Brand",
          brand_description: "A sample brand description",
          brand_primary: "#4F46E5",
          brand_tagline: "Innovation for everyone",
        },
      },
      { status: 500 },
    )
  }
}
