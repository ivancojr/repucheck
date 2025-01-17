import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { 
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  TrendingUp
} from "lucide-react";

interface SocialNetwork {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  url?: string;
}

export const SocialMediaIntegration = ({ 
  onCommentsReceived 
}: { 
  onCommentsReceived: (comments: Array<{ text: string; sentiment: number }>) => void 
}) => {
  const [networks, setNetworks] = useState<SocialNetwork[]>([
    { id: "twitter", name: "X (Twitter)", icon: <Twitter className="w-5 h-5" />, connected: false },
    { id: "instagram", name: "Instagram", icon: <Instagram className="w-5 h-5" />, connected: false },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, connected: false },
    { id: "threads", name: "Threads", icon: <MessageCircle className="w-5 h-5" />, connected: false },
    { id: "tiktok", name: "TikTok", icon: <TrendingUp className="w-5 h-5" />, connected: false },
  ]);

  const handleConnect = async (network: SocialNetwork) => {
    const profileUrl = prompt(`Digite a URL do seu perfil ${network.name}:`);
    if (!profileUrl) return;

    toast.info(`Conectando ao ${network.name}...`);

    try {
      const result = await FirecrawlService.crawlWebsite(profileUrl);
      
      if (result.success && result.data) {
        // Atualiza o estado da rede social
        setNetworks(prev => prev.map(n => 
          n.id === network.id ? { ...n, connected: true, url: profileUrl } : n
        ));

        // Extrai os comentários dos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Simula a extração de comentários do resultado do crawl
        // Em um ambiente real, você precisaria processar os dados específicos de cada rede
        const comments = result.data.data
          .filter((item: any) => new Date(item.date) >= thirtyDaysAgo)
          .map((item: any) => ({
            text: item.text || "",
            sentiment: Math.random() // Mantém a lógica de sentimento existente
          }));

        onCommentsReceived(comments);
        
        toast.success(`${network.name} conectado com sucesso!`);
      } else {
        throw new Error("Falha ao obter dados");
      }
    } catch (error) {
      toast.error(`Erro ao conectar com ${network.name}`);
      console.error("Erro na integração:", error);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Integrar Redes Sociais</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {networks.map((network) => (
          <Button
            key={network.id}
            variant={network.connected ? "default" : "outline"}
            className="flex items-center gap-2 w-full"
            onClick={() => handleConnect(network)}
          >
            {network.icon}
            <span>{network.name}</span>
            {network.connected && (
              <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Conectado
              </span>
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};