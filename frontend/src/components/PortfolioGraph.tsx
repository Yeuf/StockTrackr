import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type MonthlyPerformance = {
    value: number;
    capital_gain: number;
    performance: number;
    month: number;
    year: number;
  };

function PortfolioGraph() {
    const { id } = useParams<{ id: string }>();
    const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);

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
    <div className="flex justify-center">
      <div className="w-full lg:w-4/5 xl:w-3/4">
        <h2>Monthly Capital Gain Graph</h2>
        <ResponsiveContainer width="95%" height={400}>
          <AreaChart data={monthlyPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="capital_gain" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PortfolioGraph;