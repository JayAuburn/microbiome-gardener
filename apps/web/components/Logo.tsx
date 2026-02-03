import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  width = 32,
  height = 32,
  className = "",
  showText = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Rewild.bio Logo"
        width={width}
        height={height}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span className="hidden sm:block text-2xl font-bold text-primary">
          Rewild.bio
        </span>
      )}
    </div>
  );
}
