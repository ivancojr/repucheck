import { useState } from "react";
import { ReputationScore } from "@/components/ReputationScore";
import { CommentsList } from "@/components/CommentsList";
import { CommentInput } from "@/components/CommentInput";
import { SocialMediaIntegration } from "@/components/SocialMediaIntegration";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

// Palavras-chave para análise de sentimento
const POSITIVE_WORDS = [
  "ótimo", "bom", "excelente", "útil", "ajuda", "genial",
  "incrível", "maravilhoso", "sensacional", "adorei", "parabéns"
];

const NEGATIVE_WORDS = [
  "ruim", "péssimo", "horrível", "nojento", "idiota", "balela",
  "troll", "lixo", "terrível", "odiei", "detestei"
];

interface Comment {
  id: string;
  text: string;
  sentiment: number;
}

const Index = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const analyzeSentiment = (text: string): number => {
    const words = text.toLowerCase().split(/\s+/);
    let score = 0.5; // ponto neutro

    words.forEach(word => {
      if (POSITIVE_WORDS.some(pw => word.includes(pw))) score += 0.1;
      if (NEGATIVE_WORDS.some(nw => word.includes(nw))) score -= 0.1;
    });

    return Math.max(0, Math.min(1, score));
  };

  const calculateOverallScore = () => {
    if (comments.length === 0) return 50;
    const average = comments.reduce((acc, comment) => acc + comment.sentiment, 0) / comments.length;
    return Math.round(average * 100);
  };

  const getRecommendation = (score: number) => {
    if (score >= 75) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        title: "Excelente Reputação!",
        description: "Sua reputação online é muito boa. Continue interagindo positivamente!",
        variant: "success" as const
      };
    } else if (score >= 50) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-warning" />,
        title: "Reputação Moderada",
        description: "Sua reputação está ok, mas pode melhorar. Tente ser mais construtivo em suas interações.",
        variant: "warning" as const
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
        title: "Reputação Precisa de Atenção",
        description: "Sua reputação online precisa melhorar. Evite comentários negativos e mantenha um tom mais positivo.",
        variant: "destructive" as const
      };
    }
  };

  const handleNewComment = (text: string) => {
    const sentiment = analyzeSentiment(text);
    setComments(prev => [
      { id: Date.now().toString(), text, sentiment },
      ...prev
    ]);
  };

  const handleSocialComments = (newComments: Array<{ text: string; sentiment: number }>) => {
    const commentsWithIds = newComments.map(comment => ({
      ...comment,
      id: Date.now().toString() + Math.random()
    }));
    setComments(prev => [...commentsWithIds, ...prev]);
  };

  const score = calculateOverallScore();
  const recommendation = getRecommendation(score);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <h1 className="text-3xl font-bold">Analisador de Reputação Online</h1>
          <p className="mt-2 text-primary-foreground/80">
            Monitore e analise sua reputação nas redes sociais
          </p>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <SocialMediaIntegration onCommentsReceived={handleSocialComments} />
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <Card className="p-6">
              <ReputationScore score={score} />
              <Separator className="my-6" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{comments.length}</div>
                  <div className="text-sm text-gray-600">Comentários Analisados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {comments.filter(c => c.sentiment > 0.6).length}
                  </div>
                  <div className="text-sm text-gray-600">Comentários Positivos</div>
                </div>
              </div>
            </Card>

            <Alert variant={recommendation.variant}>
              {recommendation.icon}
              <AlertTitle>{recommendation.title}</AlertTitle>
              <AlertDescription>{recommendation.description}</AlertDescription>
            </Alert>

            <CommentInput onSubmit={handleNewComment} />
          </div>
          
          <Card className="p-6">
            <CommentsList comments={comments} />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;