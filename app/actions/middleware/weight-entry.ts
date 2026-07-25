"use client";

import { getUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/libs/errors";
import { IndexedDB } from "@/app/libs/indexedDB";
import type { WeightEntryType } from "@/app/libs/types";
import { verifyAccountPayload } from "./payload-generation";

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
      throw new Error("Weight value cannot be less than zero", {
        cause: errorCausesObj.invalidParameterValue,
      });
    }

    // Checks if the passed in date defaults to "Invalid Date"
    if (weighInDate.toString() === "Invalid Date") {
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

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    const newEntryId = await IndexedDB.createWeightEntry(
      weightValue,
      weighInDate,
      payloadData.userId,
    );

    if (newEntryId) {
      return;
    } else {
      throw new Error("Failed to add new weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
    }
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}

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

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    const userWeightEntries = await IndexedDB.readWeightEntries(
      payloadData.userId,
    );

    if (userWeightEntries === null) {
      throw new Error("Failed to access weight entry", {
        cause: errorCausesObj.databaseCrudError,
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
 * Middleware for accessing a weight entry associated with a user cookie.
 * The currently stored user account cookie is used for identifying what entry is associated with the user.
 * @throws Signals the process failed
 */
export async function getWeightEntry(
  weightEntryId: number,
): Promise<WeightEntryType> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    const userWeightEntries = await IndexedDB.readWeightEntry(
      weightEntryId,
      payloadData.userId,
    );

    if (userWeightEntries === null) {
      throw new Error("Failed to access weight entry", {
        cause: errorCausesObj.databaseCrudError,
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

    // Checks if the passed in date defaults to "Invalid Date"
    if (weighInDate.toString() === "Invalid Date") {
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

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    const isEntryUpdated = await IndexedDB.updateWeightEntry(
      weightEntryId,
      weightValue,
      weighInDate,
      payloadData.userId,
    );

    if (isEntryUpdated) {
      return;
    } else {
      throw new Error("Failed to update weight entry", {
        cause: errorCausesObj.databaseCrudError,
      });
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
export async function removeWeightEntry(weightEntryId: number): Promise<void> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Gathers the entry data
    const entryData = await getWeightEntry(weightEntryId);

    // Confirms if the entry's user id matches the user's cookie value
    if (entryData.userId !== payloadData.userId) {
      throw new Error("Unauthorized access to entry", {
        cause: errorCausesObj.accessDenied,
      });
    }

    const isEntryDeleted: boolean =
      await IndexedDB.deleteWeightEntry(weightEntryId);

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
