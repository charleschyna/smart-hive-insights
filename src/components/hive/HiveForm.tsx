
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HiveFormData {
  name: string;
  apiaryId: string;
  queenOrigin: string;
  installationDate: string;
  notes: string;
}

interface ApiaryOption {
  id: string;
  name: string;
}

interface HiveFormProps {
  apiaries: ApiaryOption[];
  initialData?: Partial<HiveFormData>;
  isEditing?: boolean;
}

const HiveForm = ({ apiaries, initialData, isEditing = false }: HiveFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<HiveFormData>({
    name: initialData?.name || '',
    apiaryId: initialData?.apiaryId || '',
    queenOrigin: initialData?.queenOrigin || '',
    installationDate: initialData?.installationDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
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
  
  const handleSelectChange = (name: keyof HiveFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user makes a selection
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
      newErrors.name = 'Hive name is required';
    }
    
    if (!formData.apiaryId) {
      newErrors.apiaryId = 'Please select an apiary';
    }
    
    if (!formData.installationDate) {
      newErrors.installationDate = 'Installation date is required';
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
        title: isEditing ? "Hive updated" : "Hive created",
        description: isEditing 
          ? `Successfully updated ${formData.name}`
          : `Successfully created ${formData.name}`,
      });
      
      // Navigate back to hives list
      navigate('/hives');
    }, 1500);
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
        <Label htmlFor="name">Hive Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Hive #1"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="apiaryId">Apiary</Label>
        <Select
          value={formData.apiaryId}
          onValueChange={(value) => handleSelectChange('apiaryId', value)}
        >
          <SelectTrigger className={errors.apiaryId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select an apiary" />
          </SelectTrigger>
          <SelectContent>
            {apiaries.map((apiary) => (
              <SelectItem key={apiary.id} value={apiary.id}>
                {apiary.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.apiaryId && (
          <p className="text-red-500 text-xs mt-1">{errors.apiaryId}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="queenOrigin">Queen Origin</Label>
          <Input
            id="queenOrigin"
            name="queenOrigin"
            placeholder="e.g., Buckfast"
            value={formData.queenOrigin}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="installationDate">Installation Date</Label>
          <Input
            id="installationDate"
            name="installationDate"
            type="date"
            value={formData.installationDate}
            onChange={handleChange}
            className={errors.installationDate ? 'border-red-500' : ''}
          />
          {errors.installationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.installationDate}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add notes about this hive..."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/hives')}
        >
          Cancel
        </Button>
        
        <Button 
          type="submit"
          className="bg-honey-500 hover:bg-honey-600 text-black"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Hive' : 'Create Hive'}
        </Button>
      </div>
    </motion.form>
  );
};

export default HiveForm;
