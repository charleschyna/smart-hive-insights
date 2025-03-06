
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user is on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Check if user is logged in
  const isLoggedIn = !!user;
  
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
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };
  
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
            <img src="/Logo_nobg.png" alt="Logo" className="h-12 w-auto" />
            <motion.span 
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-honey-500 to-honey-600"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-honey-500 cursor-pointer">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-forest-100 text-forest-800">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
