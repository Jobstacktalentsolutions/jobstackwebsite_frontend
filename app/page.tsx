import Nav from './components/nav'
import Hero from './components/hero'
import WhyChooseUs from './components/whychoose'
import Testimonials from './components/testimonials'
import JobsSection from './components/jobpostings'

export default function Page() {
  return (
    <main className="relative l">
      <Nav />
      <Hero />
      <WhyChooseUs />
      <Testimonials />
      <JobsSection/>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* placeholder content to extend the page */}
        <div className="rounded-3xl bg-slate-50 p-10 text-center">
          <p className="text-slate-600">
            More sections go here.
          </p>
        </div>
      </section>
    </main>
  )
}
