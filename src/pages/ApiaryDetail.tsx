
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveCard from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, PlusCircle, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Load apiary and associated hives from localStorage
    const loadData = () => {
      const apiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
      const foundApiary = apiaries.find((a: any) => a.id === id);
      
      if (!foundApiary) {
        navigate('/apiaries');
        return;
      }
      
      setApiary(foundApiary);
      
      // Find hives associated with this apiary
      const allHives = JSON.parse(localStorage.getItem('hives') || '[]');
      const apiaryHives = allHives.filter((h: any) => h.apiaryId === id);
      setHives(apiaryHives);
      
      setLoading(false);
    };
    
    loadData();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [id, navigate]);

  const handleDeleteHive = (hiveId: string, hiveName: string) => {
    // Remove hive from localStorage
    const updatedHives = hives.filter(hive => hive.id !== hiveId);
    const allHives = JSON.parse(localStorage.getItem('hives') || '[]');
    const updatedAllHives = allHives.filter((hive: any) => hive.id !== hiveId);
    localStorage.setItem('hives', JSON.stringify(updatedAllHives));
    
    // Update apiary to reflect hive count change
    const apiaries = JSON.parse(localStorage.getItem('apiaries') || '[]');
    const updatedApiaries = apiaries.map((a: any) => {
      if (a.id === id) {
        const totalHives = (a.totalHives || 1) - 1;
        return { ...a, totalHives: totalHives < 0 ? 0 : totalHives };
      }
      return a;
    });
    localStorage.setItem('apiaries', JSON.stringify(updatedApiaries));
    
    // Update UI
    setHives(updatedHives);
    setApiary({...apiary, totalHives: (apiary.totalHives || 1) - 1});
    
    // Add activity event
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'hive_deleted',
      entityId: hiveId,
      entityName: hiveName,
      timestamp: new Date().toISOString(),
      description: `Hive "${hiveName}" was deleted from apiary "${apiary.name}"`
    });
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Notify user
    toast({
      title: 'Hive Deleted',
      description: `${hiveName} has been removed from ${apiary.name}`,
    });
    
    // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Navbar />
          <main className="flex-1 flex items-center justify-center mt-16">
            <p>Loading apiary details...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link to="/apiaries">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Apiaries
                </Link>
              </Button>
            </div>
            
            {/* Apiary Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{apiary.name}</h1>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{apiary.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Established: {new Date(apiary.established).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/apiaries/${id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{apiary.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/40 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Hives</p>
                      <p className="text-2xl font-bold">{apiary.totalHives || 0}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Last Inspection</p>
                      <p className="text-2xl font-bold">{new Date(apiary.lastInspection).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Map view will be displayed here</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Coordinates: {apiary.coordinates || 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Hives Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hives in this Apiary</h2>
                <Button asChild>
                  <Link to={`/hives/new`} state={{ preselectedApiaryId: id }}>
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                  </Link>
                </Button>
              </div>
              
              {hives.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No hives in this apiary yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first hive to this apiary</p>
                  <Button asChild size="sm">
                    <Link to="/hives/new" state={{ preselectedApiaryId: id }}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Hive to this Apiary
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hives.map((hive) => (
                    <div key={hive.id} className="relative">
                      <HiveCard
                        id={hive.id}
                        name={hive.name}
                        queenAge={hive.queenAge}
                        lastInspection={hive.lastInspection}
                        health={hive.health}
                        temperature={hive.temperature}
                        humidity={hive.humidity}
                        weight={hive.weight}
                        imageUrl={hive.imageUrl}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Hive</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{hive.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteHive(hive.id, hive.name)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiaryDetail;
