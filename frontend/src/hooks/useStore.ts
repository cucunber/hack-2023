import { useContext } from "react";
import { RootStore } from "../store/store";
import { StoreContext } from "../context/store";

export const useStore = <Selected = unknown>(
  selector: (store: RootStore) => Selected
) => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error(
      "Ты дурак использовать хук вне контекста? (это разрабу если что)"
    );
  }
  return selector(context);
};
