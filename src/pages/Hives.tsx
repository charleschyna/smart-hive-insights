
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { HiveCard } from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Hives = () => {
  // Mock data - In a real app, this would come from an API
  const hives = [
    {
      id: '1',
      name: 'Hive A1',
      queenAge: 1,
      lastInspection: '2023-08-15',
      health: 'Good',
      temperature: 35,
      humidity: 65,
      weight: 32,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Hive A2',
      queenAge: 2,
      lastInspection: '2023-08-10',
      health: 'Excellent',
      temperature: 34.5,
      humidity: 68,
      weight: 29,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Hive B1',
      queenAge: 1,
      lastInspection: '2023-08-12',
      health: 'Fair',
      temperature: 36,
      humidity: 62,
      weight: 27,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Hive B2',
      queenAge: 3,
      lastInspection: '2023-08-05',
      health: 'Good',
      temperature: 34,
      humidity: 66,
      weight: 30,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'Hive C1',
      queenAge: 2,
      lastInspection: '2023-08-08',
      health: 'Good',
      temperature: 35.5,
      humidity: 64,
      weight: 31,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '6',
      name: 'Hive C2',
      queenAge: 1,
      lastInspection: '2023-08-14',
      health: 'Excellent',
      temperature: 33.5,
      humidity: 67,
      weight: 28,
      imageUrl: '/placeholder.svg'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Hives" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Manage Hives</h1>
              <Button asChild>
                <Link to="/hives/new">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                </Link>
              </Button>
            </div>

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hives;
