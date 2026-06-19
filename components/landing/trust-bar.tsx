import { Stethoscope, MonitorSmartphone, BadgeDollarSign, PackageCheck } from "lucide-react"

const items = [
  { label: "LICENSED MEDICAL PROVIDERS", Icon: Stethoscope },
  { label: "100% ONLINE", Icon: MonitorSmartphone },
  { label: "CLEAR PRICING", Icon: BadgeDollarSign },
  { label: "SHIPPED TO YOUR DOOR", Icon: PackageCheck },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6 py-6 lg:px-10">
        {items.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
