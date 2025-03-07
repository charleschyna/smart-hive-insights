
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useHiveData } from '@/hooks/useHiveData';
import HiveHeader from '@/components/hive/HiveHeader';
import HiveDetailContent from '@/components/hive/HiveDetailContent';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hive, setHive] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching hive:', error);
          toast({
            title: "Error",
            description: "Failed to load hive details",
            variant: "destructive",
          });
          navigate('/hives');
          return;
        }
        
        if (!data) {
          toast({
            title: "Not Found",
            description: "The hive you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate('/hives');
          return;
        }
        
        setHive(data);
        
        // Mock data for the monitoring time series
        const mockTimeSeriesData = {
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
        
        setTimeSeriesData(mockTimeSeriesData);
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
        (payload) => {
          setHive(prev => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
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
        {hive && (
          <>
            <HiveHeader 
              name={hive.name}
              apiaryId={hive.apiary?.id}
              apiaryName={hive.apiary?.name}
              lastInspection={hive.last_inspection}
              id={hive.id}
            />
            
            <HiveDetailContent 
              hive={hive}
              timeSeriesData={timeSeriesData}
            />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default HiveDetail;
