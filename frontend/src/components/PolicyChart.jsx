// src/components/PolicyChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PolicyChart({ chartData }) {
   const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Policy Impact Visualization (Example)',
      },
    },
     scales: {
      y: {
        beginAtZero: true,
        title: {
            display: true,
            text: 'Impact Score'
        }
      }
    }
  };

  return (
    <div className="mb-4 p-4 bg-light border rounded">
        <h2 className="h5 mb-3 text-center">Data Visualization</h2>
        <div className="chart-container">
             <Bar options={options} data={chartData} />
        </div>
    </div>

  );
}

export default PolicyChart;
