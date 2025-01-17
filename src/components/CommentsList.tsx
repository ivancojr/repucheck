import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp, Minus } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  sentiment: number;
}

interface CommentsListProps {
  comments: Comment[];
  className?: string;
}

export const CommentsList = ({ comments, className }: CommentsListProps) => {
  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.5) return <ThumbsUp className="w-5 h-5 text-success" />;
    if (sentiment < 0.5) return <ThumbsDown className="w-5 h-5 text-destructive" />;
    return <Minus className="w-5 h-5 text-warning" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Analyzed Comments</h3>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-3 p-4 bg-white rounded-lg shadow"
          >
            {getSentimentIcon(comment.sentiment)}
            <p className="flex-1 text-sm text-gray-600">{comment.text}</p>
            <span className="text-sm font-medium">
              {Math.round(comment.sentiment * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};