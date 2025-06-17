
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
  const iconProps = { size, className: 'text-white' };
  
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
  const iconProps = { size: 14, className: color };
  
  switch (trend) {
    case 'up':
      return <TrendingUp {...iconProps} />;
    case 'down':
      return <TrendingDown {...iconProps} />;
    default:
      return <Minus {...iconProps} />;
  }
};

const getGradientClasses = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600', 
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
  ];
  return gradients[index] || gradients[0];
};

const EnhancedStatsGrid: React.FC<EnhancedStatsGridProps> = ({ stats }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      isMobile 
        ? 'grid-cols-1 sm:grid-cols-2' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden bg-white">
          <div className={`${getGradientClasses(index)} p-4 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {getIcon(stat.icon, isMobile ? 18 : 22)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl sm:text-3xl font-bold text-white mb-1`}>
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-700 leading-tight">
                {stat.title}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {getTrendIcon(stat.trend, stat.color)}
                <span className={`${stat.color} font-medium text-xs`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStatsGrid;
