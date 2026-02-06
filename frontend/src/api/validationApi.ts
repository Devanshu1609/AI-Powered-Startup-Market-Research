import { ValidationResult } from '../types/validation';

const API_URL = 'https://ai-powered-startup-market-research.onrender.com';

export const fetchValidationResult = async (startupIdea: string): Promise<ValidationResult> => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startup_idea: startupIdea }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API ${response.status}: ${errText}`);
    }

    const rawData = await response.json();

    // 🧼 Normalize backend response to match ValidationResult type
    const cleanedData: ValidationResult = {
      startup_idea: rawData.startup_idea ?? '',
      idea_analysis: rawData.idea_analysis ?? '',
      swot_analysis: rawData.swot_analysis ?? '',
      market_analysis: rawData.market_analysis ?? '',
      competition_analysis: rawData.competition_analysis ?? '',
      risk_assessment: (rawData.risk_assessment ?? '')
        .replace(/^risk_assessment:\s*/i, ''), // remove accidental label
      advisor_recommendations: rawData.advisor_recommendations ?? '',
      advice: rawData.advice ?? '',
      messages: Array.isArray(rawData.messages) ? rawData.messages : [], // ensure array
    };

    return cleanedData;
  } catch (error) {
    console.error('Error fetching validation result:', error);
    throw error;
  }
};
