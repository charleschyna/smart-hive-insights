
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const temperatureData = [
  { time: '00:00', value: 34.2 },
  { time: '04:00', value: 33.8 },
  { time: '08:00', value: 34.5 },
  { time: '12:00', value: 35.7 },
  { time: '16:00', value: 36.2 },
  { time: '20:00', value: 35.3 },
  { time: '00:00', value: 34.7 },
];

const humidityData = [
  { time: '00:00', value: 61 },
  { time: '04:00', value: 63 },
  { time: '08:00', value: 58 },
  { time: '12:00', value: 52 },
  { time: '16:00', value: 49 },
  { time: '20:00', value: 55 },
  { time: '00:00', value: 59 },
];

const weightData = [
  { time: '00:00', value: 65.2 },
  { time: '04:00', value: 65.4 },
  { time: '08:00', value: 65.8 },
  { time: '12:00', value: 66.3 },
  { time: '16:00', value: 66.7 },
  { time: '20:00', value: 66.9 },
  { time: '00:00', value: 67.1 },
];

const soundData = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 110 },
  { time: '08:00', value: 230 },
  { time: '12:00', value: 410 },
  { time: '16:00', value: 320 },
  { time: '20:00', value: 180 },
  { time: '00:00', value: 130 },
];

type TimeRange = '24h' | '7d' | '30d' | '90d';

interface HiveOverviewProps {
  hiveName: string;
  apiaryName: string;
}

const HiveOverview = ({ hiveName, apiaryName }: HiveOverviewProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // In a real app, we would fetch new data for the selected time range
  };
  
  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
            {hiveName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {apiaryName}
          </p>
        </div>
        
        <div className="flex space-x-1 mt-3 sm:mt-0">
          {(['24h', '7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant="outline"
              size="sm"
              className={cn(
                "text-xs",
                timeRange === range ? "bg-honey-100 text-honey-700 border-honey-300" : ""
              )}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="temperature" className="mt-2">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="sound">Sound</TabsTrigger>
        </TabsList>
        
        <TabsContent value="temperature">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperatureData}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  unit="°C"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F6C213"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-honey-50 dark:bg-honey-900/20 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">34.7°C</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Average</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">34.9°C</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Optimal Range</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">32-36°C</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="humidity">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={humidityData}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={[40, 70]} 
                  unit="%"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#73B888"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">59%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Average</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">56.7%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Optimal Range</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">50-65%</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="weight">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  unit="kg"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">67.1 kg</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Daily Gain</p>
                <p className="font-medium text-lg text-forest-600 dark:text-forest-400">+1.9 kg</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Est. Honey</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">19.3 kg</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sound">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={soundData}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={[0, 'dataMax + 50']} 
                  unit=" Hz"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">130 Hz</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-lg text-forest-600 dark:text-forest-400">Normal</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Alert Level</p>
                <p className="font-medium text-lg text-gray-900 dark:text-gray-100">450+ Hz</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default HiveOverview;
