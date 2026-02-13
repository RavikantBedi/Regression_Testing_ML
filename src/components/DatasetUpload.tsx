import { useState, useCallback } from "react";
import { Upload, X, FileSpreadsheet, RefreshCw } from "lucide-react";
import { DataPoint } from "@/lib/regression";

export interface UploadedDataset {
  data: DataPoint[];
  headers: { x: string; y: string };
  fileName: string;
}

export interface ParsedFile {
  rawHeaders: string[];
  rawRows: string[][];
  numericIndices: number[];
  fileName: string;
}

interface DatasetUploadProps {
  onDatasetLoaded: (dataset: UploadedDataset) => void;
  currentDataset: UploadedDataset | null;
  parsedFile: ParsedFile | null;
  onParsedFile: (pf: ParsedFile) => void;
  onClear: () => void;
  selectedXCol: number;
  selectedYCol: number;
  onXColChange: (col: number) => void;
  onYColChange: (col: number) => void;
}

const SAMPLE_CSV = `area,price
650,70
785,95
900,105
1050,130
1200,148
1350,170
1550,198
1700,215
1950,258
2100,275
2400,320
2800,370
3000,400
3500,465
3800,500`;

const DatasetUpload = ({
  onDatasetLoaded,
  currentDataset,
  parsedFile,
  onParsedFile,
  onClear,
  selectedXCol,
  selectedYCol,
  onXColChange,
  onYColChange,
}: DatasetUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = useCallback((text: string, fileName: string) => {
    setError(null);
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 3) {
      setError("Dataset needs at least 2 data rows plus a header row.");
      return;
    }

    const delimiter = lines[0].includes(",") ? "," : lines[0].includes("\t") ? "\t" : ",";
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ""));
    const rows = lines.slice(1).map(l => l.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, "")));

    const numericCols = headers.map((_, i) => {
      const vals = rows.map(r => parseFloat(r[i])).filter(v => !isNaN(v));
      return vals.length >= rows.length * 0.8;
    });

    const numericIndices = numericCols.map((v, i) => (v ? i : -1)).filter(i => i >= 0);

    if (numericIndices.length < 2) {
      setError("Need at least 2 numeric columns. Make sure your CSV has numbers.");
      return;
    }

    const pf: ParsedFile = { rawHeaders: headers, rawRows: rows, numericIndices, fileName };
    onParsedFile(pf);
    onXColChange(numericIndices[0]);
    onYColChange(numericIndices[1]);

    // Auto-load with first two numeric columns
    loadData(rows, headers, numericIndices[0], numericIndices[1], fileName);
  }, [onParsedFile, onXColChange, onYColChange]);

  const loadData = (rows: string[][], headers: string[], xIdx: number, yIdx: number, fileName: string) => {
    const data: DataPoint[] = [];
    for (const row of rows) {
      const x = parseFloat(row[xIdx]);
      const y = parseFloat(row[yIdx]);
      if (!isNaN(x) && !isNaN(y)) data.push({ x, y });
    }

    if (data.length < 2) {
      setError("Not enough valid numeric data points for these columns.");
      return;
    }

    onDatasetLoaded({ data, headers: { x: headers[xIdx], y: headers[yIdx] }, fileName });
    setError(null);
  };

  const handleRerun = () => {
    if (parsedFile) {
      loadData(parsedFile.rawRows, parsedFile.rawHeaders, selectedXCol, selectedYCol, parsedFile.fileName);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(csv|tsv|txt)$/i)) {
      setError("Please upload a CSV, TSV, or TXT file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* File info or upload zone */}
      {parsedFile ? (
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-sm">{parsedFile.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {parsedFile.rawRows.length} rows · {parsedFile.rawHeaders.length} columns · {parsedFile.numericIndices.length} numeric
              </p>
            </div>
          </div>
          <button onClick={onClear} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/40"
            }`}
            onClick={() => document.getElementById("csv-input")?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground">or click to browse · CSV, TSV supported</p>
            <input id="csv-input" type="file" accept=".csv,.tsv,.txt" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
          <button onClick={() => parseCSV(SAMPLE_CSV, "sample_house_prices.csv")}
            className="w-full rounded-lg border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted transition-colors">
            Or load sample dataset (House Prices)
          </button>
        </>
      )}

      {/* Column picker — always visible when file is parsed */}
      {parsedFile && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <p className="font-medium text-sm">Select columns for regression:</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">X (Feature)</label>
              <select value={selectedXCol} onChange={(e) => onXColChange(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm">
                {parsedFile.numericIndices.map((idx) => (
                  <option key={idx} value={idx}>{parsedFile.rawHeaders[idx]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Y (Target)</label>
              <select value={selectedYCol} onChange={(e) => onYColChange(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm">
                {parsedFile.numericIndices.map((idx) => (
                  <option key={idx} value={idx}>{parsedFile.rawHeaders[idx]}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={handleRerun}
            className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Re-run Regression
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
};

export default DatasetUpload;
