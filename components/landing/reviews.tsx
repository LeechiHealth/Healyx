import { Star } from "lucide-react"

const reviews = [
  {
    name: "Marcus",
    text: "I uploaded 4 years of bloodwork and understood more in 15 minutes than I had in years.",
  },
  {
    name: "Priya",
    text: "Finally everything is in one place. My labs, my wearable data, and clear explanations I actually get.",
  },
  {
    name: "Devon",
    text: "The protocol it built from my results was specific and realistic—not generic wellness advice.",
  },
  {
    name: "Alyssa",
    text: "It flagged a trend in my LDL that two different doctors never mentioned. Genuinely eye-opening.",
  },
  {
    name: "Ken",
    text: "Asking questions about my own results and getting straight answers changed how I think about my health.",
  },
  {
    name: "Sofia",
    text: "Scanning a lab PDF and instantly seeing what's optimal and what's not feels like the future.",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-primary">THOSE WHO CHOSE HEALYX</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Clarity people couldn&apos;t find anywhere else.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Join the people using Healyx to finally understand their health data and act on it with
          confidence.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-3xl border border-border bg-card p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {r.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-card-foreground">{r.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
