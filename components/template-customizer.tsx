import type React from "react"
// Update the handleSubmit function to pass templateId
const handleSubmit = async (
  e: React.FormEvent,
  setError: (error: string | null) => void,
  customizedTemplate: any,
  onGenerate: (template: any, prompt: string) => Promise<void>,
  additionalPrompt: string,
) => {
  e.preventDefault()
  setError(null)

  try {
    // Validate the template before sending
    if (!customizedTemplate) {
      throw new Error("Template is empty or invalid")
    }

    // Log the template being sent (for debugging)
    console.log("Submitting template:", JSON.stringify(customizedTemplate).substring(0, 100) + "...")

    // Add a try-catch block around the onGenerate call
    try {
      // Pass the template ID to the onGenerate function
      await onGenerate(customizedTemplate, additionalPrompt)
    } catch (generateError) {
      console.error("Error in template customizer during generation:", generateError)
      setError(generateError instanceof Error ? generateError.message : "Failed to generate image. Please try again.")
    }
  } catch (error) {
    console.error("Error in template customizer:", error)
    setError(error instanceof Error ? error.message : "An unknown error occurred")
  }
}
