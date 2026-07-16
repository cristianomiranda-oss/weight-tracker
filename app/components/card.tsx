interface CardProps {
  padding: boolean;
  children: React.ReactNode;
}

export default function Card({ padding, children }: CardProps) {
  return <div className={`w-full h-full bg-graphite-700 flex flex-col justify-around items-center ${padding ? "p-2" : "p-0"}`}>{children}</div>;
}
