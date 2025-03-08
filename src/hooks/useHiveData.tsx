
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useHiveData = (id: string | undefined) => {
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const { toast } = useToast();
  const [hive, setHive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Generate mock data for the monitoring time series
  const timeSeriesData = {
    temperature: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 34 + Math.random() * 2
    })),
    humidity: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 63 + Math.random() * 5
    })),
    weight: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 31.5 + Math.random() * 1
    }))
  };
  
  useEffect(() => {
    if (!id || !user) return;
    
    const fetchHive = async () => {
      setLoading(true);
      
      try {
        // Fetch hive data from Supabase
        const { data, error } = await supabase
          .from('hives')
          .select(`
            *,
            apiaries(name)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching hive:', error);
          toast({
            title: 'Error',
            description: 'Failed to load hive data',
            variant: 'destructive',
          });
          navigate('/hives');
          return;
        }
        
        if (!data) {
          toast({
            title: 'Hive not found',
            description: 'The requested hive does not exist or you do not have access to it',
            variant: 'destructive',
          });
          navigate('/hives');
          return;
        }
        
        setHive(data);
      } catch (error) {
        console.error('Error in hive fetch:', error);
        toast({
          title: 'An error occurred',
          description: 'Something went wrong while loading the hive data',
          variant: 'destructive',
        });
        navigate('/hives');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHive();
    
    // Set up subscription for real-time updates
    const hiveSubscription = supabase
      .channel(`hive:${id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'hives',
        filter: `id=eq.${id}`
      }, (payload) => {
        setHive(payload.new);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(hiveSubscription);
    };
  }, [id, navigate, supabase, toast, user]);

  return { hive, loading, timeSeriesData };
};
