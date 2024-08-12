import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import img2 from '../components/images/image2.jpg'

const TenderForm = ({ formData, handleChange, nextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation assume all fields are required
    if (value.trim() === '') {
      alert(`${name} is required.`);
      return;
    }

    handleChange(e);
  };

  return (
    <div>
      <h2>Tender Details</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className="d-flex justify-content-center">
            <img
              src={img2}
              alt=''
              style={{ margin: "40px", width: "50%" }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="CompanyName">
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type="text"
                name="Company name"
                placeholder="Enter company name"
                value={formData['Company name']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="CompanyAddress">
              <Form.Label>Company address</Form.Label>
              <Form.Control
                type="text"
                name="Company address"
                placeholder="Enter company address"
                value={formData['Company address']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="CompanyContact">
              <Form.Label>Company contact</Form.Label>
              <Form.Control
                type="text"
                name="Company contact"
                placeholder="Enter company contact"
                value={formData['Company contact']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="CompanyRegistration">
              <Form.Label>Company registration</Form.Label>
              <Form.Control
                type="text"
                name="Company registration"
                placeholder="Enter company registration"
                value={formData['Company registration']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="TenderReferenceNumber">
              <Form.Label>Tender reference number</Form.Label>
              <Form.Control
                type="text"
                name="Tender reference number"
                placeholder="Enter tender reference number"
                value={formData['Tender reference number']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="TenderTitle">
              <Form.Label>Tender title</Form.Label>
              <Form.Control
                type="text"
                name="Tender title"
                placeholder="Enter tender title"
                value={formData['Tender title']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="TenderInstructions">
              <Form.Label>Tender instructions</Form.Label>
              <Form.Control
                type="text"
                name="Tender instructions"
                placeholder="Enter tender instructions"
                value={formData['Tender instructions']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="BidderName">
              <Form.Label>Bidder name</Form.Label>
              <Form.Control
                type="text"
                name="Bidder name"
                placeholder="Enter bidder name"
                value={formData['Bidder name']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="BidderPosition">
              <Form.Label>Bidder position</Form.Label>
              <Form.Control
                type="text"
                name="Bidder position"
                placeholder="Enter bidder position"
                value={formData['Bidder position']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="BidderContact">
              <Form.Label>Bidder contact</Form.Label>
              <Form.Control
                type="text"
                name="Bidder contact"
                placeholder="Enter bidder contact"
                value={formData['Bidder contact']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="BidPrice">
              <Form.Label>Bid price</Form.Label>
              <Form.Control
                type="text"
                name="Bid price"
                placeholder="Enter bid price"
                value={formData['Bid price']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="References">
              <Form.Label>References</Form.Label>
              <Form.Control
                type="text"
                name="References"
                placeholder="Enter references"
                value={formData['References']}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" style={{margin: "20px"}}>
          Next
        </Button>
      </Form>
    </div>
  );
};

export default TenderForm;