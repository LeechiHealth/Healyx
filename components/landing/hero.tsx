import { ArrowRight, Play, FileText, Check, Sparkles } from "lucide-react"
import Image from "next/image"

const uploads = [
  { name: "CBC Blood Panel.pdf", size: "1.2 MB" },
  { name: "Metabolic Panel.pdf", size: "0.9 MB" },
  { name: "DEXA Scan.pdf", size: "2.4 MB" },
]

const protocolTasks = ["Walk 8,000 steps", "Increase protein intake", "Improve sleep consistency"]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,hsl(202_60%_20%)_0%,hsl(205_32%_8%)_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-8 -z-0 -translate-x-1/2 select-none text-[22vw] font-black leading-none text-foreground/[0.03]">
        Healyx
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-36 lg:px-10 lg:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            The operating system for your health
          </p>
          <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Understand your health.{" "}
            <span className="text-primary">All in one place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Upload lab results, scan medical documents, connect health data, and receive
            personalized health insights and action plans powered by AI.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              <Play className="h-4 w-4 text-primary" /> Watch Demo
            </a>
          </div>
        </div>

        {/* App dashboard mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b border-border bg-background/40 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <Image
                src="/healyx-logo.jpg"
                alt="Healyx logo"
                width={18}
                height={18}
                className="ml-3 rounded-[22%]"
              />
              <span className="text-xs font-medium text-muted-foreground">Healyx — Health Dashboard</span>
            </div>

            <div className="grid gap-px bg-border lg:grid-cols-[0.85fr_1.3fr_0.85fr]">
              {/* Left: uploads */}
              <div className="bg-card p-5">
                <p className="text-xs font-bold tracking-widest text-muted-foreground">RECENT UPLOADS</p>
                <ul className="mt-4 space-y-2.5">
                  {uploads.map((u) => (
                    <li key={u.name} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <FileText className="h-4 w-4 text-primary" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-card-foreground">{u.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{u.size}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center: chat */}
              <div className="flex flex-col bg-card p-5">
                <p className="text-xs font-bold tracking-widest text-muted-foreground">AI HEALTH ASSISTANT</p>
                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                    Why is my LDL increasing?
                  </div>
                  <div className="mr-auto max-w-[90%] rounded-2xl rounded-tl-sm border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    Your LDL increased <span className="font-semibold text-foreground">14% over 8 months</span>{" "}
                    while HDL remained stable. Common contributors include dietary saturated fat,
                    reduced activity, and sleep disruption.
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2.5">
                  <span className="flex-1 text-xs text-muted-foreground">Ask about your results…</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                    <ArrowRight className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                </div>
              </div>

              {/* Right: protocol */}
              <div className="bg-card p-5">
                <p className="text-xs font-bold tracking-widest text-muted-foreground">PROTOCOL</p>
                <div className="mt-4 rounded-2xl border border-border bg-background/40 p-4">
                  <p className="text-sm font-bold text-card-foreground">Metabolic Optimization</p>
                  <p className="mt-0.5 text-[11px] font-medium text-primary">Week 1</p>
                  <ul className="mt-4 space-y-3">
                    {protocolTasks.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3.5} />
                        </span>
                        <span className="text-xs leading-relaxed text-muted-foreground">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
