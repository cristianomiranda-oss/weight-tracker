import Image from "next/image";
import Card from "./components/card";
import Header from "./components/header";
import Footer from "./components/footer";

export default function WeightLogHome() {
  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>Weight Log Home</Card>
      </div>
      <Footer />
    </main>
  );
}
