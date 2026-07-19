import { GoalOption } from "@/app/libs/types";
import { Ref, useCallback, useReducer } from "react";

interface GoalTypeSelectorProps {
  id: string;
  label: string;
  ref?: Ref<HTMLSelectElement>;
}

/**
 * Selector component for the goal weight entry's goal type field
 * Displays the three associated values and a fourth indicator value
 */
export default function GoalTypeSelector({
  id,
  label,
  ref,
}: GoalTypeSelectorProps): React.JSX.Element {
  const goalTypes: GoalOption[] = ["Loss", "Gain", "Maintenance"];

  /**
   * Component array for the three possible goal type options
   */
  const GoalOptions: React.JSX.Element[] = goalTypes.map((type) => (
    <option className="bg-graphite-800" key={type} value={type}>
      {type}
    </option>
  ));

  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-4xl md:text-5xl" htmlFor={id}>
        {label}
      </label>
      <select
        className="w-full text-4xl md:text-5xl bg-graphite-800"
        name="goalType"
        id={id}
        ref={ref}
      >
        <option className="bg-graphite-800" value={undefined}>
          Select
        </option>
        {GoalOptions}
      </select>
    </div>
  );
}
