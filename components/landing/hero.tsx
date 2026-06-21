import Image from "next/image"
import { ArrowRight } from "lucide-react"

const categories = [
  { title: "Weight Loss", href: "#weight-loss", image: "/images/weight-loss.png" },
  { title: "Peptides & Longevity", href: "#peptides", image: "/images/peptides.png" },
  { title: "Men's Health", href: "#mens-health", image: "/images/mens-health.png" },
  { title: "Women's Health", href: "#womens-health", image: "/images/womens-health.png" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,hsl(202_60%_20%)_0%,hsl(205_32%_8%)_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-0 -translate-x-1/2 select-none text-[22vw] font-black leading-none text-foreground/[0.03]">
        Healyx
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-36 lg:px-10 lg:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Join <span className="font-bold text-foreground">500,000+</span> Healyx patients
          </p>
          <h1 className="mt-5 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Healthcare, <span className="text-primary">redefined</span> for real life.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            We provide medical care online—simple, direct, and led by licensed providers.
            No waiting rooms. No unnecessary steps. Just care that works.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-5 py-4">
                <span className="text-sm font-semibold text-card-foreground">{cat.title}</span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
