import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <Image src="/logo.png" alt="MarkazGN Logo" width={size} height={size} className="h-full w-full" />
    </div>
  )
}
