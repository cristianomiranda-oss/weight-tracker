import type { WeightEntryType } from "./libs/types";
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
  async function getWeightEntries() {
    "use server";
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: "invalid-user-cookie",
      });
    }

    // TODO: Add database method
    const userWeightEntries: WeightEntryType[] = tempWeightArr;

    if (userWeightEntries === null) {
      throw new Error("Failed to access weight entries");
    } else {
      return userWeightEntries;
    }
  }

  async function removeWeightEntry(entryId: number, userId: number) {
    "use server";
    console.log("TODO: Add entry removal");
  }

  return (
    <main className="w-full h-full">
      <WeightLogDisplay getWeightEntries={getWeightEntries} removeWeightEntry={removeWeightEntry} />
    </main>
  );
}
