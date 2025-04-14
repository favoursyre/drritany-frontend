"use Client"
///This handles the terms of order page

///Libraries -->
import Order from "@/components/order/Order"
import { Metadata } from "next"
import { backend, sortMongoQueryByTime, getUserOrders } from "@/config/utils"
import { IOrder, Props } from "@/config/interfaces"
import Loading from "@/components/loadingCircle/Circle"
import { Suspense } from "react"
import dynamic from 'next/dynamic'
//const Order = dynamic(
//   () => import('@/components/order/Order'),
//   { ssr: false }
// )

///Commencing the code
export const metadata: Metadata = {
  title: 'Order',
  description: `View all your orders.`,
  alternates: {
    canonical: `/order`
  }
}

/**
 * @title Order page
 */
export default async function OrderPage({ searchParams }: Props) {
  const { userId } = await searchParams
  console.log("User Id: ", userId)
  const _products = await getUserOrders(userId as unknown as string)
  console.log("Products Ser: ", _products)

  const orders = sortMongoQueryByTime(_products, "latest") as unknown as Array<IOrder>

  return (
    <main>
      <Suspense fallback={<Loading width="20px" height="20px" />}>
        <Order orders_={orders} />
      </Suspense>
    </main>
  )
}