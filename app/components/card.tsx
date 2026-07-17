import { twMerge } from "tailwind-merge";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export default function Card({ className, children }: CardProps) {
  // Prioritizes the passed in classes
  const finalClassName = twMerge(
    "w-full lg:w-1/2 lg:translate-x-1/2 h-full bg-graphite-700 items-center p-2",
    className
  )

  return <div className={finalClassName}>{children}</div>;
}
