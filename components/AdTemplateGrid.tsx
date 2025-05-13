"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe, ArrowRight } from "lucide-react"

// Define the template interface
interface AdTemplate {
  id: string
  name: string
  description: string
  previewUrl: string
  type?: string
}

interface AdTemplateGridProps {
  templates: AdTemplate[]
}

export default function AdTemplateGrid({ templates }: AdTemplateGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({})
  const [urlError, setUrlError] = useState("")

  // Create ad mutation using React Query
  const createAdMutation = useMutation({
    mutationFn: async ({ templateId, url }: { templateId: string; url: string }) => {
      const response = await fetch("/api/create-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId, url }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to generate ad"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      if (!data.image) {
        throw new Error("No image returned from API")
      }

      // Convert base64 to data URL if it's not already a data URL
      const dataUrl = data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`

      setGeneratedImages((prev) => ({
        ...prev,
        [variables.templateId]: dataUrl,
      }))
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.error("Error generating ad:", error)
      setUrlError(error instanceof Error ? error.message : "Failed to generate ad")
    },
  })

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId)
    setWebsiteUrl("")
    setUrlError("")
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic URL validation
    if (!websiteUrl.trim()) {
      setUrlError("Please enter a website URL")
      return
    }

    let formattedUrl = websiteUrl
    if (!websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
      formattedUrl = `https://${websiteUrl}`
    }

    try {
      new URL(formattedUrl)
      setUrlError("")

      if (selectedTemplate) {
        createAdMutation.mutate({ templateId: selectedTemplate, url: formattedUrl })
      }
    } catch (err) {
      setUrlError("Please enter a valid website URL")
    }
  }

  // Find the selected template
  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate)

  return (
    <div className="w-full">
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          const isLoading = createAdMutation.isPending && selectedTemplate === template.id
          const generatedImage = generatedImages[template.id]

          return (
            <Card
              key={template.id}
              className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg shadow-md rounded-3xl"
              onClick={() => handleTemplateClick(template.id)}
            >
              <div className="relative aspect-square">
                {isLoading ? (
                  <Skeleton className="h-full w-full rounded-3xl" />
                ) : (
                  <Image
                    src={generatedImage || template.previewUrl}
                    alt={template.name}
                    fill
                    className="object-cover rounded-3xl"
                    priority={true}
                  />
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Website URL Input Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!createAdMutation.isPending) {
            setIsModalOpen(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Enter Your Website</DialogTitle>
            <DialogDescription>
              We'll analyze your website with AI to create a customized {selectedTemplateData?.name} ad that matches
              your brand's colors and style.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="www.yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 rounded-full shadow-sm"
                disabled={createAdMutation.isPending}
              />
            </div>

            {urlError && <p className="text-red-500 text-sm">{urlError}</p>}

            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              <p className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Our AI will analyze your website to:
              </p>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Detect your brand colors and style</li>
                <li>Identify your products and services</li>
                <li>Extract key benefits and features</li>
                <li>Create a customized ad template</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full shadow-sm"
                disabled={createAdMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full shadow-sm"
                disabled={createAdMutation.isPending || !websiteUrl.trim()}
              >
                {createAdMutation.isPending ? (
                  <>Generating...</>
                ) : (
                  <>
                    Generate Ad <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
