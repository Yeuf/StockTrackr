import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

type PortfolioCardProps = {
  id: string;
  name: string;
  currentValue: number;
  capitalGain: number;
  performance: number;
  handleUpdatePortfolio: (id: string, newName: string) => void;
  handleDeletePortfolio: (id: string) => void;
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  id,
  name,
  currentValue,
  capitalGain,
  performance,
  handleUpdatePortfolio,
  handleDeletePortfolio,
}) => {
  const [updatePortfolioName, setUpdatePortfolioName] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    null
  );

  const handleModsButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    if (selectedPortfolioId === id) {
      handleCancelUpdate();
    }
    setShowOptions(!showOptions);
  };

  const handleUpdateButtonClick = (
    portfolioId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedPortfolioId(portfolioId);
    setUpdatePortfolioName("");
  };

  const handleUpdate = async () => {
    handleUpdatePortfolio(id, updatePortfolioName);
    setShowOptions(false);
  };

  const handleCancelUpdate = () => {
    setSelectedPortfolioId(null);
    setUpdatePortfolioName("");
    setShowOptions(false);
  };

  const handleDelete = () => {
    handleDeletePortfolio(id);
    setShowOptions(false);
  };

  return (
    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border border border-gray-400">
      <Link to={`/portfolio/${id}`} className="block">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap -mx-3">
            <div className="flex-none w-full max-w-full px-3 flex flex-row items-center">
              <div className="flex-auto">
                <div>
                  <p className="mb-2 font-sans font-bold leading-normal text-lg">
                    Portfolio Name
                  </p>
                  <h5 className="mb-0 font-normal italic">{name}</h5>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-2 font-sans font-bold leading-normal text-lg">
                      Current Value
                    </p>
                    <h5 className="mb-0 font-normal italic">{currentValue}</h5>
                  </div>
                  <CurrencyEuroIcon className="w-8 h-8 ml-4" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-2 font-sans font-bold leading-normal text-lg">
                      Capital Gain
                    </p>
                    <h5 className="mb-0 font-normal italic">{capitalGain}</h5>
                  </div>
                  <ChartPieIcon className="w-8 h-8 ml-4" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-0 font-sans font-bold leading-normal text-lg">
                      Performance
                    </p>
                    <h5 className="mb-0 font-normal italic">{performance} %</h5>
                  </div>
                  <ArrowTrendingUpIcon className="w-8 h-8 ml-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-0 right-0 mt-6 mr-10 max-w-screen">
        <div className="relative">
          <button
            onClick={handleModsButtonClick}
            className="flex items-center justify-center bg-gray-100 rounded-full p-2 transition duration-300 focus:outline-none"
          >
            <EllipsisHorizontalCircleIcon className="w-6 h-6" />
          </button>
          {showOptions && (
            <div className="absolute top-0 right-0 mt-10 w-48 bg-white rounded-md shadow-xl z-10">
              {selectedPortfolioId === id ? (
                <div className="flex flex-col p-2">
                  <input
                    type="text"
                    value={updatePortfolioName}
                    onChange={(e) => {
                      setUpdatePortfolioName(e.target.value);
                    }}
                    placeholder="Enter new name"
                    className="px-2 py-1 border border-gray-300 rounded-md mt-2 mr-2"
                  />
                  <button
                    onClick={handleUpdate}
                    className="px-1 py-1 bg-green-500 text-white rounded-md mt-2 mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancelUpdate}
                    className="px-1 py-1 bg-gray-500 text-white rounded-md mt-2 mr-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={(e) => handleUpdateButtonClick(id, e)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
