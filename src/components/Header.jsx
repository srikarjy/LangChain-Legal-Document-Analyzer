import React from 'react';

function Header() {
  return (
    <div className="header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <h1 style={{ fontSize: '1.8em', fontWeight: 600, marginBottom: 8 }}>LangChain Legal Document Analyzer</h1>
      <p style={{ opacity: 0.9, fontSize: '1em' }}>AI-powered contract analysis with explainable reasoning and source attribution</p>
    </div>
  );
}

export default Header; 