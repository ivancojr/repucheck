import { useState } from "react";
import { ReputationScore } from "@/components/ReputationScore";
import { CommentsList } from "@/components/CommentsList";
import { CommentInput } from "@/components/CommentInput";

// Simple sentiment analysis function (in a real app, you'd use a proper NLP service)
const analyzeSentiment = (text: string): number => {
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'best'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0.5; // neutral starting point
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.1;
    if (negativeWords.includes(word)) score -= 0.1;
  });
  
  return Math.max(0, Math.min(1, score));
};

const Index = () => {
  const [comments, setComments] = useState<Array<{ id: string; text: string; sentiment: number }>>([]);

  const calculateOverallScore = () => {
    if (comments.length === 0) return 50;
    const average = comments.reduce((acc, comment) => acc + comment.sentiment, 0) / comments.length;
    return Math.round(average * 100);
  };

  const handleNewComment = (text: string) => {
    const sentiment = analyzeSentiment(text);
    setComments(prev => [
      { id: Date.now().toString(), text, sentiment },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <h1 className="text-3xl font-bold">Online Reputation Analyzer</h1>
          <p className="mt-2 text-primary-foreground/80">
            Monitor and analyze your social media reputation
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <ReputationScore score={calculateOverallScore()} />
            </div>
            <CommentInput onSubmit={handleNewComment} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <CommentsList comments={comments} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;