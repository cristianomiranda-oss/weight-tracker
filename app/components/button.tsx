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
  let bgColor: string = "bg-text-input";
  let bgColorHover: string = "hover:bg-text-input/80";

  // Checks which button type to display
  if (type === "warning") {
    bgColor = "bg-warning";
    bgColorHover = "hover:bg-warning/80";
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
