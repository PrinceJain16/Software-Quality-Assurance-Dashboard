import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '350px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Register</h2>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '15px',
              transition: '0.2s ease',
            }}
            onMouseOver={(e) => (e.target.style.background = '#1e7e34')}
            onMouseOut={(e) => (e.target.style.background = '#28a745')}
          >
            Register
          </button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
