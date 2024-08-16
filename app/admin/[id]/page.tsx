
///This handles the admin account page

///Libraries -->
import { Metadata } from "next";
import AdminBase from "@/components/admin/base/Base";

///Commencing the code
export const metadata: Metadata = {
  title: 'Admin Account',
  description: `Admin account.`,
  alternates: {
    canonical: `/admin/`
  }
}

/**
 * @title Admin Account page
 */
export default async function AdminAccountPage() {

  return (
    <main className="admin_page">
        
    </main>
  )
}
