"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, History, ImageIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function HistoryPage() {
  // We'll start with an empty history since no images have been generated yet
  const [history] = useState<any[]>([])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <History className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Your Creation History
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View all your previous ad generations, including website data, uploaded images, and final creations.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="group flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Creator</span>
              </Button>
            </Link>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <ImageIcon className="h-10 w-10 text-blue-500 opacity-70" />
              </div>

              <h2 className="text-2xl font-bold mb-3 text-gray-800">No Creations Yet</h2>

              <p className="text-gray-600 max-w-md mb-8">
                You haven't created any advertisements yet. Start by entering a website URL and uploading product images
                to generate your first AI-powered ad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Ad
                  </Button>
                </Link>

                <Button variant="outline" className="border-gray-200 text-gray-700">
                  <Clock className="h-4 w-4 mr-2" />
                  View Tutorials
                </Button>
              </div>
            </div>
          </div>

          {/* Future History Items Will Appear Here */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Your ad generation history will appear here once you create your first ad.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} AdCreator. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/history" className="hover:text-blue-600 transition-colors">
                History
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
