"use client"

import Image from "next/image"
import type { AdTemplate } from "@/lib/ad-templates"
import { motion } from "framer-motion"

interface AdTemplateGridProps {
  templates: AdTemplate[]
  onSelect: (templateId: string) => void
}

export default function AdTemplateGrid({ templates, onSelect }: AdTemplateGridProps) {
  // Ensure we only display the first 8 templates (2 rows of 4)
  const displayTemplates = templates.slice(0, 8)

  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {displayTemplates.map((template) => (
        <motion.div
          key={template.id}
          className="template-item group cursor-pointer"
          onClick={() => onSelect(template.id)}
          variants={item}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={template.previewUrl || "/placeholder.svg"}
              alt={template.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{template.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
