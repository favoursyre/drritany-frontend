"use Client"
///This handles the cart receipt page

///Libraries -->
import OrderReceipt from '@/components/receipt/Receipt';
import { IOrder, Props } from '@/config/interfaces';
import { Metadata } from 'next';
import { backend } from '@/config/utils';

///Commencing the code
///Declaring the metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order: Array<IOrder> | undefined = await getCart(id)

  if (!order) {
    return {
      title: "Not found",
      description: "Page not found"
    }
  } else {
    return {
      title: `Receipt`,
      description: `Dear ${order[0].customerSpec.fullName}, view your receipt`,
      alternates: {
        canonical: `/order/receipt/${id}`
      }
    }
  }
}

///This fetches the product info page
async function getCart(id: string) {
  try {
    const res = await fetch(`${backend}/order/${id}`, {
      method: "GET",
      cache: "force-cache",
    })

    //console.log("Res: ", await res)

    if (res.ok) {
      
      return res.json()
    } else {
      console.log("not refetching")
      //getProduct(id)
    }
    
  } catch (error) {
      console.error(error);
  }
}

/**
 * @title Product info page
 */
export default async function CartOrderByIdPage({ params }: Props) {
  const { id } = await params
  //console.log("ID: ", id)
    const cart = await getCart(id) as unknown as Array<IOrder>
    //console.log("Cart: ", cart)

  return (
    <main className="cart">
      <OrderReceipt order_={cart[0]} />
    </main>
  )
}