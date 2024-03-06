import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie'; // Importing getCookie function from utils folder

type Investment = {
  id: string;
  portfolio: string;
  symbol: string;
  quantity: number;
  transaction_type: 'Buy' | 'Sell';
  date: string;
  price: number;
};

function PortfolioDashboard() {
  const { id } = useParams<{ id: string }>();
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/portfolio/investments/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('_auth')}`, // Using getCookie function from utils folder
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      const data: Investment[] = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard for Portfolio ID: {id}</h2>
      <Link to="/" className="text-blue-500 hover:underline">Back to Portfolios</Link>
      <ul className="divide-y divide-gray-200">
        {investments.map(investment => (
          <li key={investment.id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">Symbol: {investment.symbol}</span>
                <span className="ml-4">Quantity: {investment.quantity}</span>
                <span className="ml-4">Transaction Type: {investment.transaction_type}</span>
                <span className="ml-4">Date: {investment.date}</span>
                <span className="ml-4">Price: {investment.price}</span>
              </div>
              <div>
                {/* Link to the portfolio using the portfolio ID */}
                <Link to={`/portfolio/${investment.portfolio}/`} className="px-2 py-1 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  View Portfolio
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PortfolioDashboard;
