import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setMessage(errorMessage);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f4f7fb',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Don’t have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
