
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Weight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HiveCardProps {
  id: string;
  name: string;
  apiaryId: string;
  apiaryName: string;
  temperature: number;
  humidity: number;
  weight: number;
  soundLevel: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdated: string;
  delay?: number;
}

const healthStatusColors = {
  excellent: 'text-forest-600 bg-forest-100 dark:bg-forest-900/30 dark:text-forest-400',
  good: 'text-honey-600 bg-honey-100 dark:bg-honey-900/30 dark:text-honey-400',
  fair: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  poor: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
};

const HiveCard = ({
  id,
  name,
  apiaryId,
  apiaryName,
  temperature,
  humidity,
  weight,
  soundLevel,
  healthStatus,
  lastUpdated,
  delay = 0,
}: HiveCardProps) => {
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
            <Link to={`/apiaries/${apiaryId}`}>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-honey-600 dark:hover:text-honey-400 transition-colors">
                <span>{apiaryName}</span>
              </div>
            </Link>
          </div>
          
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            healthStatusColors[healthStatus]
          )}>
            {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <Thermometer className="w-4 h-4 text-honey-500 mr-1.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Temperature</span>
            </div>
            <span className="text-lg font-medium">{temperature}°C</span>
          </div>
          
          <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 text-forest-500 mr-1.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Humidity</span>
            </div>
            <span className="text-lg font-medium">{humidity}%</span>
          </div>
          
          <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <Weight className="w-4 h-4 text-purple-500 mr-1.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Weight</span>
            </div>
            <span className="text-lg font-medium">{weight} kg</span>
          </div>
          
          <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <Volume2 className="w-4 h-4 text-blue-500 mr-1.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Sound</span>
            </div>
            <span className="text-lg font-medium">{soundLevel} Hz</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated}
        </div>
      </div>
      
      <div className="mt-auto p-5 pt-0">
        <Link to={`/hives/${id}`}>
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

export default HiveCard;
