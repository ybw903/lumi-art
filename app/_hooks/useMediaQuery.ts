import { useSyncExternalStore } from "react";

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function subscribe(query: string, callback: () => void) {
  // [TODO] Polyfill
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

// [TODO] use user-agent
function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string) {
  const matches = useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getSnapshot(query),
    getServerSnapshot
  );

  return matches;
}
