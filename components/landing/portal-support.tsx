import Image from "next/image"
import { Headphones } from "lucide-react"

export function PortalSupport() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex items-center gap-5 overflow-hidden rounded-3xl border border-border bg-card p-5">
          <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl">
            <Image
              src="/images/app-mockup.png"
              alt="Healyx patient portal app"
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>
          <div>
            <p className="font-bold">
              Everything, <span className="text-primary">all in one place</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Track your progress, check in with your provider, and manage your care in your
              all-in-one patient portal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-border bg-card p-5">
          <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-2xl bg-accent">
            <Headphones className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-bold">
              Unlimited <span className="text-primary">24/7 support</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Medical support continues throughout your care, whenever you need it.
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground/70">
        Prescriptions are issued only after an online consultation with an independent licensed
        provider. Compound medications are dispensed by state-licensed pharmacies but are not FDA
        approved.
        <br />
        *Free to end users subject to insurance and copays; eligibility to be determined at time of
        visit.
      </p>
    </section>
  )
}
