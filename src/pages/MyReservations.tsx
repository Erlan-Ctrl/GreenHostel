import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Calendar, MapPin, Users, DollarSign } from "lucide-react";

interface Reservation {
  id: string;
  data_inicio: string;
  data_fim: string;
  noites: number;
  valor_total: number;
  taxa_limpeza: number;
  status: string;
  criado_em: string;
  rooms: {
    tipo: string;
    capacidade: number;
    tarifa_noite: number;
    hostels: {
      nome: string;
      cidade: string;
      endereco: string;
      fotos: string[];
    };
  };
}

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast.error("Você precisa estar logado");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          rooms (
            tipo,
            capacidade,
            tarifa_noite,
            hostels (
              nome,
              cidade,
              endereco,
              fotos
            )
          )
        `)
        .eq("user_id", user.id)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error("Error loading reservations:", error);
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDENTE: { label: "Pendente", variant: "secondary" },
      CONFIRMADO: { label: "Confirmado", variant: "default" },
      CANCELADO: { label: "Cancelado", variant: "destructive" }
    };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Minhas Reservas</h1>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não tem reservas</p>
              <Button onClick={() => navigate("/search")}>
                Buscar Hostels
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <img
                      src={reservation.rooms.hostels.fotos[0] || "/placeholder.svg"}
                      alt={reservation.rooms.hostels.nome}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="md:col-span-3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="mb-2">{reservation.rooms.hostels.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {reservation.rooms.hostels.endereco}, {reservation.rooms.hostels.cidade}
                        </CardDescription>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(reservation.data_inicio).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(reservation.data_fim).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Quarto</p>
                        <p className="font-medium">{reservation.rooms.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                        <p className="font-medium text-primary flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          R$ {reservation.valor_total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{reservation.noites} noite{reservation.noites > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {reservation.rooms.capacidade} pessoas
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
