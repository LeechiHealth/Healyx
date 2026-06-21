import { FlaskConical, Activity, FileText, Watch, Search, ArrowDown, HelpCircle, Layers } from "lucide-react"

const scattered = [
  { label: "Lab Portal", Icon: FlaskConical },
  { label: "Apple Health", Icon: Activity },
  { label: "Doctor Notes", Icon: FileText },
  { label: "Wearables", Icon: Watch },
  { label: "Google Search", Icon: Search },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-primary">THE PROBLEM</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Your health data is everywhere.
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Lab results in one portal. Wearable data in another. Medical records scattered across
          providers. Most people spend hours trying to understand what it all means.
        </p>
      </div>

      <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
        {/* Scattered sources */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {scattered.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"
            >
              <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-4 py-3.5">
            <HelpCircle className="h-5 w-5 shrink-0 text-muted-foreground/60" />
            <span className="text-sm font-medium text-muted-foreground/60">Confusion</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card lg:rotate-[-90deg]">
            <ArrowDown className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Unified */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,hsl(202_60%_20%)_0%,transparent_70%)]" />
          <div className="relative flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Layers className="h-7 w-7 text-primary-foreground" />
            </span>
            <p className="mt-5 text-xl font-bold text-card-foreground">Healyx</p>
            <p className="mt-1 text-sm font-medium text-primary">One unified health record</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every result, document, and data point organized, explained, and ready to act on.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
