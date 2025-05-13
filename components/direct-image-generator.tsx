"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DirectImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Update the generateImage function to use our API endpoint that uses OpenAI
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Call our API endpoint that uses OpenAI
      const response = await fetch("/api/simple-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      })

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error (${response.status}):`, errorText)
        throw new Error(`API error (${response.status}): ${errorText}`)
      }

      // Get the response text
      const responseText = await response.text()
      console.log("Raw API response:", responseText.substring(0, 200) + "...")

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        console.error("Raw response that failed to parse:", responseText)
        throw new Error(`Failed to parse API response. The service might be experiencing issues.`)
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      } else {
        throw new Error("No image returned from API")
      }
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "Failed to generate image")

      // Create a fallback image
      setGeneratedImage(`/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt.substring(0, 100))}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Direct Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your image prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="resize-none"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {generatedImage && (
          <div className="mt-4">
            <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="w-full rounded-lg" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={generateImage} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Image"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
