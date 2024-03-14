import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type MonthlyPerformance = {
    value: number;
    capital_gain: number;
    performance: number;
    month: number;
    year: number;
  };

function PortfolioGraph() {
    const { id } = useParams<{ id: string }>();
    const [monthlyperformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);

    useEffect(() => {
        fetchMonthlyPerformance();
    }, []);



const fetchMonthlyPerformance = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/portfolio/investments/${id}/monthly_performance_by_portfolio/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('_auth')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch holdings');
      }
      const data: MonthlyPerformance[] = await response.json();
      data.sort((a, b) => a.year - b.year || a.month - b.month);
      setMonthlyPerformance(data);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  };
  return (
    <div>
      <h2>Monthly Performance Graph</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={monthlyperformance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          {/* <Line type="monotone" dataKey="capital_gain" stroke="#82ca9d" /> */}
          {/* <Line type="monotone" dataKey="performance" stroke="#ffc658" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioGraph;