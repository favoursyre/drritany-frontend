//This is the api route for handling stripe checkout

//Libraries -->
import { domainName, stripeSecretKey } from '@/config/utils';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';


//Commencing the code -->
const stripe = new Stripe(stripeSecretKey as string, {
  //apiVersion: '2023-10-16', // Latest as of March 2025
});

export async function POST(req: NextRequest) {
  try {
    const { amount, txId } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least 50 cents' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Checkout Payment',
              description: 'Your Everyday Marketplace',
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: txId,
      success_url: `${domainName}/cart?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainName}/cart?session_id={CHECKOUT_SESSION_ID}`
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}