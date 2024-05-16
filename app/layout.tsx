///Layout page

///Libraries -->
import { domainName, companyName } from '@/config/utils';
import Layout from "@/components/layout/Layout";

///Commencing the code

///Declaring the metadata
export const metadata = {
  metadataBase: new URL(domainName), 
  title: {
    default: `${companyName}`,
    template: `%s | ${companyName}`
  },
  icons: {
    icon: 'favicon.ico',
  },
  description: 'E-Commerce website for all sorts of natural health products',
  keywords: "drug, health, pharmacy, detox, toxin, shop, store, tea, pad, commerce, ecommerce, natural"
}


///Handles the root layout of the page
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Layout>
      {children}
    </Layout>
  )
}
