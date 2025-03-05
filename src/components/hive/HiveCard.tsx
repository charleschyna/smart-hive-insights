
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Scale, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HiveCardProps {
  id: string;
  name: string;
  queenAge: number;
  lastInspection: string;
  health: string;
  temperature: number;
  humidity: number;
  weight: number;
  imageUrl: string;
}

const healthColors = {
  Excellent: 'text-forest-600 bg-forest-100 dark:bg-forest-900/30 dark:text-forest-400',
  Good: 'text-honey-600 bg-honey-100 dark:bg-honey-900/30 dark:text-honey-400',
  Fair: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  Poor: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
};

const HiveCard = ({
  id,
  name,
  queenAge,
  lastInspection,
  health,
  temperature,
  humidity,
  weight,
  imageUrl,
}: HiveCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            healthColors[health as keyof typeof healthColors] || healthColors.Good
          )}>
            {health}
          </div>
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
          <Crown className="w-3.5 h-3.5 mr-1 text-honey-500" />
          <span>Queen: {queenAge} year{queenAge > 1 ? 's' : ''} old</span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Last inspection: {new Date(lastInspection).toLocaleDateString()}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Thermometer className="w-4 h-4 text-red-500 mb-1" />
            <span className="text-sm font-medium">{temperature}°C</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Temp</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-500 mb-1" />
            <span className="text-sm font-medium">{humidity}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Humid</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Scale className="w-4 h-4 text-forest-500 mb-1" />
            <span className="text-sm font-medium">{weight}kg</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Weight</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-5 pt-0">
        <Link to={`/hives/${id}`}>
          <Button 
            variant="outline"
            className="w-full mt-4"
          >
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default HiveCard;
