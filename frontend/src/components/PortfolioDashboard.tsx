import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import InvestmentForm from './InvestmentForm';
import PortfolioGraph from './PortfolioGraph';

type Holding = {
  symbol: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  performance: number;
  capital_gain: number;
}

type Investment = {
  id: string;
  portfolio_name: string;
  portfolio: string;
  symbol: string;
  quantity: number;
  transaction_type: 'Buy' | 'Sell';
  date: string;
  price: number;
};

function PortfolioDashboard() {
  const { id } = useParams<{ id: string }>();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchHoldings();
    fetchInvestments();
  }, []);

  const fetchHoldings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/portfolio/investments/${id}/holdings_by_portfolio/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('_auth')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch holdings');
      }
      const data: Holding[] = await response.json();
      setHoldings(data);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  };

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

  const aggregatedHoldings = holdings.reduce((acc: any, holding: Holding) => {
    if (!acc[holding.symbol]) {
      acc[holding.symbol] = {
        quantity: 0,
        totalValue: 0,
        performance: 0,
        capital_gain: 0,
      };
    }
    acc[holding.symbol].quantity += holding.quantity;
    acc[holding.symbol].totalValue += holding.quantity * holding.current_price;
    acc[holding.symbol].performance += (holding.performance * holding.quantity);
    acc[holding.symbol].wght_performance = acc[holding.symbol].performance / acc[holding.symbol].quantity;
    acc[holding.symbol].capital_gain += +holding.capital_gain;
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <InvestmentForm onCreateSuccess={() => { fetchInvestments(); closeForm(); }} />
            <div className="mt-6 flex justify-center">
              <button onClick={closeForm} className="px-3 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='relative z-0'> 
        <PortfolioGraph />
      </div>
      {/* Render the main table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Capital Gain</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Render aggregated investment information */}
          {Object.keys(aggregatedHoldings).map(symbol => (
            <React.Fragment key={symbol}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-center">{symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedHoldings[symbol].quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedHoldings[symbol].totalValue.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedHoldings[symbol].capital_gain}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{aggregatedHoldings[symbol].wght_performance.toFixed(2)} %</td>
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
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {holdings.find(holding => holding.symbol === investment.symbol)?.current_price ?? 'N/A'}
                              </td>
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
