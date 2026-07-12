interface ButtonProps {
    children: React.ReactNode;
}

export default function Button({children}: ButtonProps) {
    return (
        <button className="w-1/2 h-12 text-2xl rounded-2xl bg-graphite-800 cursor-pointer hover:bg-cool-sky-300/20">{children}</button>
    )
}