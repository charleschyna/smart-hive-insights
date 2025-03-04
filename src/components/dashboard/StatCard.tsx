
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: ReactNode;
  color: 'honey' | 'forest' | 'blue' | 'red' | 'purple';
  data?: { value: number }[];
  delay?: number;
}

const colorMap = {
  honey: {
    bg: 'bg-honey-50 dark:bg-honey-900/20',
    text: 'text-honey-600 dark:text-honey-400',
    fill: '#F6C213',
    fillOpacity: '0.2',
    stroke: '#F6C213',
  },
  forest: {
    bg: 'bg-forest-50 dark:bg-forest-900/20',
    text: 'text-forest-600 dark:text-forest-400',
    fill: '#73B888',
    fillOpacity: '0.2',
    stroke: '#73B888',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    fill: '#3B82F6',
    fillOpacity: '0.2',
    stroke: '#3B82F6',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    fill: '#EF4444',
    fillOpacity: '0.2',
    stroke: '#EF4444',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    fill: '#8B5CF6',
    fillOpacity: '0.2',
    stroke: '#8B5CF6',
  },
};

const defaultData = [
  { value: 5 },
  { value: 7 },
  { value: 4 },
  { value: 8 },
  { value: 6 },
  { value: 9 },
  { value: 7 },
  { value: 10 },
  { value: 8 },
  { value: 11 },
];

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  color,
  data = defaultData,
  delay = 0,
}: StatCardProps) => {
  const colorStyle = colorMap[color];
  
  return (
    <motion.div
      className={cn(
        "glass-card p-5 glass-card-hover",
        "flex flex-col justify-between h-full"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut", 
        delay: 0.1 + (delay * 0.1) 
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </span>
            
            {change && (
              <span
                className={cn(
                  "ml-2 text-xs font-medium",
                  isPositive ? "text-forest-600" : "text-red-600"
                )}
              >
                {isPositive ? "+" : ""}{change}
              </span>
            )}
          </div>
        </div>
        
        <div className={cn("p-2 rounded-md", colorStyle.bg)}>
          <div className={colorStyle.text}>{icon}</div>
        </div>
      </div>
      
      <div className="h-16 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorStyle.stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colorStyle.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorStyle.stroke}
              strokeWidth={2}
              fill={`url(#color${color})`}
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StatCard;
