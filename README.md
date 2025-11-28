# WEPR - Hallucination Detection System

A research implementation of **Entropy Production Rate (EPR)** for detecting hallucinations in Large Language Models (LLMs). This tool visualizes the uncertainty of the model at the token level, helping to identify potential fabrication or reasoning errors.

## 🚀 Features

*   **Real-time Entropy Visualization**: See the model's uncertainty for every generated token.
*   **Interactive Charts**: Explore the entropy flow and token probability distribution.
*   **Risk Scoring**: Automatic classification of tokens as Low, Medium, or High risk.
*   **Generation Control**: Adjust Temperature, Top-K, and Seed to experiment with model behavior.
*   **Modular Architecture**: Clean separation between the Flask backend and the core algorithmic logic.

## 🛠️ Prerequisites

*   **Python 3.8+**
*   **Node.js 16+** (for the frontend)
*   **Ollama** (running locally)

## 📦 Installation & Setup

### 1. Setup Ollama (The LLM Engine)

1.  Download and install Ollama from [ollama.com](https://ollama.com).
2.  Start the Ollama server (usually runs in the background).
3.  Pull a model (i use `cas/ministral-8b-instruct-2410_q4km`):
    ```bash
    ollama pull cas/ministral-8b-instruct-2410_q4km
    ```
    *Note: You can configure available models in `models_config.py`.*


### 2. Setup Backend (Python/Flask)

1.  Clone the repository and navigate to the root:
    ```bash
    cd wepr
    ```
2.  Install Python dependencies:
    ```bash
    pip install flask flask-cors requests
    ```
3.  Start the backend server:
    ```bash
    python3 app.py
    ```
    *The server will start on `http://127.0.0.1:5001`.*

### 3. Setup Frontend (React/Vite)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The app will open at `http://localhost:5173`.*

## 🖥️ Usage

1.  Open your browser at `http://localhost:5173`.
2.  Select a model from the dropdown (top right).
3.  (Optional) Click the **Settings** icon to adjust Temperature or Top-K.
4.  Type a prompt and hit Enter.
5.  **Analyze the results**:
    *   **Green tokens**: The model is confident.
    *   **Red tokens**: The model is uncertain (High Entropy).
    *   Click on any token to see the **Top-20 candidates** and their probabilities.

## 📂 Project Structure

*   `app.py`: The Flask API entry point.
*   `core_epr/`: Contains the core logic.
    *   `client.py`: Handles communication with Ollama.
    *   `entropy.py`: Mathematical functions (Shannon Entropy, Normalization).
    *   `processing.py`: Data pipeline and risk calculation.
*   `frontend/`: The React application.

## 📚 References

Based on the research paper: *"Entropy-based Hallucination Detection"* (arXiv:2509.04492).

> **Note**: If you are here Charles, I hope it's clear for you!
