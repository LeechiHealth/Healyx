import Head from "next/head"
import { Navbar } from "../components/landing/navbar"
import { Hero } from "../components/landing/hero"
import { ProblemSection } from "../components/landing/problem-section"
import { HowItWorks } from "../components/landing/how-it-works"
import { ProductShowcase } from "../components/landing/product-showcase"
import { WhyHealyx } from "../components/landing/why-healyx"
import { ProtocolsSection } from "../components/landing/protocols-section"
import { FutureSection } from "../components/landing/future-section"
import { TrustSection } from "../components/landing/trust-section"
import { Reviews } from "../components/landing/reviews"
import { CtaFooter } from "../components/landing/cta-footer"

export default function Home() {
  return (
    <>
      <Head>
        <title>Healyx — The Operating System For Your Health</title>
        <meta
          name="description"
          content="Upload lab results, scan medical documents, connect health data, and receive personalized health insights and action plans powered by AI. Healyx is the operating system for your health."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ProductShowcase />
        <WhyHealyx />
        <ProtocolsSection />
        <FutureSection />
        <TrustSection />
        <Reviews />
        <CtaFooter />
      </div>
    </>
  )
}
