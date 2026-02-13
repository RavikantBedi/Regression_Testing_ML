import { useState, useMemo } from "react";
import { sampleDataset, linearRegression, predict, featureNames, DataPoint } from "@/lib/regression";
import { TrendingUp } from "lucide-react";
import DatasetUpload, { UploadedDataset, ParsedFile } from "@/components/DatasetUpload";

const PredictionDemo = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [predicted, setPredicted] = useState<number | null>(null);
  const [uploadedDataset, setUploadedDataset] = useState<UploadedDataset | null>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [selectedXCol, setSelectedXCol] = useState<number>(0);
  const [selectedYCol, setSelectedYCol] = useState<number>(1);

  const activeData = uploadedDataset?.data ?? sampleDataset;
  const activeHeaders = uploadedDataset?.headers ?? { x: featureNames.x, y: featureNames.y };
  const result = useMemo(() => linearRegression(activeData), [activeData]);

  const handlePredict = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) setPredicted(predict(result.slope, result.intercept, val));
  };

  const handleDatasetLoaded = (ds: UploadedDataset) => { setUploadedDataset(ds); setPredicted(null); setInputValue(""); };
  const handleClear = () => { setUploadedDataset(null); setParsedFile(null); setPredicted(null); setInputValue(""); };

  // Chart calculations
  const chart = useMemo(() => {
    const W = 600, H = 400;
    const m = { top: 15, right: 15, bottom: 40, left: 50 };
    const cw = W - m.left - m.right;
    const ch = H - m.top - m.bottom;

    const xs = activeData.map(d => d.x);
    const ys = activeData.map(d => d.y);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);

    // Include regression endpoints
    const rYmin = predict(result.slope, result.intercept, xMin);
    const rYmax = predict(result.slope, result.intercept, xMax);
    const allYmin = Math.min(yMin, rYmin, rYmax);
    const allYmax = Math.max(yMax, rYmin, rYmax);

    const xPad = (xMax - xMin) * 0.06 || 10;
    const yPad = (allYmax - allYmin) * 0.08 || 10;
    const dxMin = Math.max(0, xMin - xPad), dxMax = xMax + xPad;
    const dyMin = Math.max(0, allYmin - yPad), dyMax = allYmax + yPad;
    const rx = dxMax - dxMin || 1;
    const ry = dyMax - dyMin || 1;

    const sx = (v: number) => m.left + ((v - dxMin) / rx) * cw;
    const sy = (v: number) => m.top + ((dyMax - v) / ry) * ch;

    return { W, H, m, cw, ch, sx, sy, dxMin, dxMax, dyMin, dyMax, rx, ry, rYmin, rYmax, xMin, xMax };
  }, [activeData, result]);

  const fmt = (n: number) => Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toFixed(0);
  const predPoint = predicted !== null && inputValue ? { x: parseFloat(inputValue), y: predicted } : null;

  return (
    <section id="prediction" className="py-20">
      <div className="container max-w-5xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Interactive Demo</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Upload & Predict</h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
          Upload your own CSV dataset or use the sample data. Change X/Y columns anytime to re-run regression.
        </p>
        <div className="mb-10 max-w-xl">
          <DatasetUpload onDatasetLoaded={handleDatasetLoaded} currentDataset={uploadedDataset}
            parsedFile={parsedFile} onParsedFile={setParsedFile} onClear={handleClear}
            selectedXCol={selectedXCol} selectedYCol={selectedYCol}
            onXColChange={setSelectedXCol} onYColChange={setSelectedYCol} />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="block text-sm font-medium mb-2">{activeHeaders.x}</label>
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`Enter ${activeHeaders.x}`} />
              <button onClick={handlePredict}
                className="mt-4 w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <TrendingUp className="h-4 w-4" /> Predict {activeHeaders.y}
              </button>
              {predicted !== null && (
                <div className="mt-6 rounded-lg border-2 border-accent bg-accent/10 p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Predicted {activeHeaders.y}</p>
                  <p className="font-display text-4xl font-bold text-gradient">{predicted.toFixed(2)}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-display font-semibold">Model Metrics</h3>
              {[
                { label: "R² Score", value: result.rSquared.toFixed(4) },
                { label: "Slope (m)", value: result.slope.toFixed(4) },
                { label: "Intercept (c)", value: result.intercept.toFixed(2) },
                { label: "MSE", value: result.mse.toFixed(2) },
                { label: "MAE", value: result.mae.toFixed(2) },
                { label: "Data Points", value: activeData.length.toString() },
              ].map((m) => (
                <div key={m.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono font-medium">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4">Scatter Plot with Regression Line</h3>
            <div style={{ aspectRatio: '3/2', width: '100%' }}>
              <svg viewBox={`0 0 ${chart.W} ${chart.H}`} className="w-full h-full">
                {/* Grid */}
                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
                  <g key={i}>
                    <line x1={chart.m.left} y1={chart.m.top + (1 - f) * chart.ch} x2={chart.W - chart.m.right} y2={chart.m.top + (1 - f) * chart.ch} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <line x1={chart.m.left + f * chart.cw} y1={chart.m.top} x2={chart.m.left + f * chart.cw} y2={chart.H - chart.m.bottom} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <text x={chart.m.left - 6} y={chart.m.top + (1 - f) * chart.ch + 4} textAnchor="end" fontSize="10" fill="hsl(var(--muted-foreground))">{fmt(chart.dyMin + f * (chart.dyMax - chart.dyMin))}</text>
                    <text x={chart.m.left + f * chart.cw} y={chart.H - chart.m.bottom + 16} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{fmt(chart.dxMin + f * (chart.dxMax - chart.dxMin))}</text>
                  </g>
                ))}
                {/* Axes */}
                <line x1={chart.m.left} y1={chart.H - chart.m.bottom} x2={chart.W - chart.m.right} y2={chart.H - chart.m.bottom} stroke="hsl(var(--border))" strokeWidth={1} />
                <line x1={chart.m.left} y1={chart.m.top} x2={chart.m.left} y2={chart.H - chart.m.bottom} stroke="hsl(var(--border))" strokeWidth={1} />
                {/* Labels */}
                <text x={chart.W / 2} y={chart.H - 5} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">{activeHeaders.x}</text>
                <text x={12} y={chart.H / 2} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))" transform={`rotate(-90, 12, ${chart.H / 2})`}>{activeHeaders.y}</text>
                {/* Regression line */}
                <line x1={chart.sx(chart.dxMin)} y1={chart.sy(predict(result.slope, result.intercept, chart.dxMin))}
                  x2={chart.sx(chart.dxMax)} y2={chart.sy(predict(result.slope, result.intercept, chart.dxMax))}
                  stroke="hsl(38, 92%, 50%)" strokeWidth={3} />
                {/* Data points */}
                {activeData.map((d, i) => (
                  <circle key={i} cx={chart.sx(d.x)} cy={chart.sy(d.y)} r={5} fill="hsl(220, 30%, 20%)" stroke="white" strokeWidth={1.5} />
                ))}
                {/* Prediction point */}
                {predPoint && (
                  <g transform={`translate(${chart.sx(predPoint.x)}, ${chart.sy(predPoint.y)}) rotate(45)`}>
                    <rect x={-6} y={-6} width={12} height={12} fill="hsl(0, 72%, 51%)" />
                  </g>
                )}
              </svg>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "hsl(220, 30%, 20%)" }} /> Data Points</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-6 h-0.5" style={{ background: "hsl(38, 92%, 50%)" }} /> Regression Line</span>
              {predPoint && <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rotate-45" style={{ background: "hsl(0, 72%, 51%)" }} /> Prediction</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictionDemo;
