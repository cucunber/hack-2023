import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import { useNavigate } from "react-router";

export const useInitialAuth = () => {
  const navigator = useNavigate();
};
