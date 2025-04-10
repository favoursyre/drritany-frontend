//This is the api route for handling sales tax calculation

//Libraries -->
import { domainName, stripeSecretKey } from '@/config/utils';
import { NextRequest, NextResponse } from 'next/server';
import Taxjar from "taxjar"


//Commencing the code -->
//Initialzing token
const taxjarClient = new Taxjar({ apiKey: process.env.TAXJAR_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { country, zip, state, amount, shipping } = await req.json();
    const res = await taxjarClient.taxForOrder({
        from_country: "US",
        from_zip: "10001",
        from_state: "NY",
        to_country: country,
        to_zip: zip,
        to_state: state,
        amount: amount,
        shipping: 4.5,
        line_items: [
          {
            quantity: 1,
            unit_price: amount,
            product_tax_code: "31000" // Taxable general goods
          }
        ]
    });
    console.log("Tax Info: ", res)
    const tax = res.tax.amount_to_collect

    return NextResponse.json( res , { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}