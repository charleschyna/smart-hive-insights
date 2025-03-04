
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user is on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Check if user is logged in (placeholder)
  const isLoggedIn = location.pathname !== '/' && !isAuthPage;
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNotification = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
      duration: 3000,
    });
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  if (isAuthPage) return null;
  
  return (
    <motion.header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-glass shadow-subtle' : 'bg-transparent'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.span 
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-honey-500 to-honey-600"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Smart Nyuki
            </motion.span>
          </Link>
        </div>
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-1 sm:space-x-3">
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotification}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
            
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/profile">
                  <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-honey-500">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-forest-100 text-forest-800">BK</AvatarFallback>
                  </Avatar>
                </Link>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isMobile ? (
              <>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                
                {isMenuOpen && (
                  <motion.div 
                    className="absolute top-full right-0 left-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-glass p-4 shadow-md mt-1 flex flex-col space-y-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link to="/login" className="block w-full">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/signup" className="block w-full">
                      <Button className="w-full bg-honey-500 hover:bg-honey-600 text-black">Sign up</Button>
                    </Link>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-honey-500 hover:bg-honey-600 text-black">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
