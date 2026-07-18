import Header from "../components/header";
import Card from "../components/card";
import Footer from "../components/footer";
import WeightEntryForm from "./components/weight-entry-form";
import { getUserCookie } from "../libs/cookies";
import type { GoalOption, GoalWeightEntryType } from "../libs/types";

export default function EntryPage() {
  async function addWeightEntry(weightValue: number, weighInDate: Date) {
    "use server";

    if (weightValue < 0) {
      throw new Error("Weight value cannot be less than zero");
    }

    if (weighInDate === null) {
      throw new Error("Weigh in date cannot be blank");
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to add weight entries
    // const isEntryAdded = createWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new weight entry");
    }
  }

  async function changeWeighEntry(
    weightEntryId: number,
    weightValue: number,
    weighInDate: Date,
  ) {
    "use server";

    if (weightEntryId <= 0) {
      throw new Error("Existing weight entry invalid");
    }

    if (weightValue < 0) {
      throw new Error("Weight value cannot be less than zero");
    }

    if (weighInDate === null) {
      throw new Error("Weigh in date cannot be blank");
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to update weight entry
    // const isEntryUpdated = updateWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryUpdated = true;

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update new weight entry");
    }
  }

  async function getGoalWeightEntry() {
      "use server";
      const userCookie = await getUserCookie();
  
      if (userCookie === null) {
        throw new Error("Invalid user account", {
          cause: "invalid-user-cookie",
        });
      }
  
      // TODO: Use database method for getting goal weight entry
      // const userGoalWeightEntry: GoalWeightEntryType = readGoalWeightEntry(userCookie);
      const userGoalWeightEntry: GoalWeightEntryType = {
        goalWeightEntryId: 1,
        weightValue: 140,
        goalType: "Loss",
        userId: 1,
      };
      
      if (userGoalWeightEntry === null) {
        return null;
      } else {
        return userGoalWeightEntry;
      }
    }
  
  async function addGoalWeightEntry(weightValue: number, goalType: GoalOption) {
    "use server";

    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero");
    }

    if (
      goalType === "Maintenance" ||
      goalType === "Gain" ||
      goalType === "Loss"
    ) {
      const userCookie = await getUserCookie();

      if (userCookie === null) {
        throw new Error("Invalid user account", {
          cause: "invalid-user-cookie",
        });
      }

      // TODO: Create database method to add goal weight entries
      // const isEntryAdded = createGoalWeightEntry(weightValue, goalType, userCookie)
      const isEntryAdded = true;

      if (isEntryAdded) {
        return;
      } else {
        throw new Error("Failed to add new goal weight entry");
      }
    } else {
      throw new Error("Invalid goal type");
    }
  }

  async function changeGoalWeighEntry(
    goalWeightEntryId: number,
    weightValue: number,
    goalType: GoalOption,
  ) {
    "use server";

    if (goalWeightEntryId <= 0) {
      throw new Error("Existing goal weight entry invalid");
    }

    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than 0");
    }

    if (
      goalType === "Maintenance" ||
      goalType === "Gain" ||
      goalType === "Loss"
    ) {
      const userCookie = await getUserCookie();

      if (userCookie === null) {
        throw new Error("Invalid user account", {
          cause: "invalid-user-cookie",
        });
      }

      // TODO: Create database method to update goal weight entry
      // const isEntryUpdated = updateWeightEntry(weightValue, weighInDate, userCookie)
      const isEntryUpdated = true;

      if (isEntryUpdated) {
        return;
      } else {
        throw new Error("Failed to update new weight entry");
      }
    } else {
      throw new Error("Invalid goal type");
    }
  }

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <WeightEntryForm
            getGoalWeightEntry={getGoalWeightEntry}
            changeGoalWeighEntry={changeGoalWeighEntry}
            changeWeighEntry={changeWeighEntry}
            addWeightEntry={addWeightEntry}
            addGoalWeightEntry={addGoalWeightEntry}
          />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
