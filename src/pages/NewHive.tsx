
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import HiveForm from '@/components/hive/HiveForm';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from '@/hooks/use-toast';

// Define the props type expected by HiveForm
interface HiveFormValues {
  name: string;
  apiary_id: string;
  queen_age: string;
  queen_color: string;
  health: string;
  notes: string;
}

interface HiveFormPropsWithValues {
  apiaries: any[];
  initialValues: HiveFormValues;
  onSubmit: (formData: any) => Promise<void>;
}

const NewHive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if we have an apiaryId from the navigation state
  const initialApiaryId = location.state?.apiaryId || '';
  
  useEffect(() => {
    const fetchApiaries = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('apiaries')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name');
        
        if (error) {
          console.error('Error fetching apiaries:', error);
          toast({
            title: "Error",
            description: "Failed to load apiaries",
            variant: "destructive",
          });
          return;
        }
        
        setApiaries(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching apiaries:', err);
        setLoading(false);
      }
    };
    
    fetchApiaries();
  }, [user]);
  
  const handleSubmit = async (formData: any) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a hive",
          variant: "destructive",
        });
        return;
      }
      
      // Add user_id to the form data
      const hiveData = {
        ...formData,
        user_id: user.id,
      };
      
      // Insert the new hive into the database
      const { data, error } = await supabase
        .from('hives')
        .insert(hiveData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating hive:', error);
        toast({
          title: "Error",
          description: "Failed to create hive",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Hive created successfully",
      });
      
      // Navigate to the hive detail page
      navigate(`/hives/${data.id}`);
    } catch (err) {
      console.error('Unexpected error creating hive:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Create initial values that match the expected HiveFormValues type
  const formInitialValues: HiveFormValues = {
    name: '',
    apiary_id: initialApiaryId,
    queen_age: '',
    queen_color: '',
    health: 'Healthy',
    notes: '',
  };
  
  return (
    <PageTransition>
      <div className="container max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Hive</h1>
        
        {loading ? (
          <div className="text-center p-10">
            <p>Loading apiaries...</p>
          </div>
        ) : apiaries.length === 0 ? (
          <div className="text-center p-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">You need to create an apiary before adding a hive.</p>
            <button 
              className="bg-honey-500 hover:bg-honey-600 text-black font-medium px-4 py-2 rounded"
              onClick={() => navigate('/apiaries/new')}
            >
              Create Your First Apiary
            </button>
          </div>
        ) : (
          <HiveForm
            apiaries={apiaries}
            initialValues={formInitialValues}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default NewHive;
