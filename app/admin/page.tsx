
///This handles the admin page

///Libraries -->
import { Metadata } from "next";
import AdminBase from "@/components/admin/base/Base";

///Commencing the code
export const metadata: Metadata = {
  title: 'Admin',
  description: `Admin account.`,
  alternates: {
    canonical: `/admin`
  }
}

/**
 * @title Admin page
 */
export default async function AdminPage() {

  return (
    <main className="admin_page">
        <AdminBase />
    </main>
  )
}
