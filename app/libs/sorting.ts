import { sortOrder, WeightEntryType } from "./types";

// Credit: GeeksforGeeks https://www.geeksforgeeks.org/dsa/merge-sort/
// Based merge sort functions are based on their initial code but have been adapted to work with different object types

/**
 * Sorts the whole array based on value associated with the passed in key and in the order based on the passed in parameter
 *
 * @param entriesArray - Array of entries to be sorted in place
 * @param comparisonKey Key value used to determine how elements are being sorted
 * @param sortOrder Determines the order for sorting
 */
export function sortEntriesArray(
  entriesArray: WeightEntryType[],
  comparisonKey: keyof WeightEntryType,
  sortOrder: sortOrder,
) {
  /**
   * Sorts the entries within the given range in place in the passed in array based on value associated with the passed in key
   *
   * @param entriesArray - Array of entries to be sorted in place
   * @param left Starting position of the elements to be sorted
   * @param mid Middle position of the elements to be sorted
   * @param right End position of the elements to be sorted
   */
  function mergeEntries(
    entriesArray: WeightEntryType[],
    left: number,
    mid: number,
    right: number,
  ) {
    const index1 = mid - left + 1; // Last index of the left half of the array
    const index2 = right - mid; // Last index of the right half of the array

    const tempLeftArray: WeightEntryType[] = [];
    const tempRightArray: WeightEntryType[] = [];

    // Populates the left array
    for (let i = 0; i < index1; i++) {
      tempLeftArray[i] = entriesArray[left + i];
    }

    // Populates the right array
    for (let i = 0; i < index2; i++) {
      tempRightArray[i] = entriesArray[mid + 1 + i];
    }

    let leftIndex = 0;
    let rightIndex = 0;
    // Starts at the left bounds of the current array
    let startingIndex: number = left;

    while (leftIndex < index1 && rightIndex < index2) {
      if (sortOrder === "ASC") {
        // Checks if left array has a lower or equal value to the right array
        if (
          tempLeftArray[leftIndex][comparisonKey] <=
          tempRightArray[rightIndex][comparisonKey]
        ) {
          // Inserts element from the left array
          entriesArray[startingIndex] = tempLeftArray[leftIndex];
          leftIndex++;
        } else {
          // Inserts element from the right array
          entriesArray[startingIndex] = tempRightArray[rightIndex];
          rightIndex++;
        }
      } else {
        // Checks if left array has a lower or equal value to the right array
        if (
          tempLeftArray[leftIndex][comparisonKey] >
          tempRightArray[rightIndex][comparisonKey]
        ) {
          // Inserts element from the left array
          entriesArray[startingIndex] = tempLeftArray[leftIndex];
          leftIndex++;
        } else {
          // Inserts element from the right array
          entriesArray[startingIndex] = tempRightArray[rightIndex];
          rightIndex++;
        }
      }

      startingIndex++;
    }

    // Inserts remaining elements from the left array
    while (leftIndex < index1) {
      entriesArray[startingIndex] = tempLeftArray[leftIndex];
      leftIndex++;
      startingIndex++;
    }

    // Inserts remaining elements from the right array
    while (rightIndex < index2) {
      entriesArray[startingIndex] = tempRightArray[rightIndex];
      rightIndex++;
      startingIndex++;
    }
  }

  /**
   * Recursive function for performing merge sort, the initial array is passed in and the bounds of the array are set to the left and right parameters
   * and the passed in key is used to determine the value used for determining the sorting order
   *
   * @param entriesArray - Array of entries to be sorted in place
   * @param left Starting position of the elements to be sorted
   * @param right End position of the elements to be sorted
   */
  function mergeSortEntries(
    entriesArray: WeightEntryType[],
    left: number,
    right: number,
  ) {
    if (left >= right) {
      // Array segment is sorted and the function can be exited
      return;
    }

    // Calcs the middle value for the array
    const mid = Math.floor(left + (right - left) / 2);

    // Recursively calls the function to sort the left side and right side of the array
    mergeSortEntries(entriesArray, left, mid);
    mergeSortEntries(entriesArray, mid + 1, right);

    // Calls the method to sort the entries in the current array
    mergeEntries(entriesArray, left, mid, right);
  }

  // Starts the recursive call to sort the entire array in place
  mergeSortEntries(entriesArray, 0, entriesArray.length - 1);
}
