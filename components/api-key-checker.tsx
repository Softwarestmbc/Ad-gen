"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function ApiKeyChecker() {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkApiKeys = async () => {
      if (checked) return

      try {
        const response = await fetch("/api/check-api-keys")
        if (!response.ok) {
          console.error("Failed to check API keys:", response.statusText)
          return
        }

        const data = await response.json()

        // Check OpenAI API key with proper null/undefined handling
        if (data.openai && !data.openai.valid) {
          const errorMessage = data.openai.error || "Unknown error with OpenAI API key"
          toast({
            title: "OpenAI API Key Issue",
            description: `There's a problem with your OpenAI API key: ${errorMessage}. Image generation may not work.`,
            variant: "destructive",
            duration: 10000,
          })
        }

        // Check Gemini API key with proper null/undefined handling
        if (data.gemini && !data.gemini.valid) {
          const errorMessage = data.gemini.error || "Unknown error with Gemini API key"
          toast({
            title: "Gemini API Key Issue",
            description: `There's a problem with your Gemini API key: ${errorMessage}. Website analysis may not work.`,
            variant: "destructive",
            duration: 10000,
          })
        }

        setChecked(true)
      } catch (error) {
        console.error("Error checking API keys:", error)
      }
    }

    checkApiKeys()
  }, [checked])

  // This component doesn't render anything visible
  return null
}
