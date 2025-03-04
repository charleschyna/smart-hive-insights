
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ApiaryFormData {
  name: string;
  location: string;
  description: string;
  latitude: string;
  longitude: string;
}

interface ApiaryFormProps {
  initialData?: Partial<ApiaryFormData>;
  isEditing?: boolean;
}

const ApiaryForm = ({ initialData, isEditing = false }: ApiaryFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ApiaryFormData>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Apiary name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.latitude && isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Latitude must be a number';
    }
    
    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Longitude must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: isEditing ? "Apiary updated" : "Apiary created",
        description: isEditing 
          ? `Successfully updated ${formData.name}`
          : `Successfully created ${formData.name}`,
      });
      
      // Navigate back to apiaries list
      navigate('/apiaries');
    }, 1500);
  };
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          
          toast({
            title: "Location detected",
            description: "Your current coordinates have been added to the form.",
          });
        },
        () => {
          toast({
            title: "Location error",
            description: "Unable to retrieve your location. Please enter coordinates manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter coordinates manually.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <Label htmlFor="name">Apiary Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Home Apiary"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="123 Bee Street, Honeyton"
          value={formData.location}
          onChange={handleChange}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            placeholder="41.40338"
            value={formData.latitude}
            onChange={handleChange}
            className={errors.latitude ? 'border-red-500' : ''}
          />
          {errors.latitude && (
            <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            placeholder="2.17403"
            value={formData.longitude}
            onChange={handleChange}
            className={errors.longitude ? 'border-red-500' : ''}
          />
          {errors.longitude && (
            <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
          )}
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={getCurrentLocation}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Use Current Location
      </Button>
      
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add notes about this apiary..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/apiaries')}
        >
          Cancel
        </Button>
        
        <Button 
          type="submit"
          className="bg-honey-500 hover:bg-honey-600 text-black"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Apiary' : 'Create Apiary'}
        </Button>
      </div>
    </motion.form>
  );
};

export default ApiaryForm;
