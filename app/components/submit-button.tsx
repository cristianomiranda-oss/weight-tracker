import { twMerge } from "tailwind-merge";

interface SubmitButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled: boolean;
}

/**
 * Component for displaying a submit button
 */
export default function SubmitButton({
  className,
  children,
  disabled,
}: SubmitButtonProps) {
  // Removes any conflicting classes found
  // Prioritizes the passed in classes
  const finalClassName = twMerge(
    "w-fit h-fit text-2xl md:text-4xl rounded-2xl cursor-pointer bg-graphite-800 hover:bg-cool-sky-300/20",
    className,
  );

  return (
    <button className={finalClassName} type="submit" disabled={disabled}>
      {children}
    </button>
  );
}
