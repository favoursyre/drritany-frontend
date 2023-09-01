export async function GET(request: Request) {
  console.log("API ran")
  return new Response('Hello, Next.js!')
}
