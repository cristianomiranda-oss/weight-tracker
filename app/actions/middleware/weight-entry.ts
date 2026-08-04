"use server";

import { getUserCookie } from "@/app/libs/cookies";
import { errorCausesObj, handleMiddleWareErrors } from "@/app/utils/errors";
import { IndexedDB } from "@/app/libs/indexedDB";
import type { WeightEntryType } from "@/app/libs/types";
import { verifyAccountPayload } from "../../libs/payload-generation";
import {
  addWeightEntryService,
  changeWeighEntryService,
  getWeightEntriesService,
  getWeightEntryService,
  removeWeightEntryService,
} from "@/app/services/weight-entry";

/**
 * Middleware for accessing the database to create new weight entry
 * @param weightValue Number value for the new weight entry - Must be greater than zero
 * @param weighInDate Date value for the new weight entry
 * @throws Signals the process failed
 */
export async function addWeightEntry(
  weightValue: number,
  weighInDate: string,
): Promise<void> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Calls service to add new weight entry
    await addWeightEntryService(weightValue, weighInDate, payloadData);
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

    // Calls the service to retrieve the user's weight entries
    const userWeightEntries = await getWeightEntriesService(payloadData);

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
  weightEntryId: string,
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

    // Calls the service to retrieve the weight entry
    const userWeightEntries = await getWeightEntryService(
      weightEntryId,
      payloadData,
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
  weightEntryId: string,
  weightValue: number,
  weighInDate: string,
): Promise<void> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Calls the service to update the weight entry
    await changeWeighEntryService(
      weightEntryId,
      weightValue,
      weighInDate,
      payloadData,
    );
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
export async function removeWeightEntry(weightEntryId: string): Promise<void> {
  try {
    const userCookie = await getUserCookie();

    if (userCookie === null) {
      throw new Error("Invalid user account", {
        cause: errorCausesObj.invalidUserCookie,
      });
    }

    // Calls the method to read and verify the payload string
    const payloadData = await verifyAccountPayload(userCookie.value);

    // Gathers the entry data using the service method
    const entryData = await getWeightEntryService(weightEntryId, payloadData);

    // Confirms if the entry's user id matches the user's cookie value
    if (entryData.userId !== payloadData.userId) {
      throw new Error("Unauthorized access to entry", {
        cause: errorCausesObj.accessDenied,
      });
    }

    // Calls the service to remove the weight entry service
    await removeWeightEntryService(weightEntryId, payloadData);
  } catch (error) {
    // Calls the method to handle errors in middleware functions
    const errorToThrow = handleMiddleWareErrors(error);
    throw errorToThrow;
  }
}
