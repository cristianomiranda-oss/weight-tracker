"use client";

import Button from "@/app/components/button";
import GoalTypeSelector from "@/app/entry/components/goal-type-selector";
import LabeledInput from "@/app/components/labeled-input";
import SubmitButton from "@/app/components/submit-button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  addWeightEntry,
  changeWeighEntry,
  getWeightEntry,
} from "@/app/actions/middleware/weight-entry";
import {
  addGoalWeightEntry,
  changeGoalWeighEntry,
  getGoalWeightEntry,
} from "@/app/actions/middleware/goal-weight-entry";
import LoadingIndicator from "@/app/components/loading-indicator";
import { errorCausesObj } from "@/app/libs/errors";

/**
 * Contains the components for display the weight entry and goal weight entry interfaces
 * and handles the user interactions for the interface
 */
export default function WeightEntryForm(): React.JSX.Element {
  // Initializes a router for navigation
  const router = useRouter();

  // Accesses the search parameter api
  const searchParameters = useSearchParams();
  // Pulls the 'type' search parameter to determine which screen to display
  const isWeightGoalEntry =
    searchParameters.get("type") === "goal-weight-entry";
  // Pulls the 'entryId' search parameter to determine if an already existing weight entry is to be updated
  const updateEntryId = searchParameters.get("entryId");

  // Initializes state for storing the loading flag and error messages
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Initializes various references to the html input elements in the form
  const weightValueInputRef = useRef<HTMLInputElement | null>(null);
  const weighInDateInputRef = useRef<HTMLInputElement | null>(null);
  const goalTypeSelectorRef = useRef<HTMLSelectElement | null>(null);

  const [weightValuePlaceholder, setWeightValuePlaceholder] =
    useState<string>("000.00");

  /**
   * Handles the adding of a new weight entry
   */
  async function addNewWeightEntry(): Promise<void> {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Checks if the weight value and weigh in date input refs are established
      if (
        weightValueInputRef.current !== null &&
        weighInDateInputRef.current !== null
      ) {
        // Converts the input values to their appropriate types
        const weightValue = parseFloat(weightValueInputRef.current.value);
        const weighInDate = new Date(weighInDateInputRef.current.value);

        // Calls the method to add a new weight entry
        await addWeightEntry(weightValue, weighInDate);

        navigateToHome();
      }
    } catch (error) {
      // Checks if the error is an established error
      if (error instanceof Error) {
        if (error.cause === errorCausesObj.invalidUserCookie) {
          alert("Invalid Signing, returning to signing page...");
          router.push("/accounts");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      // Change the loading boolean to indicate the function is no longer running
      setIsLoading(false);
    }
  }

  /**
   * Handles the updating of a weight entry
   */
  async function triggerWeightEntryChange(): Promise<void> {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Checks if the weight value and weigh in date input refs are established and if the updateEntryId search parameter is valid
      if (
        weightValueInputRef.current !== null &&
        weighInDateInputRef.current !== null &&
        updateEntryId !== null
      ) {
        // Converts the input values to their appropriate types
        const weightValue = parseFloat(weightValueInputRef.current.value);
        const weighInDate = new Date(weighInDateInputRef.current.value);

        // Calls the method to update the weight entry
        await changeWeighEntry(updateEntryId, weightValue, weighInDate);

        navigateToHome();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.cause === errorCausesObj.invalidUserCookie) {
          alert("Invalid Signing, returning to signing page...");
          router.push("/accounts");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      // Change the loading boolean to indicate the function is no longer running
      setIsLoading(false);
    }
  }

  /**
   * Handles the creating or updating of a goal weight entry.
   * The back-end method called is dependant on if the user already has an existing goal weight entry in the database
   */
  async function handleGoalWeightEntry(): Promise<void> {
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
          if (goalWeightEntry === null) {
            // Null indicates this will be a new goal weight entry
            await addGoalWeightEntry(weightValue, goalType);

            navigateToHome();
          } else {
            // Else updated the existing goalWeightEntry
            await changeGoalWeighEntry(
              goalWeightEntry.goalWeightEntryId,
              weightValue,
              goalType,
            );

            navigateToHome();
          }
        } else {
          throw new Error("Select a valid goal type");
        }
      }
    } catch (error) {
      // Checks if the error is an established error
      if (error instanceof Error) {
        if (error.cause === errorCausesObj.invalidUserCookie) {
          alert("Invalid Signing, returning to signing page...");
          router.push("/accounts");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      // Change the loading boolean to indicate the function is no longer running
      setIsLoading(false);
    }
  }

  /**
   * Handles form the submission of hte form based on the currently active screen
   *
   * @param e The data associated with the submit event
   */
  function handleFormSubmission(e: React.SubmitEvent): void {
    // Prevents the default form submission
    e.preventDefault();

    // Checks the currently active page
    if (isWeightGoalEntry) {
      // Calls the method to handle a goal weight entry
      handleGoalWeightEntry();
    } else {
      // Checks if the updateEntryId search parameter is invalid
      if (updateEntryId === "" || updateEntryId === null) {
        // If invalid
        // Calls the method to add a new weight entry
        addNewWeightEntry();
      } else {
        // Calls the method to update the existing weight entry
        triggerWeightEntryChange();
      }
    }
  }

  /**
   * Navigates the user to the home screen
   */
  function navigateToHome() {
    router.push("/");
  }

  /**
   * Retrieves the previous weight value for the weight entry or goal entry being updated
   */
  async function getPlaceHolderData() {
    // Sets the loading flag and clears the current error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Checks the currently active page
      if (isWeightGoalEntry) {
        // Calls the function to retrieve a goal weight entry from the database
        const goalWeightEntry = await getGoalWeightEntry();

        // Checks if a goal weight entry already exists in the database
        if (goalWeightEntry !== null) {
          // Gets the entry's weight value
          const goalWeightValue = goalWeightEntry.weightValue;

          // Sets the place holder to the weight entry value
          setWeightValuePlaceholder(`${goalWeightValue}`);
        }
      } else {
        // Checks if the updateEntryId search parameter is valid
        if (updateEntryId !== "" && updateEntryId !== null) {
          // Converts the passed in entry id to a number

          // Gets the weight entry's values
          const entryData = await getWeightEntry(updateEntryId);

          // Sets the place holder to the weight entry value
          setWeightValuePlaceholder(`${entryData.weightValue}`);
        }
      }
    } catch (error) {
      // Checks if the error is an established error
      if (error instanceof Error) {
        if (error.cause === errorCausesObj.invalidUserCookie) {
          alert("Invalid Signing, returning to signing page...");
          router.push("/accounts");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An Unknown Error has Occurred!");
      }
    } finally {
      // Change the loading boolean to indicate the function is no longer running
      setIsLoading(false);
    }
  }

  // Calls the method to update placeholder data on page load
  useEffect(() => {
    getPlaceHolderData();
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <form
        className="w-full h-full min-h-min flex flex-col justify-around items-center"
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
          placeHolder={weightValuePlaceholder}
        />
        {!isWeightGoalEntry && (
          <LabeledInput
            id="weighInDate"
            label="Date"
            inputType="datetime-local"
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

        <div className="w-1/2 md:w-3/5 h-26 flex flex-col justify-around align-middle">
          <SubmitButton className="w-full h-12" disabled={isLoading}>
            Enter
          </SubmitButton>
          <Button
            className="w-full h-12"
            type="warning"
            onClick={navigateToHome}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
