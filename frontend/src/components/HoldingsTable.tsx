import React from "react";
import Button from "./Button";

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

type HoldingsTableProps = {
  holdings: Holding[];
  investments: Investment[];
  handleDetailsClick: (symbol: string) => void;
  selectedSymbol: string | null;
};

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  investments,
  handleDetailsClick,
  selectedSymbol,
}) => {
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
    <div className="mx-auto max-w-screen pr-5">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Quantity
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Capital Gain
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                    {aggregatedHoldings[symbol].capital_gain.toFixed(2)}
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
                      <div className="flex justify-center">
                        <div className="w-full lg:w-10/12 rounded-lg shadow-lg overflow-hidden">
                          <table className="w-full divide-y divide-gray-200">
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
    </div>
  );
  
};

export default HoldingsTable;
