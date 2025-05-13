import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import OpenAI, { toFile } from "openai"

export async function POST(request: NextRequest) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Define the image files
    const imageFiles = ["bath-bomb.png", "body-lotion.png", "incense-kit.png", "soap.png"]

    // Get the public directory path
    const publicDir = path.join(process.cwd(), "public")

    // Convert the images to OpenAI file objects
    const images = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = path.join(publicDir, file)
        return await toFile(fs.createReadStream(filePath), file, {
          type: "image/png",
        })
      }),
    )

    // Get the prompt from the request or use a default
    const { prompt = "Create a lovely gift basket with these four items in it" } = await request
      .json()
      .catch(() => ({}))

    // Call the OpenAI API to edit the images
    const response = await client.images.edit({
      model: "dall-e-2",
      image: images[0], // Primary image
      mask: images[1], // Optional mask
      prompt: prompt,
    })

    // Return the generated image
    return NextResponse.json({
      success: true,
      image: response.data[0].url || response.data[0].b64_json,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
