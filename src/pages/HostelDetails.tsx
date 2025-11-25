import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Leaf, Accessibility, MapPin, Wifi, Coffee, Utensils } from "lucide-react";
import { toast } from "sonner";

interface Hostel {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  descricao: string;
  comodidades: string[];
  sustentavel: boolean;
  acessibilidade: boolean;
  avaliacao_media: number;
  fotos: string[];
}

interface Room {
  id: string;
  tipo: string;
  capacidade: number;
  tarifa_noite: number;
  taxa_limpeza: number;
  descricao: string;
  tipo_cama: string;
}

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostelDetails();
  }, [id]);

  const loadHostelDetails = async () => {
    const { data: hostelData, error: hostelError } = await supabase
      .from("hostels")
      .select("*")
      .eq("id", id)
      .single();

    if (hostelError) {
      toast.error("Hostel não encontrado");
      navigate("/search");
      return;
    }

    const { data: roomsData } = await supabase
      .from("rooms")
      .select("*")
      .eq("hostel_id", id);

    setHostel(hostelData);
    setRooms(roomsData || []);
    setLoading(false);
  };

  const handleBooking = (roomId: string) => {
    navigate(`/booking/${roomId}`);
  };

  const comodidadeIcons: Record<string, any> = {
    wifi: Wifi,
    cafe: Coffee,
    cozinha: Utensils,
  };

  if (loading || !hostel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-2xl" />
            <div className="h-12 bg-muted rounded w-1/2" />
            <div className="h-6 bg-muted rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-elevated">
          {hostel.fotos[0] ? (
            <img
              src={hostel.fotos[0]}
              alt={hostel.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero" />
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hostel.nome}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {hostel.endereco}, {hostel.cidade}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold">{hostel.avaliacao_media.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {hostel.sustentavel && (
                <Badge className="bg-primary text-primary-foreground">
                  <Leaf className="h-4 w-4 mr-1" />
                  Sustentável
                </Badge>
              )}
              {hostel.acessibilidade && (
                <Badge variant="secondary">
                  <Accessibility className="h-4 w-4 mr-1" />
                  Acessível
                </Badge>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{hostel.descricao}</p>
        </div>

        <Separator className="my-8" />

        {/* Amenities */}
        {hostel.comodidades && hostel.comodidades.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hostel.comodidades.map((comodidade) => {
                  const Icon = comodidadeIcons[comodidade.toLowerCase()] || Wifi;
                  return (
                    <div key={comodidade} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="capitalize">{comodidade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Separator className="my-8" />
          </>
        )}

        {/* Rooms */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quartos Disponíveis</h2>
          
          {rooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum quarto disponível no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-hover transition-all">
                  <CardHeader>
                    <CardTitle>{room.tipo}</CardTitle>
                    <CardDescription>
                      Capacidade: {room.capacidade} {room.capacidade === 1 ? "pessoa" : "pessoas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{room.descricao}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          R$ {room.tarifa_noite.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">por noite</p>
                      </div>
                    </div>
                    <Button onClick={() => handleBooking(room.id)} className="w-full">
                      Reservar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;
