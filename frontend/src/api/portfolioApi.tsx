const API_BASE_URL = 'http://127.0.0.1:8000/api/portfolio/';

type PortfolioData = {
  name: string;
};

export const createPortfolio = async (portfolioData: PortfolioData, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify(portfolioData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
};

export const updatePortfolio = async (portfolioId: number, portfolioData: PortfolioData, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify(portfolioData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating portfolio ${portfolioId}:`, error);
    throw error;
  }
};

export const deletePortfolio = async (portfolioId: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete portfolio ${portfolioId}`);
    }
  } catch (error) {
    console.error(`Error deleting portfolio ${portfolioId}:`, error);
    throw error;
  }
};
