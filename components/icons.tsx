import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function Icon({ className = "h-5 w-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ArrowRightIcon = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const CheckIcon = (p: IconProps) => <Icon {...p}><path d="M5 13l4 4L19 7" /></Icon>;
export const PlayIcon = (p: IconProps) => <Icon {...p}><path d="M8 5v14l11-7z" fill="currentColor" /></Icon>;
export const ChatIcon = (p: IconProps) => <Icon {...p}><path d="M4 5h16v11H9l-5 4z" /></Icon>;
export const BoltIcon = (p: IconProps) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></Icon>;
export const LayersIcon = (p: IconProps) => <Icon {...p}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></Icon>;
export const RefreshIcon = (p: IconProps) => <Icon {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></Icon>;
export const BookIcon = (p: IconProps) => <Icon {...p}><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" /><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z" /></Icon>;
export const ShieldIcon = (p: IconProps) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></Icon>;
export const MenuIcon = (p: IconProps) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
export const CloseIcon = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
