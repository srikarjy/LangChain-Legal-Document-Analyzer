import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './components/Chat';
import './App.css';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { FAISS } from 'langchain/vectorstores';
import { RetrievalQA } from 'langchain/chains';
import { ChatAnthropic } from 'langchain/llms';
import os from 'os';

const initialAnalysis = null;

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentEmbeddings, setDocumentEmbeddings] = useState(null);
  const [vectorStore, setVectorStore] = useState(new Map());
  const [conversationHistory, setConversationHistory] = useState([]);
  const [docId, setDocId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState({});
  const [analysis, setAnalysis] = useState(initialAnalysis);

  // Simulate the LangChain pipeline (mocked for now)
  const processDocument = async (file) => {
    setProcessing(true);
    setProcessingStep({ step: 'extract', status: 'processing' });
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setDocId(data.doc_id);
    setCurrentDocument({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    setProcessing(false);
    setProcessingStep({});
    setConversationHistory([]);
  };

  // Send chat message to backend
  const handleUserMessage = async (message) => {
    setConversationHistory((prev) => [...prev, { role: 'user', content: message }]);
    if (!docId) {
      setConversationHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Please upload a document first.' },
      ]);
      return;
    }
    setConversationHistory((prev) => [
      ...prev,
      { role: 'assistant', content: 'Processing...' },
    ]);
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, doc_id: docId }),
    });
    const data = await res.json();
    setConversationHistory((prev) =>
      prev
        .filter((msg) => msg.content !== 'Processing...')
        .concat({
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
        })
    );
  };

  // Utility and mock functions (same as in your JS class)
  function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function detectDocumentType(filename) {
    const name = filename.toLowerCase();
    if (name.includes('employment') || name.includes('job')) return 'Employment Agreement';
    if (name.includes('nda') || name.includes('confidential')) return 'Non-Disclosure Agreement';
    if (name.includes('service') || name.includes('sow')) return 'Service Agreement';
    if (name.includes('lease') || name.includes('rental')) return 'Lease Agreement';
    return 'Legal Contract';
  }
  function generateSampleContent() {
    return `EMPLOYMENT AGREEMENT\n\nThis Employment Agreement is entered into between TechCorp Inc. and John Doe.\n\n1. POSITION AND DUTIES\nEmployee shall serve as Software Engineer and perform duties as assigned.\n\n2. COMPENSATION\nEmployee shall receive a base salary of $120,000 per year.\n\n3. NON-COMPETE CLAUSE\nEmployee agrees not to compete with Company for a period of 2 years within a 50-mile radius.\n\n4. CONFIDENTIALITY\nEmployee shall maintain confidentiality of all proprietary information.\n\n5. INTELLECTUAL PROPERTY\nAll work product created during employment shall belong to Company.\n\n6. TERMINATION\nEither party may terminate this agreement with 30 days written notice.`;
  }
  function createDocumentChunks() {
    return [
      { id: 1, text: "Employment Agreement between TechCorp Inc. and John Doe for Software Engineer position", section: "Header" },
      { id: 2, text: "Base salary of $120,000 per year with standard benefits package", section: "Compensation" },
      { id: 3, text: "Non-compete clause restricting competition for 2 years within 50-mile radius", section: "Non-Compete" },
      { id: 4, text: "Confidentiality obligations for all proprietary company information", section: "Confidentiality" },
      { id: 5, text: "All intellectual property created during employment belongs to Company", section: "IP Rights" },
      { id: 6, text: "At-will termination with 30 days written notice requirement", section: "Termination" }
    ];
  }
  function createMockEmbeddings(chunks) {
    const embeddings = new Map();
    chunks.forEach(chunk => {
      embeddings.set(chunk.id, generateRandomVector(1536));
    });
    return embeddings;
  }
  function generateRandomVector(size) {
    return Array.from({ length: size }, () => Math.random() - 0.5);
  }
  function setupRetrievalChain(chunks) {
    const store = new Map();
    chunks.forEach(chunk => {
      store.set(chunk.text, {
        content: chunk.text,
        metadata: {
          section: chunk.section,
          chunk_id: chunk.id,
          relevance_score: 0
        }
      });
    });
    return store;
  }
  function generateAdvancedAnalysis() {
    return {
      documentType: "Employment Agreement",
      confidence: {
        score: 92,
        level: "high",
        sources: 6
      },
      keyFindings: [
        {
          type: "Non-Compete Clause",
          description: "Restrictive covenant with 2-year duration and 50-mile geographic scope",
          source: "Section 3, Lines 15-18",
          risk: "high",
          reasoning: "Duration exceeds typical 6-12 month standard; geographic scope may be overly broad for software engineering role"
        },
        {
          type: "Intellectual Property Assignment",
          description: "Broad assignment of all work product to employer",
          source: "Section 5, Lines 22-25",
          risk: "medium",
          reasoning: "Language may capture personal projects; lacks carve-out for pre-existing IP or inventions made on own time"
        },
        {
          type: "Termination Provisions",
          description: "At-will employment with mutual 30-day notice requirement",
          source: "Section 6, Lines 26-28",
          risk: "low",
          reasoning: "Standard termination clause; notice period provides reasonable transition time for both parties"
        }
      ],
      risks: [
        {
          category: "Enforceability Risk",
          description: "Non-compete clause may be unenforceable due to overly broad scope",
          evidence: "2 years within a 50-mile radius",
          precedent: "Similar clauses struck down in Johnson v. TechCorp (2023) for being geographically overbroad",
          recommendation: "Negotiate reduction to 12 months and 25-mile radius, or add reasonable compensation clause",
          confidence: { score: 85, level: "high" }
        },
        {
          category: "IP Ownership Risk",
          description: "Potential overreach in intellectual property assignment",
          evidence: "All work product created during employment shall belong to Company",
          precedent: "Courts require reasonable nexus to employment duties per California Labor Code §2870",
          recommendation: "Add carve-out for inventions made entirely on own time using own resources",
          confidence: { score: 78, level: "medium" }
        }
      ],
      recommendations: [
        "Request modification of non-compete duration from 24 to 12 months maximum",
        "Negotiate geographic limitation to areas where company actively competes",
        "Add carve-out language for pre-existing intellectual property",
        "Include definition of 'proprietary information' in confidentiality clause",
        "Consider adding severance provisions for involuntary termination",
        "Review benefit package details referenced in Schedule A"
      ]
    };
  }

  return (
    <div className="app-container">
      <Sidebar
        currentDocument={currentDocument}
        processing={processing}
        processingStep={processingStep}
        processDocument={processDocument}
      />
      <div className="main-content">
        <Header />
        <Chat
          currentDocument={currentDocument}
          conversationHistory={conversationHistory}
          sendMessage={handleUserMessage}
        />
      </div>
    </div>
  );
}

export default App; 