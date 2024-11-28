import { createContext, useContext } from "react";

export const RatioBoxContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  },
);

export function useRatioBox() {
  return useContext(RatioBoxContext);
}
