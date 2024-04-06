///This handles the about page

///Libraries -->
import About from "@/components/about/about/About"
import Story from "@/components/about/story/Story"
import Mission from "@/components/about/mission/Mission"
import Vision from "@/components/about/vision/Vision"
import FAQ from "@/components/faq/Faq"
import { Metadata } from "next"

///Commencing the code
export const metadata: Metadata = {
  title: 'About Us',
  description: `We are a team of health and wellness enthusiasts who are passionate about helping people achieve optimal health through natural and effective products.`,
  alternates: {
    canonical: `/about`
  }
}
///This function fetches all the faqs
// async function getFaqs() {
//   try {
//       const response = await fetch(
//           `${backend}/faqs`,
//           {
//             next: {
//               revalidate: 60,
//             },
//           }
//         );
      
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      
//         const faqs = await response.json();
//         return faqs;
//   } catch (error) {
//       console.error(error);
//   }
// }


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