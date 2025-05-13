import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// This is a mock database for storing user generations
// In a real app, you would use a database like MongoDB, PostgreSQL, etc.
const userGenerations: Record<string, any[]> = {}

export async function GET(request: NextRequest) {
  // Get the user session
  const session = await getServerSession(authOptions)

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the user ID
  const userId = session.user.id

  // Get the user's generations
  const generations = userGenerations[userId] || []

  return NextResponse.json({ generations })
}

export async function POST(request: NextRequest) {
  // Get the user session
  const session = await getServerSession(authOptions)

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the user ID
  const userId = session.user.id

  // Get the generation data from the request
  const data = await request.json()

  // Initialize the user's generations array if it doesn't exist
  if (!userGenerations[userId]) {
    userGenerations[userId] = []
  }

  // Add the generation to the user's generations
  const generation = {
    id: `gen_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  }

  userGenerations[userId].push(generation)

  return NextResponse.json({ generation })
}
