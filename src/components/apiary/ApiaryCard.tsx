
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ApiaryCardProps {
  id: string;
  name: string;
  location: string;
  totalHives: number;
  imageUrl: string;
  lastInspection: string;
}

const ApiaryCard = ({
  id,
  name,
  location,
  totalHives,
  imageUrl,
  lastInspection,
}: ApiaryCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
              {name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Last inspected: {new Date(lastInspection).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
          <Archive className="w-5 h-5 text-honey-500 mr-2" />
          <span className="text-sm font-medium">{totalHives} Hives</span>
        </div>
      </div>
      
      <div className="mt-auto p-5 pt-0">
        <Link to={`/apiaries/${id}`}>
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

export default ApiaryCard;
