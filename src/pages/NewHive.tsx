
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Archive, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const NewHive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const { user } = useAuth();
  
  // Get preselected apiary ID from location state if provided
  const preselectedApiaryId = location.state?.preselectedApiaryId || '';
  
  const [formData, setFormData] = useState({
    name: '',
    apiaryId: preselectedApiaryId,
    queenAge: '1',
    queenColor: 'Blue',
    beeType: 'Italian',
    notes: '',
  });

  useEffect(() => {
    const fetchApiaries = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('apiaries')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching apiaries:', error);
          return;
        }
        
        setApiaries(data || []);
        
        // Set default apiaryId if any apiaries exist and none is preselected
        if (data && data.length > 0 && !formData.apiaryId) {
          setFormData(prev => ({ ...prev, apiaryId: data[0].id }));
        }
      } catch (err) {
        console.error('Unexpected error fetching apiaries:', err);
      }
    };

    fetchApiaries();
  }, [user, formData.apiaryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a hive',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const selectedApiary = apiaries.find(a => a.id === formData.apiaryId);
      
      if (!selectedApiary) {
        toast({
          title: 'Error',
          description: 'Please select a valid apiary',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      const now = new Date().toISOString();
      
      const newHive = {
        user_id: user.id,
        apiary_id: formData.apiaryId,
        name: formData.name,
        queen_age: parseInt(formData.queenAge),
        queen_color: formData.queenColor,
        bee_type: formData.beeType,
        notes: formData.notes,
        queen_installed: now,
        last_inspection: now,
        health: 'Good',
        temperature: 35,
        humidity: 65,
        weight: 30,
        activity: 'Normal',
        image_url: '/placeholder.svg'
      };
      
      const { data, error } = await supabase
        .from('hives')
        .insert(newHive)
        .select();
      
      if (error) {
        console.error('Error adding hive:', error);
        toast({
          title: 'Error',
          description: 'Failed to add hive. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update apiary hive count
      await supabase.rpc('increment_hive_count', { apiary_id_param: formData.apiaryId });
      
      toast({
        title: 'Hive Added',
        description: `${formData.name} has been successfully added to ${selectedApiary.name || 'the apiary'}`,
      });
      navigate('/hives');
    } catch (error) {
      console.error('Error adding hive:', error);
      toast({
        title: 'Error',
        description: 'Failed to add hive. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 ml-16 md:ml-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/hives')}
                className="mr-4"
              >
                ← Back to Hives
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">Add New Hive</h1>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Hive Name*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="E.g., Hive A1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="apiaryId">
                        Apiary*
                      </label>
                      <select
                        id="apiaryId"
                        name="apiaryId"
                        value={formData.apiaryId}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input p-2"
                        required
                      >
                        {apiaries.length === 0 ? (
                          <option value="">No apiaries available - please add an apiary first</option>
                        ) : (
                          apiaries.map(apiary => (
                            <option key={apiary.id} value={apiary.id}>
                              {apiary.name} ({apiary.location})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="queenAge">
                          Queen Age (years)
                        </label>
                        <select
                          id="queenAge"
                          name="queenAge"
                          value={formData.queenAge}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input p-2"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="queenColor">
                          Queen Color Marking
                        </label>
                        <select
                          id="queenColor"
                          name="queenColor"
                          value={formData.queenColor}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input p-2"
                        >
                          <option value="White">White</option>
                          <option value="Yellow">Yellow</option>
                          <option value="Red">Red</option>
                          <option value="Green">Green</option>
                          <option value="Blue">Blue</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="beeType">
                        Bee Type
                      </label>
                      <select
                        id="beeType"
                        name="beeType"
                        value={formData.beeType}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input p-2"
                      >
                        <option value="Italian">Italian</option>
                        <option value="Carniolan">Carniolan</option>
                        <option value="Buckfast">Buckfast</option>
                        <option value="Russian">Russian</option>
                        <option value="Caucasian">Caucasian</option>
                        <option value="African">African</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="notes">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-input p-2"
                        placeholder="Additional notes about this hive"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/hives')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || apiaries.length === 0}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Hive'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewHive;
