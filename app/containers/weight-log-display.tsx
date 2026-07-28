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
import type {
  GoalWeightEntryType,
  sortingKey,
  sortOptions,
  sortOrder,
  WeightEntryType,
} from "../libs/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeightLogTableTable from "../components/weight-log-table";
import {
  removeWeightEntry,
  getWeightEntries,
} from "../actions/middleware/weight-entry";
import { getGoalWeightEntry } from "../actions/middleware/goal-weight-entry";
import { errorCausesObj } from "../libs/errors";
import LoadingIndicator from "../components/loading-indicator";
import MessageDisplay from "../components/message-display";
import { sortEntriesArray } from "../libs/sorting";
import { cacheWeightEntryArray, getCachedWeightEntryArray, removeFromCachedWeightEntryArray } from "../libs/session-storage";

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
  const [infoMessage, setInfoMessage] = useState<string>("");

  // Initializes state for storing all user weight entries
  const [weightEntries, setWeightEntries] = useState<WeightEntryType[]>([]);

  // Initializes the sorting filter state with the default sorting order
  const [currentSortingOption, setCurrentSortingOption] = useState<sortOptions>(
    {
      sortingKey: "weighInDate",
      sortOrder: "DESC",
    },
  );

  /**
   * Handles the updating of weight entries
   * @param entryId Id for the weight entry to be updated
   */
  function triggerEntryUpdate(entryId: string): void {
    // Sets the loading boolean
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles the removal of weight entries
   * @param entryId Id for the weight entry to be deleted
   */
  async function triggerEntryRemoval(entryId: string): Promise<void> {
    // Sets the loading boolean
    setIsLoading(true);

    try {
      const userConfirmation = confirm(
        "Are you sure you want to remove this entry?",
      );

      if (userConfirmation) {
        // Calls the method to delete weight entries
        await removeWeightEntry(entryId);
        setInfoMessage("Entry removed");

        removeFromCachedWeightEntryArray(entryId);
      }
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
   * Checks if the user has entered a goal weight. If an entry is associated with their user id, teh entry is returned,
   * else the user is redirected to the goal weight entry page
   */
  async function checkGoalWeightEntry(): Promise<GoalWeightEntryType> {
    const goalWeightEntry = await getGoalWeightEntry();

    if (goalWeightEntry === null) {
      // If no goal weight entry exists for the user, navigates them to the entry page
      alert("No goal entry recorded, navigating to goal entry page...");
      const navigationURL = "/entry?type=goal-weight-entry";
      router.push(navigationURL);
      throw new Error("Failed to access goal weight entry", {
        cause: errorCausesObj.noUserEntry,
      });
    } else {
      return goalWeightEntry;
    }
  }

  /**
   * Checks if the user has achieved their current weight goal based on their
   * last logged weight value
   * @param currentWeight User's most recently logged weight
   */
  async function checkGoalWeightProgress(
    currentWeight: number,
  ): Promise<boolean> {
    let isGoalWeightAchieved = false;

    const goalWeightEntry = await checkGoalWeightEntry();

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

  /**
   * Sorts the weight entries based on the passed in parameters
   *
   * @param {sortOrder} sortOrder The order in which the array will be sorted, either ascending or descending
   * @param {sortingKey} objKey The object key associated with the value that will be used to sort the weight entry array
   */
  function sortWeightEntries(
    sortOrder: sortOrder,
    objKey: "weightValue" | "weighInDate",
  ) {
    setWeightEntries((prevEntries) => {
      // Copies the array
      const sortedEntries = [...prevEntries];

      // Calls the method to sort the array using the passed in parameters
      sortEntriesArray(sortedEntries, objKey, sortOrder);

      // Returns the sorted array
      return sortedEntries;
    });
  }

  /**
   * Updates the current sorting option and resorts the weight entry array to reflect the change.
   * If the sortingKey is already used to sort the array, the sort order will be toggled,
   * else the new sortingKey will be used and the sort order will initially be descending
   *
   * @param {sortingKey} sortingKey The key associated with the sorting call, will toggle the sorting order if already active
   */
  function updateSortingOption(sortingKey: sortingKey) {
    // Copies the current sorting options
    let newSortingOptions = { ...currentSortingOption };

    const cachedObj = getCachedWeightEntryArray();

    console.log(cachedObj);

    // Checks if the currently active sort button is clicked
    if (currentSortingOption.sortingKey === sortingKey) {
      // Checks the current sort order and switches to the opposing one
      newSortingOptions.sortOrder =
        currentSortingOption.sortOrder === "ASC" ? "DESC" : "ASC";
    } else {
      // If the opposing sort button is clicked it is activated
      newSortingOptions.sortingKey = sortingKey;
      newSortingOptions.sortOrder = "DESC";
    }

    sortWeightEntries(
      newSortingOptions.sortOrder,
      newSortingOptions.sortingKey,
    );
    setCurrentSortingOption(newSortingOptions);
  }

  /**
   * Triggers the fetch to access the user's weight entries to the appropriate middleware method
   */
  async function loadWeightEntries() {
    // Sets the loading boolean and clears the error message and info message
    setIsLoading(true);

    // Initializes temp weight entries array
    let userWeightEntries: WeightEntryType[] = [];

    try {
      const cachedArray = getCachedWeightEntryArray();

      // Check if the cached array is valid
      if (cachedArray === null) {
        // Gathers the user's weight entries
        userWeightEntries = await getWeightEntries();
        // Stores the entries in cache
        cacheWeightEntryArray(userWeightEntries);
      } else {
        // Uses the cached array values
        userWeightEntries = cachedArray;
        console.log(userWeightEntries)
      }

      // Sorts the weight entries in the temp array to the default order, by date and in descending order
      sortEntriesArray(userWeightEntries, "weighInDate", "DESC");
      // Updates the current sorting option to reflect the default sorting options
      setCurrentSortingOption({
        sortingKey: "weighInDate",
        sortOrder: "DESC",
      });
      // Updates state after sorting the temp array
      setWeightEntries(userWeightEntries);

      // Checks if the returned array has at least one entry
      if (userWeightEntries.length >= 1) {
        // Checks if the user's goal weight is achieved
        const isGoalWeightAchieved = await checkGoalWeightProgress(
          userWeightEntries[0].weightValue,
        );

        // TODO: Replace with Success Popup Element
        if (isGoalWeightAchieved) {
          // alert("Goal Weight Achieved!");
        }
      } else {
        // TODO: Move goal weight entry check to separate function and have it occur after the initial sorting of the array
        // If no entries, still checks if the user has a goal weight entry
        await checkGoalWeightEntry();
      }
    } catch (error) {
      // Checks if error is a known error
      if (error instanceof Error && error.cause) {
        // Checks the cause of the error
        if (error.cause === errorCausesObj.invalidUserCookie) {
          alert("Invalid Signing, returning to signing page...");
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

  useEffect(() => {
    // Instantiates a timeout
    let eraseTimeOut: NodeJS.Timeout | null = null;
    // Checks if any message variable is populated
    if (infoMessage !== "" || errorMessage !== "") {
      // Creates a clear timeout that clears both messages after 5 seconds
      eraseTimeOut = setTimeout(() => {
        setInfoMessage("");
        setErrorMessage("");
      }, 5000);
    }

    // If the effect updates or the page changes, the clear timeout is closed if it is not null
    return () => {
      if (eraseTimeOut !== null) {
        clearTimeout(eraseTimeOut);
      }
    };
  }, [infoMessage, errorMessage]);

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
      <div className="w-full h-[calc(100%-10rem)] min-h-min p-8">
        <Card className="p-0">
          {isLoading && <LoadingIndicator />}
          <WeightLogTableTable
            weightEntries={weightEntries}
            triggerEntryRemoval={triggerEntryRemoval}
            triggerEntryUpdate={triggerEntryUpdate}
            currentSortingOption={currentSortingOption}
            updateSortingOption={updateSortingOption}
          />
          <MessageDisplay
            errorMessage={errorMessage}
            infoMessage={infoMessage}
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
