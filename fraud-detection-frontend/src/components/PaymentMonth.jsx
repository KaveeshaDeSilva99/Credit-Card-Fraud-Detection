import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function PaymentMonth() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/prediction_data')
      .then((response) => {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          const paymentsByMonth = groupPaymentsByMonth(responseData);
          const labels = Object.keys(paymentsByMonth);
          const data = Object.values(paymentsByMonth).map(payments => payments.length);
          setPaymentData({ labels, data });
        } else {
          setError('Invalid data format');
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (paymentData && paymentData.labels && paymentData.data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current?.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: paymentData.labels,
            datasets: [
              {
                label: 'Monthly Payments',
                data: paymentData.data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }
  }, [paymentData]);

  const groupPaymentsByMonth = (payments) => {
    return payments.reduce((acc, payment) => {
      const saveDatetime = payment.Timestamp;
      if (saveDatetime) {
        const monthYear = saveDatetime.slice(0, 7);
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(payment);
      }
      return acc;
    }, {});
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ width: '700px', height: '500px', margin: '0 auto', marginBottom: "38px" }}>
      <h3 className='open-sans-header' style={{ textAlign: 'center', margin: '20px' }}>Monthly Payment Analysis</h3>
      <canvas id="monthlyChart" ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
}

export default PaymentMonth;