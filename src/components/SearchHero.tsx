import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import heroImage from "@/assets/hero-hostel.jpg";

export const SearchHero = () => {
  const navigate = useNavigate();
  const [cidade, setCidade] = useState("Belém");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (cidade) params.set("cidade", cidade);
    if (dataInicio) params.set("data_inicio", format(dataInicio, "yyyy-MM-dd"));
    if (dataFim) params.set("data_fim", format(dataFim, "yyyy-MM-dd"));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Descubra Hostels Sustentáveis
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Hospedagens eco-friendly em Belém que cuidam do planeta e do seu conforto
        </p>
        
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-elevated p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Input
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="h-12"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dataFim}
                  onSelect={setDataFim}
                  disabled={(date) => date < new Date() || (dataInicio ? date <= dataInicio : false)}
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={handleSearch} className="h-12 bg-gradient-hero">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
