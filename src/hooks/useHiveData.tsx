
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHiveData = (id: string | undefined) => {
  const navigate = useNavigate();
  const [hive, setHive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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

  return { hive, loading, timeSeriesData };
};
