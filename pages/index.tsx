import Head from "next/head"
import { Navbar } from "../components/landing/navbar"
import { Hero } from "../components/landing/hero"
import { TrustBar } from "../components/landing/trust-bar"
import { FeatureSection } from "../components/landing/feature-section"
import { PortalSupport } from "../components/landing/portal-support"
import { Reviews } from "../components/landing/reviews"
import { CtaFooter } from "../components/landing/cta-footer"

export default function Home() {
  return (
    <>
      <Head>
        <title>Healyx — Personalized Telehealth Care</title>
        <meta
          name="description"
          content="Healyx provides medical care online—simple, direct, and led by licensed providers. Weight loss, men's & women's health, peptides, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Hero />
        <TrustBar />

        <FeatureSection
          id="weight-loss"
          eyebrow="DOCTOR-GUIDED GLP-1 CARE"
          title="Weight loss made easy with"
          titleAccent="personalized care"
          image="/images/weight-loss-lifestyle.png"
          checklistTitle="Everything you need—included:"
          checklist={[
            "Prescription to fast, effective GLP-1",
            "1:1 physician guidance",
            "Free dietician visits & care coaching included*",
            "24/7 support",
            "Fast & discreet shipping",
          ]}
          subheading="A smarter approach to weight loss, built around you"
          description="Find the right GLP-1 medication with the confidence that comes from knowing it is doctor-approved and budget-friendly."
        />

        <PortalSupport />

        <FeatureSection
          id="womens-health"
          eyebrow="CARE DESIGNED FOR WOMEN'S HEALTH"
          title="Whole-body care for her"
          titleAccent="balance, vitality, and confidence"
          image="/images/womens-health.png"
          checklistTitle="Benefits that support every stage"
          checklist={[
            "Hormone balance",
            "Healthy weight management",
            "Hair strength & growth support",
            "Skin health & radiance",
            "Fast & discreet shipping",
          ]}
          subheading="Support that evolves with your body"
          description="Doctor-guided care for weight, hormones, hair, and skin, with personalized treatment plans designed to support your health through every stage of life."
          comingSoon
          reverse
        />

        <FeatureSection
          id="meals"
          eyebrow="METABOLIC NUTRITION"
          title="Fuel your transformation,"
          titleAccent="protect your progress"
          image="/images/meals.png"
          checklistTitle="Meal prep made simple"
          checklist={[
            "Chef-made, portion-controlled",
            "Weekly rotating meals",
            "Nutritionally balanced",
            "Macro-friendly options",
            "Completely hassle-free",
          ]}
          subheading="Skip the hassle of meal planning and prepping"
          description="Healyx Meals is the perfect partner for your GLP-1 journey—delivering chef-prepared, medically aligned nutrition designed to help you lose fat while preserving muscle."
        />

        <FeatureSection
          id="supplements"
          eyebrow="PURPOSE-DRIVEN SUPPLEMENTATION"
          title="Supplements with the power to"
          titleAccent="boost real results"
          image="/images/supplements.png"
          checklistTitle="What better support looks like"
          checklist={[
            "Clean, transparent ingredients",
            "Built to support daily health",
            "Evidence-based dosing",
            "Doctor-formulated blends",
            "High-quality sourcing",
          ]}
          subheading="Support that helps you feel better over time"
          description="Doctor-designed formulas made with quality ingredients and evidence-based dosing to support your body day after day."
          comingSoon
          reverse
        />

        <FeatureSection
          id="mens-health"
          eyebrow="CARE FOR ENERGY, HORMONES, AND PERFORMANCE"
          title="Men's healthcare, built for"
          titleAccent="men who expect more"
          image="/images/mens-health.png"
          checklistTitle="Benefits that make a difference"
          checklist={[
            "Physical performance",
            "Hormone balance",
            "Energy levels",
            "Mental focus",
            "Fast & discreet shipping",
          ]}
          subheading="Care designed to help you feel stronger, sharper, and more in control"
          description="Doctor-guided care for hormones, energy, and performance, with treatment plans tailored to your goals and adjusted as your body responds."
        />

        <FeatureSection
          id="peptides"
          eyebrow="ADVANCED PEPTIDE SUPPORT"
          title="Targeted support for recovery,"
          titleAccent="performance, and longevity"
          image="/images/peptides.png"
          checklistTitle="Unlock what your body can do"
          checklist={[
            "Recovery & repair support",
            "Strength and performance",
            "Better sleep quality",
            "Overall optimization",
            "Fast & discreet shipping",
          ]}
          subheading="Support that works below the surface"
          description="Peptide therapy is designed to support how your body recovers, performs, and repairs over time—with targeted options for recovery, strength, sleep, and overall optimization."
          comingSoon
          reverse
        />

        <Reviews />
        <CtaFooter />
      </div>
    </>
  )
}
