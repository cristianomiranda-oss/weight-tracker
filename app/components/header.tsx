interface HeaderProps {
  children?: React.ReactNode;
}

/**
 * Component for displaying the main header of the web application
 */
export default function Header({ children }: HeaderProps) {
  return (
    <header className="w-full h-20 bg-header-footer px-3 py-0.5 flex justify-center lg:justify-between items-center">
      <h1 className="text-6xl">Weight Tracker</h1>
      {children}
    </header>
  );
}
