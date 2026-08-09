import type { sortingKey, sortOptions, WeightEntryType } from "../libs/types";
import SortingButton from "./sorting-button";
import WeightEntry from "./weight-entry";

interface WeightLogTableProps {
  weightEntries: WeightEntryType[];
  triggerEntryRemoval: (entryId: string, userId: string) => Promise<void>;
  triggerEntryUpdate: (entryId: string) => void;
  currentSortingOption: sortOptions;
  updateSortingOption: (sortingKey: sortingKey) => void;
}

/**
 * Displays the weight log table and the various weight entries within it
 */
export default function WeightLogTable({
  weightEntries,
  triggerEntryRemoval,
  triggerEntryUpdate,
  currentSortingOption,
  updateSortingOption,
}: WeightLogTableProps) {
  return (
    <div className="w-full h-full min-h-46 flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
      <div className="w-full h-12 min-h-12 md:h-16 md:min-h-16 sticky top-0 flex justify-center items-center border-b-2 text-3xl md:text-4xl bg-dusty-taupe-700">
        <div className="w-6/12 h-full flex justify-center items-center gap-6">
          <h2 className="text-center">Date</h2>
          <SortingButton
            sortingKey="weighInDate"
            currentSortingOption={currentSortingOption}
            updateSortingOption={updateSortingOption}
          />
        </div>
        <div className="w-5/12 h-full flex justify-center items-center gap-6">
          <h2>Weight</h2>
          <SortingButton
            sortingKey="weightValue"
            currentSortingOption={currentSortingOption}
            updateSortingOption={updateSortingOption}
          />
        </div>
        <h2 className="w-1/12 text-center">X</h2>
      </div>

      {weightEntries.map((entry) => (
        <WeightEntry
          key={entry._id}
          weightEntryObj={entry}
          removeEntry={() => triggerEntryRemoval(entry._id, entry.userId)}
          changeEntry={() => triggerEntryUpdate(entry._id)}
        />
      ))}
    </div>
  );
}
