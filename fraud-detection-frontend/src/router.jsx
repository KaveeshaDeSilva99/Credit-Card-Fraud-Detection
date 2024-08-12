import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetAllData from './components/GetAllData';
import AddData from './components/AddData';
import AnalysPayment from './components/AnalysPayment';
import PaymentMonth from './components/PaymentMonth';
import ReportDetails from './components/ReportDetails';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Header from './components/Header'; // Import the Header component
import Sidebar from './components/Sidebar'; // Import the Sidebar component

function AppRouter() {
  const excludeHeaderRoutes = ['/signup', '/signin']; // Routes where header should not be included
  const excludeSidebarRoutes = ['/signup', '/signin']; // Routes where sidebar should not be included

  const username = localStorage.getItem('username');
  const user_type = localStorage.getItem('user_type');

  return (
    <Router>
      <div>
        {/* Conditionally render the Header component */}
        {excludeHeaderRoutes.includes(window.location.pathname) ? null : <Header username={username} user_type={user_type} />}
        
        <div className="app-container">
          {/* Conditionally render the Sidebar component */}
          {excludeSidebarRoutes.includes(window.location.pathname) ? null : <Sidebar />}
          
          <div className="main-content">
            <Routes>
              <Route path="/getdata" element={<GetAllData />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<AnalysPayment />} />
              <Route path="/paymentmonth" element={<PaymentMonth />} />
              <Route path="/report" element={<ReportDetails />} />
              {/* Route for AddData only if usertype is client */}
              <Route
                path="/adddata"
                element={<AddData />}
              />
            </Routes>
          </div>
        </div>
        {/* {excludeFooterRoutes.includes(window.location.pathname) ? null : <Footer/>} */}
      </div>
    </Router>
  );
}

export default AppRouter;