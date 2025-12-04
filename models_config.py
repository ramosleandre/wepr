# List of available models for the EPR application.
# Format: {'id': 'ollama_model_id', 'name': 'Display Name'}

AVAILABLE_MODELS = [
    {
        'id': 'cas/ministral-8b-instruct-2410_q4km',
        'name': 'Ministral 8B'
    },
    {
        'id': 'gemma3:4b',
        'name': 'Hand•e : Gemma 4B (Default)'
    },
    {
        'id': 'llama3.2:1b',
        'name': 'Llama 3.2 1B'
    },
    {
        'id': 'gpt-oss:20b',
        'name': ' Hand•e: gpt-oss 20B'
    },
    {
        'id': 'qwen3:latest',
        'name': 'Hand•e: qwen3 latest'
    },
    # Add more models here as needed
]

DEFAULT_MODEL = 'gemma3:4b'
