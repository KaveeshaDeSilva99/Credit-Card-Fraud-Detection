import React, { useState } from 'react';
import { Form, Button, Row, Col, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import img3 from '../components/images/payment3.jpg'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51P8umyBxihc4xLBtZtdhOFr0mWN8EMzjmpoTsKk7hymPWBM6UCk8HNwPUR4JXlnYF7YhzdQYlezf7OzbOvfle3a400U2YX5zy2');

const PaymentForm = ({ formData, handleChange, bidPrice }) => {
  const [showValidToast, setShowValidToast] = useState(false);
  const [showInvalidToast, setShowInvalidToast] = useState(false);
  const [amount, setAmount] = useState(bidPrice || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nicRegex = /^\d{9}(v|\d)$/;
    const creditCardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;

    if (!nicRegex.test(formData.NIC) || !creditCardRegex.test(formData['Credit card number'])) {
      setShowInvalidToast(true);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      const predictionResult = response.data.prediction;

      if (predictionResult === 'valid') {
        const stripe = await stripePromise;
        const sessionResponse = await axios.post('http://127.0.0.1:5000/create-checkout-session', {
          amount: parseInt(amount) * 100,  
        });
        const sessionId = sessionResponse.data.id;

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Stripe checkout error:', error);
          setShowInvalidToast(true);
        }
      } else {
        setShowInvalidToast(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setShowInvalidToast(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div>
      <h2>Payment Details</h2>
      <Toast show={showValidToast} onClose={() => setShowValidToast(false)} bg="success" text="white">
        <Toast.Header>
          <strong className="me-auto">Valid</strong>
        </Toast.Header>
        <Toast.Body className="text-center">Payment submitted successfully.</Toast.Body>
      </Toast>

      <Toast show={showInvalidToast} onClose={() => setShowInvalidToast(false)} bg="danger" text="white">
        <Toast.Header>
          <strong className="me-auto">Invalid</strong>
        </Toast.Header>
        <Toast.Body className="text-center">Invalid input. Please check your details and try again.</Toast.Body>
      </Toast>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className="d-flex justify-content-center">
            <img src={img3} alt="Payment Details" style={{ margin: "40px", width: "20%" }} />
          </Col>
        </Row>
        <Form.Group controlId="NIC">
          <Form.Label>NIC</Form.Label>
          <Form.Control
            type="text"
            name="NIC"
            placeholder="Enter NIC"
            value={formData.NIC}
            onChange={handleChange}
            isInvalid={!/^\d{9}(v|\d)$/.test(formData.NIC)}
          />
          <Form.Control.Feedback type="invalid">Please provide a valid NIC.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="BankAccountNumber">
          <Form.Label>Bank account number</Form.Label>
          <Form.Control
            type="number"
            name="Bank account number"
            placeholder="Enter bank account number"
            value={formData['Bank account number']}
            onChange={(e) => handleChange({
              target: {
                name: e.target.name,
                value: parseInt(e.target.value) || '' 
              }
            })}
          />
        </Form.Group>

        <Form.Group controlId="CreditCardNumber">
          <Form.Label>Credit card number</Form.Label>
          <Form.Control
            type="text"
            name="Credit card number"
            placeholder="Enter credit card number"
            value={formData['Credit card number']}
            onChange={handleChange}
            isInvalid={!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData['Credit card number'])}
          />
          <Form.Control.Feedback type="invalid">Please provide a valid credit card number.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="Amount">
          <Form.Label>Re enter bide price</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ margin: "20px" }}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PaymentForm;