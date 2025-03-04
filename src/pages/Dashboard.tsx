import React, { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import HiveOverview from '@/components/dashboard/HiveOverview';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, ListPlus, ThermometerSun, Droplets, ArrowUpRight, Scale } from 'lucide-react';

const Dashboard = () => {
  useEffect(() => {
    // Log to console to help identify the issue
    console.log("Dashboard component mounted");
  }, []);

  // Mock data - In a real app, this would come from an API
  const stats = [
    { 
      title: 'Total Apiaries', 
      value: '5', 
      change: '+2', 
      icon: <ListPlus className="h-5 w-5" />,
      linkTo: '/apiaries'
    },
    { 
      title: 'Total Hives', 
      value: '24', 
      change: '+4', 
      icon: <BarChart3 className="h-5 w-5" />,
      linkTo: '/hives'
    },
    { 
      title: 'Average Temp.', 
      value: '35°C', 
      change: '0.8°C', 
      icon: <ThermometerSun className="h-5 w-5" />,
      linkTo: '/metrics'
    },
    { 
      title: 'Average Humidity', 
      value: '65%', 
      change: '-2%', 
      icon: <Droplets className="h-5 w-5" />,
      linkTo: '/metrics'
    },
    { 
      title: 'Average Weight', 
      value: '28kg', 
      change: '+3kg', 
      icon: <Scale className="h-5 w-5" />,
      linkTo: '/metrics'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Hive Dashboard</h1>
              <div className="flex space-x-4">
                <Button asChild variant="outline">
                  <Link to="/apiaries/new">Add Apiary</Link>
                </Button>
                <Button asChild>
                  <Link to="/hives/new">Add Hive</Link>
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  linkTo={stat.linkTo}
                />
              ))}
            </div>

            {/* Hive Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-sidebar rounded-xl shadow-glass p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">Hive {item} Temperature Alert</p>
                        <p className="text-sm text-muted-foreground mt-1">Temperature exceeded threshold (38°C)</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item} hour{item > 1 ? 's' : ''} ago</p>
                    </div>
                  ))}
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

            {/* Hive Overview Cards */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Hive Overview</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/hives">See All Hives</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((hive) => (
                  <HiveOverview 
                    key={hive}
                    hiveId={`H-${hive}00${hive}`}
                    name={`Hive ${hive}`}
                    location={`Apiary ${hive}`}
                    temperature={35 + hive}
                    humidity={60 + hive}
                    weight={25 + hive}
                    activity="Normal"
                    lastUpdated={new Date().toISOString()}
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

export default Dashboard;
