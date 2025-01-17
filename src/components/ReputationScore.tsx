import { cn } from "@/lib/utils";

interface ReputationScoreProps {
  score: number;
  className?: string;
}

export const ReputationScore = ({ score, className }: ReputationScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-success text-success-foreground";
    if (score >= 50) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excelente";
    if (score >= 50) return "Moderada";
    return "Precisa Melhorar";
  };

  return (
    <div className={cn("text-center p-6", className)}>
      <div className="mb-4 text-sm font-medium text-gray-600">Score de Reputação</div>
      <div className="relative">
        <div className={cn(
          "mx-auto flex items-center justify-center w-32 h-32 rounded-full transition-all duration-500 animate-score-pulse",
          getScoreColor(score)
        )}>
          <span className="text-4xl font-bold">{score}</span>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-sm">
          <span className="text-sm font-medium">{getScoreLabel(score)}</span>
        </div>
      </div>
    </div>
  );
};