import { twMerge } from "tailwind-merge";

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    type?: "default" | "warning"
    onClick?: () => void
}

export default function Button({className, children, type, onClick}: ButtonProps) {
    let bgColor: string = "bg-graphite-800";
    let bgColorHover: string = "hover:bg-cool-sky-300/20";

    if (type === "warning") {
        bgColor = "bg-red-500"
        bgColorHover = "hover:bg-red-500/80"
    }

    // Prioritizes the passed in classes
    const finalClassName = twMerge(
        `w-1/2 md:w-3/5 h-12 text-2xl md:text-4xl rounded-2xl cursor-pointer ${bgColor} ${bgColorHover}`,
        className
    )

    return (
        <button className={finalClassName} onClick={onClick}>{children}</button>
    )
}