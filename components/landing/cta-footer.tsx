import { ArrowRight } from "lucide-react"

export function CtaFooter() {
  return (
    <>
      <section id="start" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-8 py-16 text-center lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,hsl(202_60%_20%)_0%,transparent_70%)]" />
          <div className="relative">
            <p className="text-xs font-bold tracking-widest text-primary">
              BETTER IS POSSIBLE—AND WE BUILT FOR IT
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Modern healthcare, built around you
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Care coaching led by certified medical assistants and registered dietitians—so you
              have the guidance you need to stay on track and see results.
            </p>
            <a
              href="#start"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 lg:flex-row lg:px-10">
          <span className="text-2xl font-extrabold tracking-tight">Healyx</span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a href="#weight-loss" className="transition-colors hover:text-foreground">Weight Loss</a>
            <a href="#mens-health" className="transition-colors hover:text-foreground">Men&apos;s Health</a>
            <a href="#womens-health" className="transition-colors hover:text-foreground">Women&apos;s Health</a>
            <a href="#reviews" className="transition-colors hover:text-foreground">Reviews</a>
          </div>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Healyx. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
