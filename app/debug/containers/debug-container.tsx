import Card from "@/app/components/card";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import { useState } from "react";

interface DebugContainerProps {}

/**
 * Contains the logic for switching between the various debug tests
 */
export default function DebugContainer({}: DebugContainerProps) {
  const [debugTest, setDebugTest] = useState<"api" | "error">("api");

  return (
    <>
      <Header />
      <div className="w-full h-[calc(100%-10rem)] min-h-min p-8">
        <Card></Card>
      </div>
      <Footer />
    </>
  );
}
