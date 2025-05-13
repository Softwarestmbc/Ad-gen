"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import { ArrowRight, ArrowLeft, Building, Tag, Package } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploadStepProps {
  websiteData: any
  onComplete: (images: string[]) => void
  onBack: () => void
}

export default function ImageUploadStep({ websiteData, onComplete, onBack }: ImageUploadStepProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImagesUploaded = (images: string[]) => {
    setUploadedImages(images)
  }

  const handleContinue = () => {
    if (uploadedImages.length > 0) {
      onComplete(uploadedImages)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto rounded-3xl shadow-xl border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full -ml-24 -mb-24 opacity-30"></div>

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-900">
            Upload Product Images
          </CardTitle>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            We've analyzed <span className="font-medium">{websiteData?.websiteMetadata?.url || "your website"}</span>{" "}
            and extracted key information about your brand. Now, please upload product images for your ad.
          </p>
        </CardHeader>

        <CardContent className="px-6 sm:px-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-2">
                <Building className="h-5 w-5 text-indigo-600" />
              </span>
              Brand Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl">
                <p className="text-sm text-indigo-900 font-medium">Brand</p>
                <p className="text-lg">{websiteData?.brandInfo?.name || "Your Brand"}</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl">
                <p className="text-sm text-indigo-900 font-medium">Industry</p>
                <p className="text-lg">{websiteData?.brandInfo?.industry || "General"}</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl md:col-span-2">
                <p className="text-sm text-indigo-900 font-medium flex items-center">
                  <Package className="h-4 w-4 mr-1 text-indigo-600" /> Product
                </p>
                <p className="text-lg">{websiteData?.productInfo?.mainProduct || "Your Product"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-2">
                <Tag className="h-5 w-5 text-indigo-600" />
              </span>
              Upload Your Product Images
            </h3>

            <ImageUpload onImagesUploaded={handleImagesUploaded} maxImages={3} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between px-6 sm:px-8 pb-8">
          <Button variant="outline" onClick={onBack} className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={handleContinue} disabled={uploadedImages.length === 0} className="btn-primary">
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
