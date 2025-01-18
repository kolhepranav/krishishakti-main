


'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Use dynamic import for the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false // Disable server-side rendering for this component
});

const ApexChart = () => {
  const [series, setSeries] = useState([]);
  const [dates, setDates] = useState([]);
  const [weatherConditions, setWeatherConditions] = useState([]); // New state for weather conditions
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiKey = 'a0b73e6fafad9a43b85ff5bf3ef7caba'; // Replace with your API key
      const city = 'Pune,IN';
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
      try {
        const forecastResponse = await axios.get(forecastUrl);
        const forecastData = forecastResponse.data.list;
  

        // console.log(forecastResponse.data);

        // Create dates for the graph (current date and next 4 days)
        const today = new Date();
        const days = [];
        for (let i = 0; i < 5; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0]; // Get only the date part
          days.push(formattedDate);
        }
        setDates(days);
  
        // Initialize data arrays
        const tempData = Array(5).fill(0);
        const humidityData = Array(5).fill(0);
        const windSpeedData = Array(5).fill(0);
        const precipitationData = Array(5).fill(0);
        const conditions = Array(5).fill(''); // Initialize weather conditions
  
        // Count occurrences to avoid division by zero later
        const counts = Array(5).fill(0); 
  
        // Process forecast data for the next 5 days
        forecastData.forEach(item => {
          const dateText = item.dt_txt.split(' ')[0]; // Get date part from timestamp
          const index = days.indexOf(dateText); // Find index in days array
  
          if (index !== -1) { // Only push data for matching dates
            // Aggregate values
            tempData[index] += item.main.temp || 0; 
            humidityData[index] += item.main.humidity || 0;
            windSpeedData[index] += item.wind.speed || 0;
            precipitationData[index] += item.pop ? item.pop * 100 : 0;
  
            // Store the description directly in the conditions array
            if (item.weather.length > 0) {
              conditions[index] = item.weather[0].description || ''; // Use the actual description
            }
  
            // Increment count for averaging later
            counts[index]++;
          }
        });

        // console.log(conditions);

  
        // Set the series, averaging only if there are counts
        setSeries([
          { name: "Temperature (°C)", data: tempData.map((v, i) => counts[i] ? v / counts[i] : 0) },
          { name: "Humidity (%)", data: humidityData.map((v, i) => counts[i] ? v / counts[i] : 0) },
          { name: "Wind Speed (km/h)", data: windSpeedData.map((v, i) => counts[i] ? v / counts[i] : 0) },
          { name: "Precipitation (%)", data: precipitationData.map((v, i) => counts[i] ? v / counts[i] : 0) },
          // { name: "Weather Description", data: conditions }
        ]);
  
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetching is complete
      }
    };
  
    fetchWeatherData();
  }, []);
  





  
  const options = {
    chart: {
      height: 510,
      type: 'line',
      zoom: { enabled: true, type: 'x' }, // Enable zoom functionality
      background: '#eaf8e3' // Light background color
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    title: {
      text: '',
      align: 'left',
      margin: 28,
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333'
        
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
      borderColor: '#e0e0e0'
    },
    xaxis: {
      categories: dates.length > 0 ? dates.map(date => date.split('-').reverse().join('/')) : [],
      title: { text: 'Date' },
      labels: {
        rotate: -45, // Rotate labels to avoid overlap
        style: {
          fontSize: '12px',
          colors: ['#333']
        }
      },
      tickAmount: 5, // Limit the number of ticks on the x-axis
    },
    yaxis: [
      { 
        // title: { text: 'Temperature (°C) / Humidity (%)' },
        labels: {
          formatter: (value) => Math.round(value),
          style: {
            colors: ['#FF5733', '#007BFF']
          }
        }
      },
      { 
        opposite: true, 
        // title: { text: 'Wind Speed (km/h) / Precipitation (%)' },
        labels: {
          formatter: (value) => Math.round(value),
          style: {
            colors: ['#28A745', '#FFC107']
          }
        }
      },
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      labels: {
        colors: ['#333'],
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px'
      },
      formatter: function (val) {
        let tooltipHtml = `<strong>${this.x}</strong><br>`;
        const dateIndex = dates.indexOf(this.x.split('/').reverse().join('-'));
        if (dateIndex !== -1) {
          tooltipHtml += `Weather: ${weatherConditions[dateIndex]}<br>`;
        }
        this.series.forEach((series, index) => {
          tooltipHtml += `<strong>${series.name}:</strong> ${val[index]}<br>`;
        });
        return tooltipHtml;
      },
    },
  };
  

  return (
    <div
      style={{
        borderRadius: '15px', // Rounded corners
        overflow: 'hidden',    // Ensures rounded corners are applied cleanly
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow for depth
        padding: '20px',       // Optional padding inside the chart container
        backgroundColor: '#eaf8e3' // Optional background color
      }}
    >
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading...</p>
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={310} />
      )}
    </div>
  );
};
export default ApexChart;
