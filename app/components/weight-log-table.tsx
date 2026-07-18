import type { WeightEntryType } from "../libs/types";
import WeightEntry from "./weight-entry";

interface WeightLogTableProps {
  weightEntries: WeightEntryType[];
  triggerEntryRemoval: (entryId: number, userId: number) => Promise<void>;
  triggerEntryUpdate: (entryId: number) => Promise<void>;
}

/**
 *
 *
 * @typedef {object} WeightLogTableProps
 * @property {}
 *
 * @returns {JSX.Element}
 */
export default function WeightLogTable({
  weightEntries,
  triggerEntryRemoval,
  triggerEntryUpdate,
}: WeightLogTableProps) {
  return (
    <div className="w-full h-full flex flex-col bg-dusty-taupe-500 overflow-y-scroll scrollbar-track-dusty-taupe-700 scrollbar-thumb-turf-green-600">
      <div className="w-full h-10 md:h-12 sticky top-0 flex justify-center items-center border-b-2 text-3xl md:text-4xl bg-dusty-taupe-700">
        <h2 className="w-5/12 text-center">Date</h2>
        <h2 className="w-5/12 text-center">Weight</h2>
        <h2 className="w-2/12 text-center">X</h2>
      </div>

      {weightEntries.map((entry) => (
        <WeightEntry
          key={entry.WeightEntryId}
          weightEntryObj={entry}
          removeEntry={() =>
            triggerEntryRemoval(entry.WeightEntryId, entry.userId)
          }
          changeEntry={() => triggerEntryUpdate(entry.WeightEntryId)}
        />
      ))}
    </div>
  );
}
