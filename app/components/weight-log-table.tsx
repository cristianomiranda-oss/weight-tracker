import type { WeightEntryType } from "../libs/types";
import WeightEntry from "./weight-entry";

interface WeightLogTableProps {
  weightEntries: WeightEntryType[];
  triggerEntryRemoval: (entryId: number, userId: number) => Promise<void>;
  triggerEntryUpdate: (entryId: number) => void;
}

/**
 * Displays the weight log table and the various weight entries within it
 */
export default function WeightLogTable({
  weightEntries,
  triggerEntryRemoval,
  triggerEntryUpdate,
}: WeightLogTableProps) {
  return (
    <div className="w-full h-full min-h-46 flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
      <div className="w-full h-12 min-h-12 md:h-16 md:min-h-16 sticky top-0 flex justify-center items-center border-b-2 text-3xl md:text-4xl bg-dusty-taupe-700">
        <h2 className="w-6/12 text-center">Date</h2>
        <h2 className="w-5/12 text-center">Weight</h2>
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
