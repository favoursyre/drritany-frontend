//This used for manual next static revalidation

//Libraries -->
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

//POST request
export async function POST(req: NextRequest) {
  const { secret, path } = await req.json();

  // Check the secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Revalidate the specific product page
    revalidatePath(`/product/${path}`);
    return NextResponse.json({ revalidated: true, path: `/product/${path}` });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}