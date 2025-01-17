import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CommentInputProps {
  onSubmit: (comment: string) => void;
  className?: string;
}

export const CommentInput = ({ onSubmit, className }: CommentInputProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    onSubmit(comment.trim());
    setComment("");
    toast.success("Comment added for analysis");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Paste a social media comment here..."
          className="min-h-[100px]"
        />
        <Button type="submit" className="w-full">
          Analyze Comment
        </Button>
      </div>
    </form>
  );
};