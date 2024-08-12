import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';

function AnalysisPayment() {
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [chartImage, setChartImage] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/prediction_data')
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setPaymentData(data);
        } else {
          setError('Invalid data format');
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (paymentData) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Valid', 'Invalid'],
          datasets: [
            {
              label: 'Payment Status',
              data: [
                paymentData.filter((item) => item.Prediction === 'valid').length,
                paymentData.filter((item) => item.Prediction === 'invalid').length,
              ],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            },
          },
        },
      });
      
      html2canvas(chartRef.current).then(canvas => {
        setChartImage(canvas.toDataURL());
      });
    }
  }, [paymentData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '700px', height: '500px', margin: '0 auto' }}>
      <h3 className='open-sans-header' style={{ textAlign: 'center', margin: '20px' }}>Payment Analysis</h3>
      <canvas id="myChart" ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
}

export default AnalysisPayment;