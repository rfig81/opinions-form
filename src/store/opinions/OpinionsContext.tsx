import { createContext, useEffect, useState } from "react";
import { Opinion } from "../../types";

type NewOpinion = Omit<Opinion, "id" | "votes">;

type OpinionsContextType = {
  opinions: Opinion[];
  addOpinion: (opinion: NewOpinion) => void;
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

  async function addOpinion(enteredOpinionData: NewOpinion) {
    const response = await fetch("http://localhost:3000/opinions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredOpinionData),
    });

    if (!response.ok) return;

    const savedOpinion: Opinion = await response.json();
    setOpinions((prevOpinions) => [savedOpinion, ...prevOpinions]);
  }

  async function upvoteOpinion(id: string) {
    const response = await fetch(
      `http://localhost:3000/opinions/${id}/upvote`,
      { method: "POST" }
    );

    if (!response.ok) return;

    setOpinions((prevOpinions) => {
      return prevOpinions.map((opinion) => {
        if (opinion.id === id) {
          return { ...opinion, votes: opinion.votes + 1 };
        }
        return opinion;
      });
    });
  }

  async function downvoteOpinion(id: string) {
    const response = await fetch(
      `http://localhost:3000/opinions/${id}/downvote`,
      { method: "POST" }
    );

    if (!response.ok) return;

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
