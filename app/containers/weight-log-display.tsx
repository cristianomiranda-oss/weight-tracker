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

interface WeightLogDisplayProps {
  getWeightEntries: () => Promise<WeightEntryType[]>;
  getGoalWeightEntry: () => Promise<GoalWeightEntryType>;
  deleteWeightEntry: (entryId: number) => Promise<boolean>;
}

export default function WeightLogDisplay({
  getWeightEntries,
  getGoalWeightEntry,
  deleteWeightEntry,
}: WeightLogDisplayProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weightEntries, setWeightEntries] = useState<WeightEntryType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function triggerEntryRemoval(entryId: number) {
    // Sets the loading boolean and clears the error message
    setIsLoading(true);
    setErrorMessage("");

    try {
      const isEntryRemoved = await deleteWeightEntry(entryId);

      if (!isEntryRemoved) {
        throw new Error("Failed to remove entry");
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

  async function checkGoalWeight(currentWeight: number) {
      let isGoalWeightAchieved = false;
  
      // TODO: Add getGoalWeight function
      const goalWeightEntry: GoalWeightEntryType = await getGoalWeightEntry();

      if (goalWeightEntry === null) {
        throw new Error("Failed to access goal weight entry");
      }
  
      if (goalWeightEntry.goalType === "Loss") {
        isGoalWeightAchieved = goalWeightEntry.weightValue >= currentWeight;
      } else if (goalWeightEntry.goalType === "Maintenance") {
        isGoalWeightAchieved = goalWeightEntry.weightValue === currentWeight;
      } else if (goalWeightEntry.goalType === "Gain") {
        isGoalWeightAchieved = goalWeightEntry.weightValue <= currentWeight;
      }
  
      return isGoalWeightAchieved;
  }

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
          alert("Goal Weight Achieved!");
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
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadWeightEntries();
  }, []);

  return (
    <>
      <Header>
        <IconLink
          className="hidden lg:block"
          icon={faArrowRightFromBracket}
          href="/accounts"
          disabled={isLoading}
        />
      </Header>
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card className="p-0">
          <WeightLogTableTable
            weightEntries={weightEntries}
            triggerEntryRemoval={triggerEntryRemoval}
          />
        </Card>
      </div>
      <Footer className="flex justify-around lg:justify-center gap-0 lg:gap-36 items-center">
        <IconLink
          className="text-center"
          icon={faWeightScale}
          href="/entry"
          disabled={isLoading}
        />
        <IconLink
          className="text-center"
          icon={faCirclePlus}
          href="/entry"
          disabled={isLoading}
        />
        <IconLink
          className="text-center block lg:hidden"
          icon={faArrowRightFromBracket}
          href="/accounts"
          disabled={isLoading}
        />
      </Footer>
    </>
  );
}
