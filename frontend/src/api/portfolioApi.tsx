const API_BASE_URL = 'http://127.0.0.1:8000/api/portfolio';

type PortfolioData = {
  id: string;
  name: string;
};

export const createPortfolio = async (portfolioData: Omit<PortfolioData, 'id'>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export const updatePortfolio = async (id: string, updatedFields: Partial<PortfolioData>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFields),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
};

export const deletePortfolio = async (portfolioId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
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
