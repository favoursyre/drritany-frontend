"use Client"
///This handles the terms of order page

///Libraries -->
//import Order from "@/components/order/Order"
import { Metadata } from "next"
import { backend, sortMongoQueryByTime } from "@/config/utils"
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

///This fetches the products
async function getUserOrders(userId: string) {
  if (!userId) {
    return
  }

    try {
      const res = await fetch(`${backend}/order?userId=${userId}`, {
        method: "GET",
        //cache: "no-store",
      })
  
      if (res.ok) {
        return res.json()
      } else {
        getUserOrders(userId)
      }
    } catch (error) {
        console.error(error);
    }
}

/**
 * @title Order page
 */
export default async function OrderPage({ searchParams }: Props) {
  const _userId = searchParams.userId as unknown as string
  console.log("User Id: ", _userId)
  const orders = sortMongoQueryByTime(await getUserOrders(_userId), "latest") as unknown as Array<IOrder>

  return (
    <main>
      <Suspense fallback={<Fallback />}>
        <Order orders_={orders} />
      </Suspense>
    </main>
  )
}