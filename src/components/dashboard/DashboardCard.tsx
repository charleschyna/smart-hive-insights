
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

const DashboardCard = ({ 
  title, 
  icon, 
  children, 
  className,
  delay = 0
}: DashboardCardProps) => {
  return (
    <motion.div
      className={cn(
        "glass-card p-5 glass-card-hover",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut", 
        delay: 0.2 + (delay * 0.1) 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {icon && (
          <div className="text-forest-500 dark:text-forest-400">
            {icon}
          </div>
        )}
      </div>
      
      {children}
    </motion.div>
  );
};

export default DashboardCard;
