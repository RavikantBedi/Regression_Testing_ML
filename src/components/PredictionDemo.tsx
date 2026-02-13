import { useState, useMemo } from "react";
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
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

  const chartData = useMemo(() => {
    const minX = Math.min(...activeData.map(d => d.x));
    const maxX = Math.max(...activeData.map(d => d.x));
    return {
      scatter: activeData,
      line: [
        { x: minX, line: predict(result.slope, result.intercept, minX) },
        { x: maxX, line: predict(result.slope, result.intercept, maxX) },
      ],
    };
  }, [activeData, result]);

  const handlePredict = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) setPredicted(predict(result.slope, result.intercept, val));
  };

  const handleDatasetLoaded = (ds: UploadedDataset) => {
    setUploadedDataset(ds);
    setPredicted(null);
    setInputValue("");
  };

  const handleClear = () => {
    setUploadedDataset(null);
    setParsedFile(null);
    setPredicted(null);
    setInputValue("");
  };

  return (
    <section id="prediction" className="py-20">
      <div className="container max-w-5xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Interactive Demo</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Upload & Predict</h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
          Upload your own CSV dataset or use the sample data. Change X/Y columns anytime to re-run regression.
        </p>

        <div className="mb-10 max-w-xl">
          <DatasetUpload
            onDatasetLoaded={handleDatasetLoaded}
            currentDataset={uploadedDataset}
            parsedFile={parsedFile}
            onParsedFile={setParsedFile}
            onClear={handleClear}
            selectedXCol={selectedXCol}
            selectedYCol={selectedYCol}
            onXColChange={setSelectedXCol}
            onYColChange={setSelectedYCol}
          />
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
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4">Scatter Plot with Regression Line</h3>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="x" type="number" domain={["dataMin - 100", "dataMax + 100"]}
                    label={{ value: activeHeaders.x, position: "bottom", offset: 0, style: { fontSize: 12 } }} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="y" type="number"
                    label={{ value: activeHeaders.y, angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } }} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Scatter name="Data Points" data={chartData.scatter} fill="hsl(var(--primary))" r={5} />
                  <Line data={chartData.line} dataKey="line" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} type="linear" name="Regression Line" />
                  {predicted !== null && inputValue && (
                    <Scatter name="Your Prediction" data={[{ x: parseFloat(inputValue), y: predicted }]}
                      fill="hsl(var(--destructive))" r={8} shape="diamond" />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictionDemo;
