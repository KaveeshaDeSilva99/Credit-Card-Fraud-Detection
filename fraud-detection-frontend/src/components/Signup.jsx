
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Signup.css'; 
import img1 from '../components/images/logo.png'

const Signup = ({ history }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        user_type: 'client' // Default usertype = client
    });

    const { username, password, user_type } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/signup', formData);
            if (res && res.data) { 
                console.log(res.data); 
                window.location.href='/'
            } else {
                console.error('Response or response data is undefined');
            }
        } catch (err) {
            console.error(err.response.data);
        }
    };    

    return (
        <div className="signup-container"> 
            <h2>Sign Up</h2>
            <img src={img1} alt='' style={{width: "100%"}}/>
            <form onSubmit={onSubmit} className="signup-form"> 
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <select name="user_type" value={user_type} onChange={onChange} className="user-type-dropdown">
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" className="signup-button">Sign Up</button> 
            </form>
            <p className="signin-link">Already have an account? <Link to="/signin">Sign in</Link></p> 
        </div>
    );
};

export default Signup;