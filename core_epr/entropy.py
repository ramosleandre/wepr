import math

def normalize_probabilities(probs):
    """
    Normalizes a list of probabilities so they sum to 1.0.
    Required because we only have the Top-K probabilities, not the full distribution.
    """
    total_p = sum(probs)
    if total_p <= 0:
        return []
    return [p / total_p for p in probs]

def calculate_shannon_entropy(probs):
    """
    Calculates Shannon Entropy for a given probability distribution.
    H = -sum(p * log(p))
    
    # I hope this is the good implementation :) (Tell me if not Charles) 
    """
    # Filter out zero probabilities to avoid math domain error
    valid_probs = [p for p in probs if p > 0]
    if not valid_probs:
        return 0.0
    return -sum(p * math.log(p) for p in valid_probs)

def calculate_max_entropy(num_candidates):
    """
    Calculates the maximum possible entropy for N candidates.
    Max entropy occurs when all probabilities are equal (1/N).
    (for normalizing the entropy for printing).
    H_max = log(N)
    """
    if num_candidates <= 1:
        return 1.0 # Avoid division by zero later
    return math.log(num_candidates)

def calculate_normalized_entropy(entropy, max_entropy):
    """
    Scales the entropy to a 0-1 range based on the maximum possible entropy.
    Useful for consistent visualization and thresholding.
    """
    if max_entropy <= 0:
        return 0.0
    return min(entropy / max_entropy, 1.0)
