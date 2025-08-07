
import React from 'react';
import { CheckCircle, Car, Users, Building2, Calendar, FileText } from 'lucide-react';
import { TripFormData } from '@/hooks/useTripForm';
import { Badge } from '@/components/ui/badge';
import { useVans } from '@/hooks/useVans';
import { useUsers } from '@/hooks/users';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewStepProps extends TripFormData {
}

const ReviewStep: React.FC<ReviewStepProps> = (props) => {
  const { vans } = useVans();
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const selectedVan = vans.find(van => van.id === props.vanId);
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `Utilisateur ${userId}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Révision</h3>
        <p className="text-gray-600">Vérifiez les détails de la mission avant de la créer</p>
      </div>

      <div className="space-y-4">
        {/* Vehicle Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Véhicule</h4>
          </div>
          {selectedVan ? (
            <div>
              <p className="text-sm text-gray-700">
                <strong>{selectedVan.reference_code || selectedVan.license_plate}</strong> - {selectedVan.model}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Kilométrage de départ: <strong>{props.startKm} km</strong>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun véhicule sélectionné</p>
          )}
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Équipe</h4>
          </div>
          {props.selectedUsersWithRoles.length > 0 ? (
            <div className="space-y-2">
              {props.selectedUsersWithRoles.map((userRole, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{getUserName(userRole.userId)}</span>
                  <div className="flex gap-1">
                    {userRole.roles.map((role, roleIndex) => (
                      <Badge key={roleIndex} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucune équipe sélectionnée</p>
          )}
        </div>

        {/* Companies Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Entreprises</h4>
          </div>
          {props.selectedCompanies.length > 0 ? (
            <div className="space-y-1">
              {props.selectedCompanies.map((company, index) => (
                <p key={index} className="text-sm text-gray-700">
                  <strong>{company.companyName}</strong> - {company.branchName}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucune entreprise sélectionnée</p>
          )}
        </div>

        {/* Details Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-900">Détails</h4>
          </div>
          <div className="space-y-2">
            {props.startDate && (
              <p className="text-sm text-gray-700">
                <strong>Date de début:</strong> {format(props.startDate, 'dd/MM/yyyy HH:mm', { locale: fr })}
              </p>
            )}
            {props.endDate && (
              <p className="text-sm text-gray-700">
                <strong>Date de fin:</strong> {format(props.endDate, 'dd/MM/yyyy HH:mm', { locale: fr })}
              </p>
            )}
            {props.notes && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Notes:</span>
                </div>
                <p className="text-sm text-gray-600 pl-5">{props.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
