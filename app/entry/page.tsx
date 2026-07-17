import Header from "../components/header";
import Card from "../components/card";
import Footer from "../components/footer";
import WeightEntryForm from "./components/weight-entry-form";

export default function EntryPage() {
  
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
