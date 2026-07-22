"use client";
import {
  faArrowRightFromBracket,
  faCirclePlus,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header";
import IconLink from "../components/icon-link";
import Card from "../components/card";
import Footer from "../components/footer";
import type { GoalWeightEntryType, WeightEntryType } from "../libs/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeightLogTableTable from "../components/weight-log-table";
import { removeWeightEntry, getWeightEntries } from "../actions/middleware/weight-entry";
import { getGoalWeightEntry } from "../actions/middleware/goal-weight-entry";
import { errorCausesObj } from "../libs/errors";
import LoadingIndicator from "../components/loading-indicator";

/**
 * Contains the components for displaying the weight log interface and
 * handles user interactions made with the interface.
 */
export default function WeightLogDisplay() {
  // Initializes a router to allow for navigation
  const router = useRouter();

  // Initializes state for storing the loading flag and error messages
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Initializes state for storing all user weight entries
  const [weightEntries, setWeightEntries] = useState<WeightEntryType[]>([]);

  /**
   * Handles the updating of weight entries
   * @param entryId Id for the weight entry to be updated
   */
  function triggerEntryUpdate(entryId: number): void {
    try {
      // Constructs a url with the to be updated entry's id as a search parameter
      const navigationURL = `/entry?entryId=${entryId}`;

      // Navigates to the created url
      router.push(navigationURL);
    } catch (error) {
      // Checks if error is a known error
      if (error instanceof Error && error.cause) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error has occurred");
      }
    }
  }

  /**
   * Handles the removal of weight entries
   * @param entryId Id for the weight entry to be delete4d
   */
  async function triggerEntryRemoval(entryId: number): Promise<void> {
    // Sets the loading boolean and clears the error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Calls the method to delete weight entries
      await removeWeightEntry(entryId);
    } catch (error) {
      // Checks if error is a known error
      if (error instanceof Error && error.cause) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error has occurred");
      }
    } finally {
      setIsLoading(false);

      // Reloads the weight entries
      loadWeightEntries();
    }
  }

  /**
   * Checks if the user has achieved their current weight goal based on their
   * last logged weight value
   * @param currentWeight User's most recently logged weight
   */
  async function checkGoalWeight(currentWeight: number): Promise<boolean> {
    let isGoalWeightAchieved = false;

    const goalWeightEntry = await getGoalWeightEntry();

    if (goalWeightEntry === null) {
      // If no goal weight entry exists for the user, navigates them to the entry page
      const navigationURL = '/entry?type=goal-weight-entry';
      router.push(navigationURL)
      throw new Error("Failed to access goal weight entry", {cause: errorCausesObj.noUserEntry})
    } else {
      if (goalWeightEntry.goalType === "Loss") {
        // Checks if the user's current weight is less than or equal to their goal weight
        isGoalWeightAchieved = goalWeightEntry.weightValue >= currentWeight;
      } else if (goalWeightEntry.goalType === "Maintenance") {
        // Checks if the user's current weight is equal to their goal weight
        isGoalWeightAchieved = goalWeightEntry.weightValue === currentWeight;
      } else if (goalWeightEntry.goalType === "Gain") {
        // Checks if the user's current weight is greater than or equal to their goal weight
        isGoalWeightAchieved = goalWeightEntry.weightValue <= currentWeight;
      }
      return isGoalWeightAchieved;
    }
  }

  /**
   * Triggers the fetch to access the user's weight entries to the appropriate middleware method
   */
  async function loadWeightEntries() {
    // Sets the loading boolean and clears the error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Gathers the user's weight entries
      const userWeightEntries = await getWeightEntries();
      setWeightEntries(userWeightEntries);

      // Checks if the returned array has at least one entry
      if (userWeightEntries.length >= 1) {
        // Checks if the user's goal weight is achieved
        const isGoalWeightAchieved = await checkGoalWeight(
          userWeightEntries[0].weightValue,
        );

        // TODO: Replace with Success Popup Element
        if (isGoalWeightAchieved) {
          // alert("Goal Weight Achieved!");
        }
      }
    } catch (error) {
      // Checks if error is a known error
      if (error instanceof Error && error.cause) {
        // Checks the cause of the error
        if (error.cause === "invalid-user-cookie") {
          router.push("/accounts");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An unknown error has occurred");
      }
    } finally {
      // Change the loading boolean to indicate the function is no longer running
      setIsLoading(false);
    }
  }

  // Triggers the loading of the user's weight entries upon page launch
  useEffect(() => {
    loadWeightEntries();
  }, []);

  return (
    <>
      <Header>
        <IconLink
          className="hidden lg:block"
          icon={faArrowRightFromBracket}
          hrefObj={{
            pathname: "/accounts",
          }}
          disabled={isLoading}
        />
      </Header>
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card className="p-0">
        {isLoading && <LoadingIndicator />}
          <WeightLogTableTable
            weightEntries={weightEntries}
            triggerEntryRemoval={triggerEntryRemoval}
            triggerEntryUpdate={triggerEntryUpdate}
          />
        </Card>
      </div>
      <Footer className="flex justify-around lg:justify-center gap-0 lg:gap-36 items-center">
        <IconLink
          className="text-center"
          icon={faWeightScale}
          hrefObj={{
            pathname: "/entry",
            query: {
              type: "goal-weight-entry",
            },
          }}
          disabled={isLoading}
        />
        <IconLink
          className="text-center"
          icon={faCirclePlus}
          hrefObj={{
            pathname: "/entry",
            query: {
              type: "weight-entry",
            },
          }}
          disabled={isLoading}
        />
        <IconLink
          className="text-center block lg:hidden"
          icon={faArrowRightFromBracket}
          hrefObj={{
            pathname: "/accounts",
          }}
          disabled={isLoading}
        />
      </Footer>
    </>
  );
}
