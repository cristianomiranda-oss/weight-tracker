import DebugContainer from "./containers/debug-container";

interface DebugPageProps {}

/**
 * Contains components for testing components or services within the application
 */
export default function DebugPage({}: DebugPageProps) {
  return (
    <main className="w-full h-full">
      <DebugContainer />
    </main>
  );
}
