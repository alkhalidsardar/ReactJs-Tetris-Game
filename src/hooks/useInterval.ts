import { useRef, useEffect } from "react";

// Custom hook for setting up an interval using React hooks
export function useInterval(callback: () => void, delay: number | null): void {
  // useRef to persist the latest callback without re-creating the interval on every render
  const callbackRef = useRef(callback);

  // useEffect to update the callbackRef.current with the latest callback
  // This effect runs every time the callback function changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // useEffect to set up the interval
  // This effect runs every time the delay changes
  useEffect(() => {
    // If delay is null, do not set up the interval
    if (delay == null) return;

    // Setting up the interval with the current callback and delay
    const intervalID = setInterval(() => callbackRef.current(), delay);

    // Cleanup function to clear the interval when the component unmounts or delay changes
    return () => clearInterval(intervalID);
  }, [delay]);
}