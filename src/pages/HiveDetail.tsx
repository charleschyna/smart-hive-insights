
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import { useHiveData } from '@/hooks/useHiveData';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hive, loading, timeSeriesData } = useHiveData(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleDeleteHive = () => {
    if (!hive) return;
    
    // Remove hive from localStorage
    const hives = JSON.parse(localStorage.getItem('hives') || '[]');
    const updatedHives = hives.filter((h: any) => h.id !== id);
    localStorage.setItem('hives', JSON.stringify(updatedHives));
    
    // Update apiary to reflect hive count change
    if (hive.apiaryId) {
      const apiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
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
      entityId: hive.id,
      entityName: hive.name,
      timestamp: new Date().toISOString(),
      description: `Hive "${hive.name}" was deleted`
    });
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Notify user
    toast({
      title: 'Hive Deleted',
      description: `${hive.name} has been deleted successfully`,
    });
    
    // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
    
    // Navigate back to hives
    navigate('/hives');
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Navbar />
          <main className="flex-1 flex items-center justify-center mt-16">
            <p>Loading hive details...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <div className="flex justify-end mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Hive
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
                    onClick={handleDeleteHive}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <HiveDetailContent hive={hive} timeSeriesData={timeSeriesData} />
        </main>
      </div>
    </div>
  );
};

export default HiveDetail;
