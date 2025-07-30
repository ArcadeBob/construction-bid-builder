import React, { useState } from 'react'
import '../styles/BidBuilder.css'

const BidBuilder = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    projectType: '',
    estimatedCost: '',
    timeline: '',
    description: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Bid submitted:', formData)
    // TODO: Implement bid submission logic
  }

  return (
    <div className="bid-builder">
      <div className="bid-builder-header">
        <h2>Create New Bid</h2>
        <p>Fill out the form below to create a new bid proposal</p>
      </div>

      <form className="bid-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectType">Project Type</label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select project type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="renovation">Renovation</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estimatedCost">Estimated Cost ($)</label>
          <input
            type="number"
            id="estimatedCost"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeline">Timeline (weeks)</label>
          <input
            type="number"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary">
            Save Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Bid
          </button>
        </div>
      </form>
    </div>
  )
}

export default BidBuilder 