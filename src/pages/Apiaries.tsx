
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ApiaryCard from '@/components/apiary/ApiaryCard';
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

const Apiaries = () => {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load apiaries from localStorage
    const loadApiaries = () => {
      const storedApiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
      setApiaries(storedApiaries);
      setLoading(false);
    };

    loadApiaries();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadApiaries();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteApiary = (id: string) => {
    // Remove apiary from localStorage
    const updatedApiaries = apiaries.filter(apiary => apiary.id !== id);
    localStorage.setItem('apiaries', JSON.stringify(updatedApiaries));
    
    // Remove hives associated with this apiary
    const hives = JSON.parse(localStorage.getItem('hives') || '[]');
    const updatedHives = hives.filter((hive: any) => hive.apiaryId !== id);
    localStorage.setItem('hives', JSON.stringify(updatedHives));
    
    // Add activity event
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'apiary_deleted',
      entityId: id,
      timestamp: new Date().toISOString(),
      description: `Apiary was deleted`
    });
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Update UI
    setApiaries(updatedApiaries);
    
    // Notify user
    toast({
      title: 'Apiary Deleted',
      description: 'The apiary has been removed successfully',
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
              <h1 className="text-2xl font-bold text-left">Manage Apiaries</h1>
              <Button asChild>
                <Link to="/apiaries/new">
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Apiary
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading apiaries...</p>
              </div>
            ) : apiaries.length === 0 ? (
              <div className="bg-muted/30 rounded-xl p-12 text-center">
                <h3 className="text-xl font-medium mb-2">No apiaries yet</h3>
                <p className="text-muted-foreground mb-6">Add your first apiary to get started with hive management</p>
                <Button asChild>
                  <Link to="/apiaries/new">
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Your First Apiary
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiaries.map((apiary) => (
                  <div key={apiary.id} className="relative">
                    <ApiaryCard
                      id={apiary.id}
                      name={apiary.name}
                      location={apiary.location}
                      totalHives={apiary.totalHives || 0}
                      imageUrl={apiary.imageUrl || '/placeholder.svg'}
                      lastInspection={apiary.lastInspection || new Date().toISOString()}
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
                          <AlertDialogTitle>Delete Apiary</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{apiary.name}"? This will also remove all hives associated with this apiary. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteApiary(apiary.id)}
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

export default Apiaries;
