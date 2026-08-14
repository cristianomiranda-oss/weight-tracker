import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LoadingIndicatorProps {}

/**
 * Loading indicator that positions itself in the middle of the parent container and showing a continuous loading icon
 */
export default function LoadingIndicator({}: LoadingIndicatorProps) {
  return (
    <div className="w-full h-full fixed top-0 right-0 z-1 flex justify-center items-center bg-black/80">
      <FontAwesomeIcon
        className="w-fit h-fit fixed text-center text-9xl animate-spin"
        icon={faSpinner}
      />
      <p className="w-fit h-fit animate-pulse text-7xl -translate-y-4 select-none">
        ...
      </p>
    </div>
  );
}
