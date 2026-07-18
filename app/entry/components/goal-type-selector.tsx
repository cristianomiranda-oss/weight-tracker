import { Ref, useCallback, useReducer } from "react";

interface GoalTypeSelectorProps {
  id: string;
  label: string;
  ref?: Ref<HTMLSelectElement>;
}

export default function GoalTypeSelector({ id, label, ref }: GoalTypeSelectorProps) {
  const goalTypes = ["Loss", "Gain", "Maintenance"];

  const GoalOptions = goalTypes.map((type) => (
    <option className="bg-graphite-800" key={type} value={type}>
      {type}
    </option>
  ));

  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-4xl md:text-5xl" htmlFor={id}>{label}</label>
      <select className="w-full text-4xl md:text-5xl bg-graphite-800" name="goalType" id={id} ref={ref}>
        <option className="bg-graphite-800" value={undefined}>Select</option>
        {GoalOptions}
      </select>
    </div>
  );
}
