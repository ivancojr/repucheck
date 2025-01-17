import { cn } from "@/lib/utils";

interface ReputationScoreProps {
  score: number;
  className?: string;
}

export const ReputationScore = ({ score, className }: ReputationScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className={cn("text-center p-6", className)}>
      <div className="mb-2 text-sm font-medium text-gray-600">Reputation Score</div>
      <div className={cn(
        "inline-flex items-center justify-center w-32 h-32 rounded-full animate-score-pulse",
        getScoreColor(score)
      )}>
        <span className="text-4xl font-bold text-white">{score}</span>
      </div>
      <div className="mt-2 text-lg font-semibold">{getScoreLabel(score)}</div>
    </div>
  );
};