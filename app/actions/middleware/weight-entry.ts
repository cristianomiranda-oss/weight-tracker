"use server";

import { getUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/libs/errors";
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
export async function getWeightEntries(): Promise<WeightEntryType[]> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Add database method
    // const userWeightEntries: WeightEntryType[] = await readWeightEntries(userCookie);

    // * Temporarily uses a predefined weightArr
    const userWeightEntries: WeightEntryType[] = tempWeightArr;

    if (userWeightEntries === null) {
      throw new Error("Failed to access weight entry", {
        cause: errorCausesObj.processFail,
      });
    } else {
      return userWeightEntries;
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for removing specific weight entries from the database.
 * Entries are identified based on the stored user account cookie and the passed in entryId value.
 * @param entryId Id value for the entry to be removed.
 * @throws Signals the process failed
 */
export async function deleteWeightEntry(entryId: number): Promise<void> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Add database method
    // const isEntryDeleted: boolean = await deleteWeightEntry(entryId, userCookie);
    const isEntryDeleted: boolean = true;

    if (isEntryDeleted) {
      return;
    } else {
      throw new Error("Failed to access weight entries", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for accessing the database to create new weight entry
 * @param weightValue Number value for the new weight entry - Must be greater than zero
 * @param weighInDate Date value for the new weight entry
 * @throws Signals the process failed
 */
export async function addWeightEntry(
  weightValue: number,
  weighInDate: Date,
): Promise<void> {
  try {
    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero");
    }

    if (weighInDate === null) {
      throw new Error("Weigh in date cannot be blank");
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Create database method to add weight entries
    // const isEntryAdded = createWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryAdded = true;

    if (isEntryAdded) {
      return;
    } else {
      throw new Error("Failed to add new weight entry", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

/**
 * Middleware for accessing the database to update an existing weight entry
 * @param weightEntryId Id for the associated weight entry to be changed - Must be greater than zero
 * @param weightValue New number value for the weight entry - Must be greater than zero
 * @param weighInDate New date value for the weight entry
 * @throws Signals the process failed
 */
export async function changeWeighEntry(
  weightEntryId: number,
  weightValue: number,
  weighInDate: Date,
): Promise<void> {
  try {
    if (weightEntryId <= 0) {
      throw new Error("Weight entry id is invalid", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (weightValue < 0 || Number.isNaN(weightValue)) {
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    if (weighInDate === null) {
      throw new Error("Weigh in date cannot be blank", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // TODO: Create database method to update weight entry
    // const isEntryUpdated = updateWeightEntry(weightValue, weighInDate, userCookie)
    const isEntryUpdated = true;

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update weight entry", {
        cause: errorCausesObj.processFail,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
