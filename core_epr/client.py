import requests
import json

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url

    def generate(self, model, prompt, system_prompt=None, options=None):
        """
        Generates a response from the Ollama model with logprobs.
        
        Args:
            model (str): The model name.
            prompt (str): The user prompt.
            system_prompt (str, optional): The system prompt.
            options (dict, optional): Additional options (e.g., temperature, num_predict).
            
        Returns:
            dict: The full JSON response from Ollama (including logprobs).
        """
        url = f"{self.base_url}/api/generate"
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "logprobs": True,  # Critical: Request logprobs for entropy calculation
            "top_logprobs": 20 # Critical: Request top 20 candidates per token
        }
        
        if system_prompt:
            payload["system"] = system_prompt
            
        if options:
            payload["options"] = options
            
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error communicating with Ollama: {e}")
            return None
