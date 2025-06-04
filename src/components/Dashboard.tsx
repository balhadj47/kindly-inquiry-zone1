
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data - in a real app, this would come from your backend
  const dailyTrips = [
    { date: 'Mon', trips: 45 },
    { date: 'Tue', trips: 52 },
    { date: 'Wed', trips: 38 },
    { date: 'Thu', trips: 61 },
    { date: 'Fri', trips: 55 },
    { date: 'Sat', trips: 28 },
    { date: 'Sun', trips: 15 },
  ];

  const topBranches = [
    { name: 'Downtown Branch', visits: 125, color: '#3B82F6' },
    { name: 'Industrial Park', visits: 98, color: '#10B981' },
    { name: 'North Branch', visits: 87, color: '#F59E0B' },
    { name: 'South Branch', visits: 65, color: '#EF4444' },
  ];

  const stats = [
    { title: 'Total Trips Today', value: '47', change: '+12%', color: 'text-green-600' },
    { title: 'Active Vans', value: '23', change: '+2', color: 'text-blue-600' },
    { title: 'Companies Served', value: '15', change: '0', color: 'text-gray-600' },
    { title: 'Total Branches', value: '68', change: '+3', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Welcome back! Here's your fleet overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className={`text-xs ${stat.color} font-medium mt-1`}>
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Trips Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Daily Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyTrips} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                <Bar dataKey="trips" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Branches Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Most Visited Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topBranches}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visits"
                >
                  {topBranches.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Recent Trip Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[
              { van: 'VAN-001', driver: 'John Smith', branch: 'Downtown Branch', company: 'ABC Corp', time: '10 mins ago' },
              { van: 'VAN-005', driver: 'Sarah Johnson', branch: 'Industrial Park', company: 'XYZ Ltd', time: '25 mins ago' },
              { van: 'VAN-003', driver: 'Mike Wilson', branch: 'North Branch', company: 'DEF Inc', time: '1 hour ago' },
            ].map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{activity.van}</span>
                    <span className="text-gray-500 hidden sm:inline">•</span>
                    <span className="text-gray-700 text-sm sm:text-base">{activity.driver}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Visited <span className="font-medium">{activity.branch}</span> ({activity.company})
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
