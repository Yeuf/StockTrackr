const API_BASE_URL = 'http://127.0.0.1:8000/api/portfolio';

type InvestmentData = {
  id: string;
  symbol: string;
  quantity: number;
  transaction_type: 'Buy' | 'Sell';
  date: string;
  price: string;
  portfolio: string;
  currency: 'EUR' | 'USD' | 'CAD';
};

export const createInvestment = async (investmentData: Omit<InvestmentData, 'id'>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(investmentData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating investment:', error);
    throw error;
  }
};

export const updateInvestment = async (portfolioId: string, investmentId: string, updatedFields: Partial<InvestmentData>, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/investments/${investmentId}/`, {
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
    console.error('Error updating investment:', error);
    throw error;
  }
};

export const deleteInvestment = async (portfolioId: string, investmentId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/investments/${investmentId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete investment ${investmentId}`);
    }
  } catch (error) {
    console.error(`Error deleting investment ${investmentId}:`, error);
    throw error;
  }
};
