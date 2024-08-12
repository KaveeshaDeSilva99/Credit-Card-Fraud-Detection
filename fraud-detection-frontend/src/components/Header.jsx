import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';

function Header() {
  const userType = localStorage.getItem('user_type');
  const userName = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/logout', { withCredentials: true });
      // Redirect to the signin page after successful logout
      window.location.href = '/signin';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header style={{ backgroundColor: '#D3F4FB', padding: '10px 70px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <nav>
        <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <li style={{ marginLeft: '200px' }}>
            <Link to="/adddata" style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>Make Your Payment</Link>
          </li>
          {userType !== 'client' && (
            <Dropdown>
              <Dropdown.Toggle variant="none" style={{ color: 'black', textDecoration: 'none', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}>
                Reports
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><Link to="/report" style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>Payment Details Report</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/analysis" style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>View Status Analysis Chart</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/paymentmonth" style={{ color: 'black', textDecoration: 'none', fontSize: '18px' }}>View Monthlywise Analysis Chart</Link></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <li>
            <span style={{ color: 'black', fontSize: '18px', marginLeft: "400px" }}>Hello, {userName}</span>
          </li>
          <li>
            <Button onClick={handleLogout} variant='danger' style={{ color: 'white', textDecoration: 'none', fontSize: '18px', border: 'none', cursor: 'pointer' }}>Logout</Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;