//This is the api route for handling stripe checkout

//Libraries -->
import { convertUnitAmountToCent, domainName, getMinimumStripeAmount, stripeSecretKey } from '@/config/utils';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import axios from 'axios';
import { ICountry } from '@/config/interfaces';

//Commencing the code -->
const stripe = new Stripe(stripeSecretKey as string, {
  //apiVersion: '2023-10-16', // Latest as of March 2025
});

const exchangeRateApi = process.env.EXCHANGE_RATE_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const { countryInfo, amount, txId } = await req.json();

    const countryInfo_ = countryInfo as unknown as ICountry
    const currency = countryInfo_.currency?.abbreviation 
    const exchangeRate = countryInfo_.currency?.exchangeRate

    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is not given' },
        { status: 400 }
      );
    }

    if (!exchangeRate) {
      return NextResponse.json(
        { error: 'Exchange Rate is not given' },
        { status: 400 }
      );
    }

    //let exchangeRate = 1
    // if (currency !== "USD") {
    //   const url = `https://v6.exchangerate-api.com/v6/${exchangeRateApi}/latest/USD`;
  
    //   const res = await axios.get(url);
    //   const rate = res.data.conversion_rates[currency]
    //   exchangeRate = rate
    //   console.log("Exchange Rate: ", rate)

    //   if (!rate) {
    //     return NextResponse.json(
    //       { error: `${currency} exchange rate not found` },
    //       { status: 400 }
    //     );
    //   }
    // }

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount not found' },
        { status: 400 }
      );
    }

    if (convertUnitAmountToCent(amount, currency, exchangeRate) < 50) {
      return NextResponse.json(
        { error: `Amount must be at least ${getMinimumStripeAmount(currency, exchangeRate)}${currency}`},
        { status: 400 }
      );
    }

    console.log("Amount: ", amount)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card'
      ],
      line_items: [
        {
          price_data: {
            currency: currency,
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