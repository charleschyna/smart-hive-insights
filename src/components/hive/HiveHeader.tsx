
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

interface HiveHeaderProps {
  name: string;
  apiaryId?: string;
  apiaryName?: string;
  lastInspection: string;
  id: string;
}

const HiveHeader: React.FC<HiveHeaderProps> = ({
  name,
  apiaryId,
  apiaryName,
  lastInspection,
  id
}) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="sm" className="mr-4">
          <Link to="/hives">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Hives
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{name}</h1>
          <div className="flex items-center text-muted-foreground mb-1">
            <Link to={`/apiaries/${apiaryId}`} className="hover:text-honey-600">
              {apiaryName || 'Unknown Apiary'}
            </Link>
          </div>
          <div className="flex items-center text-muted-foreground">
            <span>Last Inspection: {new Date(lastInspection).toLocaleDateString()}</span>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to={`/hives/${id}/edit`}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Link>
        </Button>
      </div>
    </>
  );
};

export default HiveHeader;
