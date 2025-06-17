
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ChartData {
  dailyTrips: Array<{ date: string; trips: number; completed: number; active: number }>;
  topBranches: Array<{ name: string; visits: number; color: string }>;
  vanUtilization: Array<{ van: string; trips: number }>;
}

interface EnhancedChartsSectionProps {
  chartData: ChartData;
}

const EnhancedChartsSection: React.FC<EnhancedChartsSectionProps> = ({ chartData }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {/* Enhanced Daily Trips Chart */}
      <Card className="hover:shadow-lg transition-shadow xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            Activité des Voyages - 7 Derniers Jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.dailyTrips} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }} 
              />
              <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="Terminés" />
              <Bar dataKey="active" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Actifs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Companies Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            Entreprises Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.topBranches}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="visits"
              >
                {chartData.topBranches.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Van Utilization Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            Utilisation des Camionnettes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.vanUtilization} layout="horizontal" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="van" type="category" stroke="#6b7280" fontSize={12} width={60} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }} 
              />
              <Bar dataKey="trips" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChartsSection;
