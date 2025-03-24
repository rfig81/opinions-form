import { useContext } from "react";
import { OpinionsContext } from "./OpinionsContext";

const useOpinions = () => {
  const context = useContext(OpinionsContext);
  if (!context) {
    throw new Error(
      "useOpinions must be used within a OpinionsContextProvider"
    );
  }
  return context;
};

export default useOpinions;
