import { twMerge } from "tailwind-merge";

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Component for displaying the main header of the web application
 */
export default function Footer({ className, children }: HeaderProps) {
  // Prioritizes the passed in classes
  const finalClassName = twMerge(
    "w-full h-20 bg-turf-green-800",
    className
  )

  return <footer className={finalClassName}>{children}</footer>;
}
