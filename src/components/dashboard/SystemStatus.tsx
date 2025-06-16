
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemStatusProps {
  totalUsers: number;
  activeVans: number;
  totalCompanies: number;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  totalUsers,
  activeVans,
  totalCompanies
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">État du Système</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="font-medium text-gray-900 text-sm sm:text-base">Base de Données</span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="text-green-700 text-sm sm:text-base">Connectée</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                {totalUsers} utilisateurs, {activeVans} camionnettes, {totalCompanies} entreprises
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">Système opérationnel</div>
          </div>
          
          {totalUsers === 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="font-medium text-yellow-900 text-sm sm:text-base">Configuration Requise</span>
                </div>
                <div className="text-xs sm:text-sm text-yellow-700 mt-1">
                  Ajoutez des utilisateurs et des camionnettes pour commencer
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
