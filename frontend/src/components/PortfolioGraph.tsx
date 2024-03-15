import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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
    const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        fetchMonthlyPerformance();
    }, []);

    useEffect(() => {
      if (monthlyPerformance.length > 0) {
        const min = Math.min(...monthlyPerformance.map(item => item.value));
        const max = Math.max(...monthlyPerformance.map(item => item.value));
        const maxYAxisValue = max + 50;
        setYAxisDomain([min, maxYAxisValue]);
      }
    }, [monthlyPerformance]);



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
        <h2 className="mb-4 text-center">Monthly Capital Gain Graph</h2>
        <ResponsiveContainer width="95%" height={400}>
          <AreaChart data={monthlyPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={yAxisDomain} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="capital_gain" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="value" stroke="#7899d4" fill="#7899d4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PortfolioGraph;