import {
  faAnglesDown,
  faAnglesUp,
  faGripLines,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { sortingKey, sortOptions } from "../libs/types";

interface SortingButtonProps {
  currentSortingOption: sortOptions;
  sortingKey: sortingKey;
  updateSortingOption: (sortingKey: sortingKey) => void;
}

/**
 * Displays stacked buttons that denote sorting order
 */
export default function SortingButton({
  currentSortingOption,
  sortingKey,
  updateSortingOption,
}: SortingButtonProps) {
  let displayIcon = <FontAwesomeIcon icon={faGripLines} />; // Defaults to the lines to indicate the sorting option is not chosen

  if (currentSortingOption.sortingKey === sortingKey) {
    displayIcon =
      currentSortingOption.sortOrder === "ASC" ? (
        <FontAwesomeIcon icon={faAnglesUp} />
      ) : (
        <FontAwesomeIcon icon={faAnglesDown} />
      );
  }

  return (
    <Button
      className="h-fit rounded-none hover:bg-text-input/80"
      onClick={() => updateSortingOption(sortingKey)}
    >
      {displayIcon}
    </Button>
  );
}
