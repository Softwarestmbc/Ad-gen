import { type NextRequest, NextResponse } from "next/server"
import { mockGenerateImage } from "@/lib/mock-api"

// This is a fallback API route that uses a mock implementation
// when the real image generation API is not available
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const prompt = body.prompt || body.text || "Generate a placeholder advertisement image"

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use the mock implementation
    const result = await mockGenerateImage(prompt)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in fallback generate:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
