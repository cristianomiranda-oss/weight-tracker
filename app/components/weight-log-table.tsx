import { useState } from "react";
import type { sortingKey, sortOptions, sortOrder, WeightEntryType } from "../libs/types";
import Button from "./button";
import SortingButton from "./sorting-button";
import WeightEntry from "./weight-entry";

interface WeightLogTableProps {
  weightEntries: WeightEntryType[];
  triggerEntryRemoval: (entryId: number, userId: number) => Promise<void>;
  triggerEntryUpdate: (entryId: number) => void;
  sortWeightEntries: (
    sortOrder: sortOrder,
    objKey: "weightValue" | "weighInDate",
  ) => void;
}

/**
 * Displays the weight log table and the various weight entries within it
 */
export default function WeightLogTable({
  weightEntries,
  triggerEntryRemoval,
  triggerEntryUpdate,
  sortWeightEntries,
}: WeightLogTableProps) {
  // Initializes the sorting filter state with the default sorting order
  const [currentSortingOption, setCurrentSortingOption] = useState<sortOptions>({
    sortingKey: "weighInDate",
    sortOrder: "DESC",
  });

  function updateSortingOption(sortingKey: sortingKey) {
    // Copies the current sorting options
    let newSortingOptions = {...currentSortingOption};

    // Checks if the currently active sort button is clicked
    if (currentSortingOption.sortingKey === sortingKey) {
      // Checks the current sort order and switches to the opposing one
      newSortingOptions.sortOrder = currentSortingOption.sortOrder === "ASC" ? "DESC" : "ASC"
    } else {
      // If the opposing sort button is clicked it is activated
      newSortingOptions.sortingKey = sortingKey;
      newSortingOptions.sortOrder = "DESC";
    }
    
    sortWeightEntries(newSortingOptions.sortOrder, newSortingOptions.sortingKey);
    setCurrentSortingOption(newSortingOptions);
  }

  return (
    <div className="w-full h-full min-h-46 flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
      <div className="w-full h-12 min-h-12 md:h-16 md:min-h-16 sticky top-0 flex justify-center items-center border-b-2 text-3xl md:text-4xl bg-dusty-taupe-700">
        <div className="w-6/12 h-full flex justify-center items-center gap-6">
          <h2 className="text-center">Date</h2>
          <SortingButton sortingKey="weighInDate" currentSortingOption={currentSortingOption} updateSortingOption={updateSortingOption} />
        </div>
        <div className="w-5/12 h-full flex justify-center items-center gap-6">
          <h2>Weight</h2>
          <SortingButton sortingKey="weightValue" currentSortingOption={currentSortingOption} updateSortingOption={updateSortingOption} />
        </div>
        <h2 className="w-1/12 text-center">X</h2>
      </div>

      {weightEntries.map((entry) => (
        <WeightEntry
          key={entry.weightEntryId}
          weightEntryObj={entry}
          removeEntry={() =>
            triggerEntryRemoval(entry.weightEntryId, entry.userId)
          }
          changeEntry={() => triggerEntryUpdate(entry.weightEntryId)}
        />
      ))}
    </div>
  );
}
