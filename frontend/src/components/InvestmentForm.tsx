import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createInvestment } from "../api/investmentApi";
import { getCookie } from "../utils/getCookie";
import Button from "./Button";

type InvestmentFormProps = {
  onCreateSuccess: () => void;
};

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onCreateSuccess }) => {
  const { id: portfolioId } = useParams<{ id: string }>();
  const token = getCookie("_auth");
  const [newInvestmentSymbol, setNewInvestmentSymbol] = useState("");
  const [newInvestmentQuantity, setNewInvestmentQuantity] = useState(0);
  const [newInvestmentTransactionType, setNewInvestmentTransactionType] =
    useState<"Buy" | "Sell">("Buy");
  const today = new Date();
  const defaultValue = today.toISOString().split("T")[0];
  const [newInvestmentDate, setNewInvestmentDate] = useState(defaultValue);
  const [newInvestmentPrice, setNewInvestmentPrice] = useState("");
  const [newInvestmentCurrency, setNewInvestmentCurrency] = useState<
    "EUR" | "USD" | "CAD"
  >("EUR");

  const handleCreateInvestment = async () => {
    try {
      if (
        newInvestmentSymbol.trim() === "" ||
        newInvestmentQuantity <= 0 ||
        newInvestmentDate.trim() === "" ||
        newInvestmentPrice.trim() === ""
      ) {
        console.error("Error: Investment details cannot be blank.");
        alert(
          "Investment details cannot be blank. Please enter valid information."
        );
        return;
      }
      if (!portfolioId) {
        console.error("Error: Portfolio ID is undefined.");
        return;
      }
      await createInvestment(
        {
          symbol: newInvestmentSymbol,
          quantity: newInvestmentQuantity,
          transaction_type: newInvestmentTransactionType,
          date: newInvestmentDate,
          price: newInvestmentPrice,
          portfolio: portfolioId,
          currency: newInvestmentCurrency,
        },
        token
      );
      onCreateSuccess();
      setNewInvestmentSymbol("");
      setNewInvestmentQuantity(0);
      setNewInvestmentTransactionType("Buy");
      setNewInvestmentDate(defaultValue);
      setNewInvestmentPrice("");
      setNewInvestmentCurrency("EUR");
    } catch (error: any) {
      console.error("Error creating investment:", error);
    }
  };

  return (
    <form>
      <div className="space-y-6">
        <div>
          <label htmlFor="symbol" className="sr-only">
            Symbol
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="text"
              value={newInvestmentSymbol}
              onChange={(e) => setNewInvestmentSymbol(e.target.value)}
              placeholder="Symbol"
              className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="sr-only">
            Quantity
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="number"
              value={newInvestmentQuantity}
              onChange={(e) =>
                setNewInvestmentQuantity(parseInt(e.target.value))
              }
              placeholder="Quantity"
              className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="transactionType" className="sr-only">
            Transaction Type
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <select
              value={newInvestmentTransactionType}
              onChange={(e) =>
                setNewInvestmentTransactionType(
                  e.target.value as "Buy" | "Sell"
                )
              }
              className="block w-full border-0 bg-transparent py-1.5 pl-1 pr-3 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="sr-only">
            Date
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="date"
              value={newInvestmentDate}
              onChange={(e) => setNewInvestmentDate(e.target.value)}
              className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="sr-only">
            Price
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="text"
              value={newInvestmentPrice}
              onChange={(e) => setNewInvestmentPrice(e.target.value)}
              placeholder="Price"
              className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label htmlFor="transactionType" className="sr-only">
            Currency
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <select
              value={newInvestmentCurrency}
              onChange={(e) =>
                setNewInvestmentCurrency(
                  e.target.value as "EUR" | "USD" | "CAD"
                )
              }
              className="block w-full border-0 bg-transparent py-1.5 pl-1 pr-3 text-gray-900 placeholder-text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          onClick={handleCreateInvestment}
          color="indigo"
          className="px-3 py-2"
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;
