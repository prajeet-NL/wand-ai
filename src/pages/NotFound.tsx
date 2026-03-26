import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/PageTransition";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <FadeIn>
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
            <Compass className="h-9 w-9 text-muted-foreground" />
          </div>
          <h1 className="font-display text-6xl font-bold text-gradient mb-3">404</h1>
          <p className="text-lg text-muted-foreground mb-6">This destination doesn't exist</p>
          <Button asChild className="gradient-ocean text-primary-foreground rounded-full shadow-glow px-6">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
};

export default NotFound;
