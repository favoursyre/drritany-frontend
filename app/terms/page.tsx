///This handles the terms of service page

///Libraries -->
import Terms from "@/components/terms/Terms"
import { Metadata } from "next"
//import dynamic from "next/dynamic";
//const Terms = dynamic(() => import("@/components/terms/Terms"), { ssr: false })

///Commencing the code
export const metadata: Metadata = {
  title: 'Terms',
  description: `Our Terms of Use are not just legalities; they are the cornerstones of a trusted partnership.`,
  alternates: {
    canonical: `/terms`
  }
}

/**
 * @title Terms page
 */
export default function TermsPage() {
  return (
    <>
      <Terms />
    </>
  )
}