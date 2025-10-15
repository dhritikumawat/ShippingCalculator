import { useEffect, useState } from 'react';
import { Package, AlertCircle, RefreshCw } from 'lucide-react';
import type { Box } from '../types';
import { fetchBoxes } from '../services/boxService';
import { getCountryName, formatCurrency, rgbStringToObject } from '../services/shippingService';

interface BoxListProps {
  refreshTrigger: number;
}

export default function BoxList({ refreshTrigger }: BoxListProps) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoxes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBoxes();
      setBoxes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boxes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoxes();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Boxes</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={loadBoxes}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (boxes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No boxes yet</h3>
          <p className="text-gray-500">Add your first shipping box to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">Shipping Boxes</h2>
            </div>
            <div className="text-white text-sm font-medium bg-blue-700 px-3 py-1 rounded-full">
              {boxes.length} {boxes.length === 1 ? 'Box' : 'Boxes'}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Receiver Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Box Color
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shipping Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {boxes.map((box) => {
                const rgb = rgbStringToObject(box.box_color);
                return (
                  <tr key={box.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{box.receiver_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{box.weight} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                          title={`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                        />
                        <span className="text-xs text-gray-500">
                          RGB({rgb.r}, {rgb.g}, {rgb.b})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{getCountryName(box.destination_country)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatCurrency(box.shipping_cost)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total: {boxes.length} {boxes.length === 1 ? 'box' : 'boxes'}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Total Cost: {formatCurrency(boxes.reduce((sum, box) => sum + box.shipping_cost, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
