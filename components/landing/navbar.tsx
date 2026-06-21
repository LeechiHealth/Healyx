import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <span className="text-2xl font-extrabold tracking-tight text-foreground">Healyx</span>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#product" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Product
          </a>
          <a href="#protocols" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Protocols
          </a>
          <a href="#future" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            What&apos;s next
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#start"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            Start Free
          </a>
          <button
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </header>
  )
}
