import { createContext, useEffect, useState } from "react";
import { Opinion } from "../../types";

type OpinionsContextType = {
  opinions: Opinion[];
  addOpinion: (opinion: Opinion) => void;
  upvoteOpinion: (id: string) => void;
  downvoteOpinion: (id: string) => void;
};

export const OpinionsContext = createContext<OpinionsContextType | null>(null);

export function OpinionsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opinions, setOpinions] = useState<Opinion[]>([]);

  useEffect(() => {
    async function loadOpinions() {
      const response = await fetch("http://localhost:3000/opinions");
      const opinions = await response.json();
      setOpinions(opinions);
    }

    loadOpinions();
  }, []);

  async function addOpinion(enteredOpinionData: Opinion) {
    const response = await fetch("http://localhost:3000/opinions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredOpinionData),
    });

    if (!response.ok) {
      return;
    }

    const savedOpinion: Opinion = await response.json();
    setOpinions((prevOpinions) => [savedOpinion, ...prevOpinions]);
  }

  function upvoteOpinion(id: string) {
    setOpinions((prevOpinions) => {
      return prevOpinions.map((opinion) => {
        if (opinion.id === id) {
          return { ...opinion, votes: opinion.votes + 1 };
        }
        return opinion;
      });
    });
  }

  function downvoteOpinion(id: string) {
    setOpinions((prevOpinions) => {
      return prevOpinions.map((opinion) => {
        if (opinion.id === id) {
          return { ...opinion, votes: opinion.votes - 1 };
        }
        return opinion;
      });
    });
  }

  const ctxValue = {
    opinions: opinions,
    addOpinion,
    upvoteOpinion,
    downvoteOpinion,
  } as OpinionsContextType;

  return (
    <OpinionsContext.Provider value={ctxValue}>
      {children}
    </OpinionsContext.Provider>
  );
}
