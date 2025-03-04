
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ApiaryCard from '@/components/apiary/ApiaryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Apiaries = () => {
  // Mock data - In a real app, this would come from an API
  const apiaries = [
    {
      id: '1',
      name: 'Mountain Valley Apiary',
      location: 'Nairobi, Kenya',
      totalHives: 8,
      imageUrl: '/placeholder.svg',
      lastInspection: '2023-08-15'
    },
    {
      id: '2',
      name: 'Riverside Apiary',
      location: 'Mombasa, Kenya',
      totalHives: 5,
      imageUrl: '/placeholder.svg',
      lastInspection: '2023-08-10'
    },
    {
      id: '3',
      name: 'Hillside Apiary',
      location: 'Kisumu, Kenya',
      totalHives: 12,
      imageUrl: '/placeholder.svg',
      lastInspection: '2023-08-05'
    },
    {
      id: '4',
      name: 'Forest Edge Apiary',
      location: 'Nakuru, Kenya',
      totalHives: 6,
      imageUrl: '/placeholder.svg',
      lastInspection: '2023-07-28'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Apiaries" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Manage Apiaries</h1>
              <Button asChild>
                <Link to="/apiaries/new">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Apiary
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiaries.map((apiary) => (
                <ApiaryCard
                  key={apiary.id}
                  id={apiary.id}
                  name={apiary.name}
                  location={apiary.location}
                  totalHives={apiary.totalHives}
                  imageUrl={apiary.imageUrl}
                  lastInspection={apiary.lastInspection}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Apiaries;
