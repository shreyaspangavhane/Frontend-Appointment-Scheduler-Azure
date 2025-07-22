import React, { useEffect, useState, useCallback } from 'react';
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

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('username');
  //   toast.success('Logged out successfully!');
  //   window.location.href = '/login';
  // };

  const fetchAppointments = useCallback(async () => {
    if (!token) {
      toast.error('Please login to view appointments.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      toast.error('Failed to load appointments');
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
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
      toast.success(res.data.message);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const handleReschedule = async (id, newDate, newTime) => {
    if (!newDate || !newTime) {
      toast.error('Please enter both date and time to reschedule');
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
      toast.success(res.data.message);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rescheduling failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fdfdfd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Welcome, {username} 👋</h2>
          {/* <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px' }}>
            Logout
          </button> */}
        </div>
        <hr/>

        <h3 style={{ marginTop: '20px' }}>📅 Book Appointment</h3>
        <form onSubmit={handleBook} style={{ marginBottom: '20px' }}>
          <select
            name="service"
            value={newAppointment.service}
            onChange={handleChange}
            required
            style={{ padding: '6px', marginRight: '10px' }}
          >
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
            style={{ padding: '6px', marginRight: '10px' }}
          />

          <input
            type="time"
            name="appointment_time"
            value={newAppointment.appointment_time}
            onChange={handleChange}
            required
            style={{ padding: '6px', marginRight: '10px' }}
          />

          <button
            type="submit"
            style={{
              padding: '6px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Book
          </button>
        </form>

        <h3>📌 My Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {appointments.map((a) => (
              <li key={a.id} style={{ marginBottom: '15px' }}>
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <strong>Service:</strong> {a.service}<br />
                  <strong>Date:</strong> {a.appointment_date}<br />
                  <strong>Time:</strong> {a.appointment_time}
                  <br /><br />

                  <button onClick={() => handleCancel(a.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', marginRight: '10px' }}>
                    Cancel
                  </button>

                  <input
                    type="date"
                    placeholder="New Date"
                    onChange={(e) =>
                      setAppointments((prev) =>
                        prev.map((item) =>
                          item.id === a.id ? { ...item, newDate: e.target.value } : item
                        )
                      )
                    }
                    style={{ marginRight: '5px', padding: '4px' }}
                  />
                  <input
                    type="time"
                    placeholder="New Time"
                    onChange={(e) =>
                      setAppointments((prev) =>
                        prev.map((item) =>
                          item.id === a.id ? { ...item, newTime: e.target.value } : item
                        )
                      )
                    }
                    style={{ marginRight: '5px', padding: '4px' }}
                  />

                  <button onClick={() => handleReschedule(a.id, a.newDate, a.newTime)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px' }}>
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
