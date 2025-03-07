
import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import { useHiveData } from '@/hooks/useHiveData';

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { hive, loading, timeSeriesData } = useHiveData(id);
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p>Loading hive details...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 ml-16 md:ml-0">
          <HiveDetailContent hive={hive} timeSeriesData={timeSeriesData} />
        </main>
      </div>
    </div>
  );
};

export default HiveDetail;
