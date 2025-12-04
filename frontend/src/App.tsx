import { useState, useEffect } from 'react';
import { ChatInterface, Message } from './components/ChatInterface';
import { MetricsPanel } from './components/MetricsPanel';
import { ModelSelector } from './components/ModelSelector';
import { GenerationSettings } from './components/GenerationSettings';

interface TokenData {
  token: string;
  entropy: number;
  risk_level?: 'high' | 'medium' | 'low';
  candidates: { token: string; prob: number }[];
}

interface Model {
  id: string;
  name: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEpr, setCurrentEpr] = useState<number | null>(null);
  const [currentRiskScore, setCurrentRiskScore] = useState<number | null>(null);
  const [currentTokens, setCurrentTokens] = useState<TokenData[]>([]);

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Generation Settings State
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(20);
  const [seed, setSeed] = useState<string>('');

  // API URL configuration
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

  useEffect(() => {
    // Fetch available models
    fetch(`${API_URL}/models`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then((data: Model[]) => {
        setModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0].id);
        }
      })
      .catch(err => console.error("Failed to fetch models:", err));
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          prompt: content,
          model: selectedModel,
          temperature,
          top_k: topK,
          seed: seed ? parseInt(seed) : undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMsg: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMsg]);
      setCurrentEpr(data.epr);
      setCurrentRiskScore(data.risk_score);
      setCurrentTokens(data.tokens);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { role: 'assistant', content: 'Error: Failed to get response from backend.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 border-r">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-4 justify-between gap-4">
          <h1 className="font-semibold truncate">WEPR - Hallucination Detection</h1>
          <div className="flex items-center gap-2">
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
            />
            <GenerationSettings
              temperature={temperature}
              setTemperature={setTemperature}
              topK={topK}
              setTopK={setTopK}
              seed={seed}
              setSeed={setSeed}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            latestTokens={currentTokens}
          />
        </div>
      </div>
      <div className="w-1/2 bg-card flex flex-col border-l">
        <MetricsPanel epr={currentEpr} risk_score={currentRiskScore} tokens={currentTokens} />
      </div>
    </div>
  );
}

export default App;
