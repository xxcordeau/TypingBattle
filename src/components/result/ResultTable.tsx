import type { GameResult } from "@/types";
import { RankCard } from "./RankCard";

interface Props {
  results: GameResult[];
}

export function ResultTable({ results }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
      {results.map((r, i) => (
        <RankCard
          key={`${r.playerId}-${r.rank}`}
          rank={r.rank}
          name={r.playerName}
          wpm={r.wpm}
          accuracy={r.accuracy}
          animationDelay={i * 0.1}
        />
      ))}
    </div>
  );
}
