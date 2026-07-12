interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return <div className="w-full h-full bg-graphite-700 flex flex-col justify-around items-center p-2">{children}</div>;
}
