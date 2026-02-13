// Simple Linear Regression implementation
// y = mx + b (slope * x + intercept)

export interface DataPoint {
  x: number;
  y: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  mse: number;
  mae: number;
  predictions: number[];
}

// Sample dataset: House area (sq ft) vs Price (in $1000s)
export const sampleDataset: DataPoint[] = [
  { x: 650, y: 70 },
  { x: 785, y: 95 },
  { x: 900, y: 105 },
  { x: 1050, y: 130 },
  { x: 1200, y: 148 },
  { x: 1350, y: 170 },
  { x: 1425, y: 182 },
  { x: 1550, y: 198 },
  { x: 1700, y: 215 },
  { x: 1830, y: 240 },
  { x: 1950, y: 258 },
  { x: 2100, y: 275 },
  { x: 2250, y: 295 },
  { x: 2400, y: 320 },
  { x: 2600, y: 345 },
  { x: 2800, y: 370 },
  { x: 3000, y: 400 },
  { x: 3200, y: 425 },
  { x: 3500, y: 465 },
  { x: 3800, y: 500 },
];

export const featureNames = {
  x: "Area (sq ft)",
  y: "Price ($1000s)",
};

export function linearRegression(data: DataPoint[]): RegressionResult {
  const n = data.length;
  const sumX = data.reduce((s, p) => s + p.x, 0);
  const sumY = data.reduce((s, p) => s + p.y, 0);
  const sumXY = data.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = data.reduce((s, p) => s + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictions = data.map((p) => slope * p.x + intercept);
  const meanY = sumY / n;

  const ssRes = data.reduce((s, p, i) => s + (p.y - predictions[i]) ** 2, 0);
  const ssTot = data.reduce((s, p) => s + (p.y - meanY) ** 2, 0);

  const rSquared = 1 - ssRes / ssTot;
  const mse = ssRes / n;
  const mae = data.reduce((s, p, i) => s + Math.abs(p.y - predictions[i]), 0) / n;

  return { slope, intercept, rSquared, mse, mae, predictions };
}

export function predict(slope: number, intercept: number, x: number): number {
  return slope * x + intercept;
}
