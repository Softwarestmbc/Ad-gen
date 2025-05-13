import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET(request: NextRequest) {
  const results = {
    openai: { valid: false, error: null as string | null },
    gemini: { valid: false, error: null as string | null },
  }

  // Check OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      })

      // Make a simple models list request to check if the key is valid
      await openai.models.list()
      results.openai.valid = true

      // Optionally check if gpt-image-1 is available
      try {
        const models = await openai.models.list()
        const hasGptImage = models.data.some((model) => model.id === "gpt-image-1")
        if (!hasGptImage) {
          results.openai.error = "API key is valid but gpt-image-1 model may not be available for this account"
        }
      } catch (modelError) {
        console.error("Error checking for gpt-image-1 model:", modelError)
      }
    } catch (error) {
      results.openai.error = error instanceof Error ? error.message : "Unknown error"
    }
  } else {
    results.openai.error = "API key not configured"
  }

  // Check Gemini API key
  if (process.env.GEMINI_API_KEY) {
    try {
      // Make a simple request to check if the key is valid
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY,
      )

      if (response.ok) {
        results.gemini.valid = true
      } else {
        const data = await response.json()
        results.gemini.error = data.error?.message || `HTTP error ${response.status}`
      }
    } catch (error) {
      results.gemini.error = error instanceof Error ? error.message : "Unknown error"
    }
  } else {
    results.gemini.error = "API key not configured"
  }

  return NextResponse.json(results)
}
