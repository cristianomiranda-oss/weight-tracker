"use client";

import Button from "@/app/components/button";
import GoalTypeSelector from "@/app/components/goal-type-selector";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WeightEntryForm() {
  const router = useRouter();

  const [isWeightGoalEntry, setIsWeightGoalEntry] = useState<boolean>(false);
  const toggleWeightGoalEntry = () => setIsWeightGoalEntry((curr) => !curr);

  function navigateToHome(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <form
      className="w-full h-full flex flex-col justify-around items-center"
      onSubmit={(e) => navigateToHome(e)}
    >
      <h2 className="text-5xl">
        {isWeightGoalEntry ? "Goal Weight Entry" : "Weight Entry"}
      </h2>

      <LabeledInput id="weightValue" label="Weight" inputType="number" />
      {!isWeightGoalEntry && (
        <LabeledInput id="weightDate" label="Date" inputType="date" />
      )}
      {isWeightGoalEntry && (
        <GoalTypeSelector id="goalType" label="Goal Type" />
      )}

      <SubmitButton>Enter</SubmitButton>
      <Button type="warning" onClick={toggleWeightGoalEntry}>
        Cancel
      </Button>
    </form>
  );
}
