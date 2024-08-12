import React from 'react';
import AppRouter from './router';
import './App.css';

function App() {
  return (
    <div className='app'>
    <div className="frame">
      <div className="main-content">
        <AppRouter/>
      </div>
    </div>
    </div>
  );
}

export default App;