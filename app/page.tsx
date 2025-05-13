"use client"

import { useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import AdTemplateGrid from "@/components/ad-template-grid"
import WebsiteInputModal from "@/components/website-input-modal"
import WebsiteAnalysisProgress from "@/components/website-analysis-progress"
import ApiKeyChecker from "@/components/api-key-checker"
import AdSearch from "@/components/ad-search"
import ImageUploadStep from "@/components/image-upload-step"
import { adTemplates } from "@/lib/ad-templates"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Download, RefreshCw, Sparkles, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define the workflow steps
enum WorkflowStep {
  SelectTemplate = 0,
  AnalyzeWebsite = 1,
  UploadImages = 2,
  GenerateAd = 3,
  ViewResult = 4,
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.SelectTemplate)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState<string>("")
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [websiteData, setWebsiteData] = useState<any | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Find the selected template
  const selectedTemplate = selectedTemplateId ? adTemplates.find((t) => t.id === selectedTemplateId) : null

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setIsWebsiteModalOpen(true)
  }

  // Handle website URL submission
  const handleWebsiteSubmit = async (url: string) => {
    setWebsiteUrl(url)
    setIsWebsiteModalOpen(false)
    setCurrentStep(WorkflowStep.AnalyzeWebsite)
    setAnalysisStep(1)
    setAnalysisError(null)
    setWebsiteData(null)
    setGeneratedImageUrl(null)

    try {
      // Step 1: Connecting to website
      setAnalysisStep(1)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 2: Analyzing brand colors
      setAnalysisStep(2)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 3: Identifying key elements
      setAnalysisStep(3)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: Generating ad template
      setAnalysisStep(4)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the API to analyze the website
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }), // Changed from websiteUrl to url to match API expectation
      })

      // Get the response text first to handle potential non-JSON responses
      const responseText = await response.text()
      let data

      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        console.error("Raw response:", responseText.substring(0, 500) + "...")

        // Show a more user-friendly error
        throw new Error(
          "The website analysis returned an invalid response. Please try again or try a different website.",
        )
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website")
      }

      // Validate the data structure before proceeding
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure returned from website analysis")
      }

      setWebsiteData(data)

      // Move to the image upload step
      setCurrentStep(WorkflowStep.UploadImages)
    } catch (error) {
      console.error("Error analyzing website:", error)
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze website")
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      })
    }
  }

  // Handle image upload completion
  const handleImagesUploaded = (images: string[]) => {
    setUploadedImages(images)

    // Move to the generate ad step
    setCurrentStep(WorkflowStep.GenerateAd)

    // Automatically generate the ad
    if (selectedTemplateId && websiteData && images.length > 0) {
      generateAdWithData(selectedTemplateId, websiteData, images)
    }
  }

  // Generate ad with website data and uploaded images
  const generateAdWithData = async (templateId: string, websiteData: any, images: string[]) => {
    setIsGeneratingImage(true)
    setGeneratedImageUrl(null)

    try {
      // Find the template
      const template = adTemplates.find((t) => t.id === templateId)
      if (!template) {
        throw new Error("Template not found")
      }

      // Automatically fill the template with website data
      const filledTemplate = fillTemplateWithWebsiteData(template.jsonTemplate, websiteData)

      // Generate additional prompt from website data
      const additionalPrompt = generatePromptFromWebsiteData(websiteData)

      // Call the API to generate the ad
      const response = await fetch("/api/generate-creative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonTemplate: filledTemplate,
          prompt: additionalPrompt,
          websiteData: websiteData,
          uploadedImages: images,
          templateId: templateId, // Pass the template ID to use as reference
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
        console.error("Error parsing response:", parseError)
        console.error("Raw response that failed to parse:", responseText)
        throw new Error(`Failed to parse API response. The service might be experiencing issues.`)
      }

      if (data.warning) {
        toast({
          title: "Warning",
          description: data.warning,
          variant: "destructive",
        })
      }

      setGeneratedImageUrl(data.imageUrl)
      setCurrentStep(WorkflowStep.ViewResult)
    } catch (error) {
      console.error("Error generating ad:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ad",
        variant: "destructive",
      })

      // Create a fallback image
      setGeneratedImageUrl(
        `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent("Fallback advertisement image")}`,
      )
      setCurrentStep(WorkflowStep.ViewResult)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Helper function to fill template with website data
  function fillTemplateWithWebsiteData(template: Record<string, any>, data: any): Record<string, any> {
    // Deep clone the template to avoid modifying the original
    const filledTemplate = JSON.parse(JSON.stringify(template))

    try {
      // Fill in the template based on its structure
      if (filledTemplate.ad_config) {
        // Handle ad_config structure
        if (filledTemplate.ad_config.subject?.details) {
          filledTemplate.ad_config.subject.details.branding = data.brandFacts?.brand_name || "Brand Name"
          filledTemplate.ad_config.subject.description = data.brandFacts?.brand_product_category || "Product"
        }

        if (filledTemplate.ad_config.background) {
          filledTemplate.ad_config.background.color = data.brandFacts?.brand_primary || "#000000"
        }

        if (filledTemplate.ad_config.text_overlay?.headline) {
          filledTemplate.ad_config.text_overlay.headline.text = data.brandFacts?.brand_tagline || "Headline"

          // Set headline color based on background for better contrast
          if (data.brandFacts?.brand_secondary) {
            filledTemplate.ad_config.text_overlay.headline.color = data.brandFacts.brand_secondary
          }
        }

        // Fill benefits if they exist
        if (filledTemplate.ad_config.text_overlay?.benefits) {
          const benefits = ["Quality", "Value", "Innovation", "Service"]
          filledTemplate.ad_config.text_overlay.benefits.forEach((benefit: any, index: number) => {
            benefit.text = benefits[index] || `Benefit ${index + 1}`
            if (benefit.description !== undefined) {
              benefit.description = `Description ${index + 1}`
            }

            // Set benefit text color
            if (data.brandFacts?.brand_accent) {
              benefit.color = data.brandFacts.brand_accent
            }
          })
        }

        // Fill disclaimer if it exists
        if (filledTemplate.ad_config.text_overlay?.disclaimer) {
          filledTemplate.ad_config.text_overlay.disclaimer.text = "Terms and conditions apply"
        }

        // Fill CTA if it exists
        if (filledTemplate.ad_config.text_overlay?.cta) {
          filledTemplate.ad_config.text_overlay.cta.text = "Shop Now"
        }

        // Update additional instructions with brand voice and design style
        if (filledTemplate.ad_config.additional_instructions) {
          filledTemplate.ad_config.additional_instructions.mood =
            data.brandFacts?.brand_tone || filledTemplate.ad_config.additional_instructions.mood

          filledTemplate.ad_config.additional_instructions.reference = `Create a professional ad for ${
            data.brandFacts?.brand_name || "Brand"
          } (${data.brandFacts?.brand_product_category || ""})`
        }
      } else {
        // Handle simpler structure
        if (filledTemplate.colors) {
          filledTemplate.colors.primary = data.brandFacts?.brand_primary || filledTemplate.colors.primary
          filledTemplate.colors.secondary = data.brandFacts?.brand_secondary || filledTemplate.colors.secondary
          if (filledTemplate.colors.text) {
            filledTemplate.colors.text = data.brandFacts?.brand_accent || filledTemplate.colors.text
          }
        }

        if (filledTemplate.elements) {
          if (filledTemplate.elements.headline) {
            filledTemplate.elements.headline = data.brandFacts?.brand_tagline || filledTemplate.elements.headline
          }
          if (filledTemplate.elements.subheadline) {
            filledTemplate.elements.subheadline =
              data.brandFacts?.brand_description || filledTemplate.elements.subheadline
          }
          if (filledTemplate.elements.productName) {
            filledTemplate.elements.productName =
              data.brandFacts?.brand_product_category || filledTemplate.elements.productName
          }
          if (filledTemplate.elements.description) {
            filledTemplate.elements.description =
              data.brandFacts?.brand_description || filledTemplate.elements.description
          }
          if (filledTemplate.elements.cta) {
            filledTemplate.elements.cta = "Shop Now"
          }

          // Handle features or benefits arrays
          if (Array.isArray(filledTemplate.elements.features)) {
            const benefits = ["Quality", "Value", "Innovation", "Service"]
            filledTemplate.elements.features.forEach((feature: any, index: number) => {
              if (typeof feature === "object" && feature.feature !== undefined) {
                feature.feature = benefits[index] || feature.feature
              } else if (typeof feature === "string") {
                filledTemplate.elements.features[index] = benefits[index] || feature
              }
            })
          }
        }

        // Update style based on brand tone
        if (filledTemplate.style && data.brandFacts?.brand_tone) {
          filledTemplate.style = data.brandFacts.brand_tone.toLowerCase() || filledTemplate.style
        }
      }
    } catch (error) {
      console.error("Error filling template with website data:", error)
      // Return the original template if there's an error
    }

    return filledTemplate
  }

  // Helper function to generate additional prompt from website data
  function generatePromptFromWebsiteData(data: any): string {
    try {
      let prompt = `Create a professional advertisement for ${data.brandFacts?.brand_name || "the brand"}.`

      if (data.brandFacts?.brand_product_category) {
        prompt += ` This is for the ${data.brandFacts.brand_product_category} industry.`
      }

      if (data.brandFacts?.brand_target_audience) {
        prompt += ` The target audience is ${data.brandFacts.brand_target_audience}.`
      }

      if (data.brandFacts?.brand_tone) {
        prompt += ` Use a ${data.brandFacts.brand_tone} tone.`
      }

      if (data.brandFacts?.brand_unique_selling_point) {
        prompt += ` Highlight the unique selling proposition: "${data.brandFacts.brand_unique_selling_point}".`
      }

      prompt += " Use the uploaded product images as reference for the ad."

      return prompt
    } catch (error) {
      console.error("Error generating prompt from website data:", error)
      return "Create a professional advertisement based on the website analysis and uploaded product images."
    }
  }

  // Reset the flow
  const handleReset = () => {
    setCurrentStep(WorkflowStep.SelectTemplate)
    setSelectedTemplateId(null)
    setWebsiteUrl("")
    setAnalysisStep(0)
    setAnalysisError(null)
    setWebsiteData(null)
    setUploadedImages([])
    setGeneratedImageUrl(null)
  }

  // Go back to the previous step
  const handleBack = () => {
    if (currentStep === WorkflowStep.UploadImages) {
      // Go back to template selection
      setCurrentStep(WorkflowStep.SelectTemplate)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-light">
      <ApiKeyChecker />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            AI-Powered Ad Creation
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
            Create Beautiful Ads in Minutes
          </h1>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform your brand into stunning advertisements with our AI-powered platform. No design skills needed.
          </p>

          {/* Workflow Steps Indicator */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-0">
            {["Select Template", "Analyze Website", "Upload Images", "Generate Ad"].map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    currentStep === index
                      ? "bg-blue-600 text-white shadow-md"
                      : currentStep > index
                        ? "bg-blue-100 text-blue-700"
                        : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                      currentStep === index
                        ? "bg-white text-blue-600"
                        : currentStep > index
                          ? "bg-blue-700 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > index ? "✓" : index + 1}
                  </span>
                  {step}
                </div>
                {index < 3 && (
                  <div className="hidden md:block mx-1">
                    <ArrowRight className={`h-4 w-4 ${currentStep > index ? "text-blue-600" : "text-gray-300"}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Section - Only show on the first step */}

        {/* Main Content based on current step */}
        <AnimatePresence mode="wait">
          {currentStep === WorkflowStep.SelectTemplate && (
            <motion.div
              key="template-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search Bar */}
              <div className="mb-8">
                <AdSearch onSelect={handleTemplateSelect} />
              </div>

              {/* Template Grid */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                    Choose a Template
                  </h2>
                  <div className="bg-blue-50 px-4 py-2 rounded-full text-sm text-blue-700 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                    {adTemplates.length} templates available
                  </div>
                </div>
                <AdTemplateGrid templates={adTemplates} onSelect={handleTemplateSelect} />
              </div>
            </motion.div>
          )}

          {/* Website Analysis Progress */}
          {currentStep === WorkflowStep.AnalyzeWebsite && (
            <motion.div
              key="website-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center my-12"
            >
              <WebsiteAnalysisProgress
                websiteUrl={websiteUrl}
                currentStep={analysisStep}
                error={analysisError}
                isGenerating={false}
              />
            </motion.div>
          )}

          {/* Image Upload Step */}
          {currentStep === WorkflowStep.UploadImages && websiteData && (
            <motion.div
              key="image-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="my-12"
            >
              <ImageUploadStep websiteData={websiteData} onComplete={handleImagesUploaded} onBack={handleBack} />
            </motion.div>
          )}

          {/* Ad Generation Progress */}
          {currentStep === WorkflowStep.GenerateAd && (
            <motion.div
              key="ad-generation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center my-12"
            >
              <WebsiteAnalysisProgress
                websiteUrl={websiteUrl}
                currentStep={5} // Set to the final step
                error={null}
                isGenerating={true}
              />
            </motion.div>
          )}

          {/* Generated Ad Preview */}
          {currentStep === WorkflowStep.ViewResult && generatedImageUrl && (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="my-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
                    Ad Generated Successfully
                  </div>
                  <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                    Your Beautiful Ad is Ready
                  </h2>
                  <p className="text-gray-600 max-w-lg mx-auto">
                    Based on <span className="font-medium">{websiteUrl}</span> and your uploaded images
                  </p>
                </div>

                <div className="overflow-hidden mb-8 rounded-3xl shadow-xl bg-white border-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
                  <div className="p-6">
                    <div className="relative aspect-square w-full max-w-2xl mx-auto">
                      <Image
                        src={generatedImageUrl || "/placeholder.svg"}
                        alt="Generated Ad"
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={generatedImageUrl}
                    download="generated-ad.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Ad
                  </a>
                  <button onClick={handleReset} className="btn-secondary inline-flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Create Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Website Input Modal */}
      {selectedTemplate && (
        <WebsiteInputModal
          isOpen={isWebsiteModalOpen}
          onClose={() => setIsWebsiteModalOpen(false)}
          onSubmit={handleWebsiteSubmit}
          templateName={selectedTemplate.name}
        />
      )}

      <Toaster />
    </div>
  )
}
