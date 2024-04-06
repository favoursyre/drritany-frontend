"use Client"
///This handles the terms of service page

///Libraries -->
import Terms from "@/components/terms/Terms"
import { Metadata } from "next"

///Commencing the code
export const metadata: Metadata = {
  title: 'Terms',
  description: `Our Terms of Use are not just legalities; they are the cornerstones of a trusted partnership.`,
  alternates: {
    canonical: `/terms`
  }
}

/**
 * @title Homepage
 */
export default function TermsPage() {
  return (
    <>
      <Terms />
    </>
  )
}