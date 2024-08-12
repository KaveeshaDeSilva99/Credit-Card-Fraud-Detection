import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './GetAllData.css'; 


const ITEMS_PER_PAGE = 4; 
const GetAllData = () => {
  const [predictionData, setPredictionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/prediction_data');
        const data = await response.json();
        setPredictionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data when searchQuery or predictionData changes
    console.log('predictionData:', predictionData); // Log predictionData to check its structure
    const filtered = predictionData.filter(item => {
      return (item['Bank Account Number'] && item['Bank Account Number'].toLowerCase().includes(searchQuery.toLowerCase())) ||
             (item['NIC'] && item['NIC'].toLowerCase().includes(searchQuery.toLowerCase()));
    }); 
    // Log filtered data to check the result   
    console.log('filtered:', filtered); 
    setFilteredData(filtered);
  }, [searchQuery, predictionData]);    

  const getStatusIcon = (status) => {
    return status === 'valid' ? <FontAwesomeIcon icon={faCheckCircle} className="valid-icon" /> : <FontAwesomeIcon icon={faTimesCircle} className="invalid-icon" />;
  };

  // Pagination handlers
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const slicedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="table-container">
      <h3 className='open-sans-header'>All Payment Details</h3>
      <Form.Control
        type="text"
        style={{width: "50%", margin: "17px"}}
        placeholder="Search NIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Credit card number</th>
            <th>Bank account number</th>
            <th>NIC</th>
            <th>Other Details</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((item) => (
            <tr key={item._id}>
              <td>{item['Credit card number']}</td>
              <td>{item['Bank account number']}</td>
              <td>{item.NIC}</td>
              <td>
                
                <Table striped bordered hover style={{fontSize: "13px"}}>
                  <tbody>
                   
                    {Object.entries({...item['Full Data'], ...item['Additional Data']}).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>{new Date(item.Timestamp).toLocaleString()}</td>
              <td>{getStatusIcon(item.Prediction)}</td> 
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default GetAllData;