///This handles the admin order page

///Libraries -->
import { Metadata, NextApiResponse } from "next";
import AdminOrders from "@/components/admin/orders/collection/Orders";
import { backend, sortMongoQueryByTime } from "@/config/utils";
import { IOrder, Props } from "@/config/interfaces";

///Commencing the code
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    return {
      title: `Orders`,
      description: `View Orders`,
      alternates: {
        canonical: searchParams.query ? `/orders?query=${searchParams.query}` : `/orders`
      }
    } as Metadata
  }

///This fetches the products
async function getOrders() {
    try {
      const res = await fetch(`${backend}/order`, {
        method: "GET",
        cache: "no-store",
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

///This function searches for passed in query
async function getQueriedOrders(query: string | string[] | undefined) {
    try {
      const res = await fetch(`${backend}/order?action=search&query=${query}`, {
        method: "GET",
        cache: "no-store",
      });
      
      if (res.ok) {
        return res.json()
      } else {
        //getQueriedProducts(query)
        console.log("request not ok")
      }
  } catch (error) {
      console.error(error);
  }
}


/**
 * @title Admin Orders page
 */
export default async function AdminOrderPage(req: { params: Object, searchParams: { query: string}}, res: NextApiResponse) {
    const orders = sortMongoQueryByTime(await getOrders(),"latest") as unknown as Array<IOrder>
    const { query } = req.searchParams
    console.log("Query: ", query)
    console.log('testing why')
    const queriedOrders = sortMongoQueryByTime(await getQueriedOrders(query), "latest") as unknown as Array<IOrder>

  return (
    <main className="admin_product">
        {query ? (
            <AdminOrders orders_={queriedOrders} />
        ) : (
            <AdminOrders orders_={orders} />
        )}
    </main>
  )
}
