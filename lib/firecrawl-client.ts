import FirecrawlApp from "@mendable/firecrawl-js"

// Initialize the Firecrawl client with the API key
const firecrawlClient = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
})

export interface FirecrawlResult {
  content: string
  images: {
    url: string
    alt: string
    width?: number
    height?: number
    isProductImage?: boolean
  }[]
  title: string
  description: string
  metadata: Record<string, any>
}

/**
 * Crawls a website using Firecrawl and extracts content and images
 */
export async function crawlWebsite(url: string): Promise<FirecrawlResult> {
  try {
    console.log(`Crawling website: ${url} with Firecrawl...`)

    // Crawl the website with Firecrawl
    const response = await firecrawlClient.crawlUrl(url, {
      limit: 3, // Crawl up to 3 pages to keep it reasonable
      scrapeOptions: {
        formats: ["markdown", "html"],
        includeImages: true, // Extract images
        includeMetadata: true,
      },
    })

    if (!response || !response.data) {
      throw new Error("No data returned from Firecrawl")
    }

    console.log(`Successfully crawled ${url}, processing results...`)

    // Process the crawl results
    const pages = response.data.pages || []
    if (pages.length === 0) {
      throw new Error("No pages found in Firecrawl response")
    }

    // Extract content from all pages
    let allContent = ""
    const allImages: FirecrawlResult["images"] = []
    let mainTitle = ""
    let mainDescription = ""

    // Process each page
    pages.forEach((page, index) => {
      // Add page content
      if (page.markdown) {
        allContent += page.markdown + "\n\n"
      }

      // Extract images
      if (page.images && Array.isArray(page.images)) {
        page.images.forEach((image) => {
          if (image.url) {
            // Basic heuristic to identify product images
            const isProductImage = isLikelyProductImage(image, page.url || "")

            allImages.push({
              url: image.url,
              alt: image.alt || "",
              width: image.width,
              height: image.height,
              isProductImage,
            })
          }
        })
      }

      // Get title and description from the main page
      if (index === 0) {
        mainTitle = page.title || ""
        mainDescription = page.description || ""
      }
    })

    // Extract metadata from the main page
    const metadata = pages[0]?.metadata || {}

    return {
      content: allContent,
      images: allImages,
      title: mainTitle,
      description: mainDescription,
      metadata,
    }
  } catch (error) {
    console.error("Error crawling website with Firecrawl:", error)
    throw error
  }
}

/**
 * Simple heuristic to identify if an image is likely a product image
 */
function isLikelyProductImage(image: any, pageUrl: string): boolean {
  // If no image data, return false
  if (!image) return false

  // Check image dimensions if available
  if (image.width && image.height) {
    // Product images are usually square or portrait and reasonably sized
    const aspectRatio = image.width / image.height
    const isReasonableSize = image.width >= 200 && image.height >= 200
    const hasReasonableAspectRatio = aspectRatio >= 0.5 && aspectRatio <= 2.0

    if (isReasonableSize && hasReasonableAspectRatio) {
      // Check alt text and URL for product indicators
      const altText = (image.alt || "").toLowerCase()
      const imageUrl = (image.url || "").toLowerCase()

      const productIndicators = ["product", "item", "goods", "merchandise", "photo"]

      // Check if alt text or URL contains product indicators
      for (const indicator of productIndicators) {
        if (altText.includes(indicator) || imageUrl.includes(indicator)) {
          return true
        }
      }

      // Check if image is in a product-related path
      const productPaths = ["/product", "/item", "/goods", "/shop", "/store"]
      for (const path of productPaths) {
        if (imageUrl.includes(path) || pageUrl.includes(path)) {
          return true
        }
      }

      // If image has good dimensions but no clear indicators, it's still a candidate
      return true
    }
  }

  return false
}
