import { twMerge } from "tailwind-merge";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  type?: "default" | "warning";
  onClick?: () => void;
}

/**
 * A button component with different types of styles
 */
export default function Button({
  className,
  children,
  type,
  onClick,
}: ButtonProps) {
  let bgColor: string = "bg-graphite-800";
  let bgColorHover: string = "hover:bg-cool-sky-300/20";

  // Checks which button type to display
  if (type === "warning") {
    bgColor = "bg-red-500";
    bgColorHover = "hover:bg-red-500/80";
  }
  // Removes any conflicting classes found
  // Prioritizes the passed in classes
  const finalClassName = twMerge(
    `w-fit h-fit text-2xl md:text-4xl rounded-2xl cursor-pointer ${bgColor} ${bgColorHover}`,
    className,
  );

  return (
    <button className={finalClassName} onClick={onClick} type="button">
      {children}
    </button>
  );
}
