import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import InvestmentForm from './InvestmentForm';

type Investment = {
  id: string;
  portfolio_name: string;
  current_price: number;
  price_difference_percentage: number;
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
  const [showForm, setShowForm] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/portfolio/investments/${id}/investments_by_portfolio/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('_auth')}`,
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

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleDetailsClick = (symbol: string) => {
    setSelectedSymbol(prevSymbol => (prevSymbol === symbol ? null : symbol));
  };

  const aggregatedInvestments = investments.reduce((acc: any, investment: Investment) => {
    if (!acc[investment.symbol]) {
      acc[investment.symbol] = {
        quantity: 0,
        price: 0,
        avgweighteddiff: 0,
      };
    }
    if (investment.transaction_type === 'Buy') {
      acc[investment.symbol].quantity += investment.quantity;
      acc[investment.symbol].avgweighteddiff += investment.price_difference_percentage * investment.quantity;
    } else {
      acc[investment.symbol].quantity -= investment.quantity;
    }
    acc[investment.symbol].price = acc[investment.symbol].quantity * investment.current_price;
    // to refine 
    acc[investment.symbol].price_avgweighteddiff = acc[investment.symbol].avgweighteddiff / acc[investment.symbol].quantity;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard for Portfolio ID: {investments.length > 0 ? investments[0].portfolio_name : 'Loading...'}</h2>
      <Link to="/portfolio" className="text-blue-500 hover:underline">Back to Portfolios</Link>
      <div className="flex items-center justify-end">
        <button onClick={openForm} className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-4">
          Add Investment
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <InvestmentForm onCreateSuccess={() => { fetchInvestments(); closeForm(); }} />
            <button onClick={closeForm} className="mt-4 px-3 py-1 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Close
            </button>
          </div>
        </div>
      )}
      {/* Render the main table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Total Price</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price diff</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Render aggregated investment information */}
          {Object.keys(aggregatedInvestments).map(symbol => (
            <React.Fragment key={symbol}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-center">{symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedInvestments[symbol].quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedInvestments[symbol].price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedInvestments[symbol].price_avgweighteddiff}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button onClick={() => handleDetailsClick(symbol)} className="text-indigo-600 hover:underline focus:outline-none">Details</button>
                </td>
              </tr>
              {/* Render details table if symbol is selected */}
              {selectedSymbol === symbol && (
                <tr>
                  <td colSpan={4}>
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price Diff</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Render investment details for selected symbol */}
                        {investments
                          .filter(investment => investment.symbol === selectedSymbol)
                          .map(investment => (
                            <tr key={investment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.transaction_type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.price}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.current_price}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{investment.price_difference_percentage} %</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioDashboard;
