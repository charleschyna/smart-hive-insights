
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import HiveForm from '@/components/hive/HiveForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NewHive = () => {
  const [searchParams] = useSearchParams();
  const preSelectedApiaryId = searchParams.get('apiary');
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchApiaries = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('apiaries')
          .select('id, name')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching apiaries:', error);
          toast({
            title: 'Error',
            description: 'Failed to load apiaries. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        
        setApiaries(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchApiaries();
  }, [toast, user]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Add user_id to the hive data
      const hiveData = {
        ...formData,
        user_id: user.id,
      };
      
      // Insert the new hive
      const { data, error } = await supabase
        .from('hives')
        .insert(hiveData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding hive:', error);
        toast({
          title: 'Error',
          description: 'Failed to create hive. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: 'Success',
        description: 'Hive created successfully!',
      });
      
      // Redirect to the new hive's detail page
      navigate(`/hives/${data.id}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (loading && apiaries.length === 0) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-honey-500" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Add New Hive</h1>
        
        <div className="bg-white dark:bg-sidebar rounded-xl shadow-glass p-6">
          <HiveForm
            apiaries={apiaries}
            defaultApiaryId={preSelectedApiaryId || undefined}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default NewHive;
