"use Client"
///This handles the cart receipt page

///Libraries -->
import CartInvoice from '@/components/invoice/Invoice';
import { IOrder, Props } from '@/config/interfaces';
import { Metadata } from 'next';
import { domainName } from '@/config/utils';

///Commencing the code
///Declaring the metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order: Array<IOrder> | undefined = await getCart(params.id)
  if (!order) {
    return {
      title: "Not found",
      description: "Page not found"
    }
  } else {
    return {
      title: `Invoice`,
      description: `Dear ${order[0].customerSpec.fullName}, view your invoice`,
      alternates: {
        canonical: `/order/invoice/${params.id}`
      }
    }
  }
}

///This fetches the product info page
async function getCart(id: string) {
  try {
    const res = await fetch(`${domainName}/api/order/${id}`, {
      method: "GET",
      cache: "no-store",
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
export default async function CartOrderByIdPage({ params: { id } }: { params: { id: string }}) {
  //console.log("ID: ", id)
    const cart = await getCart(id) as unknown as Array<IOrder>
    //console.log("Cart: ", cart)

  return (
    <main className="cart">
      <CartInvoice cart_={cart[0]} />
    </main>
  )
}