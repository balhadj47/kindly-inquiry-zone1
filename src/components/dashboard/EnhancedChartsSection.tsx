
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EnhancedChartsSection: React.FC<EnhancedChartsSectionProps> = ({ chartData }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Enhanced Daily Trips Chart */}
      <Card className="xl:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <span>Activité des Voyages - 7 Derniers Jours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.dailyTrips} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} fontWeight={500} />
              <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" stackId="a" fill="url(#completedGradient)" radius={[0, 0, 0, 0]} name="Terminés" />
              <Bar dataKey="active" stackId="a" fill="url(#activeGradient)" radius={[4, 4, 0, 0]} name="Actifs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Companies Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <span>Entreprises Principales</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData.topBranches}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="visits"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.topBranches.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Van Utilization Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <span>Utilisation des Camionnettes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.vanUtilization} layout="horizontal" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="vanGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} fontWeight={500} />
              <YAxis dataKey="van" type="category" stroke="#64748b" fontSize={11} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="trips" fill="url(#vanGradient)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChartsSection;
