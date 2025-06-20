
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Building2 } from 'lucide-react';

interface QuickStat {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}

interface MissionStatsProps {
  quickStats: QuickStat[];
}

const MissionStats: React.FC<MissionStatsProps> = ({ quickStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickStats.map((stat, index) => (
        <Card key={index} className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionStats;
