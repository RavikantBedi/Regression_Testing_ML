import HeroSection from "@/components/HeroSection";
import TheorySection from "@/components/TheorySection";
import PredictionDemo from "@/components/PredictionDemo";
import DatasetSection from "@/components/DatasetSection";
import VivaSection from "@/components/VivaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-14">
          <span className="font-display font-bold text-lg">LR<span className="text-gradient">Predict</span></span>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#theory" className="hover:text-foreground transition-colors">Theory</a>
            <a href="#prediction" className="hover:text-foreground transition-colors">Predict</a>
            <a href="#dataset" className="hover:text-foreground transition-colors">Dataset</a>
            <a href="#viva" className="hover:text-foreground transition-colors">Viva</a>
          </div>
        </div>
      </nav>

      <HeroSection />
      <PredictionDemo />
      <DatasetSection />
      <TheorySection />
      <VivaSection />

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container">
          <p className="font-display font-semibold text-foreground mb-1">House Price Prediction Using Linear Regression</p>
          <p>Final Year Mini Project · Machine Learning · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
