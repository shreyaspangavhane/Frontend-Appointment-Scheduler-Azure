import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setMessage(res.data.message || 'Signup successful');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setMessage(errorMessage);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Sign Up</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
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
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
      </form>

       <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Log In</Link>
        </p>
    </div>
  );
};

export default Signup;


