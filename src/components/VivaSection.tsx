import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const vivaQA = [
  { q: "What is Linear Regression?", a: "Linear Regression is a supervised machine learning algorithm that models the relationship between a dependent variable and one or more independent variables by fitting a straight line (best-fit line) through the data points." },
  { q: "What is the equation of a simple linear regression line?", a: "The equation is y = mx + c, where y is the predicted value, m is the slope (coefficient), x is the input feature, and c is the y-intercept." },
  { q: "What is the cost function used in Linear Regression?", a: "Mean Squared Error (MSE) is the most common cost function. It calculates the average of the squared differences between actual and predicted values: J = (1/n) Σ(yᵢ − ŷᵢ)²." },
  { q: "What is Gradient Descent?", a: "Gradient Descent is an optimization algorithm that iteratively adjusts the model parameters (slope and intercept) in the direction that reduces the cost function. It multiplies the gradient by a learning rate to determine step size." },
  { q: "What is the R² score and what does it tell us?", a: "R² (coefficient of determination) measures how well the regression line fits the data. It ranges from 0 to 1 — a value close to 1 means the model explains most of the variance in the target variable." },
  { q: "What is the difference between Simple and Multiple Linear Regression?", a: "Simple Linear Regression uses one independent variable, while Multiple Linear Regression uses two or more independent variables to predict the outcome." },
  { q: "What are the assumptions of Linear Regression?", a: "Key assumptions include: linearity between X and y, independence of errors, homoscedasticity (constant variance of errors), normal distribution of residuals, and no multicollinearity among features." },
  { q: "How do you handle outliers in Linear Regression?", a: "Outliers can be handled by removing them if they are data entry errors, using robust regression methods, applying transformations like log, or using regularization techniques like Ridge regression." },
  { q: "What is overfitting and how does it affect Linear Regression?", a: "Overfitting occurs when the model learns noise in the training data rather than the underlying pattern. In Linear Regression, it is less common with few features but can happen with polynomial features. Regularization (L1/L2) helps prevent it." },
  { q: "Why did you choose Linear Regression for house price prediction?", a: "House prices generally have a strong linear correlation with area — larger houses cost more. Linear Regression is simple, interpretable, computationally efficient, and provides a solid baseline. The high R² score we achieved validates this choice." },
  { q: "What is the difference between MAE and MSE?", a: "MAE (Mean Absolute Error) is the average of absolute differences — it is less sensitive to outliers. MSE (Mean Squared Error) squares the differences, penalizing large errors more heavily. Both measure model accuracy." },
  { q: "Can Linear Regression be used for classification?", a: "Technically no — Linear Regression is designed for continuous output. For binary classification, Logistic Regression is used instead, which applies a sigmoid function to map outputs to probabilities." },
  { q: "What libraries did you use in this project?", a: "For the Python implementation: NumPy for numerical operations, Pandas for data handling, Scikit-learn for model training, and Matplotlib for visualization. The web interface uses React with Recharts for interactive charts." },
  { q: "How would you improve this project in the future?", a: "I would add multiple features (bedrooms, location, age), try Polynomial Regression for non-linear patterns, compare with other algorithms like Random Forest, and deploy it as a web service using Flask or Streamlit." },
];

const VivaSection = () => {
  return (
    <section id="viva" className="py-20">
      <div className="container max-w-4xl">
        <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">Exam Preparation</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Viva Questions & Answers</h2>
        <p className="text-muted-foreground text-lg mb-10">
          {vivaQA.length} commonly asked questions with clear, concise answers for your project viva.
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {vivaQA.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`} className="rounded-xl border border-border bg-card px-6">
              <AccordionTrigger className="text-left font-medium">
                <span className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-9 pb-4 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default VivaSection;
