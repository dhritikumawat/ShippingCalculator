import { useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';
import type { BoxFormData, FormErrors, DestinationCountry } from '../types';
import { COUNTRIES, calculateShippingCost, formatCurrency, rgbObjectToString } from '../services/shippingService';
import { saveBox } from '../services/boxService';

interface AddBoxProps {
  onBoxAdded: () => void;
}

export default function AddBox({ onBoxAdded }: AddBoxProps) {
  const [formData, setFormData] = useState<BoxFormData>({
    receiver_name: '',
    weight: 0,
    box_color: '255,255,255',
    destination_country: 'SWEDEN',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [colorRgb, setColorRgb] = useState({ r: 255, g: 255, b: 255 });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.receiver_name.trim()) {
      newErrors.receiver_name = 'Receiver name is required';
    }

    if (formData.weight < 0) {
      newErrors.weight = 'Weight cannot be negative';
      setFormData((prev) => ({ ...prev, weight: 0 }));
    }

    if (formData.weight === 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    if (!formData.box_color) {
      newErrors.box_color = 'Box color is required';
    }

    if (!formData.destination_country) {
      newErrors.destination_country = 'Destination country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveBox(formData);
      setSuccessMessage('Box saved successfully!');
      setFormData({
        receiver_name: '',
        weight: 0,
        box_color: '255,255,255',
        destination_country: 'SWEDEN',
      });
      setColorRgb({ r: 255, g: 255, b: 255 });
      setErrors({});
      onBoxAdded();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({
        receiver_name: error instanceof Error ? error.message : 'Failed to save box',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleColorChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colorRgb, [component]: Math.max(0, Math.min(255, value)) };
    setColorRgb(newRgb);
    setFormData((prev) => ({
      ...prev,
      box_color: rgbObjectToString(newRgb.r, newRgb.g, newRgb.b),
    }));
  };

  const handleColorPickerChange = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    setColorRgb({ r, g, b });
    setFormData((prev) => ({
      ...prev,
      box_color: rgbObjectToString(r, g, b),
    }));
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const estimatedCost = calculateShippingCost(formData.weight, formData.destination_country);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-semibold text-white">Add New Shipping Box</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700 mb-2">
              Receiver Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="receiver_name"
              value={formData.receiver_name}
              onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.receiver_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter receiver name"
            />
            {errors.receiver_name && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.receiver_name}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="weight"
              value={formData.weight}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData({ ...formData, weight: isNaN(value) ? 0 : value });
              }}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter weight in kilograms"
            />
            {errors.weight && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.weight}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Box Color (RGB) <span className="text-red-500">*</span>
            </label>

            <div className="mb-4">
              <label htmlFor="color_picker" className="block text-xs text-gray-600 mb-2">Color Picker</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="color_picker"
                  value={rgbToHex(colorRgb.r, colorRgb.g, colorRgb.b)}
                  onChange={(e) => handleColorPickerChange(e.target.value)}
                  className="h-12 w-24 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Current Color</p>
                  <p className="text-xs">RGB({colorRgb.r}, {colorRgb.g}, {colorRgb.b})</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-600 mb-2">Or enter RGB values manually:</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="color_r" className="block text-xs text-gray-600 mb-1">Red</label>
                  <input
                    type="number"
                    id="color_r"
                    value={colorRgb.r}
                    onChange={(e) => handleColorChange('r', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="color_g" className="block text-xs text-gray-600 mb-1">Green</label>
                  <input
                    type="number"
                    id="color_g"
                    value={colorRgb.g}
                    onChange={(e) => handleColorChange('g', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="color_b" className="block text-xs text-gray-600 mb-1">Blue</label>
                  <input
                    type="number"
                    id="color_b"
                    value={colorRgb.b}
                    onChange={(e) => handleColorChange('b', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="destination_country" className="block text-sm font-medium text-gray-700 mb-2">
              Destination Country <span className="text-red-500">*</span>
            </label>
            <select
              id="destination_country"
              value={formData.destination_country}
              onChange={(e) =>
                setFormData({ ...formData, destination_country: e.target.value as DestinationCountry })
              }
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                errors.destination_country ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({formatCurrency(country.multiplier)} per kg)
                </option>
              ))}
            </select>
            {errors.destination_country && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.destination_country}</span>
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Estimated Shipping Cost:</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(estimatedCost)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isSubmitting ? 'Saving...' : 'Save Box'}
          </button>
        </form>
      </div>
    </div>
  );
}
