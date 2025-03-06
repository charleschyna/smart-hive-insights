
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, PlusCircle, ArrowLeft, Edit, Trash2 } from 'lucide-react';
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

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !id) return;
        
        // Fetch apiary details
        const { data: apiaryData, error: apiaryError } = await supabase
          .from('apiaries')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (apiaryError) {
          console.error('Error fetching apiary:', apiaryError);
          navigate('/apiaries');
          return;
        }
        
        if (!apiaryData) {
          navigate('/apiaries');
          return;
        }
        
        setApiary(apiaryData);
        
        // Fetch hives associated with this apiary
        const { data: hivesData, error: hivesError } = await supabase
          .from('hives')
          .select('*')
          .eq('apiary_id', id)
          .order('created_at', { ascending: false });
        
        if (hivesError) {
          console.error('Error fetching hives:', hivesError);
          return;
        }
        
        setHives(hivesData || []);
      } catch (err) {
        console.error('Unexpected error in apiary details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('apiary-detail-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives',
          filter: `apiary_id=eq.${id}`
        }, 
        () => {
          fetchData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate, user]);

  const handleDeleteHive = async (hiveId: string, hiveName: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('hives')
        .delete()
        .eq('id', hiveId);
      
      if (error) {
        console.error('Error deleting hive:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete hive. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update apiary hive count in Supabase
      await supabase.rpc('decrement_hive_count', { apiary_id_param: id });
      
      // Update UI
      setHives(hives.filter(h => h.id !== hiveId));
      setApiary({...apiary, total_hives: Math.max(0, (apiary.total_hives || 1) - 1)});
      
      // Notify user
      toast({
        title: 'Hive Deleted',
        description: `${hiveName} has been removed from ${apiary.name}`,
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
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Navbar />
          <main className="flex-1 flex items-center justify-center mt-16">
            <p>Loading apiary details...</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link to="/apiaries">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Apiaries
                </Link>
              </Button>
            </div>
            
            {/* Apiary Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{apiary.name}</h1>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{apiary.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Established: {new Date(apiary.established).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/apiaries/${id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{apiary.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/40 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Hives</p>
                      <p className="text-2xl font-bold">{apiary.total_hives || 0}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Last Inspection</p>
                      <p className="text-2xl font-bold">{new Date(apiary.last_inspection).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Map view will be displayed here</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Coordinates: {apiary.coordinates || 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Hives Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hives in this Apiary</h2>
                <Button asChild>
                  <Link to={`/hives/new`} state={{ preselectedApiaryId: id }}>
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                  </Link>
                </Button>
              </div>
              
              {hives.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No hives in this apiary yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first hive to this apiary</p>
                  <Button asChild size="sm">
                    <Link to="/hives/new" state={{ preselectedApiaryId: id }}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Hive to this Apiary
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiaryDetail;
