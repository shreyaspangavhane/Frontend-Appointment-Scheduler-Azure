import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    service: '',
    appointment_date: '',
    appointment_time: ''
  });

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    window.location.href = '/login';
  };

  const fetchAppointments = async () => {
    if (!token) {
      toast.error('Please login to view appointments.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = res.data.appointments.map(a => ({ ...a, newDate: '', newTime: '' }));
      setAppointments(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setNewAppointment(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/appointments/book',
        newAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || 'Appointment booked');
      setNewAppointment({ service: '', appointment_date: '', appointment_time: '' });
      fetchAppointments();

      setTimeout(() => {
        toast.info('⏰ Reminder: You have an appointment soon!');
      }, 10000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || 'Appointment canceled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const handleReschedule = async (id, newDate, newTime) => {
    if (!newDate || !newTime) {
      toast.error('Please enter both date and time');
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        { appointment_date: newDate, appointment_time: newTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || 'Appointment rescheduled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rescheduling failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Welcome, {username} 👋</h2>
        </div>
        <hr />

        <h3>📅 Book Appointment</h3>
        <form onSubmit={handleBook} className="book-form">
          <select name="service" value={newAppointment.service} onChange={handleChange} required>
            <option value="">Select Service</option>
            <option value="Consultation">Consultation</option>
            <option value="Haircut">Haircut</option>
            <option value="Dental Checkup">Dental Checkup</option>
          </select>

          <input
            type="date"
            name="appointment_date"
            value={newAppointment.appointment_date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointment_time"
            value={newAppointment.appointment_time}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-book">Book</button>
        </form>

        <h3>📌 My Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="appointment-list">
            {appointments.map((a) => (
              <li key={a.id} className="appointment-item">
                <div className="appointment-card">
                  <strong>Service:</strong> {a.service}<br />
                  <strong>Date:</strong> {a.appointment_date}<br />
                  <strong>Time:</strong> {a.appointment_time}
                  <br /><br />

                  <button onClick={() => handleCancel(a.id)} className="btn btn-cancel">
                    Cancel
                  </button>

                  <input
                    type="date"
                    value={a.newDate}
                    onChange={(e) =>
                      setAppointments(prev =>
                        prev.map(item =>
                          item.id === a.id ? { ...item, newDate: e.target.value } : item
                        )
                      )
                    }
                  />
                  <input
                    type="time"
                    value={a.newTime}
                    onChange={(e) =>
                      setAppointments(prev =>
                        prev.map(item =>
                          item.id === a.id ? { ...item, newTime: e.target.value } : item
                        )
                      )
                    }
                  />
                  <button
                    onClick={() => handleReschedule(a.id, a.newDate, a.newTime)}
                    className="btn btn-reschedule"
                  >
                    Reschedule
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Dashboard;
