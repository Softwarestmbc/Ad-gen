// This is a placeholder file to satisfy imports
// No actual authentication functionality is implemented

export const authOptions = {
  providers: [],
}

export function GET() {
  return new Response(JSON.stringify({ error: "Authentication not implemented" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  })
}

export function POST() {
  return new Response(JSON.stringify({ error: "Authentication not implemented" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  })
}
