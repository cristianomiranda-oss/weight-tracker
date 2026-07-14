interface ButtonProps {
    children: React.ReactNode;
    type?: "default" | "warning"
    onClick?: () => void
}

export default function Button({children, type, onClick}: ButtonProps) {
    let bgColor: string = "bg-graphite-800";
    let bgColorHover: string = "hover:bg-cool-sky-300/20";

    if (type === "warning") {
        bgColor = "bg-red-500"
        bgColorHover = "hover:bg-red-500/80"
    }

    return (
        <button className={`w-1/2 h-12 text-2xl rounded-2xl cursor-pointer ${bgColor} ${bgColorHover}`} onClick={onClick}>{children}</button>
    )
}