
import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import HiveHeader from '@/components/hive/HiveHeader';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import PageTransition from '@/components/layout/PageTransition';
import { useHiveData } from '@/hooks/useHiveData';

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { hive, timeSeriesData, loading } = useHiveData(id);
  
  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-honey-500" />
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto p-4">
        {hive && (
          <>
            <HiveHeader 
              name={hive.name}
              apiaryId={hive.apiary?.id}
              apiaryName={hive.apiary?.name}
              lastInspection={hive.last_inspection}
              id={hive.id}
            />
            
            <HiveDetailContent 
              hive={hive}
              timeSeriesData={timeSeriesData}
            />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default HiveDetail;
