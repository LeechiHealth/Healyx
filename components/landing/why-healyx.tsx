import { Check, X, Minus } from "lucide-react"

type Cell = "yes" | "no" | "partial" | "soon"

const rows: { label: string; apple: Cell; fn: Cell; healyx: Cell }[] = [
  { label: "Stores data", apple: "yes", fn: "yes", healyx: "yes" },
  { label: "Provides understanding", apple: "no", fn: "partial", healyx: "yes" },
  { label: "Personalized protocols", apple: "no", fn: "yes", healyx: "yes" },
  { label: "Provider access", apple: "no", fn: "partial", healyx: "soon" },
]

function CellMark({ value }: { value: Cell }) {
  if (value === "yes")
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary">
        <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
      </span>
    )
  if (value === "partial")
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted">
        <Minus className="h-4 w-4 text-muted-foreground" strokeWidth={3} />
      </span>
    )
  if (value === "soon")
    return <span className="text-[11px] font-bold tracking-wider text-primary">SOON</span>
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/60">
      <X className="h-4 w-4 text-muted-foreground/50" strokeWidth={3} />
    </span>
  )
}

export function WhyHealyx() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-widest text-primary">WHY HEALYX</p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            More than a tracker. More than telehealth.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Most platforms either collect data or provide care. Healyx connects both.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-5 text-xs font-bold tracking-widest text-muted-foreground sm:px-8">
                  CAPABILITY
                </th>
                <th className="px-3 py-5 text-center text-xs font-semibold text-muted-foreground sm:px-6">
                  Apple Health
                </th>
                <th className="px-3 py-5 text-center text-xs font-semibold text-muted-foreground sm:px-6">
                  Function
                </th>
                <th className="bg-accent/40 px-3 py-5 text-center text-sm font-bold text-primary sm:px-6">
                  Healyx
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className="px-5 py-5 text-sm font-semibold text-card-foreground sm:px-8">{r.label}</td>
                  <td className="px-3 py-5 text-center sm:px-6">
                    <CellMark value={r.apple} />
                  </td>
                  <td className="px-3 py-5 text-center sm:px-6">
                    <CellMark value={r.fn} />
                  </td>
                  <td className="bg-accent/40 px-3 py-5 text-center sm:px-6">
                    <CellMark value={r.healyx} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Our advantage is interpretation and action—not just storage.
        </p>
      </div>
    </section>
  )
}
