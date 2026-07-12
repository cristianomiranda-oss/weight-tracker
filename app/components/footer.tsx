interface HeaderProps {
  children?: React.ReactNode;
}

export default function Footer({ children }: HeaderProps) {
  return <footer className="w-full h-20 bg-turf-green-800">{children}</footer>;
}
