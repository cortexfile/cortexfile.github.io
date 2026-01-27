import React from 'react';

// Minimal App to test if React is working at all
function App() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#2e1065', // Dark Purple to confirm update
      color: '#fff',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#4ade80' }}>✅ React is Working!</h1>
      <p style={{ fontSize: '1.5rem', color: '#ccc' }}>If you see this, the deploy pipeline is fixed.</p>
      <p style={{ marginTop: '20px', padding: '10px', border: '1px solid #333' }}>
        Next Step: We will restore the Store code piece by piece.
      </p>
    </div>
  );
}

export default App;
