import { Package } from 'lucide-react';

interface NavbarProps {
  currentView: 'form' | 'list';
  onViewChange: (view: 'form' | 'list') => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Shipping Calculator</h1>
          </div>

          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('form')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === 'form'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Box
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              View Boxes
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
