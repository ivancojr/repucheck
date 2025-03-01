import { useState } from "react";
import { ReputationScore } from "@/components/ReputationScore";
import { CommentsList } from "@/components/CommentsList";
import { CommentInput } from "@/components/CommentInput";
import { SocialMediaIntegration } from "@/components/SocialMediaIntegration";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

// Palavras-chave individuais para análise de sentimento
const POSITIVE_WORDS = [
  "ótimo", "bom", "excelente", "útil", "ajuda", "genial", "incrível", 
  "maravilhoso", "sensacional", "adorei", "parabéns", "fantástico", 
  "amável", "simpático", "inspirador", "top", "perfeito", "show", 
  "super", "legal", "feliz", "alegria", "satisfatório", "positivamente", 
  "recomendo", "brilhante", "grato", "surpreendente", "inovador", 
  "eficiente", "confiável", "apreciado", "espetacular", "único", 
  "inestimável", "carinhoso", "excelência", "admirável", "respeitado", 
  "honesto", "impactante", "aplauso", "fabuloso", "positivo", "querido", 
  "valioso", "divertido", "gentil", "merecedor", "admirado", "grandioso", 
  "louvável", "fenomenal", "prazeroso", "top-notch", "5 estrelas", 
  "memorável", "refrescante", "encantador", "agradável", "delicioso", 
  "impressionante", "seguro", "extraordinário", "tranquilo", "incomparável", 
  "sustentável", "emocionante", "brilhantismo", "crédito", "revolucionário", "sensíveis"
];

const NEGATIVE_WORDS = [
   "ruim", "péssimo", "horrível", "nojento", "idiota", "balela", "troll", 
  "lixo", "terrível", "odiei", "detestei", "chato", "fraco", "irritante", 
  "pífio", "medíocre", "insuportável", "problemático", "desapontado", 
  "mentira", "enganoso", "ridículo", "absurdo", "malfeito", "frustrante", 
  "inaceitável", "ineficiente", "decepcionante", "enganador", "patético", 
  "escroto", "antipático", "inútil", "triste", "horrendo", "indigno", 
  "atroz", "desastroso", "inferior", "falso", "lamentável", "prejudicial", 
  "abusivo", "vulgar", "negligente", "miserável", "horripilante", "burro", 
  "ofensivo", "infeliz", "sarcástico", "irresponsável", "arrogante", 
  "desagradável", "intolerável", "engodo", "enganoso", "falho", "frustração", 
  "desrespeitoso", "desprezível", "deprê", "vergonhoso", "desonesto", 
  "constrangedor", "amador", "problemático", "ilegal", "maldoso", 
  "prepotente", "vil", "desleixado", "desproporcional", "desnecessário", 
  "ineficaz", "fraude", "debochado", "excludente"
];

// N-grams positivos e negativos
const POSITIVE_NGRAMS = [
  "muito bom", "ótimo trabalho", "super recomendo", "bem feito", 
  "bem organizado", "tudo certo", "ajuda excelente", "parabéns mesmo", 
  "top demais", "produto perfeito", "funcionou bem", "melhor escolha", 
  "ótima solução", "serviço excelente", "tempo rápido", "entrega rápida", 
  "muito eficiente", "bem interessante", "resposta clara", "grande apoio", 
  "muito satisfeito", "bastante útil", "excelente atendimento", "boa ideia", 
  "super útil", "bem executado", "ótima experiência", "bem bacana", 
  "super seguro", "funciona perfeito", "bem prático", "qualidade incrível", "adorei o produto", "muito bem feito", "ótimo em tudo", 
  "funciona muito bem", "entrega foi rápida", "excelente em qualidade", 
  "foi incrível mesmo", "parabéns pelo trabalho", "tudo muito bom", 
  "superou minhas expectativas", "tempo de resposta rápido", 
  "muito feliz mesmo", "tudo perfeito sempre", "ótima escolha mesmo", 
  "recomendo sem dúvidas", "excelente suporte técnico", 
  "fiquei muito satisfeito", "muito grato mesmo", "ótima opção sempre", 
  "valeu muito a pena", "funciona como esperado", "recomendo de coração", 
  "muito útil mesmo", "bem prático sempre", "super seguro mesmo", 
  "tudo impecável mesmo", "são inteligentes"
];

const NEGATIVE_NGRAMS = [
  "muito ruim", "péssimo trabalho", "não gostei", "foi horrível", 
  "horrível mesmo", "bem chato", "serviço ruim", "produto terrível", 
  "tudo errado", "muito demorado", "entrega péssima", "tempo perdido", 
  "falta respeito", "péssima escolha", "bem pior", "não compensa", 
  "pior experiência", "pior serviço", "bem fraco", "totalmente inútil", 
  "foi ridículo", "péssima qualidade", "nada funciona", "bem problemático", 
  "desapontamento total", "nada confiável", "suporte péssimo", 
  "atendimento horrível", "muito decepcionante", "nunca mais", "não funciona direito", "entrega foi péssima", "muito ruim mesmo", 
  "foi uma decepção", "não recomendo nunca", "nunca mais mesmo", 
  "horrível em tudo", "péssima escolha mesmo", "tempo perdido total", 
  "não vale nada", "nada prestou aqui", "pior coisa sempre", 
  "foi bem problemático", "pior suporte possível", "não deu certo", 
  "nada confiável mesmo", "bem decepcionante mesmo", "nunca mais voltarei", 
  "foi tudo ruim", "nada deu certo", "bem demorado mesmo", "bem ruim sempre", 
  "atraso sem fim", "nada prestou mesmo", "foi totalmente inútil", 
  "bem abaixo esperado", "serviço bem ruim", "não são inteligentes"
];

// Função para gerar n-grams
const generateNGrams = (words: string[], n: number): string[] => {
  const ngrams: string[] = [];
  for (let i = 0; i < words.length - n + 1; i++) {
    ngrams.push(words.slice(i, i + n).join(" "));
  }
  return ngrams;
};

interface Comment {
  id: string;
  text: string;
  sentiment: number;
}

const Index = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const analyzeSentiment = (text: string): number => {
    const words = text.toLowerCase().split(/\s+/);
    const bigrams = generateNGrams(words, 2);
    const trigrams = generateNGrams(words, 3);

    let score = 0.5; // ponto neutro
    let totalMatches = 0;

    // Análise de palavras individuais
    words.forEach(word => {
      if (POSITIVE_WORDS.some(pw => word.includes(pw))) {
        score += 0.1;
        totalMatches++;
      }
      if (NEGATIVE_WORDS.some(nw => word.includes(nw))) {
        score -= 0.1;
        totalMatches++;
      }
    });

    // Análise de bigrams
    bigrams.forEach(bigram => {
      if (POSITIVE_NGRAMS.includes(bigram)) {
        score += 0.15;
        totalMatches++;
      }
      if (NEGATIVE_NGRAMS.includes(bigram)) {
        score -= 0.15;
        totalMatches++;
      }
    });

    // Análise de trigrams (peso maior por ser mais específico)
    trigrams.forEach(trigram => {
      if (POSITIVE_NGRAMS.includes(trigram)) {
        score += 0.2;
        totalMatches++;
      }
      if (NEGATIVE_NGRAMS.includes(trigram)) {
        score -= 0.2;
        totalMatches++;
      }
    });

    // Normalização do score
    if (totalMatches > 0) {
      score = Math.max(0, Math.min(1, score));
    }

    return score;
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
