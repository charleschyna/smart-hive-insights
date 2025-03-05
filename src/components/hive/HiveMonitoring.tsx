
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

interface HiveMonitoringProps {
  temperatureData: DataPoint[];
  humidityData: DataPoint[];
  weightData: DataPoint[];
}

const HiveMonitoring: React.FC<HiveMonitoringProps> = ({ 
  temperatureData, 
  humidityData, 
  weightData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Temperature (°C)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperatureData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  activeDot={{ r: 8 }}
                  name="Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Humidity (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={humidityData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  activeDot={{ r: 8 }}
                  name="Humidity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Weight (kg)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  activeDot={{ r: 8 }}
                  name="Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiveMonitoring;
