import math
from core_epr.entropy import (
    normalize_probabilities,
    calculate_shannon_entropy,
    calculate_max_entropy,
    calculate_normalized_entropy
)

# Thresholds for risk classification (based on normalized entropy 0-1)
NORM_THRESHOLD_HIGH = 0.6
NORM_THRESHOLD_MEDIUM = 0.3

def process_logprobs(logprobs_list):
    """
    Processes the raw logprobs list from Ollama to calculate entropy metrics.
    
    Args:
        logprobs_list (list): List of token objects from Ollama response.
        
    Returns:
        tuple: (tokens_data, epr, risk_score)
    """
    data = []
    total_entropy = 0
    
    if not isinstance(logprobs_list, list):
        return [], 0, 0

    for t in logprobs_list:
        if 'top_logprobs' not in t:
            continue
            
        candidates = t['top_logprobs']
        
        # 1. Convert logprobs to probabilities
        probs = [math.exp(c['logprob']) for c in candidates]
        
        # 2. Normalize probabilities (Input Normalization)
        # We must normalize because we only have Top-20, not the full vocabulary.
        norm_probs = normalize_probabilities(probs)
        
        # 3. Calculate Shannon Entropy (Raw)
        entropy = calculate_shannon_entropy(norm_probs)
        
        # 4. Calculate Normalized Entropy (Output Scaling 0-1)
        max_entropy = calculate_max_entropy(len(candidates))
        normalized_entropy = calculate_normalized_entropy(entropy, max_entropy)
        
        # 5. Determine Risk Level
        risk_level = 'low'
        if normalized_entropy > NORM_THRESHOLD_HIGH:
            risk_level = 'high'
        elif normalized_entropy > NORM_THRESHOLD_MEDIUM:
            risk_level = 'medium'
        
        # 6. Format candidates for display
        candidates_display = []
        for i, c in enumerate(candidates):
            p = probs[i]
            candidates_display.append({
                'token': c['token'],
                'prob': round(p, 4)
            })
        
        data.append({
            'token': t.get('token', ''),
            'entropy': round(entropy, 4),
            'normalized_entropy': round(normalized_entropy, 2),
            'risk_level': risk_level,
            'candidates': candidates_display
        })
        
        total_entropy += entropy
        
    # Calculate EPR (Average Entropy)
    epr = total_entropy / len(data) if data else 0
    
    # Calculate Global Risk Score (0-1)
    # Heuristic: We assume an EPR > 2.5 is very high risk
    risk_score = min(epr / 2.5, 1.0)
    
    return data, round(epr, 4), round(risk_score, 2)
