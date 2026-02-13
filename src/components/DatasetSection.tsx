import { useMemo, useState } from "react";
import { sampleDataset, linearRegression, featureNames, DataPoint } from "@/lib/regression";

interface DatasetSectionProps {
  data?: DataPoint[];
  headers?: { x: string; y: string };
}

const DatasetSection = ({ data, headers }: DatasetSectionProps) => {
  const activeData = data ?? sampleDataset;
  const activeHeaders = headers ?? { x: featureNames.x, y: featureNames.y };
  const result = useMemo(() => linearRegression(activeData), [activeData]);

  return (
    <section id="dataset" className="py-20 bg-card border-y border-border">
      <div className="container max-w-4xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Training Data</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Dataset Overview</h2>
        <p className="text-muted-foreground text-lg mb-8">
          {activeData.length} data points · {activeHeaders.x} → {activeHeaders.y}
        </p>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{activeHeaders.x}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">{activeHeaders.y}</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Predicted</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Error</th>
                </tr>
              </thead>
              <tbody>
                {activeData.map((point, i) => {
                  const pred = result.predictions[i];
                  const error = point.y - pred;
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 font-mono">{point.x}</td>
                      <td className="px-4 py-2.5 font-mono font-medium">{point.y}</td>
                      <td className="px-4 py-2.5 font-mono">{pred.toFixed(2)}</td>
                      <td className={`px-4 py-2.5 font-mono text-xs ${Math.abs(error) > (result.mae * 2) ? "text-destructive" : "text-muted-foreground"}`}>
                        {error > 0 ? "+" : ""}{error.toFixed(2)}
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
