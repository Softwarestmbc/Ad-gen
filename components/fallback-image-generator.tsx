"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface FallbackImageGeneratorProps {
  prompt: string
  onImageGenerated: (imageUrl: string) => void
}

export default function FallbackImageGenerator({ prompt, onImageGenerated }: FallbackImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateFallbackImage = () => {
    setIsGenerating(true)

    // Create a placeholder URL with the prompt
    const placeholderUrl = `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(
      prompt.substring(0, 100),
    )}`

    // Simulate a delay to make it feel like generation is happening
    setTimeout(() => {
      onImageGenerated(placeholderUrl)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fallback Image Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Our advanced image generation service is currently unavailable. We can generate a simple placeholder image
          based on your prompt instead.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Prompt: {prompt.substring(0, 100)}
          {prompt.length > 100 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={generateFallbackImage} disabled={isGenerating} className="w-full">
          {isGenerating ? "Generating..." : "Generate Fallback Image"}
        </Button>
      </CardFooter>
    </Card>
  )
}
