# List of available models for the EPR application.
# Format: {'id': 'ollama_model_id', 'name': 'Display Name'}

AVAILABLE_MODELS = [
    {
        'id': 'cas/ministral-8b-instruct-2410_q4km',
        'name': 'Ministral 8B (Default)'
    },
    {
        'id': 'gemma3:4b',
        'name': 'Gemma 4B'
    },
    {
        'id': 'llama3.2:1b',
        'name': 'Llama 3.2 1B'
    },
    # Add more models here as needed
]

DEFAULT_MODEL = 'cas/ministral-8b-instruct-2410_q4km'
