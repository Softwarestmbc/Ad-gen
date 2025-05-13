"use client"

import { Card } from "@/components/ui/card"
import { Loader2, Check, Globe, Palette, Layout, MessageSquare, AlertCircle, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

interface WebsiteAnalysisProgressProps {
  websiteUrl: string
  currentStep: number
  error?: string | null
  isGenerating?: boolean
}

export default function WebsiteAnalysisProgress({
  websiteUrl,
  currentStep,
  error,
  isGenerating = false,
}: WebsiteAnalysisProgressProps) {
  const steps = [
    { id: 1, name: "Connecting to website", icon: Globe },
    { id: 2, name: "Analyzing brand colors", icon: Palette },
    { id: 3, name: "Identifying key elements", icon: Layout },
    { id: 4, name: "Generating ad template", icon: MessageSquare },
    { id: 5, name: "Creating ad image", icon: ImageIcon },
  ]

  // If isGenerating is true, we're at step 5
  const effectiveStep = isGenerating ? 5 : currentStep

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="p-10 w-full max-w-2xl rounded-3xl shadow-2xl border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
          {/* Modern gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50/30 -z-10"></div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-100 rounded-full -mr-20 -mt-20 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full -ml-16 -mb-16 opacity-20"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 -z-5"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Light border effect */}
          <div className="absolute inset-0 rounded-3xl border border-white/50 pointer-events-none"></div>

          <div className="text-center">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-red-700">Analysis Failed</h3>
            <p className="text-gray-600 mb-4">We encountered an error while analyzing your website:</p>
            <div className="bg-red-50 p-5 rounded-xl text-red-700 text-sm mb-6 shadow-inner border border-red-100">
              {error}
            </div>
            <p className="text-sm text-gray-500">Please try again or try a different website.</p>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-10 w-full max-w-2xl rounded-3xl shadow-2xl border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 -z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mt-20 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-20"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 -z-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Light border effect */}
        <div className="absolute inset-0 rounded-3xl border border-white/50 pointer-events-none"></div>

        <div className="text-center">
          <div className="mx-auto bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6 relative">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
            {isGenerating ? "Creating Your Ad" : "Analyzing Your Website"}
          </h3>
          <p className="text-gray-600 mb-1">
            {isGenerating ? "Using AI to generate your ad" : "Using AI to understand your brand"}
          </p>
          <p className="text-sm text-gray-500 truncate max-w-xs mx-auto">{websiteUrl}</p>
        </div>

        <div className="space-y-5 mt-8">
          {steps.map((step) => {
            const StepIcon = step.icon
            const isComplete = effectiveStep > step.id
            const isActive = effectiveStep === step.id

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-green-100 text-green-600"
                      : isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                  initial={false}
                  animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : isActive ? (
                    <StepIcon className="h-5 w-5 animate-pulse" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </motion.div>
                <div
                  className={`ml-4 font-medium ${
                    isComplete ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </div>
                {isActive && (
                  <div className="ml-auto">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-8 overflow-hidden">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (effectiveStep / steps.length) * 100)}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
