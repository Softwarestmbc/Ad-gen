"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploadProps {
  onImagesUploaded: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ onImagesUploaded, maxImages = 3 }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: string[] = []
    const promises: Promise<void>[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
          }
          resolve()
        }
        reader.readAsDataURL(file)
      })

      promises.push(promise)
    })

    Promise.all(promises).then(() => {
      const combinedImages = [...uploadedImages, ...newImages].slice(0, maxImages)
      setUploadedImages(combinedImages)
      onImagesUploaded(combinedImages)
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const newImages: string[] = []
    const promises: Promise<void>[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
          }
          resolve()
        }
        reader.readAsDataURL(file)
      })

      promises.push(promise)
    })

    Promise.all(promises).then(() => {
      const combinedImages = [...uploadedImages, ...newImages].slice(0, maxImages)
      setUploadedImages(combinedImages)
      onImagesUploaded(combinedImages)
    })
  }

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : uploadedImages.length === 0
              ? "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50"
              : "border-gray-200 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`p-4 rounded-full ${isDragging ? "bg-indigo-200" : "bg-indigo-100"} transition-colors duration-300`}
          >
            <Upload className={`h-8 w-8 ${isDragging ? "text-indigo-700" : "text-indigo-500"}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Drag and drop your product images here</p>
            <p className="text-sm text-gray-500 mt-1">Upload up to {maxImages} images (PNG, JPG, WEBP)</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="mt-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 hover:text-indigo-800 rounded-xl px-6 py-5 shadow-sm hover:shadow transition-all duration-300"
          >
            <ImageIcon className="h-5 w-5 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {uploadedImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Uploaded product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-sm font-medium">Product Image {index + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {uploadedImages.length < maxImages && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <button
                  onClick={handleButtonClick}
                  className="h-full w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300"
                >
                  <div className="p-3 bg-indigo-100 rounded-full mb-3">
                    <Plus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 font-medium">Add another image</p>
                  <p className="text-gray-400 text-sm">{maxImages - uploadedImages.length} remaining</p>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
