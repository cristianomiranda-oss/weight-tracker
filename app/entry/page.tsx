import Header from "../components/header";
import Card from "../components/card";
import Footer from "../components/footer";
import WeightEntryForm from "./components/weight-entry-form";
import { getUserCookie } from "../libs/cookies";
import type { GoalOption } from "../libs/types";

export default function EntryPage() {
  async function addWeightEntry(weightValue: number, weighInDate: Date) {
    "use server";

    if (weightValue <= 0 || weighInDate === null) {
      throw new Error("Weight value and weigh in date cannot be blank");
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to add weight entries
    // const isEntryAdded = createWeightEntry(weightValue, weighInDate, userId)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new weight entry");
    }
  }

  async function addGoalWeightEntry(weightValue: number, goalType: GoalOption) {
    "use server";

    if (weightValue <= 0 || goalType === null) {
      throw new Error("Weight value and goal type cannot be blank");
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Create database method to add goal weight entries
    // const isEntryAdded = createGoalWeightEntry(weightValue, goalType, userId)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new goal weight entry");
    }
  }

  return (
    <main className="w-full h-full">
      <Header />
      <div className="w-full h-[calc(100%-10rem)] p-8">
        <Card>
          <WeightEntryForm addWeightEntry={addWeightEntry} addGoalWeightEntry={addGoalWeightEntry} />
        </Card>
      </div>
      <Footer />
    </main>
  );
}
