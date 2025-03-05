
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HiveHeader from './HiveHeader';
import HiveStats from './HiveStats';
import HiveInfo from './HiveInfo';
import HiveImage from './HiveImage';
import HiveMonitoring from './HiveMonitoring';
import { MapPin } from 'lucide-react';

interface HiveDetailContentProps {
  hive: any;
  timeSeriesData: {
    temperature: { time: string; value: number }[];
    humidity: { time: string; value: number }[];
    weight: { time: string; value: number }[];
  };
}

const HiveDetailContent: React.FC<HiveDetailContentProps> = ({ hive, timeSeriesData }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <HiveHeader 
        name={hive.name}
        apiaryId={hive.apiaryId}
        apiaryName={hive.apiary?.name}
        lastInspection={hive.lastInspection}
        id={hive.id}
      />
      
      {/* Hive Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{hive.name}</h1>
                <div className="flex items-center text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hive.apiary?.name || 'Unknown Apiary'}</span>
                </div>
              </div>
            </div>
            
            <HiveStats
              temperature={hive.temperature}
              humidity={hive.humidity}
              weight={hive.weight}
              activity={hive.activity}
            />
            
            <HiveInfo
              queenAge={hive.queenAge}
              queenColor={hive.queenColor || 'Blue'}
              queenInstalled={hive.queenInstalled}
              health={hive.health}
              notes={hive.notes}
            />
          </CardContent>
        </Card>
        
        <HiveImage
          imageUrl={hive.imageUrl}
          name={hive.name}
          beeType={hive.beeType}
        />
      </div>
      
      {/* Monitoring Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Monitoring Data (Last 24 Hours)</h2>
        <HiveMonitoring 
          temperatureData={timeSeriesData.temperature}
          humidityData={timeSeriesData.humidity}
          weightData={timeSeriesData.weight}
        />
      </div>
    </div>
  );
};

export default HiveDetailContent;
