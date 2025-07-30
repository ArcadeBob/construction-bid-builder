import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import BidBuilder from './pages/BidBuilder'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bid-builder" element={<BidBuilder />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 