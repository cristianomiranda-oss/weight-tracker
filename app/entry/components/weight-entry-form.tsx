"use client";

import Button from "@/app/components/button";
import GoalTypeSelector from "@/app/entry/components/goal-type-selector";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import type { GoalOption, GoalWeightEntryType } from "@/app/libs/types";

interface WeightEntryFormProps {
  addWeightEntry: (weightValue: number, weighInDate: Date) => Promise<void>;
  addGoalWeightEntry: (
    weightValue: number,
    goalType: "Loss" | "Maintenance" | "Gain",
  ) => Promise<void>;
  changeWeighEntry: (weightEntryId: number, weightValue: number, weighInDate: Date) => Promise<void>;
  changeGoalWeighEntry: (goalWeightEntryId: number, weightValue: number, goalType: GoalOption) => Promise<void>;
  getGoalWeightEntry: () => Promise<GoalWeightEntryType | null>;
}


export default function WeightEntryForm({
  addWeightEntry,
  addGoalWeightEntry,
  changeWeighEntry,
  changeGoalWeighEntry,
  getGoalWeightEntry
}: WeightEntryFormProps) {
  const searchParameters = useSearchParams();
  const isWeightGoalEntry =
    searchParameters.get("type") === "goal-weight-entry";
  const updateEntryId = searchParameters.get("entryId");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const weightValueInputRef = useRef<HTMLInputElement | null>(null);
  const weighInDateInputRef = useRef<HTMLInputElement | null>(null);
  const goalTypeSelectorRef = useRef<HTMLSelectElement | null>(null);

  async function addNewWeightEntry() {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (
        weightValueInputRef.current !== null &&
        weighInDateInputRef.current !== null
      ) {
        const weightValue = parseFloat(weightValueInputRef.current.value);
        const weighInDate = new Date(weighInDateInputRef.current.value);

        await addWeightEntry(weightValue, weighInDate);

        navigateToHome();
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function triggerWeightEntryChange() {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (
        weightValueInputRef.current !== null &&
        weighInDateInputRef.current !== null &&
        updateEntryId !== null
      ) {
        const weightEntryId = parseInt(updateEntryId);
        const weightValue = parseFloat(weightValueInputRef.current.value);
        const weighInDate = new Date(weighInDateInputRef.current.value);

        await changeWeighEntry(weightEntryId, weightValue, weighInDate);

        navigateToHome();
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      setIsLoading(false);
    }
  }

 async function handleGoalWeightEntry() {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Calls the function to retrieve a goal weight entry from the database
      const goalWeightEntry = await getGoalWeightEntry();

      // Confirms the input references are established
      if (
        weightValueInputRef.current !== null &&
        goalTypeSelectorRef.current !== null
      ) {
        // Converts the weight value input ref values to a number 
        const weightValue = parseFloat(weightValueInputRef.current.value);

        
        const goalType = goalTypeSelectorRef.current.value;

        // Checks if the goalType is a valid goal
        if (
          goalType === "Maintenance" ||
          goalType === "Gain" ||
          goalType === "Loss"
        ) {

          // Checks if a goal weight entry is already contained in the database
          if (goalWeightEntry === null) { // Null indicates this will be a new goal weight entry
            await addGoalWeightEntry(weightValue, goalType);
  
            navigateToHome();
          } else { // Else updated the existing goalWeightEntry
            await changeGoalWeighEntry(goalWeightEntry.goalWeightEntryId, weightValue, goalType);
  
            navigateToHome();
          }
        } else {
          throw new Error("Select a valid goal type");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmission(e: React.SubmitEvent) {
    e.preventDefault();

    if (isWeightGoalEntry) {
      handleGoalWeightEntry();
    } else {
      if (updateEntryId === "" || updateEntryId === null) {
        addNewWeightEntry();
      } else {
        triggerWeightEntryChange();
      }
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

      <h3 className="text-3xl text-red-700 text-center">{errorMessage}</h3>

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
        <GoalTypeSelector
          id="goalType"
          label="Goal Type"
          ref={goalTypeSelectorRef}
        />
      )}

      <SubmitButton disabled={isLoading}>Enter</SubmitButton>
      <Button type="warning" onClick={navigateToHome}>
        Cancel
      </Button>
    </form>
  );
}
