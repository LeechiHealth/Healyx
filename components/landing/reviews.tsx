import { Star } from "lucide-react"

const reviews = [
  {
    name: "Billy",
    text: "Ms. Gonzalez was great! She listened to my needs and provided details of the meds and any issues that rise.",
  },
  {
    name: "Terika",
    text: "The provider was knowledgeable and helpful. She answered all my questions and made me feel as if this was not our first time meeting.",
  },
  {
    name: "Jamie",
    text: "The questions are to the point and easy to navigate. I'm able to voice my concerns and they are quick to respond and keep me updated.",
  },
  {
    name: "Jacqueline",
    text: "Slowly and surely reaching my goals with Healyx's help. They have been very attentive and provided me with all the resources to be successful.",
  },
  {
    name: "Diana",
    text: "The staff has been so friendly and caring. I didn't expect that! If I call, I get an immediate answer from a real person!",
  },
  {
    name: "Donna",
    text: "The physician was very knowledgeable and ready to answer all my concerns, even about future checkups throughout my journey.",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-widest text-primary">THOSE WHO CHOSE HEALYX</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          There&apos;s a reason people are raving about us.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Join the multitude of people who have trusted Healyx to help change their lives, achieving
          significant, lasting results.
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
