
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Map, 
  Archive, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Apiaries', icon: Map, path: '/apiaries' },
  { name: 'Hives', icon: Archive, path: '/hives' },
  { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onToggle?: () => void;
}

const Sidebar = ({ isOpen, setIsOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  
  // Check if user is on auth pages or landing
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';
  
  // Hide sidebar on auth pages and landing
  if (isAuthPage || isLandingPage) return null;
  
  // Handle both controlled and uncontrolled state
  const sidebarOpen = isOpen !== undefined ? isOpen : !collapsed;
  
  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    } else if (setIsOpen) {
      setIsOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };
  
  useEffect(() => {
    if (!sidebarOpen) {
      const timer = setTimeout(() => setShowLabels(false), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLabels(true);
    }
  }, [sidebarOpen]);
  
  return (
    <motion.div
      className={`${styles.sidebar} fixed h-screen ${sidebarOpen ? styles.open : ''} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-20`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-center items-center border-b border-gray-200 dark:border-gray-800">
          <Link to="/dashboard" className="flex items-center justify-center">
            <img 
              src="/Logo_nobg.png" 
              alt="Smart Nyuki" 
              className={`transition-all duration-300 ${sidebarOpen ? 'h-12 w-auto' : 'h-10 w-auto'}`} 
            />
            {sidebarOpen && showLabels && (
              <motion.span 
                className="ml-2 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-honey-500 to-honey-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Smart Nyuki
              </motion.span>
            )}
          </Link>
        </div>
        
        <div className="py-6 flex-1">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <li key={item.name}>
                  <Link to={item.path}>
                    <motion.div
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg transition-all",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActive 
                          ? "bg-honey-100 dark:bg-honey-900/20 text-honey-600 dark:text-honey-400" 
                          : "text-gray-700 dark:text-gray-300"
                      )}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={cn("flex-shrink-0", isActive ? "text-honey-500" : "", !sidebarOpen ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3")} />
                      
                      {showLabels && sidebarOpen && (
                        <motion.span 
                          className={cn(
                            "font-medium text-sm whitespace-nowrap",
                            isActive ? "text-honey-600 dark:text-honey-400" : ""
                          )}
                          initial={{ opacity: !sidebarOpen ? 0 : 1 }}
                          animate={{ opacity: !sidebarOpen ? 0 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="border-t p-3">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
