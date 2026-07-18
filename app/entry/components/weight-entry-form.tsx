"use client";

import Button from "@/app/components/button";
import GoalTypeSelector from "@/app/entry/components/goal-type-selector";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function WeightEntryForm() {
  const searchParameters = useSearchParams();
  const isWeightGoalEntry =
    searchParameters.get("type") === "goal-weight-entry";
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const weightValueInputRef = useRef<HTMLInputElement | null>(null);
  const weighInDateInputRef = useRef<HTMLInputElement | null>(null);
  const goalTypeSelectorRef = useRef<HTMLSelectElement | null>(null);

  function handleFormSubmission(e: React.SubmitEvent) {
    e.preventDefault();

    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (isWeightGoalEntry) {
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  function navigateToHome() {
    router.push("/");
  }

  return (
    <form
      className="w-full h-full flex flex-col justify-around items-center"
      onSubmit={(e) => handleFormSubmission(e)}
    >
      <h2 className="text-5xl">
        {isWeightGoalEntry ? "Goal Weight Entry" : "Weight Entry"}
      </h2>

      <LabeledInput
        id="weightValue"
        label="Weight"
        inputType="number"
        disabled={isLoading}
        ref={weightValueInputRef}
      />
      {!isWeightGoalEntry && (
        <LabeledInput
          id="weighInDate"
          label="Date"
          inputType="date"
          disabled={isLoading}
          ref={weighInDateInputRef}
        />
      )}
      {isWeightGoalEntry && (
        <GoalTypeSelector id="goalType" label="Goal Type" ref={goalTypeSelectorRef} />
      )}

      <SubmitButton disabled={isLoading}>Enter</SubmitButton>
      <Button type="warning" onClick={navigateToHome}>
        Cancel
      </Button>
    </form>
  );
}
