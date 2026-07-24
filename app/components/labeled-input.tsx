// Credit: neldeles for the recommendation of using the HTMLInputTypeAttribute import to define all possible input types for the html input element
// https://stackoverflow.com/questions/59504750/input-types-in-typescript-interface
import type { HTMLInputTypeAttribute, Ref } from "react";

interface LabeledInputProps {
  id: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  disabled: boolean;
  ref?: Ref<HTMLInputElement>;
  placeHolder?: string;
}

/**
 * Component for displaying an input and a label
 */
export default function LabeledInput({
  id,
  label,
  inputType,
  disabled,
  ref,
  placeHolder,
}: LabeledInputProps) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-4xl md:text-5xl" htmlFor={id}>
        {label}
      </label>
      <input
        className="bg-graphite-800 text-3xl md:text-4xl p-2"
        type={inputType}
        id={id}
        disabled={disabled}
        ref={ref}
        placeholder={placeHolder}
      />
    </div>
  );
}
