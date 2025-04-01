
///This handles the admin login page

///Libraries -->
//import Cart from "@/components/cart/Cart"
import ProductSlide from "@/components/product/productSlide/ProductSlide"
import { IProduct } from "@/config/interfaces";
import { shuffleArray } from "@/config/utils";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";
//const Cart = dynamicImport(() => import("@/components/cart/Cart"), { ssr: false })
import { Suspense } from "react";
import AdminLogin from "@/components/admin/login/Login";

///Commencing the code
export const metadata: Metadata = {
  title: 'Admin Login',
  description: `Log in to admin account.`,
  alternates: {
    canonical: `/admin/login`
  }
}

/**
 * @title Admin Login page
 */
export default async function LoginAdminPage() {

  return (
    <main className="admin_login_page">
      <AdminLogin />
    </main>
  )
}
