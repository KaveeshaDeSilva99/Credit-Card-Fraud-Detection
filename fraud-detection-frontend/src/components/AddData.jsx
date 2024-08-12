import React, { useState } from 'react';
import axios from 'axios';
import TenderForm from './TenderForm';
import PaymentForm from './PaymentForm';

const AddData = () => {
  const [formData, setFormData] = useState({
    NIC: '',
    'Bank account number': 0,
    'Credit card number': '',
    'Company name': '',
    'Company address': '',
    'Company contact': '',
    'Company registration': '',
    'Tender reference number': '',
    'Tender title': '',
    'Tender instructions': '',
    'Bidder name': '',
    'Bidder position': '',
    'Bidder contact': '',
    'Bid price': '',
    'References': ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Bank account number' && isNaN(value)) {
      // If the entered value is not numeric, do not update the state
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/predict', formData);
      // show a success message or redirect the user
      console.log('Data added successfully');
    } catch (error) {
      // show an error message to the user
      console.error('Error adding data:', error);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      {currentStep === 1 && (
        <TenderForm formData={formData} handleChange={handleChange} nextStep={nextStep} bidPrice={formData['Bid price']} />

      )}
      {currentStep === 2 && (
        <PaymentForm
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

export default AddData;