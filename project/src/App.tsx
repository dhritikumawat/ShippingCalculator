import { useState } from 'react';
import Navbar from './components/Navbar';
import AddBox from './components/AddBox';
import BoxList from './components/BoxList';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'list'>('form');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBoxAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      <main className="pb-8">
        {currentView === 'form' ? (
          <AddBox onBoxAdded={handleBoxAdded} />
        ) : (
          <BoxList refreshTrigger={refreshTrigger} />
        )}
      </main>
    </div>
  );
}

export default App;
