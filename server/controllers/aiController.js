const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const getPrediction = async (req, res) => {
  try {
    const { cropId } = req.params;

    // Proxy request to the Python FastAPI service
    const response = await fetch(`${AI_SERVICE_URL}/predictions/${cropId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: `No trained model found for crop '${cropId}'` });
      }
      throw new Error(`AI Service responded with status ${response.status}`);
    }
    
    const prediction = await response.json();
    res.json(prediction);
  } catch (error) {
    console.error("AI Service Error:", error.message);
    res.status(500).json({ message: "Failed to fetch prediction from AI service", error: error.message });
  }
};

export const getAvailableCrops = async (req, res) => {
  try {
    // Proxy request to the Python FastAPI service
    const response = await fetch(`${AI_SERVICE_URL}/crops`);
    
    if (!response.ok) {
      throw new Error(`AI Service responded with status ${response.status}`);
    }
    
    const crops = await response.json();
    res.json(crops);
  } catch (error) {
    console.error("AI Service Error:", error.message);
    res.status(500).json({ message: "Failed to fetch available crops from AI service", error: error.message });
  }
};
