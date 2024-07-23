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
  description: 'We pride ourselves in offering a diverse range of items at the best prices, from everyday essentials to unique finds, ensuring that each customer finds something special. Our commitment to quality and customer satisfaction drives everything we do.',
  keywords: "products, commerce, plug, ideal, buy, online, drug, health, pharmacy, detox, toxin, shop, store, tea, pad, commerce, ecommerce, natural"
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
