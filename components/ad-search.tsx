"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Sparkles } from "lucide-react"
import { adTemplates } from "@/lib/ad-templates"
import { motion, AnimatePresence } from "framer-motion"

interface AdSearchProps {
  onSelect: (templateId: string) => void
}

export default function AdSearch({ onSelect }: AdSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredTemplates, setFilteredTemplates] = useState<typeof adTemplates>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter templates based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredTemplates([])
      return
    }

    const lowerCaseQuery = query.toLowerCase()
    const filtered = adTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowerCaseQuery) ||
        template.description.toLowerCase().includes(lowerCaseQuery) ||
        template.type.toLowerCase().includes(lowerCaseQuery),
    )
    setFilteredTemplates(filtered)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleSelectTemplate = (templateId: string) => {
    onSelect(templateId)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-10" ref={searchRef}>
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-blue-300">
          <div className="pl-5">
            <Search className="h-5 w-5 text-blue-500" />
          </div>
          <input
            type="text"
            placeholder="Search for ad templates (e.g., product, social media, skincare)..."
            className="w-full py-4 px-4 outline-none text-gray-700 text-lg"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() !== "" && setIsOpen(true)}
          />
          <div className="pr-5 flex items-center">
            <Sparkles className="h-5 w-5 text-blue-400 opacity-70" />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && filteredTemplates.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-10 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    className={`px-5 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                      index < filteredTemplates.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                    onClick={() => handleSelectTemplate(template.id)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <div className="text-sm text-gray-500 truncate">{template.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
