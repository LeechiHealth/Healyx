import { FileText, Lock, Sparkles, User, ArrowRight } from "lucide-react"

const flow = [
  { label: "Documents", Icon: FileText },
  { label: "Encrypted Storage", Icon: Lock },
  { label: "AI Analysis", Icon: Sparkles },
  { label: "You", Icon: User },
]

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-primary">PRIVACY &amp; SECURITY</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Your data. Your control.
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Built for privacy. Designed for transparency. Created to help you understand your
          health—not monetize it.
        </p>
      </div>

      <div className="mt-14 flex flex-col items-center justify-center gap-4 lg:flex-row">
        {flow.map(({ label, Icon }, idx) => (
          <div key={label} className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="flex w-44 flex-col items-center gap-3 rounded-3xl border border-border bg-card px-6 py-7 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
                <Icon className="h-6 w-6 text-primary" />
              </span>
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
            </div>
            {idx < flow.length - 1 && (
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground lg:rotate-0" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
