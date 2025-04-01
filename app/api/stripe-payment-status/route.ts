//This page is used to confirm the status of a stripe payment

//Libraries -->
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeSecretKey } from '@/config/utils';

//Commecing the code -->
const stripe = new Stripe(stripeSecretKey as string);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe payment status: ", session.payment_status)
    console.log("Stripe session status: ", session.status)
    if (session.payment_status === 'paid') {
      return NextResponse.json({ status: 'paid' }, { status: 200 });
    } else if (session.status === 'expired' || session.payment_status === 'unpaid') {
      return NextResponse.json({ status: 'canceled' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'pending' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking session status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}