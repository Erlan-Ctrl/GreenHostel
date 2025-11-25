import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { addDays, differenceInDays } from "date-fns";

interface Room {
  id: string;
  tipo: string;
  capacidade: number;
  tarifa_noite: number;
  taxa_limpeza: number;
  descricao: string;
  tipo_cama: string;
  hostel_id: string;
  hostels: {
    nome: string;
    cidade: string;
    endereco: string;
  };
}

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast.error("Você precisa estar logado para fazer uma reserva");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          *,
          hostels (
            nome,
            cidade,
            endereco
          )
        `)
        .eq("id", roomId)
        .single();

      if (error) throw error;
      setRoom(data);
    } catch (error) {
      console.error("Error loading room:", error);
      toast.error("Erro ao carregar informações do quarto");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !room) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    if (nights <= 0) return 0;
    return (room.tarifa_noite * nights) + room.taxa_limpeza;
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return nights > 0 ? nights : 0;
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !room || !user) {
      toast.error("Por favor, selecione as datas");
      return;
    }

    const nights = getNights();
    if (nights <= 0) {
      toast.error("A data de check-out deve ser posterior ao check-in");
      return;
    }

    setProcessing(true);
    try {
      // Criar reserva
      const { data: reservation, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          room_id: room.id,
          data_inicio: checkIn.toISOString().split('T')[0],
          data_fim: checkOut.toISOString().split('T')[0],
          noites: nights,
          valor_total: calculateTotal(),
          taxa_limpeza: room.taxa_limpeza,
          status: "PENDENTE"
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Simular pagamento
      const paymentSuccess = Math.random() > 0.1; // 90% de sucesso
      
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          reservation_id: reservation.id,
          status: paymentSuccess ? "CONFIRMADO" : "FALHOU",
          transacao_id: `TXN-${Date.now()}`,
          provider_response: {
            success: paymentSuccess,
            timestamp: new Date().toISOString()
          }
        });

      if (paymentError) throw paymentError;

      if (paymentSuccess) {
        // Atualizar status da reserva
        await supabase
          .from("reservations")
          .update({ status: "CONFIRMADO" })
          .eq("id", reservation.id);

        toast.success("Reserva confirmada com sucesso!");
        navigate("/my-reservations");
      } else {
        toast.error("Pagamento falhou. Tente novamente.");
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Erro ao processar reserva");
    } finally {
      setProcessing(false);
    }
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

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Quarto não encontrado</p>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const nights = getNights();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Finalizar Reserva</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{room.hostels.nome}</CardTitle>
                <CardDescription>{room.tipo} - {room.tipo_cama}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                    <p className="font-medium">{room.capacidade} pessoas</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tarifa por noite</p>
                    <p className="font-medium">R$ {room.tarifa_noite.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de limpeza</p>
                    <p className="font-medium">R$ {room.taxa_limpeza.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Selecione as datas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-in</label>
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-out</label>
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => !checkIn || date <= checkIn}
                      className="rounded-md border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkIn && checkOut && nights > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in</span>
                        <span className="font-medium">{checkIn.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="font-medium">{checkOut.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Noites</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">R$ {room.tarifa_noite.toFixed(2)} × {nights} noites</span>
                        <span className="font-medium">R$ {(room.tarifa_noite * nights).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de limpeza</span>
                        <span className="font-medium">R$ {room.taxa_limpeza.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">R$ {total.toFixed(2)}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleBooking}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Confirmar e Pagar"
                        )}
                      </Button>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Selecione as datas para ver o resumo
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
