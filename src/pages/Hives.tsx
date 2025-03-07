import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PlusCircle, Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import HiveCard from '@/components/hive/HiveCard';
import PageTransition from '@/components/layout/PageTransition';

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApiary, setSelectedApiary] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchHivesAndApiaries = async () => {
      try {
        if (!user) return;
        
        // Fetch all hives
        const { data: hivesData, error: hivesError } = await supabase
          .from('hives')
          .select(`
            *,
            apiaries (
              id,
              name
            )
          `)
          .eq('user_id', user.id);
        
        if (hivesError) {
          console.error('Error fetching hives:', hivesError);
          return;
        }
        
        // Fetch all apiaries for the filter dropdown
        const { data: apiariesData, error: apiariesError } = await supabase
          .from('apiaries')
          .select('id, name')
          .eq('user_id', user.id);
        
        if (apiariesError) {
          console.error('Error fetching apiaries:', apiariesError);
          return;
        }
        
        setHives(hivesData || []);
        setApiaries(apiariesData || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setLoading(false);
      }
    };
    
    fetchHivesAndApiaries();

    // Set up real-time subscription for hives
    const userId = user?.id;
    
    const channel = supabase
      .channel('hives-page-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hives', 
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          fetchHivesAndApiaries();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Filter hives based on search query and selected apiary
  const filteredHives = hives.filter(hive => {
    const matchesSearch = searchQuery === '' || 
      hive.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesApiary = selectedApiary === null || 
      hive.apiary_id === selectedApiary;
    
    return matchesSearch && matchesApiary;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleApiaryChange = (value: string) => {
    setSelectedApiary(value === 'all' ? null : value);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedApiary(null);
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
      <div className="container max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Hives</h1>
          
          <Button asChild>
            <Link to="/hives/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Hive
            </Link>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-sidebar p-6 rounded-xl shadow-glass mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hives..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={selectedApiary || 'all'} onValueChange={handleApiaryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by apiary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Apiaries</SelectLabel>
                    <SelectItem value="all">All Apiaries</SelectItem>
                    {apiaries.map(apiary => (
                      <SelectItem key={apiary.id} value={apiary.id}>
                        {apiary.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {(searchQuery || selectedApiary) && (
              <Button variant="outline" onClick={clearFilters} className="flex-shrink-0">
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {filteredHives.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center">
            {hives.length === 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-2">No hives yet</h2>
                <p className="text-muted-foreground mb-4">Add your first hive to start monitoring</p>
                <Button asChild>
                  <Link to="/hives/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Hive
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">No matching hives</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHives.map((hive) => (
              <HiveCard
                key={hive.id}
                id={hive.id}
                name={hive.name}
                lastInspection={hive.last_inspection}
                apiaryName={hive.apiary?.name || 'Unknown'}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Hives;
