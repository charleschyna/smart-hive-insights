
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useHiveData = (id: string | undefined) => {
  const navigate = useNavigate();
  const [hive, setHive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Mock data for the monitoring time series
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
    const fetchHiveData = async () => {
      try {
        if (!user || !id) return;
        
        const { data, error } = await supabase
          .from('hives')
          .select(`
            *,
            apiary:apiary_id (
              id,
              name
            )
          `)
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching hive:', error);
          navigate('/hives');
          return;
        }
        
        if (!data) {
          navigate('/hives');
          return;
        }
        
        setHive(data);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error in hive details:', err);
        navigate('/hives');
      }
    };
    
    fetchHiveData();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('hive-detail-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'hives',
          filter: `id=eq.${id}`
        }, 
        () => {
          fetchHiveData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate, user]);

  return { hive, loading, timeSeriesData };
};
