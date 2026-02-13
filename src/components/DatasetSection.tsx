import { sampleDataset, linearRegression, featureNames } from "@/lib/regression";
import { useMemo } from "react";

const DatasetSection = () => {
  const result = useMemo(() => linearRegression(sampleDataset), []);

  return (
    <section id="dataset" className="py-20 bg-card border-y border-border">
      <div className="container max-w-4xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Training Data</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Dataset Overview</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Simulated dataset of 20 houses mapping area (sq ft) to price ($1000s). 
          Data is clean with no missing values — preprocessing involved only normalization checks.
        </p>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{featureNames.x}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{featureNames.y}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Predicted</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Error</th>
                </tr>
              </thead>
              <tbody>
                {sampleDataset.map((point, i) => {
                  const pred = result.predictions[i];
                  const error = point.y - pred;
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 font-mono">{point.x.toLocaleString()}</td>
                      <td className="px-4 py-2.5 font-mono font-medium">${point.y}k</td>
                      <td className="px-4 py-2.5 font-mono">${pred.toFixed(1)}k</td>
                      <td className={`px-4 py-2.5 font-mono text-xs ${Math.abs(error) > 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {error > 0 ? "+" : ""}{error.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetSection;
