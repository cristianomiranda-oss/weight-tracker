"use client";
import { useState } from "react";
import Header from "../components/header";
import Card from "../components/card";
import LabeledInput from "../components/labeled-input";
import Button from "../components/button";
import Footer from "../components/footer";
import { useRouter } from "next/navigation";
import GoalTypeSelector from "../components/goal-type-selector";

export default function EntryPage() {
  const router = useRouter();

  const [isWeightGoalEntry, setIsWeightGoalEntry] = useState<boolean>(false);
  const toggleWeightGoalEntry = () => setIsWeightGoalEntry((curr) => !curr);

  function navigateToHome() {
    router.push("/");
  }

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <h2 className="text-5xl">
            {isWeightGoalEntry ? "Goal Weight Entry" : "Weight Entry"}
          </h2>

          <LabeledInput id="weightValue" label="Weight" inputType="number" />
          {!isWeightGoalEntry && <LabeledInput id="weightDate" label="Date" inputType="date" />}
          {isWeightGoalEntry && <GoalTypeSelector id="goalType" label="Goal Type"/>}

          <Button onClick={navigateToHome}>Enter</Button>
          <Button type="warning" onClick={toggleWeightGoalEntry}>
            Cancel
          </Button>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
