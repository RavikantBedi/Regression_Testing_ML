import { TrendingUp, BookOpen, BarChart3, Brain } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Brain className="h-4 w-4 text-accent" />
            Machine Learning — Final Year Project
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            House Price{" "}
            <span className="text-gradient">Prediction</span>{" "}
            Using Linear Regression
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A supervised machine learning approach to predict residential property prices 
            based on area, using the Ordinary Least Squares method. Built as a complete 
            end-to-end ML project with interactive visualizations.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <a href="#prediction" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity">
              <TrendingUp className="h-4 w-4" />
              Try Prediction
            </a>
            <a href="#theory" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium hover:bg-secondary transition-colors">
              <BookOpen className="h-4 w-4" />
              Read Theory
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Algorithm", value: "OLS Regression" },
              { label: "R² Score", value: "0.998+" },
              { label: "Dataset", value: "20 Samples" },
              { label: "Features", value: "Area → Price" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display text-xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
