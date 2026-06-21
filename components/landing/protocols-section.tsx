import { Moon, HeartPulse, Hourglass } from "lucide-react"

const protocols = [
  { name: "Sleep Optimization", pct: 82, Icon: Moon },
  { name: "Metabolic Health", pct: 64, Icon: HeartPulse },
  { name: "Longevity", pct: 47, Icon: Hourglass },
]

const builtFrom = ["Lab results", "Health history", "Biomarkers", "Symptoms", "Goals"]

export function ProtocolsSection() {
  return (
    <section id="protocols" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-bold tracking-widest text-primary">PERSONALIZED PROTOCOLS</p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Health protocols built around <span className="text-primary">you</span>.
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Not generic wellness advice. Not internet searches. Not one-size-fits-all plans.
            Every protocol is generated from your own data.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {builtFrom.map((b) => (
              <li
                key={b}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Protocol dashboard */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-card-foreground">Your Protocols</p>
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
              3 active
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {protocols.map(({ name, pct, Icon }) => (
              <div key={name} className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-sm font-semibold text-card-foreground">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{pct}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background/80">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
