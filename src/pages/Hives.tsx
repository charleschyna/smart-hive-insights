
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchHives = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('hives')
          .select(`
            *,
            apiaries(name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching hives:', error);
          toast({
            title: 'Error',
            description: 'Failed to load hives',
            variant: 'destructive',
          });
          setHives([]);
        } else {
          setHives(data || []);
        }
      } catch (error) {
        console.error('Error fetching hives:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading hives',
          variant: 'destructive',
        });
        setHives([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHives();
    
    // Set up real-time subscription
    const hivesSubscription = supabase
      .channel('public:hives')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'hives',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setHives(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setHives(prev => prev.map(hive => hive.id === payload.new.id ? payload.new : hive));
        } else if (payload.eventType === 'DELETE') {
          setHives(prev => prev.filter(hive => hive.id !== payload.old.id));
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(hivesSubscription);
    };
  }, [navigate, supabase, toast, user]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
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
                  <HiveCard
                    key={hive.id}
                    id={hive.id}
                    name={hive.name}
                    queenAge={hive.queen_age}
                    lastInspection={hive.last_inspection}
                    health={hive.health}
                    temperature={hive.temperature}
                    humidity={hive.humidity}
                    weight={hive.weight}
                    imageUrl={hive.image_url || '/placeholder.svg'}
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

export default Hives;
