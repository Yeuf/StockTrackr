import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
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
    setShowOptions(!showOptions);
  };

  const handleUpdateButtonClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setUpdatePortfolioName("");
  };

  const handleUpdate = async () => {
    try {
      await handleUpdatePortfolio(selectedPortfolioId!, updatePortfolioName);
      setShowOptions(false);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
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
    // <Link
    //   to={`/portfolio/${id}`}
    //   className="block"
    //   onClick={(e) => e.stopPropagation()}
    // >
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border border border-gray-400">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap -mx-3">
            <div className="flex-none w-full max-w-full px-3 flex flex-row items-center">
              <div className="flex-auto">
                <div>
                  <p className="mb-2 font-sans font-semibold leading-normal text-sm">
                    Portfolio Name
                  </p>
                  <h5 className="mb-0 font-bold">{name}</h5>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-2 font-sans font-semibold leading-normal text-sm">
                      Current Value
                    </p>
                    <h5 className="mb-0 font-bold">{currentValue}</h5>
                  </div>
                  <CurrencyEuroIcon className="w-10 h-10 ml-4" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-2 font-sans font-semibold leading-normal text-sm">
                      Capital Gain
                    </p>
                    <h5 className="mb-0 font-bold">{capitalGain}</h5>
                  </div>
                  <ArrowTrendingUpIcon className="w-10 h-10 ml-4" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <p className="mb-0 font-sans font-semibold leading-normal text-sm">
                      Performance
                    </p>
                    <h5 className="mb-0 font-bold">{performance} %</h5>
                  </div>
                  <ArrowTrendingUpIcon className="w-10 h-10 ml-4" />
                </div>
              </div>
              <div className="px-6 py-4 whitespace-nowrap text-center">
                <div className="relative">
                  <button
                    onClick={handleModsButtonClick}
                    className="flex items-center justify-center bg-gray-100 rounded-full p-2 transition duration-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4zM2 10a2 2 0 114 0 2 2 0 01-4 0zm14 0a2 2 0 114 0 2 2 0 01-4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showOptions && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                      {selectedPortfolioId === id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={updatePortfolioName}
                            onChange={(e) =>{
                              console.log("Updating portfolio name:", e.target.value);
                              setUpdatePortfolioName(e.target.value);
                            }}
                            placeholder="Enter new name"
                            className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                          />
                          <button
                            onClick={() => handleUpdatePortfolio(id, updatePortfolioName)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleCancelUpdate}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => handleUpdateButtonClick(id)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Update
                          </button>
                          <button
                            onClick={handleDelete}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
          </div>
        </div>
      </div>
    // </Link>
  );
};

export default PortfolioCard;
