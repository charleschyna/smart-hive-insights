
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Archive, Crown } from 'lucide-react';

const NewHive = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiaries, setApiaries] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    apiaryId: '',
    queenAge: '1',
    queenColor: 'Blue',
    beeType: 'Italian',
    notes: '',
  });

  useEffect(() => {
    // Load apiaries from localStorage
    const storedApiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
    setApiaries(storedApiaries);
    
    // Set default apiaryId if any apiaries exist
    if (storedApiaries.length > 0) {
      setFormData(prev => ({ ...prev, apiaryId: storedApiaries[0].id }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      // Find the selected apiary
      const selectedApiary = apiaries.find(a => a.id === formData.apiaryId);
      
      // Mock adding hive to local storage
      const hives = JSON.parse(localStorage.getItem('hives') || '[]');
      const newHive = {
        id: Date.now().toString(),
        ...formData,
        queenAge: parseInt(formData.queenAge),
        queenInstalled: new Date().toISOString(),
        lastInspection: new Date().toISOString(),
        health: 'Good',
        temperature: 35,
        humidity: 65,
        weight: 30,
        activity: 'Normal',
        sound: 'Normal',
        imageUrl: '/placeholder.svg',
        apiary: {
          id: selectedApiary?.id,
          name: selectedApiary?.name
        }
      };
      
      hives.push(newHive);
      localStorage.setItem('hives', JSON.stringify(hives));
      
      // Update apiary hive count
      if (selectedApiary) {
        const updatedApiaries = apiaries.map(apiary => {
          if (apiary.id === selectedApiary.id) {
            return {
              ...apiary,
              totalHives: (apiary.totalHives || 0) + 1
            };
          }
          return apiary;
        });
        localStorage.setItem('apiaries', JSON.stringify(updatedApiaries));
      }
      
      // Add activity event
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        type: 'hive_added',
        entityId: newHive.id,
        entityName: newHive.name,
        timestamp: new Date().toISOString(),
        description: `New hive "${newHive.name}" was added to ${selectedApiary?.name || 'an apiary'}`
      });
      localStorage.setItem('activities', JSON.stringify(activities));

      setIsSubmitting(false);
      toast({
        title: 'Hive Added',
        description: `${formData.name} has been successfully added to ${selectedApiary?.name || 'the apiary'}`,
      });
      navigate('/hives');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Add New Hive" />
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
