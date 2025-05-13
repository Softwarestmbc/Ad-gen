"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-light">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Welcome to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This is a simplified dashboard view. Authentication has been removed from the application.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
