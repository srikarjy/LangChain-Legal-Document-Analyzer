import React, { useRef } from 'react';

function Sidebar({ currentDocument, processing, processingStep, processDocument }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processDocument(e.target.files[0]);
    }
  };

  const handleSample = () => {
    // Simulate a sample file
    const sampleFile = new File(['sample'], 'Sample_Employment_Contract.pdf', { type: 'application/pdf' });
    processDocument(sampleFile);
  };

  return (
    <div className="sidebar">
      <div className="logo" style={{ fontSize: '2em', marginBottom: 20, textAlign: 'center' }}>🔗⚖️</div>
      <h2>LangChain Legal AI</h2>
      <div className="upload-section" style={{ marginBottom: 25, padding: 25, textAlign: 'center', border: '2px dashed #fff3', borderRadius: 15 }}>
        <div className="upload-icon" style={{ fontSize: '2.5em', marginBottom: 15 }}>📄</div>
        <h3>Upload Document</h3>
        <p>Drop your legal document here</p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        <button className="upload-btn" onClick={() => fileInputRef.current.click()} style={{ margin: 5 }}>Choose File</button>
        <button className="sample-btn" onClick={handleSample} style={{ margin: 5 }}>Try Sample</button>
      </div>
      {/* Document Info */}
      {currentDocument && (
        <div className="document-info" style={{ background: '#fff1', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h3>📋 Document Info</h3>
          <div className="info-item"><span className="info-label">Name:</span> <span className="info-value">{currentDocument.name}</span></div>
          <div className="info-item"><span className="info-label">Type:</span> <span className="info-value">{currentDocument.type}</span></div>
          <div className="info-item"><span className="info-label">Size:</span> <span className="info-value">{currentDocument.size}</span></div>
          <div className="info-item"><span className="info-label">Pages:</span> <span className="info-value">{currentDocument.pages}</span></div>
        </div>
      )}
      {/* Processing Status */}
      {processing && (
        <div className="processing-status" style={{ background: '#fff1', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h3>🔄 AI Processing</h3>
          <div className="status-item"><span className="status-icon">{processingStep.step === 'extract' ? (processingStep.status === 'complete' ? '✅' : '🔄') : '⏳'}</span> Text Extraction</div>
          <div className="status-item"><span className="status-icon">{processingStep.step === 'embed' ? (processingStep.status === 'complete' ? '✅' : '🔄') : '⏳'}</span> Creating Embeddings</div>
          <div className="status-item"><span className="status-icon">{processingStep.step === 'chain' ? (processingStep.status === 'complete' ? '✅' : '🔄') : '⏳'}</span> Building LangChain</div>
          <div className="status-item"><span className="status-icon">{processingStep.step === 'analysis' ? (processingStep.status === 'complete' ? '✅' : '🔄') : '⏳'}</span> Legal Analysis</div>
        </div>
      )}
      {/* LangChain Features */}
      <div className="langchain-info" style={{ background: '#fff1', borderRadius: 12, padding: 20, marginTop: 20 }}>
        <h3><span className="icon">🔗</span>LangChain Features</h3>
        <ul className="feature-list" style={{ listStyle: 'none', padding: 0 }}>
          <li>Document Loading & Chunking</li>
          <li>Vector Embeddings (OpenAI)</li>
          <li>Retrieval-Augmented Generation</li>
          <li>Chain of Thought Reasoning</li>
          <li>Source Attribution</li>
          <li>Confidence Scoring</li>
          <li>Memory Management</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar; 