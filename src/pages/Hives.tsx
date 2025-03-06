
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
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

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHives = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('hives')
          .select(`
            *,
            apiary:apiary_id (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching hives:', error);
          return;
        }
        
        setHives(data || []);
      } catch (err) {
        console.error('Unexpected error fetching hives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHives();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('hives-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          fetchHives();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDeleteHive = async (id: string, name: string) => {
    try {
      // Find the hive to get the apiary_id
      const hive = hives.find(h => h.id === id);
      
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
      if (hive && hive.apiary_id) {
        await supabase.rpc('decrement_hive_count', { apiary_id_param: hive.apiary_id });
      }
      
      // Update UI
      setHives(hives.filter(h => h.id !== id));
      
      // Notify user
      toast({
        title: 'Hive Deleted',
        description: `${name} has been removed successfully`,
      });
    } catch (err) {
      console.error('Unexpected error deleting hive:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
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
                      queenAge={hive.queen_age}
                      lastInspection={hive.last_inspection}
                      health={hive.health || 'Good'}
                      temperature={hive.temperature}
                      humidity={hive.humidity}
                      weight={hive.weight}
                      imageUrl={hive.image_url || '/placeholder.svg'}
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
