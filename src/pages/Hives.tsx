
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load hives from localStorage
    const loadHives = () => {
      const storedHives = JSON.parse(localStorage.getItem('hives') || '[]');
      setHives(storedHives);
      setLoading(false);
    };

    loadHives();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadHives();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 ml-16 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Manage Hives</h1>
              <Button asChild>
                <Link to="/hives/new">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading hives...</p>
              </div>
            ) : hives.length === 0 ? (
              <div className="bg-muted/30 rounded-xl p-12 text-center">
                <h3 className="text-xl font-medium mb-2">No hives yet</h3>
                <p className="text-muted-foreground mb-6">Add your first hive to start monitoring</p>
                <Button asChild>
                  <Link to="/hives/new">
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Your First Hive
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hives.map((hive) => (
                  <HiveCard
                    key={hive.id}
                    id={hive.id}
                    name={hive.name}
                    queenAge={hive.queenAge}
                    lastInspection={hive.lastInspection}
                    health={hive.health}
                    temperature={hive.temperature}
                    humidity={hive.humidity}
                    weight={hive.weight}
                    imageUrl={hive.imageUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hives;
