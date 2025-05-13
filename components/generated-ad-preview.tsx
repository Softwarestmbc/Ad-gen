"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Share2 } from "lucide-react"

interface GeneratedAdPreviewProps {
  imageUrl: string
  websiteUrl: string
  onReset: () => void
}

export default function GeneratedAdPreview({ websiteUrl, onReset }: GeneratedAdPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Generated Ad</h2>
        <p className="text-gray-600">
          Based on <span className="font-medium">{websiteUrl}</span>
        </p>
      </div>

      <div className="overflow-hidden mb-8 rounded-3xl shadow-lg bg-white">
        <div className="relative aspect-[4/3] w-full">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Ad preview would appear here</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button size="lg" className="gap-2 rounded-full shadow-sm">
          <Download className="h-5 w-5" />
          Download Ad
        </Button>
        <Button size="lg" variant="outline" className="gap-2 rounded-full shadow-sm">
          <Share2 className="h-5 w-5" />
          Share
        </Button>
        <Button size="lg" variant="outline" className="gap-2 rounded-full shadow-sm" onClick={onReset}>
          <RefreshCw className="h-5 w-5" />
          Create Another
        </Button>
      </div>
    </div>
  )
}
