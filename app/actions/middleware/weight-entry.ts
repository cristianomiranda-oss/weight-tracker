"use server";

import { getUserCookie } from "@/app/libs/cookies";
import type { WeightEntryType } from "@/app/libs/types";

// Temporary Weight Entry Array
const tempWeightArr: WeightEntryType[] = [
  {
    userId: 0,
    weightDate: new Date(),
    weightValue: 143.01,
    WeightEntryId: 1,
  },
  {
    userId: 0,
    weightDate: new Date(),
    weightValue: 141.01,
    WeightEntryId: 2,
  },
  {
    userId: 0,
    weightDate: new Date(),
    weightValue: 142.01,
    WeightEntryId: 3,
  },
  {
    userId: 0,
    weightDate: new Date(),
    weightValue: 145.01,
    WeightEntryId: 4,
  },
];

/**
 * Middleware for accessing weight entries associated with a user cookie.
 * The currently stored user account cookie is used for identifying what entry is associated with the user.
 * @throws Signals the process failed
 */
export async function getWeightEntries() {
  const userCookie = await getUserCookie();

  if (userCookie === null) {
    throw new Error("Invalid user account", {
      cause: "invalid-user-cookie",
    });
  }

  // TODO: Add database method
  // const userWeightEntries: WeightEntryType[] = await readWeightEntries(userCookie);

  // * Temporarily uses a predefined weightArr
  const userWeightEntries: WeightEntryType[] = tempWeightArr;

  if (userWeightEntries === null) {
    throw new Error("Failed to access weight entries");
  } else {
    return userWeightEntries;
  }
}

/**
 * Middleware for removing specific weight entries from the database.
 * Entries are identified based on the stored user account cookie and the passed in entryId value.
 * @param entryId Id value for the entry to be removed.
 * @throws Signals the process failed
 */
export async function deleteWeightEntry(entryId: number) {
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
