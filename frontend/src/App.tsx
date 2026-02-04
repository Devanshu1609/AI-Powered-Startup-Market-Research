import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ResultsPage from './components/ResultsPage';
import { ValidationResult } from './types/validation';
import { fetchValidationResult } from './api/validationApi';
import { exampleValidationResult } from './data/exampleData';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (idea: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchValidationResult(idea);
      setValidationData(result);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to validate idea. Using example data for demonstration.');
      setValidationData(exampleValidationResult);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setValidationData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {showResults && validationData ? (
        <ResultsPage
          data={validationData}
          onBack={handleBack}
          error={error}
        />
      ) : (
        <LandingPage onValidate={handleValidate} />
      )}
    </div>
  );
}

export default App;
