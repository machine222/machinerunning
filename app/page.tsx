import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ToolsSection from "@/components/tools-section"
import FreeLectureSection from "@/components/free-lecture-section"
import ReviewsSection from "@/components/reviews-section"
import Footer from "@/components/footer"
import PaidCourseBanner from "@/components/paid-course-banner"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ToolsSection />
        <FreeLectureSection />
        <PaidCourseBanner />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}

