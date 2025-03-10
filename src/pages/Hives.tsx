
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load hives from localStorage
    const loadHives = () => {
      const storedHives = JSON.parse(localStorage.getItem('hives') || '[]');
      setHives(storedHives);
      setLoading(false);
    };

    loadHives();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadHives();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteHive = (id: string, name: string) => {
    // Remove hive from localStorage
    const updatedHives = hives.filter(hive => hive.id !== id);
    localStorage.setItem('hives', JSON.stringify(updatedHives));
    
    // Update apiaries to reflect hive count changes
    const apiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
    const hive = hives.find(h => h.id === id);
    
    if (hive && hive.apiaryId) {
      const updatedApiaries = apiaries.map((apiary: any) => {
        if (apiary.id === hive.apiaryId) {
          const totalHives = (apiary.totalHives || 1) - 1;
          return { ...apiary, totalHives: totalHives < 0 ? 0 : totalHives };
        }
        return apiary;
      });
      localStorage.setItem('apiaries', JSON.stringify(updatedApiaries));
    }
    
    // Add activity event
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'hive_deleted',
      entityId: id,
      entityName: name,
      timestamp: new Date().toISOString(),
      description: `Hive "${name}" was deleted`
    });
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Update UI
    setHives(updatedHives);
    
    // Notify user
    toast({
      title: 'Hive Deleted',
      description: `${name} has been removed successfully`,
    });
    
    // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Manage Hives</h1>
              <Button asChild>
                <Link to="/hives/new">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading hives...</p>
              </div>
            ) : hives.length === 0 ? (
              <div className="bg-muted/30 rounded-xl p-12 text-center">
                <h3 className="text-xl font-medium mb-2">No hives yet</h3>
                <p className="text-muted-foreground mb-6">Add your first hive to start monitoring</p>
                <Button asChild>
                  <Link to="/hives/new">
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Your First Hive
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hives.map((hive) => (
                  <div key={hive.id} className="relative">
                    <HiveCard
                      id={hive.id}
                      name={hive.name}
                      queenAge={hive.queenAge}
                      lastInspection={hive.lastInspection}
                      health={hive.health}
                      temperature={hive.temperature}
                      humidity={hive.humidity}
                      weight={hive.weight}
                      imageUrl={hive.imageUrl}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Hive</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{hive.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteHive(hive.id, hive.name)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hives;
