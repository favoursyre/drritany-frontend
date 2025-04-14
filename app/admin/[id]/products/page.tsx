///This handles the admin product page

///Libraries -->
import { Metadata, NextApiResponse } from "next";
import AdminProducts from "@/components/admin/products/collection/Products";
import { backend, sortMongoQueryByTime } from "@/config/utils";
import { IProduct, Props } from "@/config/interfaces";

///Commencing the code
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { query } = await searchParams

    return {
      title: `Products`,
      description: `View Products`,
      alternates: {
        canonical: query ? `/products?query=${query}` : `/products`
      }
    } as Metadata
  }

///This fetches the products
async function getProducts() {
    try {
      const res = await fetch(`${backend}/product?action=order`, {
        method: "GET",
        cache: "no-store",
      })
  
      if (res.ok) {
        return res.json()
      } else {
        getProducts()
      }
    } catch (error) {
        console.error(error);
    }
}

///This function searches for passed in query
async function getQueriedProducts(query: string | string[] | undefined) {
    try {
      const res = await fetch(`${backend}/product?action=search&query=${query}`, {
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
 * @title Admin Products page
 */
export default async function AdminProductPage({ searchParams }: Props) {
    const products = sortMongoQueryByTime(await getProducts(), "latest") as unknown as Array<IProduct>
    const { query } = await searchParams
    console.log("Query: ", query)
    console.log('testing why')
    const queriedProducts = sortMongoQueryByTime(await getQueriedProducts(query), "latest") as unknown as Array<IProduct>

  return (
    <main className="admin_product">
        {query ? (
            <AdminProducts products_={queriedProducts} />
        ) : (
            <AdminProducts products_={products} />
        )}
    </main>
  )
}
