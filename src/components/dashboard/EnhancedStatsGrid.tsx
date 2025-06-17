
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar, Truck, Gauge, Map } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  icon: string;
}

interface EnhancedStatsGridProps {
  stats: Stat[];
}

const getIcon = (iconName: string, size = 20) => {
  const iconProps = { size, className: 'text-gray-600' };
  
  switch (iconName) {
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'truck':
      return <Truck {...iconProps} />;
    case 'gauge':
      return <Gauge {...iconProps} />;
    case 'map':
      return <Map {...iconProps} />;
    default:
      return <Calendar {...iconProps} />;
  }
};

const getTrendIcon = (trend: string, color: string) => {
  const iconProps = { size: 16, className: color };
  
  switch (trend) {
    case 'up':
      return <TrendingUp {...iconProps} />;
    case 'down':
      return <TrendingDown {...iconProps} />;
    default:
      return <Minus {...iconProps} />;
  }
};

const EnhancedStatsGrid: React.FC<EnhancedStatsGridProps> = ({ stats }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className={`${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            } font-medium text-gray-600 leading-tight line-clamp-2`}>
              {stat.title}
            </CardTitle>
            {getIcon(stat.icon, isMobile ? 16 : 20)}
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-2' : 'p-3 sm:p-6'} pt-0`}>
            <div className={`${
              isMobile ? 'text-lg' : 'text-xl sm:text-2xl'
            } font-bold text-gray-900 truncate mb-1`}>
              {stat.value}
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(stat.trend, stat.color)}
              <p className={`${stat.color} font-medium ${
                isMobile ? 'text-xs' : 'text-xs'
              } truncate`}>
                {stat.change}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStatsGrid;
