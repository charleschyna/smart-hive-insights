
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Grid, List, Loader2, Plus, SquareStack } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HiveCard from '@/components/hive/HiveCard';
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';

const Hives = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hives, setHives] = useState<any[]>([]);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [filteredHives, setFilteredHives] = useState<any[]>([]);
  const [viewType, setViewType] = useState('grid');
  const [selectedApiaryId, setSelectedApiaryId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHives = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('hives')
          .select(`
            *,
            apiary:apiary_id (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching hives:', error);
          toast({
            title: "Error",
            description: "Failed to load hives",
            variant: "destructive",
          });
          return;
        }
        
        setHives(data || []);
        setFilteredHives(data || []);
      } catch (err) {
        console.error('Unexpected error in hives:', err);
      }
    };
    
    const fetchApiaries = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('apiaries')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching apiaries:', error);
          return;
        }
        
        setApiaries(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching apiaries:', err);
        setLoading(false);
      }
    };
    
    fetchHives();
    fetchApiaries();
    
    // Set up subscription for real-time updates
    const hivesChannel = supabase
      .channel('hives-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          fetchHives();
        }
      )
      .subscribe();
      
    const apiariesChannel = supabase
      .channel('apiaries-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'apiaries',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          fetchApiaries();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(hivesChannel);
      supabase.removeChannel(apiariesChannel);
    };
  }, [toast, user]);
  
  useEffect(() => {
    if (selectedApiaryId === 'all') {
      setFilteredHives(hives);
    } else {
      setFilteredHives(hives.filter(hive => hive.apiary_id === selectedApiaryId));
    }
  }, [selectedApiaryId, hives]);
  
  const handleApiaryFilterChange = (value: string) => {
    setSelectedApiaryId(value);
  };
  
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Hives</h1>
            <p className="text-muted-foreground">Manage and monitor all your beehives</p>
          </div>
          <Button asChild>
            <Link to="/hives/new">
              <Plus className="h-4 w-4 mr-2" /> Add New Hive
            </Link>
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters & View Options</CardTitle>
            <CardDescription>Customize how you view your hives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by Apiary</span>
                </div>
                <Select value={selectedApiaryId} onValueChange={handleApiaryFilterChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Apiaries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Apiaries</SelectItem>
                    {apiaries.map(apiary => (
                      <SelectItem key={apiary.id} value={apiary.id}>{apiary.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-1/2">
                <div className="flex items-center space-x-2">
                  <SquareStack className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">View Type</span>
                </div>
                <Tabs value={viewType} onValueChange={setViewType} className="mt-1">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid" className="flex items-center">
                      <Grid className="h-4 w-4 mr-2" /> Grid
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center">
                      <List className="h-4 w-4 mr-2" /> List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{filteredHives.length} Hives {selectedApiaryId !== 'all' && 'in this Apiary'}</h2>
          
          <TabsContent value="grid" className="m-0">
            {filteredHives.length === 0 ? (
              <div className="text-center p-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  {hives.length === 0 
                    ? "You haven't added any hives yet." 
                    : "No hives match your current filter."}
                </p>
                <Button asChild>
                  <Link to="/hives/new">
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Hive
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHives.map((hive) => (
                  <HiveCard key={hive.id} hive={hive} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="m-0">
            {filteredHives.length === 0 ? (
              <div className="text-center p-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  {hives.length === 0 
                    ? "You haven't added any hives yet." 
                    : "No hives match your current filter."}
                </p>
                <Button asChild>
                  <Link to="/hives/new">
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Hive
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHives.map((hive) => (
                  <Card key={hive.id} className="overflow-hidden">
                    <Link to={`/hives/${hive.id}`} className="flex justify-between hover:bg-muted/50 transition-colors">
                      <div className="p-4">
                        <h3 className="font-semibold">{hive.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {hive.apiary?.name || 'No apiary'} · Last inspection: {new Date(hive.last_inspection).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          hive.health === 'Healthy' ? 'bg-green-500' : 
                          hive.health === 'Needs Attention' ? 'bg-yellow-500' : 
                          hive.health === 'Critical' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm">{hive.health || 'Unknown'}</span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </PageTransition>
  );
};

export default Hives;
