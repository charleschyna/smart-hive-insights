
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NewApiary = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    coordinates: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create an apiary',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const newApiary = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        coordinates: formData.coordinates,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('apiaries')
        .insert(newApiary)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating apiary:', error);
        toast({
          title: 'Failed to create apiary',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Apiary Added',
        description: `${formData.name} has been successfully added`,
      });
      
      navigate('/apiaries');
    } catch (error) {
      console.error('Error in apiary creation:', error);
      toast({
        title: 'An error occurred',
        description: 'Something went wrong while creating the apiary',
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
                onClick={() => navigate('/apiaries')}
                className="mr-4"
              >
                ← Back to Apiaries
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">Add New Apiary</h1>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Apiary Name*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="E.g., Mountain Valley Apiary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="location">
                        Location*
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="E.g., Nairobi, Kenya"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="coordinates">
                        Coordinates
                      </label>
                      <Input
                        id="coordinates"
                        name="coordinates"
                        value={formData.coordinates}
                        onChange={handleChange}
                        placeholder="E.g., -1.286389, 36.817223"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-input p-2"
                        placeholder="Describe your apiary's location, environment, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/apiaries')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Apiary'}
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

export default NewApiary;
