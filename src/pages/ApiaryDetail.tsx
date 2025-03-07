
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import ApiaryCard from '@/components/apiary/ApiaryCard';
import HiveCard from '@/components/hive/HiveCard';
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchApiary = async () => {
      try {
        if (!id || !user) return;

        const { data, error } = await supabase
          .from('apiaries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching apiary:', error);
          toast({
            title: "Error",
            description: "Failed to load apiary details",
            variant: "destructive",
          });
          navigate('/apiaries');
          return;
        }
        
        if (!data) {
          toast({
            title: "Not Found",
            description: "The apiary you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate('/apiaries');
          return;
        }
        
        setApiary(data);
        fetchHives();
      } catch (err) {
        console.error('Unexpected error in apiary details:', err);
        navigate('/apiaries');
      }
    };
    
    const fetchHives = async () => {
      try {
        if (!id || !user) return;
        
        const { data, error } = await supabase
          .from('hives')
          .select('*')
          .eq('apiary_id', id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching hives:', error);
          return;
        }
        
        setHives(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching hives:', err);
        setLoading(false);
      }
    };
    
    fetchApiary();
    
    // Set up subscription for real-time updates to hives
    const hivesSubscription = supabase
      .channel('apiary-hives-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives',
          filter: `apiary_id=eq.${id}`
        }, 
        (payload) => {
          fetchHives();
        }
      )
      .subscribe();
    
    // Set up subscription for real-time updates to the apiary
    const apiarySubscription = supabase
      .channel('apiary-detail-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'apiaries',
          filter: `id=eq.${id}`
        }, 
        (payload) => {
          setApiary(payload.new);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(hivesSubscription);
      supabase.removeChannel(apiarySubscription);
    };
  }, [id, navigate, toast, user]);
  
  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-honey-500" />
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" size="sm" className="mr-4">
            <Link to="/apiaries">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Apiaries
            </Link>
          </Button>
        </div>
        
        {apiary && (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{apiary.name}</h1>
                <p className="text-muted-foreground">{apiary.location || 'No location specified'}</p>
              </div>
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/apiaries/${id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Apiary
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/hives/new" state={{ apiaryId: id as string }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Hive
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Hives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{apiary.total_hives || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Established</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{new Date(apiary.established).toLocaleDateString()}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Last Inspection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{new Date(apiary.last_inspection).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </div>
            
            {apiary.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{apiary.description}</p>
              </div>
            )}
            
            <Separator className="mb-8" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Hives in this Apiary</h2>
              
              {hives.length === 0 ? (
                <div className="text-center p-10 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No hives have been added to this apiary yet.</p>
                  <Button asChild>
                    <Link to="/hives/new" state={{ apiaryId: id }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Your First Hive
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hives.map((hive) => (
                    <HiveCard key={hive.id} hive={hive} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default ApiaryDetail;
