
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import { useHiveData } from '@/hooks/useHiveData';

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { hive, loading, timeSeriesData } = useHiveData(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Navbar />
          <main className="flex-1 flex items-center justify-center mt-16">
            <p>Loading hive details...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <HiveDetailContent hive={hive} timeSeriesData={timeSeriesData} />
        </main>
      </div>
    </div>
  );
};

export default HiveDetail;
