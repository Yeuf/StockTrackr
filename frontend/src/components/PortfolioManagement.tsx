import React, {  useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortfolio, updatePortfolio, deletePortfolio } from '../api/portfolioApi';
import { getCookie } from '../utils/getCookie';
import Button from './Button';

type Portfolio = {
  id: string;
  name: string;
  current_value: number;
  performance: number;
  capital_gain: number;
};

function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolioName, setNewPortfolioName] = useState<string>('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [updatePortfolioName, setUpdatePortfolioName] = useState<string>('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/portfolio/portfolios/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('_auth')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios');
      }
      const data: Portfolio[] = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      if (newPortfolioName.trim() === '') {
        console.error('Error: Portfolio name cannot be blank.');
        alert('Portfolio name cannot be blank. Please enter a valid name.');
        return;
      }
      const newPortfolio: Omit<Portfolio, 'id' | 'current_value'  | 'performance' | 'capital_gain'> = { name: newPortfolioName };
      const token: string = getCookie('_auth');
      const data = await createPortfolio(newPortfolio, token);
      setPortfolios([...portfolios, data]);
      setNewPortfolioName('');
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const handleUpdateButtonClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setUpdatePortfolioName('');
  };

  const handleUpdatePortfolio = async () => {
    try {
      if (selectedPortfolioId && updatePortfolioName.trim() === '') {
        console.error('Error: Update name cannot be blank.');
        alert('Update name cannot be blank. Please enter a valid name.');
        return;
      }
      if (selectedPortfolioId && updatePortfolioName.trim() !== '') {
        const token: string = getCookie('_auth');
        await updatePortfolio(selectedPortfolioId, { name: updatePortfolioName }, token);
        const updatedPortfolios = portfolios.map(portfolio =>
          portfolio.id === selectedPortfolioId ? { ...portfolio, name: updatePortfolioName } : portfolio
        );
        setPortfolios(updatedPortfolios);
        setSelectedPortfolioId(null);
      } else {
        console.error('Error: Update name cannot be blank.');
      }
    } catch (error) {
      console.error('Error updating portfolio name:', error);
    }
  };
  
  const handleCancelUpdate = () => {
    setSelectedPortfolioId(null);
    setUpdatePortfolioName('');
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this portfolio?");
    if (!confirmed) {
      return;
    }
      const token: string = getCookie('_auth');
      await deletePortfolio(portfolioId, token);
      const updatedPortfolios = portfolios.filter(portfolio => portfolio.id !== portfolioId);
      setPortfolios(updatedPortfolios);
    } catch (error) {
      console.error(`Error deleting portfolio ${portfolioId}:`, error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">Portfolios</h2>
      <ul className="divide-y divide-gray-200">
  {portfolios.map((portfolio, index) => (
    <React.Fragment key={portfolio.id}>
      {index === 0 && (
        <li className="py-2">
          <div className="flex items-center justify-between font-bold">
            <div className="w-1/4 text-center">Portfolio Name</div>
            <div className="w-1/4 text-center">Current Value</div>
            <div className="w-1/4 text-center">Capital Gain</div>
            <div className="w-1/4 text-center">Performance</div>
            <div className="w-1/2 flex justify-center">Actions</div>
          </div>
        </li>
      )}
      <li className="py-4">
        <div className="flex items-center justify-between">
          <div className="w-1/4 text-center">
            <Link to={`/portfolio/${portfolio.id}`} className="font-semibold">{portfolio.name}</Link>
          </div>
          <div className="w-1/4 text-center">{portfolio.current_value}</div>
          <div className="w-1/4 text-center">{portfolio.capital_gain}</div>
          <div className="w-1/4 text-center">{portfolio.performance} %</div>
          <div className="w-1/2 flex justify-center">
            {selectedPortfolioId === portfolio.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={updatePortfolioName}
                  onChange={(e) => setUpdatePortfolioName(e.target.value)}
                  placeholder="Enter new name"
                  className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                />
                <Button onClick={handleUpdatePortfolio} color="green" className='px-3 py-1'>
                  Confirm
                </Button>
                <Button onClick={handleCancelUpdate} color="gray" className="px-3 py-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <Button onClick={() => handleUpdateButtonClick(portfolio.id)} color="indigo" className="px-2 py-1">
                  Update
                </Button>
                <Button onClick={() => handleDeletePortfolio(portfolio.id)} color="red" className="px-2 py-1 ml-2">
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </li>
    </React.Fragment>
  ))}
</ul>

      <div className="mt-4 flex items-center justify-center">
        <input
          type="text"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          placeholder="Enter portfolio name"
          className="px-2 py-1 border border-gray-300 rounded-md mr-2"
        />
        <Button onClick={handleCreatePortfolio} color="indigo" className="px-3 py-1">
          Create
        </Button>
      </div>
    </div>
  );
}


export default PortfolioManagement;
