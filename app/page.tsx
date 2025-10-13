import Nav from './components/nav'
import Hero from './components/hero'
import WhyChooseUs from './components/whychoose'
import Testimonials from './components/testimonials'
import JobsSection from './components/jobpostings'
import CTA from './components/CTA'
import Footer from './components/footer'

export default function Page() {
  return (
    <main className="relative l">
      <Nav />
      <Hero />
      <WhyChooseUs />
      <Testimonials />
      <JobsSection />
      <CTA />
      <Footer/>
      
    </main>
  )
}
