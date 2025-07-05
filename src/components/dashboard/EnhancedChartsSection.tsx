
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartData {
  dailyTrips: Array<{
    date: string;
    trips: number;
    completed: number;
    active: number;
  }>;
  topBranches: Array<{
    name: string;
    visits: number;
    color: string;
  }>;
  vanUtilization: Array<{
    van: string;
    trips: number;
  }>;
}

interface EnhancedChartsSectionProps {
  chartData: ChartData;
}

const EnhancedChartsSection: React.FC<EnhancedChartsSectionProps> = ({ chartData }) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Voyages de la Semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <BarChart data={chartData.dailyTrips}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="trips" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Total"
              />
              <Bar 
                dataKey="completed" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name="Terminés"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={chartData.topBranches}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 40 : 60}
                outerRadius={isMobile ? 80 : 100}
                paddingAngle={5}
                dataKey="visits"
              >
                {chartData.topBranches.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {chartData.topBranches.slice(0, 3).map((branch, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: branch.color }}
                  ></div>
                  <span className="text-gray-700 truncate">{branch.name}</span>
                </div>
                <span className="font-medium text-gray-900">{branch.visits}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {chartData.vanUtilization.length > 0 && (
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Utilisation des Camionnettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={chartData.vanUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="van" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="trips" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                  name="Voyages"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedChartsSection;
