import { getDisplayDate } from "../utils/date";
import type { WeightEntryType } from "../libs/types";
import Button from "./button";

interface WeightEntryProps {
  weightEntryObj: WeightEntryType;
  removeEntry: () => void;
  changeEntry: () => void;
}

/**
 * Component for displaying a weight entry
 */
export default function WeightEntry({
  weightEntryObj,
  removeEntry,
  changeEntry,
}: WeightEntryProps) {
  return (
    <div className="w-full h-12 min-h-12 md:h-18 md:min-h-18 text-xl md:text-3xl xl:text-4xl flex justify-around items-center bg-container-secondary border-y-2 box-content">
      <p className="w-6/12 text-center" onDoubleClick={changeEntry}>
        {getDisplayDate(weightEntryObj.weighInDate)}
      </p>
      <p className="w-5/12 text-center" onDoubleClick={changeEntry}>
        {weightEntryObj.weightValue}
      </p>
      <Button
        className="w-1/12 h-full rounded-none text-center"
        onClick={removeEntry}
      >
        X
      </Button>
    </div>
  );
}
