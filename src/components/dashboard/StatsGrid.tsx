
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface Stat {
  title: string;
  value: string;
  change: string;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className={`${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            } font-medium text-gray-600 leading-tight line-clamp-2`}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-2' : 'p-3 sm:p-6'} pt-0`}>
            <div className={`${
              isMobile ? 'text-lg' : 'text-xl sm:text-2xl'
            } font-bold text-gray-900 truncate`}>
              {stat.value}
            </div>
            <p className={`${stat.color} font-medium mt-1 ${
              isMobile ? 'text-xs' : 'text-xs'
            } truncate`}>
              Total: {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
