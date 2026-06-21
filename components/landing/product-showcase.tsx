import { MessageSquare, FlaskConical, TrendingUp, ListChecks, Check } from "lucide-react"

const trend = [40, 52, 48, 61, 58, 72, 80]

const insights = [
  { name: "Vitamin D", note: "Low — supplement recommended" },
  { name: "Ferritin", note: "Optimal range" },
  { name: "HbA1c", note: "Slightly elevated" },
]

const protocolItems = ["Morning sunlight", "Protein with breakfast", "Zone 2 cardio"]

export function ProductShowcase() {
  return (
    <section id="product" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-primary">PRODUCT</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Everything you need to manage your health
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {/* AI Health Assistant */}
        <Card icon={MessageSquare} title="AI Health Assistant" desc="Ask anything about your results and history.">
          <div className="flex flex-col gap-3">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
              Is my thyroid normal?
            </div>
            <div className="mr-auto max-w-[88%] rounded-2xl rounded-tl-sm border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              Your TSH and free T4 are both within optimal range. No signs of thyroid dysfunction in
              your latest panel.
            </div>
          </div>
        </Card>

        {/* Lab Analysis */}
        <Card icon={FlaskConical} title="Lab Analysis" desc="Plain-language explanations for every biomarker.">
          <ul className="space-y-3">
            {insights.map((i) => (
              <li key={i.name} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-sm font-semibold text-card-foreground">{i.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{i.note}</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Health Insights */}
        <Card icon={TrendingUp} title="Health Insights" desc="Track trends across years of data.">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-end justify-between">
              <p className="text-xs font-medium text-muted-foreground">Metabolic score</p>
              <p className="text-sm font-bold text-primary">+18%</p>
            </div>
            <div className="mt-4 flex h-28 items-end gap-2">
              {trend.map((h, idx) => (
                <span
                  key={idx}
                  className="flex-1 rounded-t-md bg-primary/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Personalized Protocols */}
        <Card icon={ListChecks} title="Personalized Protocols" desc="Action plans built around your goals.">
          <ul className="space-y-3">
            {protocolItems.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-card-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h3 className="font-bold text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}
