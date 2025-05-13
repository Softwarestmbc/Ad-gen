// Create a new file for mock image generation as fallback
export function generateMockImage(prompt: string): string {
  try {
    // Create a simple SVG with the prompt text
    const svg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f0f0f0" />
        <text x="512" y="50" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">Mock Ad Image</text>
        <text x="512" y="100" font-family="Arial" font-size="18" text-anchor="middle" fill="#666">Image generation failed</text>
        <text x="512" y="512" font-family="Arial" font-size="16" text-anchor="middle" fill="#999" width="800">
          ${prompt ? prompt.substring(0, 100) + (prompt.length > 100 ? "..." : "") : "No prompt provided"}
        </text>
      </svg>
    `

    // Convert SVG to base64
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
  } catch (error) {
    console.error("Error generating mock image:", error)

    // Create an even simpler fallback SVG if the main one fails
    const fallbackSvg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f0f0f0" />
        <text x="512" y="512" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">
          Image generation failed
        </text>
      </svg>
    `

    return `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString("base64")}`
  }
}
