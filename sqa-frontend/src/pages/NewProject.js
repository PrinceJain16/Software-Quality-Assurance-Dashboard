import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NewProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    technologies: '',
    teamMembers: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      alert('Project created successfully!');
      navigate('/projects');
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f2f6d6ff 0%, #d2ebf8ff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px 40px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333',
          }}
        >
          Create New Project
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <label style={{ fontWeight: 'bold' }}>Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            required
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Project Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              minHeight: '80px',
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <label style={{ fontWeight: 'bold' }}>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Technologies (comma-separated)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Team Members (comma-separated)</label>
          <input
            type="text"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            placeholder="e.g. Prince, Ravi, Sneha"
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <button
            type="submit"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.background = '#218838')}
            onMouseOut={(e) => (e.target.style.background = '#28a745')}
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}
