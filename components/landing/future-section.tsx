import { Leaf, Scale, Dumbbell, Flower2, Stethoscope } from "lucide-react"

const cards = [
  {
    title: "Longevity & Wellness",
    desc: "Evidence-based supplements and wellness tools.",
    Icon: Leaf,
  },
  {
    title: "Medical Weight Management",
    desc: "Provider-guided metabolic health programs.",
    Icon: Scale,
  },
  {
    title: "Men's Health",
    desc: "Hormones, performance, and recovery.",
    Icon: Dumbbell,
  },
  {
    title: "Women's Health",
    desc: "Hormonal health and wellness insights.",
    Icon: Flower2,
  },
  {
    title: "Provider Marketplace",
    desc: "Connect with licensed healthcare professionals.",
    Icon: Stethoscope,
  },
]

export function FutureSection() {
  return (
    <section id="future" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-widest text-primary">WHAT&apos;S NEXT</p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Expanding your health ecosystem
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            The platform comes first. These layers build on top of the health record you already own.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
                <Icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-card-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <span className="mt-5 inline-block self-start rounded-full border border-border px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-muted-foreground">
                COMING SOON
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
