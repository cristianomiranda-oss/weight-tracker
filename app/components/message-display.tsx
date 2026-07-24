interface MessageDisplayProps {
  errorMessage: string;
  infoMessage: string;
}

/**
 * Displays a fixed message at the bottom of its parent's container
 */
export default function MessageDisplay({
  errorMessage,
  infoMessage,
}: MessageDisplayProps) {
  // Checks if any error message is present
  if (errorMessage !== "" || infoMessage !== "") {
    // Credit "A Haworth" for explaining why this fixed div would not stay fixed relative to the parent unless the parent had a transformation applied to it
    // https://stackoverflow.com/questions/71722886/element-with-position-fixed-is-not-sticking-to-parent-element-that-has-its-posit
    return (
      <div className="w-full h-12 p-1 text-2xl fixed bottom-0 right-0 bg-dusty-taupe-900/50">
        {/* Prioritizes error messages over info messages */}
        {errorMessage !== "" ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : (
          <p className="text-yellow-600">{infoMessage}</p>
        )}
      </div>
    );
  } else {
    // Returns no element
    return <></>;
  }
}
