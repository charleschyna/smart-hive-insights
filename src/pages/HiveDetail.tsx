
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveMonitoring from '@/components/hive/HiveMonitoring';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, Edit, Calendar, Thermometer, Droplets, 
  Scale, Activity, Crown, MapPin 
} from 'lucide-react';

const HiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hive, setHive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load hive from localStorage
    const loadData = () => {
      const hives = JSON.parse(localStorage.getItem('hives') || '[]');
      const foundHive = hives.find((h: any) => h.id === id);
      
      if (!foundHive) {
        navigate('/hives');
        return;
      }
      
      setHive(foundHive);
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
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar title="Loading..." />
          <main className="flex-1 flex items-center justify-center">
            <p>Loading hive details...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={hive.name} />
        <main className="flex-1 overflow-y-auto p-6 ml-16 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link to="/hives">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Hives
                </Link>
              </Button>
            </div>
            
            {/* Hive Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{hive.name}</h1>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <Link to={`/apiaries/${hive.apiaryId}`} className="hover:text-honey-600">
                          {hive.apiary?.name || 'Unknown Apiary'}
                        </Link>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Last Inspection: {new Date(hive.lastInspection).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/hives/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Thermometer className="h-4 w-4 mr-1 text-honey-500" />
                        <p className="text-xs text-muted-foreground">Temperature</p>
                      </div>
                      <p className="text-lg font-bold">{hive.temperature}°C</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Droplets className="h-4 w-4 mr-1 text-forest-500" />
                        <p className="text-xs text-muted-foreground">Humidity</p>
                      </div>
                      <p className="text-lg font-bold">{hive.humidity}%</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Scale className="h-4 w-4 mr-1 text-honey-500" />
                        <p className="text-xs text-muted-foreground">Weight</p>
                      </div>
                      <p className="text-lg font-bold">{hive.weight} kg</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Activity className="h-4 w-4 mr-1 text-forest-500" />
                        <p className="text-xs text-muted-foreground">Activity</p>
                      </div>
                      <p className="text-lg font-bold">{hive.activity}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Queen Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 mr-1 text-honey-500" />
                          <p className="text-sm">Age: {hive.queenAge} year{hive.queenAge > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                          <p className="text-sm">Color: {hive.queenColor}</p>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p className="text-sm">Installed: {new Date(hive.queenInstalled).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Health Status</h3>
                      <p className="text-sm">{hive.health}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                      <p className="text-sm">{hive.notes || 'No notes available'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Hive Image</h2>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    <img 
                      src={hive.imageUrl} 
                      alt={hive.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Bee Type: {hive.beeType}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Monitoring Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Monitoring Data (Last 24 Hours)</h2>
              <HiveMonitoring 
                temperatureData={timeSeriesData.temperature}
                humidityData={timeSeriesData.humidity}
                weightData={timeSeriesData.weight}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HiveDetail;
