import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCookie } from "../utils/getCookie";
import InvestmentForm from "./InvestmentForm";
import PortfolioGraph from "./PortfolioGraph";
import Button from "./Button";
import UpdateCurrentPrice from "./UpdateCurrentPrice";

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
    acc[holding.symbol].performance += holding.performance * holding.quantity;
    acc[holding.symbol].wght_performance =
      acc[holding.symbol].performance / acc[holding.symbol].quantity;
    acc[holding.symbol].capital_gain += +holding.capital_gain;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="flex justify-center text-2xl font-bold mb-4">
        Dashboard for Portfolio ID:{" "}
        {investments.length > 0 ? investments[0].portfolio_name : "Loading..."}
      </h2>
      <div className="flex justify-end ml-4 mr-2 mb-4">
        <Link
          to="/portfolio"
          className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
        >
          Back to Portfolios
        </Link>
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
      <div className="relative z-0">
        <PortfolioGraph />
      </div>
      <div className="flex items-center justify-end">
        <Button
          onClick={openForm}
          color="indigo"
          className="px-3 py-1 ml-4 mr-2 mb-2"
        >
          Add Investment
        </Button>
      </div>
      <div className="flex items-center justify-end">
      <UpdateCurrentPrice />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Quantity
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Value
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capital Gain
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.keys(aggregatedHoldings).map((symbol) => (
            <React.Fragment key={symbol}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {aggregatedHoldings[symbol].quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {aggregatedHoldings[symbol].totalValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {aggregatedHoldings[symbol].capital_gain}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {aggregatedHoldings[symbol].wght_performance.toFixed(2)} %
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    onClick={() => handleDetailsClick(symbol)}
                    color="blue"
                    className="px-3 py-1"
                  >
                    Details
                  </Button>
                </td>
              </tr>
              {selectedSymbol === symbol && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center w-full">
                      <div className="w-3/4">
                        <table className="w-full divide-y divide-gray-200 mt-4">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction Type
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Price
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Currency
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {investments
                              .filter(
                                (investment) =>
                                  investment.symbol === selectedSymbol
                              )
                              .map((investment) => (
                                <tr key={investment.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {investment.transaction_type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {investment.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {investment.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {investment.price}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {holdings.find(
                                      (holding) =>
                                        holding.symbol === investment.symbol
                                    )?.current_price ?? "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {investment.currency}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
