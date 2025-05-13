import DirectImageGenerator from "@/components/direct-image-generator"

export default function TestImagePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Test Image Generation</h1>
      <DirectImageGenerator />
    </div>
  )
}
