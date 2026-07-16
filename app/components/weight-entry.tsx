import type { WeightEntryType } from "../libs/types";

interface WeightEntryProps {
    weightEntryObj: WeightEntryType;
    removeEntry: () => void;
}

export default function WeightEntry({ weightEntryObj, removeEntry }: WeightEntryProps) {
    return (
        <div className="w-full h-8 text-xl flex justify-around items-center bg-dusty-taupe-600">
            <p className="w-1/3 text-center">{weightEntryObj.weightDate.getDate()}</p>
            <p className="w-1/3 text-center">{weightEntryObj.weightValue}</p>
            <p className="w-1/3 text-center" onClick={removeEntry}>X</p>
        </div>
    )
}