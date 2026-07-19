import Header from "../components/header";
import Card from "../components/card";
import Footer from "../components/footer";
import WeightEntryForm from "./components/weight-entry-form";

/**
 * Contains the components and back-end logic for the entry page
 */
export default function EntryPage(): React.JSX.Element {

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <WeightEntryForm />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
