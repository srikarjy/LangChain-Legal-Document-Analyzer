import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [docId, setDocId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState({});

  // Upload document to backend
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