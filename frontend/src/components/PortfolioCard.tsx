import React from "react";
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
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  id,
  name,
  currentValue,
  capitalGain,
  performance,
}) => {
  return (
    <Link to={`/portfolio/${id}`} className="block">
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border border border-gray-200">
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
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard;
