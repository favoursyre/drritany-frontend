///Layout page

///Libraries -->
import { domainName, companyName } from '@/config/utils';
import Layout from "@/components/layout/Layout";
//import dynamic from "next/dynamic";
//const Layout = dynamic(() => import("@/components/layout/Layout"), { ssr: false })

///Commencing the code

///Declaring the metadata
//console.log('Domain Name: ', domainName)
export const metadata = {
  metadataBase: new URL(domainName), 
  title: {
    default: `${companyName}`,
    template: `%s | ${companyName}`
  },
  icons: {
    icon: '/favicon.ico',
  },
  description: 'We pride ourselves in offering a diverse range of items at the best prices, from everyday essentials to unique finds, ensuring that each customer finds something special. Our commitment to quality and customer satisfaction drives everything we do.',
  keywords: [
    'idealplug',
    'ecommerce',
    'online store',
    'natural products',
    'plug',
    'ideal',
    'shop',
    'buy online',
  ],
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
