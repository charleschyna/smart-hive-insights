
import React from 'react';
import { Crown, Calendar } from 'lucide-react';

interface HiveInfoProps {
  queenAge: number;
  queenColor: string;
  queenInstalled: string;
  health: string;
  notes?: string;
}

const HiveInfo: React.FC<HiveInfoProps> = ({
  queenAge,
  queenColor,
  queenInstalled,
  health,
  notes
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Queen Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center">
            <Crown className="h-4 w-4 mr-1 text-honey-500" />
            <p className="text-sm">Age: {queenAge} year{queenAge > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
            <p className="text-sm">Color: {queenColor}</p>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <p className="text-sm">Installed: {new Date(queenInstalled).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Health Status</h3>
        <p className="text-sm">{health}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
        <p className="text-sm">{notes || 'No notes available'}</p>
      </div>
    </div>
  );
};

export default HiveInfo;
