
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { HiveCard } from '@/components/hive/HiveCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, PlusCircle, ArrowLeft, Edit } from 'lucide-react';

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - In a real app, this would come from an API
  const apiary = {
    id: id,
    name: 'Mountain Valley Apiary',
    location: 'Nairobi, Kenya',
    description: 'Located on the eastern slopes with excellent sun exposure and nearby water source.',
    established: '2022-03-15',
    lastInspection: '2023-08-15',
    coordinates: '-1.286389, 36.817223',
    imageUrl: '/placeholder.svg'
  };
  
  const hives = [
    {
      id: '1',
      name: 'Hive A1',
      queenAge: 1,
      lastInspection: '2023-08-15',
      health: 'Good',
      temperature: 35,
      humidity: 65,
      weight: 32,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Hive A2',
      queenAge: 2,
      lastInspection: '2023-08-10',
      health: 'Excellent',
      temperature: 34.5,
      humidity: 68,
      weight: 29,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Hive A3',
      queenAge: 1,
      lastInspection: '2023-08-12',
      health: 'Fair',
      temperature: 36,
      humidity: 62,
      weight: 27,
      imageUrl: '/placeholder.svg'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={apiary.name} />
        <main className="flex-1 overflow-y-auto p-6">
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
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/apiaries/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{apiary.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/40 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Hives</p>
                      <p className="text-2xl font-bold">{hives.length}</p>
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
                  <p className="text-sm text-muted-foreground mt-2">Coordinates: {apiary.coordinates}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Hives Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hives in this Apiary</h2>
                <Button asChild>
                  <Link to={`/apiaries/${id}/hives/new`}>
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Hive
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hives.map((hive) => (
                  <HiveCard
                    key={hive.id}
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
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiaryDetail;
