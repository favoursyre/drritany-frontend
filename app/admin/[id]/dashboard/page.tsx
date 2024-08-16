///This handles the admin account page

///Libraries -->
import { Metadata } from "next";
import AdminBase from "@/components/admin/base/Base";

///Commencing the code
export const metadata: Metadata = {
  title: 'Dashboard',
  description: `Dashboard for Admin account.`,
  alternates: {
    canonical: `/admin/`
  }
}

/**
 * @title Admin Dashboard page
 */
export default async function AdminDashboardPage() {

  return (
    <main className="admin_page">
        
    </main>
  )
}
