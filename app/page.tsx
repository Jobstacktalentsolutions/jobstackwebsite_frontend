import Nav from './pages/components/nav'
import Hero from './pages/components/hero'
import WhyChooseUs from './pages/components/whychoose'
import Testimonials from './pages/components/testimonials'
import JobsSection from './pages/components/jobpostings'
import CTA from './pages/components/CTA'
import Footer from './pages/components/footer'

export default function Page() {
  return (
    <main className="relative l">
      <Nav />
      <Hero />
      <WhyChooseUs />
      <Testimonials />
      <JobsSection />
      <CTA />
      <Footer />

    </main>
  )
}
