import { PropsWithChildren, createContext, useMemo } from "react";
import { RootStore } from "../store/store";

export const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({
  store,
  children,
}: PropsWithChildren<{ store: RootStore }>) => {
  const value = useMemo(() => store, [store]);
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
