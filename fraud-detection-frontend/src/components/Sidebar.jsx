import React from 'react';
import './Sidebar.css';
import img1 from '../components/images/logo.png'

const Sidebar = () => {
  return (
    <div className="sidebar" style={{backgroundColor: "#D3F4FB", width: "250px", marginTop: "20px"}}>
      <h2><a href='/'><img src={img1} alt=''style={{width: "100%"}}/></a></h2>
      <ul>
        <li><a href="#">Producre Alerts</a></li>
        <li><a href="#">Partner Enrollment</a></li>
        <li><a href="#">Procure Pay</a></li>
        <li><a href="#">Bidding Zone</a></li>
        <li><a href="#">Award Hub</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;