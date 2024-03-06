import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortfolio, updatePortfolio, deletePortfolio } from '../api/portfolioApi';

type Portfolio = {
  id: string;
  name: string;
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
      const data: Portfolio[] = await response.json(); // Ensure data is typed as Portfolio[]
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
      const newPortfolio: Omit<Portfolio, 'id'> = { name: newPortfolioName };
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
      const token: string = getCookie('_auth');
      await deletePortfolio(portfolioId, token);
      const updatedPortfolios = portfolios.filter(portfolio => portfolio.id !== portfolioId);
      setPortfolios(updatedPortfolios);
    } catch (error) {
      console.error(`Error deleting portfolio ${portfolioId}:`, error);
    }
  };

  const getCookie = (name: string): string => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop()! : '';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Portfolios</h2>
      <ul className="divide-y divide-gray-200">
        {portfolios.map(portfolio => (
          <li key={portfolio.id} className="py-4">
            <div className="flex items-center justify-between">
              <Link to={`/portfolio/${portfolio.id}`} className="font-semibold">{portfolio.name}</Link>
              {selectedPortfolioId === portfolio.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatePortfolioName}
                    onChange={(e) => setUpdatePortfolioName(e.target.value)}
                    placeholder="Enter new name"
                    className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                  />
                  <button onClick={handleUpdatePortfolio} className="px-3 py-1 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Confirm
                  </button>
                  <button onClick={handleCancelUpdate} className="px-3 py-1 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleUpdateButtonClick(portfolio.id)} className="px-2 py-1 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Update
                  </button>
                  <button onClick={() => handleDeletePortfolio(portfolio.id)} className="px-2 py-1 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          placeholder="Enter portfolio name"
          className="px-2 py-1 border border-gray-300 rounded-md mr-2"
        />
        <button onClick={handleCreatePortfolio} className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create
        </button>
      </div>
    </div>
  );
}


export default PortfolioManagement;
