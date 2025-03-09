
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ApiaryCard from '@/components/apiary/ApiaryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Apiaries = () => {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchApiaries = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('apiaries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching apiaries:', error);
          toast({
            title: 'Error',
            description: 'Failed to load apiaries',
            variant: 'destructive',
          });
          setApiaries([]);
        } else {
          setApiaries(data || []);
        }
      } catch (error) {
        console.error('Error fetching apiaries:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading apiaries',
          variant: 'destructive',
        });
        setApiaries([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApiaries();
    
    // Set up real-time subscription
    const apiariesSubscription = supabase
      .channel('public:apiaries')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'apiaries',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setApiaries(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setApiaries(prev => prev.map(apiary => apiary.id === payload.new.id ? payload.new : apiary));
        } else if (payload.eventType === 'DELETE') {
          setApiaries(prev => prev.filter(apiary => apiary.id !== payload.old.id));
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(apiariesSubscription);
    };
  }, [navigate, supabase, toast, user]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'} mt-16`}>
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
                  <ApiaryCard
                    key={apiary.id}
                    id={apiary.id}
                    name={apiary.name}
                    location={apiary.location || 'Unknown location'}
                    totalHives={apiary.total_hives || 0}
                    imageUrl={apiary.image_url || '/placeholder.svg'}
                    lastInspection={apiary.last_inspection || new Date().toISOString()}
                  />
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
