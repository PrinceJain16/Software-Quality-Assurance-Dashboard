import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #9fc1f4ff 0%, #8e8e8fff 100%)',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            position: 'absolute',
            top: '20px',
            right:'30px',
            // left: '0px',
            padding: '10px 18px',
            background: '#f81d09ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
            transition: '0.2s',
          }}
          onMouseOver={e => (e.target.style.background = '#eb5c0fff')}
          onMouseOut={e => (e.target.style.background = '#f81d09ff')}
        >
          LogOut
        </button>

        <h1 style={{ textAlign: 'center', color: '#333' }}>
          Welcome, {user?.name || 'User'}
        </h1>
        <h3 style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
          Your Projects
        </h3>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>
            No projects yet. Click below to add one.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {projects.map((p) => (
              <div
                key={p._id}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'translateY(-5px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <div
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  <h3 style={{ marginBottom: '10px', color: '#007bff' }}>
                    {p.name}
                  </h3>
                  <p style={{ margin: 0, color: '#555', fontSize: '0.95em' }}>
                    {p.description || 'No description available.'}
                  </p>
                </div>

                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                  <button
                    style={{
                      marginRight: '8px',
                      padding: '6px 12px',
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onMouseOver={(e) => (e.target.style.background = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.background = '#007bff')}
                    onClick={() => navigate(`/projects/${p._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      padding: '6px 12px',
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onMouseOver={(e) => (e.target.style.background = '#b02a37')}
                    onMouseOut={(e) => (e.target.style.background = '#dc3545')}
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => (e.target.style.background = '#1e7e34')}
            onMouseOut={(e) => (e.target.style.background = '#28a745')}
            onClick={() => navigate('/projects/new')}
          >
            + Add New Project
          </button>
        </div>
      </div>
    </div>
  );
}
