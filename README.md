# LangChain-Legal-Document-Analyzer

## Overview

LangChain Legal Document Analyzer is a full-stack application for advanced, explainable AI-powered legal document analysis. It leverages LangChain, Anthropic Claude, and OpenAI embeddings to provide semantic search, retrieval-augmented generation (RAG), and transparent legal reasoning for contracts and agreements.

## Features

- Document upload and processing (PDF, DOCX, TXT)
- Semantic chunking and vector embeddings
- Retrieval-augmented generation (RAG) for Q&A
- Chain of reasoning and source attribution for every answer
- Confidence scoring and risk assessment
- Modern React frontend with real-time chat interface

## Tech Stack

- **Frontend:** React
- **Backend:** FastAPI, LangChain
- **LLM:** Anthropic Claude (completions)
- **Embeddings:** OpenAI (for semantic search)

## Setup Instructions

### 1. Backend

1. Clone the repository and navigate to the backend directory.
2. Create a Python virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn langchain anthropic openai python-docx textract pydantic python-dotenv
   ```
4. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   ```
5. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. Open your browser to [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## Usage

- Upload a legal document (PDF, DOCX, or TXT).
- Ask questions about clauses, risks, obligations, or any legal terms in the chat.
- The app will provide answers with source references, reasoning, and confidence scores.

## License

This project is for educational and demonstration purposes. Please review and comply with the licenses of all dependencies used.
