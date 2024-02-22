import { useState, useEffect } from 'react';
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
      <h2>Portfolios</h2>
      <ul>
        {portfolios.map(portfolio => (
          <li key={portfolio.id}>
            <span>{portfolio.name}</span>
            {selectedPortfolioId === portfolio.id && (
              <div>
                <input
                  type="text"
                  value={updatePortfolioName}
                  onChange={(e) => setUpdatePortfolioName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button onClick={handleUpdatePortfolio}>Confirm Update</button>
                <button onClick={handleCancelUpdate}>Cancel</button>
              </div>
            )}
            {!selectedPortfolioId && (
              <button onClick={() => handleUpdateButtonClick(portfolio.id)}>Update</button>
            )}
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
