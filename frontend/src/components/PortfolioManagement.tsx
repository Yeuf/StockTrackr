import { useState, useEffect } from 'react';
import { createPortfolio, updatePortfolio, deletePortfolio } from '../api/portfolioApi';

type Portfolio = {
  id: number;
  name: string;
};

function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolioName, setNewPortfolioName] = useState<string>('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/portfolio/portfolios/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('jwt_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios');
      }
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      const newPortfolio: Portfolio = { id: 0, name: newPortfolioName };
      const token: string = getCookie('jwt_token');
      const data = await createPortfolio(newPortfolio, token);
      setPortfolios([...portfolios, data]);
      setNewPortfolioName('');
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const handleUpdatePortfolio = async (portfolioId: number, newName: string) => {
    try {
      const token: string = getCookie('jwt_token');
      await updatePortfolio(portfolioId, { name: newName }, token);
      const updatedPortfolios = portfolios.map(portfolio =>
        portfolio.id === portfolioId ? { ...portfolio, name: newName } : portfolio
      );
      setPortfolios(updatedPortfolios);
    } catch (error) {
      console.error(`Error updating portfolio ${portfolioId}:`, error);
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    try {
      const token: string = getCookie('jwt_token');
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
      <h2>Portfolios</h2>
      <ul>
        {portfolios.map(portfolio => (
          <li key={portfolio.id}>
            {portfolio.name}
            <button onClick={() => handleUpdatePortfolio(portfolio.id, `${portfolio.name}-Updated`)}>Update</button>
            <button onClick={() => handleDeletePortfolio(portfolio.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newPortfolioName}
        onChange={(e) => setNewPortfolioName(e.target.value)}
        placeholder="Enter portfolio name"
      />
      <button onClick={handleCreatePortfolio}>Create Portfolio</button>
    </div>
  );
}

export default PortfolioManagement;
