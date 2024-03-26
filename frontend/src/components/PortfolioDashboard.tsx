import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCookie } from "../utils/getCookie";
import InvestmentForm from "./InvestmentForm";
import PortfolioGraph from "./PortfolioGraph";
import Button from "./Button";
import UpdateCurrentPrice from "./UpdateCurrentPrice";
import HoldingsTable from "./HoldingsTable";

type Holding = {
  symbol: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  performance: number;
  capital_gain: number;
};

type Investment = {
  id: string;
  portfolio_name: string;
  portfolio: string;
  symbol: string;
  quantity: number;
  transaction_type: "Buy" | "Sell";
  date: string;
  price: number;
  currency: "EUR" | "USD" | "CAD";
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
      const response = await fetch(
        `http://localhost:8000/api/portfolio/investments/${id}/holdings_by_portfolio/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("_auth")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch holdings");
      }
      const data: Holding[] = await response.json();
      setHoldings(data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/portfolio/investments/${id}/investments_by_portfolio/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("_auth")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }
      const data: Investment[] = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleDetailsClick = (symbol: string) => {
    setSelectedSymbol((prevSymbol) => (prevSymbol === symbol ? null : symbol));
  };

  return (
    <div className="container mx-auto lg:w-full">
      <div className="flex justify-end mb-2 mr-2 mt-2">
        <Link
          to="/portfolio"
          className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
        >
          Back to Portfolios
        </Link>
      </div>
      <div className="flex justify-end mb-4 mr-4">
        <Button onClick={openForm} color="indigo" className="px-3 py-1">
          Add Investment
        </Button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <InvestmentForm
              onCreateSuccess={() => {
                fetchInvestments();
                closeForm();
              }}
            />
            <div className="mt-6 flex justify-center">
              <Button onClick={closeForm} color="red" className="px-3 py-2">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0 mr-0 lg:mr-2 relative">
          <div className="relative z-0">
            <PortfolioGraph />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <HoldingsTable
            holdings={holdings}
            investments={investments}
            handleDetailsClick={handleDetailsClick}
            selectedSymbol={selectedSymbol}
          />
          <div className="flex justify-end mt-4">
            <div className="w-full lg:w-1/2">
              <UpdateCurrentPrice />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDashboard;
