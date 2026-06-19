import Image from "next/image"
import { Check } from "lucide-react"

export type FeatureSectionProps = {
  id: string
  eyebrow: string
  title: string
  titleAccent?: string
  image: string
  checklistTitle: string
  checklist: string[]
  subheading: string
  description: string
  cta?: string
  comingSoon?: boolean
  reverse?: boolean
}

export function FeatureSection({
  id,
  eyebrow,
  title,
  titleAccent,
  image,
  checklistTitle,
  checklist,
  subheading,
  description,
  cta,
  comingSoon,
  reverse,
}: FeatureSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-bold tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title} {titleAccent && <span className="text-primary">{titleAccent}</span>}
        </h2>
      </div>

      <div
        className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl border border-border bg-card">
          <Image
            src={image || "/placeholder.svg"}
            alt={subheading}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div>
          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="text-lg font-bold text-card-foreground">{checklistTitle}</h3>
            <ul className="mt-5 space-y-3.5">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mt-8 text-2xl font-bold tracking-tight">{subheading}</h3>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>

          {comingSoon ? (
            <p className="mt-6 inline-block rounded-full border border-border px-5 py-2 text-xs font-bold tracking-widest text-muted-foreground">
              COMING SOON
            </p>
          ) : (
            <a
              href="#start"
              className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {cta ?? "GET STARTED"}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
