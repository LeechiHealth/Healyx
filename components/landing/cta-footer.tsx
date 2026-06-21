import { ArrowRight, FlaskConical, Watch, FileText, Sparkles, ListChecks, Stethoscope, Heart } from "lucide-react"

const ecosystem = [
  { label: "Labs", Icon: FlaskConical },
  { label: "Wearables", Icon: Watch },
  { label: "Records", Icon: FileText },
  { label: "AI", Icon: Sparkles },
  { label: "Protocols", Icon: ListChecks },
  { label: "Providers", Icon: Stethoscope },
]

export function CtaFooter() {
  return (
    <>
      <section id="start" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-8 py-16 text-center lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,hsl(202_60%_20%)_0%,transparent_70%)]" />
          <div className="relative">
            <p className="text-xs font-bold tracking-widest text-primary">THE HEALTH OS</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              The operating system for your health
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Upload your data. Understand what it means. Follow a personalized protocol. Access
              care when you need it.
            </p>

            {/* Ecosystem graphic */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {ecosystem.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-xs font-semibold text-muted-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-accent/40 px-6 py-3">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-lg font-extrabold tracking-tight text-card-foreground">Healyx</span>
              </div>
            </div>

            <div className="mt-10">
              <a
                href="#start"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start Free <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 lg:flex-row lg:px-10">
          <span className="text-2xl font-extrabold tracking-tight">Healyx</span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#product" className="transition-colors hover:text-foreground">Product</a>
            <a href="#protocols" className="transition-colors hover:text-foreground">Protocols</a>
            <a href="#future" className="transition-colors hover:text-foreground">What&apos;s next</a>
          </div>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Healyx. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
