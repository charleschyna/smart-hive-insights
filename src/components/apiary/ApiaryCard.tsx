
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ThermometerSun, Droplets, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ApiaryCardProps {
  id: string;
  name: string;
  location: string;
  hiveCount: number;
  avgTemperature: number;
  avgHumidity: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  delay?: number;
}

const healthStatusColors = {
  excellent: 'text-forest-600 bg-forest-100 dark:bg-forest-900/30 dark:text-forest-400',
  good: 'text-honey-600 bg-honey-100 dark:bg-honey-900/30 dark:text-honey-400',
  fair: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  poor: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
};

const ApiaryCard = ({
  id,
  name,
  location,
  hiveCount,
  avgTemperature,
  avgHumidity,
  healthStatus,
  delay = 0,
}: ApiaryCardProps) => {
  return (
    <motion.div
      className="glass-card glass-card-hover h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + (delay * 0.1) }}
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
              {name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            healthStatusColors[healthStatus]
          )}>
            {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Archive className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
            <span className="text-sm font-medium">{hiveCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Hives</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <ThermometerSun className="w-5 h-5 text-honey-500 mb-1" />
            <span className="text-sm font-medium">{avgTemperature}°C</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg Temp</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Droplets className="w-5 h-5 text-forest-500 mb-1" />
            <span className="text-sm font-medium">{avgHumidity}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg Humid</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-5 pt-0">
        <Link to={`/apiaries/${id}`}>
          <Button 
            variant="outline"
            className="w-full mt-4 border-gray-200 dark:border-gray-700"
          >
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ApiaryCard;
