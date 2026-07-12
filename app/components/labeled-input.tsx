// Credit: neldeles for the recommendation of using the HTMLInputTypeAttribute import to define all possible input types for the html input element 
// https://stackoverflow.com/questions/59504750/input-types-in-typescript-interface
import { HTMLInputTypeAttribute } from "react";

interface LabeledInputProps {
    id: string;
    label: string;
    inputType: HTMLInputTypeAttribute;
}

export default function LabeledInput({id, label, inputType}: LabeledInputProps) {
  return (
    <div className="w-full flex flex-col">
      <label className="text-4xl" htmlFor={id}>{label}</label>
      <input className="bg-graphite-800 text-3xl" type={inputType} id={id} />
    </div>
  );
}
