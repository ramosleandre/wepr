from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from core_epr.client import OllamaClient
from core_epr.processing import process_logprobs
from models_config import AVAILABLE_MODELS, DEFAULT_MODEL

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = OllamaClient()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/models', methods=['GET'])
def get_models():
    return jsonify(AVAILABLE_MODELS)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    prompt = data.get('prompt')
    model_id = data.get('model', DEFAULT_MODEL)
    
    # Extract generation options
    options = {}
    if 'temperature' in data:
        options['temperature'] = float(data['temperature'])
    if 'top_k' in data:
        options['top_k'] = int(data['top_k'])
    if 'seed' in data:
        try:
            options['seed'] = int(data['seed'])
        except (ValueError, TypeError):
            pass # Ignore invalid seed
    
    if not prompt:
        return jsonify({'error': 'No prompt'}), 400
        
    # 1. Generate with Ollama (Core Client)
    res = client.generate(model_id, prompt, options=options)
    
    if not res:
        return jsonify({'error': 'Ollama error'}), 500
        
    response_text = res.get('response', '')
    logprobs = res.get('logprobs', [])
    
    # 2. Process Logprobs & Calculate Metrics (Core Processing)
    tokens_data, epr, risk_score = process_logprobs(logprobs)
    
    return jsonify({
        'response': response_text,
        'epr': epr,
        'risk_score': risk_score,
        'tokens': tokens_data
    })

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Run the WEPR backend.')
    parser.add_argument('--port', type=int, default=8000, help='Port to run the server on')
    args = parser.parse_args()
    
    app.run(debug=True, port=args.port)
