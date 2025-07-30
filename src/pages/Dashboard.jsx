import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const recentBids = [
    { id: 1, title: 'Office Building Renovation', status: 'Draft', date: '2024-01-15' },
    { id: 2, title: 'Residential Complex', status: 'Submitted', date: '2024-01-10' },
    { id: 3, title: 'Shopping Center', status: 'Won', date: '2024-01-05' }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/bid-builder" className="btn btn-primary">
          Create New Bid
        </Link>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bids</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-card">
          <h3>Active Bids</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-card">
          <h3>Won Bids</h3>
          <p className="stat-number">8</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-number">67%</p>
        </div>
      </div>

      <div className="recent-bids">
        <h3>Recent Bids</h3>
        <div className="bids-list">
          {recentBids.map(bid => (
            <div key={bid.id} className="bid-item">
              <div className="bid-info">
                <h4>{bid.title}</h4>
                <p className="bid-date">{bid.date}</p>
              </div>
              <span className={`bid-status bid-status-${bid.status.toLowerCase()}`}>
                {bid.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 