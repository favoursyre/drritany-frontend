///This handles the faqs page

///Libraries -->
import FAQs from "@/components/faq/Faq"
import { Metadata } from "next"
import { companyName } from "@/config/utils"

///Commencing the code
export const metadata: Metadata = {
  title: 'FAQs',
  description: `Here, we unravel the complexities and provide clear & concise answers to your most pressing queries.`,
  alternates: {
    canonical: `/faqs`
  }
}


/**
 * @title Faqspage
 */
export default async function FaqPage() {
  // const faqs = await getFaqs()

  return (
    <main className="faq_page">
      <FAQs />
    </main>
  )
}