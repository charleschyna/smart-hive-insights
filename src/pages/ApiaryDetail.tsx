
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import HiveCard from '@/components/hive/HiveCard';
import PageTransition from '@/components/layout/PageTransition';

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchApiaryDetails = async () => {
      try {
        if (!user || !id) return;
        
        // Fetch apiary details
        const { data: apiaryData, error: apiaryError } = await supabase
          .from('apiaries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (apiaryError) {
          console.error('Error fetching apiary:', apiaryError);
          return;
        }
        
        setApiary(apiaryData);
        
        // Fetch hives for this apiary
        const { data: hivesData, error: hivesError } = await supabase
          .from('hives')
          .select('*')
          .eq('apiary_id', id)
          .eq('user_id', user.id);
        
        if (hivesError) {
          console.error('Error fetching hives:', hivesError);
          return;
        }
        
        setHives(hivesData || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error in apiary details:', err);
      }
    };
    
    fetchApiaryDetails();
    
    // Set up real-time subscription for hives
    const apiaryId = id;
    const userId = user?.id;
    
    const channel = supabase
      .channel('apiary-detail-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives',
          filter: `apiary_id=eq.${apiaryId}`
        }, 
        () => {
          fetchApiaryDetails();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-honey-500" />
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto p-6">
        {apiary && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{apiary.name}</h1>
                <p className="text-muted-foreground mt-1">{apiary.location || 'No location specified'}</p>
              </div>
              
              <Button asChild>
                <Link to={`/hives/new?apiary=${apiary.id}`}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Hive
                </Link>
              </Button>
            </div>
            
            <div className="bg-white dark:bg-sidebar p-6 rounded-xl shadow-glass">
              <h2 className="text-xl font-semibold mb-4">Apiary Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1">Description</p>
                  <p className="font-medium">{apiary.description || 'No description provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{apiary.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Hives</p>
                  <p className="font-medium">{hives.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">
                    {apiary.created_at ? new Date(apiary.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">Hives in this Apiary</h2>
              
              {hives.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No hives in this apiary yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first hive to start monitoring</p>
                  <Button asChild size="sm">
                    <Link to={`/hives/new?apiary=${apiary.id}`}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add First Hive
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
                      queenColor={hive.queen_color}
                      lastInspection={hive.last_inspection}
                      apiaryName={apiary.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ApiaryDetail;
