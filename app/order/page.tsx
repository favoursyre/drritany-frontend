"use Client"
///This handles the terms of order page

///Libraries -->
//import Order from "@/components/order/Order"
import { Metadata } from "next"

///Commencing the code
export const metadata: Metadata = {
  title: 'Order',
  description: `Fill in the order form to process your orders.`,
  alternates: {
    canonical: `/order`
  }
}

/**
 * @title Order page
 */
export default function OrderPage() {
  return (
    <main>
        {/* <Order /> */}
    </main>
  )
}