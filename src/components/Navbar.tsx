import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Leaf className="h-6 w-6" />
          Green Hostel
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/search">
            <Button variant="ghost">Buscar Hostels</Button>
          </Link>
          
          {user ? (
            <>
              <Link to="/my-reservations">
                <Button variant="ghost">Minhas Reservas</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
