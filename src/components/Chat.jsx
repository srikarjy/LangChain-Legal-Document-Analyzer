import React, { useState } from 'react';

function Chat({ currentDocument, analysis, conversationHistory, setConversationHistory }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || !currentDocument) return;
    setConversationHistory([...conversationHistory, { role: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="chat-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', margin: 20, borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: 25, background: '#f8f9fa' }}>
        {conversationHistory.length === 0 && !currentDocument && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <p><strong>Welcome to the LangChain Legal Document Analyzer!</strong></p>
              <p>I'm powered by LangChain and designed to provide explainable AI analysis of legal documents. Here's what I can do:</p>
              <ul>
                <li>Semantic Search: Find relevant clauses using natural language</li>
                <li>Risk Assessment: Identify potential legal risks with confidence scores</li>
                <li>Source Attribution: Every answer includes specific document references</li>
                <li>Chain of Reasoning: See how I arrived at each conclusion</li>
              </ul>
              <p>Upload a legal document to get started, or try the sample contract!</p>
            </div>
          </div>
        )}
        {currentDocument && analysis && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="analysis-card">
                <h4><span className="icon">🎯</span>LangChain Analysis Complete</h4>
                <p><strong>Document Type:</strong> {analysis.documentType}</p>
                <p><strong>Confidence Score:</strong></p>
                <div className="confidence-meter" style={{ background: '#ecf0f1', borderRadius: 10, height: 8, margin: '10px 0', overflow: 'hidden' }}>
                  <div className={`confidence-fill confidence-${analysis.confidence.level}`} style={{ width: `${analysis.confidence.score}%`, height: '100%', borderRadius: 10, background: analysis.confidence.level === 'high' ? 'linear-gradient(90deg, #2ecc71, #27ae60)' : analysis.confidence.level === 'medium' ? 'linear-gradient(90deg, #f39c12, #e67e22)' : 'linear-gradient(90deg, #e74c3c, #c0392b)' }}></div>
                </div>
                <p><em>{analysis.confidence.score}% confidence based on {analysis.confidence.sources} sources</em></p>
              </div>
              <div className="analysis-card">
                <h4><span className="icon">🔍</span>Key Findings (Chain of Reasoning)</h4>
                {analysis.keyFindings.map((finding, idx) => (
                  <div key={idx} style={{ margin: '15px 0', padding: 15, background: '#f8f9fa', borderRadius: 8 }}>
                    <p><strong>{finding.type}:</strong> {finding.description}</p>
                    <p><strong>Source:</strong> <span className="clause-highlight">{finding.source}</span></p>
                    <p><strong>Risk Level:</strong> <span className={`risk-badge risk-${finding.risk}`}>{finding.risk}</span></p>
                    <p><strong>Reasoning:</strong> <em>{finding.reasoning}</em></p>
                  </div>
                ))}
              </div>
              <div className="analysis-card">
                <h4><span className="icon">💡</span>LangChain Recommendations</h4>
                <ul style={{ margin: '10px 0', paddingLeft: 20 }}>
                  {analysis.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
                </ul>
                <p><em>Recommendations generated using retrieval-augmented generation from legal knowledge base</em></p>
              </div>
            </div>
          </div>
        )}
        {/* User and assistant messages would go here in a real chat */}
      </div>
      <div className="input-section" style={{ padding: 25, borderTop: '1px solid #e1e8ed', background: 'white' }}>
        <div className="input-container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            className="message-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about clauses, risks, obligations, or any legal terms..."
            disabled={!currentDocument}
            style={{ flex: 1, padding: '14px 20px', border: '2px solid #e1e8ed', borderRadius: 25, fontSize: '1em', background: '#f8f9fa' }}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!currentDocument}
            style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: 25, fontSize: '1em', fontWeight: 600 }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat; 