import React, { useState, useEffect } from "react";
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../api/portfolioApi";
import { getCookie } from "../utils/getCookie";
import Button from "./Button";
import PortfolioCard from "./PortfolioCard";

type Portfolio = {
  id: string;
  name: string;
  current_value: number;
  performance: number;
  capital_gain: number;
};

function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolioName, setNewPortfolioName] = useState<string>("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    null
  );
  const [updatePortfolioName, setUpdatePortfolioName] = useState<string>("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/portfolio/portfolios/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("_auth")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch portfolios");
      }
      const data: Portfolio[] = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      if (newPortfolioName.trim() === "") {
        console.error("Error: Portfolio name cannot be blank.");
        alert("Portfolio name cannot be blank. Please enter a valid name.");
        return;
      }
      const newPortfolio: Omit<
        Portfolio,
        "id" | "current_value" | "performance" | "capital_gain"
      > = { name: newPortfolioName };
      const token: string = getCookie("_auth");
      const data = await createPortfolio(newPortfolio, token);
      setPortfolios([...portfolios, data]);
      setNewPortfolioName("");
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };


  const handleUpdatePortfolio = async (portfolioId: string, updatedName: string) => {
    try {
      if (!portfolioId || updatedName.trim() === "") {
        console.error("Error: Portfolio ID or updated name is invalid.");
        alert("Portfolio ID or updated name is invalid. Please try again.");
        return;
      }
  
      const token: string = getCookie("_auth");
      await updatePortfolio(
        portfolioId,
        { name: updatedName },
        token
      );
      
      const updatedPortfolios = portfolios.map((portfolio) =>
        portfolio.id === portfolioId
          ? { ...portfolio, name: updatedName }
          : portfolio
      );
      setPortfolios(updatedPortfolios);
      setSelectedPortfolioId(null);
    } catch (error) {
      console.error("Error updating portfolio name:", error);
    }
  };
  

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this portfolio?"
      );
      if (!confirmed) {
        return;
      }
      const token: string = getCookie("_auth");
      await deletePortfolio(portfolioId, token);
      const updatedPortfolios = portfolios.filter(
        (portfolio) => portfolio.id !== portfolioId
      );
      setPortfolios(updatedPortfolios);
    } catch (error) {
      console.error(`Error deleting portfolio ${portfolioId}:`, error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center justify-center">
        Portfolios
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {portfolios.map((portfolio) => (
            <React.Fragment key={portfolio.id}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                <PortfolioCard
                  id={portfolio.id}
                  name={portfolio.name}
                  currentValue={portfolio.current_value}
                  capitalGain={portfolio.capital_gain}
                  performance={portfolio.performance}
                  handleUpdatePortfolio={handleUpdatePortfolio}
                  handleDeletePortfolio={handleDeletePortfolio}
                />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-center">
        <input
          type="text"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          placeholder="Enter portfolio name"
          className="px-2 py-1 border border-gray-300 rounded-md mr-2"
        />
        <Button
          onClick={handleCreatePortfolio}
          color="indigo"
          className="px-3 py-1"
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default PortfolioManagement;
