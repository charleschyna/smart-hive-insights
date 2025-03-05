
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HiveImageProps {
  imageUrl: string;
  name: string;
  beeType: string;
}

const HiveImage: React.FC<HiveImageProps> = ({ imageUrl, name, beeType }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hive Image</h2>
        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">Bee Type: {beeType}</p>
      </CardContent>
    </Card>
  );
};

export default HiveImage;
