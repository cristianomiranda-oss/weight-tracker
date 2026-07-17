import { twMerge } from "tailwind-merge";

interface SubmitButtonProps {
    className?: string;
    children: React.ReactNode;
}

export default function SubmitButton({ className, children }: SubmitButtonProps) {
    // Prioritizes the passed in classes
    const finalClassName = twMerge(
        'w-1/2 md:w-3/5 h-12 text-2xl md:text-4xl rounded-2xl cursor-pointer bg-graphite-800 hover:bg-cool-sky-300/20',
        className
    )

    return <button className={finalClassName} type="submit">{children}</button>
}