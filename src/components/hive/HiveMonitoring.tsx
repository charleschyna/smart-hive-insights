
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HiveMonitoringProps {
  temperature: {
    current: number;
    previous: number;
  };
  humidity: {
    current: number;
    previous: number;
  };
  weight: {
    current: number;
    previous: number;
  };
  sound: {
    current: number;
    previous: number;
  };
}

const StatusCard = ({ 
  title, 
  value, 
  unit, 
  previous, 
  icon, 
  color,
  isHigherBetter = false,
  delay 
}: {
  title: string;
  value: number;
  unit: string;
  previous: number;
  icon: React.ReactNode;
  color: string;
  isHigherBetter?: boolean;
  delay: number;
}) => {
  const diff = value - previous;
  const percentChange = previous !== 0 ? (diff / previous) * 100 : 0;
  
  const renderChangeIcon = () => {
    if (Math.abs(diff) < 0.01) {
      return <Minus className="w-3 h-3" />;
    }
    return diff > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };
  
  const getChangeColor = () => {
    if (Math.abs(diff) < 0.01) return "text-gray-500";
    if (isHigherBetter) {
      return diff > 0 ? "text-forest-600" : "text-red-600";
    } else {
      return diff > 0 ? "text-red-600" : "text-forest-600";
    }
  };
  
  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + (delay * 0.1) }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-md bg-${color}-50 dark:bg-${color}-900/20 text-${color}-500 mr-3`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
        </div>
        
        <div 
          className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            getChangeColor()
          )}
        >
          {renderChangeIcon()}
          <span className="ml-1">
            {Math.abs(percentChange).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-semibold text-gray-900 dark:text-white">
          {value}
        </span>
        <span className="ml-1 text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Previous: {previous} {unit}
      </div>
    </motion.div>
  );
};

const HiveMonitoring = ({
  temperature,
  humidity,
  weight,
  sound
}: HiveMonitoringProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatusCard
        title="Temperature"
        value={temperature.current}
        unit="°C"
        previous={temperature.previous}
        icon={<Thermometer className="w-5 h-5" />}
        color="honey"
        delay={0}
      />
      
      <StatusCard
        title="Humidity"
        value={humidity.current}
        unit="%"
        previous={humidity.previous}
        icon={<Droplets className="w-5 h-5" />}
        color="forest"
        delay={1}
      />
      
      <StatusCard
        title="Weight"
        value={weight.current}
        unit="kg"
        previous={weight.previous}
        icon={<Weight className="w-5 h-5" />}
        color="purple"
        isHigherBetter={true}
        delay={2}
      />
      
      <StatusCard
        title="Sound Level"
        value={sound.current}
        unit="Hz"
        previous={sound.previous}
        icon={<Volume2 className="w-5 h-5" />}
        color="blue"
        delay={3}
      />
    </div>
  );
};

export default HiveMonitoring;
