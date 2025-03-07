import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import HiveForm from '@/components/forms/HiveForm';

const NewHive = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isLoading, error, data: apiaries } = useQuery({
    queryKey: ['apiaries'],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('apiaries')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching apiaries:", error);
        toast({
          title: "Error",
          description: "Failed to fetch apiaries. Please try again.",
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching apiaries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch apiaries. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleSubmit = async (hiveData: any) => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to create a hive.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hives')
        .insert([
          {
            ...hiveData,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating hive:", error);
        toast({
          title: "Error",
          description: "Failed to create hive. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Hive created successfully!",
      });

      navigate('/hives');
    } catch (err) {
      console.error("Unexpected error creating hive:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Add New Hive</h1>
              <Button asChild variant="outline">
                <Link to="/hives">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Back to Hives
                </Link>
              </Button>
            </div>
            <Separator className="mb-4" />
            {isLoading ? (
              <p>Loading apiaries...</p>
            ) : (
              <HiveForm
                apiaries={apiaries}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewHive;
