import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return ( <
        Router >
        <
        div >
        <
        ToastContainer / >
        <
        Routes >
        <
        Route path = "/signup"
        element = { < Signup / > }
        /> 
        // <
        // Route path = "/login"
        // element = { < Login / > }
        // />


        <
        Route path = "/"
        element = { < Navigate to = "/login" / > }
        />

        <
        Route path = "/dashboard"
        element = { < Dashboard / > }
        /> < /
        Routes > <
        /div> < /
        Router >
    );
}

export default App;