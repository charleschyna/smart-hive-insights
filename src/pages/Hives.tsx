
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search,
  Filter, 
  ArrowUpDown, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import HiveCard from '@/components/hive/HiveCard';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Hives = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApiary, setFilterApiary] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        setIsLoading(true);
        
        // Fetch apiaries for filtering
        const { data: apiariesData, error: apiariesError } = await supabase
          .from('apiaries')
          .select('id, name')
          .eq('user_id', user.id);
        
        if (apiariesError) {
          console.error('Error fetching apiaries:', apiariesError);
        } else {
          setApiaries(apiariesData || []);
        }
        
        // Fetch all hives with their related apiary info
        const { data: hivesData, error: hivesError } = await supabase
          .from('hives')
          .select(`
            *,
            apiary:apiary_id (
              id,
              name
            )
          `)
          .eq('user_id', user.id);
        
        if (hivesError) {
          console.error('Error fetching hives:', hivesError);
        } else {
          setHives(hivesData || []);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Subscribe to changes
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
          fetchData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter and sort hives
  const filteredHives = hives.filter(hive => {
    const matchesSearch = hive.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApiary = !filterApiary || hive.apiary_id === filterApiary;
    return matchesSearch && matchesApiary;
  });
  
  const sortedHives = [...filteredHives].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'apiary':
        valueA = a.apiary?.name || '';
        valueB = b.apiary?.name || '';
        break;
      case 'lastInspection':
        valueA = a.last_inspection ? new Date(a.last_inspection).getTime() : 0;
        valueB = b.last_inspection ? new Date(b.last_inspection).getTime() : 0;
        break;
      default:
        valueA = a.name;
        valueB = b.name;
    }
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

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
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hives..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={filterApiary || ''}
            onValueChange={(value) => setFilterApiary(value || null)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by apiary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Apiaries</SelectItem>
              {apiaries.map((apiary) => (
                <SelectItem key={apiary.id} value={apiary.id}>
                  {apiary.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === 'name'}
                onCheckedChange={() => setSortBy('name')}
              >
                Hive Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'apiary'}
                onCheckedChange={() => setSortBy('apiary')}
              >
                Apiary
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'lastInspection'}
                onCheckedChange={() => setSortBy('lastInspection')}
              >
                Last Inspection Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOrder === 'asc'}
                onCheckedChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Ascending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-honey-500" />
          </div>
        ) : sortedHives.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No hives found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterApiary
                ? "Try adjusting your search or filters"
                : "Add your first hive to start tracking your bees"}
            </p>
            
            {!searchQuery && !filterApiary && (
              <Button asChild size="sm">
                <Link to="/hives/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Hive
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHives.map((hive) => (
              <HiveCard 
                key={hive.id}
                id={hive.id}
                name={hive.name}
                status={hive.status}
                queenColor={hive.queen_color}
                lastInspection={hive.last_inspection}
                apiaryName={hive.apiary?.name}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Hives;
