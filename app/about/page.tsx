///This handles the about page

///Libraries -->
import About from "@/components/about/about/About"
import Story from "@/components/about/story/Story"
import Mission from "@/components/about/mission/Mission"
import Vision from "@/components/about/vision/Vision"
import FAQ from "@/components/faq/Faq"
import { Metadata } from "next"
import { companyName } from "@/config/utils"

///Commencing the code
export const metadata: Metadata = {
  title: 'About Us',
  description: `At ${companyName}, we pride ourselves in offering a diverse range of items, from everyday essentials to unique finds, ensuring that each customer finds something special.`,
  alternates: {
    canonical: `/about`
  }
}

/**
 * @title Homepage
 */
export default async function AboutPage() {
  // const faqs = await getFaqs()

  return (
    <main className="about_page">
      <About />
      <Story />
      <Mission />
      <Vision />
      <FAQ />
    </main>
  )
}