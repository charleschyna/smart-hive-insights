
import React from 'react';
import { Thermometer, Droplets, Scale, Activity } from 'lucide-react';

interface HiveStatsProps {
  temperature: number;
  humidity: number;
  weight: number;
  activity: string;
}

const HiveStats: React.FC<HiveStatsProps> = ({
  temperature,
  humidity,
  weight,
  activity
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-muted/40 rounded-lg p-3">
        <div className="flex items-center mb-1">
          <Thermometer className="h-4 w-4 mr-1 text-honey-500" />
          <p className="text-xs text-muted-foreground">Temperature</p>
        </div>
        <p className="text-lg font-bold">{temperature}°C</p>
      </div>
      <div className="bg-muted/40 rounded-lg p-3">
        <div className="flex items-center mb-1">
          <Droplets className="h-4 w-4 mr-1 text-forest-500" />
          <p className="text-xs text-muted-foreground">Humidity</p>
        </div>
        <p className="text-lg font-bold">{humidity}%</p>
      </div>
      <div className="bg-muted/40 rounded-lg p-3">
        <div className="flex items-center mb-1">
          <Scale className="h-4 w-4 mr-1 text-honey-500" />
          <p className="text-xs text-muted-foreground">Weight</p>
        </div>
        <p className="text-lg font-bold">{weight} kg</p>
      </div>
      <div className="bg-muted/40 rounded-lg p-3">
        <div className="flex items-center mb-1">
          <Activity className="h-4 w-4 mr-1 text-forest-500" />
          <p className="text-xs text-muted-foreground">Activity</p>
        </div>
        <p className="text-lg font-bold">{activity}</p>
      </div>
    </div>
  );
};

export default HiveStats;
