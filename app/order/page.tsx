"use Client"
///This handles the terms of order page

///Libraries -->
//import Order from "@/components/order/Order"
import { Metadata } from "next"
import { backend, sortMongoQueryByTime } from "@/config/utils"
import { IOrder } from "@/config/interfaces"
import Loading from "@/components/loadingCircle/Circle"
import { Suspense } from "react"
import dynamic from 'next/dynamic'
const Order = dynamic(
  () => import('@/components/order/Order'),
  { ssr: false }
)

///Commencing the code
export const metadata: Metadata = {
  title: 'Order',
  description: `View all your orders.`,
  alternates: {
    canonical: `/order`
  }
}

function Fallback() {
  return <Loading width="20px" height="20px" />
}

///This fetches the products
async function getOrders() {
    try {
      const res = await fetch(`${backend}/order`, {
        method: "GET",
        //cache: "no-store",
      })
  
      if (res.ok) {
        return res.json()
      } else {
        getOrders()
      }
    } catch (error) {
        console.error(error);
    }
}

/**
 * @title Order page
 */
export default async function OrderPage() {
  const orders = sortMongoQueryByTime(await getOrders(),"latest") as unknown as Array<IOrder>

  return (
    <main>
      <Suspense fallback={<Fallback />}>
        <Order orders_={orders} />
      </Suspense>
    </main>
  )
}