import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TheorySection = () => {
  return (
    <section id="theory" className="py-20 bg-card border-y border-border">
      <div className="container max-w-4xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Understanding the Math</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How Linear Regression Works</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Linear Regression finds the best-fit straight line through data points by minimizing the total prediction error.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Equation Card */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-display text-lg font-semibold mb-4">The Equation</h3>
            <div className="code-block text-center text-lg mb-4">
              ŷ = mx + c
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">ŷ</strong> — Predicted value (house price)</li>
              <li><strong className="text-foreground">m</strong> — Slope (how much price changes per sq ft)</li>
              <li><strong className="text-foreground">x</strong> — Input feature (house area)</li>
              <li><strong className="text-foreground">c</strong> — Y-intercept (base price)</li>
            </ul>
          </div>

          {/* Cost Function Card */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Cost Function (MSE)</h3>
            <div className="code-block text-center text-lg mb-4">
              J = (1/n) Σ (yᵢ − ŷᵢ)²
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">J</strong> — Total error to minimize</li>
              <li><strong className="text-foreground">n</strong> — Number of data points</li>
              <li><strong className="text-foreground">yᵢ</strong> — Actual value</li>
              <li><strong className="text-foreground">ŷᵢ</strong> — Predicted value</li>
            </ul>
          </div>
        </div>

        {/* Gradient Descent Steps */}
        <div className="rounded-xl border border-border bg-background p-6 mb-12">
          <h3 className="font-display text-lg font-semibold mb-4">Gradient Descent — Step by Step</h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">1</span>
              <span><strong className="text-foreground">Initialize</strong> slope (m) and intercept (c) to zero or small random values.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">2</span>
              <span><strong className="text-foreground">Calculate predictions</strong> using current m and c for all data points.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">3</span>
              <span><strong className="text-foreground">Compute the error</strong> (difference between predicted and actual values).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">4</span>
              <span><strong className="text-foreground">Update m and c</strong> by subtracting the gradient multiplied by the learning rate.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">5</span>
              <span><strong className="text-foreground">Repeat</strong> until the error converges to a minimum.</span>
            </li>
          </ol>
        </div>

        {/* System Architecture */}
        <div className="rounded-xl border border-border bg-background p-6 mb-12">
          <h3 className="font-display text-lg font-semibold mb-6">System Architecture</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {["User Input", "→", "Data Preprocessing", "→", "Model Training (OLS)", "→", "Prediction Engine", "→", "Visualization"].map((item, i) => (
              item === "→" ? (
                <span key={i} className="text-accent font-bold text-lg">→</span>
              ) : (
                <div key={i} className="rounded-lg border border-border bg-muted px-4 py-2 font-medium text-center">
                  {item}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Code Implementation */}
        <div className="rounded-xl border border-border bg-background p-6 mb-12">
          <h3 className="font-display text-lg font-semibold mb-4">Python Implementation</h3>
          <pre className="code-block text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{`import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# 1. Load dataset
data = pd.read_csv('house_prices.csv')
X = data[['area']].values
y = data['price'].values

# 2. Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Evaluate
r2_score = model.score(X_test, y_test)
print(f"R² Score: {r2_score:.4f}")
print(f"Slope: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")

# 5. Predict
area = 2000  # sq ft
predicted_price = model.predict([[area]])
print(f"Predicted price for {area} sq ft: \${predicted_price[0]:.2f}k")`}</pre>
        </div>

        {/* Advantages, Limitations, Applications */}
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="advantages" className="rounded-xl border border-border bg-background px-6">
            <AccordionTrigger className="font-display text-lg font-semibold">Advantages</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-1 pb-4">
              <p>• Simple to implement and easy to interpret — the coefficients directly show feature importance.</p>
              <p>• Computationally fast, even on large datasets.</p>
              <p>• Works well when the relationship between variables is approximately linear.</p>
              <p>• Serves as a strong baseline model before trying complex algorithms.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="limitations" className="rounded-xl border border-border bg-background px-6">
            <AccordionTrigger className="font-display text-lg font-semibold">Limitations</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-1 pb-4">
              <p>• Assumes a linear relationship — fails for non-linear patterns.</p>
              <p>• Highly sensitive to outliers which can skew the regression line.</p>
              <p>• Assumes features are independent (multicollinearity is a problem).</p>
              <p>• Cannot capture complex interactions between variables.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="applications" className="rounded-xl border border-border bg-background px-6">
            <AccordionTrigger className="font-display text-lg font-semibold">Real-World Applications</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-1 pb-4">
              <p>• <strong className="text-foreground">Real Estate:</strong> Predicting house prices based on area, location, rooms.</p>
              <p>• <strong className="text-foreground">Finance:</strong> Stock price trends, revenue forecasting.</p>
              <p>• <strong className="text-foreground">Healthcare:</strong> Predicting patient outcomes from vitals.</p>
              <p>• <strong className="text-foreground">Marketing:</strong> Ad spend vs. sales correlation.</p>
              <p>• <strong className="text-foreground">Agriculture:</strong> Crop yield prediction from rainfall data.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="future" className="rounded-xl border border-border bg-background px-6">
            <AccordionTrigger className="font-display text-lg font-semibold">Future Enhancements</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-1 pb-4">
              <p>• Multiple Linear Regression with additional features (bedrooms, location, age).</p>
              <p>• Polynomial Regression for non-linear price curves.</p>
              <p>• Model comparison with Decision Trees, Random Forest, XGBoost.</p>
              <p>• Deployment on AWS / Heroku / Streamlit Cloud.</p>
              <p>• Real-time data integration from property listing APIs.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default TheorySection;
