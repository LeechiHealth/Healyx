import { ScanLine, Check } from "lucide-react"

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[260px] rounded-[2rem] border border-border bg-background/60 p-2.5 shadow-xl shadow-black/30">
      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
        <div className="flex justify-center py-2">
          <span className="h-1.5 w-16 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="px-4 pb-6 pt-2">{children}</div>
      </div>
    </div>
  )
}

const biomarkers = [
  { name: "Vitamin D", status: "Low", tone: "warn" },
  { name: "LDL", status: "Elevated", tone: "bad" },
  { name: "A1C", status: "Optimal", tone: "good" },
]

const toneClass: Record<string, string> = {
  good: "bg-primary/15 text-primary",
  warn: "bg-foreground/10 text-foreground",
  bad: "bg-foreground/10 text-foreground",
}

const tasks = ["Hydration · 2.5L", "Sleep target · 8h", "Activity · 8,000 steps"]

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      desc: "Scan labs, bloodwork, imaging reports, and health documents.",
      phone: (
        <div className="flex flex-col items-center">
          <p className="self-start text-xs font-bold tracking-widest text-muted-foreground">SCAN DOCUMENT</p>
          <div className="mt-4 flex aspect-[3/4] w-full items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-background/40">
            <div className="flex flex-col items-center gap-2 text-primary">
              <ScanLine className="h-8 w-8" />
              <span className="text-xs font-semibold">Scanning lab report…</span>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
        </div>
      ),
    },
    {
      num: "02",
      title: "Understand",
      desc: "Get simple explanations and personalized insights.",
      phone: (
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground">LAB ANALYSIS</p>
          <ul className="mt-4 space-y-3">
            {biomarkers.map((b) => (
              <li key={b.name} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2.5">
                <span className="text-xs font-semibold text-card-foreground">{b.name}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${toneClass[b.tone]}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      num: "03",
      title: "Act",
      desc: "Receive health protocols tailored to your goals.",
      phone: (
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground">TODAY&apos;S TASKS</p>
          <ul className="mt-4 space-y-3">
            {tasks.map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="text-xs font-medium text-card-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ]

  return (
    <section id="how-it-works" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-widest text-primary">HOW HEALYX WORKS</p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Three steps to better health decisions
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center text-center">
              <PhoneFrame>{s.phone}</PhoneFrame>
              <p className="mt-8 text-sm font-bold tracking-widest text-primary">{s.num}</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
