
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveOverview from '@/components/dashboard/HiveOverview';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, ListPlus, ThermometerSun, Droplets, ArrowUpRight, Scale, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [apiaryCount, setApiaryCount] = useState(0);
  const [hiveCount, setHiveCount] = useState(0);
  const [recentHives, setRecentHives] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch apiaries count
        const { count: apiariesCount, error: apiariesError } = await supabase
          .from('apiaries')
          .select('*', { count: 'exact', head: true });
        
        if (apiariesError) {
          console.error('Error fetching apiaries count:', apiariesError);
        } else {
          setApiaryCount(apiariesCount || 0);
        }
        
        // Fetch hives count
        const { count: hivesCount, error: hivesError } = await supabase
          .from('hives')
          .select('*', { count: 'exact', head: true });
        
        if (hivesError) {
          console.error('Error fetching hives count:', hivesError);
        } else {
          setHiveCount(hivesCount || 0);
        }
        
        // Fetch recent hives
        const { data: recentHivesData, error: recentHivesError } = await supabase
          .from('hives')
          .select(`
            *,
            apiaries (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (recentHivesError) {
          console.error('Error fetching recent hives:', recentHivesError);
        } else {
          setRecentHives(recentHivesData || []);
        }
        
        // For now, we'll use mock activity data as there's no activities table yet
        // In a real app, you'd fetch this from a dedicated activities table
        const mockActivities = [
          {
            id: '1',
            description: 'You logged in to the system',
            timestamp: new Date().toISOString(),
            type: 'login'
          },
          {
            id: '2',
            description: 'Dashboard viewed',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            type: 'view'
          }
        ];
        
        setRecentActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up real-time subscriptions for counts
    const apiariesSubscription = supabase
      .channel('dashboard:apiaries')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'apiaries',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // Re-fetch the count when there's a change
        supabase
          .from('apiaries')
          .select('*', { count: 'exact', head: true })
          .then(({ count }) => {
            setApiaryCount(count || 0);
          });
      })
      .subscribe();
      
    const hivesSubscription = supabase
      .channel('dashboard:hives')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'hives',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // Re-fetch the count when there's a change
        supabase
          .from('hives')
          .select('*', { count: 'exact', head: true })
          .then(({ count }) => {
            setHiveCount(count || 0);
          });
        
        // Also re-fetch recent hives
        supabase
          .from('hives')
          .select(`
            *,
            apiaries (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3)
          .then(({ data }) => {
            if (data) setRecentHives(data);
          });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(apiariesSubscription);
      supabase.removeChannel(hivesSubscription);
    };
  }, [navigate, supabase, toast, user]);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Calculate average metrics for all hives
  const averageTemp = recentHives.length 
    ? recentHives.reduce((sum, hive) => sum + (hive.temperature || 0), 0) / recentHives.length 
    : 35;
    
  const averageHumidity = recentHives.length 
    ? recentHives.reduce((sum, hive) => sum + (hive.humidity || 0), 0) / recentHives.length 
    : 65;
    
  const averageWeight = recentHives.length 
    ? recentHives.reduce((sum, hive) => sum + (hive.weight || 0), 0) / recentHives.length 
    : 28;

  const stats = [
    { 
      title: 'Total Apiaries', 
      value: apiaryCount.toString(), 
      change: `+${apiaryCount}`, 
      icon: <ListPlus className="h-5 w-5" />,
      linkTo: '/apiaries',
      color: 'honey' as const
    },
    { 
      title: 'Total Hives', 
      value: hiveCount.toString(), 
      change: `+${hiveCount}`, 
      icon: <BarChart3 className="h-5 w-5" />,
      linkTo: '/hives',
      color: 'forest' as const
    },
    { 
      title: 'Average Temp.', 
      value: `${averageTemp.toFixed(1)}°C`, 
      change: '0.8°C', 
      icon: <ThermometerSun className="h-5 w-5" />,
      linkTo: '/analytics',
      color: 'red' as const
    },
    { 
      title: 'Average Humidity', 
      value: `${averageHumidity.toFixed(1)}%`, 
      change: '-2%', 
      icon: <Droplets className="h-5 w-5" />,
      linkTo: '/analytics',
      color: 'blue' as const
    },
    { 
      title: 'Average Weight', 
      value: `${averageWeight.toFixed(1)}kg`, 
      change: '+3kg', 
      icon: <Scale className="h-5 w-5" />,
      linkTo: '/analytics',
      color: 'purple' as const
    }
  ];

  if (loading && !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-honey-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'} mt-16`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-left">Hive Dashboard</h1>
              <div className="flex space-x-4">
                <Button asChild variant="outline">
                  <Link to="/apiaries/new">Add Apiary</Link>
                </Button>
                <Button asChild>
                  <Link to="/hives/new">Add Hive</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  linkTo={stat.linkTo}
                  color={stat.color}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-sidebar rounded-xl shadow-glass p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-muted-foreground py-6 text-center">No recent activities</p>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{activity.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-sidebar rounded-xl shadow-glass p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Production Overview</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4 mr-1" /> Details
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/40 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">This Month</p>
                    <p className="text-2xl font-bold">124 kg</p>
                    <p className="text-xs text-forest-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Yearly Total</p>
                    <p className="text-2xl font-bold">1,248 kg</p>
                    <p className="text-xs text-forest-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> +23% from last year
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hive Overview</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/hives">See All Hives</Link>
                </Button>
              </div>
              
              {recentHives.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No hives added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first hive to see its overview here</p>
                  <Button asChild size="sm">
                    <Link to="/hives/new">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Hive
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentHives.map((hive) => (
                    <HiveOverview 
                      key={hive.id}
                      hiveId={hive.id}
                      name={hive.name}
                      location={hive.apiaries?.name || 'Unknown Apiary'}
                      temperature={hive.temperature}
                      humidity={hive.humidity}
                      weight={hive.weight}
                      activity={hive.activity}
                      lastUpdated={hive.last_inspection}
                    />
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

export default Dashboard;
