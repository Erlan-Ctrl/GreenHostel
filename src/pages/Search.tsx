import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Star, Leaf, Accessibility, Search as SearchIcon } from "lucide-react";

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

const Search = () => {
  const [searchParams] = useSearchParams();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sustentavel, setSustentavel] = useState(false);
  const [acessibilidade, setAcessibilidade] = useState(false);
  const [precoMax, setPrecoMax] = useState([1000]);

  useEffect(() => {
    loadHostels();
  }, [searchParams, sustentavel, acessibilidade]);

  const loadHostels = async () => {
    let query = supabase.from("hostels").select("*");

    const cidade = searchParams.get("cidade");
    if (cidade) {
      query = query.ilike("cidade", `%${cidade}%`);
    }

    if (searchQuery) {
      query = query.or(`nome.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
    }

    if (sustentavel) {
      query = query.eq("sustentavel", true);
    }

    if (acessibilidade) {
      query = query.eq("acessibilidade", true);
    }

    const { data, error } = await query.order("avaliacao_media", { ascending: false });

    if (!error && data) {
      setHostels(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Refine sua busca</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome do hostel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={loadHostels} className="w-full">
                    Buscar
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sustentavel">Sustentável</Label>
                  <Switch
                    id="sustentavel"
                    checked={sustentavel}
                    onCheckedChange={setSustentavel}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="acessibilidade">Acessível</Label>
                  <Switch
                    id="acessibilidade"
                    checked={acessibilidade}
                    onCheckedChange={setAcessibilidade}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preço máximo: R$ {precoMax[0]}</Label>
                  <Slider
                    value={precoMax}
                    onValueChange={setPrecoMax}
                    max={1000}
                    min={50}
                    step={50}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {hostels.length} {hostels.length === 1 ? "Hostel Encontrado" : "Hostels Encontrados"}
              </h1>
              <p className="text-muted-foreground">
                em {searchParams.get("cidade") || "Belém"}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : hostels.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Nenhum hostel encontrado com esses filtros.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
