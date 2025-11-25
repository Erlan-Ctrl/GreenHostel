import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Leaf, Accessibility } from "lucide-react";
import { Link } from "react-router-dom";

interface Hostel {
  id: string;
  nome: string;
  cidade: string;
  descricao: string;
  sustentavel: boolean;
  acessibilidade: boolean;
  avaliacao_media: number;
  fotos: string[];
}

export const FeaturedHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .order("avaliacao_media", { ascending: false })
      .limit(6);

    if (!error && data) {
      setHostels(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Hostels em Destaque</h2>
        <p className="text-muted-foreground text-lg">
          Conheça as acomodações mais bem avaliadas em Belém
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <Card key={hostel.id} className="overflow-hidden transition-all hover:shadow-hover group">
            <div className="relative h-48 bg-gradient-card overflow-hidden">
              {hostel.fotos[0] ? (
                <img
                  src={hostel.fotos[0]}
                  alt={hostel.nome}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-hero" />
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                {hostel.sustentavel && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Leaf className="h-3 w-3 mr-1" />
                    Sustentável
                  </Badge>
                )}
                {hostel.acessibilidade && (
                  <Badge variant="secondary">
                    <Accessibility className="h-3 w-3 mr-1" />
                    Acessível
                  </Badge>
                )}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {hostel.nome}
                <div className="flex items-center gap-1 text-sm font-normal">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {hostel.avaliacao_media.toFixed(1)}
                </div>
              </CardTitle>
              <CardDescription>{hostel.cidade}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {hostel.descricao}
              </p>
              <Link to={`/hostel/${hostel.id}`}>
                <Button className="w-full">Ver Detalhes</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
