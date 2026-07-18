import type { GoalWeightEntryType, WeightEntryType } from "./libs/types";
import WeightLogDisplay from "./containers/weight-log-display";
import { getUserCookie } from "./libs/cookies";

const tempWeightArr: WeightEntryType[] = [
    {
      userId: 0,
      weightDate: new Date(),
      weightValue: 143.01,
      WeightEntryId: 0,
    },
    {
      userId: 0,
      weightDate: new Date(),
      weightValue: 141.01,
      WeightEntryId: 1,
    },
    {
      userId: 0,
      weightDate: new Date(),
      weightValue: 142.01,
      WeightEntryId: 2,
    },
    {
      userId: 0,
      weightDate: new Date(),
      weightValue: 145.01,
      WeightEntryId: 3,
    },
  ];

export default function WeightLogHome() {
  async function getGoalWeightEntry() {
    "use server";
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Add database method top get goal weight entry
    // const userGoalWeightEntry: GoalWeightEntryType = readGoalWeightEntry(userCookie);
    const userGoalWeightEntry: GoalWeightEntryType = {
      GoalWeightEntryId: 1,
      weightValue: 140,
      goalType: "Loss",
      userId: 1,
    };

    if (userGoalWeightEntry === null) {
      throw new Error("Failed to access weight entries");
    } else {
      return userGoalWeightEntry;
    }
  }

  async function getWeightEntries() {
    "use server";
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Add database method
    // const userWeightEntries: WeightEntryType[] = await readWeightEntries(userCookie);
    const userWeightEntries: WeightEntryType[] = tempWeightArr;

    if (userWeightEntries === null) {
      throw new Error("Failed to access weight entries");
    } else {
      return userWeightEntries;
    }
  }

  async function deleteWeightEntry(entryId: number) {
    "use server";
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Add database method
    // const isEntryDeleted: boolean = await deleteWeightEntry(entryId, userCookie);
    const isEntryDeleted: boolean = true;

    if (isEntryDeleted) {
      return;
    } else {
      throw new Error("Failed to access weight entries");
    }
  }

  return (
    <main className="w-full h-full">
      <WeightLogDisplay getGoalWeightEntry={getGoalWeightEntry} getWeightEntries={getWeightEntries} deleteWeightEntry={deleteWeightEntry} />
    </main>
  );
}
