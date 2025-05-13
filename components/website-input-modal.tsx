"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, ArrowRight, Sparkles } from "lucide-react"

interface WebsiteInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string) => void
  templateName: string
}

export default function WebsiteInputModal({ isOpen, onClose, onSubmit, templateName }: WebsiteInputModalProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic URL validation
    if (!url) {
      setError("Please enter a website URL")
      return
    }

    let formattedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`
    }

    try {
      new URL(formattedUrl)
      setError("")
      onSubmit(formattedUrl)
    } catch (err) {
      setError("Please enter a valid website URL")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Simplified, cleaner background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-white -z-10"></div>

        <DialogHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-inner">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
            Enter Your Website
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 max-w-sm mx-auto">
            We'll analyze your website with AI to create a customized {templateName} ad that matches your brand's colors
            and style.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
            <div className="absolute left-0 inset-y-0 flex items-center pl-4">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <Input
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-0 shadow-none pl-12 pr-4 py-6 text-base h-auto rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              e.g., yourwebsite.com
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="flex items-center text-blue-800 font-medium mb-2">
              <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
              Our AI will analyze your website to:
            </p>
            <ul className="space-y-2 pl-6">
              {[
                "Detect your brand colors and style",
                "Identify your products and services",
                "Extract key benefits and features",
                "Create a customized ad template",
              ].map((item, index) => (
                <li key={index} className="flex items-start text-sm text-blue-700">
                  <span className="inline-block w-5 h-5 bg-blue-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-blue-600 text-xs">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="btn-secondary">
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              Analyze Website <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
