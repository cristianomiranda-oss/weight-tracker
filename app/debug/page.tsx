import Card from "../components/card";
import Footer from "../components/footer";
import Header from "../components/header";
import ApiDebug from "./containers/api-debug";

interface DebugPageProps {}

/**
 * Contains components for testing components or services within the application
 */
export default function DebugPage({}: DebugPageProps) {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] min-h-min p-8">
        <Card>
          <ApiDebug />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
