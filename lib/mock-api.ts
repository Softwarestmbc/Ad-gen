// This file provides a mock implementation of the image generation API
// for testing purposes when the real API is not available

export async function mockGenerateImage(prompt: string): Promise<{ images: string[] }> {
  console.log("MOCK API: Generating image with prompt:", prompt)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a colored rectangle based on the prompt
  // This is a very simple placeholder - in a real app, you might use a more sophisticated approach
  const colors = {
    product: "#4285F4", // Blue
    coffee: "#795548", // Brown
    pet: "#FF5722", // Orange
    sleep: "#3F51B5", // Indigo
    food: "#FFC107", // Amber
    wellness: "#607D8B", // Blue Gray
    travel: "#9C27B0", // Purple
    real: "#4CAF50", // Green
    default: "#9E9E9E", // Gray
  }

  // Determine color based on prompt keywords
  let color = colors.default
  for (const [key, value] of Object.entries(colors)) {
    if (prompt.toLowerCase().includes(key)) {
      color = value
      break
    }
  }

  // Create a simple SVG as a base64 string
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="${color}" />
      <text x="400" y="300" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        Mock Ad: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}
      </text>
    </svg>
  `

  // Convert SVG to base64
  const base64 = Buffer.from(svg).toString("base64")

  return {
    images: [base64],
  }
}
