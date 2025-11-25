import { Navbar } from "@/components/Navbar";
import { SearchHero } from "@/components/SearchHero";
import { FeaturedHostels } from "@/components/FeaturedHostels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Heart, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SearchHero />
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher o Green Hostel?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hospedagens eco-friendly que combinam conforto, sustentabilidade e responsabilidade social
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-hover transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Sustentável</h3>
              <p className="text-muted-foreground">
                Hostels com práticas ecológicas e responsabilidade ambiental
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-hover transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Seguro</h3>
              <p className="text-muted-foreground">
                Reservas protegidas e pagamentos seguros
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-hover transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Acolhedor</h3>
              <p className="text-muted-foreground">
                Ambientes amigáveis e comunidades vibrantes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-hover transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Bem Localizado</h3>
              <p className="text-muted-foreground">
                Próximo aos principais pontos turísticos de Belém
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <FeaturedHostels />

      {/* CTA Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para sua próxima aventura?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Encontre o hostel perfeito em Belém e faça parte de uma comunidade que se importa com o planeta
          </p>
          <Button size="lg" variant="secondary" className="font-semibold">
            Começar a Buscar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
