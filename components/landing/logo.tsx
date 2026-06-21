import Image from "next/image"

export function Logo({
  size = 32,
  withWordmark = true,
  className = "",
}: {
  size?: number
  withWordmark?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/healyx-logo.jpg"
        alt="Healyx logo"
        width={size}
        height={size}
        className="rounded-[22%]"
        priority
      />
      {withWordmark && (
        <span className="text-2xl font-extrabold tracking-tight text-foreground">Healyx</span>
      )}
    </span>
  )
}
