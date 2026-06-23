import { useEffect, useState } from "react";
import { lsGet, lsSet } from "../utils/helpers.js";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => lsGet(key, initialValue));
  useEffect(() => {
    lsSet(key, value);
  }, [key, value]);
  return [value, setValue];
}
