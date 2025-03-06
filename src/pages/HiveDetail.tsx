
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import { useHiveData } from '@/hooks/useHiveData';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  
  const handleDeleteHive = async () => {
    if (!hive || !user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('hives')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting hive:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete hive. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update apiary hive count
      if (hive.apiary_id) {
        await supabase.rpc('decrement_hive_count', { apiary_id_param: hive.apiary_id });
      }
      
      // Notify user
      toast({
        title: 'Hive Deleted',
        description: `${hive.name} has been deleted successfully`,
      });
      
      // Navigate back to hives
      navigate('/hives');
    } catch (err) {
      console.error('Unexpected error deleting hive:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
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
                    Are you sure you want to delete "{hive?.name}"? This action cannot be undone.
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
