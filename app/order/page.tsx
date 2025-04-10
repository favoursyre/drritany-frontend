"use Client"
///This handles the terms of order page

///Libraries -->
//import Order from "@/components/order/Order"
import { Metadata } from "next"
import { backend, sortMongoQueryByTime, getUserOrders } from "@/config/utils"
import { IOrder, Props } from "@/config/interfaces"
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

/**
 * @title Order page
 */
export default async function OrderPage({ searchParams }: Props) {
  const _userId = searchParams.userId as unknown as string
  console.log("User Id: ", _userId)
  const _products = await getUserOrders(_userId)
  console.log("Products Ser: ", _products)

  const orders = sortMongoQueryByTime(_products, "latest") as unknown as Array<IOrder>

  return (
    <main>
      <Suspense fallback={<Fallback />}>
        <Order orders_={orders} />
      </Suspense>
    </main>
  )
}