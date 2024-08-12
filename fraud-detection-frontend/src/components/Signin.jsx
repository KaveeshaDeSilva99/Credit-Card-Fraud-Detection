import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Signin.css'; 
import img1 from '../components/images/logo.png'

const Signin = ({ history }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', formData);
            console.log("Response:", res); 
            if (res && res.data) {
                console.log("Response Data:", res.data); 
                console.log("Login successful.");
                
                // Save username and user_type to local storage
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('user_type', res.data.user_type);

                // Redirect to the home page
                window.location.href='/'
            } else {
                console.error('Response or response data is undefined');
            }
        } catch (err) {
            console.error("Error:", err); 
            console.error("Error Response Data:", err.response.data); 
            alert('Invalid username or password');
        }
    };     

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            <img src={img1} alt='' style={{width: "100%"}}/>
            <form onSubmit={onSubmit} className="signin-form">
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit" className="signin-button">Sign In</button>
            </form>
            <p className="signup-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    );
};

export default Signin;